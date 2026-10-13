import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { validateEnv } from './lib/env';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Validate environment variables at build/dev startup
    try {
      validateEnv(env);
    } catch {
      console.warn('⚠️ Environment validation failed. Some features may not work.');
    }

    return {
      base: '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      optimizeDeps: { exclude: ['@dimforge/rapier3d-compat', '@mediapipe/tasks-vision'] },
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        },
        dedupe: [
          'react',
          'react-dom',
          'react-router',
          'react-router-dom',
          'three',
          '@react-three/fiber',
          '@react-three/drei'
        ]
      }
    };
});
