'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users2,
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  MapPin,
  Menu,
  X,
  ChevronDown,
  User,
  Key
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const menuItems = [
    { name: 'Overview', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Manage Projects', href: '/admin/dashboard/manage-projects', icon: <Building2 size={18} /> },
    { name: 'Manage Leads', href: '/admin/dashboard/manage-leads', icon: <TrendingUp size={18} /> },
    { name: 'Job Applications', href: '/admin/dashboard/job-applications', icon: <Users2 size={18} /> },
    { name: 'Manage Job Posts', href: '/admin/dashboard/manage-job-posts', icon: <MapPin size={18} /> },
    { name: 'Settings', href: '/admin/dashboard/settings', icon: <Settings size={18} /> },
  ];

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100 flex">

      {/* Sidebar */}
      <aside
        className={`text-white transition-all duration-300 overflow-hidden flex flex-col ${
          isSidebarOpen ? 'w-72 shadow-2xl' : 'w-0'
        }`}
        style={{ background: 'linear-gradient(180deg,#0f172a,#090e1c,#0f172a)' }}
      >
        <div className={`p-8 ${isSidebarOpen ? 'block' : 'hidden'}`}>
          <h1 className="text-2xl font-black tracking-tighter">
            EUS<span className="text-cyan-400">ADMIN</span>
          </h1>
          <p className="text-[10px] text-cyan-200 font-black uppercase tracking-[0.2em] mt-2">
            West Pune Command
          </p>
        </div>

        {/* Menu */}
        <div className={`px-4 space-y-2 ${isSidebarOpen ? 'block' : 'hidden'}`}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-100 ring-1 ring-cyan-300 shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <div className={`mt-auto p-6 border-t border-slate-800 ${isSidebarOpen ? 'block' : 'hidden'}`}>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 font-bold text-sm transition-colors px-4 py-3 rounded-xl">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">

        {/* Header */}
        <div className="p-6 flex justify-between items-center">

          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsSidebarOpen((prev) => !prev);
                setShowNotifications(false);
                setShowProfileMenu(false);
              }}
              className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <h2 className="text-2xl font-black tracking-tight">
              EUS<span className="text-blue-600">Realty</span>
            </h2>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications((prev) => !prev);
                  setShowProfileMenu(false);
                }}
                className={`relative p-3 rounded-2xl border ${
                  showNotifications
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-blue-100 rounded-2xl shadow-2xl p-4 z-30">
                  <div className="flex justify-between mb-3">
                    <h4 className="font-black text-sm">Notifications</h4>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold">
                      4 New
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { title: 'New Lead', time: '2m ago', text: 'New client inquiry received' },
                      { title: 'Site Visit', time: '1h ago', text: 'Visit scheduled at 4 PM' },
                      { title: 'Property Update', time: '3h ago', text: 'Price updated' },
                      { title: 'System Alert', time: '1d ago', text: 'Monthly report ready' },
                    ].map((n, i) => (
                      <div key={i} className="p-3 rounded-xl border hover:bg-blue-50">
                        <p className="text-xs font-bold">
                          {n.title} • <span className="text-slate-400">{n.time}</span>
                        </p>
                        <p className="text-[11px] text-slate-500">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu((prev) => !prev);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white border border-slate-200"
              >
                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black">
                  AD
                </div>
                <ChevronDown
                  size={16}
                  className={`transition ${showProfileMenu ? 'rotate-180' : ''}`}
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white border rounded-2xl shadow-2xl overflow-hidden z-30">
                  <button className="w-full px-4 py-3 flex items-center gap-2 hover:bg-blue-50">
                    <User size={14} /> Edit Profile
                  </button>
                  <button className="w-full px-4 py-3 flex items-center gap-2 hover:bg-blue-50">
                    <Key size={14} /> Change Password
                  </button>
                  <button className="w-full px-4 py-3 flex items-center gap-2 hover:bg-blue-50">
                    <Settings size={14} /> Settings
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Page Content */}
        <div className="px-6 pb-6">
          {children}
        </div>

      </main>
    </div>
  );
}