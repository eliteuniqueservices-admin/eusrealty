'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2, Briefcase, Users, FileText, Activity, CreditCard, Mail, UserCheck, LayoutTemplate, MessageSquare
} from 'lucide-react';

function DashboardContent() {
  const { data: session } = useSession();
  const [stats, setStats] = useState([
    { label: "Today's Leads", value: '...', icon: <Activity size={24} />, color: 'text-rose-600 bg-rose-50 border-rose-100', link: '/admin/dashboard/chat-leads' },
    { label: 'Monthly Leads', value: '...', icon: <MessageSquare size={24} />, color: 'text-amber-600 bg-amber-50 border-amber-100', link: '/admin/dashboard/chat-leads' },
    { label: 'Total Leads (Overall)', value: '...', icon: <Users size={24} />, color: 'text-blue-600 bg-blue-50 border-blue-100', link: '/admin/dashboard/chat-leads' },
    { label: 'Total Properties', value: '...', icon: <Building2 size={24} />, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', link: '/admin/dashboard/properties' },
    { label: 'Job Applications', value: '...', icon: <FileText size={24} />, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', link: '/admin/dashboard/job-applications' },
    { label: 'Active Job Posts', value: '...', icon: <Briefcase size={24} />, color: 'text-cyan-600 bg-cyan-50 border-cyan-100', link: '/admin/dashboard/manage-job-posts' },
    { label: 'Loan Applications', value: '...', icon: <CreditCard size={24} />, color: 'text-violet-600 bg-violet-50 border-violet-100', link: '/admin/dashboard/loan-applications' },
    { label: 'Subscribers', value: '...', icon: <Mail size={24} />, color: 'text-pink-600 bg-pink-50 border-pink-100', link: '/admin/dashboard/subscribers' },
    { label: 'Employees', value: '...', icon: <UserCheck size={24} />, color: 'text-teal-600 bg-teal-50 border-teal-100', link: '/admin/dashboard/employees' },
    { label: 'Published Blogs', value: '...', icon: <LayoutTemplate size={24} />, color: 'text-orange-600 bg-orange-50 border-orange-100', link: '/admin/dashboard/manage-blogs' },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/dashboard-stats');
        if (res.ok) {
          const data = await res.json();
          setStats([
            { label: "Today's Leads", value: data.todayLeads?.toString() || '0', icon: <Activity size={24} />, color: 'text-rose-600 bg-rose-50 border-rose-100', link: '/admin/dashboard/chat-leads' },
            { label: 'Monthly Leads', value: data.monthLeads?.toString() || '0', icon: <MessageSquare size={24} />, color: 'text-amber-600 bg-amber-50 border-amber-100', link: '/admin/dashboard/chat-leads' },
            { label: 'Total Leads (Overall)', value: data.totalLeads?.toString() || '0', icon: <Users size={24} />, color: 'text-blue-600 bg-blue-50 border-blue-100', link: '/admin/dashboard/chat-leads' },
            { label: 'Total Properties', value: data.totalProperties?.toString() || '0', icon: <Building2 size={24} />, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', link: '/admin/dashboard/properties' },
            { label: 'Job Applications', value: data.totalApplications?.toString() || '0', icon: <FileText size={24} />, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', link: '/admin/dashboard/job-applications' },
            { label: 'Active Job Posts', value: data.totalJobPosts?.toString() || '0', icon: <Briefcase size={24} />, color: 'text-cyan-600 bg-cyan-50 border-cyan-100', link: '/admin/dashboard/manage-job-posts' },
            { label: 'Loan Applications', value: data.totalLoanApplications?.toString() || '0', icon: <CreditCard size={24} />, color: 'text-violet-600 bg-violet-50 border-violet-100', link: '/admin/dashboard/loan-applications' },
            { label: 'Subscribers', value: data.totalSubscribers?.toString() || '0', icon: <Mail size={24} />, color: 'text-pink-600 bg-pink-50 border-pink-100', link: '/admin/dashboard/subscribers' },
            { label: 'Employees', value: data.totalEmployees?.toString() || '0', icon: <UserCheck size={24} />, color: 'text-teal-600 bg-teal-50 border-teal-100', link: '/admin/dashboard/employees' },
            { label: 'Published Blogs', value: data.totalBlogs?.toString() || '0', icon: <LayoutTemplate size={24} />, color: 'text-orange-600 bg-orange-50 border-orange-100', link: '/admin/dashboard/manage-blogs' },
          ]);
        }
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 via-transparent to-transparent pointer-events-none rounded-bl-full" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-full mb-4 shadow-sm">
            <Activity size={14} className="animate-pulse" /> Live Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, <span className="text-blue-600">{session?.user?.name?.split(' ')[0] || 'Admin'}</span> 👋
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Here is your daily overview for {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
          </p>
        </div>
      </div>

      {/* Grid for All Page Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <Link href={stat.link} key={i} className="block group">
            <Card className="hover:shadow-lg transition-all duration-300 border-slate-200/60 overflow-hidden rounded-3xl h-full cursor-pointer bg-white">
              <CardContent className="p-6 flex flex-col justify-between h-full min-h-[140px] relative">
                <div className="flex justify-between items-start z-10 relative">
                  <div className={`p-4 rounded-2xl border ${stat.color} group-hover:scale-110 transition-transform duration-300 bg-white`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                  </div>
                </div>
                <div className="mt-4 z-10 relative">
                  <p className="text-sm font-bold text-slate-600 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1 group-hover:text-blue-500 transition-colors flex items-center gap-1">
                    Manage {stat.label} &rarr;
                  </p>
                </div>
                {/* Decorative background accent */}
                <div className={`absolute -right-10 -bottom-10 w-40 h-40 rounded-full opacity-20 blur-3xl ${stat.color.split(' ')[1]} pointer-events-none`}></div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 min-h-[calc(100vh-64px)] bg-slate-50/50">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-500 font-bold text-sm">Loading Dashboard...</div>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </div>
  );
}