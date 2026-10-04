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
- **agentos/** – Secured Agent Command Center for the governed digital workforce.
- **agentos/** (JavaScript modules) – Agent definitions, workflow lifecycle, approval boundaries, audit events, and allowlisted GIS tools.
- **database/agentos-schema.sql** – PostgreSQL/Supabase persistence schema for tasks, approvals, and audit events.

## Getting Started

1. Clone the repository and open the project directory.
2. Launch a local web server (e.g., `python -m http.server`) from the project root.
3. Navigate to `http://localhost:8000` to explore the site.

The pages are built with semantic HTML5, modern CSS, and lightweight JavaScript so no build steps are required.

## ETL GIS AgentOS

AgentOS is additive to the public marketing site. The `/agentos/` command center loads the seven standardized agent definitions publicly, but operational records and mutations require a server-side access token. It does not ship demonstration activity or fabricated metrics: until tasks are submitted, all operational counts are zero.

### Configure the operational backend

1. Run `database/agentos-schema.sql` in the existing Supabase PostgreSQL project.
2. Configure these server-side environment variables in the deployment platform:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (required for AgentOS; the browser never receives it)
   - `AGENTOS_ACCESS_TOKEN` (a long, randomly generated supervisor token)
3. Deploy and open `/agentos/`. Enter the supervisor token when prompted. It is kept in browser `sessionStorage` for the current tab only.

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
