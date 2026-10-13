# Multi-stage production container for DukaanMitra-OS
# Stage 1: Build TypeScript Core Engine
FROM node:20-alpine AS core-builder
WORKDIR /app
COPY apps/core-engine/package*.json ./apps/core-engine/
RUN npm --prefix apps/core-engine ci
COPY apps/core-engine ./apps/core-engine
RUN npm --prefix apps/core-engine run build

# Stage 2: Unified Production Runner (Node.js + Python 3.11)
FROM python:3.11-slim-bullseye AS runner
WORKDIR /app

# Install Node.js, SQLite3 and required build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    sqlite3 \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY apps/ai-services/requirements.txt ./apps/ai-services/
RUN pip install --no-cache-dir -r ./apps/ai-services/requirements.txt

# Copy built artifacts and source code
COPY --from=core-builder /app/apps/core-engine/dist ./apps/core-engine/dist
COPY --from=core-builder /app/apps/core-engine/node_modules ./apps/core-engine/node_modules
COPY apps/core-engine/package.json ./apps/core-engine/
COPY apps/ai-services ./apps/ai-services
COPY scripts ./scripts
COPY package.json ./

ENV NODE_ENV=production
ENV PYTHONUNBUFFERED=1
ENV PORT=3000

EXPOSE 3000 8000

CMD ["node", "scripts/start-production.js"]
