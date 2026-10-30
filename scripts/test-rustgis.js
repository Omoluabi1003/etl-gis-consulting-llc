'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const GIS = require('../assets/js/rustgis-core');
const point = (coordinates = [-80.35, 27.29], properties = { name: 'Library' }) => ({ type: 'Feature', id: 'test-1', geometry: { type: 'Point', coordinates }, properties });
const collection = (features = [point()]) => ({ type: 'FeatureCollection', features });

test('Point GeoJSON imports are copied without altering source IDs or attributes', () => {
  const original = collection();
  const validated = GIS.validate(original);
  assert.deepEqual(validated, original);
  validated.features[0].properties.name = 'Changed';
  assert.equal(original.features[0].properties.name, 'Library');
});
test('geometry, numeric types and coordinate ranges are enforced', () => {
  for (const c of [[181, 20], [20, 91], [true, 20], ['20', 10], [NaN, 0], [Infinity, 0], [0], [0, 0, 0, 0]]) {
    assert.throws(() => GIS.validate(collection([point(c)])));
  }
  assert.throws(() => GIS.validate(collection([{ ...point(), geometry: { type: 'Polygon', coordinates: [] } }])));
});
test('legacy CRS, invalid properties and invalid collections fail without coercion', () => {
  for (const item of [null, {}, { type: 'FeatureCollection', features: 'not an array' }, collection([]), { ...collection(), crs: { name: 'EPSG:3857' } }, collection([point([0, 0], [])])]) {
    assert.throws(() => GIS.validate(item));
  }
  assert.equal(GIS.validate(collection([point([0, 0], null)])).features.length, 1);
});
test('feature cap prevents unbounded rendering work', () => {
  assert.throws(() => GIS.validate(collection(Array.from({ length: 1501 }, () => point()))));
});
test('haversine has known distance, symmetry, poles and antimeridian behavior', () => {
  assert.equal(GIS.distance([0, 0], [0, 0]), 0);
  assert.ok(Math.abs(GIS.distance([0, 0], [1, 0]) - 111.195) < .001);
  assert.ok(GIS.distance([179.99, 0], [-179.99, 0]) < 2.23);
  assert.ok(GIS.distance([0, 90], [180, 90]) < 1e-8);
  assert.equal(GIS.distance([2, 3], [4, 5]), GIS.distance([4, 5], [2, 3]));
});
test('proximity sorts matches and includes center without mutating inputs', () => {
  const items = [0.02, 0, 0.005].map((x, i) => ({ key: String(i), feature: point([x, 0]) }));
  const before = JSON.stringify(items);
  const result = GIS.nearby(items, [0, 0], 1);
  assert.deepEqual(result.map((i) => i.key), ['1', '2']);
  assert.equal(result[0].distance, 0);
  assert.equal(JSON.stringify(items), before);
  for (const radius of [NaN, Infinity, -1, 0, 51]) assert.throws(() => GIS.nearby(items, [0, 0], radius));
});
test('search matches supplied attributes and preserves literal markup as data', () => {
  const items = [{ feature: point([0, 0], { name: '<script>Water</script>' }) }, { feature: point([1, 1], null) }];
  assert.equal(GIS.search(items, ' WATER ').length, 1);
  assert.equal(GIS.search(items, '').length, 2);
});
test('exports preserve source features and exclude internal analysis metadata', () => {
  const result = GIS.exportCollection([{ key: 'internal', layer: 'sample', distance: 1, feature: point() }]);
  assert.deepEqual(result, collection());
  assert.ok(!('distance' in result.features[0]));
});
test('geodesic radius ring is closed and every vertex is the requested distance', () => {
  for (const center of [[-80.35, 27.29], [179.99, 0], [0, 89.9]]) {
    const ring = GIS.bufferRing(center, 2);
    assert.deepEqual(ring[0], ring.at(-1));
    ring.forEach((p) => {
      const normalized = [((p[0] + 180) % 360 + 360) % 360 - 180, p[1]];
      assert.ok(Math.abs(GIS.distance(center, normalized) - 2) < 1e-5);
    });
  }
});
