const fs = require('fs');
const path = require('path');

function searchDir(dir, patterns) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
      searchDir(fullPath, patterns);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.json') || entry.name.endsWith('.js'))) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const p of patterns) {
          if (content.includes(p)) {
            console.log('Found pattern "' + p + '" in: ' + fullPath);
          }
        }
      } catch (e) {}
    }
  }
}

console.log('Searching src and server...');
searchDir('src', ['পরবর্তী ধাপে যাই', 'শব্দ গঠন', 'লেসন ০২', 'লেসন 2', 'Lesson 02', 'あ・い・う・え・お', 'vowel']);
searchDir('server', ['পরবর্তী ধাপে যাই', 'শব্দ গঠন', 'লেসন ০২', 'Lesson 02', 'あ・い・う・え・お']);
