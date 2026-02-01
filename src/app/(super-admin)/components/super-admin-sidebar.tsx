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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/super-admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/super-admin/users', label: 'User Management', icon: Users },
  { href: '/super-admin/admins', label: 'Admin Control', icon: UserCheck },
  { href: '/super-admin/data', label: 'Data Explorer', icon: Database },
  { href: '/super-admin/logs', label: 'Logs & Activity', icon: FileClock },
  { href: '/super-admin/system', label: 'System Health', icon: HeartPulse },
  { href: '/super-admin/security', label: 'Security Center', icon: Shield },
  { href: '/super-admin/settings', label: 'Global Settings', icon: Settings },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border p-4 flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-primary tracking-tight">SUPER ADMIN</h2>
        <p className="text-xs text-muted-foreground">System Control Center</p>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
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
    </aside>
  );
}
