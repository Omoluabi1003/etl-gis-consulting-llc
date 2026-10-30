/* Supported OpenGeos RustGIS embed. No project/data bridge is enabled. */
(function (root) {
  'use strict';
  const ORIGIN = 'https://web.rustgis.app';
  function isReady(event, frame) {
    return Boolean(frame && event.source === frame.contentWindow && event.origin === ORIGIN &&
      event.data && typeof event.data === 'object' && event.data.rustgis === 'ready');
  }
  if (typeof module !== 'undefined' && module.exports) { module.exports = { ORIGIN, isReady }; return; }
  const $ = (id) => document.getElementById(id);
  let frame = null, timer = null;
  const features = {
    data: { title: 'Bring your data. Build your map.', image: 'hero.webp', alt: 'OpenGeos RustGIS showing countries, cities, rivers, layers and a GIS ribbon.', items: ['Vector layers, attribute tables and SQL-based selection', 'GeoJSON, CSV, zipped Shapefiles, GeoTIFF and project files', 'Symbology, labels, projections and feature editing with undo'], note: 'Desktop-only database connections and external GDAL/DuckDB formats require the desktop application.' },
    analysis: { title: 'Go from locations to answers.', image: 'analysis.webp', alt: 'OpenGeos RustGIS showing buffer analysis around cities.', items: ['Buffer, Clip, Intersect, Dissolve and Spatial Join', 'Statistics, location-based selection and geometry calculations', 'ModelBuilder and extended GeoLibre toolsets'], note: 'Extended tools may download additional components. Check tool requirements before using a result in production.' },
    imagery: { title: 'See the surface. Understand the terrain.', image: 'raster.webp', alt: 'OpenGeos RustGIS displaying a shaded-relief elevation raster.', items: ['GeoTIFF and cloud-optimized GeoTIFF visualization', 'Raster styles, band combinations and shaded relief', 'Terrain, globe views and imagery workflows'], note: 'Large rasters depend on browser memory. Some raster formats and processing integrations require desktop software.' },
    publishing: { title: 'Make your findings presentation-ready.', image: 'layouts.webp', alt: 'OpenGeos RustGIS page layout with a map frame, legend and scale bar.', items: ['Map frames, legends, north arrows and scale bars', 'Page layouts, map series, reports and charts', 'PNG/PDF output and project sharing workflows'], note: 'Save and Export in the browser download files. Save your work before closing the embedded application.' },
  };
  function showFeature(key, focus = false) {
    const value = features[key];
    document.querySelectorAll('[data-rustgis-feature]').forEach((tab) => {
      const active = tab.dataset.rustgisFeature === key;
      tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    $('rustgis-feature-panel').setAttribute('aria-labelledby', `rustgis-tab-${key}`);
    $('rustgis-feature-title').textContent = value.title;
    $('rustgis-feature-image').src = `assets/images/rustgis/${value.image}`;
    $('rustgis-feature-image').alt = value.alt;
    $('rustgis-feature-list').replaceChildren(...value.items.map((text) => { const li = document.createElement('li'); li.textContent = text; return li; }));
    $('rustgis-feature-note').textContent = value.note;
  }
  const tabs = [...document.querySelectorAll('[data-rustgis-feature]')];
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => showFeature(tab.dataset.rustgisFeature));
    tab.addEventListener('keydown', (event) => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') target = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = tabs.length - 1;
      if (target !== undefined) { event.preventDefault(); showFeature(tabs[target].dataset.rustgisFeature, true); }
    });
  });
  $('load-rustgis').addEventListener('click', () => {
    if (frame) { frame.focus(); return; }
    frame = document.createElement('iframe');
    frame.title = 'RustGIS by OpenGeos — full browser GIS application';
    frame.src = `${ORIGIN}/?embed`;
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-downloads');
    frame.setAttribute('allow', 'fullscreen');
    frame.referrerPolicy = 'no-referrer';
    $('rustgis-frame-host').replaceChildren(frame);
    $('rustgis-embed-shell').hidden = false;
    $('rustgis-engine-status').textContent = 'Starting RustGIS. The app opens a blank project; use Add Data to begin.';
    $('load-rustgis').disabled = true;
    timer = setTimeout(() => {
      $('rustgis-engine-status').textContent = 'RustGIS has not reported readiness. You can keep waiting or open the application in a new tab.';
    }, 30000);
    $('rustgis-embed-shell').scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  root.addEventListener('message', (event) => {
    if (!isReady(event, frame)) return;
    clearTimeout(timer);
    $('rustgis-engine-status').textContent = 'RustGIS is ready. Use its Data ribbon to open files; Save and Export download your work.';
  });
  $('close-rustgis').addEventListener('click', () => {
    clearTimeout(timer); frame?.remove(); frame = null;
    $('rustgis-embed-shell').hidden = true; $('load-rustgis').disabled = false;
    $('rustgis-engine-status').textContent = 'RustGIS closed. Files in the local point explorer remain separate.';
    $('load-rustgis').focus();
  });
})(typeof window !== 'undefined' ? window : globalThis);
