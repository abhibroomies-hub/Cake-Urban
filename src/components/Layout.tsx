import React from 'react';
import { Header, AISearchModal } from './Header';
import { Footer } from './Footer';
import { Toaster } from 'sonner';
import { AnnouncementBar } from './AnnouncementBar';
import { FloatingElements } from './FloatingElements';
import { MobileNav } from './MobileNav';
import { LiveToastAndExitPopup } from './LiveToastAndExitPopup';
import { motion } from 'motion/react';

export function Layout({ children }: { children: React.ReactNode }) {
  const bgPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cg fill='%23cc7a74' fill-opacity='0.035'%3E%3Cpath d='M15 15c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5zm0 80c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5zm80 0c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5zm0-80c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5zm-50 40c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3zM25 55c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v2c0 .6-.4 1-1 1h-6a1 1 0 01-1-1v-2zm80 0c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v2c0 .6-.4 1-1 1h-6a1 1 0 01-1-1v-2zm-40-5C65 42 75 32 75 32s10 10 10 18H65zm0 14h20v2H65v-2zM15 130l5-3 5 3v6h-10v-6zm80 0l5-3 5 3v6H95v-6z'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div 
      className="min-h-screen bg-[#F8F4F1] flex flex-col relative overflow-hidden"
      style={{ backgroundImage: bgPattern }}
    >
      {/* Premium Glossy Live Moving Wave Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Smooth Caramel Gold Shifting Blob */}
        <div className="absolute top-[-5%] left-[-15%] w-[70vw] h-[70vw] sm:w-[50vw] sm:h-[50vw] bg-[#DFB15B] opacity-[0.08] blur-[100px] sm:blur-[130px] rounded-full animate-wave-slow mix-blend-multiply" />
        
        {/* Luxurious Rose Syrup Shifting Blob */}
        <div className="absolute bottom-[5%] right-[-10%] w-[80vw] h-[80vw] sm:w-[55vw] sm:h-[55vw] bg-[#DE9088] opacity-[0.08] blur-[120px] sm:blur-[140px] rounded-full animate-wave-secondary mix-blend-multiply" />
        
        {/* Ambient Velvet Accent Shifting Blob */}
        <div className="absolute top-[40%] left-[25%] w-[50vw] h-[50vw] bg-[#D89C95] opacity-[0.05] blur-[110px] sm:blur-[120px] rounded-full animate-wave-third" />
      </div>

      <AnnouncementBar />
      <MobileNav />
      <FloatingElements />
      <LiveToastAndExitPopup />
      
      <Header />
      <AISearchModal />
      <main className="flex-grow flex-1 flex flex-col relative z-10">
        {children}
      </main>
      <Footer />
      <Toaster position="top-center" richColors />
    </div>
  );
}
