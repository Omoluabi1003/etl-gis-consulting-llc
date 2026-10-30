(function () {
  'use strict';
  const GIS = window.RustGIS, $ = (id) => document.getElementById(id);
  const colors = { civic: '#087e70', utilities: '#2774b9', response: '#bd6534', imported: '#8550b1' };
  const names = { civic: 'Civic places', utilities: 'Utility assets', response: 'Response sites', imported: 'Imported points' };
  const raw = [
    ['civic', 'Community library', -80.350, 27.290, 'Library'],
    ['civic', 'Civic services center', -80.365, 27.305, 'Public services'],
    ['civic', 'Learning hub', -80.332, 27.312, 'Education'],
    ['civic', 'Riverside recreation', -80.318, 27.282, 'Recreation'],
    ['civic', 'Community garden', -80.378, 27.280, 'Open space'],
    ['utilities', 'Water monitoring A', -80.343, 27.285, 'Water'],
    ['utilities', 'Water monitoring B', -80.326, 27.298, 'Water'],
    ['utilities', 'Energy service point', -80.370, 27.320, 'Energy'],
    ['utilities', 'Drainage sensor', -80.315, 27.315, 'Drainage'],
    ['response', 'Response station A', -80.359, 27.283, 'Response'],
    ['response', 'Response station B', -80.339, 27.320, 'Response'],
    ['response', 'Coordination point', -80.382, 27.303, 'Coordination'],
  ];
  const sample = () => raw.map(([layer, name, lon, lat, category], index) => ({
    key: `sample-${index}`, layer, feature: { type: 'Feature', id: `demo-${index + 1}`, properties: { name, category, provenance: 'Synthetic demonstration record' }, geometry: { type: 'Point', coordinates: [lon, lat] } },
  }));
  let items = sample(), enabled = new Set(['civic', 'utilities', 'response']), selected = null;
  let analysis = false, view = null, imported = false, importSerial = 0;
  let onlineMap = null, onlineReady = false, basemapTimer = null, mapGeneration = 0;
  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  const svg = (tag, attributes, text) => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const featureName = (item) => String(item.feature.properties?.name || item.feature.properties?.title || item.feature.id || `Point ${item.key.split('-').pop()}`).slice(0, 180);
  const status = (message, error = false) => { $('feedback').textContent = message; $('feedback').className = error ? 'error' : ''; };
  const radius = () => Number($('radius').value);
  const visible = () => GIS.search(items.filter((item) => enabled.has(item.layer)), $('search').value);
  const results = () => analysis && selected ? GIS.nearby(visible(), selected.feature.geometry.coordinates, radius()) : visible();

  function fit() {
    const points = visible().map((item) => item.feature.geometry.coordinates);
    if (!points.length) return;
    const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
    const center = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
    const cos = Math.max(0.05, Math.cos(center[1] * Math.PI / 180));
    const width = Math.max(.025, Math.max(...xs) - Math.min(...xs)) * 1.5;
    const height = Math.max(.018, Math.max(...ys) - Math.min(...ys)) * 1.5;
    const span = Math.max(width * cos, height * 1000 / 640);
    view = { center, width: span / cos, height: span * 640 / 1000 };
    if (onlineReady) onlineMap.fitBounds([[Math.min(...xs) - .005, Math.min(...ys) - .005], [Math.max(...xs) + .005, Math.max(...ys) + .005]], { padding: 55, maxZoom: 15, duration: 0 });
    drawMap();
  }
  function project(point) {
    return [500 + (point[0] - view.center[0]) / view.width * 1000, 320 - (point[1] - view.center[1]) / view.height * 640];
  }
  function drawMap() {
    if (!view) return;
    $('graticule').replaceChildren(); $('features').replaceChildren(); $('buffer').replaceChildren();
    for (let index = 1; index < 5; index++) {
      const x = index * 200, y = index * 128;
      $('graticule').append(svg('line', { x1: x, x2: x, y1: 0, y2: 640, stroke: '#c0d2c5', 'stroke-width': 1 }));
      $('graticule').append(svg('text', { x: x + 6, y: 625, fill: '#536e60', 'font-size': 11 }, (view.center[0] + (x - 500) / 1000 * view.width).toFixed(3) + '°'));
      $('graticule').append(svg('line', { x1: 0, x2: 1000, y1: y, y2: y, stroke: '#c0d2c5', 'stroke-width': 1 }));
      $('graticule').append(svg('text', { x: 8, y: y - 7, fill: '#536e60', 'font-size': 11 }, (view.center[1] - (y - 320) / 640 * view.height).toFixed(3) + '°'));
    }
    const rows = results();
    if (analysis && selected) {
      const points = GIS.bufferRing(selected.feature.geometry.coordinates, radius()).map((point) => project(point).join(',')).join(' ');
      $('buffer').append(svg('polygon', { points, fill: '#148c7420', stroke: '#087e70', 'stroke-width': 2, 'stroke-dasharray': '6 4' }));
    }
    rows.forEach((item) => {
      const [x, y] = project(item.feature.geometry.coordinates);
      const active = selected?.key === item.key;
      if (active) $('features').append(svg('circle', { cx: x, cy: y, r: 18, fill: '#ffffff99', stroke: colors[item.layer], 'stroke-width': 1.5 }));
      const point = svg('circle', { cx: x, cy: y, r: active ? 9 : 7, fill: colors[item.layer], stroke: 'white', 'stroke-width': 2.5, tabindex: 0, role: 'button', 'data-key': item.key, 'aria-label': `Inspect ${featureName(item)}`, 'aria-pressed': active });
      point.append(svg('title', {}, featureName(item)));
      point.addEventListener('click', () => select(item));
      point.addEventListener('keydown', (event) => { if (['Enter', ' '].includes(event.key)) { event.preventDefault(); select(item); } });
      $('features').append(point);
      if (active || rows.length < 18) $('features').append(svg('text', { x: x + 13, y: y - 12, fill: '#204839', 'font-size': 12, 'font-weight': active ? 700 : 500, 'pointer-events': 'none' }, featureName(item).slice(0, 28)));
    });
    updateOnline();
  }
  function drawLayers() {
    $('layers').replaceChildren();
    const layers = Object.keys(names).filter((layer) => items.some((item) => item.layer === layer));
    $('layer-count').textContent = `${layers.length} layers`;
    layers.forEach((layer) => {
      const label = node('label', undefined, 'layer');
      const input = node('input'); input.type = 'checkbox'; input.checked = enabled.has(layer); input.setAttribute('aria-label', names[layer]);
      input.addEventListener('change', () => {
        if (input.checked) enabled.add(layer); else enabled.delete(layer);
        if (selected && !enabled.has(selected.layer)) { selected = null; analysis = false; }
        render(); status(`${results().length} features in the current view.`);
      });
      label.append(input, node('i', undefined, `dot ${layer}`), node('span', names[layer]), node('span', String(items.filter((item) => item.layer === layer).length), 'count'));
      $('layers').append(label);
    });
  }
  function select(item) {
    const active = document.activeElement;
    const restore = active?.getAttribute('data-key') === item.key;
    const container = active?.closest('#feature-table') ? '#feature-table' : '#features';
    selected = item; render();
    if (restore) document.querySelector(`${container} [data-key="${item.key}"]`)?.focus();
    status(`${featureName(item)} selected. Use the radius tool to find nearby features.`);
  }
  function inspect() {
    const panel = $('inspection'); panel.replaceChildren();
    if (!selected) {
      panel.append(node('div', '⌖', 'empty-icon'), node('h3', 'A little context goes a long way.'), node('p', 'Select a point or table row to see its attributes and use it as an analysis center.')); return;
    }
    panel.append(node('h3', featureName(selected), 'selected-name'), node('p', `${names[selected.layer]} · ${selected.layer === 'imported' ? 'Supplied local data' : 'Synthetic sample'}`));
    const dl = node('dl');
    const properties = selected.feature.properties || {};
    Object.entries(properties).forEach(([key, value]) => {
      dl.append(node('dt', key), node('dd', typeof value === 'object' ? JSON.stringify(value) : String(value)));
    });
    dl.append(node('dt', 'Coordinates · longitude, latitude'), node('dd', selected.feature.geometry.coordinates.slice(0, 2).map((n) => n.toFixed(6)).join(', ')));
    panel.append(dl);
  }
  function render() {
    const filtered = visible();
    if (selected && !filtered.some((item) => item.key === selected.key)) { selected = null; analysis = false; }
    const rows = results();
    $('visible-count').textContent = String(filtered.length);
    $('match-count').textContent = analysis ? String(rows.length) : '—';
    $('table-count').textContent = `${rows.length} records`;
    $('table-note').textContent = analysis ? `Within ${radius().toFixed(1)} km · includes selected center` : 'All visible features · select a name to inspect';
    $('analysis-summary').textContent = analysis ? `${rows.length} visible points within ${radius().toFixed(1)} km of the center.` : selected ? `${featureName(selected)} selected.` : 'Select a feature to begin exploring.';
    $('analyze').disabled = !selected; $('clear-analysis').disabled = !analysis; $('export').disabled = !rows.length;
    $('feature-table').replaceChildren();
    rows.forEach((item) => {
      const row = node('tr'); if (selected?.key === item.key) row.className = 'selected';
      const nameCell = node('td'), button = node('button', featureName(item)); button.type = 'button'; button.setAttribute('data-key', item.key); button.addEventListener('click', () => select(item)); nameCell.append(button);
      row.append(nameCell, node('td', names[item.layer]), node('td', item.feature.geometry.coordinates[0].toFixed(5)), node('td', item.feature.geometry.coordinates[1].toFixed(5)), node('td', item.distance === undefined ? '—' : `${item.distance.toFixed(2)} km`));
      $('feature-table').append(row);
    });
    if (!rows.length) { const row = node('tr'), cell = node('td', 'No matching features. Change the search or enable a layer.'); cell.colSpan = 5; row.append(cell); $('feature-table').append(row); }
    inspect(); drawMap();
  }
  function updateOnline() {
    if (!onlineReady) return;
    const rows = results();
    const points = { type: 'FeatureCollection', features: rows.map((item) => ({ type: 'Feature', geometry: item.feature.geometry, properties: { key: item.key, color: colors[item.layer], selected: selected?.key === item.key, name: featureName(item) } })) };
    const ring = { type: 'FeatureCollection', features: analysis && selected ? [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [GIS.bufferRing(selected.feature.geometry.coordinates, radius())] } }] : [] };
    if (!onlineMap.getSource('rg-points')) {
      onlineMap.addSource('rg-buffer', { type: 'geojson', data: ring });
      onlineMap.addLayer({ id: 'rg-buffer-fill', type: 'fill', source: 'rg-buffer', paint: { 'fill-color': '#087e70', 'fill-opacity': .17 } });
      onlineMap.addLayer({ id: 'rg-buffer-line', type: 'line', source: 'rg-buffer', paint: { 'line-color': '#087e70', 'line-width': 2 } });
      onlineMap.addSource('rg-points', { type: 'geojson', data: points });
      onlineMap.addLayer({ id: 'rg-point-layer', type: 'circle', source: 'rg-points', paint: { 'circle-color': ['get', 'color'], 'circle-radius': ['case', ['get', 'selected'], 10, 7], 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' } });
    } else {
      onlineMap.getSource('rg-points').setData(points); onlineMap.getSource('rg-buffer').setData(ring);
    }
  }
  const raster = (url, attribution, maxzoom = 19) => ({ version: 8, sources: { basemap: { type: 'raster', tiles: [url], tileSize: 256, maxzoom, attribution } }, layers: [{ id: 'basemap', type: 'raster', source: 'basemap' }] });
  const basemaps = {
    streets: { name: 'Atlas Streets', style: 'https://tiles.openfreemap.org/styles/liberty' },
    satellite: { name: 'Esri World Imagery', style: raster('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community') },
    terrain: { name: 'OpenTopoMap', style: raster('https://tile.opentopomap.org/{z}/{x}/{y}.png', 'Map data © OpenStreetMap contributors, SRTM | Map style © OpenTopoMap (CC-BY-SA)', 17) },
    marble: { name: 'NASA Blue Marble', style: raster('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/2004-08-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg', 'NASA GIBS / Blue Marble', 8) },
  };
  function stopOnline() {
    mapGeneration++; clearTimeout(basemapTimer); onlineReady = false;
    if (onlineMap) onlineMap.remove(); onlineMap = null;
    $('online-map').hidden = true; $('map').style.visibility = 'visible';
    $('map-mode').textContent = 'Coordinate grid · WGS84';
  }
  function useBasemap(key) {
    stopOnline();
    if (key === 'grid') { status('Offline coordinate grid selected. No external tiles are requested.'); return; }
    if (!window.maplibregl) { $('basemap').value = 'grid'; status('Online renderer unavailable. The local coordinate grid and all data tools remain available.', true); return; }
    const generation = mapGeneration, config = basemaps[key];
    $('online-map').hidden = false;
    try {
      onlineMap = new window.maplibregl.Map({ container: 'online-map', style: config.style, center: view.center, zoom: 12, attributionControl: true });
      onlineMap.addControl(new window.maplibregl.ScaleControl({ unit: 'metric' }));
      const fallback = () => { if (generation !== mapGeneration) return; stopOnline(); $('basemap').value = 'grid'; status('Basemap could not load. Returned to the local coordinate grid; your features are preserved.', true); };
      basemapTimer = setTimeout(fallback, 15000);
      onlineMap.on('error', () => { if (!onlineReady) fallback(); else status('Some basemap tiles are unavailable. Switch to the coordinate grid to continue offline.', true); });
      onlineMap.on('load', () => {
        if (generation !== mapGeneration) return;
        clearTimeout(basemapTimer); onlineReady = true;
        $('map').style.visibility = 'hidden'; $('map-mode').textContent = config.name;
        updateOnline(); fit(); status(`${config.name} loaded. Source attribution appears on the map.`);
        onlineMap.on('click', 'rg-point-layer', (event) => {
          const item = items.find((entry) => entry.key === event.features?.[0]?.properties.key); if (item) select(item);
        });
      });
    } catch { stopOnline(); $('basemap').value = 'grid'; status('Online maps are not supported in this browser. The offline workspace remains available.', true); }
  }
  $('basemap').addEventListener('change', () => useBasemap($('basemap').value));
  $('search').addEventListener('input', () => { render(); status(`${results().length} matching features.`); });
  $('radius').addEventListener('input', () => { $('radius-value').textContent = `${radius().toFixed(1)} km`; render(); });
  $('analyze').addEventListener('click', () => { if (!selected) return; analysis = true; render(); status(`Analysis complete: ${results().length} visible features within ${radius().toFixed(1)} km, including the center point. Spherical distance; not a service area or travel time.`); });
  $('clear-analysis').addEventListener('click', () => { analysis = false; render(); status('Analysis cleared. All matching visible features are shown.'); });
  $('fit').addEventListener('click', fit);
  ['zoom-in', 'zoom-out'].forEach((id) => $(id).addEventListener('click', () => {
    if (onlineReady) { if (id === 'zoom-in') onlineMap.zoomIn(); else onlineMap.zoomOut(); return; }
    const factor = id === 'zoom-in' ? .7 : 1.4;
    view.width = Math.min(720, Math.max(.00001, view.width * factor)); view.height = Math.min(360, Math.max(.00001, view.height * factor)); drawMap();
  }));
  $('reset').addEventListener('click', () => {
    importSerial++; items = sample(); enabled = new Set(['civic', 'utilities', 'response']); selected = null; analysis = false; imported = false;
    $('search').value = ''; $('radius').value = '2'; $('radius-value').textContent = '2.0 km'; $('dataset-label').textContent = 'Synthetic sample data'; $('import-key').hidden = true;
    $('map-caption').textContent = 'Illustrative assets · not authoritative records'; drawLayers(); fit(); render(); status('Synthetic sample workspace restored. Imported data removed from this page.');
  });
  $('import-file').addEventListener('change', async (event) => {
    const file = event.target.files[0], serial = ++importSerial;
    if (!file) return;
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error('Choose a GeoJSON file no larger than 2 MB.');
      const collection = GIS.validate(JSON.parse(await file.text()));
      if (serial !== importSerial) return;
      const importedItems = collection.features.map((feature, index) => ({ key: `import-${index + 1}`, layer: 'imported', feature }));
      items = importedItems; enabled = new Set(['imported']); selected = null; analysis = false; imported = true; $('search').value = '';
      $('dataset-label').textContent = 'Your local GeoJSON'; $('import-key').hidden = false;
      $('map-caption').textContent = 'Imported coordinates · not independently verified';
      drawLayers(); fit(); render(); status(`Imported ${collection.features.length} point features. The sample was replaced; coordinates have not been independently verified.`);
    } catch (error) { status(`Import failed: ${error.message} Your current workspace is unchanged.`, true); }
    finally { event.target.value = ''; }
  });
  $('export').addEventListener('click', () => {
    const rows = results(), data = GIS.exportCollection(rows), blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob), link = node('a'); link.href = url; link.download = imported ? 'rustgis-filtered-points.geojson' : 'rustgis-synthetic-sample.geojson';
    document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    status(`Exported ${rows.length} ${imported ? 'imported' : 'synthetic'} features. Source attributes and feature IDs preserved.`);
  });
  drawLayers(); fit(); render();
})();
