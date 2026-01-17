# Authenticity Audit (Before/After)

## Scope & Route Inventory
**Production base:** https://etl-gis-consulting-llc.vercel.app  
**Codebase routes:** `/`, `/about.html`, `/services.html`, `/projects.html`, `/contact.html`, `/privacy.html`, `/terms.html`, `/services/strategy-roadmapping.html`, `/services/enterprise-architecture.html`, `/services/spatial-analytics-enablement.html`, `/services/managed-gis-operations.html`, `/case-studies/metro-mobility-analytics.html`, `/case-studies/st-lucie-modernization.html`, plus static PDFs under `/assets/downloads/`.  
**Sitemap confirmation:** `sitemap.xml` includes the core pages plus case studies and new trust artifacts.【F:sitemap.xml†L1-L46】

## CTA & Link Map (all links/CTAs by page)
> Format: `line: target` (path includes `F:` reference).

### `index.html`
```
91: #main-content
94: #top
109: #top
110: #services
111: #insights
112: #compliance
113: #founder
114: #connect
115: https://etl-gis-consulting-llc.vercel.app/services.html
116: https://etl-gis-consulting-llc.vercel.app/projects.html
117: https://etl-gis-consulting-llc.vercel.app/about.html
118: https://cal.com/etl-gis/consultation
123: https://cal.com/etl-gis/consultation
136: https://etl-gis-consulting-llc.vercel.app/services.html
137: #connect
138: https://cal.com/etl-gis/consultation
151: mailto:contact@etl-gis.com
153: https://linkedin.com/in/paul-iyogun-7591a571
177: services/strategy-roadmapping.html
178: #connect
191: services/enterprise-architecture.html
192: #connect
205: https://etl-gis-consulting-llc.vercel.app/projects.html#analytics
206: #connect
219: services/managed-gis-operations.html
220: #connect
264: button:data-case-modal-trigger=modal-metro
265: https://etl-gis-consulting-llc.vercel.app/case-studies/metro-mobility-analytics.html
275: button:data-case-modal-trigger=modal-utility
276: services/enterprise-architecture.html
286: button:data-case-modal-trigger=modal-emergency
287: https://etl-gis-consulting-llc.vercel.app/projects.html#public-safety
329: assets/downloads/cjis-alignment-brief.pdf
330: #connect
336: privacy.html
337: terms.html
338: assets/downloads/cjis-alignment-brief.pdf
389: assets/downloads/utility-network-modernization-playbook.pdf
393: assets/downloads/public-agency-analytics-playbook.pdf
397: assets/downloads/cjis-alignment-brief.pdf
423: https://linkedin.com/in/paul-iyogun-7591a571
424: #connect
435: https://etl-gis-consulting-llc.vercel.app/contact.html
436: mailto:contact@etl-gis.com
505: #connect
526: mailto:contact@etl-gis.com
531: https://etl-gis-consulting-llc.vercel.app/services.html
532: https://etl-gis-consulting-llc.vercel.app/projects.html
533: https://etl-gis-consulting-llc.vercel.app/contact.html
534: #compliance
540: privacy.html
541: terms.html
542: assets/downloads/cjis-alignment-brief.pdf
568: case-studies/metro-mobility-analytics.html
569: #playbooks
590: projects.html
591: #playbooks
612: projects.html
613: #playbooks
624: privacy.html
627: #top
```
Source: `index.html` line references above.【F:index.html†L91-L627】

### `about.html`
```
76: #main-content
79: index.html
94: index.html
95: about.html
96: services.html
97: projects.html
98: contact.html
99: https://cal.com/etl-gis/consultation
104: https://cal.com/etl-gis/consultation
117: projects.html
118: mailto:contact@etl-gis.com
264: contact.html
265: mailto:contact@etl-gis.com
271: contact.html
292: mailto:contact@etl-gis.com
297: services.html
298: projects.html
299: contact.html
300: index.html#compliance
306: privacy.html
307: terms.html
308: assets/downloads/cjis-alignment-brief.pdf
324: privacy.html
327: #
```
Source: `about.html` line references above.【F:about.html†L76-L327】

### `services.html`
```
116: #main-content
119: index.html
134: index.html
135: about.html
136: services.html
137: projects.html
138: contact.html
139: https://cal.com/etl-gis/consultation
144: https://cal.com/etl-gis/consultation
157: #service-catalog
158: contact.html
234: services/strategy-roadmapping.html
235: contact.html
242: services/enterprise-architecture.html
243: contact.html
250: services/spatial-analytics-enablement.html
251: contact.html
258: services/managed-gis-operations.html
259: contact.html
400: contact.html
421: mailto:contact@etl-gis.com
426: services.html
427: projects.html
428: contact.html
429: index.html#compliance
435: privacy.html
436: terms.html
437: assets/downloads/cjis-alignment-brief.pdf
453: privacy.html
456: #
```
Source: `services.html` line references above.【F:services.html†L116-L456】

