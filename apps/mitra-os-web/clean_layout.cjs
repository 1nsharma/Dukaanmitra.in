const fs = require('fs');
let content = fs.readFileSync('components/Layout.tsx', 'utf8');

content = content.replace(`  if (false) {\n    return <>{children}</>;\n  }\n`, '');

fs.writeFileSync('components/Layout.tsx', content);
console.log("Cleaned Layout.tsx");
