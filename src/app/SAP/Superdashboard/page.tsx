
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, FileClock, PieChart, TrendingUp, Users } from 'lucide-react';
import DashboardStatCards from './dashboard-stat-cards';
import BusinessesTable from '../businesses/businesses-table';

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Super Dashboard</h1>
      
      <DashboardStatCards />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users /> Recently Active Businesses</CardTitle>
                    <CardDescription>A live view of all businesses on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <BusinessesTable />
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><PieChart /> Plan Distribution</CardTitle>
                 <CardDescription>Mock data showing plan distribution.</CardDescription>
              </CardHeader>
              <CardContent>
                   <p className="text-muted-foreground">A live chart showing the distribution of subscription plans (Free, Basic, Pro) across all shops will be built here.</p>
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileClock /> Recent System Activity</CardTitle>
                     <CardDescription>This requires the 'logs' collection to be populated with admin actions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">A live activity log will be displayed here, showing new sign-ups, upgrades, payments, and admin actions.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
