'use strict';
const assert = require('node:assert/strict');
const { project } = require('../assets/js/earth-globe');
for (const [lon, lat] of [[-81.6557, 30.3322], [0, 0], [139.65, 35.68], [179.9, -35]]) {
  const point = project(lon, lat, lon, lat);
  assert.ok(Math.abs(point.x) < 1e-10 && Math.abs(point.y) < 1e-10 && Math.abs(point.z - 1) < 1e-10);
}
assert.ok(project(180, 0, 0, 0).z < -.999);
assert.ok(project(30, 0, 0, 0).x > 0);
assert.ok(project(-30, 0, 0, 0).x < 0);
assert.ok(project(0, 30, 0, 0).y > 0);
assert.ok(project(-81.6557, 30.3322, -45, 18).z > .7);
const dateline = project(-179, 0, 179, 0);
assert.ok(dateline.z > .999 && dateline.x > 0);
console.log('Globe projection checks passed: geographic centering, orientation, front/back visibility, Jacksonville placement and dateline continuity.');
