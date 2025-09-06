'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { Lock, MailCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submitted", email, password);
    console.log("Yessssss");
    
    try {
      // In a real application, you would send a request to your backend for authentication.
      // For this example, we'll simulate a successful login with a dummy token.
      // const dummyToken = 'your-jwt-token-here'; 
      await login({ email, password }); // ✅ استنى تسجيل الدخول
      router.push('/'); // ✅ بعد النجاح
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  
 return (
    <div className="min-h-screen  flex overflow-hidden  bg-[url('/login-bg.svg')] bg-cover bg-center">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center w-2/5 ">
        <div className="w-full text-center max-w-sm space-y-9">
          <div className="">
          <h1 className="text-[56px] text-black leading-[120%] mb-2">Welcome back</h1>
          <p className="text-gray-500 text-lg leading-[155%]">
            Step into our shopping metaverse for an unforgettable shopping
            experience
          </p>
          </div>
            
          <form onSubmit={handleSubmit} className='space-y-5'>

          {/* Email Input */}
          <div className="relative">
            <MailCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1E]" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 text-black py-4 border border-white bg-[#FFFFFF66] rounded-lg focus:ring-2 outline-none placeholder:text-[#62626B] text-base"
              
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1E]" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 text-black py-4 border border-white bg-[#FFFFFF66] rounded-lg focus:ring-2 outline-none placeholder:text-[#62626B] text-base"
            />
          </div>

          {/* Login Button */}
          <button
          type='submit'
            className="w-full mt-4 bg-[#9414FF] hover:bg-purple-700 cursor-pointer text-white py-2 rounded-lg transition disabled:opacity-50"
            disabled={!email || !password}
          >
            Login
          </button>
          </form>
          

          <p className="text-center text-sm text-gray-500">
            Don’t have an account? <Link href="/signup" className="text-purple-700">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right Side - Logo */}
      <div className="flex flex-col relative justify-center items-center w-3/5">
        <Image 
          src="/meet-us-logo.png" 
          alt="image" 
          className="absolute  w-full h-screen"
          width={744}
          height={723}
          />
          <Image
           src="/meet-text.svg" 
           alt="image" 
          className="relative top-36"

           width={413} 
           height={75} 
         />
      </div>
    </div>
  );
};

export default LoginPage;
