# 05 MCP & Integrations: Model Context Protocol & Connector Catalog

DukaanMitra utilizes the Model Context Protocol (MCP) to grant agents controlled, auditable, and isolated access to business infrastructure.

```
                              ┌───────────────────────────┐
                              │  Shared Brain Agent Mesh  │
                              └─────────────┬─────────────┘
                                            │
                                            ▼
                              ┌───────────────────────────┐
                              │      MCP Gateway Gate     │
                              │  (Policy & Tenant Scope)  │
                              └─────────────┬─────────────┘
                                            │
        ┌───────────────────┬───────────────┴───────────────┬───────────────────┐
        ▼                   ▼                               ▼                   ▼
┌──────────────┐    ┌──────────────┐                ┌──────────────┐    ┌──────────────┐
│ Database MCP │    │ WhatsApp MCP │                │ Business MCP │    │ External MCP │
│ (PostgreSQL  │    │ (OpenWA API  │                │ (Billing,    │    │ (ONDC, GCP,  │
│  + RLS)      │    │  :2785)      │                │  Inventory)  │    │  Maps, POS)  │
└──────────────┘    └──────────────┘                └──────────────┘    └──────────────┘
```

### The 12 Scoped MCP Connectors:
1. **PostgreSQL MCP**: Read and write business entities bounded by Row-Level Security (`app.tenant_id`).
2. **OpenWA MCP**: Connects to `http://localhost:2785` for WhatsApp session management, text messaging, voice notes, and media.
3. **POS Hardware MCP**: Thermal printer formatting (ESC/POS), barcode scanner inputs, and cash drawer triggers.
4. **FMCG Wholesale MCP**: Distributor price catalogs, minimum order quantity (MOQ) benchmarks, and electronic PO submission.
5. **Billing & Invoicing MCP**: Digital invoice generation, GST calculations, and HSN code validation.
6. **CRM & Udhaar MCP**: Customer credit balances, transaction histories, and repayment status.
7. **Inventory & SKU MCP**: Real-time stock queries, batch numbers, and expiry date trackers.
8. **Cloud Storage MCP**: Google Cloud Storage buckets for encrypted bill photos and customer statement PDFs.
9. **ONDC Beckn MCP**: Network discovery, order fulfillment, and logistics tracking under the ONDC framework.
10. **Google Maps Platform MCP**: Geocoding, store locators, and hyperlocal route optimization for Mowglai delivery riders.
11. **Payment Gateway MCP (Sandbox Mode)**: Simulated UPI payment requests, QR code generations, and webhook verification.
12. **Analytics & BI MCP**: Sales aggregation, heatmaps, GMV calculations, and turnover ratios.
