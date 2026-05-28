import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Heart, Star, Sparkles } from 'lucide-react';

const ELEMENTS = [
  { Icon: Utensils, top: '10%', left: '5%', delay: 0 },
  { Icon: Heart, top: '40%', left: '85%', delay: 2 },
  { Icon: Star, top: '70%', left: '10%', delay: 4 },
  { Icon: Sparkles, top: '20%', left: '80%', delay: 1 },
  { Icon: Heart, top: '85%', left: '75%', delay: 5 },
  { Icon: Star, top: '15%', left: '25%', delay: 3 },
];

export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.03]">
      {ELEMENTS.map((el, i) => (
        <motion.div
          key={i}
          initial={{ y: 0, rotate: 0, opacity: 0 }}
          animate={{ 
            y: [0, -40, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0, 1, 0.5, 1],
          }}
          transition={{ 
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            delay: el.delay,
            ease: "easeInOut"
          }}
          className="absolute"
          style={{ top: el.top, left: el.left }}
        >
          <el.Icon className="w-12 h-12 text-[#3B1F17]" strokeWidth={1} />
        </motion.div>
      ))}
    </div>
  );
}
