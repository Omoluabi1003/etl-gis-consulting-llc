'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { build, pages } = require('./build-site');
const output = build();
for (const page of pages) assert.ok(fs.existsSync(path.join(output, page)), page);
const excluded = [
  'api/agentos.js', 'agentos/definitions.js', 'agentos/domain.js', 'agentos/orchestrator.js',
  'agentos/store/index.js', 'agentos/tools/geojson-inspector.js', 'database/agentos-schema.sql',
  'geoagent_os/engine.py', 'geoagent_os/agents.py', 'docs/agentos-architecture.md',
  'docs/agency-playbook/specialists.md', 'scripts/test-agentos.js', 'team-assessments/femi-role.md',
  'README.md', '.git/config', 'assets/js/agentos.js',
];
for (const file of excluded) assert.ok(!fs.existsSync(path.join(output, file)), `Internal file must not be deployed: ${file}`);
assert.deepEqual(fs.readdirSync(path.join(output, 'agentos')), ['index.html']);
const html = fs.readFileSync(path.join(output, 'agentos/index.html'), 'utf8');
assert.ok(!/<script\b/i.test(html));
for (const term of ['metric-total', 'agent-grid', 'allowedTools', 'restrictedActions', 'connection-status', 'fetch(', '/api/agentos']) assert.ok(!html.includes(term), term);
assert.ok(html.includes('Discuss your workflow'));
assert.ok(fs.existsSync(path.join(output, 'assets/js/earth-globe.js')));
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'vercel.json')));
assert.equal(config.outputDirectory, 'site-dist');
assert.equal(config.buildCommand, 'node scripts/build-site.js');
build(); // Repeatable build with the same approved pages.
assert.deepEqual(fs.readdirSync(path.join(output, 'agentos')), ['index.html']);
console.log('[test] Public build includes approved pages/assets, excludes internal sources/playbooks/data schema, and publishes a static AI overview without operational requests.');
