
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AuditLogsTable from "./audit-logs-table";

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Audit Logs</h1>
      <Card>
        <CardHeader>
          <CardTitle>System Audit Trail</CardTitle>
          <CardDescription>A complete, immutable log of all significant administrative actions performed in the system.</CardDescription>
        </CardHeader>
        <CardContent>
            <AuditLogsTable />
        </CardContent>
      </Card>
    </div>
  );
}
