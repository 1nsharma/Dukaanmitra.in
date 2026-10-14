# DukaanMitra — Pilot & Production Deployment Guide (GCP Cloud Run)

DukaanMitra is an event-driven AI business management platform designed for any business type (Kirana, Salon, Pharmacy, Restaurant, Garage, Coaching, etc.) with pre-generated editable catalogs, multi-modal capture (Voice, Photo, OCR, Object Detection, Annotations), store knowledge base, and UPI-simple phone onboarding.

---

## Architecture Overview

- **Core Engine**: Express + TypeScript + Prisma ORM (PostgreSQL) + Bull/Redis Queue
- **Multi-Modal AI Agents (In-process)**:
  - `OnboardingAgent`: UPI-style zero-friction onboarding via phone + template seeding
  - `InventoryAgent`: Deterministic stock movements, adjustments, and price edits
  - `VoiceAgent`: Speech-to-text transcripts → inventory intents & knowledge capture
  - `OcrAgent`: Bill/receipt image OCR → automated stock purchase & sales logging
  - `VisionAgent`: Shelf photo object detection, annotations & automated count reconciliation
  - `KnowledgeAgent`: Store policies, customer preferences, supplier notes
  - `BillParserAgent` & `CustomerIntelligenceAgent`: Sales parsing & CRM insights
- **Cloud Infrastructure (GCP)**:
  - **Compute**: Google Cloud Run (containerized stateless API + queue workers)
  - **Database**: Cloud SQL (PostgreSQL with optional pgvector)
  - **Queue/Cache**: Memorystore for Redis
  - **Secrets**: Google Secret Manager (`DATABASE_URL`, `REDIS_URL`, etc.)
  - **CI/CD**: Google Cloud Build (`cloudbuild.yaml`) + Artifact Registry

---

## 1. Prerequisites & GCP Setup

1. **GCP Project Setup**:
   ```bash
   gcloud config set project <PROJECT_ID>
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com sqladmin.googleapis.com vpcaccess.googleapis.com
   ```

2. **Artifact Registry**:
   ```bash
   gcloud artifacts repositories create dukaanmitra \
     --repository-format=docker \
     --location=asia-south1 \
     --description="DukaanMitra Docker repository"
   ```

3. **Cloud SQL (PostgreSQL)**:
   ```bash
   gcloud sql instances create dukaanmitra-db \
     --database-version=POSTGRES_15 \
     --tier=db-custom-1-3840 \
     --region=asia-south1
   ```

4. **Secret Manager**:
   ```bash
   echo -n "postgresql://user:pass@host:5432/dukaanmitra" | gcloud secrets create dukaanmitra-database-url --data-file=-
   echo -n "redis://10.x.x.x:6379" | gcloud secrets create dukaanmitra-redis-url --data-file=-
   ```

---

## 2. Local Testing & Verification

Run the built-in verification suite:
```bash
npm install
npx prisma generate
npm test          # Runs tsx test/smoke.ts (validates all 10 templates, schemas & agents)
npm run build     # Verifies clean TypeScript compilation to dist/
```

---

## 3. Pilot Deployment via Cloud Build

Trigger Cloud Build using `cloudbuild.yaml`:
```bash
gcloud builds submit --config=cloudbuild.yaml --substitutions=_LOCATION=asia-south1
```

Or deploy directly via `gcloud run deploy`:
```bash
gcloud run deploy dukaanmitra-api \
  --source . \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --set-secrets=DATABASE_URL=dukaanmitra-database-url:latest,REDIS_URL=dukaanmitra-redis-url:latest
```

---

## 4. Key Pilot API Endpoints

### A. UPI-Style Onboarding & Templates
- `GET /api/templates`: List all available business templates (kirana, salon, pharmacy, restaurant, etc.)
- `GET /api/templates/:key`: Fetch starter inventory & workflow configuration for a template
- `POST /api/onboarding/start`: Initiate phone-based onboarding (`{ phone: "+919876543210" }`)
- `POST /api/onboarding/step`: Progress onboarding steps
- `POST /api/onboarding/complete`: Finalize setup, select template, and seed starter catalog

### B. Multi-Modal Capture & Direct Business Management
- `POST /api/voice/intent`: Voice transcript → inventory update / stock change / price edit
- `POST /api/ocr/bill`: Upload receipt or invoice image → automated line-item stock addition
- `POST /api/media/upload`: Upload shelf photo or voice note for agent pipeline processing
- `POST /api/media/:assetId/annotate`: Add merchant or AI bounding box annotations
- `POST /api/knowledge/capture`: Store shop policies, customer preferences, or supplier details
- `GET /api/stores/:storeId/knowledge`: Retrieve store intelligence base

### C. Direct Inventory & Sales
- `GET /api/stores/:storeId/products`: Search and list live store catalog
- `PATCH /api/products/:productId`: Edit SKU name, prices, units, or threshold alerts
- `POST /api/sales`: Record incoming sale and decrement stock deterministically
