
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DollarSign } from "lucide-react";

export default function RevenuePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Revenue Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
          <CardDescription>Track MRR, churn, new revenue, and other key financial metrics.</CardDescription>
        </CardHeader>
        <CardContent>
            <Alert>
              <DollarSign className="h-4 w-4" />
              <AlertTitle>Under Construction</AlertTitle>
              <AlertDescription>
                This section will provide a detailed financial dashboard, including MRR movement charts, churn rate analysis, and a table of recent payments from the `/orders` collection. This depends on the completion of the backend metrics pipeline.
              </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
