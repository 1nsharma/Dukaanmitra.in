
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileClock, Users } from 'lucide-react';
import DashboardStatCards from './dashboard-stat-cards';
import BusinessesTable from '../businesses/businesses-table';
import RecentActivity from './recent-activity';
import PlanDistributionChart from './plan-distribution-chart';
import RevenueGrowthChart from './revenue-growth-chart';

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
                <CardTitle>Platform Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <PlanDistributionChart />
                  <RevenueGrowthChart />
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileClock /> Recent System Activity</CardTitle>
                     <CardDescription>A log of important admin actions and system events.</CardDescription>
                </CardHeader>
                <CardContent>
                    <RecentActivity />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
