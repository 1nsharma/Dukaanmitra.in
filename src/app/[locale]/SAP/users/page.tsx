
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import UsersTable from "./users-table";

export default function UserManagementPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>All System Users</CardTitle>
          <CardDescription>View, manage, and assign roles to all users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
            <UsersTable />
        </CardContent>
      </Card>
    </div>
  );
}
