import React from 'react';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';

export function LiveTicker() {
  return (
    <div className="bg-gradient-to-r from-[#D89C95] to-[#E9C9BE] text-white py-2.5 px-6 md:px-10 flex items-center justify-center lg:justify-between text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] relative z-[60] shadow-sm">
      <div className="hidden lg:flex items-center gap-2">
        <span>✨ Celebrating Sweet Moments – Freshly Baked with Love ✨</span>
      </div>
      
      <div className="flex items-center gap-4 md:gap-12">
        <span className="flex items-center gap-2">
           <span className="text-xs">🚚</span> Free Shipping Above ₹999
        </span>
        <span className="h-3 w-[1px] bg-white/30 hidden sm:block" />
        <span className="flex items-center gap-2">
           <span className="text-xs">🕒</span> Same Day Delivery in Faridabad
        </span>
      </div>

      <div className="hidden lg:flex items-center gap-5">
        <a href="#" className="hover:opacity-70 transition-opacity"><Instagram size={14} strokeWidth={2.5} /></a>
        <a href="#" className="hover:opacity-70 transition-opacity"><Facebook size={14} strokeWidth={2.5} /></a>
        <a href="#" className="hover:opacity-70 transition-opacity"><MessageCircle size={14} strokeWidth={2.5} /></a>
      </div>
    </div>
  );
}

