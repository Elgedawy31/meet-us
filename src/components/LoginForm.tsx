import React from 'react';
import { MailCheck, Lock, Loader } from 'lucide-react';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useLoginForm } from '@/hooks/useLoginForm';
import { LoginSchema } from '@/lib/validations/auth';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useLoginForm();
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const loading = useAuthStore((state) => state.loading);

  const onSubmit = async (data: LoginSchema) => {
    try {
      await login(data);
      router.push('/'); // Navigate only on success
    } catch (error) {
      // Error is handled by authStore and toast is displayed there
      console.error("Login failed in component:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
      <Toaster />

      {/* Email Input */}
      <div className="relative">
        <MailCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1E]" />
        <input
          type="email"
          placeholder="Email"
          {...register('email')}
          className="w-full pl-12 pr-4 text-black py-4 border border-white bg-[#FFFFFF66] rounded-lg focus:ring-2 outline-none placeholder:text-[#62626B] text-base"
        />
        {errors.email && <p className="absolute left-0 -bottom-6 text-red-500 text-sm text-start">{errors.email.message}</p>}
      </div>

      {/* Password Input */}
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1E]" />
        <input
          type="password"
          placeholder="Password"
          {...register('password')}
          className="w-full pl-12 pr-4 text-black py-4 border border-white bg-[#FFFFFF66] rounded-lg focus:ring-2 outline-none placeholder:text-[#62626B] text-base"
        />
        {errors.password && <p className="absolute left-0 -bottom-6 text-red-500 text-sm text-start">{errors.password.message}</p>}
      </div>

      {/* Login Button */}
      <button
        type='submit'
        className="w-full flex items-center justify-center mt-4 bg-[#9414FF] hover:bg-purple-700 cursor-pointer text-white py-2 rounded-lg transition disabled:opacity-50"
        disabled={Object.keys(errors).length > 0 || loading}
      >
        {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
        Login
      </button>

      <p className="text-center text-sm text-gray-500">
        Don’t have an account? <Link href="/signup" className="text-purple-700">Sign up</Link>
      </p>
    </form>
  );
};

export default LoginForm;

