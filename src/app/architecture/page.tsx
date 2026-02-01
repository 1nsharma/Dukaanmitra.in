
'use client';

import React, { useState } from 'react';
import { Cloud, Database, Zap, Shield, CreditCard, LayoutDashboard } from 'lucide-react';

const services = {
  overview: {
    name: 'Tech Stack Overview',
    icon: Cloud,
    color: 'primary',
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-primary/80 to-primary/60 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-primary-foreground mb-2">Firebase-First Architecture</h2>
          <p className="text-primary-foreground/80">A scalable, real-time backend for a modern SaaS.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border-l-4 border-primary">
            <div className="text-primary text-sm font-semibold mb-1">Frontend</div>
            <div className="text-foreground text-lg font-bold">Next.js on Firebase Hosting</div>
            <div className="text-muted-foreground text-xs">Landing Pages & Dashboard</div>
          </div>
          <div className="bg-card p-4 rounded-lg border-l-4 border-blue-500">
            <div className="text-blue-400 text-sm font-semibold mb-1">Backend Logic</div>
            <div className="text-foreground text-lg font-bold">Cloud Functions</div>
            <div className="text-muted-foreground text-xs">Message processing, webhooks</div>
          </div>
          <div className="bg-card p-4 rounded-lg border-l-4 border-green-500">
            <div className="text-green-400 text-sm font-semibold mb-1">Database</div>
            <div className="text-foreground text-lg font-bold">Cloud Firestore</div>
            <div className="text-muted-foreground text-xs">Primary data store</div>
          </div>
          <div className="bg-card p-4 rounded-lg border-l-4 border-purple-500">
            <div className="text-purple-400 text-sm font-semibold mb-1">Scheduled Jobs</div>
            <div className="text-foreground text-lg font-bold">Cloud Scheduler</div>
            <div className="text-muted-foreground text-xs">EOD reports, trial checks</div>
          </div>
        </div>
      </div>
    )
  },
  firestore: {
    name: 'Firestore Data Structure',
    icon: Database,
    color: 'green',
    content: (
      <div className="space-y-4">
        <div className="bg-card p-4 rounded-lg">
          <h3 className="font-bold text-foreground mb-3">Root Collection: `shops`</h3>
          <pre className="text-xs text-green-400 bg-background p-3 rounded font-mono">
{`shops/{shopId}
{
  "shopName": "...",
  "ownerWhatsapp": "...",
  "plan": "trial" | "basic" | "pro",
  "trialEndsAt": "timestamp",
  "paidTill": "timestamp",
  "createdAt": "timestamp"
}`}
          </pre>
        </div>
        <div className="bg-card p-4 rounded-lg">
          <h3 className="font-bold text-foreground mb-3">Subcollection: `customers`</h3>
          <p className="text-sm text-muted-foreground mb-2">Key Insight: The customer's phone number is the document ID to prevent duplicates and allow for instant lookups.</p>
          <pre className="text-xs text-green-400 bg-background p-3 rounded font-mono">
{`shops/{shopId}/customers/{phone_number}
{
  "name": "Ravi",
  "phone": "9876543210",
  "totalUdhaar": 500,
  "segment": "new | regular | vip",
  "lastPurchaseAt": "timestamp",
  "createdAt": "timestamp"
}`}
          </pre>
        </div>
        <div className="bg-card p-4 rounded-lg">
          <h3 className="font-bold text-foreground mb-3">Subcollection: `ledger` (Transactions)</h3>
          <pre className="text-xs text-green-400 bg-background p-3 rounded font-mono">
{`shops/{shopId}/ledger/{entryId}
{
  "customerPhone": "9876543210",
  "amount": 500,
  "type": "credit | debit",
  "item": "chini",
  "source": "whatsapp | dashboard",
  "timestamp": "timestamp"
}`}
          </pre>
        </div>
      </div>
    )
  },
  functions: {
    name: 'Cloud Function Logic',
    icon: Zap,
    color: 'blue',
    content: (
      <div className="space-y-4">
        <div className="bg-card p-4 rounded-lg">
          <h3 className="font-bold text-foreground mb-3">WhatsApp Message Processing</h3>
          <p className="text-sm text-muted-foreground mb-2">This function is the core of the WhatsApp Munim. It parses incoming messages and triggers all subsequent database operations.</p>
          <div className="bg-secondary p-3 rounded border-l-4 border-blue-500">
            <p className="text-xs text-muted-foreground">Input: <code className="text-blue-400">"Ravi 500 udhaar chini"</code></p>
          </div>
          <pre className="text-xs text-muted-foreground bg-background p-3 rounded overflow-x-auto mt-3">
{`// Pseudo-code for the function logic
function onWhatsAppMessage(message) {
  // 1. Parse message with AI/regex
  parsed = parse(message.text);

  // 2. Check if customer exists (using phone as ID)
  customer = getCustomer(shopId, parsed.phone);

  if (!customer.exists) {
    createCustomer(shopId, parsed.phone, parsed.name);
  } else {
    updateCustomerTotals(shopId, parsed.phone, parsed.amount);
  }

  // 3. Create ledger entry for the transaction
  addLedgerEntry(shopId, parsed);

  // 4. Update inventory stock (if applicable)
  updateStock(shopId, parsed.item);

  // 5. Send confirmation receipt back to WhatsApp
  sendWhatsAppReceipt(shopId, parsed);
}`}
          </pre>
        </div>
        <div className="bg-card p-4 rounded-lg">
            <h3 className="font-bold text-foreground mb-3">Scheduled End-of-Day Summary</h3>
             <p className="text-sm text-muted-foreground mb-2">A Cloud Scheduler job triggers this function every night at 11:59 PM to send a daily report to the shop owner.</p>
             <div className="bg-secondary p-4 rounded-xl">
                 <p className="text-sm font-bold">📊 Aaj ka Hisab</p>
                 <p className="text-xs">Sales: ₹12,500</p>
                 <p className="text-xs">Udhaar: ₹3,200</p>
                 <p className="text-xs">Paid: ₹9,300</p>
             </div>
        </div>
      </div>
    )
  },
  dashboard: {
    name: 'Dashboard Logic',
    icon: LayoutDashboard,
    color: 'orange',
     content: (
        <div className="space-y-4">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-bold text-foreground mb-3">Single Source of Truth</h3>
            <p className="text-sm text-muted-foreground mb-4">The dashboard is a control panel that reads from the exact same Firestore data as the WhatsApp bot. This ensures there are never any sync issues. The dashboard provides a visual interface for the data that the WhatsApp Munim manages.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-secondary p-4 rounded-lg">
                    <p className="font-semibold text-foreground">Live Sales</p>
                    <p className="text-xs text-muted-foreground">Reads from the `ledger` collection.</p>
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                    <p className="font-semibold text-foreground">Customer Ledger</p>
                    <p className="text-xs text-muted-foreground">Combines `customers` and `ledger` data.</p>
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                    <p className="font-semibold text-foreground">Churn Alerts</p>
                    <p className="text-xs text-muted-foreground">Calculated from `lastPurchaseAt` in customer docs.</p>
                </div>
                 <div className="bg-secondary p-4 rounded-lg">
                    <p className="font-semibold text-foreground">Reports & Exports</p>
                    <p className="text-xs text-muted-foreground">Runs aggregations on Firestore collections.</p>
                </div>
            </div>
          </div>
        </div>
      )
  },
   security: {
      name: 'Security Rules',
      icon: Shield,
      color: 'red',
      content: (
        <div className="space-y-4">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-bold text-foreground mb-3">Multi-Tenant Data Isolation</h3>
            <p className="text-sm text-muted-foreground mb-2">The core of the SaaS security model is ensuring a shop owner can ONLY access their own data. This is enforced directly in the database with Firestore Security Rules.</p>
            <pre className="text-xs text-muted-foreground bg-background p-3 rounded overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Function to check if the user owns the shop
    function isOwner(shopId) {
      let shop = get(/databases/$(database)/documents/shops/$(shopId));
      return request.auth != null && request.auth.uid == shop.data.owner_id;
    }
    
    // Any authenticated user can create a shop, but they must be the owner
    match /shops/{shopId} {
      allow create: if request.auth != null && request.resource.data.owner_id == request.auth.uid;
      allow read, update, delete: if isOwner(shopId);

      // Rules for all subcollections (customers, ledger, inventory, etc.)
      // Only the owner of the parent shop can access these documents.
      match /{subcollection}/{docId} {
        allow read, write: if isOwner(shopId);
      }
    }
  }
}`}
            </pre>
          </div>
        </div>
      )
    },
    subscription: {
      name: 'Subscription Flow',
      icon: CreditCard,
      color: 'purple',
      content: (
        <div className="space-y-4">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-bold text-foreground mb-3">Automated Trial & Payment Cycle</h3>
            <p className="text-sm text-muted-foreground mb-4">The entire subscription lifecycle is automated, from onboarding to payment, primarily through WhatsApp.</p>
            <ol className="relative border-l border-border space-y-8 pl-8">
                <li className="flex flex-col">
                    <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-secondary rounded-full ring-8 ring-background">1</span>
                    <h4 className="font-semibold text-foreground">WhatsApp Onboarding</h4>
                    <p className="text-sm text-muted-foreground">A new user messages "Hi", a shop document is auto-created with `plan: "trial"` and `trialEndsAt: now + 14 days`.</p>
                </li>
                <li className="flex flex-col">
                    <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-secondary rounded-full ring-8 ring-background">2</span>
                    <h4 className="font-semibold text-foreground">Expiry Check</h4>
                    <p className="text-sm text-muted-foreground">A daily Cloud Scheduler job checks for shops whose trial has expired.</p>
                </li>
                <li className="flex flex-col">
                    <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-secondary rounded-full ring-8 ring-background">3</span>
                    <h4 className="font-semibold text-foreground">Payment Prompt</h4>
                    <p className="text-sm text-muted-foreground">The bot sends an automated WhatsApp message with a Razorpay payment link.</p>
                </li>
                 <li className="flex flex-col">
                    <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-secondary rounded-full ring-8 ring-background">4</span>
                    <h4 className="font-semibold text-foreground">Payment Webhook</h4>
                    <p className="text-sm text-muted-foreground">A successful Razorpay payment triggers a webhook to a Cloud Function, which updates the shop document to `plan: "basic"` and sets the `paidTill` date.</p>
                </li>
            </ol>
          </div>
        </div>
      )
    },
};

export default function FirebaseStudioArchitecture() {
  const [activeService, setActiveService] = useState('overview');
  const ServiceIcon = services[activeService as keyof typeof services].icon;

  const getIconColor = (color: string) => {
    if (color === 'primary') return 'text-primary';
    if (color === 'green') return 'text-green-400';
    if (color === 'blue') return 'text-blue-400';
    if (color === 'purple') return 'text-purple-400';
    if (color === 'red') return 'text-red-400';
    if (color === 'orange') return 'text-orange-400';
    return 'text-primary';
  }

  return (
    <div className="bg-background min-h-screen font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tighter">
            DukaanMitra Technical Architecture
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            A WhatsApp-Native, Firebase-Powered SaaS for India's Kiranas
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4">
            <div className="sticky top-8 bg-card/50 p-4 rounded-xl border border-border">
              <nav className="space-y-2">
                {Object.entries(services).map(([key, { name, icon: Icon, color }]) => (
                  <button
                    key={key}
                    onClick={() => setActiveService(key)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all text-sm font-semibold
                      ${activeService === key ? 'bg-secondary text-foreground shadow-md' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}
                  >
                    <Icon className={`w-5 h-5 ${getIconColor(color)}`} />
                    <span>{name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="w-full md:w-3/4">
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className={`bg-gradient-to-br from-primary/80 to-primary/60 p-3 rounded-xl`}>
                   <ServiceIcon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">{services[activeService as keyof typeof services].name}</h2>
              </div>
              <div className="prose prose-invert max-w-none">
                 {services[activeService as keyof typeof services].content}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
