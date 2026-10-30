# Executable drafting contracts

The Python pilot now implements versioned role-specific instructions and a validated handoff for its three AI-eligible business agents. No provider is bundled or enabled. Spatial screening and project reporting remain deterministic; default business runs remain template mode.

## Offline deliverables and review copies

Default template runs now attach the same validated `handoff` shape used for AI drafts. Opportunity and proposal templates preserve each supplied requirement with a resolving citation and an unverified evidence state. Onboarding templates assign actions to owners without implying agreement, consent or provisioned access. Project reporting consolidates blockers and distinguishes finding events from distinct affected features; a business-only report has no spatial count (`null`).

Use `python3 -m geoagent_os --db /absolute/path/demo.sqlite packet WORK_ORDER_ID /absolute/path/review-001.html` to prepare an internal HTML review copy. It displays the recorded hash, owner, lifecycle status, source work order and result details. It never records approval or enables export, rejects altered/unrun results and refuses existing destinations. Keep it outside public hosting. Regenerate with a new filename after changes.

## Inspect without a provider

From the repository root:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m geoagent_os.drafting \
  --agent RFPIntelligenceAgent \
  --work-order geoagent_os/examples/opportunity.json
```

This prints the exact request contract without opening a database, invoking an adapter, or changing a work order. Use `--agent ProposalAgent` or `--agent ClientOnboardingAgent` for the other briefs. Optional `--prior-results /absolute/path/results.json` supplies prior results as an object. Only public synthetic inputs are supported in this pilot. Keep captured requests outside public hosting.

## Adapter migration

The transport remains one JSON request on stdin and one JSON response on stdout, invoked with `shell=False` and the existing timeout/output-length checks. Requests retain `agent`, `instruction`, `work_order`, and `prior_results` and add:

- `prompt_version`: `etl-gis-drafting-1.0`.
- `output_contract`: the exact context-bound template, immutable fields, allowed statuses, finding/check shapes, and validation rules.

**Compatibility change:** an adapter returning an arbitrary object such as `{"text":"Draft"}` now fails. Return the complete handoff in `output_contract.template` with actual findings, a deliverable summary, limitations and next action. Keep immutable fields unchanged. The template is scaffolding, not an acceptable finished answer: it has no findings.

Live use remains explicitly opt-in through `GEOAGENT_AI_COMMAND` and `python -m geoagent_os run ID --ai`. The adapter owns provider selection and authentication. Do not print credentials or embed them in the command. A trusted local adapter is executable code; prompt rules are not a sandbox around it.

## Runtime citation syntax

Runtime citations use **RFC 6901 JSON pointers**, rather than the illustrative JSONPath notation in the manual handoff:

| Citation | Resolves to |
| --- | --- |
| `S1:#/objective` | Supplied work-order objective |
| `S1:#/data/requirements/0` | First supplied requirement |
| `S2:#/RFPIntelligenceAgent` | Prior agent result, if present |

`S1` is the supplied work order; `S2` is the supplied prior-results object. Escape `/` inside a key as `~1` and `~` as `~0`. Unknown source IDs, absent fields, invalid escapes and out-of-range/noncanonical array indices fail validation. Both sources remain `supplied_only`; an adapter cannot promote them to independently verified evidence.

The `work_id` is a SHA-256 fingerprint of the agent, prompt version, supplied work order and prior results, not the SQLite job ID or a unique run ID. This prevents reuse across roles or changed prior context; identical drafting context produces the same fingerprint. Engine job IDs and result hashes continue to identify the actual work order and reviewed result. The whole handoff remains inside the result covered by that review hash.

## Enforced boundaries

The validator enforces required top-level fields, unchanged context/owner/source manifest, mandatory human review, finding IDs/types, check fields/outcomes, nonempty limitations, and resolving references for facts, observations and passed/failed checks. Additional top-level action fields, duplicate JSON keys and nonfinite numbers are rejected. Blockers or failed checks require `blocked` handoff status; `ready_for_human_review` requires nonempty checks with no failed/unrun outcomes.

Handoff status does not replace the engine lifecycle. A valid blocked draft can be recorded in an `awaiting_review` job so the human can inspect its missing evidence. Export still requires the existing human owner/result-hash approval. Approval to release a report about blockers is not approval to perform the blocked business action.

Citation resolution **does not establish factual entailment**. An agent can cite an existing value and still misinterpret it. The validator cannot independently verify qualification, truth, actual check execution, source freshness, or absence of sensitive data. Those remain review obligations. Tool permissions remain the host's responsibility.

## Offline evaluation

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s geoagent_os/tests -v
```

At implementation, all **32 tests passed**: 12 operations tests and 20 new drafting-contract tests. The new suite checks three distinct role instructions, context/source binding, citation escapes and bounds, evidence requirements, status consistency, duplicate keys, invalid output failure, and a real subprocess adapter round trip that still cannot export an unapproved result. Adapter fixtures are synthetic local code; no live model was evaluated.

The [20 domain/model evaluation cases](evaluations.md) remain a separate planned suite. These contract tests do not imply those model-behavior cases passed.

After the offline deliverable and review-packet implementation, **45 tests pass**: the 32 above plus 13 checks covering requirement coverage/citations, unverified input assertions, malformed requirements, blocker reporting, distinct spatial counts, and read-only packet integrity, escaping and overwrite protection. These are local application checks, not live-model or browser evaluations.

Final review added a cross-role/context replay regression test: **46 application tests pass**. Handoff fingerprints now cover the selected agent, prompt version and prior results as well as the work order.
