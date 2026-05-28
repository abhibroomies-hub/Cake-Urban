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
  return (
    <div className="min-h-screen bg-[#F8F4F1] flex flex-col relative overflow-hidden select-none">
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
