import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  limit,
  onSnapshot,
  doc,
} from "firebase/firestore";
import {
  TrendingUp,
  Users,
  CreditCard,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  Bell,
  Sparkles,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { cn } from "../lib/utils";
import {
  generateAlertAction,
  generateMarketingContent,
  generateMarketingPoster,
} from "../services/geminiService";
import { Transaction, Customer as CustomerType } from "../types";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card } from "./ui/Card";
import { StatWidget } from "./ui/StatWidget";

interface StoreData {
  id: string;
  name: string;
  totalSales: number;
  totalUdhaar: number;
}

export const StoreDashboard: React.FC<{ storeId: string }> = ({ storeId }) => {
  const [store, setStore] = useState<StoreData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<
    "overview" | "live-desk" | "inventory" | "alerts" | "marketing" | "qr"
  >("overview");
  const [marketingType, setMarketingType] = useState("Festival Greeting");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<
    { item: string; status: string; confidence: number }[]
  >([]);

  const handleScanShelf = async () => {
    setIsScanning(true);
    setScanResults([]);
    // Simulate Edge-AI processing (ParallelDots/ODIN style)
    await new Promise((r) => setTimeout(r, 2000));
    setScanResults([
      {
        item: "Amul Gold 500ml",
        status: "Low Stock (2 remaining)",
        confidence: 0.98,
      },
      {
        item: "Britannia Marie Gold",
        status: "In Stock (12 remaining)",
        confidence: 0.95,
      },
      { item: "Tata Salt 1kg", status: "Out of Stock", confidence: 0.99 },
    ]);
    setIsScanning(false);
  };
  const [marketingDetails, setMarketingDetails] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedPoster, setGeneratedPoster] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosterGenerating, setIsPosterGenerating] = useState(false);
  const [qrShopName, setQrShopName] = useState("My Inventory Business");
  const [qrUpi, setQrUpi] = useState("shop@upi");
  const [selectedAlert, setSelectedAlert] = useState<{
    title: string;
    desc: string;
    count: number;
  } | null>(null);
  const [alertNudge, setAlertNudge] = useState("");
  const [isAlertProcessing, setIsAlertProcessing] = useState(false);
  const [triggeredAlerts, setTriggeredAlerts] = useState<Set<string>>(
    new Set(),
  );
  const [removingAlerts, setRemovingAlerts] = useState<Set<string>>(new Set());
  const [hiddenAlerts, setHiddenAlerts] = useState<Set<string>>(new Set());
  const [isBlasting, setIsBlasting] = useState(false);
  const [blastProgress, setBlastProgress] = useState(0);

  useEffect(() => {
    if (storeId === "demo-mode") {
      setStore({
        id: "demo-mode",
        name: "Amit's Supermart (Demo)",
        totalSales: 45200,
        totalUdhaar: 12500,
      });
      setTransactions([
        {
          id: "1",
          type: "sale",
          amount: 500,
          items: "2kg Sugar, Milk",
          date: "Just now",
          timestamp: 0,
          customerName: "",
          customerPhone: "",
        },
        {
          id: "2",
          type: "udhaar",
          amount: 1500,
          items: "Flour 10kg, Cooking Oil",
          date: "2 hours ago",
          timestamp: 0,
          customerName: "",
          customerPhone: "",
        },
        {
          id: "3",
          type: "payment",
          amount: 800,
          items: "Paid old udhaar",
          date: "Yesterday",
          timestamp: 0,
          customerName: "",
          customerPhone: "",
        },
      ]);
      setCustomers([
        {
          phone: "9876543210",
          name: "Ramesh Singh",
          totalLTV: 4500,
          balance: 2500,
          lastSeen: "",
        },
        {
          phone: "9876543211",
          name: "Suresh Kumar",
          totalLTV: 1500,
          balance: 1500,
          lastSeen: "",
        },
      ]);
      setLoading(false);
      return;
    }

    const storeRef = doc(db, "stores", storeId);
    const unsubscribeStore = onSnapshot(storeRef, (doc) => {
      if (doc.exists()) {
        setStore({ id: doc.id, ...doc.data() } as StoreData);
      }
    });

    const transactionsRef = collection(storeRef, "transactions");
    const qTransactions = query(transactionsRef, limit(10));
    const unsubscribeTransactions = onSnapshot(qTransactions, (snapshot) => {
      const txs = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Transaction,
      );
      // Memory sort to prevent index missing errors
      txs.sort((a, b) => b.timestamp - a.timestamp);
      setTransactions(txs);
      setLoading(false);
    });

    const customersRef = collection(storeRef, "customers");
    const qCustomers = query(customersRef, where("balance", ">", 0), limit(10));
    const unsubscribeCustomers = onSnapshot(qCustomers, (snapshot) => {
      const custs = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as unknown as CustomerType,
      );
      // Memory sort to prevent index missing errors
      custs.sort((a, b) => b.balance - a.balance);
      setCustomers(custs);
    });

    return () => {
      unsubscribeStore();
      unsubscribeTransactions();
      unsubscribeCustomers();
    };
  }, [storeId]);

  const handleAlertAction = async (
    title: string,
    desc: string,
    count: number,
  ) => {
    setSelectedAlert({ title, desc, count });
    setIsAlertProcessing(true);
    let nudge = "";
    if (storeId === "demo-mode") {
      await new Promise((r) => setTimeout(r, 1500));
      nudge =
        "Namaste Ramesh, aapka ₹2450 ka udhaar baki hai. Kripya aaj hi payment karein. DukaanMitra dwara bheja gaya sandesh.";
    } else {
      nudge = await generateAlertAction(title, desc);
    }
    setAlertNudge(nudge);
    setIsAlertProcessing(false);
  };

  const handleExecuteBlast = async () => {
    setIsBlasting(true);
    setBlastProgress(0);

    const interval = setInterval(() => {
      setBlastProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    await new Promise((r) => setTimeout(r, 2500));
    setIsBlasting(false);
    alert(
      `DukaanMitra Blast: Campaign successfully dispatched to ${selectedAlert?.count || 0} Grahaks!`,
    );
    if (selectedAlert) {
      const currentAlertTitle = selectedAlert.title;
      setTriggeredAlerts((prev) => new Set(prev).add(currentAlertTitle));
      setSelectedAlert(null);
      setTimeout(() => {
        setRemovingAlerts((prev) => new Set(prev).add(currentAlertTitle));
        setTimeout(() => {
          setHiddenAlerts((prev) => new Set(prev).add(currentAlertTitle));
        }, 500); // Wait for transition to complete
      }, 1000);
    }
  };

  const handleGenerateMarketing = async () => {
    setIsGenerating(true);
    if (storeId === "demo-mode") {
      await new Promise((r) => setTimeout(r, 1500));
      setGeneratedContent(
        "🎉 Festive Offer! 🎉 20% off on all dairy items this Sunday! Jaldi aaiye Amit's Supermart mein. 🏃‍♂️💨",
      );
    } else {
      const content = await generateMarketingContent(
        marketingType,
        marketingDetails,
      );
      setGeneratedContent(content);
    }
    setIsGenerating(false);
  };

  const handleGeneratePoster = async () => {
    setIsPosterGenerating(true);
    try {
      if (storeId === "demo-mode") {
        await new Promise((r) => setTimeout(r, 2000));
        setGeneratedPoster(
          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgMTIwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik00MDAgMzAwQTEwMCAxMDAgMCAwIDEgNTAwIDQwMEExMDAgMTAwIDAgMCAxIDQwMCA1MDBBMTAwIDEwMCAwIDAgMSA1MDAgMzAwWiIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjNlbSIgZmlsbD0iIzZiNzI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Qcm9tb3Rpb25hbCBQb3N0ZXI8L3RleHQ+PC9zdmc+",
        );
      } else {
        const poster = await generateMarketingPoster(
          `${marketingType}: ${marketingDetails}`,
        );
        setGeneratedPoster(poster);
      }
    } catch (e) {
      console.error("Poster gen failed", e);
    } finally {
      setIsPosterGenerating(false);
    }
  };

  const chartData = [
    { name: "Sales", value: store?.totalSales || 0, color: "#10b981" },
    { name: "Udhaar", value: store?.totalUdhaar || 0, color: "#ef4444" },
  ];

  const alerts = [
    {
      title: "Udhaar Recovery",
      icon: "💸",
      desc: "4 customers haven't paid in 15+ days. Recover ₹2,450.",
      count: 4,
      priority: "High",
    },
    {
      title: "Review Prompt",
      icon: "⭐",
      desc: "12 happy customers from yesterday. Ask for Google Reviews.",
      count: 12,
      priority: "Med",
    },
    {
      title: "Restock: Sugar",
      icon: "📦",
      desc: "Frequently logged in bills, but stock is low.",
      count: 1,
      priority: "Urgent",
    },
  ];

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Loading your Munim...</div>
    );

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{store?.name}</h1>
          <p className="text-gray-500">Aapka Digital Munim Dashboard</p>
        </div>
        <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full flex items-center gap-2 font-medium">
          <Clock size={18} />
          <span>Live Updates</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-gray-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === "overview" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("live-desk")}
          className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === "live-desk" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          Live Desk (WhatsApp)
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === "inventory" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          Inventory Scanner
        </button>
        <button
          onClick={() => setActiveTab("alerts")}
          className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === "alerts" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          <Bell size={16} />
          Smart Alerts
        </button>
        <button
          onClick={() => setActiveTab("marketing")}
          className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === "marketing" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          Marketing Hub
        </button>
        <button
          onClick={() => setActiveTab("qr")}
          className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === "qr" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          QR Assets
        </button>
      </div>

      {activeTab === "live-desk" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[700px] animate-in fade-in zoom-in duration-500">
          {/* Chat List */}
          <Card className="lg:col-span-1 p-0 flex flex-col overflow-hidden h-[400px] lg:h-auto">
            <div className="p-4 border-b bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-black uppercase text-xs tracking-widest leading-none">
                Active Channels
              </h3>
              <span className="bg-emerald-500 text-[8px] font-black px-1.5 py-0.5 rounded leading-none">
                4 LIVE
              </span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {[
                {
                  name: "Rahul (Customer)",
                  lastMsg: "Payment proof sent",
                  time: "2m",
                  status: "unread",
                  color: "indigo",
                },
                {
                  name: "Sunita (Order)",
                  lastMsg: "Add 2kg Sugar",
                  time: "15m",
                  status: "read",
                  color: "emerald",
                },
                {
                  name: "Aman (Udhaar)",
                  lastMsg: "Kitna baki hai?",
                  time: "1h",
                  status: "read",
                  color: "rose",
                },
              ].map((chat, i) => (
                <div
                  key={i}
                  className="p-4 hover:bg-slate-50 cursor-pointer flex gap-3 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full bg-${chat.color}-600 flex items-center justify-center text-white font-bold`}
                  >
                    {chat.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-slate-800 truncate">
                        {chat.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {chat.time} ago
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {chat.lastMsg}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Live Chat Interface */}
          <Card className="lg:col-span-2 p-0 flex flex-col overflow-hidden border-2 border-indigo-100 shadow-2xl relative">
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-emerald-600 hover:bg-emerald-700 h-8 px-3 text-[10px] text-white"
              >
                CONFIRM ORDER
              </Button>
              <Button
                size="sm"
                variant="primary"
                className="bg-indigo-600 h-8 px-3 text-[10px]"
              >
                PAYMENT LINK
              </Button>
            </div>
            <div className="p-4 border-b bg-white flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-900"></div>
              <div>
                <h3 className="font-black uppercase text-xs tracking-tight">
                  Rahul Khurana
                </h3>
                <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                  Mem0g Context: Prefers Amul Milk
                </p>
              </div>
            </div>
            <div className="flex-1 bg-slate-100 p-6 overflow-y-auto space-y-4">
              <div className="bg-white p-4 rounded-3xl rounded-tl-none max-w-[80%] shadow-sm">
                <p className="text-sm text-slate-800 font-medium">
                  Bhaiya, pichle mahine ka kitna balance hai? Aur 2 doodh ke
                  packet bhej dena.
                </p>
              </div>
              <div className="bg-indigo-600 p-4 rounded-3xl rounded-tr-none max-w-[80%] ml-auto text-white shadow-lg relative">
                <div className="absolute -top-6 right-0 bg-indigo-950 text-[8px] font-black uppercase px-2 py-1 rounded-full border border-indigo-500/20">
                  Udhaar Agent Response
                </div>
                <p className="text-sm font-medium">
                  Rahul ji, aapka total ₹450 baki hai. Doodh ke packet bhej raha
                  hoon. Total ₹450 + ₹66 = ₹516 ho jayega.
                </p>
              </div>
            </div>
            <div className="p-4 bg-white border-t flex gap-2">
              <Input
                className="flex-1"
                placeholder="Type a message or use One-Click Actions..."
              />
              <Button variant="primary">SEND</Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "inventory" && (
        <div className="space-y-8 animate-in fade-in duration-700">
          <div className="grid lg:grid-cols-2 gap-10">
            <Card className="p-10 space-y-8 bg-slate-900 border-none shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                    <Sparkles />
                  </div>
                  <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase italic">
                    ODIN Edge-AI
                  </h3>
                </div>
                <p className="text-indigo-200 text-sm font-medium opacity-80 leading-relaxed italic">
                  Snap a photo of your shelves. DukaanMitra v2.0 uses Visual
                  Inventory logic to auto-detect SKUs and stock-outs.
                </p>

                <div className="aspect-video bg-slate-800 rounded-[2.5rem] border-4 border-dashed border-slate-700 flex flex-col items-center justify-center gap-4 relative overflow-hidden group">
                  {capturedImage ? (
                    <img
                      loading="lazy"
                      src={capturedImage}
                      className="w-full h-full object-cover"
                      alt="Shelf"
                    />
                  ) : (
                    <>
                      <div className="text-6xl group-hover:scale-110 transition-transform">
                        📸
                      </div>
                      <Button
                        onClick={() =>
                          setCapturedImage(
                            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgNjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNTRjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGR5PSIuM2VtIiBmaWxsPSIjOWU5ZWE0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkludmVudG9yeSBTY2FuPC90ZXh0Pjwvc3ZnPg==",
                          )
                        }
                        variant="secondary"
                      >
                        OPEN CAMERA
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  onClick={handleScanShelf}
                  isLoading={isScanning}
                  disabled={!capturedImage}
                  variant="primary"
                  className="w-full py-8 text-lg bg-indigo-600 hover:bg-indigo-500 shadow-2xl shadow-indigo-500/20"
                >
                  {isScanning ? "ANALYZING SKUs..." : "SCAN & LOG INVENTORY"}
                </Button>
              </div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2"></div>
            </Card>

            <div className="space-y-6 flex flex-col">
              <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">
                Scan Results (Real-time Analytics)
              </h4>
              <Card className="flex-1 p-6 space-y-4 overflow-y-auto">
                {scanResults.length > 0 ? (
                  scanResults.map((res, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] animate-in slide-in-from-right duration-300"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-3 h-3 rounded-full",
                            res.status.includes("Low")
                              ? "bg-orange-500 animate-pulse"
                              : res.status.includes("Out")
                                ? "bg-rose-500"
                                : "bg-emerald-500",
                          )}
                        ></div>
                        <div>
                          <p className="text-sm font-black text-slate-800">
                            {res.item}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            {res.status}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-indigo-600">
                          {(res.confidence * 100).toFixed(0)}% AI CONF
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-[8px] mt-1 italic"
                        >
                          RESTOCK ➔
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 gap-3 grayscale">
                    <div className="text-6xl animate-bounce">📦</div>
                    <p className="text-xs font-black uppercase tracking-widest text-center">
                      Ready to process visual data.
                      <br />
                      Waiting for ingress signal.
                    </p>
                  </div>
                )}
              </Card>

              <Card className="bg-emerald-950 p-6 text-white border-none shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 italic leading-none mb-1">
                      Stock Optimization Path
                    </p>
                    <p className="text-xs font-bold text-indigo-50 leading-tight">
                      Gemini predicts 3 Out-of-Stock events by tomorrow based on
                      current burn rate.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {activeTab === "overview" && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatWidget
              label="Total Sales"
              value={`₹${store?.totalSales?.toLocaleString() || 0}`}
              icon={<TrendingUp size={24} />}
              color="emerald"
              trend={{ value: 12, isUp: true }}
            />
            <StatWidget
              label="Total Udhaar"
              value={`₹${store?.totalUdhaar?.toLocaleString() || 0}`}
              icon={<CreditCard size={24} />}
              color="rose"
              trend={{ value: 5, isUp: false }}
            />
            <StatWidget
              label="Pending Customers"
              value={customers.length}
              icon={<Users size={24} />}
              color="indigo"
            />
            <Card className="md:col-span-3 bg-blue-50 border-blue-200 border">
              <Card.Content className="py-4 flex items-center justify-between p-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    ₹
                  </div>
                  <div>
                    <p className="text-sm font-black text-blue-900 uppercase tracking-tighter">
                      July 2025 Pricing Guard
                    </p>
                    <p className="text-xs text-blue-700">
                      92% of your messages are categorized as{" "}
                      <span className="font-bold underline text-blue-900">
                        Utility
                      </span>{" "}
                      (Free within 24hr window). Smart logic saved you ₹420 this
                      week.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-800 hover:bg-blue-100 italic h-10"
                >
                  OPTIMIZE ➔
                </Button>
              </Card.Content>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Transactions */}
            <Card>
              <Card.Header className="flex-row items-center justify-between">
                <Card.Title>Recent Transactions</Card.Title>
                <Button variant="ghost" size="sm" className="h-10">
                  View All
                </Button>
              </Card.Header>
              <Card.Content>
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-[1.5rem] transition-colors border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          tx.type === "sale"
                            ? "bg-emerald-100 text-emerald-600"
                            : tx.type === "udhaar"
                              ? "bg-rose-100 text-rose-600"
                              : "bg-blue-100 text-blue-600",
                        )}
                      >
                        {tx.type === "sale" ? (
                          <ArrowUpRight size={20} />
                        ) : tx.type === "udhaar" ? (
                          <ArrowDownRight size={20} />
                        ) : (
                          <IndianRupee size={20} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 capitalize">
                          {tx.type}
                        </p>
                        <p className="text-xs text-slate-500">
                          {tx.items || "No description"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-sm font-bold",
                          tx.type === "sale"
                            ? "text-emerald-600"
                            : tx.type === "udhaar"
                              ? "text-rose-600"
                              : "text-blue-600",
                        )}
                      >
                        {tx.type === "udhaar" ? "-" : "+"}₹{tx.amount}
                      </p>
                      <p className="text-[10px] text-slate-400">{tx.date}</p>
                    </div>
                  </div>
                ))}
              </Card.Content>
            </Card>

            {/* Top Udhaar Customers */}
            <Card>
              <Card.Header className="flex-row items-center justify-between">
                <Card.Title>Top Udhaar Customers</Card.Title>
                <Button variant="ghost" size="sm" className="h-10">
                  Remind All
                </Button>
              </Card.Header>
              <Card.Content>
                {customers.map((cust) => (
                  <div
                    key={cust.phone}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                        {cust.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {cust.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Last seen: Today
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-rose-600">
                        ₹{cust.totalLTV}
                      </p>
                      <Button
                        size="sm"
                        variant="primary"
                        className="mt-1 h-6 px-2 text-[8px]"
                      >
                        Send Reminder
                      </Button>
                    </div>
                  </div>
                ))}
              </Card.Content>

              {/* Chart */}
              <div className="h-48 mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} hide />
                    <Tooltip cursor={{ fill: "transparent" }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === "alerts" && (
        <div className="space-y-8 animate-in fade-in duration-700">
          <Card
            variant="glass"
            className="bg-indigo-950 p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl"
          >
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">
                  🤖
                </div>
                <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                  Smart Recovery
                </h3>
              </div>
              <p className="text-indigo-200 text-base font-bold max-w-xl opacity-80 uppercase tracking-tight italic leading-relaxed">
                Automated debt management protocols to improve cash flow without
                damaging local shop relationships.
              </p>
            </div>
            <div className="relative z-10 bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 text-center min-w-[240px] shadow-2xl">
              <p className="text-5xl font-black italic tracking-tighter text-indigo-400">
                ₹2,450
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mt-3 leading-none">
                Potential Recovery
              </p>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] translate-x-1/4 -translate-y-1/4"></div>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {alerts.map((alert, i) => {
              if (hiddenAlerts.has(alert.title)) return null;
              return (
                <div
                  key={i}
                  className={cn(
                    "transition-all duration-500 ease-in-out transform",
                    removingAlerts.has(alert.title)
                      ? "opacity-0 scale-90 translate-y-4 pointer-events-none"
                      : "opacity-100 scale-100 translate-y-0",
                  )}
                >
                  <Card
                    className={cn(
                      "border-2 transition-all group relative overflow-hidden h-full",
                      triggeredAlerts.has(alert.title)
                        ? "border-emerald-300 bg-emerald-50/20"
                        : "border-slate-50 hover:border-indigo-200 shadow-sm hover:shadow-xl",
                    )}
                  >
                    <Card.Header className="flex-row items-center justify-between">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner transition-colors",
                          triggeredAlerts.has(alert.title)
                            ? "bg-emerald-100"
                            : "bg-slate-50 group-hover:bg-indigo-50",
                        )}
                      >
                        {alert.icon}
                      </div>
                      <span
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm",
                          alert.priority === "Urgent"
                            ? "bg-rose-100 text-rose-600"
                            : alert.priority === "High"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-blue-100 text-blue-600",
                        )}
                      >
                        {alert.priority} Priority
                      </span>
                    </Card.Header>
                    <Card.Content>
                      <Card.Title>{alert.title}</Card.Title>
                      <Card.Description>"{alert.desc}"</Card.Description>
                      <div
                        className={cn(
                          "h-1 w-12 rounded-full transition-all duration-700",
                          triggeredAlerts.has(alert.title)
                            ? "w-full bg-emerald-500"
                            : "bg-indigo-200 group-hover:w-full",
                        )}
                      ></div>
                    </Card.Content>
                    <Card.Footer className="border-none mt-4 pt-0">
                      <Button
                        onClick={() =>
                          handleAlertAction(
                            alert.title,
                            alert.desc,
                            alert.count,
                          )
                        }
                        disabled={triggeredAlerts.has(alert.title)}
                        variant={
                          triggeredAlerts.has(alert.title)
                            ? "primary"
                            : "secondary"
                        }
                        className={cn(
                          "w-full py-4 h-12",
                          triggeredAlerts.has(alert.title) &&
                            "bg-emerald-600 hover:bg-emerald-600",
                        )}
                      >
                        {triggeredAlerts.has(alert.title)
                          ? "COMMAND DEPLOYED"
                          : "RESOLVE & SEND ➔"}
                      </Button>
                    </Card.Footer>
                    {triggeredAlerts.has(alert.title) && (
                      <div className="absolute top-4 right-4 text-emerald-500 text-xl font-black">
                        ✓
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "marketing" && (
        <div className="grid lg:grid-cols-2 gap-10 animate-in fade-in duration-700">
          <Card className="p-10 space-y-8">
            <div className="space-y-4">
              <Card.Title>AI Creative Studio</Card.Title>
              <Card.Description>
                Professional marketing assets for your shop, designed by Munim's
                visual engine.
              </Card.Description>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Festival Greeting",
                  "New Stock Arrival",
                  "Weekend Sale",
                  "Loyalty Reward",
                ].map((type) => (
                  <Button
                    key={type}
                    onClick={() => setMarketingType(type)}
                    variant={marketingType === type ? "primary" : "outline"}
                    className="h-auto py-4"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-center">
                      {type}
                    </span>
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  Campaign Details
                </label>
                <textarea
                  value={marketingDetails}
                  onChange={(e) => setMarketingDetails(e.target.value)}
                  placeholder="e.g., 20% off on all dairy items this Sunday!"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 h-32 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleGenerateMarketing}
                  isLoading={isGenerating}
                  variant="secondary"
                  className="flex-1"
                >
                  {isGenerating ? "Drafting..." : "Write Text"}
                </Button>
                <Button
                  onClick={handleGeneratePoster}
                  isLoading={isPosterGenerating}
                  variant="primary"
                  className="flex-1"
                >
                  {isPosterGenerating ? "Designing..." : "AI Poster"}
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-8 flex flex-col h-full">
            <Card
              variant="glass"
              className="bg-slate-900 text-white p-10 relative overflow-hidden flex-1 flex flex-col"
            >
              <div className="relative z-10 space-y-6 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-indigo-400 italic">
                    Campaign Output
                  </h4>
                  {generatedPoster && (
                    <span className="bg-emerald-500 text-[8px] font-black uppercase px-2 py-1 rounded">
                      Visual Asset Ready
                    </span>
                  )}
                </div>

                <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[250px]">
                  {isPosterGenerating ? (
                    <div className="space-y-4">
                      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-indigo-400 font-black uppercase text-[10px] tracking-widest animate-pulse">
                        Rendering...
                      </p>
                    </div>
                  ) : generatedPoster ? (
                    <img
                      loading="lazy"
                      src={generatedPoster}
                      className="w-full h-full object-cover rounded-2xl shadow-lg animate-in zoom-in duration-500"
                      alt="Generated Campaign"
                    />
                  ) : generatedContent ? (
                    <p className="text-lg font-bold italic leading-relaxed text-indigo-50 animate-in fade-in duration-500">
                      "{generatedContent}"
                    </p>
                  ) : (
                    <div className="opacity-30 space-y-2">
                      <span className="text-4xl">✨</span>
                      <p className="text-[10px] font-black uppercase tracking-widest">
                        Awaiting Creation
                      </p>
                    </div>
                  )}
                </div>

                {(generatedContent || generatedPoster) && (
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="bg-white text-slate-900 border-none"
                      onClick={() => alert("Asset saved to Shop Media Library")}
                    >
                      Save Asset
                    </Button>
                    <Button
                      variant="primary"
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Launch 🚀
                    </Button>
                  </div>
                )}
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] pointer-events-none"></div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "qr" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-4 animate-in fade-in duration-700">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h3 className="text-4xl font-black text-slate-900 italic tracking-tighter leading-none">
                Smart Standee
              </h3>
              <p className="text-slate-500 text-sm font-bold uppercase opacity-80 italic tracking-tight">
                Your physical bridge to digital finance.
              </p>
            </div>

            <Card className="p-8 space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Customize Standee
              </h4>
              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="Shop Display Name"
                  value={qrShopName}
                  onChange={(e) => setQrShopName(e.target.value)}
                />
                <Input
                  label="UPI Identifier"
                  value={qrUpi}
                  onChange={(e) => setQrUpi(e.target.value)}
                />
              </div>
              <div className="flex gap-4 pt-2">
                <Button variant="secondary" className="flex-1">
                  Download PDF
                </Button>
                <Button variant="primary" className="flex-1">
                  Order Acrylic
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white p-2 shadow-2xl rounded-[3rem] border-[8px] border-gray-900 max-w-sm w-full transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-center text-white space-y-8 flex flex-col items-center">
                <div className="space-y-1">
                  <h4 className="text-3xl font-black italic tracking-tighter">
                    DukaanMitra
                  </h4>
                  <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-80">
                    Aapka Digital Munim
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-inner flex items-center justify-center relative w-48 h-48">
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 w-full h-full">
                    {[...Array(25)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${Math.random() > 0.3 ? "bg-gray-900" : "bg-transparent"}`}
                      ></div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white p-2 rounded-xl shadow-lg">
                      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">
                        ₹
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 w-full">
                  <p className="font-black text-xl tracking-tight truncate px-4">
                    {qrShopName}
                  </p>
                  <div className="bg-indigo-800/50 py-2 px-4 rounded-full inline-block">
                    <p className="text-[10px] font-bold tracking-widest opacity-90">
                      {qrUpi}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Action Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[150] flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-white/10">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-start relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                    🧠
                  </div>
                  <h4 className="font-black text-2xl uppercase tracking-tighter italic leading-none">
                    Munim Logic Gate
                  </h4>
                </div>
                <p className="text-xs text-indigo-400 uppercase font-black tracking-[0.4em] ml-14 leading-none">
                  Protocol: {selectedAlert.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="relative z-10 text-slate-500 hover:text-white transition-colors"
              >
                <span className="text-3xl font-light leading-none">✕</span>
              </button>
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
            </div>

            <div className="p-10 space-y-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center px-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">
                    Optimized for {selectedAlert.count} Contacts
                  </p>
                  <span className="bg-emerald-500/10 text-emerald-600 text-[8px] font-black px-2 py-1 rounded-full border border-emerald-500/20">
                    Gemini 3 Pro Inference Cycle
                  </span>
                </div>
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 min-h-[180px] flex items-center justify-center relative shadow-inner group overflow-y-auto max-h-[300px]">
                  {isAlertProcessing ? (
                    <div className="flex flex-col items-center gap-6">
                      <div className="flex gap-3">
                        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-150"></div>
                        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-300"></div>
                      </div>
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] animate-pulse leading-none">
                        Computing Best Outcome...
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4 text-center animate-in fade-in duration-500">
                      <p className="text-xl font-black italic text-slate-800 leading-relaxed tracking-tight">
                        "{alertNudge}"
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        Nudge Tone: Persuasive Hinglish
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Button
                  onClick={() => setSelectedAlert(null)}
                  variant="outline"
                  className="py-5"
                >
                  Reject & Close
                </Button>
                <Button
                  onClick={handleExecuteBlast}
                  isLoading={isBlasting}
                  disabled={isAlertProcessing}
                  variant="primary"
                  className="py-5 relative overflow-hidden"
                >
                  {isBlasting ? "Sending..." : "Execute Blast ➔"}
                  {isBlasting && (
                    <div
                      className="absolute bottom-0 left-0 h-1 bg-white/40 transition-all duration-100"
                      style={{ width: `${blastProgress}%` }}
                    />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
