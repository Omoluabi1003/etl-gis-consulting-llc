'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { build } = require('./build-site');

const output = build();
const files = [
  'projects.html',
  'assets/css/core-portfolio.css',
  'assets/css/secondary-clarity.css',
];

for (const relative of files) {
  const content = fs.readFileSync(path.join(output, relative), 'utf8').toLowerCase();
  assert(!content.includes('github.com'), `${relative} must not expose github.com`);
  assert(!content.includes('raw.githubusercontent.com'), `${relative} must not expose raw.githubusercontent.com`);
}

const portfolio = fs.readFileSync(path.join(output, 'projects.html'), 'utf8');
assert(portfolio.includes('https://paycore-1.vercel.app/'), 'Paycore must link to its live public deployment');
assert(!portfolio.includes('View Public Build'), 'Portfolio must not expose public build/source links');
console.log('[portfolio-boundary] Public portfolio contains no GitHub links or GitHub-hosted assets.');
