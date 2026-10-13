const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace('</head>', '  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>\n  </head>');
fs.writeFileSync('index.html', content);
console.log("Patched index.html for razorpay");
