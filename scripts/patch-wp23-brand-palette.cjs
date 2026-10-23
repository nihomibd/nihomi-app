const fs = require('fs');

console.log('--- Applying WP23 Global Brand Palette Updates ---');

// 1. V2PricingPage.tsx
let p = fs.readFileSync('src/v2/pages/V2PricingPage.tsx', 'utf8').replace(/\r\n/g, '\n');
p = p.replace('bg-cyan-400 text-black px-1.5 py-0.2 rounded font-black', 'bg-amber-400 text-black px-1.5 py-0.2 rounded font-black');
p = p.replace('<th className="p-4 sm:p-5 font-bold text-cyan-300 text-center min-w-[150px]">', '<th className="p-4 sm:p-5 font-bold text-white text-center min-w-[150px]">');
p = p.replace('<div className="text-xs text-cyan-300">৳৩,৯৯০ / মাস</div>', '<div className="text-xs text-stone-300">৳৩,৯৯০ / মাস</div>');
p = p.replace('<td className="p-4 sm:p-5 text-center text-cyan-400 font-bold">✓ N2 & N1 সম্পূর্ণ</td>', '<td className="p-4 sm:p-5 text-center text-emerald-400 font-bold">✓ N2 & N1 সম্পূর্ণ</td>');
p = p.replace('<td className="p-4 sm:p-5 text-center text-cyan-300 font-semibold">১,০০০+ কাঞ্জি (N5-N1)</td>', '<td className="p-4 sm:p-5 text-center text-stone-200 font-semibold">১,০০০+ কাঞ্জি (N5-N1)</td>');
p = p.replace('<td className="p-4 sm:p-5 text-center text-cyan-300 font-bold">✓ AI কাভার লেটার + PDF</td>', '<td className="p-4 sm:p-5 text-center text-amber-300 font-bold">✓ AI কাভার লেটার + PDF</td>');
p = p.replace('<td className="p-4 sm:p-5 text-center text-cyan-300 font-bold">✓ আনলিমিটেড + সার্টিফিকেট</td>', '<td className="p-4 sm:p-5 text-center text-amber-300 font-bold">✓ আনলিমিটেড + সার্টিফিকেট</td>');
p = p.replace('<td className="p-4 sm:p-5 text-center text-cyan-300 font-bold">৪,০০০ কয়েন + প্রায়োরিটি</td>', '<td className="p-4 sm:p-5 text-center text-amber-300 font-bold">৪,০০০ কয়েন + প্রায়োরিটি</td>');
p = p.replace('<td className="p-4 sm:p-5 text-center text-cyan-300 font-bold">১-অন-১ ভিসা ও ইন্টারভিউ</td>', '<td className="p-4 sm:p-5 text-center text-amber-300 font-bold">১-অন-১ ভিসা ও ইন্টারভিউ</td>');
p = p.replace('className="w-full py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer shadow"', 'className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#E45147] to-[#F59E0B] hover:brightness-110 text-white font-black text-xs transition cursor-pointer shadow"');
fs.writeFileSync('src/v2/pages/V2PricingPage.tsx', p, 'utf8');
console.log('✓ V2PricingPage.tsx updated');

// 2. V2RirekishoPage.tsx
let r = fs.readFileSync('src/v2/pages/V2RirekishoPage.tsx', 'utf8').replace(/\r\n/g, '\n');
r = r.replace('bg-cyan-500/20 text-cyan-400 border border-cyan-500/30', 'bg-[#E45147]/10 text-[#E45147] border border-[#E45147]/30');
fs.writeFileSync('src/v2/pages/V2RirekishoPage.tsx', r, 'utf8');
console.log('✓ V2RirekishoPage.tsx updated');

// 3. V2Header.tsx
let h = fs.readFileSync('src/v2/components/layout/V2Header.tsx', 'utf8').replace(/\r\n/g, '\n');
h = h.replace('<GraduationCap className="w-4 h-4 text-purple-400" />', '<GraduationCap className="w-4 h-4 text-[#E45147]" />');
fs.writeFileSync('src/v2/components/layout/V2Header.tsx', h, 'utf8');
console.log('✓ V2Header.tsx updated');

// 4. V2FounderPage.tsx
let f = fs.readFileSync('src/v2/pages/V2FounderPage.tsx', 'utf8').replace(/\r\n/g, '\n');
f = f.replace('<Users className="w-4 h-4 text-cyan-400" />', '<Users className="w-4 h-4 text-emerald-400" />');
f = f.replace('<div className="text-[11px] text-cyan-400 font-mono flex items-center gap-1 pt-1 border-t border-white/5">', '<div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 pt-1 border-t border-white/5">');
f = f.replace('<ShieldCheck className="w-4 h-4 text-purple-400" />', '<ShieldCheck className="w-4 h-4 text-amber-400" />');
f = f.replace('<div className="text-[11px] text-purple-300 font-mono pt-1 border-t border-white/5">', '<div className="text-[11px] text-amber-300 font-mono pt-1 border-t border-white/5">');
fs.writeFileSync('src/v2/pages/V2FounderPage.tsx', f, 'utf8');
console.log('✓ V2FounderPage.tsx updated');

// 5. ConbiniCustomerTablet.tsx
let c = fs.readFileSync('src/components/simulation/conbini/ConbiniCustomerTablet.tsx', 'utf8').replace(/\r\n/g, '\n');
c = c.replace(/border-indigo-500\/50/g, 'border-amber-500/40');
c = c.replace(/border-indigo-500\/30/g, 'border-amber-500/30');
c = c.replace(/bg-indigo-400/g, 'bg-amber-400');
c = c.replace(/text-indigo-300/g, 'text-amber-300');
fs.writeFileSync('src/components/simulation/conbini/ConbiniCustomerTablet.tsx', c, 'utf8');
console.log('✓ ConbiniCustomerTablet.tsx updated');

console.log('--- All WP23 brand palette updates finished! ---');
