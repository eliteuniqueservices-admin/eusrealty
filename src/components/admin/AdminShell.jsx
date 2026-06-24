/**
 * @file AdminShell.jsx
 * @description Root layout shell for the admin dashboard.
 *
 * Provides:
 *  - Collapsible desktop sidebar (with icon-only collapsed mode)
 *  - Mobile sidebar overlay with backdrop
 *  - Top header bar with breadcrumb, notifications panel, and profile dropdown
 *  - Role-aware navigation via `getNavItems(role)`
 *
 * All sub-components that were previously defined inside the render function
 * have been hoisted to module scope to satisfy the react-hooks/static-components
 * ESLint rule (components created during render lose state on every re-render).
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { getNavItems } from '@/lib/permissions';
import {
  LayoutDashboard, Building2, Settings, LogOut, Bell,
  ChevronDown, Menu, X, User, Users, Key, ChevronRight, Briefcase,
  MessageSquare, Banknote, Mail, FileText, Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/** Maps permission-key strings from `getNavItems` to Lucide icon components. */
const ICON_MAP = {
  LayoutDashboard,
  Building2,
  Settings,
  Briefcase,
  MessageSquare,
  Users,
  Banknote,
  Mail,
  FileText,
  Target,
};

/* ─────────────────────────────────────────────────────────────────────────────
   SidebarContent
   Renders the full sidebar interior: logo, role badge, navigation list, and
   the user / logout block at the bottom.

   Props are passed explicitly from AdminShell so this can live at module scope
   (required by react-hooks/static-components).
───────────────────────────────────────────────────────────────────────────── */
function SidebarContent({
  collapsed,
  pathname,
  navItems,
  role,
  roleColors,
  roleLabel,
  session,
  onLinkClick,
  onLogout,
}) {
  return (
    <div className="flex flex-col h-full">

      {/* ── Logo ── */}
      <div className={cn(
        'flex items-center gap-3 px-6 py-5 border-b border-white/10',
        collapsed && 'justify-center px-4',
      )}>
        <div className="w-9 h-9 rounded-xl bg-cyan-500 flex items-center justify-center font-black text-slate-950 text-sm flex-shrink-0">
          E
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-white font-black text-lg leading-none tracking-tight">
              EUS<span className="text-cyan-400">Realty</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">
              Admin Portal
            </p>
          </div>
        )}
      </div>

      {/* ── Role Badge ── */}
      {!collapsed && (
        <div className="px-6 py-4">
          <div className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold',
            roleColors[role],
          )}>
            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {roleLabel[role]}
          </div>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              title={collapsed ? item.name : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group',
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5',
                collapsed && 'justify-center px-2',
              )}
            >
              {Icon && (
                <Icon
                  size={18}
                  className={cn(
                    'flex-shrink-0',
                    isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300',
                  )}
                />
              )}
              {!collapsed && <span>{item.name}</span>}
              {!collapsed && isActive && (
                <ChevronRight size={14} className="ml-auto text-cyan-400/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── User + Logout ── */}
      <div className={cn('p-4 border-t border-white/10', collapsed && 'px-2')}>
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {session?.user?.name?.[0] || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-semibold text-sm truncate">
                {session?.user?.name || 'Admin'}
              </p>
              <p className="text-slate-400 text-xs truncate">
                {session?.user?.email || ''}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          title={collapsed ? 'Logout' : undefined}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200',
            collapsed && 'justify-center',
          )}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   AdminShell
   Top-level layout component wrapping all admin dashboard pages.
───────────────────────────────────────────────────────────────────────────── */
export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const timeoutRef = useRef(null);
  const lastSeenNotifIdRef = useRef(null);

  // Polling for admin notifications
  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications?limit=15');
        if (res.ok) {
          const data = await res.json();
          const newNotifs = data.notifications || [];
          setNotifications(newNotifs);
          
          const newUnreadCount = data.unreadCount || 0;
          setUnreadCount(newUnreadCount);

          if (newNotifs.length > 0) {
            const latestNotif = newNotifs[0];
            // Only play chime sound if it's unread AND different from the last one we saw
            if (!latestNotif.isRead) {
              if (lastSeenNotifIdRef.current && lastSeenNotifIdRef.current !== latestNotif._id) {
                playNotificationSound();
              }
              lastSeenNotifIdRef.current = latestNotif._id;
            } else {
              lastSeenNotifIdRef.current = latestNotif._id;
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    // Initial fetch
    fetchNotifications();

    // Poll every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, [status]);

  const handleNotificationClick = async (notif) => {
    // 1. Mark as read in DB if it isn't already
    if (!notif.isRead) {
      try {
        const res = await fetch('/api/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: notif._id }),
        });
        if (res.ok) {
          // Update local state
          setNotifications(prev => 
            prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n)
          );
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
      }
    }
    
    // 2. Close dropdown
    setNotificationsOpen(false);
    
    // 3. Redirect depending on the related model
    if (notif.relatedId) {
      if (notif.relatedModel === 'Lead' || notif.relatedModel === 'ChatSession') {
        router.push(`/admin/dashboard/chat-leads?leadId=${notif.relatedId}`);
      } else if (notif.relatedModel === 'LoanApplication') {
        router.push(`/admin/dashboard/loan-applications?appId=${notif.relatedId}`);
      } else if (notif.relatedModel === 'JobApplication') {
        router.push(`/admin/dashboard/job-applications?appId=${notif.relatedId}`);
      } else {
        router.push('/admin/dashboard');
      }
    } else {
      router.push('/admin/dashboard');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  useEffect(() => {
    if (status !== 'authenticated') return;

    const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

    const checkSessionIdle = () => {
      if (typeof window === 'undefined') return;
      const lastActivity = Number(localStorage.getItem('eus_admin_last_activity') || 0);
      if (lastActivity && Date.now() - lastActivity >= TIMEOUT_MS) {
        signOut({ callbackUrl: '/admin/login' });
      }
    };

    const resetTimer = () => {
      if (typeof window === 'undefined') return;
      localStorage.setItem('eus_admin_last_activity', Date.now().toString());
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(checkSessionIdle, TIMEOUT_MS);
    };

    // Initialize/sync on mount
    if (typeof window !== 'undefined') {
      const lastActivity = localStorage.getItem('eus_admin_last_activity');
      if (!lastActivity) {
        localStorage.setItem('eus_admin_last_activity', Date.now().toString());
      } else {
        checkSessionIdle();
      }
    }

    // Standard activity events
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart', 'click'];
    
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Handle tab visibility change (e.g., tab returning from background)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSessionIdle();
        resetTimer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Sync across multiple admin tabs
    const handleStorageChange = (e) => {
      if (e.key === 'eus_admin_last_activity') {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        const newLastActivity = Number(e.newValue || 0);
        const timeRemaining = TIMEOUT_MS - (Date.now() - newLastActivity);
        if (timeRemaining <= 0) {
          checkSessionIdle();
        } else {
          timeoutRef.current = setTimeout(checkSessionIdle, timeRemaining);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Periodic check interval (ensures session checks even if tab is throttled in the background)
    const backupInterval = setInterval(checkSessionIdle, 10000);

    // Initial kickoff
    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearInterval(backupInterval);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [status]);

  // Client-side session protection (Defense in depth)
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black tracking-widest uppercase text-slate-500">Verifying Credentials...</p>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session || session.user?.role !== 'admin') {
    if (typeof window !== 'undefined') {
      router.replace('/admin/login');
    }
    return null;
  }

  const role = session.user.role;
  const navItems = getNavItems(role);

  /** Maps role keys to Tailwind badge colour classes. */
  const roleColors = {
    admin: 'bg-rose-500/20 text-rose-400',
  };

  /** Maps role keys to human-readable labels. */
  const roleLabel = {
    admin: 'Admin',
  };

  /** Signs the current user out and redirects to the login page. */
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  /** Shared props forwarded to the SidebarContent sub-component. */
  const sidebarProps = {
    collapsed,
    pathname,
    navItems,
    role,
    roleColors,
    roleLabel,
    session,
    onLinkClick: () => setMobileSidebarOpen(false),
    onLogout: handleLogout,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── Desktop Sidebar ── */}
      <aside
        className={cn(
          'hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out sticky top-0 h-screen',
          collapsed ? 'w-[68px]' : 'w-[260px]',
        )}
        style={{ background: 'linear-gradient(180deg, #0f172a 0%, #0a0f1e 50%, #0f172a 100%)' }}
      >
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside
            className="relative w-[280px] flex flex-col z-50"
            style={{ background: 'linear-gradient(180deg, #0f172a 0%, #0a0f1e 50%, #0f172a 100%)' }}
          >
            <SidebarContent {...sidebarProps} />
          </aside>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Top Header ── */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              aria-label="Open mobile menu"
            >
              <Menu size={20} />
            </button>

            {/* Desktop sidebar collapse toggle */}
            <button
              className="hidden lg:flex p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
              onClick={() => setCollapsed(!collapsed)}
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb — current section name */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-slate-900 font-bold text-lg">
                {navItems.find(
                  (i) =>
                    i.href === pathname ||
                    (i.href !== '/admin/dashboard' && pathname.startsWith(i.href)),
                )?.name || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">

            {/* ── Notifications ── */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors animate-none"
                aria-label="Notifications"
              >
                <Bell size={20} className={cn(unreadCount > 0 && "animate-[bell-swing_1.5s_ease-in-out_infinite]")} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
                    <h4 className="font-bold text-slate-900 text-sm">Notifications</h4>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-[11px] font-bold text-cyan-600 hover:text-cyan-700 transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                      <Badge variant="info" className="px-1.5 py-0.5 text-[9px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-100">
                        {unreadCount} New
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-10 text-slate-400 font-bold text-xs">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => handleNotificationClick(n)}
                          className={cn(
                            "flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors relative border border-transparent",
                            !n.isRead ? "bg-cyan-50/15 border-cyan-500/10" : ""
                          )}
                        >
                          <div className="text-lg flex-shrink-0 mt-0.5">
                            {n.icon || '🔔'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-start gap-1">
                              <p className={cn("text-xs text-slate-900 truncate", !n.isRead ? "font-bold" : "font-semibold")}>
                                {n.title}
                              </p>
                              {!n.isRead && (
                                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1.5 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 font-medium leading-normal">
                              {n.message}
                            </p>
                            <p className="text-[9px] text-slate-400 mt-1 font-semibold">
                              {formatTimeAgo(n.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Profile Dropdown ── */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                aria-label="Profile menu"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  {session?.user?.name?.[0] || 'A'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-slate-900 leading-none">
                    {session?.user?.name?.split(' ')[0] || 'Admin'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{roleLabel[role]}</p>
                </div>
                <ChevronDown
                  size={14}
                  className={cn('text-slate-400 transition-transform', profileOpen && 'rotate-180')}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-100">
                    <p className="font-bold text-slate-900 text-sm">{session?.user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{session?.user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700 font-medium">
                      <User size={15} /> Edit Profile
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700 font-medium">
                      <Key size={15} /> Change Password
                    </button>
                    <div className="border-t border-slate-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-red-600 font-semibold"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

/**
 * Plays a premium double-chime notification sound using the Web Audio API.
 * Uses pure oscillators to generate sound dynamically, avoiding the need for external asset loading.
 */
function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    const audioCtx = new AudioContextClass();
    
    const playTone = (frequency, startTime, duration) => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, startTime);
      
      // Smooth fade-in and exponential fade-out for a bell-like quality
      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    const now = audioCtx.currentTime;
    // Elegant dual-tone chime: High pitch followed by slightly higher harmonic
    playTone(587.33, now, 0.25);      // D5
    playTone(880.00, now + 0.12, 0.35); // A5
  } catch (err) {
    console.warn('Audio play request blocked or failed:', err);
  }
}

/**
 * Formats a timestamp into a human-readable "time ago" string.
 */
function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  
  if (diffMs < 0) return 'Just now';
  
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
