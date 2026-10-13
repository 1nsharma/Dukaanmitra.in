import fs from 'fs';
let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace("import FeaturePage from './components/FeaturePage';", "import FeaturePage from './components/FeaturePage';\nimport StaticPage from './components/StaticPage';");

const staticRoutes = `
          <Route path="/docs" element={<StaticPage />} />
          <Route path="/changelog" element={<StaticPage />} />
          <Route path="/roadmap" element={<StaticPage />} />
          <Route path="/founder" element={<StaticPage />} />
          <Route path="/security" element={<StaticPage />} />
          <Route path="/support" element={<StaticPage />} />
`;

content = content.replace('<Route path="/contact" element={<Contact />} />', '<Route path="/contact" element={<Contact />} />' + staticRoutes);

fs.writeFileSync('App.tsx', content);
console.log("Patched App.tsx for static routes!");
