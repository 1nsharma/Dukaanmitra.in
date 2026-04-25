
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SystemMetrics from "./system-metrics";

export default function SystemHealthPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Health</h1>
      <Card>
        <CardHeader>
          <CardTitle>Live System & Metrics Status</CardTitle>
          <CardDescription>Monitor the health and uptime of core services and application metrics. (Metrics are currently mock data)</CardDescription>
        </CardHeader>
        <CardContent>
            <SystemMetrics />
        </CardContent>
      </Card>
    </div>
  );
}
