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
  const _hasHydrated = useAuthStore((state) => state._hasHydrated);

  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure this runs only on the client-side
      if (_hasHydrated && !token && pathname !== '/login') {
        router.replace('/login');
      } else if (_hasHydrated && token && pathname === '/login') {
        router.replace('/');
      }
    }
  }, [token, pathname, router, _hasHydrated]);

  if (!_hasHydrated) {
    return null; // Or a loading spinner
  }

  if (!token && pathname !== '/login') {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
};

export default AuthGuard;
