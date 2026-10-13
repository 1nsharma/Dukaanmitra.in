# Security, Access Controls & Compliance Report (v3.0)

> **Document Status:** CANONICAL
> **Classification:** INTERNAL CONFIDENTIAL

DukaanMitra prioritizes robust data isolation, cryptographic integrity, and compliance across Indian retail networks. This audit details security postures, threat matrices, and vulnerability fixes.

---

## Security Audit Scorecard

| Security Domain | Posture Assessment | Threat Mitigation Level | Status |
| :--- | :--- | :--- | :--- |
| **API Keys Isolation** | Perfect (Express proxy handles routing) | No Client-Side Exposure | 🟢 Verified |
| **Data Persistence Isolation** | Multi-tenant Firebase Firestore Rules | Zero Cross-Tenant Leakage | 🟢 Verified |
| **Access Controls** | RBAC + ABAC + Decryption Handshakes | Highly Gated | 🟢 Verified |
| **Information Security** | Explicit doc clearance boundaries | Zero Intellectual Property Leakage | 🟢 Verified |

---

## Core Security Controls

### 1. The Three-Layer Documentation Hierarchy (v3.0)
To eliminate phishing, social engineering, and targeted credential attacks, all documentation pages are divided into distinct accessibility buckets:
- **Public:** Free to crawl. General product, vision, roadmap, FAQs, and conceptual modules. No secrets or actual code endpoints.
- **Developer:** Requires merchant account verification. Accesses SDK guidelines, integration modules, and non-sensitive ADRs.
- **Internal:** Gated behind a physical passcode entry or superadmin credentials. Houses prompts, communication bus patterns, and vulnerability matrices.

### 2. Multi-Tenant Firestore Isolation Rules
Firestore rule configurations enforce that merchants can only execute queries bounded to their specific `storeId`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /merchants/{merchantId} {
      allow read, write: if request.auth != null && request.auth.uid == merchantId;
    }
  }
}
```

### 3. Cryptographic Secrets Protection
- **Rule:** Absolute prohibition against compiling plain-text variables in client-facing JavaScript packages.
- **Implementation:** Secrets like Razorpay Merchant Key or Google GenAI Keys are pulled server-side via `process.env` inside Node.js Express controllers and never forwarded to client-side views.
