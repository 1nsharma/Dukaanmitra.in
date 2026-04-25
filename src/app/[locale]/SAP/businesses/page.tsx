
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import BusinessesTable from "./businesses-table";
import { Button } from "@/components/ui/button";
import { Download, Filter, Plus } from "lucide-react";

export default function BusinessesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Business Management</h1>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Businesses</CardTitle>
              <CardDescription>View, manage, and inspect all registered businesses on the platform.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                 <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Business
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <BusinessesTable />
        </CardContent>
      </Card>
    </div>
  );
}
