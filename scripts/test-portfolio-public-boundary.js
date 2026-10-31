'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { build } = require('./build-site');

const output = build();
const textExtensions = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.webmanifest']);
const forbidden = [
  ['github.com', 'GitHub repository URL'],
  ['raw.githubusercontent.com', 'GitHub-hosted asset URL'],
  ['view public build', 'public source/build CTA'],
  ['public build', 'public source/build wording'],
  ['build proof', 'public source/build wording'],
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

for (const absolute of walk(output)) {
  if (!textExtensions.has(path.extname(absolute).toLowerCase()) && !absolute.endsWith('.webmanifest')) continue;
  const relative = path.relative(output, absolute);
  const content = fs.readFileSync(absolute, 'utf8').toLowerCase();
  for (const [needle, label] of forbidden) {
    assert(!content.includes(needle), `${relative} must not expose ${label}`);
  }
}

const homepage = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
const portfolio = fs.readFileSync(path.join(output, 'projects.html'), 'utf8');
assert(homepage.includes('https://paycore-1.vercel.app/'), 'Homepage Paycore card must link to its live public deployment');
assert(portfolio.includes('https://paycore-1.vercel.app/'), 'Portfolio Paycore card must link to its live public deployment');
console.log('[public-source-boundary] Public site contains no GitHub links, GitHub-hosted assets, or public source/build CTAs.');
