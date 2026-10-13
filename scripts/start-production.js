/**
 * DukaanMitra AI Technologies Private Limited
 * Daemonized Production Process Supervisor & Launcher
 */
const { spawn, execSync } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const coreDist = path.join(rootDir, 'apps', 'core-engine', 'dist', 'index.js');
const coreDir = path.join(rootDir, 'apps', 'core-engine');
const aiDir = path.join(rootDir, 'apps', 'ai-services');

console.log('================================================================');
console.log('  🚀  DukaanMitra AI Technologies Private Limited               ');
console.log('       Daemonized Enterprise Production Launcher (v1.0.0)      ');
console.log('================================================================');

// 0. Clean old processes on ports 8000 & 3000 if running
console.log('[LAUNCHER] Step 0: Freeing production ports (8000, 3000)...');
try {
  if (process.platform === 'win32') {
    const findPorts = (port) => {
      try {
        const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf-8' });
        const lines = out.split('\n').filter(l => l.includes('LISTENING'));
        return lines.map(l => l.trim().split(/\s+/).pop()).filter(Boolean);
      } catch (_) { return []; }
    };
    [8000, 3000].forEach(port => {
      const pids = [...new Set(findPorts(port))];
      pids.forEach(pid => {
        try {
          console.log(`[LAUNCHER] Terminating previous process PID ${pid} on port ${port}...`);
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        } catch (_) {}
      });
    });
  }
} catch (e) {
  console.log('[LAUNCHER] Port cleanup notice:', e.message);
}

// 1. Verify build
console.log('[LAUNCHER] Step 1: Checking Core Engine build artifacts...');
try {
  if (!fs.existsSync(coreDist)) {
    console.log('[LAUNCHER] Building TypeScript core-engine...');
    execSync('npm --prefix apps/core-engine run build', { cwd: rootDir, stdio: 'inherit' });
  } else {
    console.log('[LAUNCHER] Core engine build verified at:', coreDist);
  }
} catch (err) {
  console.error('[LAUNCHER] Build verification error:', err.message);
}

// 2. Initialize Database and WAL Mode
console.log('[LAUNCHER] Step 2: Initializing SQLite schemas and platform tables...');
try {
  execSync('python -c "import app, superintelligence, company_entity, dukaanmitra_platform; app.init_db(); superintelligence.init_superintelligence_db(\'dukaanmitra.db\'); company_entity.init_company_db(\'dukaanmitra.db\'); dukaanmitra_platform.init_platform_db(\'dukaanmitra.db\'); print(\'Database ready in WAL mode with all platform tables.\')"', {
    cwd: aiDir,
    stdio: 'inherit'
  });
} catch (err) {
  console.warn('[LAUNCHER] Database initialization warning:', err.message);
}

// 3. Launch AI Brain & Micro-Modules Service (FastAPI) as persistent daemon
console.log('[LAUNCHER] Step 3: Launching AI Superintelligence Brain on :8000 (daemon)...');
const aiOut = fs.openSync(path.join(rootDir, 'ai-server.log'), 'a');
const aiErr = fs.openSync(path.join(rootDir, 'ai-server.log'), 'a');
const aiProcess = spawn('python', ['-m', 'uvicorn', 'app:app', '--port', '8000', '--host', '0.0.0.0'], {
  cwd: aiDir,
  detached: true,
  stdio: ['ignore', aiOut, aiErr],
  shell: true,
  env: { ...process.env, PYTHONUNBUFFERED: '1' }
});
aiProcess.unref();

// 4. Launch Core Engine Service (Node.js) as persistent daemon
console.log('[LAUNCHER] Step 4: Launching Core Engine & WhatsApp Router on :3000 (daemon)...');
const coreOut = fs.openSync(path.join(rootDir, 'core-server.log'), 'a');
const coreErr = fs.openSync(path.join(rootDir, 'core-server.log'), 'a');
const coreProcess = spawn('node', [coreDist], {
  cwd: coreDir,
  detached: true,
  stdio: ['ignore', coreOut, coreErr],
  shell: true,
  env: { ...process.env, NODE_ENV: 'production', PORT: '3000', QUEUE_MODE: 'memory' }
});
coreProcess.unref();

console.log('\n[LAUNCHER] Both daemon services initiated in persistent background mode!');
console.log('  -> Enterprise Web Portal & App:      http://localhost:8000');
console.log('  -> Public Verification Portal:       http://localhost:8000/verify');
console.log('  -> Corporate Verification API:       http://localhost:8000/api/v1/public/verify/corporate');
console.log('  -> Merchant Self-Serve Access:       http://localhost:8000/api/v1/access/otp-request');
console.log('  -> AI WhatsApp Bot Gateway:          http://localhost:8000/api/v1/whatsapp/webhook');
console.log('  -> Core POS Engine & Templates:      http://localhost:3000/api/templates');
console.log('  -> Live MitraOS React Web Console:   apps/mitra-os-web (run: npm run dev:mitraos)');
console.log('  -> Commercial Dukaanmitra.in Portal: apps/dukaan-in-next (run: npm run dev:dukaanin)');
console.log('[LAUNCHER] Startup logs: ai-server.log & core-server.log\n');
