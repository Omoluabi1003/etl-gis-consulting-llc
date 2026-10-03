# ETL GeoAgent OS

Human-led. Agent-powered. Spatially intelligent.

A working local operations pilot for ETL GIS Consulting LLC. Each work order has a human owner. The orchestrator runs specialist agents, records activity in SQLite, and requires review of the exact result hash before an approved deliverable can be exported. The company website remains independent of this runtime.

## Start in five minutes

Python 3.11 or newer; standard library only. Run from the repository root:

```bash
python -m unittest discover -s geoagent_os/tests -v
python -m geoagent_os.demo
```

Open `geoagent_os/runtime/dashboard.html` locally. The demo creates three synthetic work orders, all awaiting review. Running the demo again does not duplicate existing samples. Dashboard generation creates a read-only snapshot; regenerate it after changes.

## Operate a work order

```bash
python -m geoagent_os create geoagent_os/examples/spatial-qa.json
python -m geoagent_os run WORK_ORDER_ID
python -m geoagent_os show WORK_ORDER_ID
python -m geoagent_os review WORK_ORDER_ID --reviewer "Paul Iyogun" --decision approved --hash RESULT_HASH --note "Reviewed the screening report and documented follow-up corrections"
python -m geoagent_os export WORK_ORDER_ID geoagent_os/runtime/approved-report.json
python -m geoagent_os dashboard geoagent_os/runtime/dashboard.html
```

Replace `WORK_ORDER_ID` and `RESULT_HASH` with the returned values. Approval releases the screening report, not a certification that the source data is correct. Use `--decision rejected` when revisions are needed and create a revised work order. Do not edit stored results. Failed or interrupted work orders require a new submission in this pilot.

## Departments and scope

| Agent | Human supervisor | Working pilot behavior |
| --- | --- | --- |
| SpatialQAAgent | GIS Project Lead | Checks Point coordinate types, ranges, and shared positions |
| AddressValidationAgent | GIS Project Lead | Finds missing addresses and text duplicates, respecting units and city |
| RFPIntelligenceAgent | Business Development Lead | Builds a brief from supplied facts and flags missing evidence |
| ProposalAgent | Business Development Lead | Prepares a proposal outline with explicit pricing and qualification gaps |
| ClientOnboardingAgent | Operations Lead | Prepares an engagement checklist |
| ProjectReportingAgent | Project Manager | Summarizes completed agents and screening findings |

Workflows: `spatial_qa`, `opportunity`, `onboarding`. Coordinate screening assumes WGS84 longitude/latitude. Polygon topology, geocoding, official address assignment, parcel corrections, live RFP discovery, and ArcGIS writes are outside this release. Shared coordinates are review findings, since multiple condominium units can share a location.

## Optional AI drafting

Default runs need no API key and use honest `deterministic` or `template` mode labels. To use live AI for business drafts, supply a trusted local provider adapter and explicitly run with `--ai`:

```bash
export GEOAGENT_AI_COMMAND='["python", "/absolute/path/to/your/provider_adapter.py"]'
python -m geoagent_os run WORK_ORDER_ID --ai
```

Adapter contract: read one JSON object from stdin and return one JSON object to stdout. Input contains `agent`, `instruction`, `work_order`, and `prior_results`. The configured command is executed without a shell, with a 45-second timeout and a 100,000-character response limit. AI responses are untrusted drafts and use the same review gate. Spatial checks stay deterministic. The adapter owns provider authentication, model selection, token budgets, API calls, retries, and redaction; no provider is bundled or activated in this release. Store keys outside this public repository. Enabling AI sends the work-order payload to that adapter, so only use approved public synthetic examples during the pilot.

## Governance and deployment limits

This is a single-operator local pilot, not a hosted internal application. Reviewer identity is an asserted local name checked against the assigned owner, not authenticated identity. Anyone with database access can modify both results and hashes; result hashing catches accidental or partial changes, not administrator tampering. Audit records are transactional local records, not immutable evidence. Public-synthetic classification is a declared contract, not automatic sensitive-data detection. Keep all runtime data, exports, databases, and generated dashboards outside version control and public web hosting.

Before client deployment: move the runtime to a private repository/service, add SSO and role-based authorization, tenant isolation, encryption, centrally retained audit records, backup/restore, queue recovery, provider cost limits, and approved connector scopes. ArcGIS, SQL Server, CRM, and email integrations must use server-side credentials and explicit write policies. Approvals here never automatically send messages, create invoices, or change GIS services.

GitHub Issues can capture synthetic work orders through the included form. They do not trigger execution. GitHub Actions runs tests and synthetic demos only; it does not process client records. Review proposed code through pull requests before merging. Artifact upload is available only for manually requested demos and contains synthetic data.

## Commercial pilot

Start with address-quality screening for one consenting client using an isolated deployment. Establish baseline review time and known-error detection, then compare analyst time, false positives, correction rate, and review effort. Expand only after a GIS lead validates results. Package the offering as AI-augmented GIS consulting, employee workflow automation, and industry-specific agent implementations. Pricing and performance claims require measured evidence.
