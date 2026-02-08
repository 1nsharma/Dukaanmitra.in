
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GitBranch } from "lucide-react";

export default function GitControlPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Git Control Center</h1>
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><GitBranch className="text-destructive"/> Feature Deprecated</CardTitle>
          <CardDescription>This feature has been removed to improve system security and simplicity.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Direct Git repository management from the UI has been deprecated in favor of a more robust and secure, automated CI/CD pipeline (e.g., GitHub Actions). This change prevents security vulnerabilities and aligns with modern DevOps best practices.</p>
        </CardContent>
      </Card>
    </div>
  );
}
