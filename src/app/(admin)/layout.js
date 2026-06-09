'use client';
import { SessionProvider } from 'next-auth/react';
import AdminShell from '@/components/admin/AdminShell';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <SessionProvider>
      {isLoginPage ? children : <AdminShell>{children}</AdminShell>}
    </SessionProvider>
  );
}