
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, FileClock } from 'lucide-react';
import DashboardStatCards from './dashboard-stat-cards';

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Overview</h1>
      
      <DashboardStatCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileClock /> Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Live activity log will be displayed here. This requires a logging service to be built to populate the 'logs' collection.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle /> Recent Errors</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Live error log will be displayed here. This requires error events to be written to the 'logs' collection.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
