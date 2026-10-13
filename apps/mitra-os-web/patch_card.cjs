const fs = require('fs');
let content = fs.readFileSync('components/ui/Card.tsx', 'utf8');

content = content.replace(/'p-10 rounded-\[3rem\]'/, "'p-6 md:p-10 rounded-[2rem] md:rounded-[3rem]'");
content = content.replace(/'text-3xl font-black text-slate-900 italic tracking-tighter uppercase leading-tight'/, "'text-2xl md:text-3xl font-black text-slate-900 italic tracking-tighter uppercase leading-tight'");
content = content.replace(/'mt-10 pt-8 border-t border-slate-100'/, "'mt-6 md:mt-10 pt-6 md:pt-8 border-t border-slate-100'");

fs.writeFileSync('components/ui/Card.tsx', content);
console.log("Patched Card.tsx responsive");
