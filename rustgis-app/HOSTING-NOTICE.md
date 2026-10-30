# RustGIS hosting adaptation

RustGIS is an independent Apache-2.0 project by OpenGeos and contributors. This directory contains its official prebuilt browser distribution, pinned and verified as recorded in `PROVENANCE.json`. Original `LICENSE` and `THIRD-PARTY-LICENSES.txt` accompany the unchanged compiled engine and JavaScript modules.

ETL GIS modified only the HTML hosting wrapper: relative asset paths, local icons, removal of the upstream analytics tags, and omission of the root-path PWA/service-worker setup. These changes allow the application to run at `/rustgis-app/` without depending on `web.rustgis.app` or installing a worker that expects the site's root. This copy is not automatically updated from upstream.

Starter data is Natural Earth public-domain data from the pinned `opengeos/rustgis-assets` repository: 177 country polygons and 243 city points. The feature collections are served from `data/` on the same website.

The engine's optional online basemaps, plugins, GeoLibre tools, sign-in and AI providers may still require external services. ETL GIS does not supply their credentials or change their terms. The core application and local starter layers do not require those services. The first engine load transfers approximately 41 MB before HTTP compression.

The application runs as trusted JavaScript/WebAssembly on the website's origin. The iframe's sandbox flags are not a separate-origin isolation guarantee: scripts and same-origin access are enabled for the application. Embedded settings stay in memory according to the upstream embed implementation; the parent UI does not process project payloads or automatically transfer local Point Explorer files. Assess origin isolation separately before hosting sensitive workflows.
