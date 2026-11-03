# 💬 DukaanMitra OpenWA WhatsApp Gateway (Port 2785)

> **Powered by `rmyndharis/OpenWA` (Yudhi Armyndharis & OpenWA Contributors)**
> Free, Self-Hosted HTTP REST API & Web Management Dashboard for WhatsApp

---

## 📌 Bundled Port & Endpoints

- **Bundled Port**: `2785` (Both Web Dashboard & REST API on the same port)
- **Local Dashboard & API**: [http://localhost:2785](http://localhost:2785)
- **Domain Ingress (dukaanmitra.in)**:
  - Web Dashboard: `https://dukaanmitra.in/openwa/`
  - Subdomain: `https://whatsapp.dukaanmitra.in`
  - Core Webhook Receiver: `https://dukaanmitra.in/whatsapp/openwa/webhook`

---

## 🚀 Quick Start with Docker (Single-Container)

Run the exact single-container quick start:
```bash
# Inside apps/whatsapp-gateway:
docker compose -f docker-compose.dev.yml up -d
```

To stop:
```bash
docker compose -f docker-compose.dev.yml down
```

---

## 🌐 Full Stack Docker (All DukaanMitra Services)

From the repository root (`DukaanMitra-OS`):
```bash
# Starts Core Engine (:3000), AI Services (:8000), Mitra-OS (:5173), Dukaan-in (:3001), and OpenWA (:2785):
docker compose up -d
```

---

## ⚡ Zero-Dependency Local Dev Run (Without Docker)

```bash
# Inside apps/whatsapp-gateway:
npm install
npm run dev
```

Or from the root repository:
```bash
npm run dev:whatsapp
```

---

## 🔄 Two-Way Commerce Pipeline

- **Inbound Webhook**: Incoming customer messages, voice notes, and bill photos are automatically dispatched to:
  `http://localhost:3000/whatsapp/openwa/webhook` (or inside docker: `http://dukaanmitra-enterprise:3000/whatsapp/openwa/webhook`).
- **Outbound Messages**: Dispatched via `POST http://localhost:2785/api/sendText`.
