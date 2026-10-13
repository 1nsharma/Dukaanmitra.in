import fs from 'fs';
let content = fs.readFileSync('components/LandingPage.tsx', 'utf8');

content = content.replace(
  `            <h1 className="hero-text text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7rem] font-black text-white leading-[0.9] tracking-tighter italic break-words">
              India's <br/>\\n              <span className="text-emerald-400">AI Business</span> <br/>\\n              Operating System
            </h1>
            <p className="hero-text text-2xl lg:text-3xl text-white/90 leading-relaxed max-w-xl font-bold uppercase tracking-tight">
              Run your inventory, sales, purchases, customers, udhaar and business operations from WhatsApp. <br/><br/>From Kirana to Factory — One AI Business OS.
            </p>`,
  `            <h1 className="hero-text text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7rem] font-black text-white leading-[0.9] tracking-tighter italic break-words">
              The AI Commerce <br/>
              <span className="text-emerald-400">Operating System</span> <br/>
              for Indian Retail
            </h1>
            <p className="hero-text text-2xl lg:text-3xl text-white/90 leading-relaxed max-w-xl font-bold tracking-tight">
              Manage Billing, Inventory, Udhaar, CRM & Analytics through WhatsApp AI.
            </p>`
);

// Replace button texts
content = content.replace('START FREE ON WHATSAPP ➔', 'Start Free ➔');
content = content.replace('SEE HOW IT WORKS', 'Book Live Demo');

fs.writeFileSync('components/LandingPage.tsx', content);
console.log("Patched LandingPage hero!");
