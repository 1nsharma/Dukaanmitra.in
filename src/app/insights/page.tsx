import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    ArrowRight, BarChart3, Bell, CheckCircle, FileDown, Gauge, GitFork, Landmark, 
    LayoutDashboard, Plug, Store, User, Users, Zap, Brain, TrendingUp, Package,
    Clock, Repeat, Gem, ShieldAlert, Megaphone, Star, Archive, Truck,
    ClipboardList, Percent, CalendarCheck, RotateCw, MessageSquare, GitCompare,
    Library, Map, History, Lock, FileClock, Terminal, FileSpreadsheet, Code,
    Database, Trophy, AreaChart, Briefcase, Table, DollarSign, Bot, Sparkles
} from 'lucide-react';
import React from 'react';

const coreFeatures = [
  {
    title: 'Shop Health Score',
    description: 'Har shop ki overall performance ka single smart score',
    icon: <Gauge className="w-8 h-8" />,
  },
  {
    title: 'Sales & Analytics Dashboard',
    description: 'Daily, weekly, monthly sales insights ek hi jagah',
    icon: <BarChart3 className="w-8 h-8" />,
  },
  {
    title: 'Customer Segments',
    description: 'Regular, high-value aur inactive customers ka automatic grouping',
    icon: <Users className="w-8 h-8" />,
  },
  {
    title: 'Smart Alerts',
    description: 'Low sales, low stock ya risk signals par instant alerts',
    icon: <Bell className="w-8 h-8" />,
  },
  {
    title: 'Rule Templates / Automation',
    description: 'Auto actions based on conditions (jaise low footfall → offer send)',
    icon: <Zap className="w-8 h-8" />,
  },
  {
    title: 'Reports & Exports',
    description: 'Excel/CSV me data export for audit and investors',
    icon: <FileDown className="w-8 h-8" />,
  },
];

const howItWorks = [
    {
        title: 'Shop data connect karo',
        icon: <Plug className="w-8 h-8 text-primary" />
    },
    {
        title: 'DukaanMitra analytics automatically run karega',
        icon: <Brain className="w-8 h-8 text-primary" />
    },
    {
        title: 'Dashboard par health score aur insights dekho',
        icon: <LayoutDashboard className="w-8 h-8 text-primary" />
    },
    {
        title: 'Alerts aur recommendations par action lo',
        icon: <CheckCircle className="w-8 h-8 text-primary" />
    }
]

const forWhom = [
    {
        title: 'Local retail shops',
        icon: <Store className="w-6 h-6" />
    },
    {
        title: 'Small business owners',
        icon: <User className="w-6 h-6" />
    },
    {
        title: 'Multi-branch store operators',
        icon: <GitFork className="w-6 h-6" />
    },
    {
        title: 'Investors and aggregators',
        icon: <Landmark className="w-6 h-6" />
    }
]

const adminFeatures = [
    "All shops overview",
    "Shop comparison",
    "Global rules and templates",
    "Centralized alerts",
    "Performance leaderboard"
]

const benefits = [
    "Faster decisions",
    "Higher sales",
    "Better customer retention",
    "Data-driven growth",
    "Investor-ready reports"
]

const advancedAnalytics = [
    { title: 'Revenue Trend Analysis', description: 'Time ke saath sales ka pattern aur growth rate', icon: <TrendingUp /> },
    { title: 'Product Performance Matrix', description: 'Kaunsa product hero hai, kaunsa slow mover', icon: <Package /> },
    { title: 'Peak Hours Intelligence', description: 'Din ke kaunse time par sabse zyada bikri hoti hai', icon: <Clock /> },
    { title: 'Repeat Purchase Rate', description: 'Kitne customers wapas aa rahe hain', icon: <Repeat /> },
];

const customerIntelligence = [
    { title: 'Customer Lifetime Value (CLV)', description: 'Ek customer se total expected earning', icon: <Gem /> },
    { title: 'Churn Risk Detection', description: 'Kaunse customers chhodne wale hain', icon: <ShieldAlert /> },
    { title: 'Personalized Offer Suggestions', description: 'Har segment ke liye alag smart offers', icon: <Megaphone /> },
    { title: 'Feedback & Rating Tracker', description: 'Customer satisfaction ka live signal', icon: <Star /> },
];

const inventoryInsights = [
    { title: 'Low Stock Alerts', description: 'Out of stock hone se pehle warning', icon: <Store /> },
    { title: 'Dead Stock Detection', description: 'Jo samaan bik nahi raha uski pehchan', icon: <Archive /> },
    { title: 'Auto Reorder Suggestions', description: 'Kab aur kitna maal mangwana hai', icon: <Truck /> },
    { title: 'Supplier Performance View', description: 'Kaunsa supplier reliable hai', icon: <ClipboardList /> },
];

