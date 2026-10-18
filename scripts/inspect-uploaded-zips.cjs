const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = 'C:/Users/bdtri/.gemini/antigravity/brain/638b6452-e297-4f06-b5fe-7e3295c58ed1/.user_uploaded';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.zip'));

console.log('Total zip files found in .user_uploaded:', files.length);

files.forEach(f => {
  const full = path.join(dir, f);
  try {
    const out = execSync(`tar -tf "${full}"`, { encoding: 'utf-8' });
    const lines = out.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      console.log(`\n=== ${f} (${lines.length} items) ===`);
      console.log(lines.slice(0, 10).join(', '));
    }
  } catch (e) {
    console.error(`Failed to read ${f}:`, e.message);
  }
});
