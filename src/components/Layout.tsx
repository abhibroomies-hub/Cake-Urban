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
      className="min-h-screen bg-[#F8F4F1] flex flex-col relative overflow-hidden select-none"
      style={{ backgroundImage: bgPattern }}
    >
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
