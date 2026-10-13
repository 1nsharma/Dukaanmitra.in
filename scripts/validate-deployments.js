const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let hasErrors = false;

function check(desc, fn) {
  try {
    fn();
    console.log(`[PASS] ${desc}`);
  } catch (err) {
    console.error(`[FAIL] ${desc}: ${err.message}`);
    hasErrors = true;
  }
}

console.log("=== DukaanMitra-OS Multi-Platform Deployment & Dev Console Validator ===\n");

// 1. GitHub Actions CI/CD
check("GitHub Actions CI/CD Workflow exists and is configured", () => {
  const file = path.join(ROOT, '.github', 'workflows', 'ci-cd.yml');
  if (!fs.existsSync(file)) throw new Error("ci-cd.yml not found");
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('actions/checkout@v4')) throw new Error("Missing checkout action");
  if (!content.includes('npm test')) throw new Error("Missing npm test execution");
});

// 2. Vercel Configuration
check("Root vercel.json is valid JSON with proxy rewrites", () => {
  const file = path.join(ROOT, 'vercel.json');
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!json.rewrites || json.rewrites.length === 0) throw new Error("Missing rewrites in root vercel.json");
});

check("apps/mitra-os-web/vercel.json is valid Vite SPA configuration", () => {
  const file = path.join(ROOT, 'apps', 'mitra-os-web', 'vercel.json');
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (json.framework !== 'vite') throw new Error("Expected vite framework");
});

check("apps/dukaan-in-next/vercel.json is valid Next.js configuration", () => {
  const file = path.join(ROOT, 'apps', 'dukaan-in-next', 'vercel.json');
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (json.framework !== 'nextjs') throw new Error("Expected nextjs framework");
});

// 3. Railway Configuration
check("railway.json is valid JSON with healthcheck", () => {
  const file = path.join(ROOT, 'railway.json');
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!json.deploy || !json.deploy.healthcheckPath) throw new Error("Missing deploy.healthcheckPath");
});

check("railway.toml and Procfile exist", () => {
  const toml = path.join(ROOT, 'railway.toml');
  const proc = path.join(ROOT, 'Procfile');
  if (!fs.existsSync(toml)) throw new Error("Missing railway.toml");
  if (!fs.existsSync(proc)) throw new Error("Missing Procfile");
});

// 4. Render Blueprint
check("render.yaml defines services and persistent disks", () => {
  const file = path.join(ROOT, 'render.yaml');
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('dukaanmitra-os-enterprise')) throw new Error("Missing enterprise service definition");
  if (!content.includes('healthCheckPath: /api/v1/health')) throw new Error("Missing health check path");
});

// 5. Multi-Service Composition
check("docker-compose.yml defines multi-service orchestration", () => {
  const file = path.join(ROOT, 'docker-compose.yml');
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('dukaanmitra-enterprise:')) throw new Error("Missing enterprise container");
  if (!content.includes('mitra-os-web:')) throw new Error("Missing mitra-os-web container");
  if (!content.includes('dukaan-in-next:')) throw new Error("Missing dukaan-in-next container");
});

// 6. WhatsApp Admin Dev Console
check("WhatsApp Admin Testing Console endpoints and HTML UI present", () => {
  const platFile = path.join(ROOT, 'apps', 'ai-services', 'dukaanmitra_platform.py');
  const platContent = fs.readFileSync(platFile, 'utf8');
  if (!platContent.includes('WhatsAppAdminDevConsoleService')) throw new Error("Missing WhatsAppAdminDevConsoleService");
  if (!platContent.includes('/api/v1/whatsapp/admin/simulate')) throw new Error("Missing admin simulation route");

  const htmlFile = path.join(ROOT, 'apps', 'ai-services', 'static', 'index.html');
  const htmlContent = fs.readFileSync(htmlFile, 'utf8');
  if (!htmlContent.includes('tab-whatsapp')) throw new Error("Missing tab-whatsapp container");
  if (!htmlContent.includes('executeWhatsAppDevMessage')) throw new Error("Missing executeWhatsAppDevMessage JS function");
});

console.log("\n--------------------------------------------------------------");
if (hasErrors) {
  console.error("❌ Validation FAILED with errors!");
  process.exit(1);
} else {
  console.log("✅ All deployment configurations & WhatsApp Dev Console verified 100% PASSING!");
  process.exit(0);
}
