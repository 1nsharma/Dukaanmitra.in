
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Message Logs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Global Message Explorer</CardTitle>
          <CardDescription>Search and view messages across all businesses for support and debugging.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">A global message log viewer will be built here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
