const fs = require('fs');

console.log('--- Patching MockExamsView.tsx & BaitoOsView.tsx with Official Brand Palette ---');

// 1. MockExamsView.tsx
let m = fs.readFileSync('src/views/MockExamsView.tsx', 'utf8').replace(/\r\n/g, '\n');
m = m.replace("bg-purple-600 text-white shadow-lg shadow-purple-600/30", "bg-[#E45147] text-white shadow-lg shadow-red-600/30");
m = m.replace("bg-purple-500/10 border border-purple-500/30 flex items-start gap-3 text-purple-200", "bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-200");
m = m.replace("text-purple-400 shrink-0 mt-0.5", "text-amber-400 shrink-0 mt-0.5");
m = m.replace("text-sm text-purple-300 mb-1", "text-sm text-amber-300 mb-1");
m = m.replace("bg-indigo-500/10 text-indigo-400", "bg-amber-500/10 text-amber-400");
fs.writeFileSync('src/views/MockExamsView.tsx', m, 'utf8');
console.log('✓ MockExamsView.tsx brand colors patched');

// 2. BaitoOsView.tsx
let b = fs.readFileSync('src/views/BaitoOsView.tsx', 'utf8').replace(/\r\n/g, '\n');
b = b.replace(/border-purple-200 dark:border-purple-500\/30/g, 'border-white/10 dark:border-white/10');
b = b.replace(/bg-purple-600\/10/g, 'bg-[#E45147]/5');
b = b.replace(/bg-indigo-500\/10/g, 'bg-amber-500/5');
b = b.replace(/bg-purple-500\/15 text-purple-700 dark:text-purple-300 font-mono text-xs font-bold border border-purple-500\/30/g, 'bg-amber-500/15 text-amber-300 font-mono text-xs font-bold border border-amber-500/30');
b = b.replace(/bg-purple-50\/50 dark:bg-\[\#141726\] border border-purple-100 dark:border-white\/10/g, 'bg-[#141726] border border-white/10');
b = b.replace(/border border-purple-500\/20/g, 'border border-amber-500/20');
b = b.replace(/text-purple-700 dark:text-purple-300/g, 'text-amber-300');
b = b.replace(/dark:from-purple-500\/20 dark:via-\[\#1f1938\] dark:to-\[\#120f26\]/g, 'dark:from-[#E45147]/10 dark:via-[#1F2540] dark:to-[#121524]');
b = b.replace(/dark:from-purple-500\/20 dark:via-\[\#26172e\] dark:to-\[\#120f26\]/g, 'dark:from-[#E45147]/10 dark:via-[#1F2540] dark:to-[#121524]');
b = b.replace(/ring-purple-500\/50/g, 'ring-red-500/30');
b = b.replace(/bg-purple-500\/15/g, 'bg-amber-500/15');
b = b.replace(/text-purple-600 dark:text-purple-400/g, 'text-amber-400');
b = b.replace(/bg-purple-500\/10 border border-purple-500\/30/g, 'bg-amber-500/10 border border-amber-500/30');
fs.writeFileSync('src/views/BaitoOsView.tsx', b, 'utf8');
console.log('✓ BaitoOsView.tsx brand colors patched');

console.log('--- All view-level brand palette conversions completed! ---');
