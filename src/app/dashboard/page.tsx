'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogOut, User, Mail } from 'lucide-react';

const DashboardPage = () => {
  const { userInfo, logout, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (_hasHydrated && !userInfo) {
      router.replace('/login');
    }
  }, [userInfo, _hasHydrated, router]);

  if (!_hasHydrated || !userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 animate-gradient-shift">
        <div className="text-gray-800 text-3xl font-light flex items-center space-x-3">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-6 animate-gradient-shift">
      <div className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-10 max-w-xl w-full text-gray-800 animate-fade-in border border-gray-100">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-700 animate-slide-down">
          Welcome, <span className="text-gray-900">{userInfo.name}!</span>
        </h1>
        
        <div className="space-y-6 mb-8 animate-fade-in delay-200 text-left w-full">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 mb-1">
              <User size={18} />
              <span>User ID</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 leading-tight pl-6">{userInfo.id}</p>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 mb-1">
              <Mail size={18} />
              <span>Email Address</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 leading-tight pl-6">{userInfo.email}</p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            router.replace('/login');
          }}
          className="w-full flex items-center justify-center bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors duration-200 ease-in-out cursor-pointer animate-fade-in delay-400"
        >
          <LogOut className="mr-3" size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
