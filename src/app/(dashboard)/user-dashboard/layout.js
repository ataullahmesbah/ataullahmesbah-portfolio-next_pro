"use client";

import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  if (user.role !== 'admin') { // ইউজার রোল চেক করুন
    router.push('/dashboard/userdashboard');
    return null;
  }

  return <>{children}</>;
}