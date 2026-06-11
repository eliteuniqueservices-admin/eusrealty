'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2, Briefcase, Plus, Users, FileText, ChevronRight, Activity
} from 'lucide-react';

function AdminDashboardStats() {
  const [stats, setStats] = useState([
    { label: 'Total Properties', value: '...', icon: <Building2 size={24} />, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { label: 'Active Job Openings', value: '...', icon: <Briefcase size={24} />, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Total Applicants', value: '...', icon: <Users size={24} />, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { label: 'New Applications', value: '...', icon: <FileText size={24} />, color: 'text-amber-600 bg-amber-50 border-amber-100' },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const [propsRes, jobsRes, appsRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/job-posts'),
          fetch('/api/job-applications')
        ]);
        
        let propsCount = 0;
        if (propsRes.ok) {
          const props = await propsRes.json();
          propsCount = props.length;
        }
        let jobsCount = 0;
        if (jobsRes.ok) {
          const jobs = await jobsRes.json();
          jobsCount = jobs.filter(j => j.status === 'Active').length;
        }
        let appsCount = 0;
        let newAppsCount = 0;
        if (appsRes.ok) {
          const apps = await appsRes.json();
          appsCount = apps.length;
          newAppsCount = apps.filter(a => a.status === 'New').length;
        }

        setStats([
          { label: 'Total Properties', value: propsCount.toString(), icon: <Building2 size={24} />, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Active Job Openings', value: jobsCount.toString(), icon: <Briefcase size={24} />, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Total Applicants', value: appsCount.toString(), icon: <Users size={24} />, color: 'text-purple-600 bg-purple-50 border-purple-100' },
          { label: 'New Applications', value: newAppsCount.toString(), icon: <FileText size={24} />, color: 'text-amber-600 bg-amber-50 border-amber-100' },
        ]);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, i) => (
        <Card key={i} className="hover:shadow-lg transition-all duration-300 border-slate-200/60 overflow-hidden group rounded-3xl">
          <CardContent className="p-5 md:p-6 flex items-center gap-4 relative h-full">
            <div className={`p-4 rounded-2xl border ${stat.color} group-hover:scale-110 transition-transform duration-300 relative z-10 bg-white`}>
              {stat.icon}
            </div>
            <div className="relative z-10">
              <p className="text-xs md:text-sm text-slate-500 font-bold tracking-wide uppercase">{stat.label}</p>
              <p className="text-2xl md:text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
            </div>
            {/* Decorative background accent */}
            <div className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full opacity-20 blur-3xl ${stat.color.split(' ')[1]} pointer-events-none`}></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DashboardContent() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [propRes, appRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/job-applications')
        ]);
        if (propRes.ok) {
          const data = await propRes.json();
          setProperties(data.slice(0, 5));
        }
        if (appRes.ok) {
          const appData = await appRes.json();
          setApplications(appData.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
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
        <div className="flex flex-wrap items-center gap-3 relative z-10 mt-4 sm:mt-0">
          <Link href="/admin/dashboard/job-applications">
            <Button variant="outline" className="gap-2 border-slate-200 hover:bg-slate-50 rounded-xl font-bold shadow-sm h-12 px-6 hover:text-blue-700 hover:border-blue-200 transition-colors">
              <Users size={18} className="text-slate-500 group-hover:text-blue-600" /> Applicants
            </Button>
          </Link>
          <Link href="/admin/dashboard/properties">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold shadow-lg shadow-blue-600/20 h-12 px-6 transition-all hover:scale-105 active:scale-95">
              <Plus size={18} /> New Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <AdminDashboardStats />

      {/* Grid for Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* Recent Job Applications */}
        <Card className="shadow-sm border-slate-200/60 rounded-[2rem] overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between p-6 md:p-8 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                <Briefcase size={22} />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-slate-900">Recent Applications</CardTitle>
                <CardDescription className="text-sm font-medium mt-0.5 text-slate-500">Latest candidates who applied</CardDescription>
              </div>
            </div>
            <Link href="/admin/dashboard/job-applications">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm font-bold gap-1 rounded-xl h-10 px-4">
                Manage <ChevronRight size={16}/>
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0 flex-1 bg-white">
            <div className="overflow-x-auto h-full">
              <table className="w-full h-full text-left">
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td className="text-center py-12 text-slate-500 text-sm font-medium animate-pulse">Loading applications...</td>
                    </tr>
                  ) : applications.length === 0 ? (
                    <tr>
                      <td className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                            <Users size={28} className="text-slate-300" />
                          </div>
                          <p className="text-slate-700 text-base font-bold">No recent applications.</p>
                          <p className="text-slate-500 text-sm font-medium">New applications will appear here.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => {
                      const appRole = app.position || app.role || '';
                      return (
                        <tr key={app._id || app.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-6 md:px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-black text-base shrink-0 border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                {app.name ? app.name.split(' ').map(n => n[0]).join('').substring(0,2) : '?'}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 text-base">{app.name}</p>
                                <p className="text-xs text-slate-500 font-medium mt-1">{appRole}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 md:px-8 py-5 text-right">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-black shadow-sm ${
                              app.status === 'New' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              app.status === 'Hired' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              app.status === 'Interview' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              app.status === 'Rejected' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                              'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}>
                              {app.status || 'New'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Properties */}
        <Card className="shadow-sm border-slate-200/60 rounded-[2rem] overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between p-6 md:p-8 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                <Building2 size={22} />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-slate-900">Recent Properties</CardTitle>
                <CardDescription className="text-sm font-medium mt-0.5 text-slate-500">Latest listings in the system</CardDescription>
              </div>
            </div>
            <Link href="/admin/dashboard/properties">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm font-bold gap-1 rounded-xl h-10 px-4">
                View All <ChevronRight size={16}/>
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0 flex-1 bg-white">
            <div className="overflow-x-auto h-full">
              <table className="w-full h-full text-left">
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td className="text-center py-12 text-slate-500 text-sm font-medium animate-pulse">Loading properties...</td>
                    </tr>
                  ) : properties.length === 0 ? (
                    <tr>
                      <td className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                            <Building2 size={28} className="text-slate-300" />
                          </div>
                          <p className="text-slate-700 text-base font-bold">No properties found.</p>
                          <p className="text-slate-500 text-sm font-medium">Add a new property to see it here.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    properties.map((prop) => (
                      <tr key={prop._id || prop.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 md:px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-black text-lg shrink-0 shadow-sm border border-blue-200 group-hover:scale-105 transition-transform duration-300">
                              {prop.name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-base line-clamp-1">{prop.name}</p>
                              <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-1">{prop.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-5 text-right">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-black shadow-sm ${
                            prop.status === 'Ready to Move' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {prop.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

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