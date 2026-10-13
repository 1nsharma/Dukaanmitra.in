
import { Customer, Transaction, SystemLog, SystemManifest } from './types';

export const SYSTEM_MANIFEST: SystemManifest = {
  version: "2.0.0-JanSunwai",
  codename: "JanSunwai 2.0",
  lastUpdated: "2026-04-03T10:00:00Z",
  techStack: {
    frontend: ["React 19", "Tailwind CSS", "Anime.js", "Recharts", "Lucide Icons"],
    backend: ["Make.com (Workflow Orchestration)", "Gupshup (WhatsApp Business API)", "Firebase Auth"],
    database: ["Google Sheets (MVP Storage)", "Supabase/Postgres (Enterprise Layer)", "Redis (Edge Caching)"],
    ai: ["Gemini 3 Pro (Reasoning)", "Gemini 2.5 Flash (Vision)", "Veo 3.1 (Video Gen)"]
  },
  services: [
    { name: "WhatsApp Munim", description: "Natural language parsing of Hinglish messages via WhatsApp.", protocol: "Bayesian-LLM" },
    { name: "Smart Recovery", description: "Debt recovery via automated WhatsApp account statements.", protocol: "Nudge-Theory" },
    { name: "JanSunwai 2.0", description: "Grievance management and local governance integration.", protocol: "Public-Service-API" },
    { name: "Creative Studio", description: "AI-generated marketing posters for Kirana stores.", protocol: "Multimodal-Gen" }
  ],
  designSystem: {
    theme: "Munim High-Fidelity",
    primaryColors: ["#4f46e5 (Indigo)", "#020617 (Slate)", "#10b981 (Emerald)"],
    fontFamily: "Inter Variable, JetBrains Mono (Diagnostics)",
    principles: ["Minimalist Utility", "Desi Aesthetics", "Motion-First Navigation"]
  },
  branding: {
    name: "DukaanMitra",
    tagline: "Aapka Digital Munim",
    voice: "Professional, Persuasive, Friendly, Hinglish-native"
  }
};

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    phone: "919876543210",
    name: "Amit Sharma",
    storeId: "DM_DEL_001",
    joinDate: "2024-12-01T10:30:00Z",
    trialEndDate: "2024-12-31T10:30:00Z",
    paidStatus: 'Active',
    totalLTV: 1500
  },
  {
    phone: "919988776655",
    name: "Sunil Verma",
    storeId: "DM_DEL_002",
    joinDate: "2024-12-10T14:20:00Z",
    trialEndDate: "2025-01-09T14:20:00Z",
    paidStatus: 'Trial',
    totalLTV: 450
  },
  {
    phone: "919122334455",
    name: "Priya Gupta",
    storeId: "DM_DEL_001",
    joinDate: "2024-11-20T09:00:00Z",
    trialEndDate: "2024-12-20T09:00:00Z",
    paidStatus: 'Expired',
    totalLTV: 3200
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    transId: "uuid-001",
    storeId: "DM_DEL_001",
    phone: "919876543210",
    customerName: "Ram",
    amount: 150,
    items: "2kg cheeni",
    date: "2024-12-15T18:45:00Z",
    type: "sale",
    runId: "run_99128"
  },
  {
    transId: "uuid-002",
    storeId: "DM_DEL_001",
    phone: "919876543210",
    customerName: "Aman",
    amount: 500,
    items: "doodh cheeni",
    date: "2024-12-15T19:20:00Z",
    type: "sale",
    runId: "run_99130"
  }
];

export const INITIAL_LOGS: SystemLog[] = [
  {
    timestamp: "2024-12-15T10:00:00Z",
    errorSource: "AI Parser",
    payloadReceived: '{"text": "xyz 123 abc"}',
    resolution: "Confidence score low. Error template sent."
  }
];
