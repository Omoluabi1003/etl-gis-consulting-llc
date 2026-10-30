# Globe visuals within the consulting website

The homepage uses geographic globe imagery as part of its existing design. The hero replaces the simulated dashboard with an interactive Earth; the About section replaces radar rings with a quieter static Earth. The separate RustGIS navigation, promotion, application page, renderer dependencies and approximately 41 MB application bundle have been removed. AgentOS and the consulting content remain independent.

`assets/js/earth-globe.js` is a native WebGL renderer, not an embedded GIS application. It maps local equirectangular satellite textures onto an orthographic sphere with illustrative lighting and a restrained atmospheric edge. Geographic coordinates position the Florida home-base marker. No live network activity, service status or operational metrics are represented.

The hero rotates slowly while visible and supports pause, horizontal drag and keyboard arrow/Home controls. Manual interaction pauses automatic rotation. Reduced-motion preference stops automatic rotation; scrolling the globe out of view or hiding the tab suspends the animation. The About globe is static. Pixel density is capped at 1.7 and rendering at approximately 30 frames per second. Images are shared between instances.

If WebGL is unavailable or the context is lost, a Canvas 2D fallback projects the same satellite pixels onto a sphere. It is static by default, while manual geographic rotation remains available. The surrounding content, navigation and consultation links work without JavaScript. No third-party renderer, map tiles, GIS runtime or WASM file is requested by the globe.

## Imagery and source credit

Textures are reused from the owner's WaveAtlas repository, inspected at `386a5e70f41ba5ccd57fda55f2f9e0f15b55f5d3`, `public/earth/`. Its `ATTRIBUTION.md` identifies the source and applied resampling/WebP compression. The copied image files are unchanged:

- `day-2048.webp` (about 185 KB): NASA Blue Marble, Land Surface, Ocean Color and Sea Ice. NASA Goddard Space Flight Center; Reto Stöckli, with enhancements by Robert Simmon. Original: https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_2048.jpg
- `night-1024.webp` (about 37 KB): NASA Earth Observatory, Earth's City Lights. Defense Meteorological Satellite Program observations. Original: https://eoimages.gsfc.nasa.gov/images/imagerecords/55000/55167/earth_lights_lrg.jpg

These are historical composites, not live satellite images or a current daylight model. The rendering uses fixed illustrative light. No NASA logo or endorsement is implied. NASA media guidance: https://www.nasa.gov/nasa-brand-center/images-and-media/. Imagery credit is also available directly below the hero globe.

## Validation

Run `node scripts/test-earth-globe.js` for projection centering, orientation, visible hemisphere, Florida placement and dateline checks. With a local server on port 8010, Playwright and Chromium available, run `node scripts/test-earth-globe-browser.js`. `GLOBE_TEST_ORIGIN` and `CHROMIUM_PATH` override those paths.

The browser test exercises the actual shader with external requests blocked, controls, reduced motion, viewport suspension, mobile bounds and the non-WebGL fallback. Screenshots are written outside the checkout under `/tmp/etl-globe-*.png`. The globe is a visual introduction to the consulting services, not a new product or a claimed GIS analysis service.
