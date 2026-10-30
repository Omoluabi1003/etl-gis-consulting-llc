"""Internal, read-only review packets. Never an approved-deliverable export."""
import html
import json
from pathlib import Path
from .engine import digest


def render_packet(engine, job_id, destination):
    job = engine.get(job_id)
    result = job["result"]
    if result is None or not job["result_hash"] or digest(result) != job["result_hash"]:
        raise ValueError("A completed, unchanged result is required for a review packet")
    escape = lambda value: html.escape(str(value), quote=True)
    dump = lambda value: escape(json.dumps(value, indent=2, ensure_ascii=True))
    sections = []
    for name, output in result.items():
        content = f'<section><h2>{escape(name)}</h2><p>Mode: {escape(output.get("mode", "unknown"))}</p>'
        handoff = output.get("handoff") if output.get("mode") == "template" else output.get("draft")
        if isinstance(handoff, dict) and handoff.get("contract_version") == "1.0":
            content += f'<p><strong>Preparation status:</strong> {escape(handoff["status"])}</p><p>{escape(handoff["deliverable"]["summary"])}</p>'
            content += '<h3>Missing evidence and blockers</h3><ul>' + ''.join(f'<li>{escape(b)}</li>' for b in handoff["blockers"]) + '</ul>'
            content += f'<h3>Next action</h3><p>{escape(handoff["next_action"])}</p>'
        if name == "ProjectReportingAgent":
            count = output.get("affected_feature_count")
            affected = "not applicable or not recorded" if count is None else count
            content += f'<p>Finding events: {escape(output.get("findings", 0))}. Unique affected features: {escape(affected)}.</p>'
        content += f'<details><summary>Complete recorded output and citations</summary><pre>{dump(output)}</pre></details></section>'
        sections.append(content)
    page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Internal review packet</title><style>
body{{font:16px/1.6 system-ui,sans-serif;color:#172b3a;background:#f4f7f8;margin:0}}main{{max-width:960px;margin:auto;padding:32px 24px}}section,header{{background:white;padding:24px;margin-bottom:20px;border:1px solid #b8c8d1;border-radius:12px}}h1{{line-height:1.2}}pre{{white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px}}.notice{{border-left:4px solid #815b00;padding-left:16px}}dt{{font-weight:bold}}dd{{margin:0 0 12px;overflow-wrap:anywhere}}summary{{cursor:pointer}}:focus-visible{{outline:3px solid #005a80;outline-offset:4px}}@media print{{body{{background:white}}section{{break-inside:avoid}}details>*{{display:block}}}}
</style></head><body><main><header><p class="notice"><strong>Internal review copy — not a released deliverable.</strong> This snapshot grants no approval, sends nothing, and performs no GIS or business action. Keep it outside public hosting.</p><h1>{escape(job["payload"]["objective"])}</h1><dl><dt>Human owner</dt><dd>{escape(job["payload"]["owner"])}</dd><dt>Work order</dt><dd>{escape(job_id)}</dd><dt>Recorded lifecycle status</dt><dd>{escape(job["status"])}</dd><dt>Exact result hash for review</dt><dd>{escape(job["result_hash"])}</dd></dl><p>Use the existing owner and result-hash review command after inspecting all evidence. Regenerate this packet after any change. A preparation blocker and human approval to release a report describe different decisions.</p></header>{''.join(sections)}<section><h2>Supplied work order</h2><p>Input assertions are supplied evidence, not independently verified facts.</p><pre>{dump(job["payload"])}</pre></section></main></body></html>'''
    path = Path(destination)
    if path.suffix.lower() != ".html":
        raise ValueError("Review packet destination must end in .html")
    if path.exists():
        raise ValueError("Destination already exists; choose a new snapshot filename")
    path.parent.mkdir(parents=True, exist_ok=True)
    # Exclusive creation prevents accidental overwrite, including a concurrent writer.
    with path.open("x", encoding="utf-8") as handle:
        handle.write(page)
    return str(path)
