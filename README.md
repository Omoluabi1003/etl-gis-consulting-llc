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

## Getting Started

1. Clone the repository and open the project directory.
2. Launch a local web server (e.g., `python -m http.server`) from the project root.
3. Navigate to `http://localhost:8000` to explore the site.

The pages are built with semantic HTML5, modern CSS, and lightweight JavaScript so no build steps are required.

## Procedural GIS Imagery

The hero visuals for the transit, utilities, and emergency response case studies are generated with a lightweight Pillow pipeline that procedurally composes skylines, transportation ribbons, incident markers, and cinematic post-effects without depending on matplotlib or numpy. Rebuild the renders by running:

```bash
python tools/imagery_generator.py
```

Fresh images are written to `assets/images/generated/scene-<name>.png` so they can be dropped into page layouts as needed.
The generated PNG files are ignored by git to keep the repository lightweight—run the command above whenever you need new
renders.

## Customization Tips

- Replace image placeholders in `assets/images/` with brand photography or project visuals.
- Update company contact details and metrics to reflect current information.
- Extend `assets/js/scripts.js` to integrate analytics, CRM submissions, or marketing automation as needed.
