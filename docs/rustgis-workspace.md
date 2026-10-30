# RustGIS website workspace

The consulting website now has a public `rustgis.html` workspace, homepage navigation and feature entry, a services-page entry, and a sitemap record. This is an additive static-site feature: no server credentials, package installation, database or build step is required.

## Official RustGIS application

The full GIS is **OpenGeos RustGIS**, https://github.com/opengeos/RustGIS. Inspected source revision `bd9cb7c1fe046f3f270cd126fc850ddbb0c53658`: `README.md`, `docs/installation.md`, `docs/python.md`, `apps/rustgis-web/index.html`, `apps/rustgis-web/src/main.rs`, and `apps/rustgis-web/src/embed.rs`.

The page now provides:

- A feature catalogue with genuine upstream screenshots: vector/cartographic workflows, geoprocessing, raster/terrain, and map layouts/publishing. These describe the upstream app; they are not claims that the local Point Explorer implements those operations.
- A user-initiated iframe using the same-site `/rustgis-app/?embed` distribution. Curated starters add fixed local public-data and projection flags. The 41 MB engine is requested only when Launch is clicked. The new-tab destination is also local; desktop-release links remain upstream.
- The site origin and exact iframe window are checked for readiness. The trusted vendored engine runs with sandbox flags (`allow-scripts allow-same-origin allow-downloads`); because it shares the site origin, these flags are not an origin-isolation boundary. There is no automatic credential/data bridge. No imported Point Explorer features are sent to RustGIS. No `project`, command or result messages are processed by the parent.
- Readiness only from `{rustgis: "ready"}` messages whose origin is exactly the current website origin and whose source is the active iframe's window. A frame load event alone never marks the GIS ready. A 30-second status offers the new-tab fallback; a late valid ready message can still complete startup.
- Save/export guidance plus a confirmation dialog before closing or replacing an active session. Cancelling retains the same iframe. The upstream embed mode initializes a blank project and then loads any selected public starter data; it keeps settings in memory. The vendored application is pinned and does not auto-update from upstream.

### Guided starters

- **Your own data:** an empty embedded project. Visitors open their own files inside RustGIS; the parent page does not read or transfer them.
- **World map:** repeats the upstream `data` flag for the public Natural Earth `countries.geojson` and `cities.geojson` at the same-site `/rustgis-app/data/` path.
- **Globe exploration:** sets `projection=globe` with the public countries layer.

The upstream `apps/rustgis-web/src/web.rs` startup path was inspected: `projection` and repeated `data` flags are applied in embedded mode. The `ready` protocol means the app initialized, not that asynchronous dataset loads succeeded. No completion counts or layer success claims are inferred from it.

Starter selection updates the first-three-steps guide, matching new-tab links, and a shareable page query (`?workflow=world`, `?workflow=globe`, or `?workflow=blank`). Opening a shared link never starts the full application automatically. Only known starter keys are accepted; unknown keys fall back to blank and cannot inject arbitrary data URLs. No user-provided URLs, credentials or local features are passed through.

While a session is active, changing the selected radio does not navigate or destroy it. Launching a different starter opens a save-first dialog; Keep current workspace and Escape leave the iframe intact. Confirming starts a fresh session. Returning to the active starter simply focuses the existing session. Closing also requires confirmation. These controls do not detect edits inside the application or save its files automatically; closing the browser/tab itself is outside this confirmation flow.

Fullscreen uses the browser's Fullscreen API when available, with a standard-layout fallback. No browser permission is requested until the visitor presses the fullscreen button.

Full RustGIS needs an Internet connection and WebGPU or WebGL2. Browser file open/save differs from desktop: saves/export download files, while process plugins, external GDAL/DuckDB paths and native database integrations have desktop requirements. Optional AI or online-data features can send data to the chosen provider; that upstream configuration is not supplied or enabled by this site.

