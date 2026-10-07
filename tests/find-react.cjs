const fs = require('fs');
const content = fs.readFileSync('api/index.js', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('react/jsx-runtime') || line.includes('from "react"')) {
    console.log(`Line ${idx + 1}: ${line.trim().slice(0, 100)}`);
  }
});
