import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Copy, Check, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';
import { FALLBACK_PRODUCTS } from '../lib/fallbackProducts';

const DELHI_NCR_LOCATIONS = [
  'Saket, New Delhi',
  'Sector 15, Faridabad',
  'DLF Phase 3, Gurgaon',
  'Sector 62, Noida',
  'Indirapuram, Ghaziabad',
  'Vasant Kunj, South Delhi',
  'Greenfield, Faridabad',
  'Sohna Road, Gurgaon',
  'Greater Noida'
];

const CUSTOMER_NAMES = [
  'Aanya', 'Rahul', 'Dev', 'Jessica', 'Meera', 'Karan', 'Priya', 'Amit', 'Sneha', 'Rohan'
];

export function LiveToastAndExitPopup() {
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [hasShownExit, setHasShownExit] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Recent orders state
  const [activeOrder, setActiveOrder] = useState<any | null>(null);

  // 1. EXIT INTENT DETECTOR
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // If cursor goes above viewport top boundary (towards tabs/close window)
      if (e.clientY < 15 && !hasShownExit) {
        setShowExitPopup(true);
        setHasShownExit(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShownExit]);

  // 2. RECENT ORDER AUTOMATION
  useEffect(() => {
    const triggerOrderToast = () => {
      const randomProduct = FALLBACK_PRODUCTS[Math.floor(Math.random() * FALLBACK_PRODUCTS.length)];
      const randomLocation = DELHI_NCR_LOCATIONS[Math.floor(Math.random() * DELHI_NCR_LOCATIONS.length)];
      const randomName = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
      
      setActiveOrder({
        name: randomName,
        location: randomLocation,
        product: randomProduct.name,
        time: Math.floor(Math.random() * 8) + 1,
        image: randomProduct.images[0]
      });

      // Dismiss after 6 seconds
      setTimeout(() => {
        setActiveOrder(null);
      }, 6000);
    };

    // First trigger after 8 seconds
    const initialTimer = setTimeout(triggerOrderToast, 8000);
    // Cycle every 25 seconds
    const interval = setInterval(triggerOrderToast, 25000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('URBANCAKE10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* 2. RECENTLY ORDERED TOAST Notification (Bottom-Left) */}
      <AnimatePresence>
        {activeOrder && (
          <motion.div
            initial={{ opacity: 0, x: -50, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
            className="fixed bottom-24 left-4 sm:bottom-8 sm:left-8 z-[90] bg-[#2D150F] text-white rounded-3xl p-4 flex items-center gap-4 shadow-2xl border border-[#DE9088]/20 max-w-[340px] pointer-events-auto"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 overflow-hidden shrink-0">
              <img 
                src={activeOrder.image} 
                alt="Quick purchase" 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="text-left space-y-0.5">
              <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-[#DE9088] tracking-widest">
                <Sparkles className="w-3 h-3 animate-pulse text-[#DE9088]" />
                <span>Live Purchase NCR</span>
              </div>
              <p className="text-xs font-bold text-amber-50">
                {activeOrder.name} in {activeOrder.location}
              </p>
              <p className="text-[10px] text-[#f3ddd6]/70 font-semibold italic truncate max-w-[210px]">
                ordered {activeOrder.product}
              </p>
              <p className="text-[8px] text-[#f3ddd6]/45 italic font-medium">
                {activeOrder.time} minutes ago
              </p>
            </div>

            <button 
              onClick={() => setActiveOrder(null)} 
              className="text-white/40 hover:text-white p-1 self-start ml-2 focus:outline-none"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. EXIT INTENT POPUP COMPONENT (Modal Backdrop) */}
      <AnimatePresence>
        {showExitPopup && (
          <div className="fixed inset-0 bg-[#2D150F]/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-white rounded-[36px] p-6 sm:p-10 w-full max-w-lg text-center border border-[#E8DDD7] shadow-3xl overflow-hidden relative"
            >
              {/* Luxury gold/cream highlight lines */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-200 via-[#DE9088] to-amber-200" />
              
              <button 
                onClick={() => setShowExitPopup(false)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#FAF7F5] flex items-center justify-center text-[#2D150F] hover:bg-[#DE9088] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6 text-center mt-4">
                <div className="w-16 h-16 bg-[#DE9088]/15 rounded-full flex items-center justify-center mx-auto text-[#DE9088]">
                  <ShoppingBag className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#DE9088]">Limited Special Offer</span>
                  <h3 className="text-2xl sm:text-4xl font-display font-black text-[#2D150F] leading-tight">
                    Wait! Don't leave empty-handed
                  </h3>
                  <p className="text-xs text-[#2D150F]/60 max-w-md mx-auto italic font-medium leading-relaxed">
                    Savor Faridabad's finest premium bakes. Complete your search now and get a complimentary flat <strong className="text-[#DE9088]">10% OFF</strong> on any celebration cake or hamper!
                  </p>
                </div>

                {/* Coupon Code copy zone */}
                <div className="bg-[#FAF7F5] border border-dashed border-[#DE9088]/40 p-4 rounded-2xl flex items-center justify-between gap-4 max-w-sm mx-auto">
                  <div className="text-left">
                    <p className="text-[8px] font-black uppercase text-[#2D150F]/50 tracking-widest">Your Private Code</p>
                    <p className="text-base font-black text-[#2D150F] tracking-wider font-mono">URBANCAKE10</p>
                  </div>
                  
                  <button
                    onClick={handleCopyCoupon}
                    className="h-10 px-4 rounded-xl bg-[#2D150F] text-white hover:bg-[#DE9088] text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors relative"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                  <button
                    onClick={() => setShowExitPopup(false)}
                    className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#2D150F] text-amber-50 hover:bg-[#DE9088] text-xs font-black uppercase tracking-widest transition-colors shadow-md"
                  >
                    Get 10% Off Now
                  </button>
                  <button
                    onClick={() => setShowExitPopup(false)}
                    className="text-[10px] uppercase font-black text-[#2D150F]/50 hover:text-[#2D150F] tracking-widest"
                  >
                    No thanks, I'll pay full price
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
