# ETL GIS Consulting LLC Website

A polished, professional marketing website for ETL GIS Consulting LLC showcasing geospatial consulting services, project successes, and contact pathways.

## Structure

- **index.html** – Landing page with hero, solution overview, differentiators, testimonials, and call-to-action.
- **about.html** – Company mission, leadership team, values, and history timeline.
- **services.html** – Detailed service catalog, specialized offerings, success metrics, and engagement lifecycle.
- **projects.html** – Portfolio of recent projects, governance approach, and highlight metrics.
- **contact.html** – Consultation inquiry form, office details, and engagement options.
- **assets/css/styles.css** – Global typography, layout, responsive design, and component styling.
- **assets/js/scripts.js** – Navigation toggle, smooth scroll utilities, and form handling enhancements.
- **agentos/index.html** – Public, high-level AI consulting overview; no operational dashboard.
- **agentos/** (JavaScript modules) – Agent definitions, workflow lifecycle, approval boundaries, audit events, and allowlisted GIS tools.
- **database/agentos-schema.sql** – PostgreSQL/Supabase persistence schema for tasks, approvals, and audit events.

## Getting Started

1. Clone the repository and open the project directory.
2. Run `node scripts/build-site.js`, then serve the public output with `python -m http.server 8000 --directory site-dist`.
3. Navigate to `http://localhost:8000` to explore the site.

The pages use semantic HTML5, modern CSS and lightweight JavaScript. The public build copies an explicit set of pages and assets into `site-dist/`; internal source, SQL, scripts, pilot runtime and workflow documentation are excluded. `vercel.json` configures this output for deployment. Root `/api` functions remain server-side and are not copied into the static output.

## ETL GIS AgentOS

The public `/agentos/` page describes consulting outcomes only. It makes no operational requests and contains no agent roster, tools, task counts, activity status or control-plane instructions. The main navigation labels it AI Solutions.

All `/api/agentos` reads and writes, including definitions and default summary reads, require the existing server-side `AGENTOS_ACCESS_TOKEN` through a Bearer authorization header. Missing configuration fails closed. Do not place this token in the public site or a public browser bundle. This remains a shared server-managed supervisor gate, not SSO or named-user authentication.

### Configure the operational backend

1. Run `database/agentos-schema.sql` in the existing Supabase PostgreSQL project.
2. Configure these server-side environment variables in the deployment platform:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (required for AgentOS; the browser never receives it)
   - `AGENTOS_ACCESS_TOKEN` (a long, randomly generated supervisor token)
3. Use the private API from an authorized server-side integration. `/agentos/` remains a public consulting overview; it is not a supervisor login or control panel.

The API permits only three explicit operations: governed task submission, a read-only GeoJSON structural inspection, and recorded human approval decisions. Restricted actions create a pending approval request and stop; approval records authorization but does not silently execute the consequential action. Direct browser access to the AgentOS database tables should remain disabled by row-level security.

### Current integration boundary

AgentOS provides a production-oriented control-plane foundation, not autonomous external integrations. ArcGIS Enterprise/Online edits, production SQL, email campaigns, proposal submission, financial updates, and client communications have no execution adapter in this release. Their action identifiers are restricted by policy so future adapters can be introduced behind the same approval and audit boundary.

Run the repository checks with:

```bash
node scripts/lint-html.js
node scripts/typecheck-config.js
node scripts/build-check.js
node scripts/test-form-endpoints.js
node scripts/test-agentos.js
node scripts/test-public-site.js
```

## Procedural GIS Imagery

The hero visuals for the transit, utilities, and emergency response case studies are generated with a lightweight Pillow pipeline that procedurally composes skylines, transportation ribbons, incident markers, and cinematic post-effects without depending on matplotlib or numpy. Rebuild the renders by running:

```bash
python tools/imagery_generator.py
```

Fresh images are written to `assets/images/generated/scene-<name>.png` so they can be dropped into page layouts as needed.
The generated PNG files are ignored by git to keep the repository lightweight—run the command above whenever you need new
renders.

## GeoAware OS Governance

This repository follows GeoAware OS v1.0.0, a design and engineering philosophy founded by Paul Iyogun for calm, geography-first digital experiences where technology quietly guides discovery. Local governance is recorded in `.geoaware/constitution.json` and is intended to preserve performance, accessibility, restraint, and product coherence without changing application behavior.

## Customization Tips

- Replace image placeholders in `assets/images/` with brand photography or project visuals.
- Update company contact details and metrics to reflect current information.
- Extend `assets/js/scripts.js` to integrate analytics, CRM submissions, or marketing automation as needed.

## ETL GeoAgent OS operations pilot

The [GeoAgent OS guide](geoagent_os/README.md) documents a working local operations platform for human-supervised GIS screening, opportunity qualification, proposal outlines, client onboarding, and reporting. Six specialist agents run through three workflows, with SQLite audit records and review gates before deliverable export. Default business outputs are labeled templates; live AI drafting requires an explicitly configured provider adapter.

```bash
python -m unittest discover -s geoagent_os/tests -v
python -m geoagent_os.demo
```

Open the generated `geoagent_os/runtime/dashboard.html` locally to review the synthetic pilot. Runtime data is excluded from git. See the guide for approval commands, provider setup, and requirements before client deployment.

## Integrated globe visuals

The homepage hero and About section use a native WebGL globe with locally bundled NASA satellite imagery. The hero supports drag/keyboard rotation, pause, reduced motion and an image-based fallback. It loads no GIS application or external renderer. See [visual design and imagery credits](docs/globe-visuals.md).

## Specialist workflow playbook

The [ETL GIS agency playbook](docs/agency-playbook/README.md) evaluates the Agency Agents library and provides six focused GIS and delivery role briefs, evidence-linked handoffs, four workflow runbooks, and 20 proposed evaluation cases. It is documentation for human-supervised work; it does not install agents, enable a provider, or change runtime permissions.
