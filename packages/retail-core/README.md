# DukaanMitra

> **WhatsApp-first business operating system for Indian small retailers.**

DukaanMitra is an engineering project focused on turning everyday retail workflows into a WhatsApp-first, event-driven system.

## Product Status

| Metric | Current status |
|---|---|
| Stage | Pilot / Pre-revenue |
| Active Stores | Not yet measured |
| Paying Stores | Not yet measured |
| MRR | Not yet measured |
| Monthly Transactions | Not yet measured |
| Retention | Not yet measured |

Numbers are intentionally not estimated here. Product and business metrics will be updated when they are measured from real usage.

## What it explores

- WhatsApp as a primary business input channel
- Event-driven retail workflows
- Central routing of incoming business events
- Shared business agents and services
- Retail ledger and customer workflows
- AI-assisted automation with explicit system boundaries

## Architecture

At a high level, the system is designed around this flow:

```
WhatsApp
   ↓
Input / Event Handling
   ↓
Central Event Router
   ↓
Business Services / Agents
   ↓
Retail Data
   ↓
Response / Automation
```

The exact implementation is evolving. This README describes the current repository direction rather than claiming capabilities that are not yet verified in production.

## Engineering Principles

### 1. Event-driven core

Business actions are represented as events so that multiple workflows can react to the same operational signal without tightly coupling the input channel to every downstream feature.

### 2. WhatsApp-first interaction

The product is designed around the reality that many small retailers already use WhatsApp as a daily communication layer. The goal is to reduce the need for a separate application for routine workflows.

### 3. Deterministic business logic

Financial and operational state should not depend on an LLM's interpretation when deterministic code can perform the operation reliably.

### 4. AI with boundaries

AI is used where language understanding or assistance adds value. Core business state and critical operations should remain governed by explicit application logic.

### 5. Evidence before claims

This repository separates:
- implemented functionality
- deployed functionality
- pilot usage
- measured business outcomes

Unmeasured metrics are explicitly labelled **Not yet measured**.

## Repository Direction

The broader DukaanMitra work has existed across multiple repositories while the product architecture has evolved. This repository is being positioned as the public-facing engineering core.

Related private/internal work may contain additional experiments, product surfaces, or migration work.

## Development

Clone the repository and inspect the current source tree and package scripts for the active development workflow.

```bash
git clone https://github.com/1nsharma/DukaanMitra.git
cd DukaanMitra
npm install
```

Run the repository's available development/test commands according to the current package configuration.

## Security

Do not commit API keys, WhatsApp access tokens, database credentials, service-account keys, or other secrets.

Use environment variables for credentials and rotate any secret that has been exposed.

## Current Status

**Engineering:** Active development  
**Product:** Pilot / Pre-revenue  
**Real-world outcome metrics:** Not yet measured

## Roadmap

- Stabilize the event-driven core
- Document verified business workflows
- Strengthen automated tests
- Validate WhatsApp workflows with real pilot users
- Measure usage, retention, and business outcomes
- Consolidate product architecture as the implementation matures
