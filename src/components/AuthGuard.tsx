'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

const publicPaths = ['/login', '/signup']; // Define your public paths here

const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { userInfo, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return; // Wait for the store to hydrate

    const isPublicPath = publicPaths.includes(pathname);

    if (userInfo && isPublicPath) {
      // If logged in and on a public path, redirect to dashboard
      router.replace('/dashboard');
    } else if (!userInfo && !isPublicPath) {
      // If not logged in and on a protected path, redirect to login
      router.replace('/login');
    }
  }, [userInfo, _hasHydrated, pathname, router]);

  if (!_hasHydrated || (userInfo && publicPaths.includes(pathname)) || (!userInfo && !publicPaths.includes(pathname))) {
    // Optionally show a loading spinner while hydrating or redirecting
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-10 w-10 text-purple-700" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
