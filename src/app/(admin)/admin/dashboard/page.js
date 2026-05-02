"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Building2,
  Users2,
  TrendingUp,
  MapPin,
  Phone,
  Clock,
  Briefcase,
  ChevronRight,
  User
} from 'lucide-react';

export default function DashboardOverview() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State to track the current view and hydration status
  const [viewContext, setViewContext] = useState('Applications');
  const [isMounted, setIsMounted] = useState(false);

  // ✅ Fix: Sync URL, State, and localStorage seamlessly
  useEffect(() => {
    setIsMounted(true);
    const urlView = searchParams.get('view');
    const savedView = localStorage.getItem('dashboardLastView');

    if (urlView) {
      // If URL has a view, trust it and save it
      setViewContext(urlView);
      localStorage.setItem('dashboardLastView', urlView);
    } else if (savedView) {
      // If URL has no view but we have a saved one, use it and update URL silently
      setViewContext(savedView);
      router.replace(`/admin/dashboard?view=${savedView}`);
    }
  }, [searchParams, router]);

  const stats = [
    {
      id: 'Properties',
      label: 'Active Listings',
      value: '142',
      grow: '+12%',
      icon: <Building2 size={22} />
    },
    {
      id: 'Applications',
      label: 'Career Applications',
      value: '28',
      grow: 'New',
      icon: <Users2 size={22} />
    },
    {
      id: 'Leads',
      label: 'Monthly Leads',
      value: '850',
      grow: '+18%',
      icon: <TrendingUp size={22} />
    },
    {
      id: 'Visits',
      label: 'Total Site Visits',
      value: '1,240',
      grow: '+22%',
      icon: <MapPin size={22} />
    },
  ];

  // ✅ Update State, URL, and Storage on click
  const handleCardClick = (view) => {
    setViewContext(view);
    localStorage.setItem('dashboardLastView', view);
    router.push(`/admin/dashboard?view=${view}`);
  };

  // Prevent rendering the wrong view during Next.js hydration
  if (!isMounted) return null;

  const renderDynamicContent = () => {
    switch (viewContext) {
      case 'Properties':
        return (
          <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Active Properties Summary</h3>
              <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { name: 'VTP Bellissimo', location: 'Hinjewadi', units: 12, status: 'Selling Fast' },
                { name: 'Godrej Woodsville', location: 'Maan', units: 8, status: 'New Launch' },
              ].map((p, i) => (
                <div key={i} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Building2 size={20} />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{p.status}</span>
                  </div>
                  <p className="font-bold text-slate-900 text-lg">{p.name}</p>
                  <p className="text-sm text-slate-500 mb-3 flex items-center gap-1 mt-1">
                    <MapPin size={14} /> {p.location}
                  </p>
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <p className="text-blue-600 font-bold">{p.units} Units Available</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Leads':
        return (
          <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Hot Leads</h3>
            <div className="space-y-3">
              {[
                { name: 'Vikram Malhotra', project: 'VTP Altair', budget: '₹1.2Cr', time: '2 hours ago' },
                { name: 'Sandeep Kulkarni', project: 'Kohinoor Westview', budget: '₹85L', time: '4 hours ago' },
              ].map((lead, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{lead.name}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Building2 size={14} /> {lead.project}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-6">
                    <div className="hidden sm:block">
                      <p className="text-xs text-slate-400">{lead.time}</p>
                      <p className="font-bold text-slate-700">{lead.budget}</p>
                    </div>
                    <button className="p-2 bg-slate-50 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors text-slate-400">
                      <Phone size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Visits':
        return (
          <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Today's Site Visits</h3>
            <div className="space-y-4">
              {[
                { client: 'Rajesh Iyer', project: 'Moonstone', time: '10:30 AM', status: 'Completed' },
                { client: 'Anjali Gupta', project: 'Woodsville', time: '12:45 PM', status: 'Upcoming' },
              ].map((v, i) => (
                <div key={i} className="flex items-center p-4 bg-white border border-slate-200 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${v.status === 'Completed' ? 'bg-green-500' : 'bg-amber-500'}`} />
                  <div className="ml-2 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-slate-900 text-lg flex items-center gap-2">
                          <User size={18} className="text-slate-400"/> {v.client}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">{v.project}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          v.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {v.status}
                        </span>
                        <p className="text-sm font-medium text-slate-600 mt-2 flex items-center justify-end gap-1">
                          <Clock size={14} /> {v.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default: // 'Applications'
        return (
          <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Recent Career Applications</h3>
              <button className="text-sm text-blue-600 font-medium hover:underline">Manage All</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: 'Rahul Sharma', role: 'Sales Lead', status: 'New', date: 'Today' },
                { name: 'Amit Verma', role: 'RM (Wakad)', status: 'Interview', date: 'Yesterday' },
              ].map((app, i) => (
                <div key={i} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{app.name}</p>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      app.status === 'New' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4 flex items-center gap-1.5">
                    <Briefcase size={16} className="text-slate-400"/> {app.role}
                  </p>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-400">Applied: {app.date}</p>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back, here is what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => {
          const isActive = viewContext === stat.id;
          return (
            <button
              key={stat.id}
              onClick={() => handleCardClick(stat.id)}
              className={`relative p-6 rounded-3xl text-left transition-all duration-300 border ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20 scale-[1.02]'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg text-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${isActive ? 'bg-blue-500/50 text-white' : 'bg-slate-100 text-blue-600'}`}>
                  {stat.icon}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${isActive ? 'bg-blue-500/50 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                  {stat.grow}
                </span>
              </div>
              <p className={`text-sm font-medium mb-1 ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                {stat.label}
              </p>
              <p className={`text-3xl font-black tracking-tight ${isActive ? 'text-white' : 'text-slate-900'}`}>
                {stat.value}
              </p>
            </button>
          );
        })}
      </div>

      {/* Dynamic Section Wrapper */}
      <div className="bg-slate-50/50 rounded-3xl border border-slate-200 min-h-[400px] overflow-hidden">
        {renderDynamicContent()}
      </div>
    </div>
  );
}