
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BarChart3, Bell, CheckCircle, FileDown, Gauge, GitFork, Landmark, LayoutDashboard, Plug, Store, User, Users, Zap, BrainCircuit } from 'lucide-react';

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
        icon: <BrainCircuit className="w-8 h-8 text-primary" />
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
                <Card key={feature.title} className="bg-card/50 hover:border-primary/50 hover:bg-card transition-all transform hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <div className="p-3 bg-primary/10 rounded-lg text-primary">{feature.icon}</div>
                        <CardTitle className="text-lg font-bold">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                </Card>
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
                        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-y-1/2 w-full h-0.5 bg-border border-dashed"></div>
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

      {/* 7. Call to Action */}
      <section className="text-center py-16 bg-card rounded-2xl">
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
