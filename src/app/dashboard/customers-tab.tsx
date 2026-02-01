"use client";

import { useState } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { Loader2, PlusCircle, Download } from "lucide-react";
import { format, parseISO } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase, type WithId } from "@/firebase";
import type { Customer } from "@/docs/backend-types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddCustomerForm from "./add-customer-form";
import { Badge } from "@/components/ui/badge";

interface CustomersTabProps {
  shopId: string;
}

export default function CustomersTab({ shopId }: CustomersTabProps) {
  const firestore = useFirestore();
  const [isAddCustomerOpen, setAddCustomerOpen] = useState(false);

  const customersQuery = useMemoFirebase(() => {
    if (!shopId) return null;
    return query(
      collection(firestore, "shops", shopId, "customers"),
      orderBy("created_at", "desc")
    );
  }, [firestore, shopId]);

  const { data: customers, isLoading } = useCollection<Customer>(customersQuery);

  const renderCustomerStatus = (status?: string) => {
    switch (status) {
      case 'new': return <Badge variant="secondary">New</Badge>;
      case 'regular': return <Badge>Regular</Badge>;
      case 'vip': return <Badge className="border-transparent bg-accent text-accent-foreground shadow hover:bg-accent/80">VIP</Badge>;
      case 'churned': return <Badge variant="destructive">Churned</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  }

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    if (typeof date.toDate === 'function') {
      return format(date.toDate(), "PPP");
    }
    if(typeof date === 'string') {
        return format(parseISO(date as string), "PPP");
    }
    return 'Invalid Date';
  }

  const handleExport = () => {
    if (!customers) return;

    const headers = [
      "Phone", "Name", "Status", "Last Visit", "Total Spent (₹)", "Total Udhaar (₹)", "Visit Count"
    ];

    const csvRows = customers.map(customer => {
      const row = [
        customer.phone,
        customer.name || "",
        customer.status || "N/A",
        customer.last_visit ? formatDate(customer.last_visit) : "N/A",
        customer.total_spent || 0,
        customer.totalUdhaar || 0,
        customer.visit_count || 0
      ];
      return row.map(value => {
        const strValue = String(value ?? '');
        if (/[",\n\r]/.test(strValue)) {
          return `"${strValue.replace(/"/g, '""')}"`;
        }
        return strValue;
      }).join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `dukaanmitra-customers-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Customers</CardTitle>
          <CardDescription>Manage your shop's customers. New customers are added automatically from WhatsApp.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport} disabled={!customers || customers.length === 0}>
                <Download className="mr-2" />
                Export CSV
            </Button>
            <Dialog open={isAddCustomerOpen} onOpenChange={setAddCustomerOpen}>
            <DialogTrigger asChild>
                <Button>
                <PlusCircle className="mr-2" />
                Add Customer
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Add a New Customer Manually</DialogTitle>
                <DialogDescription>
                    Enter the details of the new customer to add them to your shop.
                </DialogDescription>
                </DialogHeader>
                <AddCustomerForm shopId={shopId} onFinished={() => setAddCustomerOpen(false)} />
            </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <Loader2 className="mx-auto my-12 h-8 w-8 animate-spin text-primary" />}
        {!isLoading && !customers?.length && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No customers found.</p>
            <p>Use the AI Quick Add in the Ledger tab to get started.</p>
          </div>
        )}
        {!isLoading && customers && customers.length > 0 && (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead className="text-right">Total Udhaar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.phone}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{renderCustomerStatus(customer.status)}</TableCell>
                    <TableCell>
                      {formatDate(customer.last_visit)}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {`₹${(customer.totalUdhaar || 0).toFixed(2)}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
