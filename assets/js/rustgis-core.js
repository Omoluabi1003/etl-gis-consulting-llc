/* Browser-local point GIS operations. No external services or credentials. */
(function (root) {
  'use strict';
  const radians = (value) => value * Math.PI / 180;
  function coordinates(value) {
    if (!Array.isArray(value) || value.length < 2 || value.length > 3 ||
        !value.every((v) => typeof v === 'number' && Number.isFinite(v)) ||
        Math.abs(value[0]) > 180 || Math.abs(value[1]) > 90) {
      throw new Error('Use finite WGS84 coordinates: longitude −180 to 180, latitude −90 to 90.');
    }
    return value;
  }
  function validate(collection) {
    if (!collection || collection.type !== 'FeatureCollection' || !Array.isArray(collection.features)) {
      throw new Error('Choose a GeoJSON FeatureCollection.');
    }
    if (collection.crs) throw new Error('Reproject to WGS84 longitude/latitude and remove the legacy crs member first.');
    if (!collection.features.length || collection.features.length > 1500) throw new Error('Import between 1 and 1,500 point features.');
    collection.features.forEach((feature, index) => {
      if (!feature || feature.type !== 'Feature' || feature.geometry?.type !== 'Point') {
        throw new Error(`Feature ${index + 1}: this workspace accepts Point geometry only.`);
      }
      coordinates(feature.geometry.coordinates);
      if (feature.properties !== null && (typeof feature.properties !== 'object' || Array.isArray(feature.properties))) {
        throw new Error(`Feature ${index + 1}: properties must be an object or null.`);
      }
    });
    return JSON.parse(JSON.stringify(collection));
  }
  function distance(a, b) {
    coordinates(a); coordinates(b);
    const dlat = radians(b[1] - a[1]), dlon = radians(b[0] - a[0]);
    const h = Math.sin(dlat / 2) ** 2 + Math.cos(radians(a[1])) * Math.cos(radians(b[1])) * Math.sin(dlon / 2) ** 2;
    return 6371.0088 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
  }
  function search(items, query) {
    const term = query.trim().toLocaleLowerCase();
    return items.filter((item) => JSON.stringify(item.feature.properties || {}).toLocaleLowerCase().includes(term));
  }
  function nearby(items, center, radius) {
    if (!Number.isFinite(radius) || radius <= 0 || radius > 50) throw new Error('Choose a radius above 0 and at most 50 km.');
    return items.map((item) => ({ ...item, distance: distance(center, item.feature.geometry.coordinates) }))
      .filter((item) => item.distance <= radius).sort((a, b) => a.distance - b.distance);
  }
  function exportCollection(items) {
    return { type: 'FeatureCollection', features: items.map((item) => JSON.parse(JSON.stringify(item.feature))) };
  }
  function bufferRing(center, radius) {
    coordinates(center);
    if (!Number.isFinite(radius) || radius <= 0 || radius > 50) throw new Error('Invalid radius.');
    const lat = radians(center[1]), lon = radians(center[0]), angle = radius / 6371.0088;
    return Array.from({ length: 97 }, (_, i) => {
      const bearing = 2 * Math.PI * (i % 96) / 96;
      const y = Math.asin(Math.sin(lat) * Math.cos(angle) + Math.cos(lat) * Math.sin(angle) * Math.cos(bearing));
      const x = lon + Math.atan2(Math.sin(bearing) * Math.sin(angle) * Math.cos(lat), Math.cos(angle) - Math.sin(lat) * Math.sin(y));
      return [x * 180 / Math.PI, y * 180 / Math.PI];
    });
  }
  const api = { coordinates, validate, distance, search, nearby, exportCollection, bufferRing };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.RustGIS = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
