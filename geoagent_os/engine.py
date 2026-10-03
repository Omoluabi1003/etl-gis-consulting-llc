"""SQLite work orders, transaction-safe state changes, and audit records."""
import hashlib
import json
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path
from .agents import REGISTRY, WORKFLOWS, run_agent, validate


def encoded(value):
    return json.dumps(value, sort_keys=True, ensure_ascii=True, allow_nan=False)


def digest(value):
    return hashlib.sha256(encoded(value).encode()).hexdigest()


class Engine:
    def __init__(self, path):
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        self.db = sqlite3.connect(path, timeout=10)
        self.db.row_factory = sqlite3.Row
        self.db.executescript('''
          CREATE TABLE IF NOT EXISTS jobs (
            id TEXT PRIMARY KEY, payload TEXT NOT NULL, status TEXT NOT NULL,
            result TEXT, result_hash TEXT, reviewer TEXT, note TEXT);
          CREATE TABLE IF NOT EXISTS events (
            seq INTEGER PRIMARY KEY, job_id TEXT NOT NULL, at TEXT NOT NULL,
            actor TEXT NOT NULL, action TEXT NOT NULL, detail TEXT NOT NULL);
        ''')

    def event(self, job_id, actor, action, detail):
        self.db.execute("INSERT INTO events(job_id,at,actor,action,detail) VALUES(?,?,?,?,?)", (job_id, datetime.now(timezone.utc).isoformat(), actor, action, encoded(detail)))

    def create(self, payload):
        validate(payload)
        text = encoded(payload)
        if len(text) > 2_000_000:
            raise ValueError("Work order exceeds 2 MB pilot limit")
        job_id = uuid.uuid4().hex
        with self.db:
            self.db.execute("INSERT INTO jobs(id,payload,status) VALUES(?,?,?)", (job_id, text, "queued"))
            self.event(job_id, payload["owner"], "created", {"workflow": payload["workflow"]})
        return job_id

    def get(self, job_id):
        row = self.db.execute("SELECT * FROM jobs WHERE id=?", (job_id,)).fetchone()
        if row is None:
            raise ValueError("Unknown work order")
        result = dict(row)
        result["payload"] = json.loads(result["payload"])
        result["result"] = json.loads(result["result"]) if result["result"] else None
        return result

    def run(self, job_id, ai=False):
        with self.db:
            changed = self.db.execute("UPDATE jobs SET status='running' WHERE id=? AND status='queued'", (job_id,)).rowcount
            if not changed:
                raise ValueError("Only queued work orders can run")
            self.event(job_id, "orchestrator", "started", {"ai_enabled": ai})
        payload = self.get(job_id)["payload"]
        results = {}
        try:
            for name in WORKFLOWS[payload["workflow"]]:
                results[name] = run_agent(name, payload, results, ai)
                with self.db:
                    self.event(job_id, name, "agent_completed", {"mode": results[name]["mode"], "owner_role": REGISTRY[name]["owner_role"]})
            with self.db:
                self.db.execute("UPDATE jobs SET status='awaiting_review',result=?,result_hash=? WHERE id=?", (encoded(results), digest(results), job_id))
                self.event(job_id, "orchestrator", "review_requested", {"result_hash": digest(results)})
        except Exception:
            with self.db:
                self.db.execute("UPDATE jobs SET status='failed' WHERE id=?", (job_id,))
                self.event(job_id, "orchestrator", "failed", {"detail": "Agent execution failed; inspect local adapter configuration"})
            raise ValueError("Agent execution failed; review local configuration") from None
        return self.get(job_id)

    def review(self, job_id, reviewer, decision, result_hash, note):
        if decision not in ("approved", "rejected"):
            raise ValueError("Decision must be approved or rejected")
        if not reviewer.strip() or not note.strip():
            raise ValueError("Reviewer and review note are required")
        with self.db:
            self.db.execute("BEGIN IMMEDIATE")
            job = self.get(job_id)
            if job["status"] != "awaiting_review":
                raise ValueError("Only results awaiting review can be reviewed")
            if reviewer != job["payload"]["owner"]:
                raise ValueError("Reviewer must be the assigned human owner")
            if result_hash != job["result_hash"] or digest(job["result"]) != result_hash:
                raise ValueError("Result changed or review hash is incorrect")
            self.db.execute("UPDATE jobs SET status=?,reviewer=?,note=? WHERE id=?", (decision, reviewer, note, job_id))
            self.event(job_id, reviewer, decision, {"result_hash": result_hash, "note": note})
        return self.get(job_id)

    def export(self, job_id, destination):
        job = self.get(job_id)
        if job["status"] != "approved" or digest(job["result"]) != job["result_hash"]:
            raise ValueError("Only approved, unchanged results can be exported")
        path = Path(destination)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(job, indent=2, allow_nan=False) + "\n")
        with self.db:
            self.event(job_id, job["reviewer"], "exported", {"result_hash": job["result_hash"]})
        return str(path)

    def jobs(self):
        return [self.get(row["id"]) for row in self.db.execute("SELECT id FROM jobs ORDER BY rowid DESC")]

    def events(self):
        return [dict(row) for row in self.db.execute("SELECT * FROM events ORDER BY seq DESC")]
