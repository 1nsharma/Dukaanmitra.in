# DukaanMitra Universal Business AI — MVP

A runnable, local-first starter for an agent-first business operations product.

## Included
- FastAPI backend and SQLite persistence
- Business onboarding and editable business-type template registry
- Product catalog, stock movement ledger, low-stock summary
- Deterministic starter command agent with explicit confirmation for stock-changing commands
- Persistent store knowledge
- Role checks, audit log, and pending-action records
- Photo/document upload with optional OCR/PDF extraction
- Browser speech recognition where supported
- Optional official WhatsApp Cloud API outbound adapter and signature-verified webhook receiver

## Not yet included
This is an MVP scaffold, not a production deployment. It does not include production-grade login/session management, tenant isolation testing, a hosted database, an LLM provider integration, robust visual product recognition, automated WhatsApp inbound-to-business routing, billing/GST compliance, or production observability. Do not expose the demo deployment to the public internet as-is.

## Run locally
Requires Python 3.11+.

```bash
python -m venv .venv
# macOS/Linux:
source .venv/bin/activate
# Windows PowerShell:
# .venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env
uvicorn app:app --reload
```

Open http://127.0.0.1:8000. API docs: http://127.0.0.1:8000/docs

The demo uses `ALLOW_DEMO_OWNER=true` for frictionless local testing. Before production, implement real authentication, set `ALLOW_DEMO_OWNER=false`, require verified membership on every operation, use managed secrets, and move to PostgreSQL.

## Optional OCR
Image OCR uses Tesseract via `pytesseract` and Pillow. Install the Tesseract system binary separately. PDF text extraction uses `pypdf`; scanned PDFs need OCR preprocessing. OCR output is untrusted and must be reviewed before changing inventory.

## WhatsApp Cloud API (optional)
1. Create/configure a Meta app and WhatsApp Business Platform sender.
2. Deploy this service behind public HTTPS.
3. Set `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET`, `WHATSAPP_ACCESS_TOKEN`, and `WHATSAPP_PHONE_NUMBER_ID` in the deployment environment.
4. Configure webhook URL `/webhooks/whatsapp` and the same verify token in Meta.
5. Verify inbound webhook signatures. Then implement and test `channel_links` routing and map authorized sender numbers to a business and role before enabling commands.
6. Outbound text is available at `POST /api/whatsapp/send` with JSON `{"to":"E.164_NUMBER","message":"Hello"}`.
7. Follow current Meta policies, template rules, user opt-in requirements, and pricing. API availability and message cost are controlled by Meta; this repository does not make WhatsApp free.

Do not commit access tokens or secrets. Do not use personal-account browser automation as a substitute for the official API.

## Agent architecture
`interpret_command()` is the initial deterministic agent boundary. Keep model interpretation separate from business execution:
- Parse user intent into a typed, validated action.
- Read only the current tenant's business data.
- Ask clarifying questions for ambiguous entity matches.
- Stage consequential mutations in `pending_actions`.
- Execute via deterministic domain services after authorization and confirmation.
- Record every mutation in stock ledger and audit log.
- Add model providers behind a replaceable adapter; never let a model write SQL directly.

MCP is not required for internal operations. Use ordinary typed service calls; add MCP only for integrations where it is useful.

## API quick start
- `GET /api/health`
- `GET /api/templates`
- `POST /api/businesses`
- `GET /api/businesses/{business_id}/products`
- `POST /api/businesses/{business_id}/products`
- `POST /api/businesses/{business_id}/stock-movements`
- `GET /api/businesses/{business_id}/summary`
- `POST /api/agent/command`
- `POST /api/agent/actions/{action_id}/confirm`
- `POST /api/businesses/{business_id}/knowledge`
- `GET /api/businesses/{business_id}/audit`
- `POST /api/uploads`
- `GET/POST /webhooks/whatsapp`

## Production checklist
- [ ] Real auth, passwordless or OIDC login, session/CSRF controls
- [ ] Tenant authorization tests for every endpoint
- [ ] Rate limiting, request size limits, malware scanning and private upload storage
- [ ] PostgreSQL migrations, backups, restore drills
- [ ] Secrets manager and WhatsApp webhook retry/idempotency handling
- [ ] Inbound sender linking and opt-in / consent handling
- [ ] LLM adapter with structured outputs, evaluation suite, prompt-injection defenses
- [ ] OCR confidence, product matching review UI and duplicate detection
- [ ] Tests for concurrent stock changes, permissions and ledger consistency
- [ ] Privacy policy, retention/deletion controls, audit export
