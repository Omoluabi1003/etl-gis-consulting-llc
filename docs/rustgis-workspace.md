# RUSTGIS website workspace

The consulting website now has a public `rustgis.html` workspace, homepage navigation and feature entry, a services-page entry, and a sitemap record. This is an additive static-site feature: no server credentials, package installation, database or build step is required.

## Existing product source

Inspected `Omoluabi1003/WaveAtlas` at revision `386a5e70f41ba5ccd57fda55f2f9e0f15b55f5d3`. The source records its canonical product URL as **https://wave-atlas.vercel.app** in `lib/branding.ts`. Product availability and live tile-service availability were not established by source inspection.

| WaveAtlas source | Existing capability | Website use |
| --- | --- | --- |
| `lib/map-basemaps.ts` | OpenFreeMap vector styles, Esri World Imagery, OpenTopoMap, NASA imagery | Adapted provider configurations and attribution for explicitly selected online basemaps. |
| `lib/map-camera.ts` | Camera targeting, haversine distance, reduced-motion behavior | Local point selection, fit/zoom and spherical proximity analysis. Full WaveAtlas camera policies are not transplanted. |
| `lib/geo-selection-engine.ts` | Geographic candidate ranking and station selection | Geographic-selection concept adapted to generic civic/utility/response points, without station/audio dependencies. |
| `lib/globe-math.ts`, `lib/globe-renderer-adapter.ts` | Globe projection, inversion and renderer boundaries | Described as existing WaveAtlas capabilities and linked to that product; not implemented as a globe on this page. |
| `lib/geotruth-resolver.ts`, `lib/geoaware-core.ts` | Location provenance/precision and place resolution | Described with a WaveAtlas link. Imported points in the new workspace are explicitly unverified, not sent to these services. |

No `rustgis` string or Rust engine was found in the inspected WaveAtlas tree. The RUSTGIS name follows the owner's description of the ecosystem. No Rust execution, ArcGIS Enterprise connection, Esri partnership, or certification is claimed by this implementation.

## Implemented here

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

The nine point-operation tests cover coordinate/CRS validation, feature caps, distance reference values and edge cases, search, proximity ordering, source-preserving exports and radius geometry. CI runs these alongside the existing Node checks.

For browser checks, use an environment with Playwright and Chromium, start `python3 -m http.server 8010 --bind 127.0.0.1` from the repository root, then run `node scripts/test-rustgis-browser.js`. `RUSTGIS_TEST_ORIGIN` and `CHROMIUM_PATH` override the test server and browser. These browser dependencies are optional development tools and are not required by the website. The browser suite blocks live external services, checks real local interactions, exercises MapLibre with a local style fixture, and tests the basemap failure path. It does not certify live provider availability, production browser coverage, or legal accessibility conformance.
