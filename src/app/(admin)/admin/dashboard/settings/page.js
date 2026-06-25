'use client';
import { useState, useEffect } from 'react';
import { 
  User, Lock, Bell, Globe, Shield, 
  Save, Camera, CheckCircle2, AlertCircle, 
  RefreshCcw, Mail, FileText, Activity, Database, Key
} from 'lucide-react';

// --- REUSABLE TOGGLE COMPONENT ---
const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`w-12 h-6 rounded-full relative transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-inner ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
  >
    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ease-in-out ${checked ? 'left-7' : 'left-1'}`} />
  </button>
);

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Changes Saved");
  const [errorAlert, setErrorAlert] = useState("");

  // --- STATES ---
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    office: ''
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    newLeads: true,
    careerApps: true,
    systemAlerts: false,
    weeklyReports: true
  });

  const [systemConfig, setSystemConfig] = useState({
    timezone: 'Asia/Kolkata',
    maintenanceMode: false,
    twoFactorAuth: true
  });

  // --- AUDIT TRAIL LOGS ---
  const [auditLogs, setAuditLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsPage, setLogsPage] = useState(1);
  const [logsTotalPages, setLogsTotalPages] = useState(1);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/admin/profile');
      if (res.ok) {
        const data = await res.json();
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          role: data.role || 'Admin',
          office: data.office || 'Wakad Branch, Pune'
        });
      }
    } catch (err) {
      console.error('Failed to load profile details:', err);
    }
  };

  const fetchAuditLogs = async (page = 1) => {
    setLogsLoading(true);
    setErrorAlert("");
    try {
      const res = await fetch(`/api/admin/audit-logs?page=${page}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs || []);
        setLogsPage(data.page || 1);
        setLogsTotalPages(data.totalPages || 1);
      } else {
        const data = await res.json();
        setErrorAlert(data.error || "Failed to load audit logs.");
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
      setErrorAlert("Connection error. Failed to retrieve audit trail.");
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeSection === 'audit') {
      fetchAuditLogs(1);
    }
  }, [activeSection]);

  // --- HANDLERS ---
  const handleSave = async () => {
    setIsSaving(true);
    setErrorAlert("");
    setShowSuccess(false);

    if (activeSection === 'profile') {
      const phoneDigits = profileData.phone.replace(/\D/g, '');
      if (!phoneDigits || phoneDigits.length !== 10) {
        setErrorAlert("Please enter a valid 10-digit phone number.");
        setIsSaving(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: profileData.name,
            phone: phoneDigits,
            office: profileData.office
          })
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorAlert(data.error || "Failed to save profile changes.");
        } else {
          setSuccessMessage("Profile updated successfully!");
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        }
      } catch (err) {
        setErrorAlert("Network error. Failed to save profile changes.");
      } finally {
        setIsSaving(false);
      }
    } else if (activeSection === 'security') {
      if (!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword) {
        setErrorAlert("All password fields are required.");
        setIsSaving(false);
        return;
      }
      if (securityData.newPassword !== securityData.confirmPassword) {
        setErrorAlert("New passwords do not match.");
        setIsSaving(false);
        return;
      }
      if (securityData.newPassword.length < 8) {
        setErrorAlert("New password must be at least 8 characters long.");
        setIsSaving(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword: securityData.currentPassword,
            newPassword: securityData.newPassword
          })
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorAlert(data.error || "Failed to change password.");
        } else {
          setSuccessMessage("Password changed successfully!");
          setShowSuccess(true);
          setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setTimeout(() => setShowSuccess(false), 3000);
        }
      } catch (err) {
        setErrorAlert("Network error. Failed to change password.");
      } finally {
        setIsSaving(false);
      }
    } else {
      // Simulate save for notification and system config
      setTimeout(() => {
        setIsSaving(false);
        setSuccessMessage("Settings saved successfully!");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }, 1000);
    }
  };

  const navItems = [
    { id: 'profile', label: 'Account Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security & Password', icon: <Lock size={18} /> },
    { id: 'notifications', label: 'Notification Prefs', icon: <Bell size={18} /> },
    { id: 'system', label: 'System Configuration', icon: <Shield size={18} /> },
    { id: 'audit', label: 'Audit Trail Logs', icon: <Activity size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500 space-y-8">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Settings</h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1 flex items-center gap-2">
              <Globe size={14}/> Configure your EUS Workspace
            </p>
          </div>
          
          <div className="h-10 flex items-center gap-3">
            {errorAlert && (
              <div className="flex items-center gap-2 bg-rose-50 text-rose-700 px-5 py-2.5 rounded-xl border border-rose-200 animate-in slide-in-from-top-4 fade-in duration-300 shadow-sm">
                <AlertCircle size={18} className="text-rose-600" />
                <span className="text-xs font-black uppercase tracking-wider">{errorAlert}</span>
              </div>
            )}
            {showSuccess && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-xl border border-emerald-200 animate-in slide-in-from-top-4 fade-in duration-300 shadow-sm">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span className="text-xs font-black uppercase tracking-wider">{successMessage}</span>
              </div>
            )}
          </div>
        </header>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* SIDE NAV */}
          <aside className="lg:col-span-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                  activeSection === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 translate-x-1' 
                  : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60 shadow-sm'
                }`}
              >
                <div className={`${activeSection === item.id ? 'text-blue-200' : 'text-slate-400'}`}>
                  {item.icon}
                </div>
                {item.label}
              </button>
            ))}
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl overflow-hidden flex flex-col min-h-[600px]">
            
            <div className="p-8 md:p-10 flex-1">
              {/* PROFILE SECTION */}
              {activeSection === 'profile' && (
                <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-8 pb-8 border-b border-slate-100">
                    <div className="relative group cursor-pointer">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-3xl font-black text-white shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                        {profileData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                        <Camera size={24} className="text-white" />
                      </div>
                      <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-slate-600 hover:text-blue-600 transition-all z-10 hover:scale-105">
                        <Camera size={16} />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">{profileData.name}</h3>
                      <p className="text-xs font-black text-blue-600 uppercase tracking-widest mt-1 bg-blue-50 inline-block px-3 py-1 rounded-md border border-blue-100">{profileData.role}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
                      <input 
                        type="text" value={profileData.name} 
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email Address</label>
                      <input 
                        type="email" value={profileData.email} 
                        className="w-full px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-xl outline-none font-bold text-slate-400 cursor-not-allowed" 
                        readOnly 
                        title="Contact IT support to change email"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Phone Number</label>
                      <input 
                        type="tel" 
                        value={profileData.phone} 
                        maxLength={10}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Office Location</label>
                      <select 
                        value={profileData.office}
                        onChange={(e) => setProfileData({...profileData, office: e.target.value})}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                      >
                        <option>Wakad Branch, Pune</option>
                        <option>Baner Branch, Pune</option>
                        <option>Hinjewadi Office</option>
                      </select>
                    </div>
                  </div>
                </section>
              )}

              {/* SECURITY SECTION */}
              {activeSection === 'security' && (
                <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-4 shadow-sm">
                    <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm font-black text-amber-900">Security Recommendation</p>
                      <p className="text-sm font-medium text-amber-700 mt-1">Your password hasn&apos;t been changed in 90 days. We strongly recommend updating it to maintain account security.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Current Password</label>
                      <input 
                        type="password" placeholder="••••••••" 
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800" 
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">New Password</label>
                        <input 
                          type="password" placeholder="Enter new password" 
                          value={securityData.newPassword}
                          onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Confirm Password</label>
                        <input 
                          type="password" placeholder="Confirm new password" 
                          value={securityData.confirmPassword}
                          onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800" 
                        />
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* NOTIFICATIONS SECTION */}
              {activeSection === 'notifications' && (
                <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-1">Communication Preferences</h3>
                    <p className="text-sm font-medium text-slate-500">Choose what updates you want to receive via email.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-5 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all bg-white group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors"><Mail size={20}/></div>
                        <div>
                          <p className="font-bold text-slate-900">New Property Leads</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">Get notified instantly when a user submits an inquiry</p>
                        </div>
                      </div>
                      <Toggle checked={notifications.newLeads} onChange={() => setNotifications(prev => ({...prev, newLeads: !prev.newLeads}))} />
                    </div>

                    <div className="flex justify-between items-center p-5 rounded-2xl border border-slate-200 hover:border-purple-200 hover:shadow-md transition-all bg-white group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors"><FileText size={20}/></div>
                        <div>
                          <p className="font-bold text-slate-900">Career Applications</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">Alerts when a new resume is uploaded to the portal</p>
                        </div>
                      </div>
                      <Toggle checked={notifications.careerApps} onChange={() => setNotifications(prev => ({...prev, careerApps: !prev.careerApps}))} />
                    </div>

                    <div className="flex justify-between items-center p-5 rounded-2xl border border-slate-200 hover:border-red-200 hover:shadow-md transition-all bg-white group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors"><Activity size={20}/></div>
                        <div>
                          <p className="font-bold text-slate-900">System Alerts</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">Critical infrastructure, downtime, and security logs</p>
                        </div>
                      </div>
                      <Toggle checked={notifications.systemAlerts} onChange={() => setNotifications(prev => ({...prev, systemAlerts: !prev.systemAlerts}))} />
                    </div>
                  </div>
                </section>
              )}

              {/* SYSTEM CONFIGURATION SECTION */}
              {activeSection === 'system' && (
                <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-1">Global System Settings</h3>
                    <p className="text-sm font-medium text-slate-500">Manage high-level configurations for the EUS Workspace.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Default Timezone</label>
                      <select 
                        value={systemConfig.timezone}
                        onChange={(e) => setSystemConfig({...systemConfig, timezone: e.target.value})}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="UTC">UTC (Universal Coordinated Time)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center p-5 rounded-2xl border border-slate-200 bg-white">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Key size={20}/></div>
                        <div>
                          <p className="font-bold text-slate-900">Two-Factor Authentication (2FA)</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">Require OTP for all admin logins</p>
                        </div>
                      </div>
                      <Toggle checked={systemConfig.twoFactorAuth} onChange={() => setSystemConfig(prev => ({...prev, twoFactorAuth: !prev.twoFactorAuth}))} />
                    </div>

                    <div className="flex justify-between items-center p-5 rounded-2xl border border-amber-200 bg-amber-50">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white text-amber-600 rounded-xl shadow-sm"><Database size={20}/></div>
                        <div>
                          <p className="font-bold text-amber-900">Maintenance Mode</p>
                          <p className="text-xs font-medium text-amber-700 mt-0.5">Disables public-facing features (Shows &quot;Under Construction&quot;)</p>
                        </div>
                      </div>
                      <Toggle checked={systemConfig.maintenanceMode} onChange={() => setSystemConfig(prev => ({...prev, maintenanceMode: !prev.maintenanceMode}))} />
                    </div>
                  </div>
                </section>
              )}

              {/* AUDIT LOGS SECTION */}
              {activeSection === 'audit' && (
                <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-1">Administrative Audit Trail</h3>
                    <p className="text-sm font-medium text-slate-500">Security history log of all operations performed inside the EUS Realty workspace.</p>
                  </div>

                  {logsLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <RefreshCcw className="animate-spin text-blue-600" size={32} />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading history log...</p>
                    </div>
                  ) : auditLogs.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 font-bold uppercase tracking-widest text-xs border border-dashed border-slate-200 rounded-2xl">
                      No security logs found.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="w-full text-left border-collapse bg-white">
                          <thead>
                            <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-wider border-b border-slate-200">
                              <th className="px-6 py-4">Timestamp</th>
                              <th className="px-6 py-4">Action</th>
                              <th className="px-6 py-4">Performed By</th>
                              <th className="px-6 py-4">IP Address</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-sm font-bold text-slate-700">
                            {auditLogs.map((log) => {
                              const actionColor = log.action.includes('Created') 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                : log.action.includes('Deleted') 
                                ? 'bg-rose-50 text-rose-700 border-rose-100' 
                                : log.action.includes('Updated') || log.action.includes('Rotated')
                                ? 'bg-sky-50 text-sky-700 border-sky-100' 
                                : 'bg-slate-50 text-slate-700 border-slate-100';

                              return (
                                <tr key={log._id} className="hover:bg-slate-50/50">
                                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                                    {new Date(log.timestamp).toLocaleString('en-IN')}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${actionColor} self-start`}>
                                        {log.action}
                                      </span>
                                      <span className="text-xs text-slate-500 font-medium leading-relaxed max-w-md">
                                        {log.details}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                      <span>{log.performedBy?.name}</span>
                                      <span className="text-xs text-slate-400 font-medium font-mono">{log.performedBy?.email}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-xs font-semibold font-mono text-slate-500">
                                    {log.ipAddress}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      {logsTotalPages > 1 && (
                        <div className="flex items-center justify-between pt-4">
                          <button
                            type="button"
                            disabled={logsPage <= 1}
                            onClick={() => fetchAuditLogs(logsPage - 1)}
                            className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-xs text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            ← Previous
                          </button>
                          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                            Page {logsPage} of {logsTotalPages}
                          </span>
                          <button
                            type="button"
                            disabled={logsPage >= logsTotalPages}
                            onClick={() => fetchAuditLogs(logsPage + 1)}
                            className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-xs text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            Next →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* FIXED FOOTER BUTTONS */}
            {activeSection !== 'audit' && (
              <div className="p-6 md:px-10 border-t border-slate-100 bg-slate-50/80 flex justify-end gap-4 shrink-0 mt-auto">
                <button className="px-6 py-3 rounded-xl font-bold text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-all">
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
                >
                  {isSaving ? <RefreshCcw className="animate-spin" size={16} /> : <Save size={16} />}
                  {isSaving ? 'Processing...' : 'Save Changes'}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}