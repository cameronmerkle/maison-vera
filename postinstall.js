/* eslint-disable */
const fs = require('fs');
const path = require('path');

const DROPINS_DIR = path.join(__dirname, 'scripts', '__dropins__');
const NODE_MODULES = path.join(__dirname, 'node_modules');

const PACKAGES = [
  '@dropins/tools',
  '@dropins/storefront-product-discovery',
  '@dropins/storefront-cart',
  '@dropins/storefront-pdp',
];

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.name === 'package.json' || entry.name === 'node_modules') continue;
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Vendoring drop-in components into scripts/__dropins__/ ...');

for (const pkg of PACKAGES) {
  const src = path.join(NODE_MODULES, pkg);
  const dest = path.join(DROPINS_DIR, pkg);
  if (fs.existsSync(src)) {
    fs.rmSync(dest, { recursive: true, force: true });
    copyDir(src, dest);
    console.log(`  ✓ ${pkg}`);
  } else {
    console.warn(`  ⚠ ${pkg} not found in node_modules`);
  }
}

console.log('Done.');
