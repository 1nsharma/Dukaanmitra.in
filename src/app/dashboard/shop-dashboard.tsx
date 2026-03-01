
"use client";

import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Loader2, Store, Users, Receipt, LineChart, Lightbulb } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ShopDetails from "./shop-details";
import CustomersTab from "./customers-tab";
import LedgerTab from "./ledger-tab";
import type { Shop } from '@/docs/backend-types';
import AnalyticsTab from "./analytics-tab";
import InsightsTab from "./insights-tab";

interface ShopDashboardProps {
  shopId: string;
}

export default function ShopDashboard({ shopId }: ShopDashboardProps) {
  const firestore = useFirestore();

  const shopRef = useMemoFirebase(() => {
    if (!shopId) return null;
    return doc(firestore, "shops", shopId);
  }, [firestore, shopId]);

  const { data: shop, isLoading } = useDoc<Shop>(shopRef);

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>;
  if (!shop) return <Card><CardHeader><CardTitle>Shop Not Found</CardTitle></CardHeader></Card>;

  return (
    <Tabs defaultValue="insights" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
        <TabsTrigger value="insights"><Lightbulb className="mr-2 h-4 w-4" /> Insights</TabsTrigger>
        <TabsTrigger value="ledger"><Receipt className="mr-2 h-4 w-4" /> Ledger</TabsTrigger>
        <TabsTrigger value="customers"><Users className="mr-2 h-4 w-4" /> Customers</TabsTrigger>
        <TabsTrigger value="analytics"><LineChart className="mr-2 h-4 w-4" /> Analytics</TabsTrigger>
        <TabsTrigger value="details"><Store className="mr-2 h-4 w-4" /> Shop Details</TabsTrigger>
      </TabsList>
      <TabsContent value="insights"><InsightsTab shopId={shopId} /></TabsContent>
      <TabsContent value="ledger"><LedgerTab shopId={shopId} /></TabsContent>
      <TabsContent value="customers"><CustomersTab shopId={shopId} /></TabsContent>
      <TabsContent value="analytics"><AnalyticsTab shopId={shopId} /></TabsContent>
      <TabsContent value="details"><ShopDetails shop={shop} /></TabsContent>
    </Tabs>
  );
}
