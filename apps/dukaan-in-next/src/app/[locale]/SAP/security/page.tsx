
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import RulesViewer from './rules-viewer';

export default function SecurityCenterPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Security Center</h1>
      <RulesViewer />
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Rule Violations</CardTitle>
          <CardDescription>Live log of denied requests from Firestore and Storage.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Violation logs will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
