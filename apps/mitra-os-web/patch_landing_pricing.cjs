const fs = require('fs');

let content = fs.readFileSync('components/LandingPage.tsx', 'utf8');

// Add import if not present
if (!content.includes('RazorpayCheckoutButton')) {
  content = content.replace("import React from 'react';", "import React from 'react';\nimport { RazorpayCheckoutButton } from './RazorpayCheckoutButton';");
}

// Replace the Button with RazorpayCheckoutButton or link
content = content.replace(/<Button\s+variant=\{p\.name === 'Growth \+ Supply' \? 'primary' : 'secondary'\}\s+className="w-full py-6 h-14 shadow-\[4px_4px_0px_0px_rgba\(0,0,0,0\.1\)\] hover:shadow-none transition-all italic tracking-tighter"\s+>\s+CHOOSE THIS PLAN ➔\s+<\/Button>/g, 
  `{p.price === 'Free Forever' ? (
                    <a href="https://whatsapp.com/channel/0029VbBxi9eJZg4DGvYpBx0U" target="_blank" rel="noopener noreferrer" className={cn(
                      "flex items-center justify-center w-full py-6 h-14 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none transition-all italic tracking-tighter font-black text-sm uppercase",
                      p.name === 'Growth + Supply' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-900'
                    )}>
                      CHOOSE THIS PLAN ➔
                    </a>
                  ) : (
                    <RazorpayCheckoutButton 
                      amount={parseInt(p.price.replace(/[^0-9]/g, ''), 10)} 
                      planName={p.name} 
                      className={cn(
                        "w-full py-6 h-14 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none transition-all italic tracking-tighter font-black text-sm uppercase",
                        p.name === 'Growth + Supply' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-900'
                      )} 
                    />
                  )}`);

fs.writeFileSync('components/LandingPage.tsx', content);
console.log("Patched LandingPage.tsx pricing buttons");
