import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Search, Heart, ShoppingBag, User, Sparkles, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUI, useCart } from '../lib/store';
import { playBtnTap } from '../lib/sound';

export function MobileNav() {
  const location = useLocation();
  const { setSearchOpen } = useUI();
  const cartItems = useCart((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Keep track of clicked indexes for visual haptic ripples
  const [pulseIndex, setPulseIndex] = useState<number | null>(null);

  const NAV_ITEMS = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid, label: 'Shop', path: '/shop' },
    { icon: Search, label: 'Search', action: () => setSearchOpen(true) },
    // Center element will be our special highlighted gold button (Custom Studio)
    { icon: ChefHat, label: 'Studio', path: '/custom-order', isCenter: true },
    { icon: Heart, label: 'Wishlist', path: '/profile' }, // pointing to safe user profiles / pages
    { icon: ShoppingBag, label: 'Cart', path: '/cart', badge: cartCount },
    { icon: User, label: 'Account', path: '/profile' },
  ];

  const handleTriggerPulse = (index: number) => {
    playBtnTap();
    setPulseIndex(index);
    setTimeout(() => setPulseIndex(null), 700);
  };

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[96%] max-w-[440px] select-none">
      {/* Curved Console Border Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#DFB15B]/20 via-transparent to-transparent blur-lg rounded-[36px] -z-10" />

      {/* Main Console */}
      <nav className="relative bg-[#1a0c0a]/95 backdrop-blur-2xl border border-[#DFB15B]/30 rounded-[36px] px-3 py-2 flex items-center justify-between shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
        
        {/* Subtle decorative gold line across the console layout */}
        <div className="absolute left-6 right-6 top-[48%] h-[1px] bg-gradient-to-r from-transparent via-[#DFB15B]/15 to-transparent pointer-events-none" />

        {NAV_ITEMS.map((item, index) => {
          const isActive = item.path ? location.pathname === item.path : false;
          const isPulseActive = pulseIndex === index;

          if (item.isCenter) {
            // CENTRAL PROMINENT CIRCULAR GOLD BUTTON
            return (
              <div key={index} className="relative -mt-6 shrink-0 z-20">
                {/* Visual pulse rings radiating from center */}
                <div className="absolute -inset-1.5 rounded-full bg-[#DFB15B]/20 animate-ping duration-2000" />
                <div className="absolute -inset-3.5 rounded-full bg-[#DFB15B]/10 animate-pulse duration-3000" />
                
                <Link
                  to={item.path || '#'}
                  onClick={() => handleTriggerPulse(index)}
                  className="relative flex flex-col items-center justify-center w-15 h-15 rounded-full bg-gradient-to-tr from-amber-600 via-[#DFB15B] to-yellow-300 text-black shadow-[0_10px_25px_rgba(223,177,91,0.45)] hover:shadow-[0_15px_30px_rgba(223,177,91,0.6)] border-2 border-amber-950 transition-all duration-300 scale-110 active:scale-95 group"
                >
                  <item.icon className="w-6 h-6 animate-pulse text-amber-950" strokeWidth={2.5} />
                  <span className="text-[6.5px] font-black uppercase tracking-widest text-amber-950 leading-none mt-0.5">{item.label}</span>
                  
                  {/* Miniature decorative star */}
                  <div className="absolute -top-1 right-2">
                    <Sparkles className="w-3 h-3 text-white fill-white animate-spin-slow" />
                  </div>
                </Link>
              </div>
            );
          }

          const itemContent = (
            <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300 relative ${
              isActive 
                ? 'text-[#DFB15B] bg-[#DFB15B]/10 border border-[#DFB15B]/15' 
                : 'text-zinc-400 hover:text-white'
            }`}>
              {/* Dynamic Haptic Visual Pulse Ring */}
              <AnimatePresence>
                {isPulseActive && (
                  <motion.span
                    initial={{ scale: 0.2, opacity: 0.9 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 to-[#DFB15B] filter blur-[2px] pointer-events-none -z-10"
                  />
                )}
              </AnimatePresence>

              <item.icon className="w-4 h-4 mb-0.5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[6.5px] font-black uppercase tracking-tight leading-none scale-90">{item.label}</span>
              
              {/* Cart Items count badge */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#DFB15B] text-black text-[8px] font-black rounded-full h-3.5 w-3.5 flex items-center justify-center border border-amber-950">
                  {item.badge}
                </span>
              )}
              
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 w-1 h-1 bg-[#DFB15B] rounded-full shadow-[0_0_8px_#DFB15B]"
                />
              )}
            </div>
          );

          if (item.action) {
            return (
              <button 
                key={index} 
                onClick={() => { handleTriggerPulse(index); item.action(); }}
                className="focus:outline-none shrink-0"
              >
                {itemContent}
              </button>
            );
          }

          return (
            <Link
              key={index}
              to={item.path || '#'}
              onClick={() => handleTriggerPulse(index)}
              className="shrink-0"
            >
              {itemContent}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
