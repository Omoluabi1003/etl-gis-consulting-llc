'use strict';
// Explicit public output: operational code, internal docs, tests and SQL stay out.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'site-dist');
const pages = [
  'index.html', 'about.html', 'services.html', 'projects.html', 'contact.html',
  'privacy.html', 'terms.html', 'refund.html', 'about/index.html', 'agentos/index.html',
  'case-studies/metro-mobility-analytics.html', 'case-studies/st-lucie-modernization.html',
  'insights/modernizing-legacy-gis-stacks-without-downtime.html',
  'insights/etl-strategy-patterns-for-spatial-data-at-scale.html',
  'insights/location-intelligence-for-executive-decision-cycles.html',
  'services/enterprise-architecture.html', 'services/managed-gis-operations.html',
  'services/spatial-analytics-enablement.html', 'services/strategy-roadmapping.html',
  'robots.txt', 'sitemap.xml', 'site.webmanifest', 'favicon.ico', 'apple-touch-icon.png',
  'A5667770-81AA-4F06-9B74-B42EF57E17F4.png',
];
function build() {
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });
  for (const name of pages) {
    const destination = path.join(output, name);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(root, name), destination);
    if (name.endsWith('.html') && name !== 'index.html') {
      const depth = name.split('/').length - 1;
      const prefix = depth ? '../'.repeat(depth) : '';
      const clarityLink = `<link rel="stylesheet" href="${prefix}assets/css/secondary-clarity.css">`;
      const html = fs.readFileSync(destination, 'utf8');
      fs.writeFileSync(destination, html.replace('</head>', `    ${clarityLink}\n</head>`));
    }
  }
  fs.cpSync(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
  return output;
}
if (require.main === module) console.log(`[site] Public website built in ${path.relative(root, build())}.`);
module.exports = { build, pages };
