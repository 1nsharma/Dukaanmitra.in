/**
 * Server-side catalog of optional DukaanMitra integration modules.
 * Catalog visibility does not assert an integration is implemented.
 * Optional modules remain disabled until source implementation is reviewed and marked implemented,
 * then require an explicit server flag.
 */
const MODULES = Object.freeze([
  { id:"shared-ai-brain", name:"Shared AI Brain", category:"platform", sourceProjects:["Dukaanmitra.in","Dukaanmitra-MitraOS","hiresaathi"], description:"Channel-neutral AI orchestration with server-side policy checks and auditable proposals.", flag:"DUKAANMITRA_MODULE_SHARED_AI_BRAIN", defaultEnabled:false, risk:"high", status:"planned" },
  { id:"business-growth", name:"Business Growth & CRM", category:"business", sourceProjects:["hiresaathi","Amit-Corporate-"], description:"Optional campaign, lead, customer-support and business-automation workflows.", flag:"DUKAANMITRA_MODULE_BUSINESS_GROWTH", defaultEnabled:false, risk:"medium", status:"planned" },
  { id:"creator-tools", name:"AI Creator Tools", category:"tools", sourceProjects:["portofolio","Gallaryai","gallaryaiu"], description:"Isolated text, image and creator utilities; any code execution must use a hardened sandbox.", flag:"DUKAANMITRA_MODULE_CREATOR_TOOLS", defaultEnabled:false, risk:"medium", status:"planned" },
  { id:"qr-feedback", name:"QR Feedback", category:"business", sourceProjects:["AI-QR"], description:"QR-based customer feedback and transparent review handoff; no fabricated reviews or suppression of honest feedback.", flag:"DUKAANMITRA_MODULE_QR_FEEDBACK", defaultEnabled:false, risk:"medium", status:"planned" },
  { id:"recruitment", name:"Recruitment & Hiring", category:"business", sourceProjects:["hiresaathi","Hiresaathi-astra-"], description:"Optional hiring workflow; requires fairness, privacy and human-review controls.", flag:"DUKAANMITRA_MODULE_RECRUITMENT", defaultEnabled:false, risk:"high", status:"planned" },
  { id:"appointments", name:"Appointments & Service Businesses", category:"business", sourceProjects:["Tulika-Saloon-Studio","Kanha-Construction-Interiors"], description:"Potential appointment, lead and quotation workflows, subject to source audit.", flag:"DUKAANMITRA_MODULE_APPOINTMENTS", defaultEnabled:false, risk:"medium", status:"planned" },
  { id:"pet-services", name:"Pet Services", category:"vertical", sourceProjects:["Pets-","Petsjanu.com"], description:"Separate pet identity, bookings and lost-pet workflows; pet records must be isolated from retail tenant data.", flag:"DUKAANMITRA_MODULE_PET_SERVICES", defaultEnabled:false, risk:"high", status:"planned" },
  { id:"call-guard", name:"Call Guard", category:"safety", sourceProjects:["AmitAI-CallGuard"], description:"Potential call-safety tools pending platform-permission, consent and privacy review.", flag:"DUKAANMITRA_MODULE_CALL_GUARD", defaultEnabled:false, risk:"high", status:"planned" },
  { id:"analytics", name:"Analytics & Reporting", category:"analytics", sourceProjects:["Power-BI-AI-Guru","DukaanMitra_data_app"], description:"Reporting and event-driven analytics after data contracts and tenant access are validated.", flag:"DUKAANMITRA_MODULE_ANALYTICS", defaultEnabled:false, risk:"medium", status:"planned" },
  { id:"recycling", name:"Circular Economy", category:"vertical", sourceProjects:["Re-Cycle-ChainSYS"], description:"Experimental recycling workflows; not part of the retail ledger by default.", flag:"DUKAANMITRA_MODULE_RECYCLING", defaultEnabled:false, risk:"medium", status:"experimental" },
  { id:"solar-microgrid", name:"Solar & Microgrid", category:"vertical", sourceProjects:["solar_wallet"], description:"Separate energy vertical requiring its own hardware, payment and security review.", flag:"DUKAANMITRA_MODULE_SOLAR_MICROGRID", defaultEnabled:false, risk:"high", status:"restricted" },
  { id:"crypto-wallet", name:"Crypto Wallet", category:"restricted", sourceProjects:["CRYPTO-WALLET-DASHBOARD"], description:"Excluded from the kirana ledger; custody, signing, compliance and security review required before any separate product decision.", flag:"DUKAANMITRA_MODULE_CRYPTO_WALLET", defaultEnabled:false, risk:"critical", status:"restricted" }
]);
const ALLOWED_CATEGORIES = new Set(["platform","business","tools","vertical","safety","analytics","restricted"]);
const ALLOWED_RISKS = new Set(["low","medium","high","critical"]);

export function getModuleCatalog(env = process.env) {
  return MODULES.map((module) => {
    const enabledByEnvironment = env[module.flag] === "true";
    return {
      id: module.id,
      name: module.name,
      category: module.category,
      sourceProjects: [...module.sourceProjects],
      description: module.description,
      risk: module.risk,
      status: module.status,
      enabled: module.status === "implemented" && (module.defaultEnabled || enabledByEnvironment)
    };
  });
}

export function validateModuleCatalog(modules = MODULES) {
  const ids = new Set();
  for (const module of modules) {
    if (!module.id || ids.has(module.id)) throw new Error("Module IDs must be unique and non-empty.");
    ids.add(module.id);
    if (!ALLOWED_CATEGORIES.has(module.category)) throw new Error(`Invalid category for ${module.id}.`);
    if (!ALLOWED_RISKS.has(module.risk)) throw new Error(`Invalid risk for ${module.id}.`);
    if (typeof module.flag !== "string" || !module.flag.startsWith("DUKAANMITRA_MODULE_")) {
      throw new Error(`Invalid feature flag for ${module.id}.`);
    }
    if (module.status === "restricted" && module.defaultEnabled) {
      throw new Error(`Restricted module ${module.id} cannot be enabled by default.`);
    }
  }
  return true;
}
validateModuleCatalog();