const automationActions = [
    { title: 'Auto Discount Campaigns', description: 'Slow products par automatic offers', icon: <Percent /> },
    { title: 'Festival / Event Boost Rules', description: 'Special days par auto promotion', icon: <CalendarCheck /> },
    { title: 'Customer Reactivation Flow', description: 'Inactive customers ko wapas lana', icon: <RotateCw /> },
    { title: 'WhatsApp / SMS Triggers', description: 'Important events par instant message', icon: <MessageSquare /> },
];

const multiShopControl = [
    { title: 'Cross-Shop Comparison', description: 'Sab branches ka side-by-side data', icon: <GitCompare /> },
    { title: 'Centralized Policy Engine', description: 'Ek rule sab shops par apply', icon: <Library /> },
    { title: 'Regional Performance Heatmap', description: 'Kis area me kaisi growth ho rahi hai', icon: <Map /> },
    { title: 'Master Admin Activity Log', description: 'Kisne kya change kiya, pura record', icon: <History /> },
];

const securityTrust = [
    { title: 'Role Based Access', description: 'Owner, manager, staff ke alag rights', icon: <Users /> },
    { title: 'Secure Data Vault', description: 'Sensitive data encrypted storage', icon: <Lock /> },
    { title: 'Full Audit Trail', description: 'Har action ka history', icon: <FileClock /> },
    { title: 'Backup & Restore', description: 'Data loss se protection', icon: <Database /> },
];

const integrationsReady = [
    { title: 'POS System Connect', description: 'Existing billing system se direct data', icon: <Terminal /> },
    { title: 'Google Sheets Sync', description: 'Live data spreadsheet me', icon: <FileSpreadsheet /> },
    { title: 'API Access for Developers', description: 'Custom tools banane ki freedom', icon: <Code /> },
    { title: 'Cloud Database Support', description: 'Scalable real-time data storage', icon: <Database /> },
];

const growthInvestorMode = [
    { title: 'Shop Health Leaderboard', description: 'Top performing shops ki ranking', icon: <Trophy /> },
    { title: 'Growth Scorecard', description: 'Month to month progress report', icon: <AreaChart /> },
    { title: 'Investor Export Pack', description: 'Clean reports for funding pitch', icon: <Briefcase /> },
    { title: 'KPI Snapshot View', description: 'Important numbers ek screen par', icon: <Table /> },
];

const futureAiUpgrades = [
    { title: 'AI Demand Forecasting', description: 'Aage kya bikega pehle se pata', icon: <TrendingUp /> },
    { title: 'Dynamic Pricing Engine', description: 'Demand ke hisaab se price change', icon: <DollarSign /> },
    { title: 'Smart Chat Assistant for Shop Owners', description: 'Natural language me questions ka jawab', icon: <Bot /> },
    { title: 'Auto Strategy Recommendations', description: 'System khud batayega next best action', icon: <Sparkles /> },
];

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
    <Card className="bg-card/50 hover:border-primary/50 hover:bg-card transition-all transform hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">{icon}</div>
            <CardTitle className="text-lg font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

interface SectionProps {
    title: string;
    description: string;
    children: React.ReactNode;
    badge?: string;
}

const FeatureSection: React.FC<SectionProps> = ({ title, description, badge, children }) => (
    <section>
        <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title} {badge && <Badge>{badge}</Badge>}</h2>
            <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {children}
        </div>
    </section>
);


