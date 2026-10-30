"""Offline business deliverables and safe internal review-copy behavior."""
import copy
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from geoagent_os.agents import run_agent, WORKFLOWS
from geoagent_os.drafting import build_request, validate_handoff, resolve_reference
from geoagent_os.engine import Engine
from geoagent_os.packet import render_packet


class DeliverableTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.engine = Engine(Path(self.temp.name) / "ops.sqlite")
        self.destination = Path(self.temp.name) / "review.html"

    def tearDown(self):
        self.engine.db.close()
        self.temp.cleanup()

    def payload(self, workflow):
        return json.loads((Path(__file__).parents[1] / f"examples/{workflow}.json").read_text())

    def run_job(self, workflow="opportunity"):
        return self.engine.run(self.engine.create(self.payload(workflow)))

    def test_templates_use_valid_contracts_and_never_call_adapter(self):
        for workflow in ("opportunity", "onboarding"):
            payload = self.payload(workflow)
            with patch("geoagent_os.agents.subprocess.run", side_effect=AssertionError("Unexpected provider call")):
                job = self.engine.run(self.engine.create(payload))
            prior = {}
            for name in WORKFLOWS[payload["workflow"]]:
                output = job["result"][name]
                if "handoff" in output:
                    validate_handoff(output["handoff"], build_request(name, payload, prior))
                    self.assertEqual(output["mode"], "template")
                prior[name] = output

    def test_requirement_matrix_is_complete_and_citations_resolve(self):
        payload = self.payload("opportunity")
        output = run_agent("RFPIntelligenceAgent", payload, {})
        matrix = output["handoff"]["deliverable"]["requirement_matrix"]
        self.assertEqual([r["requirement"] for r in matrix], payload["data"]["requirements"])
        request = build_request("RFPIntelligenceAgent", payload, {})
        for row in matrix:
            self.assertEqual(resolve_reference(row["source_refs"][0], request), row["requirement"])
            self.assertEqual(row["evidence_status"], "unverified")

    def test_supplied_url_and_deadline_do_not_imply_verification(self):
        payload = self.payload("opportunity")
        payload["data"].update(source_url="https://example.org/rfp", deadline="2030-01-01T12:00:00Z")
        output = run_agent("RFPIntelligenceAgent", payload, {})["handoff"]
        self.assertEqual(output["status"], "blocked")
        self.assertEqual(output["checks"][0]["outcome"], "not_run")
        self.assertEqual(output["deliverable"]["recommendation"], "hold_for_human_qualification")

    def test_malformed_requirements_are_visible_gap(self):
        for requirements in ("not a list", [False], [""]):
            with self.subTest(requirements=requirements):
                payload = self.payload("opportunity")
                payload["data"]["requirements"] = requirements
                output = run_agent("RFPIntelligenceAgent", payload, {})["handoff"]
                self.assertTrue(any("nonempty" in text for text in output["blockers"]))

    def test_proposal_does_not_invent_prices_or_qualifications(self):
        output = self.run_job()["result"]["ProposalAgent"]["handoff"]
        self.assertIn("Human input required", output["deliverable"]["pricing"])
        self.assertIn("Human verification required", output["deliverable"]["qualifications"])

    def test_onboarding_is_not_completed_by_supplied_assertion(self):
        payload = self.payload("onboarding")
        payload["data"]["signed_agreement"] = True
        output = run_agent("ClientOnboardingAgent", payload, {})["handoff"]
        self.assertTrue(all(item["status"] == "unverified" for item in output["deliverable"]["checklist"]))
        self.assertTrue(all(item["owner_role"] for item in output["deliverable"]["checklist"]))

    def test_report_distinguishes_issue_events_and_affected_features(self):
        report = self.run_job("spatial-qa")["result"]["ProjectReportingAgent"]
        self.assertEqual(report["findings"], 3)
        self.assertEqual(report["affected_feature_count"], 2)
        self.assertEqual(report["issue_counts"], {"SHARED_COORDINATES": 1, "OUT_OF_RANGE": 1, "MISSING_ADDRESS": 1})

    def test_report_surfaces_business_blockers(self):
        report = self.run_job()["result"]["ProjectReportingAgent"]
        self.assertIsNone(report["affected_feature_count"])
        self.assertTrue(report["preparation_blockers"])
        self.assertEqual({b["agent"] for b in report["preparation_blockers"]}, {"RFPIntelligenceAgent", "ProposalAgent"})

    def test_review_packet_preserves_state_and_does_not_enable_export(self):
        job = self.run_job()
        before = copy.deepcopy(self.engine.events())
        render_packet(self.engine, job["id"], self.destination)
        page = self.destination.read_text()
        self.assertIn("Internal review copy", page)
        self.assertIn("Missing evidence and blockers", page)
        self.assertIn(job["result_hash"], page)
        self.assertEqual(self.engine.get(job["id"]), job)
        self.assertEqual(before, self.engine.events())
        with self.assertRaises(ValueError):
            self.engine.export(job["id"], Path(self.temp.name) / "release.json")

    def test_review_packet_escapes_untrusted_source_and_preserves_text(self):
        payload = self.payload("opportunity")
        payload["objective"] = '<script>alert("x")</script>'
        job = self.engine.run(self.engine.create(payload))
        render_packet(self.engine, job["id"], self.destination)
        page = self.destination.read_text()
        self.assertNotIn("<script>", page)
        self.assertIn("&lt;script&gt;", page)

    def test_packet_rejects_tampered_and_unrun_results(self):
        job_id = self.engine.create(self.payload("opportunity"))
        with self.assertRaises(ValueError):
            render_packet(self.engine, job_id, self.destination)
        self.engine.run(job_id)
        with self.engine.db:
            self.engine.db.execute("UPDATE jobs SET result='{}' WHERE id=?", (job_id,))
        with self.assertRaises(ValueError):
            render_packet(self.engine, job_id, self.destination)
        self.assertFalse(self.destination.exists())

    def test_packet_cannot_overwrite_existing_artifact(self):
        job = self.run_job()
        self.destination.write_text("existing user artifact")
        with self.assertRaises(ValueError):
            render_packet(self.engine, job["id"], self.destination)
        self.assertEqual(self.destination.read_text(), "existing user artifact")

    def test_packet_requires_html_extension(self):
        job = self.run_job()
        with self.assertRaises(ValueError):
            render_packet(self.engine, job["id"], Path(self.temp.name) / "data.sqlite")
