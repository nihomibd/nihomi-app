const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'docs', 'nihomi-master', 'NIHOMI_ROUTE_REGISTRY.csv');
const jsonPath = path.join(__dirname, '..', 'docs', 'nihomi-master', 'NIHOMI_ROUTE_REGISTRY.json');

const content = fs.readFileSync(csvPath, 'utf8').trim();
const lines = content.split(/\r?\n/);
const headers = lines[0].split(',').map(h => h.trim());

const records = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Simple CSV parser supporting quotes
  const row = [];
  let current = '';
  let inQuotes = false;

  for (let c = 0; c < line.length; c++) {
    const char = line[c];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  row.push(current.trim());

  const obj = {};
  headers.forEach((header, index) => {
    obj[header] = row[index] || '';
  });
  records.push(obj);
}

fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2), 'utf8');
console.log(`Successfully converted ${records.length} routes to ${jsonPath}`);
