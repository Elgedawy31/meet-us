'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../store/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure this runs only on the client-side
      if (!token && pathname !== '/login') {
        router.replace('/login');
      }
    }
  }, [token, pathname, router]);

  if (!token && pathname !== '/login') {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
};

export default AuthGuard;
