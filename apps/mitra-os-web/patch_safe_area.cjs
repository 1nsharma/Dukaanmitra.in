const fs = require('fs');
let content = fs.readFileSync('components/Layout.tsx', 'utf8');

content = content.replace(/className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md"/g, 
  'className="md:hidden bg-slate-900 text-white p-4 pt-[calc(1rem+env(safe-area-inset-top))] flex items-center justify-between sticky top-0 z-50 shadow-md"');

fs.writeFileSync('components/Layout.tsx', content);
console.log("Patched safe area");
