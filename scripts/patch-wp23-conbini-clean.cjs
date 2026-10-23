const fs = require('fs');

console.log('--- Cleaning rogue colors in Conbini components ---');

// 1. ConbiniCustomerFigure.tsx
let fig = fs.readFileSync('src/components/simulation/conbini/ConbiniCustomerFigure.tsx', 'utf8').replace(/\r\n/g, '\n');
fig = fig.replace('bg-indigo-600 rounded-full shadow-xs', 'bg-[#E45147] rounded-full shadow-xs');
fig = fig.replace('bg-indigo-700 rounded-t-3xl border-t-2 border-indigo-400', 'bg-[#141726] rounded-t-3xl border-t-2 border-amber-500/40');
fig = fig.replace('text-indigo-200 uppercase mt-2', 'text-amber-200 uppercase mt-2');
fig = fig.replace('bg-purple-800 rounded-t-3xl border-t-2 border-purple-400', 'bg-[#1F2540] rounded-t-3xl border-t-2 border-amber-500/40');
fig = fig.replace('text-xs font-mono text-cyan-300/90 font-medium', 'text-xs font-mono text-amber-200/95 font-medium');
fs.writeFileSync('src/components/simulation/conbini/ConbiniCustomerFigure.tsx', fig, 'utf8');
console.log('✓ ConbiniCustomerFigure.tsx updated');

// 2. ConbiniCartoneTray.tsx
let tray = fs.readFileSync('src/components/simulation/conbini/ConbiniCartoneTray.tsx', 'utf8').replace(/\r\n/g, '\n');
tray = tray.replace("from-purple-100 via-purple-200 to-purple-100 border-purple-500 text-purple-950", "from-amber-100 via-amber-200 to-amber-100 border-amber-500 text-amber-950");
fs.writeFileSync('src/components/simulation/conbini/ConbiniCartoneTray.tsx', tray, 'utf8');
console.log('✓ ConbiniCartoneTray.tsx updated');

console.log('--- Conbini components 100% brand palette aligned! ---');
