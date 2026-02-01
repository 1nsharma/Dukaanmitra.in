
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LogsActivityPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Logs & Activity</h1>
      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
          <CardDescription>Monitor user activity, auth events, and system errors.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">A filterable log viewer will be built here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
