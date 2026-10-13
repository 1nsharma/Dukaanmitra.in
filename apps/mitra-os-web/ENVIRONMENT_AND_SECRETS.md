# Environment & Secrets Management Guide

This document outlines the environment configuration strategy, secrets management, and Docker orchestration for the application.

## 1. Environment Files Structure

We use a hierarchical environment configuration approach:

- **`.env.example`**: The template file committed to version control. Contains all required variables with dummy values or empty strings.
- **`.env`**: Local development environment variables. **NEVER committed to version control.**
- **`.env.production`**: Production environment variables (used by Docker Compose for local production simulation). **NEVER committed to version control.**

### Naming Conventions
- Variables exposed to the Vite client bundle MUST be prefixed with `VITE_` (e.g., `VITE_API_URL`).
- Server-side only variables or build-time variables do not need a prefix (e.g., `GEMINI_API_KEY`).

## 2. Configuration Validation

We use `zod` to validate environment variables at build and development startup.
- The schema is defined in `src/lib/env.ts`.
- `vite.config.ts` imports and runs this validation.
- The application will fail fast or log warnings if required variables are missing.

## 3. Secrets Management & CI/CD

**Rule #1: Never commit secrets (API keys, database passwords, certificates) to version control.**

### Local Development
1. Copy `.env.example` to `.env`.
2. Populate the `.env` file with your local development secrets.
3. The `.gitignore` file is configured to ignore all `.env*` files (except `.env.example`).

### CI/CD Pipeline Injection
When deploying via CI/CD (e.g., GitHub Actions, GitLab CI, Google Cloud Build):

1. **Store Secrets Securely**: Store secrets in your CI/CD provider's secret manager (e.g., GitHub Secrets, AWS Secrets Manager, Google Secret Manager).
2. **Inject at Build Time**: For Vite SPAs, environment variables prefixed with `VITE_` must be available during the build step (`npm run build`).
   ```yaml
   # Example GitHub Actions snippet
   steps:
     - name: Build Application
       run: npm run build
       env:
         VITE_API_URL: ${{ secrets.VITE_API_URL }}
         GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
   ```
3. **Inject at Runtime (Server/Docker)**: For server-side variables, inject them when running the Docker container.
   ```bash
   docker run -d -p 3000:3000 -e GEMINI_API_KEY=$GEMINI_API_KEY my-app:latest
   ```

## 4. Docker Orchestration

We provide optimized Docker configurations for different environments:

- **`Dockerfile.dev`**: Optimized for local development with hot-reloading. Uses volume mounts to sync local code changes.
- **`Dockerfile`**: Multi-stage build optimized for production. Compiles the app and serves it using a lightweight static file server (`serve`).
- **`docker-compose.yml`**: Orchestrates the containers.
  - Run development: `docker-compose up app-dev`
  - Run production simulation: `docker-compose up app-prod`
