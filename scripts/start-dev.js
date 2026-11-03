const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const coreDir = path.join(rootDir, 'apps', 'core-engine');
const aiDir = path.join(rootDir, 'apps', 'ai-services');
const whatsappDir = path.join(rootDir, 'apps', 'whatsapp-gateway');

console.log('================================================================');
console.log('       🚀 DukaanMitra-OS Unified AI Commerce System Launcher    ');
console.log('================================================================');
console.log('Starting Microservices:');
console.log('  1. Core Engine (Node.js/Express)  -> http://localhost:3000');
console.log('  2. AI Services (FastAPI/Python)   -> http://localhost:8000');
console.log('  3. OpenWA WhatsApp Gateway        -> http://localhost:2785');
console.log('----------------------------------------------------------------\n');

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

// 1. Launch Core Engine
const coreProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: coreDir,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    QUEUE_MODE: 'memory',
    REDIS_URL: 'memory',
    OPENWA_URL: 'http://localhost:2785',
  },
});

// 2. Launch Python AI Services
const aiProcess = spawn('python', ['-m', 'uvicorn', 'app:app', '--port', '8000', '--reload'], {
  cwd: aiDir,
  stdio: 'inherit',
  shell: true,
});

// 3. Launch OpenWA WhatsApp Gateway
const whatsappProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: whatsappDir,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    OPENWA_PORT: '2785',
    CORE_WEBHOOK_URL: 'http://localhost:3000/whatsapp/openwa/webhook',
  },
});

function cleanup() {
  console.log('\nStopping DukaanMitra-OS microservices...');
  try { coreProcess.kill(); } catch (_) {}
  try { aiProcess.kill(); } catch (_) {}
  try { whatsappProcess.kill(); } catch (_) {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
