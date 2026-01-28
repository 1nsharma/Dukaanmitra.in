"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BillsTabProps {
    shopId: string;
}

export default function BillsTab({ shopId }: BillsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bills</CardTitle>
        <CardDescription>Manage your shop's bills and transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Bill management is coming soon!</p>
      </CardContent>
    </Card>
  );
}