**Verified self-hosted fix:** the external domain failed HTTPS for a user and was inaccessible through this environment. Launch and new-tab links now use the official prebuilt app hosted directly under `/rustgis-app/`, without that domain. `scripts/test-rustgis-runtime.js` runs the actual Rust/WASM engine with external requests blocked: it verifies readiness, actual project layers containing 177 countries and 243 cities, a successful vector import command, and standalone startup. The separate UI browser suite still uses a protocol fixture for interaction tests; it is not substituted for this real-engine test. Optional provider features and production deployment are not established by these local checks. No TLS checks were disabled and no network policy was changed.

RustGIS is attributed to OpenGeos and contributors. ETL GIS is the consulting/integration provider, not represented as the author of upstream RustGIS or an Esri affiliate.

## Point Explorer: WaveAtlas patterns

Inspected `Omoluabi1003/WaveAtlas` at revision `386a5e70f41ba5ccd57fda55f2f9e0f15b55f5d3`. The source records its canonical product URL as **https://wave-atlas.vercel.app** in `lib/branding.ts`. Product availability and live tile-service availability were not established by source inspection.

| WaveAtlas source | Existing capability | Website use |
| --- | --- | --- |
| `lib/map-basemaps.ts` | OpenFreeMap vector styles, Esri World Imagery, OpenTopoMap, NASA imagery | Adapted provider configurations and attribution for explicitly selected online basemaps. |
| `lib/map-camera.ts` | Camera targeting, haversine distance, reduced-motion behavior | Local point selection, fit/zoom and spherical proximity analysis. Full WaveAtlas camera policies are not transplanted. |
| `lib/geo-selection-engine.ts` | Geographic candidate ranking and station selection | Geographic-selection concept adapted to generic civic/utility/response points, without station/audio dependencies. |
| `lib/globe-math.ts`, `lib/globe-renderer-adapter.ts` | Globe projection, inversion and renderer boundaries | Described as existing WaveAtlas capabilities and linked to that product; not implemented as a globe on this page. |
| `lib/geotruth-resolver.ts`, `lib/geoaware-core.ts` | Location provenance/precision and place resolution | Described with a WaveAtlas link. Imported points in the new workspace are explicitly unverified, not sent to these services. |

WaveAtlas supplies the MapLibre and geographic-selection patterns used by the separate ETL GIS Point Explorer. It is not presented as the source of the OpenGeos RustGIS engine. The site does not supply an ArcGIS Enterprise account, Esri partnership or certification.

## Implemented in the ETL GIS Point Explorer

- Browser-local WGS84 Point GeoJSON import, capped at 1,500 features and 2 MB. Invalid imports leave current data unchanged. Import replaces the synthetic sample; reset clears imported data.
- Visibility controls, attribute search, keyboard-accessible feature selection, safe attribute rendering, a feature table, and fit/zoom.
- Spherical distance and a geodesic radius outline for visible points within 0.5–5 km of the selected center, including the center itself. This is not travel time, route calculation, polygon intersection or network service-area analysis.
- GeoJSON export of the current layer/search/proximity results, preserving source feature IDs, coordinates and attributes. Internal layer colors, keys and derived distances are not inserted into exported records.
- Offline coordinate-grid rendering by default. Online basemaps use MapLibre; load failures restore the grid without discarding features. Source attribution remains visible on online maps.

Basemap requests disclose the viewed geographic area and ordinary request metadata to third-party providers. Imported feature properties are never sent as part of tile requests. No feature persistence or backend upload is implemented. Confidential datasets should be handled in an approved deployment, not a public demonstration.

## Runtime and vendor provenance

`assets/js/rustgis-core.js` implements dependency-free point operations for the browser and Node tests. `assets/js/rustgis.js` supplies UI state, rendering, imports/exports and optional MapLibre views. The site hosts MapLibre locally so it does not fetch executable JavaScript from a CDN.

MapLibre GL JS **5.24.0** matches the version range in the inspected WaveAtlas manifest. The distributed JS, CSS and license are in `assets/vendor/maplibre-gl/`, extracted from the npm registry package after checking this published SHA-512 integrity:

