
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageSquare } from "lucide-react";

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
            <Alert>
              <MessageSquare className="h-4 w-4" />
              <AlertTitle>Under Construction</AlertTitle>
              <AlertDescription>
                A powerful, searchable interface for all messages in the `/interactions` collection will be built here. It will allow filtering by shop ID, customer phone number, and message content to aid in debugging and support.
              </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
