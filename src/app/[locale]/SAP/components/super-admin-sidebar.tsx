
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Shield,
  Database,
  FileClock,
  HeartPulse,
  Settings,
  UserCheck,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/SAP/Superdashboard', label: 'Super Dashboard', icon: LayoutDashboard },
  { href: '/SAP/businesses', label: 'Businesses', icon: Briefcase },
  { href: '/SAP/users', label: 'User Management', icon: Users },
  { href: '/SAP/admins', label: 'Admin Control', icon: UserCheck },
  { href: '/SAP/audit-logs', label: 'Audit Logs', icon: FileClock },
  { href: '/SAP/revenue', label: 'Revenue', icon: DollarSign },
  { href: '/SAP/platform-analytics', label: 'Analytics', icon: TrendingUp },
  { href: '/SAP/messages', label: 'Messages', icon: MessageSquare },
  { href: '/SAP/system', label: 'System Health', icon: HeartPulse },
  { href: '/SAP/security', label: 'Security Center', icon: Shield },
  { href: '/SAP/settings', label: 'Global Settings', icon: Settings },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border p-4 flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-primary tracking-tight">SUPER DASHBOARD</h2>
        <p className="text-xs text-muted-foreground">System Control Center</p>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
       <div className="mt-auto p-4 bg-muted/50 rounded-lg border border-border">
            <div className="text-xs text-muted-foreground mb-2">System Status</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">All Systems Operational</span>
            </div>
          </div>
    </aside>
  );
}
