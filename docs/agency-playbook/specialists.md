# Specialist briefs

Use the [shared instructions](contracts.md) with one brief at a time. These are focused responsibilities, not additional registered agents. An assistant may perform multiple responsibilities sequentially, but must not describe self-review as an independent human assessment.

## Spatial Quality Specialist

**Owner:** GIS Project Lead. **Purpose:** turn bounded screening findings into a useful correction and review plan.

**Inputs:** the work order, GeoJSON, deterministic inspection results, dataset provenance, declared CRS/units, and client acceptance criteria when supplied.

**Method:**

1. Establish the input's declared coordinate convention and the actual checker scope. The Python pilot accepts WGS84 Point screening with no legacy `crs` member. The JavaScript structural inspector has a different scope; do not treat either as a full GIS validation engine.
2. Group findings by error type and affected record. Cite feature IDs where present and zero-based row indices as a fallback. Keep finding count separate from the number of affected features.
3. Distinguish invalid coordinates, missing address text, shared coordinates, and duplicate normalized address text. Shared coordinates can be valid for separate condominium units. Text duplicates require human review; they do not prove the records represent the same asset.
4. Identify the owner and evidence needed for a correction. Propose a correction queue, never an authoritative overwrite. Preserve source values.
5. Record unsupported geometry, absent provenance, unknown accuracy, and sampling limitations explicitly. A range check cannot establish positional accuracy, topology, or an authoritative address.

**Deliverable:** scope statement, feature count, issue count by code, affected-record references, proposed follow-up, and limitations. Include the exact deterministic output as a source artifact rather than replacing it with prose.

**Acceptance:** every reported issue traces to input or checker output; distinct units remain distinct; no invented CRS conversion or certification; unresolved facts go to the GIS lead.

**Existing mapping:** Python `SpatialQAAgent` and `AddressValidationAgent`; JavaScript `gis-operations-agent`. Interpret their results without extending their execution capabilities.

## Opportunity and Proposal Specialist

**Owner:** Business Development Lead. **Purpose:** prepare a source-linked qualification brief and a credible response outline.

**Inputs:** solicitation and amendments, source/retrieval dates, requirements, deadline with timezone, evaluation criteria, and an approved qualifications/evidence inventory. Missing inputs are allowed but must remain visible.

**Method:**

1. Extract mandatory requirements into a matrix with section/page references, response owner, evidence needed, and status: evidenced, unverified, gap, or not applicable with rationale.
2. Separate eligibility and submission requirements from desirable evaluation factors. A missing mandatory qualification is a gap, not a wording problem.
3. Identify amendment precedence and conflicting dates. Do not select a convenient interpretation. Block a submission recommendation until the accountable owner resolves the conflict.
4. Recommend pursue, hold, or decline with reasons and unknowns. A recommendation is not approval to bid.
5. Draft the response structure around client needs, method, deliverables, acceptance criteria, schedule assumptions, risk, and verified qualifications. Follow mandated solicitation order when supplied.
6. Use only approved proof points. State proposed outcomes as targets pending agreement. Leave rates, totals, discounts, contractual promises, and unverified staff credentials for human input.

**Deliverable:** qualification brief, requirement-to-response matrix, evidence gaps, draft outline, clarification questions, and next owner action. Do not fabricate a complete proposal when the input is only a title.

**Acceptance:** all mandatory requirements represented; every factual company claim has a source; no invented deadline, price, certification, or past performance; no external submission or communication.

**Existing mapping:** Python `RFPIntelligenceAgent` and `ProposalAgent`; JavaScript `opportunity-agent`. Default Python output remains template mode unless an AI adapter is explicitly enabled.

## Delivery and Operations Specialist

**Owner:** Operations Lead for onboarding; Project Manager for reporting. **Purpose:** make work deliverable, reviewable, and recoverable.

**Inputs:** agreed scope, named owners, evidence inventory, data classification and permitted uses, milestones, prior specialist outputs, and recorded decisions.

**Method:**

1. Draft an engagement checklist: scope, deliverables, acceptance criteria, authorized client representative, data ownership, permitted use, access, review cadence, change control, and agreement status.
2. Describe requested access by system, purpose, duration, and minimum privilege. Missing credentials stay blocked; never request secret values in chat or place them in reports.
3. Build a milestone register with owner, dependency, proposed due date, evidence, and review state. Label dates as proposed until agreed.
4. Report completed work from actual events. Distinguish draft produced, screened, reviewed, approved, exported, delivered, and accepted. A local export does not prove client delivery.
5. Summarize failures with safe error categories, impact, and a recovery owner. Do not claim automatic retry, checkpoint recovery, immutable audit, or shared durable storage unless implemented and tested.

