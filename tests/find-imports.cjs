const fs = require('fs');
const content = fs.readFileSync('api/index.js', 'utf8');
const imports = new Set();
const regex = /from\s+['"]([^'"]+)['"]/g;
let match;
while ((match = regex.exec(content)) !== null) {
  if (!match[1].startsWith('.')) {
    imports.add(match[1]);
  }
}
console.log('External packages imported:', Array.from(imports));
