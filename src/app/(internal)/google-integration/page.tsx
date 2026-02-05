'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KeyRound, Sheet, Mail, PenSquare, ArrowRight, Library, CheckCircle } from 'lucide-react';

const StepCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
    <div className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border">
        <div className="text-primary">{icon}</div>
        <div>
            <h3 className="font-bold text-foreground text-lg">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    </div>
);

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-muted p-4 rounded-lg text-xs text-muted-foreground font-mono overflow-x-auto">
        <code>{children}</code>
    </pre>
);

export default function GoogleIntegrationPage() {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
    };

  return (
    <div className="container py-16 md:py-24">
      <header className="text-center mb-16">
        <h1 className="font-headline text-4xl md:text-6xl font-black tracking-tighter">
          Google Services Integration
        </h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
          A blueprint for securely connecting DukaanMitra to Google Sheets, Gmail, and Blogger APIs.
        </p>
      </header>

      <div className="space-y-16">
        {/* Authentication Section */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3"><KeyRound /> Core Requirement: Authentication</h2>
            <p className="mt-2 text-muted-foreground">Before we can write any code, we need to securely authenticate with Google using OAuth 2.0. This is a manual step you must perform.</p>
          </div>
          <Card className="max-w-4xl mx-auto bg-secondary/50 border-primary/20">
            <CardHeader>
              <CardTitle>OAuth 2.0 Credential Setup</CardTitle>
              <CardDescription>
                Follow these steps in your Google Cloud Console to get the necessary credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <ol className="space-y-4 text-sm">
                    <li className="flex gap-4"><span className="font-bold text-primary">1.</span><span>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a> and select your project.</span></li>
                    <li className="flex gap-4"><span className="font-bold text-primary">2.</span><span>Navigate to "APIs & Services" {'>'} "Credentials".</span></li>
                    <li className="flex gap-4"><span className="font-bold text-primary">3.</span><span>Click "Create Credentials" and choose "OAuth client ID".</span></li>
                    <li className="flex gap-4"><span className="font-bold text-primary">4.</span><span>Select "Web application" as the application type.</span></li>
                    <li className="flex gap-4"><span className="font-bold text-primary">5.</span><span>Add an "Authorized redirect URI". For development, this is typically `http://localhost:3000/api/auth/google/callback`.</span></li>
                    <li className="flex gap-4"><span className="font-bold text-primary">6.</span><span>Click "Create" and copy your Client ID and Client Secret.</span></li>
                </ol>
                <div className="space-y-4 rounded-lg border border-border bg-background p-4">
                    <h4 className="font-semibold">Add these values to your `.env` file:</h4>
                    <CodeBlock>
                        {`GOOGLE_CLIENT_ID="YOUR_CLIENT_ID_HERE"\nGOOGLE_CLIENT_SECRET="YOUR_CLIENT_SECRET_HERE"\nGOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"`}
                    </CodeBlock>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard('GOOGLE_CLIENT_ID=""\nGOOGLE_CLIENT_SECRET=""\nGOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"')}>Copy Vars</Button>
                </div>
            </CardContent>
          </Card>
        </section>

        {/* NPM Package Section */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3"><Library /> NPM Package Requirement</h2>
            <p className="mt-2 text-muted-foreground">We need the official Google APIs client library.</p>
          </div>
          <div className="text-center">
            <p className="font-mono bg-muted text-muted-foreground p-3 rounded-md inline-block">npm install googleapis</p>
            <p className="text-sm text-green-500 flex items-center justify-center gap-2 mt-2"><CheckCircle size={16}/> This has already been added to your `package.json`.</p>
          </div>
        </section>


        {/* Integration Plan */}
        <section>
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-bold tracking-tight">Integration Plan</h2>
                <p className="mt-2 text-muted-foreground">Here’s how we’ll integrate each service once authentication is configured.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <StepCard title="Gmail API Integration" description="Replace the existing Mailgun service for sending contact form emails, using the user's authenticated account." icon={<Mail size={24} />} />
                <StepCard title="Google Sheets API Integration" description="Allow users to export their ledger and customer data directly into a new Google Sheet for analysis." icon={<Sheet size={24} />} />
                <StepCard title="Blogger API Integration" description="Enable syncing of blog posts from the Firestore database to a personal Blogger blog, creating a seamless content pipeline." icon={<PenSquare size={24} />} />
            </div>
        </section>
      </div>
    </div>
  );
}