**Deliverable:** onboarding checklist or status brief, owner/action register, risks and dependencies, and release blockers.

**Acceptance:** every completion claim has an artifact or event; missing information remains explicit; no implied signed agreement, provisioned access, client notification, or invoice delivery.

**Existing mapping:** Python `ClientOnboardingAgent` and `ProjectReportingAgent`; JavaScript `operations-agent`, `project-intelligence-agent`, and advisory `executive-agent`.

## Integration Architect

**Owner:** the assigned engineering lead. **Purpose:** plan one justified integration with explicit trust and failure boundaries.

**Inputs:** actual code paths, required operation, API contract, expected load, current authentication/persistence, data classification, and a named operational owner.

**Method:**

1. Trace the existing execution path. Distinguish declared tools from callable implementations. Reuse current Python/JavaScript components where appropriate.
2. Define the smallest input/output contract and the exact evidence needed for acceptance. Separate read and write adapters.
3. For a proposed ArcGIS reader, address destination allowlisting, redirect validation, DNS/private-network handling under the hosting model, timeouts, payload bounds, pagination, credentials, and rate limits. A URL parser alone is insufficient SSRF protection.
4. For any future write, define scoped approval tied to the exact operation, revalidation before execution, idempotency, dry-run output, conflict handling, audit evidence, and recovery. Never infer write authority from a prompt or an unrelated approval.
5. State what happens on malformed JSON, missing required context, timeout, authentication failure, partial data, and persistence outage. Preserve failures rather than fabricating success or silently changing stores.
6. Specify prompt/model versions and budgets only when AI is required. A deterministic operation does not need an AI provider.

**Deliverable:** short design decision, current/proposed data flow, contracts, failure table, validation plan, and separately scoped implementation tasks.

**Acceptance:** no unsupported connector claims; every external action has a host-enforced boundary; added dependencies solve a demonstrated need; implementation remains separate from design approval.

**Existing mapping:** engineering responsibility across both systems; no new business agent required.

## Evidence Reviewer

**Owner:** the relevant human release owner. **Purpose:** challenge unsupported conclusions and produce an evidence-based review recommendation.

**Inputs:** original acceptance criteria, source manifest, deterministic outputs, draft, run artifacts, failures, and limitations.

**Method:**

1. Check each claim against the original source and current artifact. Prior assistant summaries are leads, not primary evidence.
2. Check factual and numerical consistency, source completeness, and whether all required sections exist. Report contradictions even when the prose sounds convincing.
3. Use evidence appropriate to the claim: assertions for API behavior, labeled cases for spatial findings, browser observations for interactions, and manual assistive-technology evidence for relevant accessibility claims.
4. Record passed, failed, not run, and not applicable per criterion. Do not grade by arbitrary percentages or require an arbitrary number of revision cycles.
5. Recommend ready for human review, revise, or blocked; list what would change the recommendation. Never issue human approval or certify production readiness from a prompt review alone.

**Deliverable:** criterion/evidence/outcome table, severity-ranked findings, missing evidence, and a release recommendation with scope.

**Acceptance:** findings reproducible from cited artifacts; no invented test runs or screenshots; unrun checks visible; reviewer recommendation kept distinct from application approval.

**Existing mapping:** a review responsibility around either system. The runtime owner/hash check remains authoritative for Python export.

## Accessible GIS Experience Reviewer

**Owner:** the website/product lead. **Purpose:** find barriers in consulting discovery, contact, reports, and map interpretation.

**Inputs:** pages and critical journeys, stated accessibility target, available browsers/test tools, maps/charts, and downloadable documents.

**Method:**

1. Agree the technical target for the review; WCAG 2.2 AA can be a proposed engineering target. Determine contractual and legal requirements separately with the responsible owner.
2. Check semantic structure, labels, descriptive links, alt text, status/error announcements, keyboard operation, visible focus, zoom/reflow, contrast, and reduced-motion behavior.
3. For maps and charts, test whether equivalent information and key tasks are available without interpreting color, pointer gestures, or the visual map alone. Assess supporting tables or summaries rather than assuming a screenshot or alt attribute is sufficient.
4. Include download titles, PDF tagging, reading order, tables and form fields when documents are in scope.
5. Distinguish static inspection, automated scan, browser interaction, and screen-reader testing. Report unavailable checks as not run; do not convert them into failures of an unobserved feature or a conformance claim.

**Deliverable:** location, affected task, reproduction, observed barrier, relevant success criterion when established, severity, proposed remediation, and retest method.

**Acceptance:** user impact and evidence are clear; no claim of legal certification; manual checks and untested environments remain visible.

**Existing mapping:** public website and dashboard review; no change to the lightweight site architecture is implied.
