'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const HomePage = () => {
  const { userInfo, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (_hasHydrated) {
      if (userInfo) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [userInfo, _hasHydrated, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Loading...</p>
    </div>
  );
};

export default HomePage;
