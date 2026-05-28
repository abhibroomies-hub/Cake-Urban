import React from 'react';
import { motion } from 'motion/react';

export function AnnouncementBar() {
  const announcements = [
    "✨ Order Elite Designer Cakes Online in Delhi NCR",
    "🎂 Customized Masterpieces Created Live in Our 3D Atelier Studio",
    "🚚 Specially Curated Air-Suspended Same-Day Refrigerated Cake Delivery",
    "⭐ 4.9 Star Rated Confectionery Network with Trusted Secure Checkouts",
    "🍒 Eggless & Diet Friendly Baking Formulations Tailored on Requisition",
    "💫 Get Fast Direct Support with Chefs on WhatsApp"
  ];

  // Join the bullet messages together
  const repeatedText = [...announcements, ...announcements].join("   •   ") + "   •   ";

  return (
    <div className="bg-[#cc7a74] text-white py-2.5 overflow-hidden border-b border-[#FAF7F5]/10 select-none relative z-50">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{
            ease: "linear",
            duration: 40,
            repeat: Infinity,
          }}
          className="flex gap-4 text-[10px] sm:text-xs uppercase font-black tracking-[0.25em]"
        >
          <span>{repeatedText}</span>
          <span>{repeatedText}</span>
        </motion.div>
      </div>
    </div>
  );
}
