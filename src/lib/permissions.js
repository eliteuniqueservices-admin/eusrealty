// Role-based permission matrix for EUSRealty ERP
// Each role defines what they CAN access

export const ROLES = {
  ADMIN: 'admin',
};

export const PERMISSIONS = {
  admin: {
    properties: ['create', 'read', 'update', 'delete'],
    blogs: ['create', 'read', 'update', 'delete'],
    settings: ['read', 'update'],
    jobPosts: ['create', 'read', 'update', 'delete'],
  },
};

// Route-level access control
export const ROUTE_PERMISSIONS = {
  '/admin/dashboard': ['admin'],
  '/admin/dashboard/properties': ['admin'],
  '/admin/dashboard/manage-blogs': ['admin'],
  '/admin/dashboard/settings': ['admin'],
  '/admin/dashboard/manage-job-posts': ['admin'],
  '/admin/dashboard/chat-leads': ['admin'],
};

export function hasPermission(role, module, action) {
  return role === 'admin' && PERMISSIONS.admin[module]?.includes(action);
}

export function canAccessRoute(role, pathname) {
  return role === 'admin';
}

// Navigation items per role
export function getNavItems(role) {
  if (role !== 'admin') return [];
  return [
    { name: 'Overview', href: '/admin/dashboard', icon: 'LayoutDashboard', roles: ['admin'] },
    { name: 'Properties', href: '/admin/dashboard/properties', icon: 'Building2', roles: ['admin'] },
    { name: 'Blog Posts', href: '/admin/dashboard/manage-blogs', icon: 'FileText', roles: ['admin'] },
    { name: 'Job Posts', href: '/admin/dashboard/manage-job-posts', icon: 'Briefcase', roles: ['admin'] },
    { name: 'Applications', href: '/admin/dashboard/job-applications', icon: 'Users', roles: ['admin'] },
    { name: 'Loan Applied', href: '/admin/dashboard/loan-applications', icon: 'Banknote', roles: ['admin'] },
    { name: 'Chat Leads', href: '/admin/dashboard/chat-leads', icon: 'MessageSquare', roles: ['admin'] },
    { name: 'Subscribers', href: '/admin/dashboard/subscribers', icon: 'Mail', roles: ['admin'] },
    { name: 'Settings', href: '/admin/dashboard/settings', icon: 'Settings', roles: ['admin'] },
  ];
}
