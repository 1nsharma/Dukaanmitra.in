
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function GlobalSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Global Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>Manage global feature toggles, maintenance mode, and app-wide limits.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">A form for managing global application settings will be built here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
