import copy
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from types import SimpleNamespace
from geoagent_os.engine import Engine
from geoagent_os.agents import spatial_qa, address_validation
from geoagent_os.dashboard import render


class OperationsTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.engine = Engine(Path(self.temp.name) / "ops.sqlite")
        self.payload = json.loads((Path(__file__).parents[1] / "examples/spatial-qa.json").read_text())

    def tearDown(self):
        self.engine.db.close()
        self.temp.cleanup()

    def job(self):
        return self.engine.run(self.engine.create(self.payload))

    def test_human_review_is_required_for_export(self):
        job = self.job()
        path = Path(self.temp.name) / "approved.json"
        with self.assertRaises(ValueError):
            self.engine.export(job["id"], path)
        self.engine.review(job["id"], "Paul Iyogun", "approved", job["result_hash"], "Reviewed findings; release screening report")
        self.engine.export(job["id"], path)
        self.assertEqual(json.loads(path.read_text())["status"], "approved")
        self.assertIn("exported", [e["action"] for e in self.engine.events()])

    def test_wrong_owner_and_stale_hash_fail(self):
        job = self.job()
        for owner, hash_value in [("Unknown", job["result_hash"]), ("Paul Iyogun", "stale")]:
            with self.assertRaises(ValueError):
                self.engine.review(job["id"], owner, "approved", hash_value, "Review")
        self.assertEqual(self.engine.get(job["id"])["status"], "awaiting_review")

    def test_tampering_blocks_export(self):
        job = self.job()
        self.engine.review(job["id"], "Paul Iyogun", "approved", job["result_hash"], "Review")
        with self.engine.db:
            self.engine.db.execute("UPDATE jobs SET result='{}' WHERE id=?", (job["id"],))
        with self.assertRaises(ValueError):
            self.engine.export(job["id"], Path(self.temp.name) / "tampered.json")

    def test_rejected_jobs_cannot_export_or_rerun(self):
        job = self.job()
        self.engine.review(job["id"], "Paul Iyogun", "rejected", job["result_hash"], "Correct missing address")
        with self.assertRaises(ValueError):
            self.engine.export(job["id"], Path(self.temp.name) / "rejected.json")
        with self.assertRaises(ValueError):
            self.engine.run(job["id"])

    def test_shared_coords_are_not_duplicate_units(self):
        self.assertEqual([i["code"] for i in spatial_qa(self.payload["data"])["issues"]], ["SHARED_COORDINATES", "OUT_OF_RANGE"])
        self.assertEqual([i["code"] for i in address_validation(self.payload["data"])["issues"]], ["MISSING_ADDRESS"])
        features = self.payload["data"]["geojson"]["features"]
        features.append(copy.deepcopy(features[0]))
        self.assertIn("DUPLICATE_ADDRESS", [i["code"] for i in address_validation(self.payload["data"])["issues"]])

    def test_invalid_geometry_and_nonfinite_values(self):
        for coords in ([True, 27], [float("nan"), 27], ["80", 27], None):
            self.payload["data"]["geojson"]["features"][0]["geometry"]["coordinates"] = coords
            self.assertEqual(spatial_qa(self.payload["data"])["issues"][0]["code"], "INVALID_COORDINATES")
        self.payload["data"]["geojson"]["features"][0]["geometry"] = {"type": "Polygon"}
        self.assertEqual(spatial_qa(self.payload["data"])["issues"][0]["code"], "UNSUPPORTED_GEOMETRY")

    def test_sensitive_classification_rejected(self):
        self.payload["classification"] = "confidential"
        with self.assertRaises(ValueError):
            self.engine.create(self.payload)

    def test_failure_never_creates_reviewable_results(self):
        job_id = self.engine.create(self.payload)
        with patch("geoagent_os.engine.run_agent", side_effect=RuntimeError("provider secret")):
            with self.assertRaisesRegex(ValueError, "Agent execution failed"):
                self.engine.run(job_id)
        self.assertEqual(self.engine.get(job_id)["status"], "failed")
        self.assertNotIn("provider secret", str(self.engine.events()))

    def test_dashboard_escapes_user_content(self):
        self.payload["objective"] = '<script>alert("x")</script>'
        self.job()
        path = Path(self.temp.name) / "dash.html"
        render(self.engine, path)
        self.assertNotIn('<script>', path.read_text())
        self.assertIn('&lt;script&gt;', path.read_text())

    def test_all_workflows_run_with_explicit_template_mode(self):
        for name in ("opportunity", "onboarding"):
            payload = json.loads((Path(__file__).parents[1] / f"examples/{name}.json").read_text())
            job = self.engine.run(self.engine.create(payload))
            self.assertEqual(job["status"], "awaiting_review")
            self.assertIn("template", [r["mode"] for r in job["result"].values()])

    def test_ai_provider_is_opt_in_and_missing_adapter_fails_closed(self):
        payload = json.loads((Path(__file__).parents[1] / "examples/opportunity.json").read_text())
        with patch.dict("os.environ", {"GEOAGENT_AI_COMMAND": "[]"}):
            job_id = self.engine.create(payload)
            with self.assertRaises(ValueError):
                self.engine.run(job_id, ai=True)
        self.assertEqual(self.engine.get(job_id)["status"], "failed")

    def test_configured_ai_adapter_returns_reviewable_drafts(self):
        payload = json.loads((Path(__file__).parents[1] / "examples/opportunity.json").read_text())
        with patch.dict("os.environ", {"GEOAGENT_AI_COMMAND": '["trusted-adapter"]'}), patch("geoagent_os.agents.subprocess.run", return_value=SimpleNamespace(stdout='{"text":"Draft for review"}')) as provider:
            job = self.engine.run(self.engine.create(payload), ai=True)
        self.assertEqual(job["status"], "awaiting_review")
        self.assertEqual(job["result"]["ProposalAgent"]["mode"], "ai_draft")
        self.assertEqual(provider.call_count, 2)
        self.assertFalse(provider.call_args.kwargs["shell"])


if __name__ == "__main__":
    unittest.main()
