'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, userType, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const validateAccess = async () => {
      const token = localStorage.getItem('token') || '';
      const currentUserType = localStorage.getItem('userType') || '';
      
      console.log('Validating admin access:', {
        isAuthenticated,
        userType,
        token,
        currentUserType
      });

      if (!isLoading && (!isAuthenticated || !['ADMIN', 'STAFF'].includes(userType || ''))) {
        console.log('Unauthorized admin access, redirecting...');
        router.push('/admin/login');
      }
    };

    validateAccess();
  }, [isAuthenticated, userType, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  // Jika tidak terautentikasi atau bukan admin/staff, return null
  if (!isAuthenticated || !['ADMIN', 'STAFF'].includes(userType || '')) {
    return null;
  }

  return <div className="min-h-screen bg-primary_bg">{children}</div>;
}