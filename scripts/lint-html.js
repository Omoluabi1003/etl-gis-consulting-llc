const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const disallowedPatterns = [
  /gmail\.com/i,
  /formsubmit/i,
  /tel:\+18885550149/i,
];

const htmlFiles = [];

const collectHtml = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
        return;
      }
      collectHtml(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  });
};

collectHtml(root);

let hasErrors = false;

htmlFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  disallowedPatterns.forEach((pattern) => {
    if (pattern.test(content)) {
      console.error(`[lint-html] Disallowed pattern "${pattern}" found in ${path.relative(root, file)}`);
      hasErrors = true;
    }
  });
});

if (hasErrors) {
  process.exit(1);
}

console.log(`[lint-html] Checked ${htmlFiles.length} HTML files.`);
