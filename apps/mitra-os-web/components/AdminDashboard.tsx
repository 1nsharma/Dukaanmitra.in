import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import {
  LayoutDashboard,
  Store,
  TrendingUp,
  Search,
  MoreVertical,
  ShieldCheck,
  ArrowUpRight,
  IndianRupee,
} from "lucide-react";
import { BarChart, Bar, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { StatWidget } from "./ui/StatWidget";

interface StoreData {
  id: string;
  name: string;
  ownerUid: string;
  whatsappNumber: string;
  totalSales: number;
  totalUdhaar: number;
  createdAt: unknown;
}

export const AdminDashboard: React.FC = () => {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storesRef = collection(db, "stores");
    const q = query(storesRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let storesList = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as StoreData,
      );

      // Memory sort to avoid missing index errors
      storesList.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });

      // Add dummy data if completely empty so admin dashboard doesn't look blank
      if (storesList.length === 0) {
        storesList = [
          {
            id: "dummy-1",
            name: "Ramesh Inventory Business",
            ownerUid: "1",
            whatsappNumber: "+91 98765 00001",
            totalSales: 45000,
            totalUdhaar: 12000,
            createdAt: null,
          },
          {
            id: "dummy-2",
            name: "Suresh Supermart",
            ownerUid: "2",
            whatsappNumber: "+91 98765 00002",
            totalSales: 89000,
            totalUdhaar: 5500,
            createdAt: null,
          },
          {
            id: "dummy-3",
            name: "Gupta General Store",
            ownerUid: "3",
            whatsappNumber: "+91 98765 00003",
            totalSales: 120500,
            totalUdhaar: 0,
            createdAt: null,
          },
          {
            id: "dummy-4",
            name: "Sharma Daily Needs",
            ownerUid: "4",
            whatsappNumber: "+91 98765 00004",
            totalSales: 32000,
            totalUdhaar: 18000,
            createdAt: null,
          },
        ];
      }

      setStores(storesList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const totalSales = stores.reduce((acc, s) => acc + (s.totalSales || 0), 0);
  const totalUdhaar = stores.reduce((acc, s) => acc + (s.totalUdhaar || 0), 0);

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.whatsappNumber.includes(searchTerm),
  );

  const chartData = stores.slice(0, 5).map((s) => ({
    name: s.name,
    sales: s.totalSales || 0,
    udhaar: s.totalUdhaar || 0,
  }));

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading Admin Dashboard...
      </div>
    );

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Super Admin
            </h1>
            <p className="text-gray-500 font-medium">
              DukaanMitra Platform Overview
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <LayoutDashboard size={20} />
          </div>
          <span className="font-bold text-gray-700 pr-4">Dashboard</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatWidget
          label="Total Stores"
          value={stores.length}
          icon={<Store size={24} />}
          color="indigo"
          trend={{ value: 12, isUp: true }}
        />
        <StatWidget
          label="Platform Sales"
          value={`₹${totalSales.toLocaleString()}`}
          icon={<TrendingUp size={24} />}
          color="emerald"
        />
        <StatWidget
          label="Active Udhaar"
          value={`₹${totalUdhaar.toLocaleString()}`}
          icon={<IndianRupee size={24} />}
          color="rose"
        />
        <StatWidget
          label="Avg. Store Sales"
          value={`₹${Math.round(totalSales / (stores.length || 1)).toLocaleString()}`}
          icon={<ArrowUpRight size={24} />}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Stores List */}
        <Card className="lg:col-span-2 p-0 flex flex-col overflow-hidden">
          <Card.Header className="flex-row items-center justify-between p-8 border-b border-slate-50 bg-slate-50/50">
            <Card.Title>Active Stores</Card.Title>
            <div className="w-72">
              <Input
                placeholder="Search stores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search size={18} />}
                className="bg-white border-2 border-slate-100"
              />
            </div>
          </Card.Header>
          <div className="overflow-x-auto flex-1">
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                    <th className="px-8 py-5">Store Name</th>
                    <th className="px-8 py-5">WhatsApp</th>
                    <th className="px-8 py-5 text-right">Sales</th>
                    <th className="px-8 py-5 text-right">Udhaar</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStores.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner italic">
                            {s.name[0]}
                          </div>
                          <span className="font-black text-slate-900 italic tracking-tight">
                            {s.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-500 font-bold italic opacity-70 underline decoration-indigo-200">
                        {s.whatsappNumber}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-sm font-black text-slate-900 italic tracking-tighter">
                          ₹{s.totalSales?.toLocaleString() || 0}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-sm font-black text-rose-600 italic tracking-tighter">
                          ₹{s.totalUdhaar?.toLocaleString() || 0}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                          Active
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10"
                        >
                          <MoreVertical size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Platform Insights */}
        <div className="space-y-8 h-full flex flex-col">
          <Card className="flex-1 space-y-10">
            <Card.Title>Platform Insights</Card.Title>

            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">
                  <span>Sales Growth</span>
                  <span className="text-emerald-500 font-black">+24%</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                  <div className="h-full bg-indigo-600 w-[74%] rounded-full shadow-lg shadow-indigo-100" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">
                  <span>Udhaar Recovery</span>
                  <span className="text-rose-500 font-black">-12%</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                  <div className="h-full bg-emerald-500 w-[42%] rounded-full shadow-lg shadow-emerald-100" />
                </div>
              </div>
            </div>

            <div className="h-64 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar dataKey="sales" fill="#4f46e5" radius={[12, 12, 0, 0]} />
                  <Bar
                    dataKey="udhaar"
                    fill="#e11d48"
                    radius={[12, 12, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <Card className="bg-indigo-600 text-white border-none shadow-2xl relative overflow-hidden group p-8 -mx-2 mb-2">
              <div className="relative z-10 space-y-3">
                <h4 className="font-black text-xl italic tracking-tighter uppercase leading-none">
                  Munim AI v2.0
                </h4>
                <p className="text-xs text-indigo-50 font-bold italic leading-relaxed opacity-90">
                  Automatic voice-to-ledger parsing is now live for all stores.
                  High intent detected across Tier-2 cities.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-110 transition-transform duration-500" />
            </Card>
          </Card>
        </div>
      </div>
    </div>
  );
};
