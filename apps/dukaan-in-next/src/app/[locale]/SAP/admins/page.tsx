
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AdminsTable from "./admins-table";

export default function AdminControlPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Control</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Administrators</CardTitle>
          <CardDescription>View, manage, and demote administrators in the system. Super Admins cannot be modified.</CardDescription>
        </CardHeader>
        <CardContent>
            <AdminsTable />
        </CardContent>
      </Card>
    </div>
  );
}
