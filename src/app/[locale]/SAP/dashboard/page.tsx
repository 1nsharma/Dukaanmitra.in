
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, FileClock, PieChart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Overview</h1>
      
       <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle /> Dashboard Deprecated</CardTitle>
                <CardDescription>This dashboard is no longer in use.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>This view uses inefficient queries and has been replaced by the main <Link href="/SAP/Superdashboard" className="font-bold text-primary underline">Super Dashboard</Link>. Please use the main dashboard for all platform metrics.</p>
            </CardContent>
        </Card>
    </div>
  );
}
