import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { playBtnTap } from '../lib/sound';

interface LiquidGoldButtonProps {
  onClick?: () => void;
  text?: string;
  className?: string;
}

export function LiquidGoldButton({ onClick, text = "ORDER NOW", className = "" }: LiquidGoldButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleTap = () => {
    playBtnTap();
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);
    if (onClick) onClick();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Dynamic Golden Aura Shadow */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-amber-500 via-[#DFB15B] to-yellow-400 rounded-2xl filter blur-md transition-all duration-500 opacity-60 ${
          isHovered ? 'blur-xl scale-105 opacity-85' : 'blur-md opacity-50'
        }`} 
      />

      {/* Main Interactive Button Body */}
      <motion.button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleTap}
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="relative w-full overflow-hidden bg-gradient-to-r from-amber-950 via-[#26130F] to-amber-950 border-2 border-[#DFB15B] text-white rounded-2xl px-6 py-4 flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(223,177,91,0.25)] hover:shadow-[0_15px_40px_rgba(223,177,91,0.5)] transition-all duration-300 select-none group"
      >
        {/* Shifting Liquid-Gold Viscous Fluid Animation (using absolute layers) */}
        <div className="absolute inset-0 z-0 opacity-80 mix-blend-color-dodge pointer-events-none">
          <motion.div 
            animate={{
              x: isHovered ? ['-20%', '20%', '-20%'] : ['-10%', '10%', '-10%'],
              y: isHovered ? ['-10%', '10%', '-10%'] : ['0%', '5%', '0%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-10 bg-[radial-gradient(circle_at_center,_#DFB15B_0%,_transparent_60%)] opacity-40 filter blur-xl"
          />
          <motion.div 
            animate={{
              x: isHovered ? ['20%', '-20%', '20%'] : ['15%', '-15%', '15%'],
              y: isHovered ? ['10%', '-10%', '10%'] : ['-5%', '5%', '-5%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute -inset-10 bg-[radial-gradient(circle_at_center,_#FFFDFB_0%,_transparent_55%)] opacity-30 filter blur-xl"
          />
        </div>

        {/* Liquid Pouring / Flowing Shimmer Bar */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-[#DFB15B]/30 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />

        {/* Click Feedback - Expanding Liquid-Gold Wave Ripple */}
        <AnimatePresence>
          {isClicked && (
            <motion.span
              initial={{ scale: 0, opacity: 0.9 }}
              animate={{ scale: 4.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-yellow-300 via-[#DFB15B] to-amber-500 z-10 filter blur-xs pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Content Labels */}
        <span className="relative z-20 font-display font-black tracking-[0.2em] text-[#DFB15B] group-hover:text-yellow-200 text-xs sm:text-sm uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {text}
        </span>

        <Sparkles className="relative z-20 w-4 h-4 sm:w-5 sm:h-5 text-[#DFB15B] group-hover:text-yellow-200 group-hover:rotate-12 transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />

        {/* Liquid bottom gold rim glowing accent */}
        <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#DFB15B] to-transparent shadow-[0_-2px_6px_#DFB15B]" />
      </motion.button>
    </div>
  );
}
