const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const coreDir = path.join(rootDir, 'apps', 'core-engine');
const aiDir = path.join(rootDir, 'apps', 'ai-services');

console.log('================================================================');
console.log('       ?? DukaanMitra-OS Unified Development Launcher          ');
console.log('================================================================');
console.log('Starting services:');
console.log('  1. Core Engine (Node.js/Express)  -> http://localhost:3000');
console.log('  2. AI Services (FastAPI/Python)   -> http://localhost:8000');
console.log('----------------------------------------------------------------\n');

// 1. Launch Core Engine
const coreCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const coreProcess = spawn(coreCmd, ['run', 'dev'], {
  cwd: coreDir,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, QUEUE_MODE: 'memory', REDIS_URL: 'memory' }
});

// 2. Launch Python AI Services
const aiProcess = spawn('python', ['-m', 'uvicorn', 'app:app', '--port', '8000', '--reload'], {
  cwd: aiDir,
  stdio: 'inherit',
  shell: true
});

function cleanup() {
  console.log('\nStopping DukaanMitra-OS services...');
  try { coreProcess.kill(); } catch (_) {}
  try { aiProcess.kill(); } catch (_) {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);