export default function InsightsPage() {
  return (
    <div className="container py-16 md:py-24 space-y-24">
      {/* 1. Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="font-headline text-4xl md:text-6xl font-black tracking-tighter">
          DukaanMitra – Smart Growth System for Local Shops
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Analytics, Automation aur AI ke saath apni dukaan ko next level par le jao
        </p>
        <div className="mt-6 flex justify-center items-center gap-4 text-sm font-semibold text-primary">
            <span>Real-time insights</span>
            <span className="text-muted-foreground/50">•</span>
            <span>Customer intelligence</span>
            <span className="text-muted-foreground/50">•</span>
            <span>Actionable alerts</span>
        </div>
      </section>

      {/* 2. Core Features Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature) => (
                <FeatureCard key={feature.title} {...feature} icon={React.cloneElement(feature.icon as React.ReactElement, { className: "w-8 h-8" })} />
            ))}
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 tracking-tight">How It Works</h2>
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
             {howItWorks.map((step, index) => (
                <div key={step.title} className="relative flex flex-col items-center gap-4">
                     {index < howItWorks.length - 1 && (
                        <div className="hidden md:block absolute top-12 left-1/2 -translate-y-1/2 w-full border-t-2 border-dashed border-border"></div>
                     )}
                    <div className="relative z-10 p-4 bg-background border-2 border-primary/50 rounded-full">
                        {step.icon}
                    </div>
                    <p className="font-semibold mt-2 max-w-xs">{step.title}</p>
                </div>
             ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* 4. For Whom & 5. Admin Power */}
        <div className="space-y-12">
            <section>
                <h2 className="text-3xl font-bold mb-6">For Whom?</h2>
                 <div className="grid grid-cols-2 gap-4">
                    {forWhom.map(item => (
                        <div key={item.title} className="flex items-center gap-3 p-4 bg-card rounded-lg">
                            {item.icon}
                            <span className="font-medium">{item.title}</span>
                        </div>
                    ))}
                 </div>
            </section>
            <section>
                <h2 className="text-3xl font-bold mb-6">Admin Power <Badge>Super Admin Panel</Badge></h2>
                <ul className="space-y-3">
                    {adminFeatures.map(item => (
                       <li key={item} className="flex items-center gap-3 text-lg">
                         <CheckCircle className="w-5 h-5 text-green-400" />
                         <span>{item}</span>
                       </li>
                    ))}
                </ul>
            </section>
        </div>

        {/* 6. Benefits */}
        <section>
             <Card className="p-8 bg-gradient-to-br from-primary/10 to-transparent">
                <h2 className="text-3xl font-bold mb-6">Benefits</h2>
                 <ul className="space-y-4 text-xl">
                    {benefits.map(item => (
                       <li key={item} className="flex items-center gap-4 font-semibold">
                         <CheckCircle className="w-6 h-6 text-primary" />
                         <span>{item}</span>
                       </li>
                    ))}
                </ul>
            </Card>
        </section>
      </div>
      
        <FeatureSection title="Advanced Analytics Modules" description="Apne business ke har angle se data-driven insights pao.">
            {advancedAnalytics.map(feature => <FeatureCard key={feature.title} {...feature} />)}
        </FeatureSection>

        <FeatureSection title="Customer Intelligence" description="Apne customers ko behtar samjho aur lifetime value badhao.">
            {customerIntelligence.map(feature => <FeatureCard key={feature.title} {...feature} />)}
        </FeatureSection>

        <FeatureSection title="Inventory Insights" description="Stock management ko smart banao, nuksaan se bacho.">
            {inventoryInsights.map(feature => <FeatureCard key={feature.title} {...feature} />)}
        </FeatureSection>

        <FeatureSection title="Automation & Actions" description="Manual kaam kam karo aur system ko apne liye kaam karne do.">
            {automationActions.map(feature => <FeatureCard key={feature.title} {...feature} />)}
        </FeatureSection>

        <FeatureSection title="Multi-Shop Control" description="Agar aapki ek se zyada branches hain, toh unhe ek hi jagah se manage karo." badge="Enterprise">
            {multiShopControl.map(feature => <FeatureCard key={feature.title} {...feature} />)}
        </FeatureSection>

        <FeatureSection title="Security & Trust" description="Aapka data hamare paas surakshit hai, poore control ke saath.">
            {securityTrust.map(feature => <FeatureCard key={feature.title} {...feature} />)}
        </FeatureSection>

        <FeatureSection title="Integrations Ready" description="Apne existing tools ke saath asaani se connect karo." badge="Pro+">
            {integrationsReady.map(feature => <FeatureCard key={feature.title} {...feature} />)}
        </FeatureSection>

        <FeatureSection title="Growth & Investor Mode" description="Apne business ki growth track karo aur investors ke liye ready raho.">
            {growthInvestorMode.map(feature => <FeatureCard key={feature.title} {...feature} />)}
        </FeatureSection>

        <FeatureSection title="Future AI Upgrades" description="Hum hamesha behtar ho rahe hain, ye hai hamara aane wala kal." badge="Roadmap">
            {futureAiUpgrades.map(feature => <FeatureCard key={feature.title} {...feature} />)}
        </FeatureSection>


      {/* Call to Action */}
      <section className="text-center py-16 bg-card rounded-2xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Grow?</h2>
        <Button size="lg" className="px-8 h-12 text-lg font-bold">
            Start Growing Your Shop
            <ArrowRight className="ml-2"/>
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
            Test with your shop and see real results
        </p>
      </section>
    </div>
  );
}
