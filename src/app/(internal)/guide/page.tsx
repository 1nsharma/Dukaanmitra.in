
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
                DukaanMitra AI - Production Build Guide
            </h1>
            <p className="text-lg md:text-xl text-primary max-w-3xl mx-auto leading-relaxed font-bold tracking-widest">
                Firebase-First • Genkit AI • Multi-Tenant SaaS
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
                            {id: "3-database-design", title: "3. Data Model (Firestore)"},
                            {id: "4-security--auth", title: "4. Security & Auth"},
                            {id: "5-deployment", title: "5. Deployment"},
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
                    <p><strong>DukaanMitra AI</strong> is a multi-tenant SaaS platform built to digitize India's Kirana stores. It leverages a "WhatsApp-first" approach, allowing shop owners to manage their ledger, customers, and sales using natural language commands over WhatsApp, powered by a sophisticated AI agent.</p>

                    <h3>Core User Value</h3>
                    <p>The platform eliminates the need for traditional `Billbooks` or complex apps. A shop owner can simply send a message like "Ravi 500 udhaar chini," and the system automatically parses it, updates the digital ledger, and provides analytics—all within WhatsApp.</p>
                </Section>
                
                <Section title="System Architecture" id="2-system-architecture">
                    <h3>Technology Stack</h3>
                    <p>The stack is designed for rapid development, scalability, and reliability, centered around the Firebase and Google Cloud ecosystem.</p>
                    <ul>
                        <li><strong>Frontend:</strong> Next.js (App Router) & React</li>
                        <li><strong>UI:</strong> Tailwind CSS with ShadCN components</li>
                        <li><strong>Backend & Database:</strong> Google Firebase (Firestore, Authentication, Hosting)</li>
                        <li><strong>AI Agent & Flows:</strong> Google Genkit with the Gemini model</li>
                    </ul>
                    
                    <h3>Logic Flow: From WhatsApp to Action</h3>
                    <p>The system is designed around a decoupled, tool-based AI agent that processes incoming messages and decides on actions.</p>
                    <pre><code className="language-js">{`// HIGH-LEVEL FLOW
// 1. ENTRY POINT: A WhatsApp Webhook (external service) forwards a message.
function processIncomingMessage(message, shop_id) {
    // 2. AI AGENT: The message is passed to the core Genkit AI agent.
    const agentOutput = anigravityAgent({ query: message, shopContext: {...} });

    // 3. DECISION: The agent's output contains an intent and a potential action.
    if (agentOutput.escalate) {
        notifyHuman(shop_id, message);
    } else if (agentOutput.action) {
        // 4. EXECUTION: A separate service would execute the action.
        executeBackendAction(agentOutput.action);
    } else {
        // 5. REPLY: Send a generated response back via WhatsApp.
        sendWhatsAppReply(shop_id, agentOutput.response);
    }
}`}</code></pre>
                </Section>

                <Section title="Data Model (Firestore)" id="3-database-design">
                    <h3>The Firestore-First Model</h3>
                    <p>Cloud Firestore is the single source of truth for all application data. Its NoSQL, document-based structure is highly scalable and integrates seamlessly with Firebase Authentication for security.</p>
                    <p>The data model is defined in <strong>`docs/backend.json`</strong> and is structured for multi-tenancy from the ground up.</p>

                    <h3>Core Collections (Multi-Tenant Ready)</h3>
                    <p>Every shop's data is isolated using Firestore's subcollection model. A user's `shopId` is the key to accessing their data, which is enforced by security rules.</p>

                    <pre><code className="language-text">{`// /users/{userId}`}</code></pre>
                    <p>Stores the profile for each authenticated user, including their role (`user`, `admin`, `super_admin`) and the `shopId` they belong to.</p>

                    <pre><code className="language-text">{`// /shops/{shopId}` }</code></pre>
                    <p>The root document for each tenant (shop). Contains shop-level information like name, owner ID, and subscription plan details.</p>

                    <pre><code className="language-text">{`// /shops/{shopId}/customers/{customerPhone}`}</code></pre>
                    <p>A subcollection under each shop. Each document represents a customer, uniquely identified by their phone number to prevent duplicates.</p>
                    
                    <pre><code className="language-text">{`// /shops/{shopId}/ledger/{ledgerId}`}</code></pre>
                    <p>A subcollection containing all financial transactions (credit/payment) for a specific shop.</p>
                </Section>
                
                <Section title="Security & Auth" id="4-security--auth">
                    <p>Authentication is handled by **Firebase Authentication**, supporting email/password and social providers like Google.</p>
                    
                    <p>Authorization is enforced directly at the database level via **Firestore Security Rules** (`firestore.rules`). This is the core of the multi-tenant security model.</p>
                    
                    <pre><code className="language-javascript">{`// Example Security Rule for Shop Data Isolation
match /shops/{shopId}/{subcollection}/{docId=**} {
  function isShopOwner() {
    // The user's profile document must contain the shopId they are trying to access.
    return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.shopId == shopId;
  }

  // Allow read/write access only if the authenticated user is the owner of the shop.
  allow read, write: if isShopOwner();
}`}</code></pre>
                    <p>This rule ensures that a user from Shop A can never read, write, or even know about the existence of data from Shop B.</p>
                </Section>
                
                <Section title="Deployment" id="10-deployment">
                    <p>The application is configured for seamless deployment on serverless platforms.</p>
                    <ul>
                        <li><strong>Frontend & Backend:</strong> Firebase App Hosting (configured via `apphosting.yaml`) or Vercel.</li>
                        <li><strong>Database:</strong> Google Firestore (automatically available with the Firebase project).</li>
                    </ul>
                </Section>

                <footer className="bg-card border border-border p-12 rounded-[4rem] text-center space-y-4 mt-20">
                    <p className="text-primary font-bold uppercase tracking-widest text-sm">You are ready to build.</p>
                    <p className="text-lg opacity-80 max-w-2xl mx-auto italic">
                        This guide provides the complete architectural foundation for the DukaanMitra platform.
                    </p>
                </footer>
            </main>
        </div>
      </div>
    </div>
  );
};
