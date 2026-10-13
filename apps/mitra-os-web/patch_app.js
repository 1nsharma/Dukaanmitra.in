import fs from 'fs';
let content = fs.readFileSync('App.tsx', 'utf8');

// Add import for FeaturePage
content = content.replace("import { NotFound } from './components/NotFound';", "import { NotFound } from './components/NotFound';\nimport FeaturePage from './components/FeaturePage';");

// Add routes
const routes = `
          <Route path="/whatsapp-ai" element={<FeaturePage />} />
          <Route path="/inventory" element={<FeaturePage />} />
          <Route path="/billing" element={<FeaturePage />} />
          <Route path="/udhaar" element={<FeaturePage />} />
          <Route path="/analytics" element={<FeaturePage />} />
          <Route path="/crm" element={<FeaturePage />} />
          <Route path="/retail-ai" element={<FeaturePage />} />
`;

content = content.replace('<Route path="/features" element={<Features />} />', '<Route path="/features" element={<Features />} />' + routes);

fs.writeFileSync('App.tsx', content);
console.log("Patched App.tsx for features!");
