'use client';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, Plus, Mail, Phone, Trash2, X, ChevronRight, 
  GraduationCap, CalendarDays, FileText, CheckCircle2, 
  Users, Briefcase, Filter, ChevronDown, Download, Award
} from 'lucide-react';
import ExportModal from '@/components/admin/ExportModal';

const ROLES = ['Relationship Manager', 'Sourcing Manager', 'Digital Marketing Executive', 'Customer Success Associate', 'Software Engineer', 'Sales Executive', 'Team Leader'];
const STATUSES = ['New', 'Shortlisted', 'Interview', 'Offered', 'Hired', 'Rejected'];

function ManageAppsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [newApp, setNewApp] = useState({
    name: '', role: ROLES[0], email: '', phone: '', experience: '', status: 'New'
  });

  const fetchApps = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/job-applications');
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Please login to access applicant data');
        }
        throw new Error('Failed to retrieve candidates list');
      }
      const data = await res.json();
      setApps(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchParams = useSearchParams();
  const appIdParam = searchParams.get('appId');

  useEffect(() => {
    fetchApps();
  }, []);

  useEffect(() => {
    if (appIdParam && apps.length > 0) {
      const match = apps.find(app => app._id === appIdParam || app.id === appIdParam);
      if (match) {
        setSelectedApp(match);
      }
    }
  }, [appIdParam, apps]);

  // Derived State / Metrics
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const name = app.name || '';
      const email = app.email || '';
      const role = app.position || app.role || '';
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === 'All' || role.toLowerCase() === filterRole.toLowerCase();
      return matchesSearch && matchesRole;
    });
  }, [searchQuery, filterRole, apps]);

  const metrics = useMemo(() => ({
    total: apps.length,
    new: apps.filter(a => a.status === 'New').length,
    interviewing: apps.filter(a => a.status === 'Interview').length,
    hired: apps.filter(a => a.status === 'Hired').length,
  }), [apps]);

  // Handlers
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/job-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newApp.name,
          email: newApp.email,
          phone: newApp.phone,
          position: newApp.role,
          experience: newApp.experience,
          resumeUrl: '/uploads/manual-add.pdf' // manual fallback PDF url
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create candidate record');
      }
      const data = await res.json();
      setApps([data.application, ...apps]);
      setIsAddModalOpen(false);
      setNewApp({ name: '', role: ROLES[0], email: '', phone: '', experience: '', status: 'New' });
    } catch (err) {
      alert(err.message);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch('/api/job-applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update stage');
      const updatedApp = await res.json();
      setApps(apps.map(app => (app._id === id || app.id === id) ? updatedApp : app));
      if (selectedApp?._id === id || selectedApp?.id === id) setSelectedApp(updatedApp);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteApp = async (id) => {
    if (confirm("Are you sure you want to remove this applicant?")) {
      try {
        const res = await fetch(`/api/job-applications?id=${id}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to reject candidate');
        setApps(apps.filter(app => app._id !== id && app.id !== id));
        if (selectedApp?._id === id || selectedApp?.id === id) setSelectedApp(null);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // UI Helpers
  const getStatusStyle = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shortlisted': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Interview': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Offered': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Hired': return 'bg-green-50 text-green-700 border-green-200';
      case 'Rejected': return 'bg-slate-100 text-slate-600 border-slate-300';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* --- HEADER & METRICS --- */}
        <header className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Recruitment ATS</h1>
              <p className="text-slate-500 font-medium text-sm mt-1 flex items-center gap-2">
                <Briefcase size={16}/> HR Command Center • EUS Realty
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setExportOpen(true)} className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                <Download size={18} strokeWidth={2.5} /> Export Excel
              </button>
              <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                <Plus size={18} strokeWidth={3} /> Add Candidate
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-slate-50 text-slate-600 rounded-xl"><Users size={24}/></div>
              <div><p className="text-sm font-bold text-slate-500">Total Applicants</p><p className="text-2xl font-black text-slate-900">{metrics.total}</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FileText size={24}/></div>
              <div><p className="text-sm font-bold text-slate-500">New Resumes</p><p className="text-2xl font-black text-slate-900">{metrics.new}</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl"><CalendarDays size={24}/></div>
              <div><p className="text-sm font-bold text-slate-500">Interviewing</p><p className="text-2xl font-black text-slate-900">{metrics.interviewing}</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Award size={24}/></div>
              <div><p className="text-sm font-bold text-slate-500">Hired (YTD)</p><p className="text-2xl font-black text-slate-900">{metrics.hired}</p></div>
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* LEFT: CANDIDATE LIST */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            
            {/* Search & Filter */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" placeholder="Search by name or email..." 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative w-full sm:w-64">
                <select 
                  value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
                  className="appearance-none w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 cursor-pointer text-sm font-medium"
                >
                  <option value="All">All Roles</option>
                  {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>

            {/* List View */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Candidate Profile</th>
                      <th className="px-6 py-4">Experience</th>
                      <th className="px-6 py-4 text-center">Pipeline Stage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-16 text-center text-slate-500">
                          <p className="font-medium animate-pulse">Loading job applications...</p>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-16 text-center text-red-500">
                          <p className="font-bold">{error}</p>
                        </td>
                      </tr>
                    ) : filteredApps.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-16 text-center text-slate-500">
                          <Users size={48} className="mx-auto mb-4 text-slate-300"/>
                          <p className="font-bold text-lg text-slate-700">No candidates found</p>
                          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                        </td>
                      </tr>
                    ) : filteredApps.map(app => {
                      const appId = app._id || app.id;
                      const appRole = app.position || app.role || '';
                      const appDate = app.createdAt ? new Date(app.createdAt).toISOString().split('T')[0] : app.date || new Date().toISOString().split('T')[0];
                      return (
                        <tr 
                          key={appId} 
                          className={`hover:bg-slate-50 transition-colors group ${selectedApp?._id === appId ? 'bg-blue-50/40' : ''}`}
                        >
                          <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedApp(app)}>
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${selectedApp?._id === appId ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                {app.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                              </div>
                              <div>
                                <p className={`font-bold transition-colors ${selectedApp?._id === appId ? 'text-blue-700' : 'text-slate-900 group-hover:text-blue-600'}`}>{app.name}</p>
                                <p className="text-xs font-medium text-slate-500 mt-0.5">{appRole}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedApp(app)}>
                            <p className="text-sm font-bold text-slate-800">{app.experience}</p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1">Applied: {appDate}</p>
                          </td>
                          <td className="px-6 py-4 text-center">
                             <div className="relative inline-block w-40">
                                <select 
                                  className={`appearance-none w-full px-3 py-1.5 rounded-lg text-xs font-bold border outline-none cursor-pointer text-center transition-colors shadow-sm ${getStatusStyle(app.status)}`}
                                  value={app.status}
                                  onChange={(e) => updateStatus(appId, e.target.value)}
                                >
                                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50`} size={14} />
                             </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT: HR DETAIL SIDEBAR */}
          <aside className="relative">
            <div className="sticky top-8">
              {selectedApp ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-right-8 duration-300">
                  {/* Sidebar Header */}
                  <div className="bg-slate-900 p-8 text-white relative">
                    <button onClick={() => setSelectedApp(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-white/10 rounded-full transition-colors">
                      <X size={16} />
                    </button>
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center font-black text-2xl mb-4 border border-white/20">
                      {selectedApp.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                    </div>
                    <h2 className="text-2xl font-black">{selectedApp.name}</h2>
                    <p className="text-blue-400 font-bold text-sm mt-1">{selectedApp.position || selectedApp.role}</p>
                  </div>

                  {/* Sidebar Body */}
                  <div className="p-6">
                    {/* Quick Actions */}
                    <div className="flex gap-2 mb-6 border-b border-slate-100 pb-6">
                      <a href={`mailto:${selectedApp.email}`} className="flex-1 flex flex-col items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-xl border border-slate-200 transition-colors">
                        <Mail size={18} /> <span className="text-xs font-bold">Email</span>
                      </a>
                      <a href={`tel:${selectedApp.phone}`} className="flex-1 flex flex-col items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-xl border border-slate-200 transition-colors">
                        <Phone size={18} /> <span className="text-xs font-bold">Call</span>
                      </a>
                      <button onClick={() => deleteApp(selectedApp._id || selectedApp.id)} className="flex-1 flex flex-col items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl border border-slate-200 transition-colors">
                        <Trash2 size={18} /> <span className="text-xs font-bold">Reject</span>
                      </button>
                    </div>

                    {/* Details List */}
                    <div className="space-y-4 mb-8">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact</p>
                        <p className="text-sm font-medium text-slate-800">{selectedApp.email}</p>
                        <p className="text-sm font-medium text-slate-800">{selectedApp.phone}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Experience</p>
                          <p className="text-sm font-bold text-slate-800">{selectedApp.experience}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Education</p>
                          <p className="text-sm font-bold text-slate-800">{selectedApp.education || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Resume File */}
                    {selectedApp.resumeUrl && (
                      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <FileText size={16} className="text-blue-600"/> Resume / CV
                          </div>
                        </div>
                        <a 
                          href={selectedApp.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors flex items-center justify-center gap-2 text-center text-slate-800 no-underline"
                        >
                          <Download size={14}/> View / Download Resume
                        </a>
                      </div>
                    )}

                  </div>
                </div>
              ) : (
                <div className="h-[600px] bg-white border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-center px-8 shadow-sm">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Search size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-black text-slate-700 mb-1">No Applicant Selected</h3>
                  <p className="text-sm text-slate-500 font-medium">Click on an applicant from the list to view their full profile, resume, and manage their hiring stage.</p>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* --- ADD APPLICANT MODAL --- */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Add Manual Application</h2>
                  <p className="text-xs text-slate-500 font-bold mt-1">Enter candidate details below.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"><X size={20}/></button>
              </div>
              
              <form className="p-6 space-y-6" onSubmit={handleAddSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Full Name *</label>
                    <input required type="text" placeholder="e.g. Rahul Upadhyay" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm font-medium text-slate-950"
                      value={newApp.name} onChange={e => setNewApp({...newApp, name: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                    <input required type="tel" placeholder="+91..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm font-medium text-slate-950"
                      value={newApp.phone} onChange={e => setNewApp({...newApp, phone: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Email Address *</label>
                    <input required type="email" placeholder="rahulUpadhyay@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm font-medium text-slate-950"
                      value={newApp.email} onChange={e => setNewApp({...newApp, email: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Total Experience *</label>
                    <input required type="text" placeholder="e.g. 3 Years" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm font-medium text-slate-950"
                      value={newApp.experience} onChange={e => setNewApp({...newApp, experience: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Assign Role / Requisition *</label>
                  <div className="relative">
                    <select className="appearance-none w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 cursor-pointer text-sm font-medium text-slate-950"
                      value={newApp.role} onChange={e => setNewApp({...newApp, role: e.target.value})}>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors text-sm">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm">
                    <CheckCircle2 size={16}/> Create Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- EXPORT MODAL --- */}
        <ExportModal 
          isOpen={exportOpen}
          onClose={() => setExportOpen(false)}
          data={apps}
          filename="job_applications_export.xlsx"
          availableColumns={[
            { key: 'name', label: 'Applicant Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'position', label: 'Role / Position' },
            { key: 'experience', label: 'Experience' },
            { key: 'status', label: 'Pipeline Stage' },
            { key: 'createdAt', label: 'Applied On' }
          ]}
        />

      </div>
    </div>
  );
}

export default function ManageApps() {
  return (
    <Suspense fallback={
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-slate-500">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Loading Candidate Desk...</p>
      </div>
    }>
      <ManageAppsContent />
    </Suspense>
  );
}