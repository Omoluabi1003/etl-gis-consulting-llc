# Upstream assessment

## Recommendation

Use a small set of adapted role briefs as a quality layer around the existing GIS workflows. The strongest upstream ideas are explicit deliverables, source-backed claims, structured handoffs, and observable failure behavior. The collection is useful reference material; inspecting its prompts does not establish its advertised production readiness or business outcomes.

Do not import its full roster or adopt a multi-agent framework solely to use the instructions. The current repository's dependency-free workflow and deterministic spatial checks already provide a simpler foundation.

## What was examined

All links below refer to the pinned upstream revision, not the moving default branch.

| Upstream material | Useful idea | ETL GIS adaptation |
| --- | --- | --- |
| [Data Engineer](https://github.com/msitarzewski/agency-agents/blob/b37b5bb33b78f2c1d6567d98e25ca818e3259219/engineering/engineering-data-engineer.md) | Schema contracts, lineage, idempotency, explicit quality checks | Specify CRS, units, geometry scope, identifier stability, and authoritative sources. Choose tooling from the workload; omit default Spark/lakehouse architecture and universal soft-delete rules. |
| [Multi-Agent Systems Architect](https://github.com/msitarzewski/agency-agents/blob/b37b5bb33b78f2c1d6567d98e25ca818e3259219/engineering/engineering-multi-agent-systems-architect.md) | Permission scopes, bounded context, failure handling, evaluation and tracing | Retain sequential workflows. Prefer an explicit blocked result when evidence is missing; do not force a plausible answer through a fallback. Add runtime mechanisms only in a separately tested implementation. |
| [Proposal Strategist](https://github.com/msitarzewski/agency-agents/blob/b37b5bb33b78f2c1d6567d98e25ca818e3259219/sales/sales-proposal-strategist.md) | Link buyer requirements to approach and proof | Put mandatory compliance and verified evidence ahead of persuasive narrative. Never turn example metrics into company achievements. |
| [Automation Governance Architect](https://github.com/msitarzewski/agency-agents/blob/b37b5bb33b78f2c1d6567d98e25ca818e3259219/specialized/automation-governance-architect.md) | Ownership, fallback, operating cost, explicit implementation decisions | Evaluate value in the current Python/JavaScript architecture; no n8n migration is justified by a prompt template. Agent verdicts remain recommendations. |
| [Section 508 Specialist](https://github.com/msitarzewski/agency-agents/blob/b37b5bb33b78f2c1d6567d98e25ca818e3259219/engineering/engineering-section-508-specialist.md) and [Accessibility Auditor](https://github.com/msitarzewski/agency-agents/blob/b37b5bb33b78f2c1d6567d98e25ca818e3259219/testing/testing-accessibility-auditor.md) | Semantic controls, keyboard and assistive-technology testing, explicit standard | Audit map alternatives, contact flows, and downloadable PDFs. Record unperformed manual checks. Confirm the applicable standard with the client; do not infer legal obligations from a role title. |
| [Handoff templates](https://github.com/msitarzewski/agency-agents/blob/b37b5bb33b78f2c1d6567d98e25ca818e3259219/strategy/coordination/handoff-templates.md) | Inputs, acceptance criteria, evidence, next owner | Use compact source references and blockers rather than passing entire documents repeatedly. Separate automated checks from human release. |
| [Reality Checker](https://github.com/msitarzewski/agency-agents/blob/b37b5bb33b78f2c1d6567d98e25ca818e3259219/testing/testing-reality-checker.md) | Verify claims against actual implementation | Replace predetermined grades and mandatory revision cycles with criterion-based results. Its `qa-playwright-capture.sh` requirement is not a script supplied by this GIS repository. Screenshots cannot prove API authorization or GIS correctness. |
| [Government Digital Presales Consultant](https://github.com/msitarzewski/agency-agents/blob/b37b5bb33b78f2c1d6567d98e25ca818e3259219/specialized/government-digital-presales-consultant.md) | Procurement context matters | This role explicitly targets China's government market. Do not reuse its regulatory assumptions for US county, municipal, or federal opportunities. |

## Codex integration: what the code establishes

The upstream [conversion script](https://github.com/msitarzewski/agency-agents/blob/b37b5bb33b78f2c1d6567d98e25ca818e3259219/scripts/convert.sh) emits TOML with `name`, `description`, and `developer_instructions`. It copies the Markdown body into the instructions and omits presentation metadata. The [installer](https://github.com/msitarzewski/agency-agents/blob/b37b5bb33b78f2c1d6567d98e25ca818e3259219/scripts/install.sh) copies selected generated files to a destination that defaults to `~/.codex/agents/`.

That establishes a file-generation path, not successful registration in every Codex product. This managed environment exposes protected configuration directories and session-controlled agent tools. No installer was run, no custom agent was registered, and no compatibility claim was validated. Reading a selected brief as reference material works independently of custom-agent discovery.

If a future task needs native registration, inspect the installed Codex version and its supported configuration first, generate into a temporary directory, validate the TOML, inspect the selected instructions, and test discovery of one agent. A written file alone is not evidence that the session can invoke it. Preserve existing configuration and avoid bulk installation.

## Highest-value gaps in this repository

These are findings from repository inspection, not changes made by this documentation pack.

Implementation follow-up: the Python pilot now addresses the general-instruction and coarse-validation gaps in items 2–3 with versioned business-role instructions and context-bound handoffs. See [runtime behavior and adapter migration](runtime.md). Citation resolution still does not prove factual entailment. The findings below preserve the original assessment baseline.

1. **Capabilities exceed connected execution.** JavaScript definitions name several tools, but the implemented orchestrator operation is read-only GeoJSON inspection. Keep capability descriptions separate from verified integrations.
2. **Business drafts lack domain-specific AI instructions.** Python passes a general draft-only instruction to the optional provider adapter. The role briefs here supply design material for a future adapter; merely adding Markdown does not change its requests.
3. **Provider output validation is structural at a coarse level.** The Python adapter path checks that returned JSON is an object and bounds execution time and output length. It does not enforce the richer evidence contract proposed here. Enforcement needs application code and meaningful tests.
4. **Human identity has different guarantees in each pilot.** The Python owner/reviewer is an asserted local name. JavaScript uses a shared server-side access token. Neither should be presented as organization SSO or tenant-scoped identity.
5. **Approval does not authorize arbitrary execution.** Python approval releases an exact result for export. JavaScript records a decision without executing a consequential adapter. Preserve both distinctions.
6. **Sensitive-data protection is limited.** The Python classification field is a declared public-synthetic constraint, not a detector. Prompt instructions alone cannot prevent someone from mislabeling real client data.

## Adoption order

| Stage | Deliverable | Evidence needed to advance |
| --- | --- | --- |
| 1: Manual synthetic trial | Screened address report and reviewed opportunity brief using this pack | Analyst confirms source references, limitations, and actionable findings; no external actions. |
| 2: Measured drafting trial | An explicitly selected provider adapter and validated result schema | Compare baseline and revised drafts on the same cases; retain prompt version, model version, failures, cost and latency. |
| 3: Private client pilot | Isolated private service with authenticated roles and approved data handling | Client permission, access tests, backup/restore evidence, audit retention, and an accountable release owner. |
| 4: Connected operations | A separately scoped read adapter, followed only later by a write adapter | Read allowlisting and SSRF tests; for writes, scoped approvals, idempotency, dry-run evidence and recovery verification. |

For a value comparison, measure total analyst minutes per accepted deliverable, including correction and review; count unsupported factual claims and missed mandatory requirements separately. Track spatial detection precision/recall against a GIS-lead-labeled sample, not the agent's own assessment. Do not advertise time savings or accuracy until measured.
