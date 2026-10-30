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

For development alongside the public website, keep runtime artifacts outside the checkout:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m geoagent_os.demo --output /workspace/geoagent-runtime
python3 -m geoagent_os --db /workspace/geoagent-runtime/demo.sqlite list
python3 -m geoagent_os --db /workspace/geoagent-runtime/demo.sqlite packet WORK_ORDER_ID /workspace/geoagent-runtime/review-001.html
```

The `packet` command creates a read-only **internal review copy**, including the exact result hash, owner, sources, outputs, missing evidence and next actions. It does not approve a work order or replace the gated JSON export. It rejects changed results, requires an `.html` filename and refuses to overwrite an existing artifact. Choose a new filename for each snapshot. Keep packets outside public hosting; they contain the supplied work order.

Default business templates now include validated `handoff` objects: source-linked requirement matrices, owner-assigned onboarding actions and explicit unverified prerequisites. A supplied URL or deadline is not treated as independently verified. Reporting consolidates preparation blockers and separates issue-event count from unique affected-feature count (`null` when spatial screening did not run). Existing output fields remain available.

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

Adapter contract: read one JSON object from stdin and return a complete validated handoff object to stdout. Input contains `agent`, role-specific `instruction`, `work_order`, `prior_results`, `prompt_version`, and `output_contract`. Arbitrary draft objects are no longer accepted. Follow the supplied template, retain immutable context fields, and cite supplied evidence with resolving JSON pointers. See the [executable drafting contract](../docs/agency-playbook/runtime.md) for migration, validation limits, and a provider-free request inspection command.

The configured command is executed without a shell, with a 45-second timeout and a 100,000-character response limit. AI responses are untrusted drafts and use the same review gate. Spatial checks stay deterministic. The adapter owns provider authentication, model selection, token budgets, API calls, retries, and redaction; no provider is bundled or activated in this release. Store keys outside this public repository. Enabling AI sends the work-order payload to that adapter, so only use approved public synthetic examples during the pilot.

## Governance and deployment limits

This is a single-operator local pilot, not a hosted internal application. Reviewer identity is an asserted local name checked against the assigned owner, not authenticated identity. Anyone with database access can modify both results and hashes; result hashing catches accidental or partial changes, not administrator tampering. Audit records are transactional local records, not immutable evidence. Public-synthetic classification is a declared contract, not automatic sensitive-data detection. Keep all runtime data, exports, databases, and generated dashboards outside version control and public web hosting.

Before client deployment: move the runtime to a private repository/service, add SSO and role-based authorization, tenant isolation, encryption, centrally retained audit records, backup/restore, queue recovery, provider cost limits, and approved connector scopes. ArcGIS, SQL Server, CRM, and email integrations must use server-side credentials and explicit write policies. Approvals here never automatically send messages, create invoices, or change GIS services.

GitHub Issues can capture synthetic work orders through the included form. They do not trigger execution. GitHub Actions runs tests and synthetic demos only; it does not process client records. Review proposed code through pull requests before merging. Artifact upload is available only for manually requested demos and contains synthetic data.

## Commercial pilot

Start with address-quality screening for one consenting client using an isolated deployment. Establish baseline review time and known-error detection, then compare analyst time, false positives, correction rate, and review effort. Expand only after a GIS lead validates results. Package the offering as AI-augmented GIS consulting, employee workflow automation, and industry-specific agent implementations. Pricing and performance claims require measured evidence.
