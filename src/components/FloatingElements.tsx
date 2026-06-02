import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Star } from 'lucide-react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export function FloatingElements() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    let idCounter = 0;
    
    // Throttled event listener to prevent overkill event loops
    let lastTime = 0;
    const handlePointerMove = (e: PointerEvent) => {
      const now = Date.now();
      if (now - lastTime < 50) return; // limit sparkle generation rate for 60fps performance
      lastTime = now;

      const size = Math.random() * 18 + 10;
      const colors = ['#DFB15B', '#DE9088', '#FAD390', '#FFFDFB', '#E8DDD7'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const newSparkle: Sparkle = {
        id: idCounter++,
        x: e.clientX,
        y: e.clientY,
        size,
        color: randomColor
      };
      
      setSparkles((prev) => [...prev.slice(-20), newSparkle]); // Max 20 particles on screen to avoid DOM pressure
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[120] overflow-hidden">
      {/* Background drifting luxury icons (low opacity for deluxe atmosphere) */}
      <div className="absolute inset-0 opacity-[0.05]">
        {[
          { icon: Heart, top: '15%', left: '10%' },
          { icon: Star, top: '45%', left: '85%' },
          { icon: Sparkles, top: '75%', left: '8%' },
          { icon: Heart, top: '25%', left: '80%' },
          { icon: Star, top: '85%', left: '70%' },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ y: 0, rotate: 0 }}
            animate={{ 
              y: [0, -30, 0],
              rotate: [0, 20, -20, 0]
            }}
            transition={{
              duration: 12 + idx * 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute animate-spin-slow"
            style={{ top: item.top, left: item.left }}
          >
            <item.icon className="w-10 h-10 text-amber-950" />
          </motion.div>
        ))}
      </div>

      {/* Floating Sparkles Mouse Follow Trail */}
      <AnimatePresence>
        {sparkles.map((sp) => (
          <motion.div
            key={sp.id}
            initial={{ opacity: 1, scale: 0.1, x: sp.x - sp.size/2, y: sp.y - sp.size/2 }}
            animate={{ 
              opacity: [1, 0.8, 0], 
              scale: 1.3, 
              y: sp.y - sp.size/2 - 50, 
              x: sp.x - sp.size/2 + (Math.random() * 40 - 20) 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute pointer-events-none"
            style={{ width: sp.size, height: sp.size, color: sp.color }}
          >
            <Sparkles className="w-full h-full fill-current drop-shadow-[0_2px_12px_rgba(223,177,91,0.6)]" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
