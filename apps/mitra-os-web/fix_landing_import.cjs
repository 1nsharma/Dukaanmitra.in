const fs = require('fs');
let content = fs.readFileSync('components/LandingPage.tsx', 'utf8');
content = content.replace("import React, { useEffect, useRef } from 'react';", "import React, { useEffect, useRef } from 'react';\nimport { RazorpayCheckoutButton } from './RazorpayCheckoutButton';");
fs.writeFileSync('components/LandingPage.tsx', content);
console.log("Fixed import in LandingPage");
