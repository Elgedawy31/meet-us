'use client';

import { useAuthStore } from '../store/authStore';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-center text-4xl font-bold text-gray-900">Welcome to the Dashboard!</h1>
        <p className="mb-6 text-center text-lg text-gray-700">You are logged in.</p>
        <button
          onClick={handleLogout}
          className="focus:shadow-outline w-full rounded-md bg-red-600 px-4 py-3 text-white hover:bg-red-700 focus:outline-none"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
