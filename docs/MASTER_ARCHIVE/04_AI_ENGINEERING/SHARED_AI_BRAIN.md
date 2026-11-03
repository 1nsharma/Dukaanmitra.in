# 04 AI Engineering: Shared AI Brain, RAG & Multi-Agent Mesh

## 1. Shared Brain Architecture
The Shared AI Brain acts as the cognitive layer across all DukaanMitra channels:
- **Model Router**: Intelligently routes queries based on complexity, latency, and cost (Gemini 3.8 Flash for real-time Kirana NLP; Vertex AI Gemini Pro for multi-year financial audits; local Ollama Qwen 2.5 7B for offline store servers).
- **RAG Architecture**: PostgreSQL + `pgvector` store vector embeddings of FMCG product catalogs, wholesale Mandi rates, GST rates, and government schemes.
- **Controlled Memory**: Separates tenant-specific memory (isolated per shop) from global retail intelligence (generalized pricing patterns).

## 2. The 6 Core Sandbox Agents
Located in `apps/ai-services/sandbox/agents/registry.py`:
1. **Inventory Agent**: Evaluates stock levels, identifies slow-moving inventory, and flags reorder signals.
2. **Procurement Agent**: Benchmarks wholesale prices across FMCG distributors and drafts purchase orders.
3. **Pricing Agent**: Simulates product margins and competitive retail pricing scenarios.
4. **Marketing Agent**: Segments customer clusters and creates personalized festival flyers and WhatsApp copy.
5. **Shopping Agent**: Natural language customer product discovery and cart simulation.
6. **Credit Recovery Agent**: Analyzes accounts receivable aging and drafts respectful WhatsApp payment reminders.

## 3. The 20 Enterprise Swarm Agents
Located in `packages/enterprise-agents/index.ts`:
Strategy, Brand, Product, Engineering, AI, Data, Business, Operations, Legal, Security, Marketing, Customer, Finance, Integrations, Infrastructure, Credentials Vault, Assets, Research, Meeting Notes, and Inventory Agents.
