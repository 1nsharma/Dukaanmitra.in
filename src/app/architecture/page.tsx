'use client';

import React, { useState } from 'react';
import { Cloud, Database, Zap, Brain, Server, Code } from 'lucide-react';

const services = {
  overview: {
    name: 'Architecture Overview',
    icon: Cloud,
    color: 'primary',
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-primary/80 to-primary/60 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-primary-foreground mb-2">100% Google Cloud Stack</h2>
          <p className="text-primary-foreground/80">Firebase Studio + Cloud Functions + Vertex AI + Cloud Run</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border-l-4 border-primary">
            <div className="text-primary text-sm font-semibold mb-1">Frontend</div>
            <div className="text-foreground text-lg font-bold">Firebase Hosting</div>
            <div className="text-muted-foreground text-xs">Next.js deployed</div>
          </div>
          <div className="bg-card p-4 rounded-lg border-l-4 border-blue-500">
            <div className="text-blue-400 text-sm font-semibold mb-1">Backend</div>
            <div className="text-foreground text-lg font-bold">Cloud Functions</div>
            <div className="text-muted-foreground text-xs">Serverless Python</div>
          </div>
          <div className="bg-card p-4 rounded-lg border-l-4 border-green-500">
            <div className="text-green-400 text-sm font-semibold mb-1">Database</div>
            <div className="text-foreground text-lg font-bold">Firestore + Cloud SQL</div>
            <div className="text-muted-foreground text-xs">Hybrid approach</div>
          </div>
          <div className="bg-card p-4 rounded-lg border-l-4 border-purple-500">
            <div className="text-purple-400 text-sm font-semibold mb-1">AI</div>
            <div className="text-foreground text-lg font-bold">Vertex AI</div>
            <div className="text-muted-foreground text-xs">Gemini + PaLM</div>
          </div>
        </div>
      </div>
    )
  },
  firestore: {
    name: 'Firestore Database',
    icon: Database,
    color: 'green',
    content: (
      <div className="space-y-4">
        <div className="bg-card p-4 rounded-lg">
          <h3 className="font-bold text-foreground mb-3">Firestore Collections Structure</h3>
          <pre className="text-xs text-green-400 bg-background p-3 rounded overflow-x-auto font-mono">
{`businesses/
{businessId}/
  ├── profile
  │   ├── name: "Sharma Cafe"
  │   ├── type: "restaurant"
  │   ├── plan: "pro"
  │   ├── phone: "+919876543210"
  │   └── createdAt: timestamp
  │
  ├── customers/ (subcollection)
  │   ├── {customerId}/
  │   │   ├── name: "Rohit Kumar"
  │   │   ├── phone: "+919876543210"
  │   │   ├── visitCount: 5
  │   │   ├── totalSpend: 4500
  │   │   ├── lastVisit: timestamp
  │   │   ├── status: "vip"
  │   │   ├── tags: ["frequent", "vip"]
  │   │   └── preferences: {...}
  │
  ├── bills/ (subcollection)
  │   ├── {billId}/
  │   │   ├── customerId: ref
  │   │   ├── amount: 450
  │   │   ├── items: [{...}]
  │   │   ├── paymentMethod: "upi"
  │   │   └── createdAt: timestamp`}
          </pre>
        </div>
        <div className="bg-card p-4 rounded-lg">
          <h3 className="font-bold text-foreground mb-3">Firestore Security Rules</h3>
          <pre className="text-xs text-muted-foreground bg-background p-3 rounded overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {
  
  function isAuthenticated() {
    return request.auth != null;
  }
  
  function isBusinessOwner(businessId) {
    return isAuthenticated() && 
           request.auth.uid == businessId;
  }
  
  match /businesses/{businessId} {
    allow read, write: if isBusinessOwner(businessId);
    
    match /customers/{customerId} {
      allow read, create, update, delete: if isBusinessOwner(businessId);
    }
    
    match /bills/{billId} {
      allow read, create: if isBusinessOwner(businessId);
      allow update, delete: if false;
    }
  }
}
}`}
          </pre>
        </div>
      </div>
    )
  },
  functions: {
    name: 'Cloud Functions',
    icon: Zap,
    color: 'blue',
    content: (
      <div className="space-y-4">
        <div className="bg-card p-4 rounded-lg">
          <h3 className="font-bold text-foreground mb-3">Cloud Functions Architecture (Gen 2)</h3>
          <div className="space-y-3">
            <div className="bg-secondary p-3 rounded border-l-4 border-blue-500">
              <div className="text-blue-400 font-semibold mb-2">HTTP Functions (API Endpoints)</div>
            </div>
            <div className="bg-secondary p-3 rounded border-l-4 border-purple-500">
              <div className="text-purple-400 font-semibold mb-2">Firestore Triggers</div>
            </div>
            <div className="bg-secondary p-3 rounded border-l-4 border-green-500">
              <div className="text-green-400 font-semibold mb-2">Scheduled Functions</div>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg">
          <h3 className="font-bold text-foreground mb-3">Function Code Example</h3>
          <pre className="text-xs text-muted-foreground bg-background p-3 rounded overflow-x-auto">
{`# functions/main.py
from firebase_functions import https_fn, firestore_fn
from firebase_admin import initialize_app, firestore

initialize_app()

@https_fn.on_request()
def add_customer(req: https_fn.Request) -> https_fn.Response:
    # ... implementation
    return https_fn.Response("Customer added")

@firestore_fn.on_document_created("businesses/{bId}/customers/{cId}")
def on_customer_created(event: firestore_fn.Event) -> None:
    # ... implementation
    print(f"New customer created for business {event.params['bId']}")`}
          </pre>
        </div>
      </div>
    )
  },
  vertexai: {
    name: 'Vertex AI (Gemini)',
    icon: Brain,
    color: 'purple',
    content: (
       <div className="space-y-4">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-bold text-foreground mb-3">Message Generation with Gemini</h3>
            <pre className="text-xs text-muted-foreground bg-background p-3 rounded overflow-x-auto">
{`# functions/ai_engine.py
from vertexai.preview.generative_models import GenerativeModel

def generate_welcome_message(customer_name, business_type):
    model = GenerativeModel("gemini-pro")
    prompt = f"""Generate a warm Hinglish welcome message for:
    Name: {customer_name}
    Business type: {business_type}"""
    
    response = model.generate_content(prompt)
    return response.text.strip()`}
            </pre>
          </div>
        </div>
    )
  },
  cloudrun: {
    name: 'Cloud Run APIs',
    icon: Server,
    color: 'cyan',
     content: (
        <div className="space-y-4">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-bold text-foreground mb-3">When to Use Cloud Run vs Cloud Functions</h3>
             <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-900/30 border border-blue-500 p-3 rounded">
                <div className="text-blue-400 font-semibold mb-2">Cloud Functions</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>✓ Simple CRUD operations</div>
                  <div>✓ Firestore triggers</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 border border-cyan-500 p-3 rounded">
                <div className="text-cyan-400 font-semibold mb-2">Cloud Run</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>✓ Complex FastAPI app</div>
                  <div>✓ Long-running processes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
  },
   setup: {
      name: 'Complete Setup Guide',
      icon: Code,
      color: 'orange',
      content: (
        <div className="space-y-4">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-bold text-foreground mb-3">Step-by-Step Firebase Studio Setup</h3>
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
    if (color === 'cyan') return 'text-cyan-400';
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
            A 100% Google Cloud Stack for a Scalable SaaS
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
