const fs = require('fs');
let content = fs.readFileSync('./index.css', 'utf8');

content = content.replace("@import \"tailwindcss\";\n@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');", 
"@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');\n@import \"tailwindcss\";");

fs.writeFileSync('./index.css', content);
console.log("Patched index.css");
