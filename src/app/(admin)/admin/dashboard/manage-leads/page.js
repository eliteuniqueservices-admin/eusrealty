'use client';
import { useState, useMemo } from 'react';
import { 
  Search, Plus, Phone, Mail, Download, 
  Trash2, Edit3, X, CheckCircle2, Building2,
  Filter, MoreHorizontal, CheckSquare, Square,
  BarChart3, Users, Flame, CheckCircle
} from 'lucide-react';

// --- CONFIGURATION CONSTANTS ---
const STATUSES = ['New', 'Hot', 'Warm', 'Cold', 'Site Visit', 'Negotiation', 'Closed Won', 'Closed Lost'];
const SOURCES = ['Meta Ads', 'Google Ads', 'Walk-in', 'Referral', 'Website'];
const PROJECTS = ['VTP Bellissimo', 'Godrej Woodsville', 'Rohan Ananta', 'Vardhamaan Moonstone'];

export default function ManageLeads() {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSource, setFilterSource] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedIds, setSelectedIds] = useState([]);

  // Form State
  const [formData, setFormData] = useState({ 
    id: '', name: '', email: '', phone: '', project: PROJECTS[0], 
    source: SOURCES[0], status: 'New', budget: '' 
  });

  // Mock Data
  const [leads, setLeads] = useState([
    { id: 1, name: "Rahul Deshmukh", email: "rahul.d@example.com", project: "VTP Bellissimo", phone: "+91 98765 43210", status: "Hot", source: "Meta Ads", date: "2026-04-03", budget: 12000000 },
    { id: 2, name: "Sneha Patil", email: "sneha.p@example.com", project: "Godrej Woodsville", phone: "+91 98220 12345", status: "Warm", source: "Google Ads", date: "2026-04-02", budget: 8500000 },
    { id: 3, name: "Amit Kulkarni", email: "amit.k@example.com", project: "Rohan Ananta", phone: "+91 91234 56789", status: "Closed Won", source: "Referral", date: "2026-03-30", budget: 6500000 },
    { id: 4, name: "Priya More", email: "priya.m@example.com", project: "Vardhamaan Moonstone", phone: "+91 99887 76655", status: "Site Visit", source: "Website", date: "2026-04-01", budget: 9500000 },
    { id: 5, name: "Vikram Singh", email: "vikram.s@example.com", project: "VTP Bellissimo", phone: "+91 98111 22334", status: "New", source: "Walk-in", date: "2026-04-04", budget: 15000000 },
  ]);

  // --- LOGIC: SEARCH & FILTER ---
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'All' || lead.status === filterStatus;
      const matchesSource = filterSource === 'All' || lead.source === filterSource;
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [searchQuery, filterStatus, filterSource, leads]);

  // --- KPI METRICS ---
  const metrics = useMemo(() => {
    return {
      total: leads.length,
      hot: leads.filter(l => l.status === 'Hot').length,
      siteVisits: leads.filter(l => l.status === 'Site Visit').length,
      won: leads.filter(l => l.status === 'Closed Won').length,
    };
  }, [leads]);

  // --- FORM HANDLERS ---
  const openAddModal = () => {
    setModalMode('add');
    setFormData({ id: '', name: '', email: '', phone: '', project: PROJECTS[0], source: SOURCES[0], status: 'New', budget: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (lead) => {
    setModalMode('edit');
    setFormData({ ...lead });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newLead = { ...formData, id: Date.now(), date: new Date().toISOString().split('T')[0] };
      setLeads([newLead, ...leads]);
    } else {
      setLeads(leads.map(l => l.id === formData.id ? formData : l));
    }
    setIsModalOpen(false);
  };

  const deleteLead = (id) => {
    if(confirm("Are you sure you want to remove this lead?")) {
      setLeads(leads.filter(l => l.id !== id));
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleBulkDelete = () => {
    if(confirm(`Are you sure you want to delete ${selectedIds.length} leads?`)) {
      setLeads(leads.filter(l => !selectedIds.includes(l.id)));
      setSelectedIds([]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredLeads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLeads.map(l => l.id));
    }
  };

  const updateLeadStatus = (id, newStatus) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  // --- UTILS ---
  const exportData = () => {
    const headers = "Name,Email,Phone,Project,Source,Status,Budget,Date\n";
    const rows = filteredLeads.map(l => `"${l.name}","${l.email}","${l.phone}","${l.project}","${l.source}","${l.status}","${l.budget}","${l.date}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'crm_leads.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'New': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Hot': return 'bg-red-50 text-red-700 border-red-200';
      case 'Warm': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Site Visit': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Negotiation': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Closed Won': return 'bg-green-50 text-green-700 border-green-200';
      case 'Closed Lost': return 'bg-slate-100 text-slate-700 border-slate-300';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const formatBudgetDisplay = (amount) => {
    if (!amount || amount === 0) return 'TBD';
    const num = parseInt(amount);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* 1. HEADER & KPI DASHBOARD */}
        <header className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pipeline Manager</h1>
              <p className="text-slate-500 font-medium mt-1 text-sm flex items-center gap-2">
                <Building2 size={16}/> West Pune Real Estate Operations
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={exportData} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
                <Download size={18} /> Export
              </button>
              <button onClick={openAddModal} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                <Plus size={18} /> Add Lead
              </button>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={24}/></div>
              <div><p className="text-sm font-bold text-slate-500">Total Leads</p><p className="text-2xl font-black text-slate-900">{metrics.total}</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl"><Flame size={24}/></div>
              <div><p className="text-sm font-bold text-slate-500">Hot Prospects</p><p className="text-2xl font-black text-slate-900">{metrics.hot}</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><BarChart3 size={24}/></div>
              <div><p className="text-sm font-bold text-slate-500">Site Visits</p><p className="text-2xl font-black text-slate-900">{metrics.siteVisits}</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle size={24}/></div>
              <div><p className="text-sm font-bold text-slate-500">Closed Won</p><p className="text-2xl font-black text-slate-900">{metrics.won}</p></div>
            </div>
          </div>
        </header>

        {/* 2. ADVANCED SEARCH & FILTER BAR */}
        <section className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-4 items-center">
          <div className="relative w-full xl:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, phone, or project..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex w-full xl:w-auto gap-4">
            <div className="flex-1 xl:w-48">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm font-medium cursor-pointer"
              >
                <option value="All">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex-1 xl:w-48">
              <select 
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm font-medium cursor-pointer"
              >
                <option value="All">All Sources</option>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* 3. THE DATA TABLE (CRM VIEW) */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Bulk Action Header */}
          {selectedIds.length > 0 && (
            <div className="bg-blue-50 border-b border-blue-100 px-6 py-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <span className="text-sm font-bold text-blue-700">{selectedIds.length} lead(s) selected</span>
              <button onClick={handleBulkDelete} className="text-xs font-bold bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2">
                <Trash2 size={14}/> Delete Selected
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4 w-12 text-center">
                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-blue-600 transition-colors">
                      {selectedIds.length === filteredLeads.length && filteredLeads.length > 0 ? <CheckSquare size={18} className="text-blue-600"/> : <Square size={18}/>}
                    </button>
                  </th>
                  <th className="px-6 py-4">Lead Details</th>
                  <th className="px-6 py-4">Project & Source</th>
                  <th className="px-6 py-4">Budget</th>
                  <th className="px-6 py-4">Pipeline Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      <p className="font-bold text-lg">No leads found</p>
                      <p className="text-sm mt-1">Try adjusting your filters or search terms.</p>
                    </td>
                  </tr>
                ) : filteredLeads.map((lead) => (
                  <tr key={lead.id} className={`hover:bg-slate-50 transition-colors group ${selectedIds.includes(lead.id) ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-6 py-5 text-center">
                      <button onClick={() => {
                        setSelectedIds(prev => prev.includes(lead.id) ? prev.filter(id => id !== lead.id) : [...prev, lead.id])
                      }} className="text-slate-300 hover:text-blue-600 transition-colors">
                        {selectedIds.includes(lead.id) ? <CheckSquare size={18} className="text-blue-600"/> : <Square size={18}/>}
                      </button>
                    </td>
                    
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                          {lead.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{lead.name}</p>
                          <div className="flex items-center gap-3 mt-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-2 py-1 rounded-md">
                              <Phone size={12}/> {lead.phone}
                            </a>
                            {lead.email && (
                              <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-2 py-1 rounded-md">
                                <Mail size={12}/> Email
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-800">{lead.project}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                         <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>{lead.source}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm font-black text-slate-900">
                      {formatBudgetDisplay(lead.budget)}
                    </td>

                    <td className="px-6 py-5">
                      {/* Interactive Status Dropdown right in the table */}
                      <select 
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border outline-none cursor-pointer appearance-none text-center ${getStatusStyles(lead.status)}`}
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(lead)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Lead">
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => deleteLead(lead.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Lead">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. MODAL (ADD/EDIT) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {modalMode === 'add' ? 'Create New Lead' : 'Edit Lead Profile'}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">Fill out the prospect's information below.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"><X size={20}/></button>
              </div>
              
              <form className="p-6 space-y-6" onSubmit={handleFormSubmit}>
                
                {/* Contact Info */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Full Name *</label>
                      <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm font-medium"
                        value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Email Address</label>
                      <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm font-medium"
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                      <input required type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm font-medium"
                        value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Pipeline Info */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Pipeline Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Interested Project</label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 cursor-pointer text-sm font-medium"
                        value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})}>
                        {PROJECTS.map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Lead Source</label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 cursor-pointer text-sm font-medium"
                        value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})}>
                        {SOURCES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Budget (₹)</label>
                      <input type="number" placeholder="e.g. 15000000" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm font-medium"
                        value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} />
                      <p className="text-[11px] text-slate-500 font-medium">Display: {formatBudgetDisplay(formData.budget)}</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Initial Status</label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 cursor-pointer text-sm font-medium"
                        value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors text-sm">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm">
                    {modalMode === 'add' ? <Plus size={16}/> : <CheckCircle2 size={16}/>}
                    {modalMode === 'add' ? 'Save New Lead' : 'Update Lead'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}