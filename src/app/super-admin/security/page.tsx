import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SecurityCenterPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Security Center</h1>
      <Card>
        <CardHeader>
          <CardTitle>Security Overview</CardTitle>
          <CardDescription>View security rules, access matrices, and recent rule violations.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Security rule viewer and violation logs will be built here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
