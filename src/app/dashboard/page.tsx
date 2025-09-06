'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const DashboardPage = () => {
  const { userInfo, logout, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (_hasHydrated && !userInfo) {
      router.replace('/login'); // Redirect to login if not authenticated after hydration
    }
  }, [userInfo, _hasHydrated, router]);

  if (!_hasHydrated || !userInfo) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome to your Dashboard!</h1>
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <p className="text-lg text-gray-700 mb-4">User ID: <span className="font-semibold">{userInfo.id}</span></p>
        <p className="text-lg text-gray-700 mb-6">User Name: <span className="font-semibold">{userInfo.name}</span></p>
        <button
          onClick={() => {
            logout();
            router.replace('/login');
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
