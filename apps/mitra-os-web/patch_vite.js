import fs from 'fs';
let content = fs.readFileSync('vite.config.ts', 'utf8');

if (!content.includes('optimizeDeps')) {
  content = content.replace('plugins: [react(), tailwindcss()],', "plugins: [react(), tailwindcss()],\n      optimizeDeps: { exclude: ['@dimforge/rapier3d-compat'] },");
  fs.writeFileSync('vite.config.ts', content);
  console.log('Patched vite.config.ts');
}
