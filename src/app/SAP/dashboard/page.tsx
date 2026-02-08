
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Shield, Database, HeartPulse, AlertTriangle, FileClock } from 'lucide-react';

const statCards = [
    { title: "Total Users", value: "1,254", icon: <Users /> },
    { title: "Total Admins", value: "12", icon: <UserCheck /> },
    { title: "Active (24h)", value: "348", icon: <HeartPulse className="text-green-400" /> },
    { title: "Disabled Users", value: "5", icon: <Users className="text-destructive"/> },
    { title: "Firestore Collections", value: "7", icon: <Database /> },
    { title: "Errors (24h)", value: "0", icon: <AlertTriangle className="text-green-400" /> },
    { title: "Rule Violations", value: "0", icon: <Shield className="text-green-400" /> },
]

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(card => (
            <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    <div className="text-muted-foreground">{card.icon}</div>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{card.value}</p>
                </CardContent>
            </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileClock /> Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Live activity log will be displayed here.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle /> Recent Errors</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Live error log will be displayed here.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
