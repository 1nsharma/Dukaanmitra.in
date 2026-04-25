
import DashboardStatCards from "./dashboard-stat-cards";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, ShieldCheck, Zap, Bot, Database, MessageSquare } from "lucide-react";
import Link from "next/link";

/**
 * FOUNDER COMMAND PANEL (Minimal)
 * Optimized for the 10-shop pilot phase.
 */
export default function SuperDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black font-headline uppercase tracking-tighter">Founder Command</h1>
          <p className="text-muted-foreground mt-1">Market Deployment Phase: Target 10 Shops</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">
            <Zap size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Pilot Mode: Active</span>
        </div>
      </div>

      <DashboardStatCards />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="text-primary h-5 w-5" />
                    Operational Health
                </CardTitle>
                <CardDescription>Live metrics for the current pilot.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-xl border space-y-1">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Parser Success</p>
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-sm">Deterministic</span>
                            <span className="text-lg font-black text-success">94%</span>
                        </div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl border space-y-1">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Parser Fallback</p>
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-sm">AI Agent</span>
                            <span className="text-lg font-black text-primary">6%</span>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-dashed">
                    <Button className="w-full font-black uppercase tracking-widest h-12" variant="outline" asChild>
                        <Link href="/SAP/messages">
                            <MessageSquare className="mr-2 h-4 w-4"/>
                            Verify All Messages
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20 flex flex-col justify-between">
            <CardHeader>
                <CardTitle className="text-primary uppercase tracking-tighter">Pilot Checklist</CardTitle>
                <CardDescription>Founder actions for 14-day deployment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-background rounded-lg border text-sm">
                    <CheckCircle className="text-success h-4 w-4"/>
                    <span>90-Day Auto-Trial Enabled</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background rounded-lg border text-sm">
                    <CheckCircle className="text-success h-4 w-4"/>
                    <span>WhatsApp Webhook Hardened</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background rounded-lg border text-sm">
                    <div className="h-4 w-4 rounded-full border-2 border-primary animate-pulse"/>
                    <span>Onboarding 1st Real Shop</span>
                </div>
            </CardContent>
            <div className="p-6 bg-primary/10 border-t border-primary/10">
                <p className="text-[10px] font-bold text-center uppercase tracking-widest text-primary">
                    Zero Expansion Policy: Hard Freeze in Effect
                </p>
            </div>
        </Card>
      </div>
    </div>
  );
}

const CheckCircle = ({ className, size = 16 }: { className?: string, size?: number }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} 
        viewBox="0 0 24 24" fill="none" stroke="currentColor" 
        strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
        className={className}
    >
        <path d="M20 6 9 17l-5-5"/>
    </svg>
);

const Button = ({ children, className, variant = "default", asChild }: any) => {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 px-4 py-2";
    const variants: any = {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
    };
    const Comp = asChild ? "div" : "button";
    return <div className={`${base} ${variants[variant]} ${className}`}>{children}</div>;
};
