"""Offline contract evaluation. No provider calls or human approvals."""
import copy
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from geoagent_os.drafting import build_request, parse_handoff, resolve_reference, validate_handoff
from geoagent_os.engine import Engine


def fixture_response(request):
    """A synthetic adapter fixture, not a model or a factual-quality evaluator."""
    result = copy.deepcopy(request["output_contract"]["template"])
    result.update(
        status="blocked",
        findings=[{"id": "F1", "kind": "fact", "statement": request["work_order"]["objective"], "source_refs": ["S1:#/objective"]}],
        deliverable={"summary": "Synthetic contract fixture; owner must supply authoritative evidence."},
        blockers=["Authoritative evidence requires human verification"],
    )
    return result


class DraftingTests(unittest.TestCase):
    def setUp(self):
        self.payload = json.loads((Path(__file__).parents[1] / "examples/opportunity.json").read_text())
        self.request = build_request("RFPIntelligenceAgent", self.payload, {})
        self.result = fixture_response(self.request)

    def reject(self):
        with self.assertRaises(ValueError):
            validate_handoff(self.result, self.request)

    def test_valid_cited_handoff(self):
        self.assertEqual(parse_handoff(json.dumps(self.result), self.request), self.result)

    def test_each_business_role_has_specific_instruction(self):
        instructions = [build_request(name, self.payload, {})["instruction"] for name in ("RFPIntelligenceAgent", "ProposalAgent", "ClientOnboardingAgent")]
        self.assertEqual(len(set(instructions)), 3)
        self.assertTrue(all("untrusted data" in text for text in instructions))

    def test_request_snapshots_source(self):
        self.payload["objective"] = "changed"
        self.assertNotEqual(self.payload["objective"], self.request["work_order"]["objective"])

    def test_context_binding(self):
        for key in ("work_id", "objective", "owner_role", "specialist", "contract_version"):
            with self.subTest(key=key):
                result = copy.deepcopy(self.result)
                result[key] = "changed"
                with self.assertRaises(ValueError):
                    validate_handoff(result, self.request)

    def test_handoff_cannot_be_replayed_for_another_role_or_prior_context(self):
        requests = [
            build_request("ProposalAgent", self.payload, {}),
            build_request("RFPIntelligenceAgent", self.payload, {"earlier": {"mode": "template"}}),
        ]
        for request in requests:
            with self.subTest(agent=request["agent"]), self.assertRaises(ValueError):
                validate_handoff(self.result, request)

    def test_changed_source_manifest(self):
        self.result["sources"][0]["verification"] = "verified_in_run"
        self.reject()

    def test_cannot_remove_review(self):
        self.result["human_review_required"] = False
        self.reject()

    def test_missing_fields(self):
        del self.result["limitations"]
        self.reject()

    def test_additional_action_field(self):
        self.result["execute"] = "send-email"
        self.reject()

    def test_unknown_source(self):
        self.result["findings"][0]["source_refs"] = ["S3:#/objective"]
        self.reject()

    def test_unresolved_path(self):
        self.result["findings"][0]["source_refs"] = ["S1:#/data/absent"]
        self.reject()

    def test_fact_requires_reference(self):
        self.result["findings"][0]["source_refs"] = []
        self.reject()

    def test_duplicate_finding_ids(self):
        self.result["findings"].append(copy.deepcopy(self.result["findings"][0]))
        self.reject()

    def test_pointer_escaping_and_array_bounds(self):
        request = build_request("ProposalAgent", self.payload, {"a/b": {"~": ["evidence"]}})
        self.assertEqual(resolve_reference("S2:#/a~1b/~0/0", request), "evidence")
        for ref in ("S2:#/a~1b/~0/1", "S2:#/a~1b/~0/00", "S2:#/a~2b", "S2:#/a~1b/~0/-1"):
            with self.subTest(ref=ref), self.assertRaises(ValueError):
                resolve_reference(ref, request)

    def test_check_evidence_required(self):
        self.result["checks"] = [{"criterion": "verified", "outcome": "passed", "evidence_refs": [], "rationale": "Evidence missing"}]
        self.reject()

    def test_blocker_prevents_ready(self):
        self.result["status"] = "ready_for_human_review"
        self.reject()

    def test_unrun_check_prevents_ready(self):
        self.result.update(status="ready_for_human_review", blockers=[], checks=[{"criterion": "deadline", "outcome": "not_run", "evidence_refs": [], "rationale": "Not verified"}])
        self.reject()

    def test_failed_check_requires_blocked(self):
        self.result.update(status="draft", blockers=[], checks=[{"criterion": "deadline", "outcome": "failed", "evidence_refs": ["S1:#/data/deadline"], "rationale": "Unverified text"}])
        self.reject()

    def test_nonfinite_and_duplicate_json_rejected(self):
        self.result["deliverable"]["value"] = float("nan")
        with self.assertRaises(ValueError):
            parse_handoff(json.dumps(self.result), self.request)
        with self.assertRaises(ValueError):
            parse_handoff('{"status":"draft","status":"approved"}', self.request)

    def test_invalid_adapter_result_fails_without_reviewable_output(self):
        with tempfile.TemporaryDirectory() as tmp:
            engine = Engine(Path(tmp) / "ops.sqlite")
            try:
                job_id = engine.create(self.payload)
                with patch.dict("os.environ", {"GEOAGENT_AI_COMMAND": '["fixture"]'}), patch("geoagent_os.agents.subprocess.run", return_value=subprocess.CompletedProcess([], 0, stdout='{"text":"unsupported"}')):
                    with self.assertRaises(ValueError):
                        engine.run(job_id, ai=True)
                self.assertEqual(engine.get(job_id)["status"], "failed")
                self.assertIsNone(engine.get(job_id)["result"])
            finally:
                engine.db.close()

    def test_real_local_adapter_roundtrip_still_blocks_export(self):
        with tempfile.TemporaryDirectory() as tmp:
            adapter = Path(tmp) / "fixture.py"
            adapter.write_text('import json,sys\nr=json.load(sys.stdin)\no=r["output_contract"]["template"]\no.update(status="blocked", findings=[{"id":"F1","kind":"fact","statement":r["work_order"]["objective"],"source_refs":["S1:#/objective"]}], blockers=["Human evidence verification required"], deliverable={"summary":"Synthetic adapter fixture only"})\nprint(json.dumps(o))\n')
            engine = Engine(Path(tmp) / "ops.sqlite")
            try:
                with patch.dict("os.environ", {"GEOAGENT_AI_COMMAND": json.dumps([sys.executable, str(adapter)])}):
                    job = engine.run(engine.create(self.payload), ai=True)
                self.assertEqual(job["status"], "awaiting_review")
                self.assertEqual(job["result"]["ProposalAgent"]["draft"]["status"], "blocked")
                self.assertEqual(job["result"]["ProposalAgent"]["prompt_version"], "etl-gis-drafting-1.0")
                with self.assertRaises(ValueError):
                    engine.export(job["id"], Path(tmp) / "unapproved.json")
            finally:
                engine.db.close()
