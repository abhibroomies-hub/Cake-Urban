import React from 'react';
import { Instagram, Facebook, Phone } from 'lucide-react';
import { motion } from 'motion/react';

export function AnnouncementBar() {
  return (
    <div className="bg-[#cc7a74] text-white text-[10px] sm:text-xs tracking-wide">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-4 text-center font-medium">
        <span className="flex items-center gap-1">✨ Free Shipping on Orders Above ₹9999</span>
        <span className="opacity-40">|</span>
        <span className="flex items-center gap-1">🚚 Same Day Delivery in Faridabad</span>
      </div>
    </div>
  );
}
