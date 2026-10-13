const fs = require('fs');
let content = fs.readFileSync('components/LandingPage.tsx', 'utf8');

content = content.replace(/<section id="waitlist" className="py-32 px-6 lg:px-20 bg-indigo-50 hidden">/g, 
  '<section id="waitlist" className="py-32 px-6 lg:px-20 bg-indigo-50">');
  
content = content.replace(/<section id="pricing" className="py-32 px-6 lg:px-20 bg-white hidden">/g, 
  '<section id="pricing" className="py-32 px-6 lg:px-20 bg-white">');
  
content = content.replace(/<section className="py-32 px-6 lg:px-20 bg-slate-50 hidden">/g, 
  '<section className="py-32 px-6 lg:px-20 bg-slate-50">');

fs.writeFileSync('components/LandingPage.tsx', content);
console.log("Patched LandingPage hidden sections");
