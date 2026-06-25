import React, { useState, useEffect } from 'react';
import { Header, AISearchModal } from './Header';
import { Footer } from './Footer';
import { Toaster } from 'sonner';
import { AnnouncementBar } from './AnnouncementBar';
import { FloatingElements } from './FloatingElements';
import { MobileNav } from './MobileNav';
import { LiveToastAndExitPopup } from './LiveToastAndExitPopup';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useTheme } from '../lib/theme';

export function Layout({ children }: { children: React.ReactNode }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { activeTheme } = useTheme();

  useEffect(() => {
    let frameId: number;
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        const px = ((x + 1) / 2) * 100;
        const py = ((y + 1) / 2) * 100;
        containerRef.current.style.setProperty('--mouse-x', `${x}`);
        containerRef.current.style.setProperty('--mouse-y', `${y}`);
        containerRef.current.style.setProperty('--mouse-px', `${px}%`);
        containerRef.current.style.setProperty('--mouse-py', `${py}%`);
      });
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMove);
    };
  }, []);

  const fillAccent = (activeTheme?.accent || '#DFB15B').replace('#', '%23');
  const bgPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cg fill='${fillAccent}' fill-opacity='0.025'%3E%3Cpath d='M15 15c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5zm0 80c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5zm80 0c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5zm0-80c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5zm-50 40c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3zM25 55c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v2c0 .6-.4 1-1 1h-6a1 1 0 01-1-1v-2zm80 0c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v2c0 .6-.4 1-1 1h-6a1 1 0 01-1-1v-2zm-40-5C65 42 75 32 75 32s10 10 10 18H65zm0 14h20v2H65v-2zM15 130l5-3 5 3v6h-10v-6zm80 0l5-3 5 3v6H95v-6z'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-tr from-[#080808] via-[#121212] to-[#0B0B0B] flex flex-col relative overflow-hidden text-[#FFFDFB]"
      style={{ 
        backgroundImage: bgPattern,
        backgroundAttachment: 'fixed'
      }}
    >
      {/* 3D Glossy Live Moving Wave Elements & Mouse Tracker Parallax Layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* Dynamic Sweeping Diagonal Metallic Reflection / Glass Sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.035] to-transparent -translate-y-full rotate-12 animate-glossy-sheen pointer-events-none" />

        {/* Dynamic interactive background gradient tracking the cursor */}
        <div 
          className="absolute inset-0 opacity-40 transition-transform duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle 480px at var(--mouse-px, 50%) var(--mouse-py, 50%), ${activeTheme.accentLight}, transparent)`,
          }}
        />

        {/* Interactive Smooth Camel Gold Shifting Blob with parallax drift */}
        <div 
          className="absolute top-[-10%] left-[-15%] w-[80vw] h-[80vw] sm:w-[60vw] sm:h-[60vw] opacity-[0.14] blur-[100px] sm:blur-[140px] rounded-full animate-wave-slow mix-blend-screen transition-all duration-750 ease-out"
          style={{
            backgroundColor: activeTheme.accent,
            transform: `translate(calc(var(--mouse-x, 0) * -25px), calc(var(--mouse-y, 0) * -25px))`,
          }}
        />
        
        {/* Luxurious Rose Syrup Shifting Blob with inverse parallax drift */}
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] sm:w-[65vw] sm:h-[65vw] opacity-[0.11] blur-[120px] sm:blur-[160px] rounded-full animate-wave-secondary mix-blend-screen transition-all duration-750 ease-out" 
          style={{
            backgroundColor: activeTheme.id === 'classic' ? '#DE8070' : activeTheme.accent,
            transform: `translate(calc(var(--mouse-x, 0) * 25px), calc(var(--mouse-y, 0) * 25px))`,
          }}
        />
        
        {/* Ambient Velvet Fudge Accent Blob */}
        <div 
          className="absolute top-[35%] left-[20%] w-[60vw] h-[60vw] bg-[#D89C95] opacity-[0.06] blur-[110px] sm:blur-[130px] rounded-full animate-wave-third transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(calc(var(--mouse-x, 0) * -10px), calc(var(--mouse-y, 0) * 15px))`,
          }}
        />

        {/* Realistic Translucent 3D Floating Glass Spheres with real drop-shadows (4D depth layer) */}
        <div 
          className="absolute top-[18%] left-[8%] w-16 h-16 rounded-full bg-white/[0.04] border border-white/20 backdrop-blur-md shadow-2xl transition-transform duration-500"
          style={{
            transform: `translate(calc(var(--mouse-x, 0) * -35px), calc(var(--mouse-y, 0) * -35px)) rotate(calc(var(--mouse-x, 0) * 12deg))`,
            boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.3), inset 8px 8px 20px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.4)',
            transition: 'transform 0.1s ease-out'
          }}
        />

        <div 
          className="absolute bottom-[22%] right-[12%] w-24 h-24 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl transition-transform duration-500"
          style={{
            transform: `translate(calc(var(--mouse-x, 0) * 40px), calc(var(--mouse-y, 0) * 40px)) rotate(calc(var(--mouse-y, 0) * -15deg))`,
            boxShadow: 'inset -12px -12px 30px rgba(0,0,0,0.4), inset 12px 12px 30px rgba(255,255,255,0.08), 0 35px 50px rgba(0,0,0,0.5)',
            transition: 'transform 0.1s ease-out'
          }}
        />

        <div 
          className="absolute top-[65%] left-[85%] w-12 h-12 rounded-full bg-[#DFB15B]/[0.08] border border-[#DFB15B]/20 backdrop-blur-sm shadow-2xl transition-transform duration-700"
          style={{
            transform: `translate(calc(var(--mouse-x, 0) * -20px), calc(var(--mouse-y, 0) * -20px))`,
            boxShadow: 'inset -5px -5px 12px rgba(0,0,0,0.3), inset 5px 5px 12px rgba(255,255,255,0.14), 0 15px 30px rgba(0,0,0,0.4)',
            transition: 'transform 0.1s ease-out'
          }}
        />
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
