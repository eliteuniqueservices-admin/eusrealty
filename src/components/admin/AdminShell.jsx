'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { getNavItems } from '@/lib/permissions';
import {
  LayoutDashboard, Building2, Settings, LogOut, Bell,
  ChevronDown, Menu, X, User, Key, ChevronRight, Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ICON_MAP = {
  LayoutDashboard, Building2, Settings, Briefcase,
};

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const role = session?.user?.role || 'admin';
  const navItems = getNavItems(role);

  const roleColors = {
    admin: 'bg-rose-500/20 text-rose-400',
  };
  const roleLabel = {
    admin: 'Admin',
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-6 py-5 border-b border-white/10", collapsed && "justify-center px-4")}>
        <div className="w-9 h-9 rounded-xl bg-cyan-500 flex items-center justify-center font-black text-slate-950 text-sm flex-shrink-0">
          E
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-white font-black text-lg leading-none tracking-tight">EUS<span className="text-cyan-400">Realty</span></h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">Admin Portal</p>
          </div>
        )}
      </div>

      {/* Role Badge */}
      {!collapsed && (
        <div className="px-6 py-4">
          <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold", roleColors[role])}>
            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {roleLabel[role]}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileSidebarOpen(false)}
              title={collapsed ? item.name : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group",
                isActive
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5",
                collapsed && "justify-center px-2"
              )}
            >
              {Icon && <Icon size={18} className={cn("flex-shrink-0", isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300")} />}
              {!collapsed && <span>{item.name}</span>}
              {!collapsed && isActive && <ChevronRight size={14} className="ml-auto text-cyan-400/60" />}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className={cn("p-4 border-t border-white/10", collapsed && "px-2")}>
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {session?.user?.name?.[0] || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-semibold text-sm truncate">{session?.user?.name || 'Admin'}</p>
              <p className="text-slate-400 text-xs truncate">{session?.user?.email || ''}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
        style={{ background: 'linear-gradient(180deg, #0f172a 0%, #0a0f1e 50%, #0f172a 100%)' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
          <aside
            className="relative w-[280px] flex flex-col z-50"
            style={{ background: 'linear-gradient(180deg, #0f172a 0%, #0a0f1e 50%, #0f172a 100%)' }}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              <Menu size={20} />
            </button>
            {/* Desktop collapse */}
            <button
              className="hidden lg:flex p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu size={20} />
            </button>
            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-slate-900 font-bold text-lg">
                {navItems.find(i => i.href === pathname || (i.href !== '/admin/dashboard' && pathname.startsWith(i.href)))?.name || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}
                className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-slate-900">Notifications</h4>
                    <Badge variant="info">1 New</Badge>
                  </div>
                  <div className="space-y-2">
                    {[
                      { title: 'New Job Inquiry Received', time: '2h ago', color: 'bg-blue-500' },
                    ].map((n, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer">
                        <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", n.color)} />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                          <p className="text-xs text-slate-400">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  {session?.user?.name?.[0] || 'A'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-slate-900 leading-none">{session?.user?.name?.split(' ')[0] || 'Admin'}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{roleLabel[role]}</p>
                </div>
                <ChevronDown size={14} className={cn("text-slate-400 transition-transform", profileOpen && "rotate-180")} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-100">
                    <p className="font-bold text-slate-900 text-sm">{session?.user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{session?.user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700 font-medium">
                      <User size={15} /> Edit Profile
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700 font-medium">
                      <Key size={15} /> Change Password
                    </button>
                    <div className="border-t border-slate-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-red-600 font-semibold"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
