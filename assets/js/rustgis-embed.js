/* Supported OpenGeos RustGIS embed. No project/data bridge is enabled. */
(function (root) {
  'use strict';
  const ORIGIN = root.location?.origin || 'https://etl-gis-consulting-llc.vercel.app';
  const APP_PATH = '/rustgis-app/';
  const DATA = `${ORIGIN}${APP_PATH}data/`;
  const PRESETS = {
    blank: { name: 'Your own data', files: [], steps: ['Choose Data → Add Data to open a file from your device.', 'Inspect the coordinate system, attributes and layer style.', 'Use Save or Export to download your work before leaving.'] },
    world: { name: 'World map', files: ['countries.geojson', 'cities.geojson'], steps: ['Wait for the public Natural Earth countries and cities to load.', 'Inspect a layer’s attributes and try graduated symbology.', 'Use the Publish ribbon to prepare a layout and export a map.'] },
    globe: { name: 'Globe exploration', files: ['countries.geojson'], projection: 'globe', steps: ['Wait for the public countries layer to load on the globe.', 'Rotate the globe and select a country to inspect its attributes.', 'Try the View controls, then save or export before leaving.'] },
  };
  function launchURL(key, embedded = true) {
    if (!Object.hasOwn(PRESETS, key)) throw new Error('Unknown RustGIS starter.');
    if (key === 'blank' && embedded) return `${ORIGIN}${APP_PATH}?embed`;
    const url = new URL(APP_PATH, ORIGIN);
    url.searchParams.set(embedded ? 'embed' : 'blank', '');
    const preset = PRESETS[key];
    preset.files.forEach((file) => url.searchParams.append('data', DATA + file));
    if (preset.projection) url.searchParams.set('projection', preset.projection);
    // Upstream parses these as bare flags; `embed=` and `blank=` are not equivalent.
    return url.href.replace(embedded ? '?embed=' : '?blank=', embedded ? '?embed' : '?blank');
  }
  function isReady(event, frame) {
    return Boolean(frame && event.source === frame.contentWindow && event.origin === ORIGIN &&
      event.data && typeof event.data === 'object' && event.data.rustgis === 'ready');
  }
  if (typeof module !== 'undefined' && module.exports) { module.exports = { ORIGIN, isReady, launchURL }; return; }
  const $ = (id) => document.getElementById(id);
  const requested = new URL(root.location.href).searchParams.get('workflow');
  let selectedKey = Object.hasOwn(PRESETS, requested) ? requested : 'blank';
  let activeKey = null, frame = null, timer = null, pendingAction = null;
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
  function updateStarter() {
    document.querySelectorAll('[name="rustgis-starter"]').forEach((input) => { input.checked = input.value === selectedKey; });
    document.querySelectorAll('[data-rustgis-open]').forEach((link) => { link.href = launchURL(selectedKey, false); });
    $('starter-steps').replaceChildren(...PRESETS[selectedKey].steps.map((text) => { const li = document.createElement('li'); li.textContent = text; return li; }));
    $('starter-title').textContent = PRESETS[selectedKey].name;
    $('load-rustgis').textContent = !frame ? 'Launch selected workspace ↗' : activeKey === selectedKey ? 'Return to active workspace ↓' : 'Start selected workspace ↗';
    const url = new URL(root.location.href);
    url.searchParams.set('workflow', selectedKey);
    root.history.replaceState(null, '', url.href);
  }
  document.querySelectorAll('[name="rustgis-starter"]').forEach((input) => input.addEventListener('change', () => { selectedKey = input.value; updateStarter(); }));
  function destroyFrame() {
    clearTimeout(timer); frame?.remove(); frame = null; activeKey = null;
  }
  function start() {
    destroyFrame(); activeKey = selectedKey;
    frame = document.createElement('iframe');
    frame.title = 'RustGIS by OpenGeos — full browser GIS application';
    frame.src = launchURL(activeKey);
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-downloads');
    frame.setAttribute('allow', 'fullscreen');
    frame.referrerPolicy = 'no-referrer';
    $('rustgis-frame-host').replaceChildren(frame);
    $('rustgis-embed-shell').hidden = false;
    $('rustgis-engine-status').textContent = `Starting RustGIS: ${PRESETS[activeKey].name}. Public starter data may take additional time to load.`;
    $('active-starter-name').textContent = PRESETS[activeKey].name;
    updateStarter();
    timer = setTimeout(() => {
      $('rustgis-engine-status').textContent = 'RustGIS has not reported readiness. You can keep waiting or open the application in a new tab.';
    }, 30000);
    $('rustgis-embed-shell').scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  function confirmChange(action) {
    pendingAction = action;
    $('workspace-change-description').textContent = action === 'close' ? 'Save or export inside RustGIS before closing. Closing ends this embedded session; unsaved work will be lost.' : 'Save or export inside RustGIS before changing starters. Starting another workspace replaces the active session; unsaved work will be lost.';
    $('confirm-workspace-change').textContent = action === 'close' ? 'Close without saving' : 'Start new workspace';
    $('workspace-change-dialog').showModal();
  }
  $('load-rustgis').addEventListener('click', () => {
    if (frame && selectedKey === activeKey) { $('rustgis-embed-shell').scrollIntoView({ block: 'start' }); frame.focus(); return; }
    if (frame) confirmChange('switch'); else start();
  });
  root.addEventListener('message', (event) => {
    if (!isReady(event, frame)) return;
    clearTimeout(timer);
    $('rustgis-engine-status').textContent = `RustGIS is ready: ${PRESETS[activeKey].name}. This confirms the app started, not that starter data finished loading. Save and Export download your work.`;
  });
  $('close-rustgis').addEventListener('click', () => confirmChange('close'));
  $('cancel-workspace-change').addEventListener('click', () => $('workspace-change-dialog').close());
  $('confirm-workspace-change').addEventListener('click', () => {
    const action = pendingAction;
    $('workspace-change-dialog').close();
    if (action === 'switch') start();
    else if (action === 'close') {
      if (document.fullscreenElement === $('rustgis-embed-shell')) document.exitFullscreen().catch(() => {});
      destroyFrame(); $('rustgis-embed-shell').hidden = true; updateStarter();
      $('rustgis-engine-status').textContent = 'RustGIS closed. Files in the local point explorer remain separate.';
      $('load-rustgis').focus();
    }
  });
  $('workspace-change-dialog').addEventListener('close', () => { pendingAction = null; });
  $('fullscreen-rustgis').hidden = !document.fullscreenEnabled;
  $('fullscreen-rustgis').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await $('rustgis-embed-shell').requestFullscreen();
    } catch { $('rustgis-engine-status').textContent = 'Fullscreen is unavailable. You can continue here or open RustGIS in a new tab.'; }
  });
  document.addEventListener('fullscreenchange', () => { $('fullscreen-rustgis').textContent = document.fullscreenElement ? 'Exit fullscreen' : 'Fullscreen'; });
  updateStarter();
})(typeof window !== 'undefined' ? window : globalThis);
