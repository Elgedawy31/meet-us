'use client';

import LoginForm from '@/components/LoginForm';
import Image from 'next/image';

const LoginPage = () => {
  
  
 return (
    <div className="min-h-screen  flex overflow-hidden  bg-[url('/login-bg.svg')] bg-cover bg-center">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center w-2/5 ">
        <div className="w-full text-center max-w-sm space-y-9">
          <div className="">
          <h1 className="text-[56px] text-foreground leading-[120%] mb-2">Welcome back</h1>
          <p className="text-[#62626B] text-lg leading-[155%]">
            Step into our shopping metaverse for an unforgettable shopping
            experience
          </p>
          </div>
            
          <LoginForm />
          

          
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
