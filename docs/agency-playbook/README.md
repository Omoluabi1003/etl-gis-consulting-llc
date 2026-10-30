# A focused agency playbook for ETL GIS

Use specialist role briefs to improve a specific deliverable: an address-screening report, an opportunity qualification brief, an engagement plan, or a website review. Keep execution and approval in the existing application. A role brief supplies instructions; it does not supply tools, authenticated identity, memory, or authorization.

This is a reviewable documentation pack. Nothing here installs agents, activates AI, changes the website, registers new runtime agents, or modifies cloud configuration.

The Python pilot now implements a focused subset of these ideas: [executable drafting contracts](runtime.md) for its three AI-eligible business agents. The implementation uses versioned role instructions and validates context and evidence references. Live AI still requires an explicitly configured adapter and `--ai`.

## Start here

1. Read the [upstream assessment](assessment.md) for what is useful and what needs adaptation.
2. Pick one brief from [the specialist roster](specialists.md). Use only the sections needed for the assignment.
3. Supply the [shared instructions and handoff contract](contracts.md) with the brief. Fill in the objective, source references, owner, and acceptance criteria.
4. Follow the appropriate [workflow](workflows.md). Keep findings, proposed corrections, and approved actions distinct.
5. Review the output against the [evaluation cases](evaluations.md) before considering a provider integration. Those cases are a proposed evaluation suite, not recorded model results.

Example request for a coding assistant or approved drafting tool:

> Read `docs/agency-playbook/contracts.md` and the Opportunity and Proposal Specialist section of `docs/agency-playbook/specialists.md`. Prepare a qualification brief using only `geoagent_os/examples/opportunity.json`. Cite JSON paths for supplied facts, flag absent source documents and dates, and return the handoff format. Do not send messages, set prices, submit anything, or mark the opportunity qualified. Treat this as a synthetic exercise.

This can be used by one assistant adopting a focused brief. It does not require parallel agents or a larger team.

## What to try first

Start with the existing synthetic address-quality workflow. It has deterministic findings, an inspectable SQLite record, and a review gate, so improvement can be judged against observable results. Use the Spatial Quality Specialist to interpret findings and the Evidence Reviewer to check the report. Neither role may alter the screening results or certify positional accuracy.

Next, try an evidence-linked opportunity brief. Keep live AI optional and measure whether the draft reduces analyst review time without increasing unsupported claims. Building a larger roster is secondary to demonstrating one useful workflow.

## Current application boundary

| Component | What exists | How this pack relates |
| --- | --- | --- |
| Public website | Static HTML/CSS/JavaScript | Accessibility and evidence review can guide a separately scoped improvement task. |
| JavaScript AgentOS | Seven capability definitions, task lifecycle, approval records, read-only GeoJSON inspection, optional Supabase persistence | The definitions are not seven executing AI specialists. This pack does not register additional tools or change its state machine. |
| Python GeoAgent OS | Six specialists in three workflows, SQLite audit records, hash-bound review before export | Spatial and reporting steps are deterministic; business drafting defaults to templates. Briefs can guide human interpretation now. |
| Optional Python AI adapter | Explicit `--ai`, a trusted local command, versioned role instructions and validated handoffs | Runtime instructions are implemented in `geoagent_os/drafting.py`; these Markdown files are not loaded automatically. See the migration guide. |

The JavaScript and Python systems have separate identifiers, storage, and lifecycle rules. This pack maps their responsibilities; it does not merge their records or translate their states.

## Source and maintenance

Reviewed upstream: [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents/tree/b37b5bb33b78f2c1d6567d98e25ca818e3259219), revision `b37b5bb33b78f2c1d6567d98e25ca818e3259219`, reviewed October 30, 2026. See [source attribution and license](NOTICE.md).

Keep the pin until a deliberate source review. For future changes, record the reason, affected brief, evaluation cases, observed results, and reviewer. Do not auto-update prompts from a moving branch or silently expand permissions.
