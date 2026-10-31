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

function sanitizePortfolio(html) {
  return html
    .replace('<p>Each featured item links to a real public experience, public build artifact, or documented case study where public proof is appropriate.</p>', '<p>Each featured item links only to a real public experience or documented case study. Internal source and developer assets remain private to the delivery team.</p>')
    .replace('<a href="https://github.com/Omoluabi1003/WaveAtlas" target="_blank" rel="noopener noreferrer">View Public Build</a>', '')
    .replace('<p class="proof-note">Public build proof</p>', '<p class="proof-note">Live public platform</p>')
    .replace('<div class="project-links"><a href="https://github.com/Omoluabi1003/Paycore" target="_blank" rel="noopener noreferrer">View Public Build</a></div>', '<div class="project-links"><a href="https://paycore-1.vercel.app/" target="_blank" rel="noopener noreferrer">View Live Platform</a></div>')
    .replace('<a href="https://github.com/Omoluabi1003/bha" target="_blank" rel="noopener noreferrer">View Public Build</a>', '')
    .replace('<p class="proof-note">Public GIS build</p>', '<p class="proof-note">Internal GIS system</p>')
    .replace('<div class="project-links"><a href="https://github.com/Omoluabi1003/PtMatch" target="_blank" rel="noopener noreferrer">View Public Build</a></div>', '<div class="project-links" aria-label="PtMatch public proof status"><span class="proof-private">Visual proof only</span></div>');
}

function sanitizePortfolioCss(css) {
  const replacements = new Map([
    ['https://raw.githubusercontent.com/Omoluabi1003/Clarity-Loop-Books/main/CL%20AI%20Logo.png', '../portfolio/clarity-loop-proof.svg'],
    ['https://raw.githubusercontent.com/Omoluabi1003/WaveAtlas/main/public/brand/waveatlas-1024x1024.png', '../portfolio/waveatlas-proof.svg'],
    ['https://raw.githubusercontent.com/Omoluabi1003/bha/main/9DF002EA-EE3F-4507-924B-82B021A3F925.png', '../portfolio/bha-proof.svg'],
    ['https://raw.githubusercontent.com/Omoluabi1003/Ariyo-AI/main/icons/Ariyo.png', '../portfolio/ariyo-proof.svg'],
    ['https://raw.githubusercontent.com/Omoluabi1003/bag-dna-os/main/public/bag-dna-logo.png', '../portfolio/bagdna-proof.svg'],
    ['https://raw.githubusercontent.com/Omoluabi1003/AfricaUnveiled/main/Africa%20Unveiled%20logo.jpeg', '../portfolio/africa-unveiled-proof.svg'],
    ['https://raw.githubusercontent.com/Omoluabi1003/Carine-Sanadina/main/Carine%20Sanadina.png', '../portfolio/carine-proof.svg'],
  ]);
  for (const [from, to] of replacements) css = css.split(from).join(to);
  return css;
}

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
      let html = fs.readFileSync(destination, 'utf8');
      if (name === 'contact.html') {
        html = html
          .replace('Co-Founder &amp; Principal Consultant', 'Principal Consultant')
          .replace('Co-Founder of ETL GIS Consulting LLC', 'Principal Consultant at ETL GIS Consulting LLC');
      }
      if (name === 'projects.html') html = sanitizePortfolio(html);
      fs.writeFileSync(destination, html.replace('</head>', `    ${clarityLink}\n</head>`));
    }
  }
  fs.cpSync(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
  for (const cssName of ['brand-identity.css', 'core-portfolio.css', 'secondary-clarity.css']) {
    const cssPath = path.join(output, 'assets', 'css', cssName);
    if (fs.existsSync(cssPath)) fs.writeFileSync(cssPath, sanitizePortfolioCss(fs.readFileSync(cssPath, 'utf8')));
  }
  return output;
}
if (require.main === module) console.log(`[site] Public website built in ${path.relative(root, build())}.`);
module.exports = { build, pages, sanitizePortfolio, sanitizePortfolioCss };
