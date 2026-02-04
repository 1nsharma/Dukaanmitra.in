
'use client';

import React from 'react';

const Section: React.FC<{title: string, id: string, children: React.ReactNode}> = ({ title, id, children }) => (
    <section id={id} className="space-y-6 scroll-mt-24">
        <header className="border-b border-border/50 pb-4">
            <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tighter leading-none italic uppercase">{title}</h2>
        </header>
        <div className="prose prose-invert prose-slate max-w-none text-muted-foreground prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:rounded-2xl prose-headings:text-primary prose-strong:text-foreground">
            {children}
        </div>
    </section>
);


export default function GuidePage() {
  return (
    <div className="bg-background text-foreground font-mono animate-in fade-in duration-700">
      <div className="container py-16 md:py-24">
        <header className="text-center space-y-4 mb-20">
            <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-none italic uppercase">
                DukaanMitra AI - A to Z Build Guide
            </h1>
            <p className="text-lg md:text-xl text-primary max-w-3xl mx-auto leading-relaxed font-bold tracking-widest">
                Firebase + PostgreSQL Hybrid • Full-Stack SaaS • Production-Ready
            </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <aside className="lg:col-span-3 lg:sticky top-24 self-start">
                <nav className="space-y-2">
                    <h3 className="font-bold text-foreground uppercase tracking-widest mb-4">Table of Contents</h3>
                    <ul className="space-y-3 text-sm font-medium text-muted-foreground">
                        {[
                            {id: "1-project-overview", title: "1. Project Overview"},
                            {id: "2-system-architecture", title: "2. System Architecture"},
                            {id: "3-database-design", title: "3. Database Design"},
                            {id: "9-security--auth", title: "4. Security & Auth"},
                            {id: "10-deployment", title: "5. Deployment"},
                            {id: "13-go-to-market", title: "6. Go-to-Market"},
                            {id: "15-scaling-strategy", title: "7. Scaling Strategy"},
                        ].map(item => (
                            <li key={item.id}>
                                <a href={`#${item.id}`} className="hover:text-primary transition-colors block border-l-2 border-border pl-4 hover:border-primary">
                                    {item.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            <main className="lg:col-span-9 space-y-16">
                <Section title="Project Overview" id="1-project-overview">
                    <h3>Vision</h3>
                    <p><strong>DukaanMitra AI</strong> - "Local business ka digital dimaag"</p>
                    <p>Street-level SaaS helping Indian shop owners manage customers using AI-powered automation.</p>

                    <h3>Target Users</h3>
                    <ul>
                        <li>Restaurants, cafes</li>
                        <li>Salons, clinics</li>
                        <li>Retail shops</li>
                        <li>Service providers</li>
                    </ul>
                    
                    <h3>Business Model</h3>
                    <pre><code>{`Free Trial: 14 Days, Full Access
Basic:      ₹1999/mo, Core Features
Pro:        ₹4999/mo, Advanced AI & Analytics
Enterprise: Custom, API Access & Priority Support`}</code></pre>
                </Section>
                
                <Section title="System Architecture" id="2-system-architecture">
                    <h3>Technology Stack ("Stax")</h3>
                    <p>A "boring but reliable" stack focused on execution speed and stability.</p>
                    <ul>
                        <li><strong>Frontend (Dashboard):</strong> Next.js (React) & Tailwind CSS</li>
                        <li><strong>Backend:</strong> Node.js (Express) or Python (FastAPI) for REST APIs</li>
                        <li><strong>Database:</strong> PostgreSQL via <strong>Supabase</strong> (for multi-tenancy & core data)</li>
                        <li><strong>Real-time Layer:</strong> Firebase (for auth & live dashboard updates)</li>
                        <li><strong>Automation Engine:</strong> n8n or Celery (The "Brain" connecting DB to WhatsApp)</li>
                        <li><strong>AI Model API:</strong> OpenAI (GPT-4o) or Google Gemini</li>
                    </ul>
                    
                    <h3>Logic Flow: From WhatsApp to Action</h3>
                    <p>This is the end-to-end flow for processing every incoming message.</p>
                    <pre><code className="language-js">{`// 1. ENTRY POINT: WhatsApp Webhook receives a message
function whatsapp_webhook(message, sender_id, shop_id) {
    // 2. CONTEXT: Load all data for the specific shop
    const shopContext = load_shop_context(shop_id);

    // 3. INTENT: Detect what the user wants (rules-first, then AI)
    const intentResult = intent_detector(message);

    // 4. POLICY: Check if the action is allowed (e.g., credit limit)
    const policyDecision = policy_guard(intentResult, shopContext);
    if (policyDecision === 'BLOCK') {
        return execute_decision('ESCALATE', ...);
    }

    // 5. DECIDE: Choose whether to Reply, Act, or Escalate
    const decision = decision_engine(intentResult, shopContext);

    // 6. EXECUTE: Perform the final action
    execute_decision(decision, sender_id, shopContext, intentResult);
}
`}</code></pre>
                </Section>

                <Section title="Database Design" id="3-database-design">
                    <h3>The Hybrid Model: Supabase + Firebase</h3>
                    <p>This architecture uses the best of both worlds:</p>
                    <ul>
                        <li><strong>Supabase (PostgreSQL):</strong> The "digital khata" or ledger. It's the permanent, structured source of truth for all business-critical data (shops, customers, bills). Chosen for its relational integrity and multi-tenancy capabilities.</li>
                        <li><strong>Firebase (Firestore):</strong> The real-time layer. Used for powering the live dashboard, showing stats, and sending notifications. It's fast and perfect for UI-facing data.</li>
                    </ul>

                    <h3>PostgreSQL Schema (Multi-Tenant Ready)</h3>
                    <p>Every table includes a `business_id` or `shop_id` to ensure a shopkeeper can ONLY access their own data. This is the core of our multi-tenant strategy.</p>
                    <pre><code className="language-sql">{`-- USERS (The shop owners who subscribe to DukaanMitra)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE NOT NULL, -- Links to Firebase Auth
    phone VARCHAR(15) UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    plan VARCHAR(20) DEFAULT 'trial'
);

-- CUSTOMERS (The shop's end-customers)
CREATE TABLE customers (
    id UUID PRIMARY KEY,
    business_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    visit_count INT DEFAULT 0,
    total_spend DECIMAL(10,2) DEFAULT 0,
    last_visit TIMESTAMP,
    -- Ensures a phone number is unique PER shop, not globally
    UNIQUE(business_id, phone)
);

-- BILLS (Individual transactions)
CREATE TABLE bills (
    id UUID PRIMARY KEY,
    business_id UUID NOT NULL REFERENCES users(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'credit' or 'payment'
    raw_text VARCHAR(500), -- Original WhatsApp message for audit
    created_at TIMESTAMP DEFAULT NOW()
);

-- MESSAGE_LOGS (Record of automated messages sent)
CREATE TABLE message_logs (
    id UUID PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id),
    type VARCHAR(50), -- e.g., 'welcome_message', 'payment_reminder'
    status VARCHAR(20), -- 'sent', 'failed'
    created_at TIMESTAMP DEFAULT NOW()
);
`}</code></pre>
                    <h3>Firebase Structure (For Real-time UI)</h3>
                    <pre><code className="language-javascript">{`// /shops/{shopId}/realtime_stats
{
  "name": "Sharma Cafe",
  "status": "online",
  "live_customers": 12,
  "live_revenue": 4500,
  "pending_messages": 3
}

// /shops/{shopId}/notifications/{notificationId}
{
  "type": "ai_suggestion",
  "title": "3 customers inactive",
  "message": "Send comeback offer to them?",
  "action_required": true,
  "read": false,
  "createdAt": timestamp
}`}</code></pre>
                </Section>
                
                <Section title="Security & Auth" id="9-security--auth">
                    <p>Authentication is handled by Firebase Auth (Phone/OTP). Authorization is managed at two levels:</p>
                    <ul>
                        <li><strong>API Level:</strong> The backend API validates the user's token and injects the `shop_id` into every database query, ensuring data isolation.</li>
                        <li><strong>Database Level (PostgreSQL RLS):</strong> Row-Level Security policies in Supabase provide a final, unbreakable barrier, ensuring a request for Shop A can never access data from Shop B.</li>
                    </ul>
                </Section>
                <Section title="Deployment" id="10-deployment">
                    <ul>
                        <li><strong>Frontend:</strong> Firebase Hosting or Vercel</li>
                        <li><strong>Backend:</strong> Railway, Render, or any serverless platform</li>
                        <li><strong>Database:</strong> Supabase Cloud</li>
                    </ul>
                </Section>
                <Section title="Go-to-Market" id="13-go-to-market">
                    <p>A B2B2C model focusing on hyper-local marketing to shop owners, showcasing the immediate value of digitizing their customer interactions via WhatsApp.</p>
                </Section>
                <Section title="Scaling Strategy" id="15-scaling-strategy">
                    <p>The multi-tenant architecture allows for horizontal scaling from day one. The system is designed to grow from a single city to a nationwide service without a core architectural redesign.</p>
                </Section>

                <footer className="bg-card border border-border p-12 rounded-[4rem] text-center space-y-4 mt-20">
                    <p className="text-primary font-bold uppercase tracking-widest text-sm">You are ready to build.</p>
                    <p className="text-lg opacity-80 max-w-2xl mx-auto italic">
                        This guide provides the complete architectural and strategic foundation. Now, let's bring this vision to life, one feature at a time.
                    </p>
                </footer>
            </main>
        </div>
      </div>
    </div>
  );
};
