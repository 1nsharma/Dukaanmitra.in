import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { 
  Terminal, Shield, Cpu, CheckCircle2, 
  Award, Database, Layers, Code, Settings, 
  Search, Users, Activity, Sliders, AlertOctagon, 
  FolderGit2, Lightbulb, ChevronRight
} from "lucide-react";

type SectionKey = 
  | "kernel" 
  | "agents" 
  | "llm" 
  | "data" 
  | "enterprise" 
  | "integrations" 
  | "observability" 
  | "governance" 
  | "developer" 
  | "bi" 
  | "docs" 
  | "gates";

interface EngineeringBibleProps {
  user: any;
  role?: 'superadmin' | 'merchant' | null;
  onLogin?: () => void;
}

export const DukaanMitraEngineeringBible: React.FC<EngineeringBibleProps> = ({ user, role, onLogin }) => {
  const [activeTab, setActiveTab] = useState<SectionKey>("kernel");
  const [searchTerm, setSearchTerm] = useState("");

  // Access bypass states for simulated handshakes
  const [devBypassed, setDevBypassed] = useState(false);
  const [internalBypassed, setInternalBypassed] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  // Handshake simulation states
  const [devSimulating, setDevSimulating] = useState(false);
  const [devSimProgress, setDevSimProgress] = useState(0);
  const [devSimStatus, setDevSimStatus] = useState("");

  const [internalSimulating, setInternalSimulating] = useState(false);
  const [internalSimProgress, setInternalSimProgress] = useState(0);
  const [internalSimStatus, setInternalSimStatus] = useState("");

  const [storySlide, setStorySlide] = useState(0);
  const [playgroundStep, setPlaygroundStep] = useState<"idle" | "munim" | "sentinel" | "guard" | "success">("idle");
  const [playgroundLogs, setPlaygroundLogs] = useState<string[]>([]);

  const getAccessLevel = (key: SectionKey): "public" | "developer" | "internal" => {
    if (["kernel", "integrations", "bi", "docs"].includes(key)) return "public";
    if (["agents", "llm", "data", "developer"].includes(key)) return "developer";
    return "internal";
  };

  const isGenuinelyUnlocked = (key: SectionKey): boolean => {
    const level = getAccessLevel(key);
    if (level === "public") return true;
    if (level === "developer") {
      return (user !== null) || (role === "merchant" || role === "superadmin");
    }
    if (level === "internal") {
      return (role === "superadmin");
    }
    return false;
  };

  const isUnlocked = (key: SectionKey): boolean => {
    const level = getAccessLevel(key);
    if (level === "public") return true;
    if (level === "developer") {
      return (user !== null) || (role === "merchant" || role === "superadmin") || devBypassed;
    }
    if (level === "internal") {
      return (role === "superadmin") || internalBypassed;
    }
    return false;
  };

  const startDevSimulation = () => {
    setDevSimulating(true);
    setDevSimProgress(0);
    const statuses = [
      "ESTABLISHING CONTEXT SECURE CHANNEL...",
      "GENERATING EPHEMERAL RSA PUBLIC KEY...",
      "VALIDATING REMOTE CLIENT CHALLENGE...",
      "INTERFACES INTEGRITY CHECK OK...",
      "CLEARANCE LEVEL-1: GRANTED"
    ];
    let step = 0;
    setDevSimStatus(statuses[0]);
    const interval = setInterval(() => {
      setDevSimProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDevBypassed(true);
          setDevSimulating(false);
          return 100;
        }
        const nextProgress = prev + 10;
        if (nextProgress % 20 === 0 && step < statuses.length - 1) {
          step++;
          setDevSimStatus(statuses[step]);
        }
        return nextProgress;
      });
    }, 150);
  };

  const startInternalSimulation = () => {
    setInternalSimulating(true);
    setInternalSimProgress(0);
    const statuses = [
      "PINGING LOCAL COGNITIVE AGENT MATRICES...",
      "MUTUAL ZERO-KNOWLEDGE PROOF HANDSHAKE...",
      "DIAGNOSING SAST THREAT SIGNATURES...",
      "SUPERADMIN TOKEN VERIFICATION (OK)...",
      "DECRYPTING ENTERPRISE KERNEL CORE..."
    ];
    let step = 0;
    setInternalSimStatus(statuses[0]);
    const interval = setInterval(() => {
      setInternalSimProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setInternalBypassed(true);
          setInternalSimulating(false);
          return 100;
        }
        const nextProgress = prev + 10;
        if (nextProgress % 20 === 0 && step < statuses.length - 1) {
          step++;
          setInternalSimStatus(statuses[step]);
        }
        return nextProgress;
      });
    }, 150);
  };

  const runPlaygroundSim = () => {
    setPlaygroundStep("munim");
    setPlaygroundLogs(["[0.00s] 🟢 Triggering digital invoice extraction for Suresh's Kirana..."]);
    
    setTimeout(() => {
      setPlaygroundStep("sentinel");
      setPlaygroundLogs(prev => [
        ...prev,
        "[1.20s] 🔍 Munim Agent: Successfully identified purchase item 'Aashirvaad Shudh Chakki Atta, 5kg' with 5% GST rate.",
        "[1.40s] ⚡ Routing stock decrement signal to Stock Sentinel..."
      ]);
    }, 1200);

    setTimeout(() => {
      setPlaygroundStep("guard");
      setPlaygroundLogs(prev => [
        ...prev,
        "[2.40s] 📦 Stock Sentinel: Atta stock decremented in memory. Current count: 18 units (low threshold is 5).",
        "[2.60s] ⚡ Dispatching financial updates to Ledger Guard..."
      ]);
    }, 2400);

    setTimeout(() => {
      setPlaygroundStep("success");
      setPlaygroundLogs(prev => [
        ...prev,
        "[3.60s] 🛡️ Ledger Guard: Validated state hash. Outstanding Udhaar balance safely updated in isolated database.",
        "[3.80s] ✨ Swarm workflow executed successfully. Customer notified on WhatsApp!"
      ]);
    }, 3600);
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === "DM-INTERNAL-99") {
      setInternalBypassed(true);
      setPasscodeError("");
    } else {
      setPasscodeError("INVALID SYSTEM KEY. VERIFICATION FAILED.");
    }
  };

  const bibleData: Record<SectionKey, {
    title: string;
    icon: React.ReactNode;
    subtitle: string;
    items: { heading: string; desc: string; code?: string }[];
  }> = {
    kernel: {
      title: "Platform & Business OS Kernel",
      icon: <Cpu className="text-emerald-500" size={18} />,
      subtitle: "The core engine powering modular service registries, dynamic feature toggles, and multi-tenant licenses.",
      items: [
        {
          heading: "Platform Modules (Conceptual)",
          desc: "Dynamic registration and loading of core domains. Modules specify semantic dependencies, state stores, and external hook handlers during cold-start boot.",
          code: `class ModuleRegistry {\n  register(module: BusinessModule): void;\n  loadAll(): Promise<void>;\n  getModule<T>(name: string): T;\n}`
        },
        {
          heading: "Service Registry & Service Discovery",
          desc: "Decoupled internal micro-endpoints. Standardizes routing between local processes and distributed cloud resources transparently.",
          code: `const serviceRegistry = new ServiceRegistry();\nserviceRegistry.bind("BillingService", () => new GSTBillingServiceImpl());`
        },
        {
          heading: "Feature Flags & Hot-Toggles",
          desc: "Merchant-specific operational modifiers. Controls visibility of features like ONDC publishing or multi-store reporting dynamically.",
          code: `if (FeatureFlags.isEnabled("ondc-marketplace-sync", merchantId)) {\n  enableOndcChannel();\n}`
        },
        {
          heading: "Plugin Manager",
          desc: "Sandboxed third-party extensions. Allows external developers to load secure webhooks and custom POS receipt templates.",
          code: `pluginManager.loadManifest("./plugins/barcode-scanner-v2");`
        },
        {
          heading: "Configuration Service",
          desc: "Centralized environment state with cryptographic secrets hydration. Synchronizes variables safely without system reboots.",
          code: `const secretKey = await ConfigurationService.getEncryptedSecret("RAZORPAY_SECRET");`
        },
        {
          heading: "License & Subscription Manager",
          desc: "Verifies subscription tiers, feature quotas, active session thresholds, and token rate limits.",
          code: `LicenseManager.verifyQuota(merchantId, "ai-tokens-used", currentUsage);`
        }
      ]
    },
    agents: {
      title: "Agent Operating System (AOS)",
      icon: <Users className="text-indigo-500" size={18} />,
      subtitle: "Multi-agent runtime framework guiding collaborative swarm permissions, short/long-term memory, and event-driven communication.",
      items: [
        {
          heading: "AI Agent Overview",
          desc: "Maintains active directories of intelligent micro-agents, their roles, communication protocols, and health statuses.",
          code: `AgentRegistry.registerAgent("BillingAgent", {\n  capabilities: ["extract-invoice", "calculate-gst"],\n  tier: "standard"\n});`
        },
        {
          heading: "Agent Permissions & Sandbox",
          desc: "Strict access control boundaries. Limits the database mutations or file systems that any autonomous agent can perform.",
          code: `agent.assertPermission("write:udhaar-ledger");`
        },
        {
          heading: "Agent Long/Short-Term Memory",
          desc: "Fuses ephemeral session memory (Redis) with long-term semantic storage (Firestore + Embeddings) for consistent context retention.",
          code: `await agentMemory.saveEpisode({\n  storeId: "delhi-kirana",\n  key: "customer-complaint-suresh",\n  context: "Agreed to clear ₹250 discrepancy on next bill"\n});`
        },
        {
          heading: "Agent Communication Bus",
          desc: "Event-driven orchestrations. Allows agents to emit async tasks and receive callback signals from other active swarms.",
          code: `agentBus.publish(new LowStockEvent("Aashirvaad-Atta", 3));`
        },
        {
          heading: "Agent Lifecycle & Monitoring",
          desc: "Tracks initialization, active inference, system timeouts, execution failures, and self-healing restarts of background routines."
        }
      ]
    },
    llm: {
      title: "LLM Operating Layer",
      icon: <Terminal className="text-violet-500" size={18} />,
      subtitle: "Semantic intent routing, dynamic prompt versioning, strict system context assembly, and token cost optimization.",
      items: [
        {
          heading: "Model Registry & Routing Engine",
          desc: "Optimizes latency and API costs by routing queries dynamically between high-reasoning and low-latency models.",
          code: `const model = modelRouter.route({\n  task: "extract-table-from-pdf",\n  complexity: "high",\n  inputBytes: fileBuffer.length\n}); // returns "gemini-2.5-flash" or "gemini-pro-reasoning"`
        },
        {
          heading: "Prompt Management (Conceptual)",
          desc: "Version-controlled instructions with quick fallbacks and deterministic schema validations.",
          code: `const prompt = PromptRegistry.get("MUNIM_BILL_EXTRACTION", "v2.1");`
        },
        {
          heading: "Context & Memory Manager",
          desc: "Assembles business parameters, active catalog contexts, local currency formats, and memory keys prior to LLM submission.",
          code: `const payload = contextManager.buildPayload({\n  merchantId: "m-12",\n  rawInput: "Suresh ne 200 udhaar liya"\n});`
        },
        {
          heading: "AI Cost Optimizer & Observability",
          desc: "Monitors daily token consumption per tenant, aggregates API costs, and optimizes cached prompts to reduce redundant overhead.",
          code: `Telemetry.logTokenCost({\n  merchantId: "m-12",\n  model: "gemini-2.5-flash",\n  promptTokens: 850,\n  completionTokens: 140\n});`
        }
      ]
    },
    data: {
      title: "Unified Data Platform",
      icon: <Database className="text-amber-500" size={18} />,
      subtitle: "Enterprise data lakes, transactional stores, real-time caches, and high-fidelity knowledge graphs.",
      items: [
        {
          heading: "Multi-Engine Storage Architecture",
          desc: "Fuses fast transactional DB states with semantic vector indexes for flexible business query analysis."
        },
        {
          heading: "Vector Database & RAG Pipeline",
          desc: "Indexes business policies, user FAQs, and catalog item names into vector spaces for sub-millisecond similarity lookups.",
          code: `const matchingDocs = await vectorDb.similaritySearch("How to file quarterly GST-1?", 3);`
        },
        {
          heading: "Event Store & Audit Logs",
          desc: "Maintains an immutable, append-only chronological log of all merchant financial interactions and system edits.",
          code: `eventStore.append({\n  action: "UDHAAR_ADJUSTMENT",\n  by: "BillingAgent",\n  payload: { customer: "Ramesh", adjustment: -50 },\n  hash: "e8f39a..."\n});`
        },
        {
          heading: "Cache Layer & Write-Behind Syncing",
          desc: "Combines local Redis structures with lazy-write strategies to ensure seamless updates on offline-prone retail registers."
        },
        {
          heading: "Dynamic Knowledge Graphs",
          desc: "Maps non-obvious entity connections, like customer purchase correlations, product velocity clusters, and credit-risk circles."
        }
      ]
    },
    enterprise: {
      title: "Enterprise Core & Security",
      icon: <Shield className="text-rose-500" size={18} />,
      subtitle: "Role & Attribute Isolation, single sign-on credentials, secure workspaces, and compliance auditing.",
      items: [
        {
          heading: "RBAC & Attribute-Based Access Control (ABAC)",
          desc: "Fine-grained permissions based on user role, business hour, geographical location, and active transaction limits.",
          code: `rbac.assertAccess(user, "override:invoice-discount", { discountAmount: 500 });`
        },
        {
          heading: "Single Sign-On (SSO) & SCIM",
          desc: "Integrates standard enterprise authentication flows (SAML, OIDC) with external user provisioning registers."
        },
        {
          heading: "Multi-Workspace & Multi-Organization Core",
          desc: "Enables corporate franchises to partition distinct regional branches under a unified parent ledger cleanly."
        },
        {
          heading: "Dual-Control Approval Engine",
          desc: "Requires explicit manager-level review before executing high-risk financial overrides or credit adjustments.",
          code: `approvalEngine.requestApproval({\n  action: "DELETE_HISTORIC_INVENTORY",\n  requester: "staff-2",\n  approverRole: "manager"\n});`
        }
      ]
    },
    integrations: {
      title: "Integration Hub",
      icon: <Layers className="text-cyan-500" size={18} />,
      subtitle: "Secure bridges to ONDC, Razorpay checkout, Tally accounting, state GST gateways, and Google Workspace.",
      items: [
        {
          heading: "Financial & Gateway Integrations",
          desc: "Pre-integrated checkout connectors supporting Razorpay, UPI Deep Linking, and immediate invoice webhooks.",
          code: `razorpay.createPaymentLink({\n  amount: 66150,\n  description: "Invoice #DM-2026-904"\n});`
        },
        {
          heading: "Enterprise ERP Connectors",
          desc: "Automated syncing protocols to stream sales reports, tax states, and custom inventory tables straight to Tally, Zoho, and SAP."
        },
        {
          heading: "ONDC & Marketplace Sync",
          desc: "Exposes inventory items to India's open e-commerce framework instantly, syncing orders and shipping tracking codes real-time."
        },
        {
          heading: "Government & GST APIs",
          desc: "Performs instant GSTIN validation, schedules tax fillings, and automates e-way bill generation via state portal integrations."
        },
        {
          heading: "Communication Integrations",
          desc: "High-throughput delivery channels spanning WhatsApp Cloud APIs, enterprise SMS carriers, and system email relays."
        }
      ]
    },
    observability: {
      title: "Observability Platform",
      icon: <Activity className="text-emerald-500" size={18} />,
      subtitle: "Telemetry logging, distributed request tracing, service SLA dashboards, and custom AI inference diagnostics.",
      items: [
        {
          heading: "Distributed Request Tracing",
          desc: "Spans requests across client-side react dashboards, server express gateways, and deep model routing agents.",
          code: `const span = tracer.startSpan("process-whatsapp-order");\n// ... execute processing ...\nspan.end();`
        },
        {
          heading: "AI Inference Telemetry",
          desc: "Monitors prompt quality metrics, output entropy, token latency, context utilization rates, and accuracy evaluations.",
          code: `Telemetry.logInferencePerformance({\n  latencyMs: 145,\n  confidenceScore: 0.98,\n  tokensSec: 140\n});`
        },
        {
          heading: "Business KPI Dashboards",
          desc: "Aggregates end-of-day revenues, active ledger outstanding, active conversion metrics, and repeat sales velocity."
        }
      ]
    },
    governance: {
      title: "AI Governance & Risk Controls",
      icon: <Sliders className="text-sky-500" size={18} />,
      subtitle: "Ethical prompt constraints, explainability layers, safety metrics, and automated risk scoring.",
      items: [
        {
          heading: "Explainable AI (XAI) Framework",
          desc: "Provides merchants with step-by-step semantic breakdowns of how an automated inventory forecast or credit-limit adjustment was derived."
        },
        {
          heading: "Human-in-the-Loop (HITL) Controls",
          desc: "Enforces that autonomous agent campaigns must be explicitly verified and approved before broadcasting to client lists."
        },
        {
          heading: "Alignment & Safety Guardrails",
          desc: "Filters out offensive inputs, prevents competitor product recommendations, and blocks toxic user language automatically."
        },
        {
          heading: "Credit Risk Scoring Engine",
          desc: "Utilizes historical payment latencies, average purchase sizes, and dispute frequencies to compute local customer credit limit bounds."
        }
      ]
    },
    developer: {
      title: "Developer Platform & MCP SDK",
      icon: <Code className="text-pink-500" size={18} />,
      subtitle: "Developer tools, testing environments, plugin SDK frameworks, and local API playgrounds.",
      items: [
        {
          heading: "Developer SDK & CLI",
          desc: "Commands to mock store events locally, deploy custom plugin manifests, and review performance graphs.",
          code: `npm install -g @dukaanmitra/cli\ndm plugin:init my-barcode-extension`
        },
        {
          heading: "Supported Integrations (MCP SDK)",
          desc: "Standardized tool definitions allowing remote LLMs to safely query store inventories, create checkout templates, and trigger invoice print jobs.",
          code: `mcpServer.addTool("searchCatalog", {\n  description: "Search store items by keyword",\n  params: { query: "string" }\n});`
        },
        {
          heading: "Sandbox Environments",
          desc: "Isolated staging tenants complete with synthetic customer datasets, mock POS terminals, and Razorpay test triggers."
        }
      ]
    },
    bi: {
      title: "Business Intelligence Engine",
      icon: <Lightbulb className="text-yellow-500" size={18} />,
      subtitle: "Predictive analytics, demand forecasting, customer segmentation, and automated store recommendations.",
      items: [
        {
          heading: "Predictive Demand Forecasting",
          desc: "Analyzes seasonal retail variations, regional trends, and historical purchase velocities to suggest proactive stock ordering."
        },
        {
          heading: "Dynamic Customer Segmentation",
          desc: "Automatically classifies customers based on transaction behaviors into distinct groupings: VIP, Inactive, Daily, and Credit-Risk.",
          code: `const segments = BiEngine.segmentCustomers(merchantId);\n// Returns segments with recommended marketing campaign templates.`
        },
        {
          heading: "Cash Flow Prediction",
          desc: "Integrates expected invoice collections, upcoming utility due dates, and pending supplier payments to build dynamic 30-day cash graphs."
        }
      ]
    },
    docs: {
      title: "Documentation Standards & ADRs",
      icon: <FolderGit2 className="text-orange-500" size={18} />,
      subtitle: "System Architecture Decision Records (ADRs), RFC blueprints, developer guides, and operations runbooks.",
      items: [
        {
          heading: "Architecture Decision Records (ADR)",
          desc: "Durable markdown registers documenting critical design changes, architectural trade-offs, and library dependencies."
        },
        {
          heading: "Operations Runbooks & Incident Playbooks",
          desc: "Actionable procedures for resolving common system faults, like database lockups, API rate exhaustions, or webhooks sync failures."
        },
        {
          heading: "API Versioning & Upgrade Guides",
          desc: "Guarantees robust backward compatibility for external ERP connectors, supporting gradual migrations."
        },
        {
          heading: "Security & Classification Rule (v3.0)",
          desc: "No internal implementation details, prompts, security assumptions, or privileged operational knowledge shall be exposed in any publicly accessible documentation. Every document must be explicitly classified as Public, Developer, or Internal before publication."
        }
      ]
    },
    gates: {
      title: "Production Readiness Gates",
      icon: <AlertOctagon className="text-red-500" size={18} />,
      subtitle: "Strict quality assurances, performance baselines, security tests, and compliance validations before deployment.",
      items: [
        {
          heading: "Security & Penetration Gate",
          desc: "Continuous SAST scanning, dependency vulnerability audits, SQL injection simulations, and TLS validation checks."
        },
        {
          heading: "Performance & Core Web Vitals Gate",
          desc: "Enforces a strict 100ms API response limit, sub-second client-side hydration, and low bundle size constraints."
        },
        {
          heading: "AI Quality & Accuracy Gate",
          desc: "Runs structured evaluation sets to verify prompt compliance, safety bounds, parsing correctness, and token cost boundaries."
        },
        {
          heading: "Compliance & Regulatory Gate",
          desc: "Validates strict data isolation across active workspaces and checks full alignment with regional tax, privacy, and security codes."
        }
      ]
    }
  };

  const currentSection = bibleData[activeTab];

  // Filter items if searchTerm is present
  const filteredItems = currentSection.items.filter(
    item => 
      item.heading.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 lg:px-20 text-slate-800">
      <Helmet>
        <title>Engineering Bible v2.0 | DukaanMitra AI Business OS</title>
        <meta 
          name="description" 
          content="The authoritative engineering standards, multi-agent frameworks, kernel layers, data lakes, and production gates for DukaanMitra AI Business Operating System." 
        />
        <link rel="canonical" href="https://dukaanmitra.in/bible" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Block */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl border-4 border-slate-900">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-white/10">
              <Terminal size={12} /> Technical Specifications & Handbooks
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                ENGINEERING BIBLE <span className="text-emerald-400 text-3xl md:text-5xl font-black not-italic block md:inline-block md:ml-3">v2.0</span>
              </h1>
              <p className="text-base md:text-xl text-slate-300 max-w-3xl font-semibold leading-relaxed">
                The official engineering blueprints, micro-kernel architectures, multi-agent swarms, LLM routers, and compliance gates powering the DukaanMitra AI Business Operating System.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Architecture: <strong>Multi-Tenant AI-OS</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Latest Spec: <strong>v2.0.4 Enterprise</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Platform Quality: <strong>Production-Ready Gates</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Search and Layout Split */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-4 bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm space-y-6">
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Spec Chapters</h3>
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Filter chapter specifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              {(Object.keys(bibleData) as SectionKey[]).map((key) => {
                const sect = bibleData[key];
                const isActive = activeTab === key;
                const isItemUnlocked = isUnlocked(key);
                const level = getAccessLevel(key);
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveTab(key);
                      setSearchTerm("");
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl transition text-left ${
                      isActive 
                        ? "bg-slate-900 text-white shadow-md font-bold" 
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 font-semibold"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${isActive ? "bg-white/15" : "bg-white border"}`}>
                        {sect.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wide leading-none">{sect.title.split(" & ")[0].split(" (")[0]}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1 flex items-center gap-1">
                          {level === "public" && <span className="text-emerald-500 font-black">Public</span>}
                          {level === "developer" && (
                            <span className={isItemUnlocked ? "text-emerald-500" : "text-amber-500"}>
                              {isItemUnlocked ? "Developer" : "Dev Lock"}
                            </span>
                          )}
                          {level === "internal" && (
                            <span className={isItemUnlocked ? "text-emerald-500" : "text-red-500"}>
                              {isItemUnlocked ? "Internal" : "Confidential"}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!isItemUnlocked && (
                        <svg className={`w-3.5 h-3.5 ${level === "internal" ? "text-red-500 animate-pulse" : "text-amber-500 animate-pulse"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                      <ChevronRight size={14} className={`opacity-60 transition ${isActive ? "rotate-90 text-emerald-400" : ""}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-indigo-50 border border-indigo-100/80 p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-900">
                <Award size={16} className="text-indigo-600" />
                <span className="text-xs font-black uppercase">Principle Guidelines</span>
              </div>
              <p className="text-[11px] text-indigo-950 font-medium leading-relaxed">
                "Never write duplicate code. Never duplicate APIs. Never duplicate database tables. Never duplicate business logic. Always check existing schemas and extend existing frameworks first."
              </p>
            </div>
          </div>

          {/* Core Content Viewer Panel */}
          <div className="lg:col-span-8 bg-white rounded-[2rem] border-2 border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px] transition-all">
            
            {/* Panel Title Bar */}
            <div className="bg-slate-900 text-white p-6 md:p-8 border-b border-slate-800 space-y-2 relative">
              <div className="absolute top-4 right-6 flex items-center gap-2">
                {getAccessLevel(activeTab) === "public" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-500/20">
                    Public Spec
                  </span>
                )}
                {getAccessLevel(activeTab) === "developer" && (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 ${isUnlocked(activeTab) ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'} text-[10px] font-black uppercase tracking-wider rounded-full border`}>
                    {isUnlocked(activeTab) ? "Clearance Active" : "Level-1 Locked"}
                  </span>
                )}
                {getAccessLevel(activeTab) === "internal" && (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 ${isUnlocked(activeTab) ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'} text-[10px] font-black uppercase tracking-wider rounded-full border`}>
                    {isUnlocked(activeTab) ? "Superadmin Active" : "Level-2 Restricted"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5 text-indigo-400">
                {currentSection.icon}
                <span className="text-xs font-black uppercase tracking-widest">CHAPTER SPECIFICATION</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight">{currentSection.title}</h2>
              <p className="text-slate-300 text-xs md:text-sm font-medium leading-relaxed">{currentSection.subtitle}</p>
            </div>

            {isUnlocked(activeTab) ? (
              isGenuinelyUnlocked(activeTab) ? (
                /* List of Spec Items */
                <div className="p-6 md:p-8 flex-1 space-y-8">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, idx) => (
                      <div key={idx} className="space-y-3 pb-8 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold text-xs mt-0.5">
                            {idx + 1}
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <h4 className="font-black text-slate-900 uppercase text-xs md:text-sm tracking-wide">{item.heading}</h4>
                            <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                          </div>
                        </div>

                        {item.code && (
                          <div className="ml-7 bg-slate-950 text-slate-200 p-4 rounded-xl border border-slate-800 font-mono text-[11px] leading-relaxed overflow-x-auto shadow-inner relative group">
                            <span className="absolute top-2 right-2 text-[9px] font-black uppercase text-slate-600 tracking-wider">TS Blueprints</span>
                            <pre>{item.code}</pre>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 space-y-3">
                      <Settings size={36} className="mx-auto text-slate-300 animate-spin" />
                      <p className="text-sm text-slate-400 font-bold">No specification matched your filter.</p>
                    </div>
                  )}
                </div>
              ) : (
                /* STORYBOARD NARRATIVE SHOWCASE (Educational Simulator Dummy) */
                <div className="flex-1 flex flex-col bg-slate-950 text-white p-6 md:p-10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.06),transparent)] pointer-events-none" />
                  
                  {/* Presentation Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-900 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest rounded">
                        Simulated Concept Mode
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Chapter Storyboard ({storySlide + 1} of 4)
                      </span>
                    </div>
                    
                    {/* Slide Selector Indicators */}
                    <div className="flex gap-1.5">
                      {[0, 1, 2, 3].map((idx) => (
                        <button
                          key={idx}
                          onClick={() => setStorySlide(idx)}
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            storySlide === idx ? "w-8 bg-indigo-500" : "w-2.5 bg-slate-800 hover:bg-slate-700"
                          }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Main Slide Content */}
                  <div className="grid md:grid-cols-12 gap-8 items-center py-8 flex-1 relative z-10">
                    
                    {/* Left Column: Story Narrative */}
                    <div className="md:col-span-7 space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400 bg-indigo-950/40 px-2.5 py-1 rounded-full border border-indigo-900/30">
                          {
                            storySlide === 0 ? "THE MISSION" :
                            storySlide === 1 ? "THE SPARK" :
                            storySlide === 2 ? "THE SWARM" : "THE PLEDGE"
                          }
                        </span>
                        <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tight text-white leading-tight mt-2">
                          {
                            storySlide === 0 ? "Suresh's Daily Struggle: Paper & Friction" :
                            storySlide === 1 ? "The Instant WhatsApp Invoice Spark (v1.0)" :
                            storySlide === 2 ? "The Silent Multi-Agent Orchestra (v3.0)" :
                            "Gated Security & Ethical Compliance"
                          }
                        </h3>
                        <p className="text-slate-400 text-xs md:text-sm font-semibold leading-relaxed">
                          {
                            storySlide === 0 ? "Suresh manages 600 daily customers in Delhi. Writing records in a dusty paper notebook and calculating monthly credit totals manually is an emotional drain that leads to lost paper trails and accounting disputes." :
                            storySlide === 1 ? "We discovered that busy Indian retail merchants reject complex desktop accounting tools. By initiating instant, beautiful billing straight via standard WhatsApp channels, both buyers and stores sync dynamically." :
                            storySlide === 2 ? "DukaanMitra is driven by smart, modular autonomous actors. The Munim Agent extracts transaction line items, the Stock Sentinel regulates low inventory levels, and the Ledger Guard signs cryptographic audit proofs." :
                            "To defend local Kirana merchants against targeted data scraping, social engineering, and prompt exploits, DukaanMitra separates access permissions. Real raw database code schemas remain securely insulated."
                          }
                        </p>
                      </div>

                      {/* Detail Bullets */}
                      <div className="space-y-3 pt-2">
                        {(
                          storySlide === 0 ? [
                            { title: "Manual Bookkeeping Leaks", desc: "Scribbling records on paper scraps causes up to 4% margin loss annually." },
                            { title: "Friction & Trust Deficit", desc: "No immediate digital ledger sharing leads to customer credit disagreements." },
                            { title: "GST Filing Anxiety", desc: "Filing quarterly tax reports manually consumes days of exhausting work." }
                          ] :
                          storySlide === 1 ? [
                            { title: "No App Store Downloads", desc: "Customers receive instant, lightweight PDF invoices without downloading separate apps." },
                            { title: "Integrated UPI Linkage", desc: "UPI clickables are attached to receipts to speed up client payments by 3x." },
                            { title: "Outstanding Balance Check", desc: "Remaining credit (Udhaar) ledger totals are dynamic and shown in invoice footers." }
                          ] :
                          storySlide === 2 ? [
                            { title: "Asynchronous Workflows", desc: "Agents share tasks in background worker queues, keeping checkout times at 125ms." },
                            { title: "Predictive Inventory Alerts", desc: "The Sentinel forecasts low-stock conditions before supply depletion occurs." },
                            { title: "Cryptographic Audit Trails", desc: "Transaction entries are immutable and chained to block fraud attempts." }
                          ] : [
                            { title: "Multi-Tenant Rule Integrity", desc: "Strict Firestore queries guarantee that tenants never bleed store data across databases." },
                            { title: "Server-Side Sanitization", desc: "Inference pipelines cleanse raw customer messages to prevent prompt injections." },
                            { title: "Relational isolation", desc: "We restrict raw database schemas to trusted networks to ensure business continuity." }
                          ]
                        ).map((bullet, bidx) => (
                          <div key={bidx} className="flex gap-2.5 items-start">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                            <div className="text-xs">
                              <span className="font-bold text-slate-200 uppercase tracking-wide">{bullet.title}: </span>
                              <span className="text-slate-400 font-medium">{bullet.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Visual Mockup / Interactive Playground */}
                    <div className="md:col-span-5">
                      {storySlide === 2 ? (
                        /* INTERACTIVE PLAYGROUND FOR SWARM */
                        <div className="bg-slate-900 border-2 border-indigo-950 p-6 rounded-2xl space-y-4 shadow-xl">
                          <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-indigo-400">
                            <span>SWARM CORE SANDBOX</span>
                            <span className="text-emerald-500 font-bold uppercase tracking-wider animate-pulse">Ready</span>
                          </div>
                          
                          <div className="space-y-2.5">
                            <div className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                              playgroundStep === "munim" ? "bg-indigo-950/60 border-indigo-500 text-white" : "bg-slate-950/80 border-slate-800 text-slate-500"
                            }`}>
                              <span className="text-xs font-bold uppercase tracking-wide">1. Munim Agent</span>
                              <span className="text-[10px] font-mono">{playgroundStep === "munim" ? "RUNNING..." : "IDLE"}</span>
                            </div>

                            <div className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                              playgroundStep === "sentinel" ? "bg-emerald-950/60 border-emerald-500 text-white" : "bg-slate-950/80 border-slate-800 text-slate-500"
                            }`}>
                              <span className="text-xs font-bold uppercase tracking-wide">2. Stock Sentinel</span>
                              <span className="text-[10px] font-mono">{playgroundStep === "sentinel" ? "RUNNING..." : "IDLE"}</span>
                            </div>

                            <div className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                              playgroundStep === "guard" ? "bg-amber-950/60 border-amber-500 text-white" : "bg-slate-950/80 border-slate-800 text-slate-500"
                            }`}>
                              <span className="text-xs font-bold uppercase tracking-wide">3. Ledger Guard</span>
                              <span className="text-[10px] font-mono">{playgroundStep === "guard" ? "RUNNING..." : "IDLE"}</span>
                            </div>
                          </div>

                          {playgroundLogs.length > 0 && (
                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[9px] leading-relaxed text-indigo-300 h-24 overflow-y-auto space-y-1">
                              {playgroundLogs.map((log, lidx) => (
                                <p key={lidx}>{log}</p>
                              ))}
                            </div>
                          )}

                          <button
                            onClick={runPlaygroundSim}
                            disabled={playgroundStep !== "idle" && playgroundStep !== "success"}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all duration-200"
                          >
                            {playgroundStep === "idle" || playgroundStep === "success" ? "Simulate Demo Transaction" : "Processing Swarm State..."}
                          </button>
                        </div>
                      ) : (
                        /* STATIC ILLUSTRATIONS */
                        storySlide === 0 ? (
                          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
                            <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-red-500">
                              <span>TRADITIONAL LEDGER</span>
                              <span>DELHI, IN</span>
                            </div>
                            <div className="space-y-2 font-mono text-[11px] text-slate-500">
                              <p className="line-through decoration-red-500/50">Ramesh Udhaar: ₹150 (Atta) - Pending</p>
                              <p className="line-through decoration-red-500/50">Suresh: ₹400 (Oil) - Paid ₹200?</p>
                              <p className="text-red-400 font-bold">⚠️ Lost ₹250 discrepancy detected by month-end</p>
                            </div>
                            <div className="p-3 bg-red-950/20 rounded-xl border border-red-500/10 text-[11px] font-medium text-red-300">
                              "Paper books get lost. Recalculating totals in a crowded store is a major stress point."
                            </div>
                          </div>
                        ) : storySlide === 1 ? (
                          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
                            <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-emerald-400">
                              <span>WHATSAPP BILLING</span>
                              <span>v1.0 ENGINE</span>
                            </div>
                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                                <Activity size={18} />
                              </div>
                              <div className="text-xs">
                                <p className="font-bold text-slate-200">Invoice #DM-2026</p>
                                <p className="text-[10px] text-slate-500">Sent to Ramesh (+91 98xxx)</p>
                              </div>
                            </div>
                            <p className="text-[11px] font-mono text-emerald-400">✓ Instant receipt delivered. Ledger updated dynamically.</p>
                          </div>
                        ) : (
                          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
                            <div className="flex items-center gap-2 text-rose-400 text-xs font-black uppercase pb-2 border-b border-slate-800">
                              <Shield size={16} />
                              <span>Clearance Hierarchy v3.0</span>
                            </div>
                            <div className="space-y-2 text-[10px] font-mono">
                              <p className="text-emerald-400">🟢 PUBLIC SPECIFICATIONS: Free for general indexers.</p>
                              <p className="text-amber-400">🟡 DEVELOPER CHALLENGES: Gated for genuine integration partners.</p>
                              <p className="text-rose-400">🔴 INTERNAL SECURITY KERNELS: Gated behind encrypted superadmin keys.</p>
                            </div>
                            <div className="p-3 bg-rose-950/20 rounded-xl border border-rose-500/10 text-[11px] font-medium text-rose-300">
                              "A secure platform guarantees Suresh's financial transactions stay completely safe."
                            </div>
                          </div>
                        )
                      )}
                    </div>

                  </div>

                  {/* Presentation Footer Controls */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-900 relative z-10">
                    <button
                      onClick={() => setStorySlide(prev => Math.max(0, prev - 1))}
                      disabled={storySlide === 0}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white disabled:opacity-30 transition"
                    >
                      Previous
                    </button>
                    
                    {storySlide === 3 ? (
                      <button
                        onClick={() => setStorySlide(0)}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-wider rounded-xl transition duration-200"
                      >
                        Restart Journey
                      </button>
                    ) : (
                      <button
                        onClick={() => setStorySlide(prev => Math.min(3, prev + 1))}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-indigo-400 border border-slate-800 font-black uppercase text-xs tracking-wider rounded-xl transition duration-200"
                      >
                        Next Concept
                      </button>
                    )}
                  </div>
                </div>
              )
            ) : (
              /* RESTRICTED VAULT OVERLAY */
              <div className="p-8 md:p-12 flex-1 bg-slate-950 text-white flex flex-col items-center justify-center relative overflow-hidden min-h-[450px]">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.04),transparent)] pointer-events-none" />
                
                {/* Cyber Scan Line Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent h-1/2 w-full animate-pulse pointer-events-none border-y border-indigo-500/10" />

                <div className="max-w-md text-center space-y-8 relative z-10">
                  <div className="inline-flex p-4 bg-slate-900 border border-slate-800 rounded-2xl relative shadow-2xl">
                    {getAccessLevel(activeTab) === "developer" ? (
                      <div className="relative">
                        <Cpu className="text-amber-500 animate-pulse" size={48} />
                        <div className="absolute -bottom-1 -right-1 bg-amber-600 rounded-full p-1 border border-slate-950">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Shield className="text-red-500 animate-pulse" size={48} />
                        <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-1 border border-slate-950 animate-bounce">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-black uppercase tracking-tight italic text-slate-100">
                      {getAccessLevel(activeTab) === "developer" 
                        ? "Level-1 Clearance Required" 
                        : "Level-2 Restricted System Kernel"}
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                      {getAccessLevel(activeTab) === "developer" 
                        ? "These technical specs detail multi-agent schemas, direct tool bindings, and state-machine operations. Please authenticate your DukaanMitra merchant/developer credentials to gain read privileges."
                        : "This channel holds strictly confidential code procedures, security ABAC validators, safety-compliance parameters, and vulnerability metrics. Unauthorized access is recorded."}
                    </p>
                  </div>

                  {getAccessLevel(activeTab) === "developer" ? (
                    <div className="space-y-4">
                      <button
                        onClick={onLogin}
                        className="w-full py-3 px-6 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-xl uppercase tracking-wider text-xs transition duration-200 shadow-lg shadow-amber-600/10 flex items-center justify-center gap-2 italic"
                      >
                        Authenticate Developer Account
                      </button>

                      <div className="relative flex items-center justify-center py-2">
                        <div className="border-t border-slate-800 w-full absolute" />
                        <span className="bg-slate-950 px-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest relative z-10">Or Simulate Bypass</span>
                      </div>

                      {devSimulating ? (
                        <div className="space-y-2">
                          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                            <div 
                              className="h-full bg-amber-500 transition-all duration-300" 
                              style={{ width: `${devSimProgress}%` }}
                            />
                          </div>
                          <p className="text-[10px] font-mono font-bold text-amber-500/80 animate-pulse uppercase tracking-wider">{devSimStatus}</p>
                        </div>
                      ) : (
                        <button
                          onClick={startDevSimulation}
                          className="w-full py-2.5 px-6 bg-slate-900 hover:bg-slate-850 text-amber-400 border border-slate-800 font-black rounded-xl uppercase tracking-widest text-[10px] transition duration-200 shadow-md flex items-center justify-center gap-2"
                        >
                          Simulate AI Ephemeral Handshake
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <form onSubmit={handlePasscodeSubmit} className="space-y-2">
                        <div className="relative flex items-center">
                          <input 
                            type="password"
                            placeholder="Enter System Vault Key..."
                            value={passcodeInput}
                            onChange={(e) => {
                              setPasscodeInput(e.target.value);
                              setPasscodeError("");
                            }}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-red-500/50 rounded-xl px-4 py-3 text-xs focus:outline-none font-semibold text-center text-slate-200 tracking-[0.2em]"
                          />
                        </div>
                        {passcodeError && (
                          <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{passcodeError}</p>
                        )}
                        <button
                          type="submit"
                          className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl uppercase tracking-wider text-xs transition duration-200"
                        >
                          Decrypt Specification
                        </button>
                      </form>

                      <div className="relative flex items-center justify-center py-2">
                        <div className="border-t border-slate-800 w-full absolute" />
                        <span className="bg-slate-950 px-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest relative z-10">Verification Protocol</span>
                      </div>

                      {internalSimulating ? (
                        <div className="space-y-2">
                          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                            <div 
                              className="h-full bg-red-500 transition-all duration-300" 
                              style={{ width: `${internalSimProgress}%` }}
                            />
                          </div>
                          <p className="text-[10px] font-mono font-bold text-red-500/80 animate-pulse uppercase tracking-wider">{internalSimStatus}</p>
                        </div>
                      ) : (
                        <button
                          onClick={startInternalSimulation}
                          className="w-full py-2.5 px-6 bg-slate-900 hover:bg-slate-850 text-red-500 border border-slate-800 font-black rounded-xl uppercase tracking-widest text-[10px] transition duration-200 shadow-md flex items-center justify-center gap-2"
                        >
                          Simulate Chief Architect Verification Protocol
                        </button>
                      )}
                      <p className="text-[9px] text-slate-500 font-bold tracking-normal">
                        💡 Clue: Superadmins bypass key is <span className="text-red-500/80 underline font-mono select-all decoration-red-800">DM-INTERNAL-99</span>
                      </p>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* Footer Status Indicators */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                <span className={`w-2 h-2 rounded-full ${isUnlocked(activeTab) ? 'bg-emerald-500 animate-ping' : 'bg-amber-500 animate-pulse'}`} />
                <span>
                  Status: <strong>{isUnlocked(activeTab) ? "Specification Decrypted & Active" : "Channel Encrypted"}</strong>
                </span>
              </div>
              <div className="text-slate-400 font-bold">
                DukaanMitra AI OS © 2026
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
