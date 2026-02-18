
"use client";

import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Loader2, Store, Users, Receipt, LineChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ShopDetails from "./shop-details";
import CustomersTab from "./customers-tab";
import LedgerTab from "./ledger-tab";
import type { Shop } from '@/docs/backend-types';
import AnalyticsTab from "./analytics-tab";

interface ShopDashboardProps {
  shopId: string;
}

export default function ShopDashboard({ shopId }: ShopDashboardProps) {
  const firestore = useFirestore();

  const shopRef = useMemoFirebase(() => {
    if (!shopId) return null;
    return doc(firestore, "shops", shopId);
  }, [firestore, shopId]);

  const { data: shop, isLoading: isShopLoading } = useDoc<Shop>(shopRef);

  if (isShopLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!shop) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shop Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>We couldn't find the details for your shop. Please try again or contact support.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="details"><Store className="mr-2" /> Shop Details</TabsTrigger>
        <TabsTrigger value="customers"><Users className="mr-2" /> Customers</TabsTrigger>
        <TabsTrigger value="ledger"><Receipt className="mr-2" /> Ledger</TabsTrigger>
        <TabsTrigger value="analytics"><LineChart className="mr-2" /> Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <ShopDetails shop={shop} />
      </TabsContent>
      <TabsContent value="customers">
        <CustomersTab shopId={shopId} />
      </TabsContent>
      <TabsContent value="ledger">
        <LedgerTab shopId={shopId} />
      </TabsContent>
      <TabsContent value="analytics">
        <AnalyticsTab shopId={shopId} />
      </TabsContent>
    </Tabs>
  );
}
