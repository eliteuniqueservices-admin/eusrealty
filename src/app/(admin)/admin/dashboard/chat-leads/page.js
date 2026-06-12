'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  MessageSquare, Users, ShieldAlert, Award, Search, 
  Send, User, Bot, Calendar, Phone, Mail, DollarSign, 
  MapPin, Home, Clock, Plus, Save, Download, Trash2
} from 'lucide-react';
import ExportModal from '@/components/admin/ExportModal';

export default function ChatLeadsPage() {
  const [sessions, setSessions] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [leads, setLeads] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [exportOpen, setExportOpen] = useState(false);
  
  // Filter/Pagination States
  const [search, setSearch] = useState('');
  const [quality, setQuality] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Selected Item details
  const [selectedSession, setSelectedSession] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [savingLead, setSavingLead] = useState(false);
  const [deletingLead, setDeletingLead] = useState(false);
  
  // Edited Lead details state
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: '',
    budget: '',
    preferredLocation: '',
    propertyType: '',
    possession: '',
    leadQuality: 'Cold',
    status: 'New',
  });

  // Load stats
  const [stats, setStats] = useState({
    totalChats: 0,
    totalLeads: 0,
    hotLeads: 0,
    escalated: 0,
  });

  const loadStats = async () => {
    try {
      const [sessionsRes, leadsRes] = await Promise.all([
        fetch('/api/chat/sessions?limit=1000'),
        fetch('/api/leads?limit=1000')
      ]);

      if (sessionsRes.ok && leadsRes.ok) {
        const sessionsData = await sessionsRes.json();
        const leadsData = await leadsRes.json();

        const totalChats = sessionsData.total || 0;
        const totalL = leadsData.total || 0;
        const hot = leadsData.leads?.filter(l => l.leadQuality === 'Hot').length || 0;
        const esc = leadsData.leads?.filter(l => l.status === 'Escalated').length || 
                    sessionsData.sessions?.filter(s => s.status === 'Escalated').length || 0;

        setStats({
          totalChats,
          totalLeads: totalL,
          hotLeads: hot,
          escalated: esc,
        });
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadSessionsAndLeads = async () => {
    try {
      let url = `/api/leads?page=${page}&limit=10`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (quality !== 'ALL') url += `&quality=${quality}`;
      if (status !== 'ALL') url += `&status=${status}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        setTotalLeads(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadSessionsAndLeads();
  }, [page, search, quality, status]);

  const selectLead = async (lead) => {
    setSelectedSession(lead);
    setNoteText('');
    setEditForm({
      name: lead.name || '',
      phone: lead.phone || '',
      email: lead.email || '',
      budget: lead.budget || '',
      preferredLocation: lead.preferredLocation || '',
      propertyType: lead.propertyType || '',
      possession: lead.possession || '',
      leadQuality: lead.leadQuality || 'Cold',
      status: lead.status || 'New',
    });

    if (lead.sessionId) {
      setLoadingChat(true);
      try {
        const res = await fetch(`/api/chat/sessions/${lead.sessionId}`);
        if (res.ok) {
          const sessionData = await res.json();
          setChatHistory(sessionData.messages || []);
        } else {
          setChatHistory([]);
        }
      } catch (err) {
        console.error('Failed to fetch chat history:', err);
        setChatHistory([]);
      } finally {
        setLoadingChat(false);
      }
    } else {
      setChatHistory([]);
    }
  };

  const handleUpdateLead = async (e) => {
    e.preventDefault();
    if (!selectedSession) return;

    setSavingLead(true);
    try {
      const payload = {
        ...editForm,
      };
      if (noteText.trim()) {
        payload.noteText = noteText;
      }

      const res = await fetch(`/api/leads/${selectedSession._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedSession(updated);
        setNoteText('');
        // Reload list & stats
        loadSessionsAndLeads();
        loadStats();
      }
    } catch (err) {
      console.error('Failed to update lead:', err);
    } finally {
      setSavingLead(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!selectedSession) return;
    if (!confirm('Are you sure you want to delete this lead? This action cannot be undone.')) return;

    setDeletingLead(true);
    try {
      const res = await fetch(`/api/leads/${selectedSession._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSelectedSession(null);
        setEditForm({
          name: '',
          phone: '',
          email: '',
          budget: '',
          preferredLocation: '',
          propertyType: '',
          possession: '',
          leadQuality: 'Cold',
          status: 'New',
        });
        setChatHistory([]);
        loadSessionsAndLeads();
        loadStats();
      } else {
        alert('Failed to delete lead.');
      }
    } catch (err) {
      console.error('Failed to delete lead:', err);
      alert('An error occurred while deleting the lead.');
    } finally {
      setDeletingLead(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-500/10 via-transparent to-transparent pointer-events-none rounded-bl-full" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-bold rounded-full mb-4 shadow-sm">
            <MessageSquare size={14} className="animate-pulse" /> AI Chat Assistant
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Chat & <span className="text-cyan-600">AI Leads Manager</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Monitor real-time AI assistant conversations, track lead scoring, and manage your property client pipeline.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-200/60 overflow-hidden group rounded-3xl">
          <CardContent className="p-5 md:p-6 flex items-center gap-4 relative h-full">
            <div className="p-4 rounded-2xl border text-blue-600 bg-blue-50 border-blue-100 group-hover:scale-110 transition-transform duration-300 z-10 bg-white">
              <MessageSquare size={24} />
            </div>
            <div className="z-10">
              <p className="text-xs md:text-sm text-slate-500 font-bold tracking-wide uppercase">Conversations</p>
              <p className="text-2xl md:text-3xl font-black text-slate-900 mt-1">{stats.totalChats}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-slate-200/60 overflow-hidden group rounded-3xl">
          <CardContent className="p-5 md:p-6 flex items-center gap-4 relative h-full">
            <div className="p-4 rounded-2xl border text-emerald-600 bg-emerald-50 border-emerald-100 group-hover:scale-110 transition-transform duration-300 z-10 bg-white">
              <Users size={24} />
            </div>
            <div className="z-10">
              <p className="text-xs md:text-sm text-slate-500 font-bold tracking-wide uppercase">Total Leads</p>
              <p className="text-2xl md:text-3xl font-black text-slate-900 mt-1">{stats.totalLeads}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-slate-200/60 overflow-hidden group rounded-3xl">
          <CardContent className="p-5 md:p-6 flex items-center gap-4 relative h-full">
            <div className="p-4 rounded-2xl border text-rose-600 bg-rose-50 border-rose-100 group-hover:scale-110 transition-transform duration-300 z-10 bg-white">
              <Award size={24} />
            </div>
            <div className="z-10">
              <p className="text-xs md:text-sm text-slate-500 font-bold tracking-wide uppercase">🔥 Hot Leads</p>
              <p className="text-2xl md:text-3xl font-black text-slate-900 mt-1">{stats.hotLeads}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-slate-200/60 overflow-hidden group rounded-3xl">
          <CardContent className="p-5 md:p-6 flex items-center gap-4 relative h-full">
            <div className="p-4 rounded-2xl border text-amber-600 bg-amber-50 border-amber-100 group-hover:scale-110 transition-transform duration-300 z-10 bg-white">
              <ShieldAlert size={24} />
            </div>
            <div className="z-10">
              <p className="text-xs md:text-sm text-slate-500 font-bold tracking-wide uppercase">Escalated</p>
              <p className="text-2xl md:text-3xl font-black text-slate-900 mt-1">{stats.escalated}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Left List, Right Detail/Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Leads List */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-sm border-slate-200/60 rounded-[2rem] overflow-hidden flex flex-col bg-white">
            <div className="p-6 md:p-8 border-b border-slate-100 space-y-4">
              <CardTitle className="text-xl font-black text-slate-900">Qualified Leads List</CardTitle>
              
              {/* Filter Row */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="Search name, phone, email..." 
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                      className="pl-9 h-11 rounded-xl border-slate-200 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 font-medium"
                    />
                  </div>
                  
                  <div className="w-full md:w-40">
                    <Select value={quality} onValueChange={(val) => { setQuality(val); setPage(1); }}>
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 font-bold text-slate-700">
                        <SelectValue placeholder="Quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Quality</SelectItem>
                        <SelectItem value="Hot">🔥 Hot</SelectItem>
                        <SelectItem value="Warm">🟡 Warm</SelectItem>
                        <SelectItem value="Cold">❄️ Cold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full md:w-44">
                    <Select value={status} onValueChange={(val) => { setStatus(val); setPage(1); }}>
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 font-bold text-slate-700">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Interested">Interested</SelectItem>
                        <SelectItem value="Escalated">Escalated</SelectItem>
                        <SelectItem value="Converted">Converted</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={() => setExportOpen(true)}
                  variant="outline"
                  className="h-11 border-slate-200 text-slate-700 font-bold rounded-xl gap-2 hover:bg-slate-50"
                >
                  <Download size={16} /> Export Excel
                </Button>
              </div>
            </div>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-slate-100">
                      <TableHead className="font-bold text-slate-700 pl-6">Client</TableHead>
                      <TableHead className="font-bold text-slate-700">Interest</TableHead>
                      <TableHead className="font-bold text-slate-700 text-center">Score</TableHead>
                      <TableHead className="font-bold text-slate-700 text-center">Status</TableHead>
                      <TableHead className="font-bold text-slate-700 text-right pr-6">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-16 text-slate-500 font-medium">
                          No leads matching your filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      leads.map((lead) => (
                        <TableRow 
                          key={lead._id} 
                          onClick={() => selectLead(lead)}
                          className={`cursor-pointer hover:bg-slate-50/80 transition-colors group ${selectedSession?._id === lead._id ? 'bg-cyan-50/30' : ''}`}
                        >
                          <TableCell className="pl-6 py-4">
                            <div>
                              <p className="font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">{lead.name}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{lead.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-xs font-semibold text-slate-700">
                              {lead.preferredLocation ? <span>📍 {lead.preferredLocation} </span> : null}
                              {lead.budget ? <span>💵 {lead.budget}</span> : null}
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                              lead.leadQuality === 'Hot' ? 'bg-red-50 text-red-700 border border-red-100' :
                              lead.leadQuality === 'Warm' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                              'bg-blue-50 text-blue-700 border border-blue-100'
                            }`}>
                              {lead.leadQuality === 'Hot' ? '🔥' : lead.leadQuality === 'Warm' ? '🟡' : '❄️'} {lead.leadScore}
                            </span>
                          </TableCell>
                          <TableCell className="text-center py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                              lead.status === 'New' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              lead.status === 'Converted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              lead.status === 'Escalated' ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse' :
                              lead.status === 'Lost' ? 'bg-slate-100 text-slate-600' :
                              'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}>
                              {lead.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right pr-6 py-4 text-xs text-slate-500 font-medium">
                            {new Date(lead.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-6 border-t border-slate-100 bg-slate-50/50">
                  <Button 
                    variant="outline" 
                    disabled={page === 1} 
                    onClick={() => setPage(prev => prev - 1)}
                    className="rounded-xl border-slate-200 hover:bg-slate-100 font-bold"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-slate-500 font-bold">
                    Page {page} of {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    disabled={page === totalPages} 
                    onClick={() => setPage(prev => prev + 1)}
                    className="rounded-xl border-slate-200 hover:bg-slate-100 font-bold"
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Chat & Edit Pipeline */}
        <div className="lg:col-span-5 space-y-6">
          {!selectedSession ? (
            <Card className="shadow-sm border-slate-200/60 rounded-[2rem] p-12 text-center bg-white h-[600px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <Users size={28} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-black text-slate-800">No Lead Selected</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                Click any lead in the table on the left to view their conversation history, scoring details, and manage pipeline status.
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              
              {/* Client Profile and Update Form */}
              <Card className="shadow-sm border-slate-200/60 rounded-[2rem] overflow-hidden bg-white">
                <CardHeader className="border-b border-slate-100 pb-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-black text-slate-900">{editForm.name || 'Chat Lead'}</CardTitle>
                      <CardDescription className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                        <Clock size={12} /> Last active: {new Date(selectedSession.updatedAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={selectedSession.leadQuality === 'Hot' ? 'destructive' : selectedSession.leadQuality === 'Warm' ? 'warning' : 'default'} className="font-bold rounded-lg px-2.5 py-1">
                        {selectedSession.leadQuality} ({selectedSession.leadScore}/100)
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg h-8 w-8"
                        onClick={handleDeleteLead}
                        disabled={deletingLead}
                        title="Delete Lead"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <form onSubmit={handleUpdateLead} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-bold text-slate-600">Client Name</Label>
                        <Input 
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="h-10 rounded-lg border-slate-200"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-bold text-slate-600">Phone</Label>
                        <Input 
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="h-10 rounded-lg border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-bold text-slate-600">Email Address</Label>
                      <Input 
                        id="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        className="h-10 rounded-lg border-slate-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="budget" className="text-xs font-bold text-slate-600">Budget</Label>
                        <Input 
                          id="budget"
                          placeholder="e.g. 80 Lakhs - 1.2 Cr"
                          value={editForm.budget}
                          onChange={(e) => setEditForm(prev => ({ ...prev, budget: e.target.value }))}
                          className="h-10 rounded-lg border-slate-200"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="location" className="text-xs font-bold text-slate-600">Preferred Location</Label>
                        <Input 
                          id="location"
                          placeholder="e.g. Baner, Pune"
                          value={editForm.preferredLocation}
                          onChange={(e) => setEditForm(prev => ({ ...prev, preferredLocation: e.target.value }))}
                          className="h-10 rounded-lg border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="propType" className="text-xs font-bold text-slate-600">Property Type</Label>
                        <Input 
                          id="propType"
                          placeholder="e.g. 2BHK Apartment"
                          value={editForm.propertyType}
                          onChange={(e) => setEditForm(prev => ({ ...prev, propertyType: e.target.value }))}
                          className="h-10 rounded-lg border-slate-200"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="possession" className="text-xs font-bold text-slate-600">Possession</Label>
                        <Input 
                          id="possession"
                          placeholder="e.g. Ready / 1 Year"
                          value={editForm.possession}
                          onChange={(e) => setEditForm(prev => ({ ...prev, possession: e.target.value }))}
                          className="h-10 rounded-lg border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Lead Quality</Label>
                        <Select 
                          value={editForm.leadQuality} 
                          onValueChange={(val) => setEditForm(prev => ({ ...prev, leadQuality: val }))}
                        >
                          <SelectTrigger className="h-10 rounded-lg border-slate-200 font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Hot">🔥 Hot</SelectItem>
                            <SelectItem value="Warm">🟡 Warm</SelectItem>
                            <SelectItem value="Cold">❄️ Cold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Status</Label>
                        <Select 
                          value={editForm.status} 
                          onValueChange={(val) => setEditForm(prev => ({ ...prev, status: val }))}
                        >
                          <SelectTrigger className="h-10 rounded-lg border-slate-200 font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Contacted">Contacted</SelectItem>
                            <SelectItem value="Interested">Interested</SelectItem>
                            <SelectItem value="Escalated">Escalated</SelectItem>
                            <SelectItem value="Converted">Converted</SelectItem>
                            <SelectItem value="Lost">Lost</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Site Visit / Callback Quick Info */}
                    {(selectedSession.siteVisitRequested || selectedSession.callbackRequested) && (
                      <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex flex-wrap gap-3">
                        {selectedSession.siteVisitRequested && (
                          <Badge variant="destructive" className="font-bold flex gap-1 items-center px-2 py-0.5 rounded-lg">
                            🏠 Site Visit Requested
                          </Badge>
                        )}
                        {selectedSession.callbackRequested && (
                          <Badge variant="warning" className="font-bold flex gap-1 items-center px-2 py-0.5 rounded-lg text-amber-800 bg-amber-100 border-amber-200">
                            📞 Callback Requested
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Notes history */}
                    {selectedSession.notes && selectedSession.notes.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-600">Admin Notes History</Label>
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 max-h-32 overflow-y-auto space-y-2">
                          {selectedSession.notes.map((note, idx) => (
                            <div key={idx} className="text-xs border-b border-slate-200/60 pb-1.5 last:border-0 last:pb-0">
                              <p className="font-bold text-slate-700">{note.addedBy} • <span className="text-[10px] font-medium text-slate-400">{new Date(note.addedAt).toLocaleDateString()}</span></p>
                              <p className="text-slate-600 mt-0.5 font-medium">{note.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add note text */}
                    <div className="space-y-1.5">
                      <Label htmlFor="note" className="text-xs font-bold text-slate-600">Add Admin Note</Label>
                      <Input 
                        id="note"
                        placeholder="Type admin note or callback summary..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="h-10 rounded-lg border-slate-200"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={savingLead}
                      className="w-full h-11 bg-cyan-600 hover:bg-cyan-700 font-bold rounded-xl gap-2 shadow-lg shadow-cyan-600/10"
                    >
                      <Save size={16} /> {savingLead ? 'Saving...' : 'Update Lead Data & Notes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Chat Session Viewer */}
              {selectedSession.sessionId && (
                <Card className="shadow-sm border-slate-200/60 rounded-[2rem] overflow-hidden bg-white">
                  <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4">
                    <CardTitle className="text-base font-black text-slate-800 flex items-center gap-2">
                      <MessageSquare size={18} className="text-cyan-600" /> AI Conversation Log
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {loadingChat ? (
                      <div className="py-12 text-center text-sm font-semibold text-slate-400 animate-pulse">
                        Loading dialogue transcript...
                      </div>
                    ) : chatHistory.length === 0 ? (
                      <div className="py-12 text-center text-xs font-bold text-slate-400">
                        No messages found for this chat session.
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {chatHistory.map((msg, index) => {
                          const isUser = msg.role === 'user';
                          return (
                            <div 
                              key={index}
                              className={`flex items-start gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                                isUser 
                                  ? 'bg-slate-100 border-slate-200 text-slate-600' 
                                  : 'bg-cyan-50 border-cyan-100 text-cyan-600'
                              }`}>
                                {isUser ? <User size={14} /> : <Bot size={14} />}
                              </div>
                              <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                                isUser 
                                  ? 'bg-slate-100 border border-slate-200/60 text-slate-800 rounded-tr-none' 
                                  : 'bg-cyan-50/70 border border-cyan-100/60 text-slate-800 rounded-tl-none font-medium'
                              }`}>
                                <p className="whitespace-pre-line">{msg.content}</p>
                                <span className="block text-[9px] text-slate-400 text-right mt-1.5 font-medium">
                                  {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

            </div>
          )}
        </div>

      </div>

      <ExportModal 
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        data={leads}
        filename="chat_leads_export.xlsx"
        availableColumns={[
          { key: 'name', label: 'Client Name' },
          { key: 'phone', label: 'Phone' },
          { key: 'email', label: 'Email' },
          { key: 'leadQuality', label: 'Quality' },
          { key: 'leadScore', label: 'Score' },
          { key: 'status', label: 'Status' },
          { key: 'budget', label: 'Budget' },
          { key: 'preferredLocation', label: 'Location' },
          { key: 'propertyType', label: 'Property Type' },
          { key: 'updatedAt', label: 'Last Active' }
        ]}
      />
    </div>
  );
}
