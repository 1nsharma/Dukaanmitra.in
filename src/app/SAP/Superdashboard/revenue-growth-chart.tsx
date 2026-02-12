
'use client';

import { TrendingUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function RevenueGrowthChart() {
    // This component is a placeholder.
    // It will be powered by the `/metrics/daily/{YYYY-MM-DD}` collection.
    // A daily scheduled Cloud Function will aggregate revenue and write to this collection.
    // The frontend will then query the last 30-90 days to render a line chart.
    
    return (
        <Alert>
            <TrendingUp className="h-4 w-4" />
            <AlertTitle>Revenue Growth Chart</AlertTitle>
            <AlertDescription>
               A line chart visualizing daily or monthly revenue growth will be built here. This component will be powered by the `dailyMetrics` collection.
            </AlertDescription>
        </Alert>
    );
}
