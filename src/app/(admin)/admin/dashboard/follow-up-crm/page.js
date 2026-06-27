'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  Target, Users, AlertTriangle, Clock, CheckCircle2, Search,
  Phone, Mail, MessageSquare, MapPin, CalendarClock, Plus, Save,
  Send, Building2, Eye, ExternalLink, ChevronRight, Trash2,
  Calendar, UserCheck, TrendingUp, ArrowRight, CircleDot, X
} from 'lucide-react';

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────
const FOLLOW_UP_TYPES = [
  { value: 'call', label: 'Phone Call', icon: '📞', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { value: 'email', label: 'Email', icon: '📧', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '💬', color: 'text-green-600 bg-green-50 border-green-200' },
  { value: 'site_visit', label: 'Site Visit', icon: '🏠', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { value: 'meeting', label: 'Meeting', icon: '🤝', color: 'text-rose-600 bg-rose-50 border-rose-200' },
];

function getFollowUpMeta(type) {
  return FOLLOW_UP_TYPES.find(t => t.value === type) || FOLLOW_UP_TYPES[0];
}

function formatDate(d, opts = {}) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: opts.year ? 'numeric' : undefined, ...opts });
}

function formatDateTime(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function isOverdue(date) {
  if (!date) return false;
  const now = new Date();
  const d = new Date(date);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return d < todayStart;
}

function isDueToday(date) {
  if (!date) return false;
  const now = new Date();
  const d = new Date(date);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  return d >= todayStart && d < tomorrowStart;
}

function timeAgo(date) {
  if (!date) return 'Never';
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

// ──────────────────────────────────────────────────────────
// Stat Card Component
// ──────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, bgColor, borderColor, iconBg, pulse }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-slate-200/60 overflow-hidden group rounded-3xl">
      <CardContent className="p-5 md:p-6 flex items-center gap-4 relative h-full">
        <div className={`p-4 rounded-2xl border ${iconBg} group-hover:scale-110 transition-transform duration-300 z-10 bg-white`}>
          <Icon size={24} className={color} />
        </div>
        <div className="z-10">
          <p className="text-xs md:text-sm text-slate-500 font-bold tracking-wide uppercase">{label}</p>
          <p className={`text-2xl md:text-3xl font-black text-slate-900 mt-1 ${pulse ? 'animate-pulse' : ''}`}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ──────────────────────────────────────────────────────────
// Pipeline Funnel Component
// ──────────────────────────────────────────────────────────
function PipelineFunnel({ stats }) {
  const stages = [
    { key: 'New', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50', emoji: '🆕' },
    { key: 'Contacted', color: 'bg-indigo-500', textColor: 'text-indigo-700', bgColor: 'bg-indigo-50', emoji: '📞' },
    { key: 'Interested', color: 'bg-violet-500', textColor: 'text-violet-700', bgColor: 'bg-violet-50', emoji: '💜' },
    { key: 'Escalated', color: 'bg-amber-500', textColor: 'text-amber-700', bgColor: 'bg-amber-50', emoji: '⚡' },
    { key: 'Converted', color: 'bg-emerald-500', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50', emoji: '✅' },
    { key: 'Lost', color: 'bg-slate-400', textColor: 'text-slate-600', bgColor: 'bg-slate-50', emoji: '❌' },
  ];

  const total = Object.values(stats).reduce((a, b) => a + b, 0) || 1;

  return (
    <Card className="shadow-sm border-slate-200/60 rounded-[2rem] overflow-hidden bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-black text-slate-800 flex items-center gap-2">
          <TrendingUp size={18} className="text-violet-600" /> Lead Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="flex items-end gap-1.5 h-24">
          {stages.map(stage => {
            const count = stats[stage.key] || 0;
            const pct = Math.max(8, (count / total) * 100);
            return (
              <div key={stage.key} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-black text-slate-800">{count}</span>
                <div
                  className={`w-full rounded-t-lg ${stage.color} transition-all duration-500`}
                  style={{ height: `${pct}%`, minHeight: '6px' }}
                />
                <span className="text-[10px] font-bold text-slate-500 truncate w-full text-center">{stage.emoji} {stage.key}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ──────────────────────────────────────────────────────────
// Schedule Follow-up Modal
// ──────────────────────────────────────────────────────────
function ScheduleFollowUpModal({ open, onClose, onSchedule, leadName }) {
  const [type, setType] = useState('call');
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!type || !scheduledAt) return;
    setSubmitting(true);
    await onSchedule({ type, scheduledAt, notes });
    setSubmitting(false);
    setType('call');
    setScheduledAt('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900">Schedule Follow-up</DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Schedule a follow-up for <span className="font-bold text-slate-700">{leadName}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-600">Follow-up Type</Label>
            <div className="grid grid-cols-5 gap-2">
              {FOLLOW_UP_TYPES.map(ft => (
                <button
                  key={ft.value}
                  type="button"
                  onClick={() => setType(ft.value)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all text-xs font-bold ${
                    type === ft.value
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700 shadow-sm'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className="text-lg">{ft.icon}</span>
                  <span className="text-[10px] leading-none">{ft.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-600">Date & Time</Label>
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="h-10 rounded-lg border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-600">Notes (optional)</Label>
            <Input
              placeholder="e.g., Discuss 3BHK options in Baner"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-10 rounded-lg border-slate-200"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={!scheduledAt || submitting}
            className="bg-cyan-600 hover:bg-cyan-700 font-bold rounded-xl gap-2"
          >
            <CalendarClock size={16} /> {submitting ? 'Scheduling...' : 'Schedule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ──────────────────────────────────────────────────────────
// Complete Follow-up Modal
// ──────────────────────────────────────────────────────────
function CompleteFollowUpModal({ open, onClose, onComplete, followUp }) {
  const [outcome, setOutcome] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await onComplete({ followUpId: followUp?._id, outcome });
    setSubmitting(false);
    setOutcome('');
    onClose();
  };

  if (!followUp) return null;
  const meta = getFollowUpMeta(followUp.type);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900">Complete Follow-up</DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {meta.icon} {meta.label} — scheduled for {formatDateTime(followUp.scheduledAt)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-600">Outcome / Summary</Label>
            <textarea
              placeholder="e.g., Client is interested in 2BHK in Baner, will schedule site visit next week..."
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl gap-2"
          >
            <CheckCircle2 size={16} /> {submitting ? 'Completing...' : 'Mark Complete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ──────────────────────────────────────────────────────────
// Send Properties Modal
// ──────────────────────────────────────────────────────────
function SendPropertiesModal({ open, onClose, onSend, leadName, leadPhone, leadEmail }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [channel, setChannel] = useState('whatsapp');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch('/api/properties')
        .then(res => res.json())
        .then(data => {
          setProperties(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
      setSelectedIds([]);
      setSearchTerm('');
      setChannel('whatsapp');
    }
  }, [open]);

  const filtered = properties.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.developer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProperty = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSend = async () => {
    if (selectedIds.length === 0) return;
    setSending(true);
    await onSend({ propertyIds: selectedIds, channel });
    setSending(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl rounded-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900">Send Properties to {leadName}</DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Select properties and choose a channel to share recommendations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 flex-1 overflow-hidden flex flex-col">
          {/* Channel Selector */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setChannel('whatsapp')}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 font-bold text-sm transition-all ${
                channel === 'whatsapp'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              💬 WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setChannel('email')}
              disabled={!leadEmail}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 font-bold text-sm transition-all ${
                channel === 'email'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : !leadEmail
                    ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              📧 Email {!leadEmail && <span className="text-[10px]">(no email)</span>}
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 rounded-xl border-slate-200"
            />
          </div>

          {/* Property List */}
          <div className="flex-1 overflow-y-auto space-y-2 max-h-[320px] pr-1">
            {loading ? (
              <div className="py-12 text-center text-sm text-slate-400 animate-pulse font-bold">Loading properties...</div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400 font-bold">No properties found</div>
            ) : (
              filtered.map(prop => {
                const isSelected = selectedIds.includes(prop._id);
                const price = prop.configDetails?.[0]?.price || 'Price on Request';
                const configs = prop.configurations?.join(', ') || '';
                return (
                  <div
                    key={prop._id}
                    onClick={() => toggleProperty(prop._id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50/50 shadow-sm'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-slate-300'
                    }`}>
                      {isSelected && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-900 truncate">{prop.name}</p>
                      <p className="text-xs text-slate-500 truncate">
                        📍 {prop.location} {configs && `• ${configs}`}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-amber-600">{price}</p>
                      <p className="text-[10px] text-slate-400">{prop.status || ''}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {selectedIds.length > 0 && (
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3 text-sm font-bold text-cyan-700 flex items-center gap-2">
              <CheckCircle2 size={16} /> {selectedIds.length} {selectedIds.length === 1 ? 'property' : 'properties'} selected
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
          <Button
            onClick={handleSend}
            disabled={selectedIds.length === 0 || sending}
            className={`font-bold rounded-xl gap-2 ${
              channel === 'whatsapp'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            <Send size={16} /> {sending ? 'Sending...' : `Send via ${channel === 'whatsapp' ? 'WhatsApp' : 'Email'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ──────────────────────────────────────────────────────────
// Follow-up Timeline Component
// ──────────────────────────────────────────────────────────
function FollowUpTimeline({ followUps, onComplete }) {
  if (!followUps || followUps.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-slate-400 font-medium">
        No follow-ups yet. Schedule one to get started.
      </div>
    );
  }

  return (
    <div className="space-y-0 relative">
      {/* Timeline line */}
      <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-slate-200" />

      {followUps.map((fu, idx) => {
        const meta = getFollowUpMeta(fu.type);
        const isPending = !fu.completedAt;
        const overdue = isPending && isOverdue(fu.scheduledAt);
        const dueToday = isPending && isDueToday(fu.scheduledAt);

        return (
          <div key={fu._id || idx} className="relative pl-10 pb-4 last:pb-0">
            {/* Timeline dot */}
            <div className={`absolute left-2 top-1.5 w-[14px] h-[14px] rounded-full border-2 z-10 ${
              fu.completedAt
                ? 'bg-emerald-500 border-emerald-500'
                : overdue
                  ? 'bg-red-500 border-red-500 animate-pulse'
                  : dueToday
                    ? 'bg-amber-400 border-amber-400 animate-pulse'
                    : 'bg-white border-cyan-400'
            }`} />

            <div className={`rounded-xl border p-3 transition-all ${
              overdue
                ? 'border-red-200 bg-red-50/50'
                : dueToday
                  ? 'border-amber-200 bg-amber-50/30'
                  : fu.completedAt
                    ? 'border-slate-100 bg-slate-50/30'
                    : 'border-cyan-100 bg-cyan-50/20'
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${meta.color}`}>
                    {meta.icon} {meta.label}
                  </span>
                  {overdue && <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-md">OVERDUE</span>}
                  {dueToday && <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-md">TODAY</span>}
                  {fu.completedAt && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md">DONE</span>}
                </div>
                {isPending && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onComplete(fu)}
                    className="h-7 text-xs font-bold rounded-lg border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-2"
                  >
                    <CheckCircle2 size={12} className="mr-1" /> Complete
                  </Button>
                )}
              </div>

              <div className="mt-2 text-xs text-slate-600">
                <span className="font-bold text-slate-700">
                  {isPending ? '📅 Scheduled: ' : '✅ Completed: '}
                </span>
                {isPending ? formatDateTime(fu.scheduledAt) : formatDateTime(fu.completedAt)}
              </div>

              {fu.notes && (
                <p className="mt-1 text-xs text-slate-500 italic">💬 {fu.notes}</p>
              )}
              {fu.outcome && (
                <p className="mt-1 text-xs text-slate-700 font-medium">📝 {fu.outcome}</p>
              )}
              <p className="mt-1 text-[10px] text-slate-400">By {fu.addedBy || 'Admin'}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Main CRM Page Content
// ──────────────────────────────────────────────────────────
function FollowUpCRMContent() {
  // State
  const [stats, setStats] = useState({
    totalLeads: 0, overdueCount: 0, dueTodayCount: 0,
    upcomingWeekCount: 0, completedThisWeekCount: 0, noFollowUpCount: 0,
    pipelineStats: { New: 0, Contacted: 0, Interested: 0, Escalated: 0, Converted: 0, Lost: 0 },
  });
  const [leads, setLeads] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [quality, setQuality] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [followUpFilter, setFollowUpFilter] = useState('ALL');

  const [selectedLead, setSelectedLead] = useState(null);
  const [leadFollowUps, setLeadFollowUps] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Edit form
  const [editForm, setEditForm] = useState({
    name: '', phone: '', email: '', budget: '', preferredLocation: '',
    propertyType: '', possession: '', leadQuality: 'Cold', status: 'New',
    objective: '', position: '',
  });
  const [noteText, setNoteText] = useState('');
  const [savingLead, setSavingLead] = useState(false);

  // Modals
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [sendPropsModalOpen, setSendPropsModalOpen] = useState(false);
  const [completingFollowUp, setCompletingFollowUp] = useState(null);

  // ────────────────────────────────────────────
  // Data fetching
  // ────────────────────────────────────────────
  const loadStats = useCallback(async () => {
    try {
      const res = await fetch('/api/leads/crm-stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load CRM stats:', err);
    }
  }, []);

  const loadLeads = useCallback(async () => {
    try {
      let url = `/api/leads?page=${page}&limit=15`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (quality !== 'ALL') url += `&quality=${quality}`;
      if (statusFilter !== 'ALL') url += `&status=${statusFilter}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        let filteredLeads = data.leads || [];

        // Client-side filter for follow-up status
        if (followUpFilter !== 'ALL') {
          const now = new Date();
          const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const tomorrowStart = new Date(todayStart);
          tomorrowStart.setDate(tomorrowStart.getDate() + 1);

          filteredLeads = filteredLeads.filter(lead => {
            const nf = lead.nextFollowUp ? new Date(lead.nextFollowUp) : null;
            switch (followUpFilter) {
              case 'OVERDUE':
                return nf && nf < todayStart;
              case 'TODAY':
                return nf && nf >= todayStart && nf < tomorrowStart;
              case 'UPCOMING':
                return nf && nf >= tomorrowStart;
              case 'NONE':
                return !nf && lead.status !== 'Converted' && lead.status !== 'Lost';
              default:
                return true;
            }
          });
        }

        setLeads(filteredLeads);
        setTotalLeads(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    }
  }, [page, search, quality, statusFilter, followUpFilter]);

  const loadLeadDetail = useCallback(async (lead) => {
    setSelectedLead(lead);
    setLoadingDetail(true);
    setEditForm({
      name: lead.name || '', phone: lead.phone || '', email: lead.email || '',
      budget: lead.budget || '', preferredLocation: lead.preferredLocation || '',
      propertyType: lead.propertyType || '', possession: lead.possession || '',
      leadQuality: lead.leadQuality || 'Cold', status: lead.status || 'New',
      objective: lead.objective || '', position: lead.position || '',
    });
    setNoteText('');

    try {
      const res = await fetch(`/api/leads/${lead._id}/follow-ups`);
      if (res.ok) {
        const data = await res.json();
        setLeadFollowUps(data.followUps || []);
      } else {
        setLeadFollowUps([]);
      }
    } catch (err) {
      console.error('Failed to load follow-ups:', err);
      setLeadFollowUps([]);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { loadLeads(); }, [loadLeads]);

  // ────────────────────────────────────────────
  // Actions
  // ────────────────────────────────────────────
  const handleUpdateLead = async (e) => {
    e.preventDefault();
    if (!selectedLead) return;

    if (editForm.phone) {
      const phoneDigits = editForm.phone.replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        alert('Please enter a valid 10-digit phone number.');
        return;
      }
    }

    setSavingLead(true);
    try {
      const payload = { ...editForm };
      if (editForm.phone) {
        payload.phone = editForm.phone.replace(/\D/g, '');
      }
      if (noteText.trim()) payload.noteText = noteText;

      const res = await fetch(`/api/leads/${selectedLead._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedLead(updated);
        setNoteText('');
        loadLeads();
        loadStats();
      }
    } catch (err) {
      console.error('Failed to update lead:', err);
    } finally {
      setSavingLead(false);
    }
  };

  const handleScheduleFollowUp = async ({ type, scheduledAt, notes }) => {
    if (!selectedLead) return;
    try {
      const res = await fetch(`/api/leads/${selectedLead._id}/follow-ups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, scheduledAt, notes }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedLead(updated);
        loadLeadDetail(updated);
        loadLeads();
        loadStats();
      }
    } catch (err) {
      console.error('Failed to schedule follow-up:', err);
    }
  };

  const handleCompleteFollowUp = async ({ followUpId, outcome }) => {
    if (!selectedLead) return;
    try {
      const res = await fetch(`/api/leads/${selectedLead._id}/follow-ups`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followUpId, outcome }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedLead(updated);
        loadLeadDetail(updated);
        loadLeads();
        loadStats();
      }
    } catch (err) {
      console.error('Failed to complete follow-up:', err);
    }
  };

  const handleSendProperties = async ({ propertyIds, channel }) => {
    if (!selectedLead) return;
    try {
      const res = await fetch(`/api/leads/${selectedLead._id}/send-properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyIds, channel }),
      });
      if (res.ok) {
        const data = await res.json();
        if (channel === 'whatsapp' && data.waUrl) {
          window.open(data.waUrl, '_blank');
        }
        // Refresh lead detail
        const leadRes = await fetch(`/api/leads/${selectedLead._id}`);
        if (leadRes.ok) {
          const updatedLead = await leadRes.json();
          setSelectedLead(updatedLead);
        }
        loadStats();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to send properties');
      }
    } catch (err) {
      console.error('Failed to send properties:', err);
    }
  };

  // ────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500/10 via-transparent to-transparent pointer-events-none rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-500/5 via-transparent to-transparent pointer-events-none rounded-tr-full" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 border border-violet-100 text-violet-700 text-xs font-bold rounded-full mb-4 shadow-sm">
            <Target size={14} className="animate-pulse" /> Follow-up CRM
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Lead <span className="text-violet-600">Follow-up CRM</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Track follow-ups, send property recommendations, and manage your lead pipeline — all in one place.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <StatCard icon={AlertTriangle} label="Overdue" value={stats.overdueCount} color="text-red-600" iconBg="text-red-600 bg-red-50 border-red-100" pulse={stats.overdueCount > 0} />
        <StatCard icon={Clock} label="Due Today" value={stats.dueTodayCount} color="text-amber-600" iconBg="text-amber-600 bg-amber-50 border-amber-100" />
        <StatCard icon={CalendarClock} label="This Week" value={stats.upcomingWeekCount} color="text-blue-600" iconBg="text-blue-600 bg-blue-50 border-blue-100" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completedThisWeekCount} color="text-emerald-600" iconBg="text-emerald-600 bg-emerald-50 border-emerald-100" />
        <StatCard icon={Users} label="No Follow-up" value={stats.noFollowUpCount} color="text-slate-500" iconBg="text-slate-500 bg-slate-50 border-slate-200" />
      </div>

      {/* Pipeline Funnel */}
      <PipelineFunnel stats={stats.pipelineStats} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Leads Pipeline Table */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-sm border-slate-200/60 rounded-[2rem] overflow-hidden flex flex-col bg-white">
            <div className="p-6 md:p-8 border-b border-slate-100 space-y-4">
              <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Target size={20} className="text-violet-600" /> Lead Pipeline
              </CardTitle>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-3 items-stretch">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search name, phone, email..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="pl-9 h-11 rounded-xl border-slate-200 focus-visible:ring-violet-500 focus-visible:border-violet-500 font-medium"
                  />
                </div>

                <Select value={followUpFilter} onValueChange={(val) => { setFollowUpFilter(val); setPage(1); }}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 font-bold text-slate-700 w-full md:w-40">
                    <SelectValue placeholder="Follow-up" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Follow-ups</SelectItem>
                    <SelectItem value="OVERDUE">🔴 Overdue</SelectItem>
                    <SelectItem value="TODAY">🟡 Due Today</SelectItem>
                    <SelectItem value="UPCOMING">🔵 Upcoming</SelectItem>
                    <SelectItem value="NONE">⚪ No Follow-up</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={quality} onValueChange={(val) => { setQuality(val); setPage(1); }}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 font-bold text-slate-700 w-full md:w-36">
                    <SelectValue placeholder="Quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Quality</SelectItem>
                    <SelectItem value="Hot">🔥 Hot</SelectItem>
                    <SelectItem value="Warm">🟡 Warm</SelectItem>
                    <SelectItem value="Cold">❄️ Cold</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 font-bold text-slate-700 w-full md:w-40">
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

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-slate-100">
                      <TableHead className="font-bold text-slate-700 pl-6">Client</TableHead>
                      <TableHead className="font-bold text-slate-700">Received On</TableHead>
                      <TableHead className="font-bold text-slate-700">Next Follow-up</TableHead>
                      <TableHead className="font-bold text-slate-700 text-center">Quality</TableHead>
                      <TableHead className="font-bold text-slate-700 text-center">Status</TableHead>
                      <TableHead className="font-bold text-slate-700 text-right pr-6">Last Contact</TableHead>
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
                      leads.map((lead) => {
                        const nf = lead.nextFollowUp ? new Date(lead.nextFollowUp) : null;
                        const overdue = nf && isOverdue(nf);
                        const dueToday_lead = nf && isDueToday(nf);

                        return (
                          <TableRow
                            key={lead._id}
                            onClick={() => loadLeadDetail(lead)}
                            className={`cursor-pointer transition-colors group ${
                              selectedLead?._id === lead._id ? 'bg-violet-50/30' :
                              overdue ? 'bg-red-50/30 hover:bg-red-50/60' :
                              dueToday_lead ? 'bg-amber-50/20 hover:bg-amber-50/40' :
                              'hover:bg-slate-50/80'
                            }`}
                          >
                            <TableCell className="pl-6 py-4">
                              <div>
                                <p className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors">{lead.name}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{lead.phone}</p>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-bold text-slate-700">
                                  {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium">
                                  {lead.createdAt ? new Date(lead.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              {nf ? (
                                <div className="flex items-center gap-2">
                                  {overdue && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                                  {dueToday_lead && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                                  {!overdue && !dueToday_lead && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                                  <span className={`text-xs font-bold ${
                                    overdue ? 'text-red-600' : dueToday_lead ? 'text-amber-600' : 'text-slate-600'
                                  }`}>
                                    {formatDate(nf)}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium">Not scheduled</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center py-4">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                                lead.leadQuality === 'Hot' ? 'bg-red-50 text-red-700 border border-red-100' :
                                lead.leadQuality === 'Warm' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                'bg-blue-50 text-blue-700 border border-blue-100'
                              }`}>
                                {lead.leadQuality === 'Hot' ? '🔥' : lead.leadQuality === 'Warm' ? '🟡' : '❄️'} {lead.leadQuality}
                              </span>
                            </TableCell>
                            <TableCell className="text-center py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                lead.status === 'New' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                lead.status === 'Converted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                lead.status === 'Escalated' ? 'bg-red-50 text-red-700 border border-red-200' :
                                lead.status === 'Lost' ? 'bg-slate-100 text-slate-600' :
                                'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}>
                                {lead.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right pr-6 py-4 text-xs text-slate-500 font-medium">
                              {timeAgo(lead.lastContactedAt || lead.updatedAt)}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-6 border-t border-slate-100 bg-slate-50/50">
                  <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="rounded-xl border-slate-200 hover:bg-slate-100 font-bold">
                    Previous
                  </Button>
                  <span className="text-sm text-slate-500 font-bold">Page {page} of {totalPages}</span>
                  <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="rounded-xl border-slate-200 hover:bg-slate-100 font-bold">
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Lead Detail Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          {!selectedLead ? (
            <Card className="shadow-sm border-slate-200/60 rounded-[2rem] p-12 text-center bg-white h-[600px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mb-4 border border-violet-100">
                <Target size={28} className="text-violet-400" />
              </div>
              <h3 className="text-lg font-black text-slate-800">No Lead Selected</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                Click any lead in the pipeline table to view their details, follow-up timeline, and send property recommendations.
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Quick Actions Bar */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setScheduleModalOpen(true)}
                  className="flex-1 h-11 bg-violet-600 hover:bg-violet-700 font-bold rounded-xl gap-2 shadow-lg shadow-violet-600/10"
                >
                  <CalendarClock size={16} /> Schedule Follow-up
                </Button>
                <Button
                  onClick={() => setSendPropsModalOpen(true)}
                  variant="outline"
                  className="flex-1 h-11 font-bold rounded-xl gap-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <Building2 size={16} /> Send Properties
                </Button>
              </div>

              {/* Lead Profile Card */}
              <Card className="shadow-sm border-slate-200/60 rounded-[2rem] overflow-hidden bg-white">
                <CardHeader className="border-b border-slate-100 pb-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-black text-slate-900">{editForm.name || 'Lead'}</CardTitle>
                      <CardDescription className="text-xs font-semibold text-slate-500 mt-1 flex flex-col gap-0.5">
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} /> Last contact: {timeAgo(selectedLead.lastContactedAt || selectedLead.updatedAt)}
                        </span>
                        {selectedLead.createdAt && (
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Clock size={12} /> Received: {new Date(selectedLead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(selectedLead.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={selectedLead.leadQuality === 'Hot' ? 'destructive' : selectedLead.leadQuality === 'Warm' ? 'warning' : 'default'} className="font-bold rounded-lg px-2.5 py-1">
                        {selectedLead.leadQuality === 'Hot' ? '🔥' : selectedLead.leadQuality === 'Warm' ? '🟡' : '❄️'} {selectedLead.leadQuality}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <form onSubmit={handleUpdateLead} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Name</Label>
                        <Input value={editForm.name} onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} className="h-9 rounded-lg border-slate-200 text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Phone</Label>
                        <Input 
                          maxLength={10}
                          value={editForm.phone} 
                          onChange={(e) => setEditForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} 
                          className="h-9 rounded-lg border-slate-200 text-sm" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-600">Email</Label>
                      <Input value={editForm.email} onChange={(e) => setEditForm(p => ({ ...p, email: e.target.value }))} className="h-9 rounded-lg border-slate-200 text-sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Budget</Label>
                        <Input placeholder="e.g. 80L - 1.2Cr" value={editForm.budget} onChange={(e) => setEditForm(p => ({ ...p, budget: e.target.value }))} className="h-9 rounded-lg border-slate-200 text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Location</Label>
                        <Input placeholder="e.g. Baner" value={editForm.preferredLocation} onChange={(e) => setEditForm(p => ({ ...p, preferredLocation: e.target.value }))} className="h-9 rounded-lg border-slate-200 text-sm" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Property Type</Label>
                        <Input placeholder="e.g. 2BHK" value={editForm.propertyType} onChange={(e) => setEditForm(p => ({ ...p, propertyType: e.target.value }))} className="h-9 rounded-lg border-slate-200 text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Possession</Label>
                        <Input placeholder="e.g. Ready" value={editForm.possession} onChange={(e) => setEditForm(p => ({ ...p, possession: e.target.value }))} className="h-9 rounded-lg border-slate-200 text-sm" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Quality</Label>
                        <Select value={editForm.leadQuality} onValueChange={(val) => setEditForm(p => ({ ...p, leadQuality: val }))}>
                          <SelectTrigger className="h-9 rounded-lg border-slate-200 font-bold text-sm"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Hot">🔥 Hot</SelectItem>
                            <SelectItem value="Warm">🟡 Warm</SelectItem>
                            <SelectItem value="Cold">❄️ Cold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Status</Label>
                        <Select value={editForm.status} onValueChange={(val) => setEditForm(p => ({ ...p, status: val }))}>
                          <SelectTrigger className="h-9 rounded-lg border-slate-200 font-bold text-sm"><SelectValue /></SelectTrigger>
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

                    {/* Notes History */}
                    {selectedLead.notes && selectedLead.notes.length > 0 && (
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Notes History</Label>
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 max-h-24 overflow-y-auto space-y-1.5">
                          {selectedLead.notes.map((note, idx) => (
                            <div key={idx} className="text-xs border-b border-slate-200/60 pb-1 last:border-0 last:pb-0">
                              <p className="font-bold text-slate-700">{note.addedBy} • <span className="text-[10px] text-slate-400">{formatDate(note.addedAt)}</span></p>
                              <p className="text-slate-600 mt-0.5">{note.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-600">Add Note</Label>
                      <Input placeholder="Type a note..." value={noteText} onChange={(e) => setNoteText(e.target.value)} className="h-9 rounded-lg border-slate-200 text-sm" />
                    </div>

                    <Button type="submit" disabled={savingLead} className="w-full h-10 bg-violet-600 hover:bg-violet-700 font-bold rounded-xl gap-2 shadow-lg shadow-violet-600/10 text-sm">
                      <Save size={14} /> {savingLead ? 'Saving...' : 'Update Lead'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Follow-up Timeline */}
              <Card className="shadow-sm border-slate-200/60 rounded-[2rem] overflow-hidden bg-white">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-black text-slate-800 flex items-center gap-2">
                      <CalendarClock size={18} className="text-violet-600" /> Follow-up Timeline
                    </CardTitle>
                    <Badge variant="outline" className="font-bold rounded-lg text-xs">
                      {leadFollowUps.length} total
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 max-h-[400px] overflow-y-auto">
                  {loadingDetail ? (
                    <div className="py-8 text-center text-sm text-slate-400 animate-pulse font-bold">Loading timeline...</div>
                  ) : (
                    <FollowUpTimeline
                      followUps={leadFollowUps}
                      onComplete={(fu) => {
                        setCompletingFollowUp(fu);
                        setCompleteModalOpen(true);
                      }}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Properties Sent History */}
              {selectedLead.propertiesSent && selectedLead.propertiesSent.length > 0 && (
                <Card className="shadow-sm border-slate-200/60 rounded-[2rem] overflow-hidden bg-white">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-base font-black text-slate-800 flex items-center gap-2">
                      <Building2 size={18} className="text-amber-600" /> Properties Sent
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {selectedLead.propertiesSent.map((ps, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
                          <div className={`p-1.5 rounded-lg ${ps.channel === 'whatsapp' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'}`}>
                            {ps.channel === 'whatsapp' ? <MessageSquare size={14} /> : <Mail size={14} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{ps.propertyName}</p>
                            <p className="text-[10px] text-slate-400">via {ps.channel} • {formatDate(ps.sentAt)} • by {ps.sentBy}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ScheduleFollowUpModal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSchedule={handleScheduleFollowUp}
        leadName={selectedLead?.name || ''}
      />

      <CompleteFollowUpModal
        open={completeModalOpen}
        onClose={() => { setCompleteModalOpen(false); setCompletingFollowUp(null); }}
        onComplete={handleCompleteFollowUp}
        followUp={completingFollowUp}
      />

      <SendPropertiesModal
        open={sendPropsModalOpen}
        onClose={() => setSendPropsModalOpen(false)}
        onSend={handleSendProperties}
        leadName={selectedLead?.name || ''}
        leadPhone={selectedLead?.phone || ''}
        leadEmail={selectedLead?.email || ''}
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Page Export
// ──────────────────────────────────────────────────────────
export default function FollowUpCRMPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-slate-500">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Loading Follow-up CRM...</p>
      </div>
    }>
      <FollowUpCRMContent />
    </Suspense>
  );
}
