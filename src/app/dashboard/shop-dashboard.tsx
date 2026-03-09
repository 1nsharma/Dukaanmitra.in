
"use client";

import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Loader2, Store, Users, Receipt, LineChart, Zap, Home, BrainCircuit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ShopDetails from "./shop-details";
import CustomersTab from "./customers-tab";
import LedgerTab from "./ledger-tab";
import type { Shop } from '@/docs/backend-types';
import AnalyticsTab from "./analytics-tab";
import AutomationTab from "./automation-tab";
import InsightsTab from "./insights-tab";

interface ShopDashboardProps {
  shopId: string;
}

export default function ShopDashboard({ shopId }: ShopDashboardProps) {
  const firestore = useFirestore();

  const shopRef = useMemoFirebase(() => {
    if (!shopId || !firestore) return null;
    return doc(firestore, "shops", shopId);
  }, [firestore, shopId]);

  const { data: shop, isLoading } = useDoc<Shop>(shopRef);

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>;
  if (!shop) return <Card><CardHeader><CardTitle>Shop Not Found</CardTitle></CardHeader></Card>;

  return (
    <Tabs defaultValue="home" className="w-full">
      <TabsList className="grid w-full grid-cols-6 h-16 bg-muted/50 p-1 rounded-2xl mb-8">
        <TabsTrigger value="home" className="rounded-xl"><Home className="h-4 w-4" /></TabsTrigger>
        <TabsTrigger value="insights" className="rounded-xl"><BrainCircuit className="h-4 w-4" /></TabsTrigger>
        <TabsTrigger value="customers" className="rounded-xl"><Users className="h-4 w-4" /></TabsTrigger>
        <TabsTrigger value="ledger" className="rounded-xl"><Receipt className="h-4 w-4" /></TabsTrigger>
        <TabsTrigger value="automation" className="rounded-xl"><Zap className="h-4 w-4" /></TabsTrigger>
        <TabsTrigger value="details" className="rounded-xl"><Store className="h-4 w-4" /></TabsTrigger>
      </TabsList>
      
      <TabsContent value="home"><AnalyticsTab shopId={shopId} /></TabsContent>
      <TabsContent value="insights"><InsightsTab shopId={shopId} /></TabsContent>
      <TabsContent value="customers"><CustomersTab shopId={shopId} /></TabsContent>
      <TabsContent value="ledger"><LedgerTab shopId={shopId} /></TabsContent>
      <TabsContent value="automation"><AutomationTab shopId={shopId} /></TabsContent>
      <TabsContent value="details"><ShopDetails shop={shop} /></TabsContent>
    </Tabs>
  );
}
