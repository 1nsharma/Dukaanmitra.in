const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(/<\/head>/, `
    <title>DukaanMitra - The AI Munim for Indian Shopkeepers</title>
    <meta name="description" content="Replace your paper register with AI. DukaanMitra is a WhatsApp-native store management system for Indian retailers." />
    <meta property="og:title" content="DukaanMitra - The AI Munim for Indian Shopkeepers" />
    <meta property="og:description" content="Replace your paper register with AI. DukaanMitra is a WhatsApp-native store management system for Indian retailers." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="DukaanMitra - AI Munim" />
    <meta name="twitter:description" content="Replace your paper register with AI." />
  </head>`);

fs.writeFileSync('index.html', content);
console.log("Patched index.html");
