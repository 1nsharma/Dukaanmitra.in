
import DashboardStatCards from "./dashboard-stat-cards";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, ShieldCheck, Zap, Bot, Database, History } from "lucide-react";
import Link from "next/link";

export default function SuperDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black font-headline uppercase tracking-tighter">Command Center</h1>
          <p className="text-muted-foreground mt-1">Platform-wide financial integrity and operational intelligence.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full border border-success/20">
            <ShieldCheck size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Global Integrity: Healthy</span>
        </div>
      </div>

      <DashboardStatCards />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="text-primary h-5 w-5" />
                    Infrastructure Health
                </CardTitle>
                <CardDescription>Live telemetry from the Event Store and AI Agents.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-xl border space-y-1">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Processing Path</p>
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 font-bold text-sm">
                                <Zap size={14} className="text-success"/> Logic
                            </span>
                            <span className="text-lg font-black">92%</span>
                        </div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl border space-y-1">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Processing Path</p>
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 font-bold text-sm">
                                <Bot size={14} className="text-primary"/> AI Fallback
                            </span>
                            <span className="text-lg font-black">8%</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-dashed">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">System Boundaries</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-card text-sm">
                            <span className="flex items-center gap-2"><Database size={14} /> Event Store</span>
                            <Badge className="bg-success/20 text-success border-success/30">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-card text-sm">
                            <span className="flex items-center gap-2"><History size={14} /> Hash Chaining</span>
                            <Badge className="bg-success/20 text-success border-success/30">Enabled</Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20 flex flex-col justify-between overflow-hidden">
            <CardHeader>
                <CardTitle className="text-primary uppercase tracking-tighter">Strategic Insights</CardTitle>
                <CardDescription>AI-driven platform optimization tips.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-3 bg-background rounded-lg border text-xs">
                    <p className="font-bold text-primary flex items-center gap-1"><Zap size={12}/> PERFORMANCE</p>
                    <p className="text-muted-foreground mt-1">Deterministic parsing is handling 92% of traffic. AI costs are down 84% this week.</p>
                </div>
                <div className="p-3 bg-background rounded-lg border text-xs">
                    <p className="font-bold text-accent flex items-center gap-1"><ShieldCheck size={12}/> REVENUE</p>
                    <p className="text-muted-foreground mt-1">Status lock is enforced for 12 expired trials. No financial leakage detected.</p>
                </div>
            </CardContent>
            <div className="p-6 bg-primary/10 border-t border-primary/10">
                <Button className="w-full font-black uppercase tracking-widest h-12" asChild>
                    <Link href="/SAP/messages">Go to Message Explorer</Link>
                </Button>
            </div>
        </Card>
      </div>
    </div>
  );
}

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${className}`}>
        {children}
    </span>
);
const Button = ({ children, className, asChild }: { children: React.ReactNode, className?: string, asChild?: boolean }) => (
    <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 py-2 ${className}`}>
        {children}
    </button>
);
