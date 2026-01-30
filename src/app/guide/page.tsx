
'use client';

import React from 'react';

const Section: React.FC<{title: string, id: string, children: React.ReactNode}> = ({ title, id, children }) => (
    <section id={id} className="space-y-6 scroll-mt-24">
        <header className="border-b border-white/10 pb-4">
            <h2 className="text-3xl md:text-4xl font-black text-emerald-400 tracking-tighter leading-none italic uppercase">{title}</h2>
        </header>
        <div className="prose prose-invert prose-slate max-w-none text-slate-300 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-headings:text-emerald-400 prose-strong:text-white">
            {children}
        </div>
    </section>
);


export default function GuidePage() {
  return (
    <div className="bg-[#02040a] text-white font-mono animate-in fade-in duration-700">
      <div className="container py-16 md:py-24">
        <header className="text-center space-y-4 mb-20">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none italic uppercase">
                DukaanMitra AI - A to Z Build Guide
            </h1>
            <p className="text-lg md:text-xl text-indigo-400 max-w-3xl mx-auto leading-relaxed font-bold tracking-widest">
                Firebase + PostgreSQL Hybrid • Full-Stack SaaS • Production-Ready
            </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <aside className="lg:col-span-3 lg:sticky top-24 self-start">
                <nav className="space-y-2">
                    <h3 className="font-bold text-white uppercase tracking-widest mb-4">Table of Contents</h3>
                    <ul className="space-y-3 text-sm font-medium text-slate-400">
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
                                <a href={`#${item.id}`} className="hover:text-emerald-400 transition-colors block border-l-2 border-slate-700 pl-4 hover:border-emerald-400">
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

                    <h3>Core Value Proposition</h3>
                    <ul>
                        <li>Automatically capture customer data</li>
                        <li>AI-powered follow-ups and offers</li>
                        <li>Simple dashboard (zero tech knowledge needed)</li>
                        <li>WhatsApp-first communication</li>
                    </ul>
                    
                    <h3>Business Model</h3>
                    <pre><code>{`Free:     100 customers, limited messages
₹499/mo:  1000 customers, unlimited messages
₹999/mo:  Unlimited + custom AI
₹1999/mo: Multi-branch + API access`}</code></pre>
                </Section>
                
                <Section title="System Architecture" id="2-system-architecture">
                    <h3>Technology Stack</h3>
                    <p><strong>Backend:</strong></p>
                    <ul>
                        <li>Python 3.11+</li>
                        <li>FastAPI (REST APIs)</li>
                        <li>PostgreSQL (core data)</li>
                        <li>Redis (caching)</li>
                        <li>Firebase (auth, real-time, storage)</li>
                    </ul>
                    <p><strong>Frontend:</strong></p>
                    <ul>
                        <li>React 18 + Next.js 14</li>
                        <li>Tailwind CSS</li>
                        <li>Firebase SDK</li>
                    </ul>
                    <h3>Architecture Diagram</h3>
                    <pre><code>{`
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
├─────────────────────────────────────────────────────────┤
│  Web Dashboard (React)  │  Mobile App (Flutter-future)  │
└────────────┬────────────┴──────────────┬────────────────┘
             │                           │
             │     Firebase Auth         │
             │     (Phone OTP)           │
             │                           │
┌────────────▼───────────────────────────▼────────────────┐
│                   API GATEWAY (FastAPI)                  │
├─────────────────────────────────────────────────────────┤
│  /auth  │  /customers  │  /bills  │  /ai  │  /messages  │
└────┬────┴──────┬───────┴─────┬────┴───┬───┴──────┬──────┘
     │           │             │        │          │
┌────▼───────────▼─────────────▼────────▼──────────▼──────┐
│                  BUSINESS LOGIC LAYER                     │
├──────────────────────────────────────────────────────────┤
│  Rule Engine  │  AI Engine  │  Message Service  │  Auth  │
└────┬──────────┴─────┬───────┴─────┬─────────────┴───┬───┘
     │                │             │                 │
┌────▼────────┬───────▼─────┬───────▼─────┬───────────▼───┐
│ PostgreSQL  │  Firebase   │   Redis     │   n8n/Celery  │
│ (Core Data) │ (Realtime)  │  (Cache)    │  (Automation) │
└─────────────┴─────────────┴─────────────┴───────────────┘
                         │
                         ▼
          ┌──────────────────────────────┐
          │    EXTERNAL SERVICES         │
          ├──────────────────────────────┤
          │  WhatsApp API  │  SMS API    │
          └──────────────────────────────┘
`}</code></pre>
                </Section>

                <Section title="Database Design" id="3-database-design">
                    <h3>PostgreSQL Schema</h3>
                    <pre><code className="language-sql">{`-- ==========================================
-- USERS (Business Owners)
-- ==========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255),
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50), -- restaurant, salon, retail
    plan VARCHAR(20) DEFAULT 'free', -- free, basic, pro, enterprise
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- CUSTOMERS
-- ==========================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(255),
    visit_count INT DEFAULT 0,
    total_spend DECIMAL(10,2) DEFAULT 0,
    last_visit TIMESTAMP,
    first_visit TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'new', -- new, regular, vip, inactive
    tags TEXT[], -- ['vip', 'frequent_buyer']
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(business_id, phone)
);

-- And more tables... (bills, messages, etc)
`}</code></pre>
                    <h3>Firebase Structure (Firestore)</h3>
                    <pre><code className="language-javascript">{`// /businesses/{businessId}
{
  name: "Sharma Cafe",
  online: true,
  lastActive: timestamp,
  stats: {
    todayCustomers: 12,
    todayRevenue: 4500,
    pendingMessages: 3
  }
}

// /businesses/{businessId}/realtime_customers/{customerId}
{
  name: "Rohit Kumar",
  phone: "+919876543210",
  lastVisit: timestamp,
  status: "vip",
  totalSpend: 4500
}

// /notifications/{businessId}/items/{notificationId}
{
  type: "ai_suggestion",
  title: "3 customers inactive",
  message: "Send comeback offer?",
  actionUrl: "/customers?filter=inactive",
  read: false,
  createdAt: timestamp
}`}</code></pre>
                </Section>
                
                {/* Dummy sections for illustration */}
                <Section title="Security & Auth" id="9-security--auth">
                    <p>Details on security and authentication...</p>
                </Section>
                <Section title="Deployment" id="10-deployment">
                    <p>Deployment strategies and steps...</p>
                </Section>
                <Section title="Go-to-Market" id="13-go-to-market">
                    <p>Go-to-market plan...</p>
                </Section>
                <Section title="Scaling Strategy" id="15-scaling-strategy">
                    <p>How to scale the application...</p>
                </Section>

                <footer className="bg-slate-900/50 border border-white/10 p-12 rounded-[4rem] text-center space-y-4 mt-20">
                    <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm">You are ready to build.</p>
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
