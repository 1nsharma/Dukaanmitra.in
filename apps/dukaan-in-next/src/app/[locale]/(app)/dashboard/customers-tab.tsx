
"use client";

import { useState } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { Loader2, PlusCircle, Download, Users } from "lucide-react";
import { format, parseISO } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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

const renderCustomerStatus = (status?: string) => {
    switch (status) {
      case 'new': return <Badge variant="secondary">New</Badge>;
      case 'regular': return <Badge className="bg-blue-500/10 text-blue-500">Regular</Badge>;
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
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <CardTitle>Customers</CardTitle>
          <CardDescription>Manage your shop's customers. New customers are added automatically from WhatsApp.</CardDescription>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" onClick={handleExport} disabled={!customers || customers.length === 0} className="w-full md:w-auto">
                <Download className="mr-2" />
                Export CSV
            </Button>
            <Dialog open={isAddCustomerOpen} onOpenChange={setAddCustomerOpen}>
            <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
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
        {isLoading && <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        
        {!isLoading && !customers?.length && (
          <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-4">
            <Users className="w-16 h-16 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold text-foreground">No Customers Found</h3>
            <p className="max-w-md">New customers are added automatically from WhatsApp, or you can add them manually using the button above.</p>
          </div>
        )}
        
        {!isLoading && customers && customers.length > 0 && (
            <>
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {customers.map((customer) => (
                    <Card key={customer.phone} className="w-full">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-base">{customer.name}</CardTitle>
                                    <CardDescription>{customer.phone}</CardDescription>
                                </div>
                                {renderCustomerStatus(customer.status)}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Last Visit</span>
                                <span>{formatDate(customer.last_visit)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Total Udhaar</span>
                                <span className="font-bold text-base">{`₹${(customer.totalUdhaar || 0).toFixed(2)}`}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block border rounded-md">
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