### `projects.html`
```
90: #main-content
93: index.html
108: index.html
109: about.html
110: services.html
111: projects.html
112: contact.html
113: https://cal.com/etl-gis/consultation
118: https://cal.com/etl-gis/consultation
131: #case-studies
132: contact.html
168: case-studies/metro-mobility-analytics.html
184: case-studies/st-lucie-modernization.html
200: https://keyville.vercel.app/platform
272: contact.html
273: services.html
278: contact.html
299: mailto:contact@etl-gis.com
304: services.html
305: projects.html
306: contact.html
307: index.html#compliance
313: privacy.html
314: terms.html
315: assets/downloads/cjis-alignment-brief.pdf
331: privacy.html
334: #
```
Source: `projects.html` line references above.【F:projects.html†L90-L334】

### `contact.html`
```
97: #main-content
100: index.html
115: index.html
116: about.html
117: services.html
118: projects.html
119: contact.html
120: https://cal.com/etl-gis/consultation
125: https://cal.com/etl-gis/consultation
138: #contact-form
139: https://cal.com/etl-gis/consultation
156: mailto:contact@etl-gis.com
173: mailto:contact@etl-gis.com
174: https://cal.com/etl-gis/consultation
176: mailto:press@etl-gis.com
177: mailto:careers@etl-gis.com
294: mailto:newsletter@etl-gis.com
295: about.html
300: #contact-form
321: mailto:contact@etl-gis.com
326: services.html
327: projects.html
328: contact.html
329: index.html#compliance
335: privacy.html
336: terms.html
337: assets/downloads/cjis-alignment-brief.pdf
353: privacy.html
356: #
```
Source: `contact.html` line references above.【F:contact.html†L97-L356】

### Case Studies (`case-studies/metro-mobility-analytics.html`, `case-studies/st-lucie-modernization.html`)
```
Metro: 119 #main-content, 122 ../index.html, 137-141 site nav, 142/147 https://cal.com/etl-gis/consultation, 360-361 CTAs, 388 mailto:contact@etl-gis.com, 389 https://cal.com/etl-gis/consult, 395 LinkedIn, 396 ../index.html#compliance, 402-404 trust links, 419 ../privacy.html, 421 #
St. Lucie: 119 #main-content, 122 ../index.html, 137-141 site nav, 142/147 https://cal.com/etl-gis/consultation, 360-361 CTAs, 388 mailto:contact@etl-gis.com, 389 https://cal.com/etl-gis/consult, 395 LinkedIn, 396 ../index.html#compliance, 402-404 trust links, 419 ../privacy.html, 421 #
```
Source: case study files line references above.【F:case-studies/metro-mobility-analytics.html†L119-L421】【F:case-studies/st-lucie-modernization.html†L119-L421】

### Service detail pages
```
Enterprise Architecture: 69 #main-content, 72-92 nav, 111/112 contact + cal, 209/210 CTA, 236 mailto, 241-244 footer links, 250-252 trust links, 268 privacy
Spatial Analytics Enablement: 69 #main-content, 72-92 nav, 111/112 contact + cal, 209/210 CTA, 236 mailto, 241-244 footer links, 250-252 trust links, 268 privacy
Managed GIS Operations: 69 #main-content, 72-92 nav, 111/112 contact + cal, 209/210 CTA, 236 mailto, 241-244 footer links, 250-252 trust links, 268 privacy
Strategy & Roadmapping: 69 #main-content, 72-92 nav, 111/112 contact + cal, 209/210 CTA, 236 mailto, 241-244 footer links, 250-252 trust links, 268 privacy
```
Sources: service detail files line references above.【F:services/enterprise-architecture.html†L69-L268】【F:services/spatial-analytics-enablement.html†L69-L268】【F:services/managed-gis-operations.html†L69-L268】【F:services/strategy-roadmapping.html†L69-L268】

### Trust pages (`privacy.html`, `terms.html`)
```
Privacy: 36 #main-content, 39-65 nav, 126 mailto:contact@etl-gis.com, 166-178 trust links, 187-193 consent banner
Terms: 36 #main-content, 39-65 nav, 129 mailto:contact@etl-gis.com, 165-167 trust links, 183 consent banner
```
Sources: trust pages line references above.【F:privacy.html†L36-L193】【F:terms.html†L36-L183】

