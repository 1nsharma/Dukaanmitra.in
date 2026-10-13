const fs = require('fs');
let content = fs.readFileSync('components/Pricing.tsx', 'utf8');

content = content.replace(/import React from 'react';/, "import React from 'react';\nimport { RazorpayCheckoutButton } from './RazorpayCheckoutButton';");

content = content.replace(/<a href="https:\/\/whatsapp\.com\/channel\/0029VbBxi9eJZg4DGvYpBx0U" target="_blank" rel="noopener noreferrer" className={`block text-center w-full py-4 rounded-2xl font-black uppercase tracking-widest transition active:scale-95 \$\{p\.popular \? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'\}`}>[\s\S]*?<\/a>/g, 
  `{p.price === 'Free Forever' ? (
              <a href="https://whatsapp.com/channel/0029VbBxi9eJZg4DGvYpBx0U" target="_blank" rel="noopener noreferrer" className={\`block text-center w-full py-4 rounded-2xl font-black uppercase tracking-widest transition active:scale-95 \${p.popular ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}\`}>
                Get Started
              </a>
            ) : (
              <RazorpayCheckoutButton 
                amount={parseInt(p.price.replace(/[^0-9]/g, ''), 10)} 
                planName={p.name} 
                className={\`block text-center w-full py-4 rounded-2xl font-black uppercase tracking-widest transition active:scale-95 \${p.popular ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}\`} 
              />
            )}`);

fs.writeFileSync('components/Pricing.tsx', content);
console.log("Patched Pricing.tsx");
