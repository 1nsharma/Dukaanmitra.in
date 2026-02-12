
'use client';

import { PieChart } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PlanDistributionChart() {
    // This component is a placeholder.
    // In the future, it will read data from the `/metrics/global` document,
    // which will contain fields like `plan_basic_count`, `plan_pro_count`, etc.
    // These fields will be updated by a Cloud Function on every subscription event.
    
    return (
        <Alert>
            <PieChart className="h-4 w-4" />
            <AlertTitle>Plan Distribution Chart</AlertTitle>
            <AlertDescription>
                A pie chart showing the real-time distribution of subscription plans (Trial, Basic, Pro) will be built here. This requires the backend metrics pipeline to be completed.
            </AlertDescription>
        </Alert>
    );
}