```text
sha512-ALyFxgtd5R+65UqZ/++lOqwWcC0SNho9c27fYSyLmG7AfnAul2o46F05aDJGPbFU57wos9dgcIySHs0Xe6ia3A==
```

Keep `LICENSE.txt`, including bundled dependency notices, with those assets. Online provider access and permitted usage remain subject to each provider's terms; public tile availability does not establish a commercial imagery license, an Esri subscription, or guaranteed service levels.

## Validation

```bash
node scripts/test-rustgis.js
node scripts/lint-html.js
node scripts/typecheck-config.js
node scripts/build-check.js
node scripts/test-form-endpoints.js
node scripts/test-agentos.js
```

The fifteen core tests cover six embed/starter-origin/window/protocol checks plus nine point-operation cases for coordinate/CRS validation, feature caps, distance reference values and edge cases, search, proximity ordering, source-preserving exports and radius geometry. CI runs these alongside the existing Node checks.

For browser checks, use an environment with Playwright and Chromium, start `python3 -m http.server 8010 --bind 127.0.0.1` from the repository root, then run `node scripts/test-rustgis-browser.js`. `RUSTGIS_TEST_ORIGIN` and `CHROMIUM_PATH` override the test server and browser. These browser dependencies are optional development tools and are not required by the website. The browser suite blocks live external services, checks guided starters, shared links, confirmation cancellation/replacement, fullscreen, feature tabs and the opt-in RustGIS embed against a protocol fixture, checks real local Point Explorer interactions, exercises MapLibre with a local style fixture, and tests the basemap failure path. It does not certify live provider availability, production browser coverage, or legal accessibility conformance.

## Screenshot provenance and license

The unmodified RustGIS screenshots in `assets/images/rustgis/` come from `opengeos/rustgis-assets` revision `cae4058c8effed366d3c46ccfa7de03f797eb8a0`: `images/hero.webp`, `images/buffer-history.webp`, `images/raster.webp`, and `images/layout.webp`. The files are respectively saved as `hero.webp`, `analysis.webp`, `raster.webp`, and `layouts.webp`. The source README states these screenshots are rendered using the RustGIS headless harness and licenses assets under Apache-2.0. The original license is retained as `assets/images/rustgis/LICENSE.txt`, with source credit visible on the page. The separate `rustgis-app/` directory redistributes the pinned official web engine with its own full licenses and notices; see below.

## Self-hosted engine provenance

The distribution is from `opengeos/rustgis-web` commit `93dceb34297361aa42cae1d40c1f0ae5cbd66a13`, the hosting repository used by the upstream `web-deploy.yml` workflow. Original SHA-384 SRI entries were verified against JS, WASM and snippet bytes. `rustgis-app/PROVENANCE.json` records SHA-256 hashes; the normal asset build check verifies them on every run. The compiled modules are unchanged. The adapted HTML uses relative paths and local icons, omits upstream analytics, and does not register the original root-path service worker. `LICENSE`, `THIRD-PARTY-LICENSES.txt`, and `HOSTING-NOTICE.md` accompany the distribution.

The launcher emits bare `?embed`/`?blank` flags. RustGIS's parser does not treat `?embed=`/`?blank=` as equivalent. Regression tests assert this spelling, and the real world starter test checks the actual engine protocol. Public sample data is served locally from the pinned Natural Earth files; optional plugins, online basemaps, GeoLibre tools and AI still have independent network requirements.

Run `node scripts/test-rustgis-runtime.js` with the same local server and browser prerequisites as the UI suite. CI now includes a dedicated real-engine browser job using Playwright 1.62.1; the browser tools are installed outside the checkout. The first app load is approximately 41 MB before compression. The included WebAssembly file is approximately 40.5 MB; it is a static asset, not a serverless function. The vendored build must be updated deliberately with fresh provenance and repeat validation. Review the same-origin trust note in `rustgis-app/HOSTING-NOTICE.md` before using sensitive data.
