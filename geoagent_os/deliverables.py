"""Source-linked preparation templates. No inferred qualification or completion."""
import copy
from .drafting import build_request, validate_handoff


def prepare_handoff(name, payload, prior):
    request = build_request(name, payload, prior)
    handoff = copy.deepcopy(request["output_contract"]["template"])
    data = payload["data"]
    handoff.update(status="blocked", findings=[{
        "id": "F1", "kind": "fact", "statement": payload["objective"],
        "source_refs": ["S1:#/objective"],
    }])
    requirements = data.get("requirements", [])
    matrix = []
    if isinstance(requirements, list):
        for index, requirement in enumerate(requirements):
            matrix.append({
                "requirement": requirement,
                "source_refs": [f"S1:#/data/requirements/{index}"],
                "evidence_status": "unverified",
                "response_owner": "Business Development Lead",
                "next_action": "Confirm mandatory/optional status and supply response evidence",
            })
    if name in ("RFPIntelligenceAgent", "ProposalAgent"):
        gaps = [f"Supply {key}" for key in ("title", "source_url", "deadline", "requirements") if not data.get(key)]
        if not isinstance(requirements, list) or any(not isinstance(r, str) or not r.strip() for r in requirements):
            gaps.append("Provide requirements as a list of nonempty source-extracted strings")
        gaps.append("Human verification of solicitation, amendments, deadline timezone and eligibility required")
        handoff.update(
            blockers=gaps,
            deliverable={
                "summary": "Source-linked preparation outline; opportunity qualification is not verified.",
                "requirement_matrix": matrix,
                "recommendation": "hold_for_human_qualification",
                "sections": ["Client need", "Requirements and evidence", "Proposed GIS approach", "Deliverables and acceptance criteria", "Schedule assumptions", "Pricing inputs", "Verified qualifications"],
                "pricing": "Human input required; no commitment",
                "qualifications": "Human verification required",
            },
            checks=[{
                "criterion": "Solicitation, amendments, eligibility and authoritative deadline verified",
                "outcome": "not_run", "evidence_refs": [],
                "rationale": "Template preparation does not retrieve or authenticate external sources.",
            }],
            next_action="Business Development Lead reviews each requirement and supplies missing authoritative evidence.",
        )
        for key in ("title", "source_url", "deadline"):
            if key in data:
                handoff["findings"].append({
                    "id": f"F{len(handoff['findings']) + 1}", "kind": "observation",
                    "statement": f"The supplied work order contains {key}; its content is not independently verified.",
                    "source_refs": [f"S1:#/data/{key}"],
                })
    else:
        items = [
            ("scope", "Agree scope, deliverables and acceptance criteria", "Operations Lead"),
            ("representative", "Confirm authorized client representative", "Operations Lead"),
            ("data_rights", "Confirm data ownership, classification and permitted uses", "GIS Project Lead"),
            ("access", "Approve least-privilege access and its duration", "Operations Lead"),
            ("agreement", "Verify signed engagement agreement", "Operations Lead"),
            ("cadence", "Agree review cadence and change control", "Project Manager"),
        ]
        handoff.update(
            blockers=["Human confirmation of engagement prerequisites required"],
            deliverable={
                "summary": "Engagement preparation checklist; no agreement, access or consent verified.",
                "checklist": [{"id": key, "action": action, "owner_role": owner, "status": "unverified", "evidence_refs": []} for key, action, owner in items],
            },
            checks=[{"criterion": "Engagement prerequisites verified", "outcome": "not_run", "evidence_refs": [], "rationale": "A generated checklist is not evidence of completed onboarding."}],
            next_action="Operations Lead records evidence for each prerequisite before engagement begins.",
        )
    return validate_handoff(handoff, request)


def reporting_summary(prior):
    issues = [issue for result in prior.values() for issue in result.get("issues", [])]
    rows = {issue["row"] for issue in issues if isinstance(issue.get("row"), int)}
    codes = {}
    for issue in issues:
        code = issue.get("code", "UNSPECIFIED")
        codes[code] = codes.get(code, 0) + 1
    blockers = []
    for name, result in prior.items():
        handoff = result.get("handoff") if result.get("mode") == "template" else result.get("draft")
        if isinstance(handoff, dict):
            blockers.extend({"agent": name, "detail": text} for text in handoff.get("blockers", []))
    spatial_screened = any("issues" in result for result in prior.values())
    return {"affected_feature_count": len(rows) if spatial_screened else None, "issue_counts": codes, "preparation_blockers": blockers}
