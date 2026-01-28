"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomersTabProps {
    shopId: string;
}

export default function CustomersTab({ shopId }: CustomersTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>Manage your shop's customers.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Customer management is coming soon!</p>
      </CardContent>
    </Card>
  );
}
