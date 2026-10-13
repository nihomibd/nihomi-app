const fs = require('fs');
const path = require('path');

function getFiles(dir, exts) {
  let res = [];
  const list = fs.readdirSync(dir);
  for (const f of list) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== 'dist' && f !== '.git') {
        res = res.concat(getFiles(full, exts));
      }
    } else {
      if (exts.includes(path.extname(full))) res.push(full);
    }
  }
  return res;
}

const srcFiles = getFiles('src', ['.ts', '.tsx', '.json', '.html']);
if (fs.existsSync('index.html')) srcFiles.push('index.html');

const assetRegex = /['"](\/(?:assets|images|icons|img)\/[^'"]+\.(?:png|jpg|jpeg|svg|webp|gif))['"]/g;
const referenced = new Set();

for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = assetRegex.exec(content)) !== null) {
    referenced.add(m[1]);
  }
}

console.log('Total referenced static assets:', referenced.size);
const missing = [];
for (const rel of referenced) {
  const diskPath = path.join('public', rel.replace(/^\//, ''));
  if (!fs.existsSync(diskPath)) {
    missing.push({ asset: rel, diskPath });
  }
}
console.log('Missing assets count:', missing.length);
if (missing.length > 0) {
  console.log('Missing list:', JSON.stringify(missing, null, 2));
} else {
  console.log('✔ ALL referenced static image/svg/png assets exist on disk in public/!');
}
