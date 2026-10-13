import { z } from 'zod';

/**
 * Environment Variable Validation Schema
 * 
 * This schema ensures that all required environment variables are present
 * and correctly typed at application startup. It fails fast if configurations
 * are missing or invalid.
 */
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  
  // API Keys
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required for AI features'),
  
  // App Settings
  PORT: z.coerce.number().default(3000),
});

// Parse and validate the environment variables
// Note: In Vite, client-side env vars are exposed via import.meta.env
// However, since we are validating process.env (or Vite's loadEnv in vite.config.ts),
// we need to handle this carefully. 
// For client-side validation of VITE_ variables, use import.meta.env.
// For server-side or build-time validation, use process.env.

export const validateEnv = (env: Record<string, any>) => {
  const parsed = envSchema.safeParse(env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    throw new Error('Invalid environment variables. Check your .env file.');
  }

  return parsed.data;
};

// If running in a Node environment (e.g., server or build script), we can validate immediately
if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'test') {
  try {
    // We only validate if GEMINI_API_KEY is present in process.env to avoid crashing client-side
    // if it's not injected properly yet.
    if (process.env.GEMINI_API_KEY) {
      envSchema.parse(process.env);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:', error.format());
    }
  }
}

export type Env = z.infer<typeof envSchema>;
