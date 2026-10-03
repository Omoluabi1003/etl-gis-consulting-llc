"""Portable, read-only dashboard snapshots. No browser-side approvals."""
import html
from pathlib import Path
from .agents import REGISTRY


def render(engine, destination):
    escape = lambda value: html.escape(str(value), quote=True)
    jobs = engine.jobs()
    cards = ''.join(f'<article><p class="eyebrow">{escape(meta["department"])}</p><h3>{escape(name)}</h3><p>Human supervisor: {escape(meta["owner_role"])}</p></article>' for name, meta in REGISTRY.items())
    rows = ''.join(f'<tr><td>{escape(job["payload"]["objective"])}</td><td>{escape(job["payload"]["owner"])}</td><td>{escape(job["payload"]["workflow"])}</td><td><span class="status">{escape(job["status"])}</span></td><td><details><summary>Review results</summary><pre>{escape(__import__("json").dumps(job["result"], indent=2))}</pre><p>Work order: {escape(job["id"])}</p><p>Review hash: {escape(job["result_hash"])}</p></details></td></tr>' for job in jobs)
    events = ''.join(f'<li><strong>{escape(e["action"])}</strong> · {escape(e["actor"])}<br><small>{escape(e["at"])} · {escape(e["job_id"])}</small></li>' for e in engine.events()[:40])
    approved = sum(j["status"] == "approved" for j in jobs)
    awaiting = sum(j["status"] == "awaiting_review" for j in jobs)
    page = '''<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>ETL GeoAgent OS | Operations</title><style>
    :root{color-scheme:dark;font-family:system-ui,sans-serif;background:#091522;color:#f4f6f8}*{box-sizing:border-box}body{margin:0}main{max-width:1180px;margin:auto;padding:48px 24px}header{border-bottom:1px solid #334557;padding-bottom:32px}h1{font-size:clamp(32px,5vw,58px);margin:12px 0}h2{margin-top:40px}p{line-height:1.65;color:#ced8e2}.eyebrow{color:#e3be71;text-transform:uppercase;font-size:12px;letter-spacing:2px}a{color:#7be0cf}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}article{background:#132537;border:1px solid #334557;border-radius:16px;padding:22px}h3{overflow-wrap:anywhere}.metric{font-size:38px;color:#7be0cf;margin:0}.table-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse;text-align:left}th,td{padding:18px 12px;border-bottom:1px solid #334557;vertical-align:top}.status{color:#e3be71}summary{cursor:pointer;color:#7be0cf}pre{max-width:460px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px}li{margin-bottom:18px}small{color:#b5c4d3;overflow-wrap:anywhere}.notice{border-left:3px solid #e3be71;padding:8px 18px}footer{margin-top:40px;color:#b5c4d3}
    </style></head><body><main><header><p class="eyebrow">ETL GIS Consulting LLC · Operations pilot</p><h1>ETL GeoAgent OS</h1><p>Human-led. Agent-powered. Spatially intelligent.</p><p class="notice">Read-only snapshot using public synthetic data. Human approvals are recorded through the local command-line workflow. AI drafts require a configured provider; template outputs are identified in each result.</p></header>'''
    page += f'<h2>Operational overview</h2><div class="grid"><article><p class="metric">{len(jobs)}</p><p>Work orders</p></article><article><p class="metric">{awaiting}</p><p>Awaiting human review</p></article><article><p class="metric">{approved}</p><p>Approved deliverables</p></article></div>'
    page += '<h2>Agent workforce</h2><div class="grid">' + cards + '</div><h2>Work orders</h2><div class="table-wrap"><table><thead><tr><th>Objective</th><th>Human owner</th><th>Workflow</th><th>Status</th><th>Evidence</th></tr></thead><tbody>' + (rows or '<tr><td colspan="5">No work orders yet.</td></tr>') + '</tbody></table></div><h2>Audit trail</h2><ol>' + (events or '<li>No events yet.</li>') + '</ol><footer>Local pilot. Approval does not publish, email, invoice, or modify GIS services.</footer></main></body></html>'
    path = Path(destination)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(page)
    return str(path)
