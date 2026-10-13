
export interface SystemManifest {
  version: string;
  codename: string;
  lastUpdated: string;
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    ai: string[];
  };
  services: {
    name: string;
    description: string;
    protocol: string;
  }[];
  designSystem: {
    theme: string;
    primaryColors: string[];
    fontFamily: string;
    principles: string[];
  };
  branding: {
    name: string;
    tagline: string;
    voice: string;
  };
}

import { Timestamp, FieldValue } from 'firebase/firestore';

export interface StoreCustomer {
  id?: string;
  storeId: string;
  name: string;
  balance: number;
  lastTransactionAt: Timestamp | FieldValue | string;
}

export interface StoreTransaction {
  id?: string;
  storeId: string;
  customerId: string;
  type: TransactionType;
  amount: number;
  description: string;
  timestamp: Timestamp | FieldValue | string;
}

export type TransactionType = 'sale' | 'udhaar' | 'payment';

export interface Transaction {
  id?: string;
  transId: string;
  storeId: string;
  phone: string;
  amount: number;
  items: string;
  date: string;
  customerName: string;
  type: TransactionType;
  customerId?: string;
  intent?: 'NEW_BILL' | 'PAYMENT_RECEIVED' | 'SKIP' | 'ADD_ENTRY' | 'RECOVERY_NUDGE';
  runId?: string;
}

export type ParsedTransaction =
  | { type: 'sale'; amount: number; customerName?: string; items?: string; description?: string }
  | { type: 'udhaar'; amount: number; customerName: string; items?: string; description?: string }
  | { type: 'payment'; amount: number; customerName: string; description?: string };

export interface ProjectHealthData {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  avgCompletionTime: number; // in hours
  history: { name: string; count: number }[];
}

export interface StrategyMetric {
  feature: string;
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
  score: number;
}

export interface SystemLog {
  timestamp: string;
  errorSource: string;
  payloadReceived: string;
  resolution: string;
  severity?: 'LOW' | 'CRITICAL' | 'INFO';
  shardId?: string;
}

export interface AppliedPatch {
  id: string;
  timestamp: string;
  diagnosis: string;
  diff: string;
  impact: string;
  status: 'DEPLOYED' | 'FAILED' | 'REVERTED';
}

export interface ShardHealth {
  id: string;
  region: string;
  load: number;
  latency: number;
  status: 'Healthy' | 'Hot' | 'Warning' | 'Idle';
  color: string;
}

export interface DatabaseConfig {
  sheetId: string;
  webhookUrl: string;
  status: 'CONNECTED' | 'DISCONNECTED';
  lastSync: string;
}

export interface ChatHistoryMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface ChatMessage {
  sender: 'user' | 'bot' | 'system';
  text: string;
  isImage?: boolean;
  imageData?: string;
  timestamp: string;
  role?: 'user' | 'model'; // For Gemini history
  triage?: AgentRoutingResponse;
}

export interface OpsHealthSnapshot {
  latency: string;
  throughput: number;
  errorRate: string;
  activeShards: number;
  aiAccuracy: string;
  summary: string;
  cpuLoad?: string;
  memoryUsage?: string;
}

export interface ParsedBill {
  action: 'add_entry' | 'modify_entry' | 'get_summary' | 'add_bulk_entries' | 'clarification_required' | 'marketing_gen' | 'analyze_data';
  customer_name?: string;
  item?: string;
  items?: string;
  quantity?: number;
  unit?: string;
  amount?: number;
  date?: string;
  confidence: number;
  user_message: string;
  next_suggested_actions?: string[];
  intent?: 'NEW_BILL' | 'PAYMENT_RECEIVED' | 'SKIP';
  strategic_intent?: string;
  uncertainty_hypotheses?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tag: string;
  date: string;
  imageUrl?: string;
}

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export type View = 
  | 'landing' 
  | 'privacy'
  | 'terms'
  | 'superadmin' 
  | 'shop_panel' 
  | 'dashboard' 
  | 'architecture' 
  | 'customers' 
  | 'transactions' 
  | 'logs' 
  | 'simulator' 
  | 'build' 
  | 'deployment' 
  | 'operations' 
  | 'reliability' 
  | 'scaling' 
  | 'platform' 
  | 'founder' 
  | 'sales' 
  | 'assets' 
  | 'recovery' 
  | 'optimization' 
  | 'sheets_db'
  | 'training'
  | 'blog_engine'
  | 'ai_tools'
  | 'customer_portal'
  | 'project_health'
  | 'project_detail'
  | 'product_strategy'
  | 'jan_sunwai'
  | 'store_dashboard'
  | 'admin_dashboard'
  | 'whatsapp_sim';

export interface UserRole {
  uid: string;
  role: 'merchant' | 'superadmin';
  storeId?: string;
}

export interface MemoryNode {
  id: string;
  storeId: string;
  entity: string; // e.g., "Rahul", "Amul Milk"
  type: 'customer' | 'product' | 'preference' | 'debt';
  properties: Record<string, unknown>;
  lastUpdated: string;
}

export interface MemoryRelation {
  id: string;
  storeId: string;
  sourceId: string;
  targetId: string;
  relationship: string; // e.g., "prefers", "owes", "bought"
  strength: number;
}

export type AgentIntent = 'ORDER' | 'CREDIT' | 'INVENTORY' | 'GENERAL' | 'CLARIFICATION';

export interface AgentRoutingResponse {
  intent: AgentIntent;
  confidence: number;
  reasoning: string;
  suggestedAgent: string;
}
