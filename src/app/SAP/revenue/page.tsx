
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
            <p className="text-muted-foreground">A detailed financial dashboard will be built here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
