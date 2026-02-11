
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, FileClock, PieChart, TrendingUp } from 'lucide-react';
import DashboardStatCards from './dashboard-stat-cards';

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Super Dashboard</h1>
      
      <DashboardStatCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp /> Revenue Growth</CardTitle>
            <CardDescription>Mock data showing revenue trends.</CardDescription>
          </CardHeader>
          <CardContent>
              <p className="text-muted-foreground">A live revenue chart will be built here, fetching aggregated data from all shops.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PieChart /> Plan Distribution</CardTitle>
             <CardDescription>Mock data showing plan distribution.</CardDescription>
          </CardHeader>
          <CardContent>
               <p className="text-muted-foreground">A live chart showing the distribution of subscription plans across all shops will be built here.</p>
          </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileClock /> Recent Activity</CardTitle>
                 <CardDescription>This requires a logging service to be built to populate the 'logs' collection.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">A live activity log will be displayed here, showing new sign-ups, upgrades, payments, and system alerts.</p>
            </CardContent>
        </Card>
    </div>
  );
}
