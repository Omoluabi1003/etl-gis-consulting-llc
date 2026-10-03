# ETL GIS AgentOS architecture

## Purpose and trust boundary

ETL GIS AgentOS is a human-supervised control plane added alongside the existing static consulting website. Human operators define work and retain authority over consequential actions. Agents can analyze, prepare, validate, summarize, and draft only through named allowlisted tools. An agent definition is a capability and policy contract, not a claim that an external AI or enterprise system is connected.

The public dashboard uses an unauthenticated, read-only API representation containing agent capabilities and aggregate operational counts. It deliberately excludes task records, people, approval records, and audit events. Operational writes and the full supervisor summary remain protected by the server-side `AGENTOS_ACCESS_TOKEN`; the browser neither receives nor accepts that credential. This internal compatibility gate must be replaced by the application's identity-provider sessions and role-based authorization before supervisory controls are exposed to users. Supabase credentials remain exclusively in the serverless API. The schema enables row-level security and defines no browser-role policies.

## Layers implemented

| Layer | Implementation |
| --- | --- |
| Human command | `agentos/index.html` submits scoped assignments and explicit decisions. |
| Agent orchestration | `agentos/orchestrator.js` validates assignments and enforces lifecycle transitions. |
| GIS/data intelligence | `agentos/tools/geojson-inspector.js` provides bounded, read-only FeatureCollection inspection. |
| Business operations | Seven definitions expose capabilities without fabricating integrations. |
| Integration | `SupabaseAgentOSStore` is the persistence adapter; further adapters remain intentionally absent. |
| Governance/approval | Restricted action identifiers stop at `REVIEW_REQUIRED`; approve, reject, and revision decisions are recorded. |
| Audit/observability | Each meaningful orchestration, tool, boundary, and decision event is appended to an audit table. |

## Lifecycle

The state machine permits only declared transitions across `REQUESTED`, `ANALYZING`, `ASSIGNED`, `RUNNING`, `REVIEW_REQUIRED`, `APPROVED`, `COMPLETED`, and `FAILED`. Invalid transitions throw before persistence. An approval changes authority state; it does not execute an external side effect. Rejection ends the task visibly with its rationale, while a revision request returns it to analysis.

## GIS extension model

The GeoJSON inspector accepts at most 10,000 features, reports schema properties, geometry types, missing or invalid geometry, duplicate feature IDs, and declared coordinate reference information without modifying input. ArcGIS REST readers, ArcGIS Enterprise writers, ArcPy jobs, SQL Server, and PostGIS should be separate adapters. Read adapters can be added to an agent's `allowedTools`; write adapters must require a task in an approved state, revalidate the approval scope, use least-privilege credentials, and write an audit event for the outcome.

## Recommended next phase

1. Add organization SSO, named user identities, roles, and short-lived sessions.
2. Add immutable audit retention and database policies scoped by organization.
3. Implement an ArcGIS REST read-only service inspector with URL allowlisting, timeouts, response-size limits, and SSRF protections.
4. Add asynchronous job execution and idempotency for long-running workloads.
5. Add revision resubmission and approved-action execution as explicit, separately authorized commands.
