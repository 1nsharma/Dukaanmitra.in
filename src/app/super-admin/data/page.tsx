
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DataExplorerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Data Explorer</h1>
      <Card>
        <CardHeader>
          <CardTitle>Firestore Data Explorer</CardTitle>
          <CardDescription>A read-only view of your live Firestore data. Proceed with caution.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">A read-only data explorer for all collections will be built here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
