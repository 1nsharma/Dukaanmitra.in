# 01 Product Strategy: Ecosystem & Portfolio Architecture

DukaanMitra is not a monolithic application; it is a coordinated multi-product retail intelligence ecosystem.

```
                              ┌────────────────────────────────────────┐
                              │           1NSHARMA-LABS                │
                              │     Retail Intelligence Ecosystem      │
                              └──────────────────┬─────────────────────┘
                                                 │
            ┌─────────────────┬──────────────────┼─────────────────┬─────────────────┐
            ▼                 ▼                  ▼                 ▼                 ▼
     [ DukaanMitra ]     [ MitraOS ]       [ Munim AI ]     [ HireSaathi ]     [ QRMflow ]
     Kirana Business    Business Engine     Conversational    Retail Staffing   QR Ordering
        Operating OS     & Core APIs          Accounting         Platform         Engine
            │                 │                  │                 │                 │
            └─────────────────┴──────────────────┼─────────────────┴─────────────────┘
                                                 ▼
                                     [ Shared Platform Layers ]
                           (OpenWA, PostgreSQL RLS, GCP, Gemini 3.8)
```

### Product Definitions:
1. **DukaanMitra**: Flagship shopkeeper business OS for inventory, POS billing, Khata, and CRM.
2. **MitraOS**: Headless operating engine providing microservices, business logic, templates, and integration APIs.
3. **Munim AI**: Conversational accounting model operating inside WhatsApp and Web.
4. **HireSaathi AI**: Localized retail staffing, job matching, and workforce verification.
5. **QRMflow**: Contactless QR ordering and digital table menus for retail counters and eateries.
6. **TruckWala 24×7**: Hyperlocal logistics, inter-city FMCG freight, and tempo booking.
7. **SolarHub / SolarOS**: CleanTech installation, telemetry, and energy business management OS.
8. **Mowglai**: 30-minute hyperlocal delivery dispatch agent connecting local riders to shops.
