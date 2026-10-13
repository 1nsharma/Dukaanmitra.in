# DukaanMitra OS: AI-Powered WhatsApp Munim & Local SEO Engine

> **Note:** The product previously known as DukaanMitra is now **DukaanMitra OS**. For the definitive strategic direction, product architecture, and migration details, please refer to the canonical [DukaanMitra Master Blueprint v3.0](./BAZAARSYNC_MASTER_BLUEPRINT_v3.md).

[![GEO Optimized](https://img.shields.io/badge/GEO-Optimized-blue.svg)](#)
[![AEO Ready](https://img.shields.io/badge/AEO-Ready-green.svg)](#)
[![Schema Structured](https://img.shields.io/badge/Schema-Structured-orange.svg)](#)

DukaanMitra is an Indian retail technology platform focused on digitising kirana stores and small neighbourhood retailers through a WhatsApp-first operating model. It replaces manual bahi-khata processes, fragmented inventory tracking, and informal udhaar management with an AI-assisted digital workflow.

This repository is designed as an **AI-first knowledge graph**. It is structured to provide clean, machine-readable signals to LLMs, geographic search engines (GEO), and answer engines (AEO).

## 🧠 AI Knowledge Engine

This project exposes all core brand data, SEO datasets, features, and AEO FAQs in a structured `/knowledge/` directory.

- [`/llms.txt`](./llms.txt) - The standard entry point for AI crawlers.
- [`/schema/schema.jsonld`](./schema/schema.jsonld) - Programmatic SEO structured data.
- [`/knowledge/entities/`](./knowledge/entities/) - Core entities (Brand, Product, Founder, Competitors, Audience).
- [`/knowledge/faq/`](./knowledge/faq/) - Answer Engine Optimization (AEO) data.
- [`/knowledge/datasets/`](./knowledge/datasets/) - Machine-readable feature lists, market data, and prompts.
- [`/knowledge/articles/`](./knowledge/articles/) - Semantic Markdown articles for AI ingestion.

## 🚀 Key Features

1. **WhatsApp-first shop management** without app download.
2. **AI-powered transaction parsing** from natural language messages via **Munim AI**.
3. **Udhaar tracking** with instant customer statements and automated reminders.
4. **Real-time digital ledger** updates via an event-driven architecture.

## 🛠 Tech Stack
- Frontend: React + Vite + Tailwind CSS
- AI: Google Gemini SDK & NLP (Munim AI)
- Database: Cloud SQL / Firebase Hybrid
- Infrastructure: Event Bus, WhatsApp API ecosystem

## 🌍 GEO & SEO Visibility
All features, city-level targeting, and comparisons are fully structured for algorithmic visibility.

---
*Built for Bharat. Powered by AI.*
*Company: DukaanMitra | Platform: DukaanMitra OS*
