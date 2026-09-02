import fs from 'fs';
import path from 'path';

const dbFile = path.join(process.cwd(), 'server', 'data', 'nihomi_db.json');
if (fs.existsSync(dbFile)) {
  const data = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
  console.log('=== NIHOMI JSON DB INVENTORY ===');
  for (const [key, val] of Object.entries(data)) {
    if (Array.isArray(val)) {
      console.log(`* ${key}: ${val.length} records`);
    }
  }
} else {
  console.log('No local JSON DB found.');
}
