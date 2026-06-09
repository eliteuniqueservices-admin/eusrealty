'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2, Briefcase, Plus
} from 'lucide-react';

function AdminDashboardStats() {
  const [stats, setStats] = useState([
    { label: 'Total Properties', value: '...', icon: <Building2 size={20} />, color: 'text-blue-600 bg-blue-50' },
    { label: 'Active Job Openings', value: '...', icon: <Briefcase size={20} />, color: 'text-emerald-600 bg-emerald-50' },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const [propsRes, jobsRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/job-posts')
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

        setStats([
          { label: 'Total Properties', value: propsCount.toString(), icon: <Building2 size={20} />, color: 'text-blue-600 bg-blue-50' },
          { label: 'Active Job Openings', value: jobsCount.toString(), icon: <Briefcase size={20} />, color: 'text-emerald-600 bg-emerald-50' },
        ]);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stats.map((stat, i) => (
        <Card key={i} className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-slate-500 font-bold">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DashboardContent() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await fetch('/api/properties');
        if (res.ok) {
          const data = await res.json();
          // Take the 5 most recently added properties
          setProperties(data.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {session?.user?.name?.split(' ')[0] || 'Admin'} 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard/properties">
            <Button className="gap-2"><Plus size={16} /> Add Property</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <AdminDashboardStats />

      {/* Recent Properties */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-base font-bold">Recent Properties</CardTitle>
            <CardDescription>Latest properties listed in the system</CardDescription>
          </div>
          <Link href="/admin/dashboard/properties">
            <Button variant="outline" size="sm" className="text-xs">Manage Properties</Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">Property</th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">Location</th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">Possession</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-slate-500 text-sm font-medium">Loading properties...</td>
                  </tr>
                ) : properties.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-slate-500 text-sm font-medium">No properties found.</td>
                  </tr>
                ) : (
                  properties.map((prop) => (
                    <tr key={prop._id || prop.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
                            {prop.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{prop.name}</p>
                            <p className="text-xs text-slate-400">{prop.developer}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700 font-medium">{prop.location}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                          prop.status === 'Ready to Move' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {prop.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700 font-medium">{prop.possession}</p>
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
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-400">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}