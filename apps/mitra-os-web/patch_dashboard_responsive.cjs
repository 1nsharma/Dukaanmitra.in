const fs = require('fs');
let content = fs.readFileSync('components/StoreDashboard.tsx', 'utf8');

// Marketing buttons grid
content = content.replace(/<div className="grid grid-cols-2 gap-4">\s*\{\['Festival Greeting', 'New Stock Arrival', 'Weekend Sale', 'Loyalty Reward'\]/g, 
  `<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">\n                {['Festival Greeting', 'New Stock Arrival', 'Weekend Sale', 'Loyalty Reward']`);

// Wait, let's fix grid-cols-5 
content = content.replace(/<div className="grid grid-cols-5 gap-1 w-full h-full">/g, 
  `<div className="grid grid-cols-3 sm:grid-cols-5 gap-1 w-full h-full">`);

// activeTab == 'qr' layout
content = content.replace(/<div className="grid lg:grid-cols-12 gap-10 items-center py-4 animate-in fade-in duration-700">/g,
  `<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-4 animate-in fade-in duration-700">`);
  
content = content.replace(/<Card className="lg:col-span-1 p-0 flex flex-col overflow-hidden">/g, 
  `<Card className="lg:col-span-1 p-0 flex flex-col overflow-hidden h-[400px] lg:h-auto">`);

content = content.replace(/<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-\[700px\] animate-in fade-in zoom-in duration-500">/g,
  `<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[700px] animate-in fade-in zoom-in duration-500">`);

fs.writeFileSync('components/StoreDashboard.tsx', content);
console.log("Patched StoreDashboard responsive");
