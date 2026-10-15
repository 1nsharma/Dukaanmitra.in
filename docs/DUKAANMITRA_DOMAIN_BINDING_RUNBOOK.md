# DukaanMitra.in — Production Domain Binding & Verification Gate Runbook

> **Target Domain**: `dukaanmitra.in` & `www.dukaanmitra.in`  
> **API & Ingress Gateway**: `api.dukaanmitra.in`  
> **Entity**: DukaanMitra AI Technologies Private Limited (CIN: `U72900DL2026PTC998877`)  
> **Updated**: 15 October 2026

---

## 1. Canonical DNS Configuration Matrix

Add the following DNS records in your domain registrar (GoDaddy / Cloudflare / Namecheap / Hostinger) for `dukaanmitra.in`:

| Type | Host / Name | Target / Value | TTL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` (Vercel) *or* Production VM Public IPv4 | Auto / 300 | Root Web Portal & Verification Gate |
| **CNAME** | `www` | `cname.vercel-dns.com` *or* `dukaanmitra.in` | Auto / 300 | Canonical WWW Redirect |
| **A / CNAME** | `api` | Production Railway / VPS Public Ingress IP | Auto / 300 | Multi-Modal AI Brain & Core Engine API |
| **CNAME** | `ondc` | `api.dukaanmitra.in` | Auto / 300 | ONDC Beckn Protocol Ingress Adapter |
| **TXT** | `@` | `dukaanmitra-site-verification=DM-VERIFY-SHA256-42C6FA6` | 3600 | Domain Ownership Proof |
| **TXT** | `_dmarc` | `v=DMARC1; p=reject; rua=mailto:dmarc@dukaanmitra.in` | 3600 | DMARC Email & Anti-Spoofing Policy |
| **TXT** | `@` | `v=spf1 include:_spf.google.com ~all` | 3600 | SPF Record |

---

## 2. Cryptographic Public Verification Gate (`/verify`)

The public verification gate is accessible at `https://dukaanmitra.in/verify` and provides cryptographic proof of statutory legitimacy for:
1. **Corporate Entity Verification**:
   - MCA CIN: `U72900DL2026PTC998877`
   - GSTIN: `07AAAAA0000A1Z5`
   - MSME Udyam: `UDYAM-DL-01-0012345`
   - DPIIT Recognition: `DIPP98765`
   - Public Discovery Manifest: `https://dukaanmitra.in/.well-known/dukaanmitra-verification.json`
2. **Merchant Public Trust Badges**:
   - URL: `https://dukaanmitra.in/verify/:shopId` (or `?q=<ShopName|Phone|ID>`)
   - Dynamically verifies shop certification, active L3 security tier, and integrity audit status.
   - Used in QR codes on customer invoices, payment links, and WhatsApp receipts.

---

## 3. Nginx Reverse Proxy Architecture

The production Nginx configuration is located at `nginx/dukaanmitra.in.conf`.

### Upstream Mapping:
- `dukaanmitra_ai_web`: `127.0.0.1:8000` (FastAPI Superintelligence Brain, Admin Dev Console, Verification Gate)
- `dukaanmitra_core_engine`: `127.0.0.1:3000` (Node.js/TypeScript Multi-Modal Engine, WhatsApp Cloud Webhook Router)

### Rate Limiting & Security Zones:
- **API Zone**: `rate=30r/s burst=20 nodelay`
- **Webhook Zone**: `rate=100r/s burst=50 nodelay`
- **HSTS**: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- **PWA Service Worker**: `Cache-Control: no-cache, no-store, must-revalidate`

---

## 4. Let's Encrypt SSL Automated Provisioning

To issue and auto-renew TLS 1.3 certificates on the Linux production host:

```bash
# 1. Install Certbot
sudo apt-get update && sudo apt-get install -y certbot python3-certbot-nginx

# 2. Issue Single Certificate covering apex, www, and api subdomains
sudo certbot --nginx \
  -d dukaanmitra.in \
  -d www.dukaanmitra.in \
  -d api.dukaanmitra.in \
  --agree-tos \
  --email admin@dukaanmitra.in \
  --non-interactive

# 3. Dry-Run Auto Renewal Test
sudo certbot renew --dry-run
```

---

## 5. Verification & Health Check CLI Commands

Run these commands to verify the live domain and API routes:

```bash
# Check DNS Propagation
nslookup dukaanmitra.in
nslookup api.dukaanmitra.in

# Verify HTTP to HTTPS 301 Redirect
curl -I http://dukaanmitra.in

# Verify Corporate Cryptographic Manifest
curl -s https://dukaanmitra.in/.well-known/dukaanmitra-verification.json | jq .

# Verify Merchant Verification Endpoint
curl -s "https://api.dukaanmitra.in/api/v1/public/verify/merchant?q=Kirana" | jq .

# Verify Meta WhatsApp Webhook Challenge Handshake
curl "https://api.dukaanmitra.in/webhook?hub.mode=subscribe&hub.verify_token=dukaanmitra_wa_verify_token_2026&hub.challenge=CHALLENGE_ACCEPTED"
```

---

## 6. Monorepo Domain Routing Automated Test

Run the automated test at any time inside the project repository:

```bash
node scripts/validate-domain-routing.js
```
