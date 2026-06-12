'use client';

import { useState, useEffect } from 'react';
import { Mail, Loader2, CheckCircle2, XCircle, Download } from 'lucide-react';
import { format } from 'date-fns';
import ExportModal from '@/components/admin/ExportModal';

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportOpen, setExportOpen] = useState(false);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/subscribe');
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data);
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const activeCount = subscribers.filter(s => s.status === 'Active').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Newsletter Subscribers</h1>
          <p className="text-slate-500 text-sm mt-1">Manage the users who have subscribed from the footer.</p>
        </div>
        <button onClick={() => setExportOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95">
          <Download size={18} strokeWidth={2.5} /> Export Excel
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Mail size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Subscribers</p>
            <h3 className="text-2xl font-black text-slate-900">{subscribers.length}</h3>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Active Subscribers</p>
            <h3 className="text-2xl font-black text-slate-900">{activeCount}</h3>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No subscribers yet</h3>
            <p className="text-slate-500 mt-2">When users subscribe from the footer, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="font-semibold p-4">Email Address</th>
                  <th className="font-semibold p-4">Status</th>
                  <th className="font-semibold p-4">Subscribed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-semibold text-slate-900">{sub.email}</td>
                    <td className="p-4">
                      {sub.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                          <XCircle size={12} /> Unsubscribed
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-500">
                      {format(new Date(sub.createdAt), 'MMM dd, yyyy HH:mm')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ExportModal 
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        data={subscribers}
        filename="newsletter_subscribers_export.xlsx"
        availableColumns={[
          { key: 'email', label: 'Email Address' },
          { key: 'status', label: 'Subscription Status' },
          { key: 'createdAt', label: 'Subscribed On' }
        ]}
      />
    </div>
  );
}