## Contact Details, Addresses, Brand Identifiers
**Primary business email:** `contact@etl-gis.com` used across site and footers.【F:index.html†L526-L543】  
**Additional inboxes:** `press@etl-gis.com`, `careers@etl-gis.com`, and `newsletter@etl-gis.com` (for updates).【F:contact.html†L173-L295】  
**Headquarters statement:** Port St. Lucie, Florida (EST), remote-first team.【F:index.html†L523-L526】  
**Brand identifiers:** ETL GIS Consulting LLC name, logo, and taglines in headers/footers.【F:index.html†L510-L548】

## Metrics, Claims, Testimonials
### Before (Issues Observed)
* Numeric claims (“40+ programs,” “18+ years,” “100% alignment,” “24/7 support,” and metric-heavy case-study outcomes) were presented as fixed performance indicators without supporting evidence. (Resolved—see After section for reframed language and anonymized outcome framing.)

### After (Resolved)
* Metric blocks now use defensible, qualitative labels (“Program delivery,” “Compliance focus,” “Operational continuity”) instead of numeric claims.【F:index.html†L226-L247】  
* Testimonials replaced with anonymized “client outcomes we commonly deliver” language, and the video is labeled as a representative narrative rather than a direct quote.【F:index.html†L291-L305】  
* Case-study outcomes replaced with qualitative or multi-agency descriptions and numeric values removed from both metadata and body sections.【F:case-studies/metro-mobility-analytics.html†L62-L190】【F:case-studies/st-lucie-modernization.html†L78-L190】

## Forms Inventory
### Consultation Request (Homepage + Contact)
* **Homepage form fields:** name, email, organization, interest, goals, timezone, kickoff date, consent checkbox, honeypot, and UTM/referrer capture.【F:index.html†L440-L498】  
* **Contact page form fields:** name, email, organization, interest, timeline, message, consent checkbox, honeypot, and UTM/referrer capture.【F:contact.html†L181-L238】  
* **Validation & UX:** client-side required validation, secure submit messaging, and lead ID confirmation responses implemented in `assets/js/scripts.js`.【F:assets/js/scripts.js†L373-L469】  
* **Submission endpoint:** `/api/consultation` with server-side validation, rate limiting, and logging.【F:assets/js/scripts.js†L421-L434】【F:api/consultation.js†L15-L143】

### Playbook Unlock Form
* **Fields:** full name, email, organization, consent checkbox, honeypot, UTM/referrer capture, and resource identifier.【F:index.html†L343-L378】  
* **Delivery:** immediate on-page access plus confirmation email with download links from `/api/playbook`.【F:index.html†L381-L400】【F:assets/js/scripts.js†L437-L469】【F:api/playbook.js†L24-L146】

## Analytics & Consent
### Before (Issues Observed)
* Analytics consent language existed but lacked explicit preference controls and privacy policy entry point.

### After (Resolved)
* Consent banner gates Plausible analytics and persists decision with timestamp; preferences can be reopened from footer link.【F:assets/js/scripts.js†L570-L619】  
* Consent banner and privacy links added across pages, with clear accept/decline actions and policy link in the banner.【F:index.html†L618-L625】【F:privacy.html†L187-L193】

## Severity Summary (Before → After)
### Critical
* **Forms lacked production-grade handling** → replaced with `/api` serverless endpoints, storage, rate limits, and confirmation emails.【F:api/consultation.js†L15-L143】【F:api/playbook.js†L24-L146】
* **Consent-based analytics not enforceable** → added consent gating, persistent preferences, and banner controls.【F:assets/js/scripts.js†L570-L619】【F:index.html†L618-L625】

### High
* **Template-looking contact data (Gmail + placeholder phone)** → standardized on domain-based contact inbox and removed phone placeholders, updated footers and contact surfaces.【F:index.html†L523-L543】【F:contact.html†L171-L238】
* **Unverifiable metrics/testimonials** → reframed as qualitative outcomes and anonymized narratives across homepage and case studies.【F:index.html†L226-L305】【F:case-studies/metro-mobility-analytics.html†L62-L190】

### Medium
* **Trust artifacts missing** → added Privacy Policy, Terms of Service, and Trust Center links across the site plus a dedicated trust section on the homepage.【F:privacy.html†L1-L199】【F:terms.html†L1-L199】【F:index.html†L309-L339】
* **Playbook “instant access” language vs. actual flow** → updated copy to reflect email delivery and consent requirements.【F:index.html†L343-L378】

### Low
* **Footer analytics preference control** → added “Manage analytics preferences” link in footers and consistent trust links across templates.【F:index.html†L537-L544】【F:privacy.html†L173-L179】
