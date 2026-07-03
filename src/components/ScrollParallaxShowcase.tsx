import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { Sparkle, Sparkles, ArrowRight, Star, Heart } from 'lucide-react';
import { playBtnTap, playSlidePop } from '../lib/sound';
import { handleImageError } from '../lib/utils';
import { useCart } from '../lib/store';
import { toast } from 'sonner';

interface ScrollParallaxShowcaseProps {
  products: Product[];
}

export function ScrollParallaxShowcase({ products }: ScrollParallaxShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  // Bind vertical viewport scroll coordinates of this section to horizontal translation offsets
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Apply responsive spring dynamics optimized for 180Hz+ screens
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 26,
    mass: 0.3,
    restDelta: 0.0001
  });

  // Track 1: Slides left-to-right as page scrolls down
  const x1 = useTransform(smoothProgress, [0, 1], ["-15%", "12%"]);
  // Track 2: Slides right-to-left as page scrolls down
  const x2 = useTransform(smoothProgress, [0, 1], ["12%", "-15%"]);
  
  // Dynamic rotate/scale effects for elements based on scroll progress
  const rotate1 = useTransform(smoothProgress, [0, 1], [-8, 8]);
  const rotate2 = useTransform(smoothProgress, [0, 1], [8, -8]);
  const bgGlowY = useTransform(smoothProgress, [0, 1], ["-20%", "20%"]);

  // Categorize or slice products to distribute into two stunning tracks
  const showcaseRow1 = products.filter(p => p.isBestseller).slice(0, 6);
  const showcaseRow2 = products.filter(p => !p.isBestseller).slice(0, 6);

  // If we don't have enough products, fall back to slicing the main array
  const row1 = showcaseRow1.length > 0 ? showcaseRow1 : products.slice(0, 5);
  const row2 = showcaseRow2.length > 0 ? showcaseRow2 : products.slice(5, 10);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    playBtnTap();
    addItem(product, {
      selectedWeight: 0.5,
      selectedFlavor: 'Chocolate Chocolate Truffle'
    });
    toast.success(`${product.name} (0.5kg) added to your cart!`, {
      description: "Customize your flavor & weight in the cart.",
      style: {
        background: '#2D150F',
        color: '#FFFDFB',
        border: '1px solid #DFB15B'
      }
    });
  };

  return (
    <section 
      ref={containerRef}
      className="py-24 relative overflow-hidden bg-transparent select-none border-y-2 border-[#DFB15B]/30"
    >
      {/* Dynamic Layered Parallax Background Glow */}
      <motion.div 
        style={{ y: bgGlowY }}
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
      >
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#DFB15B]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#DE9088]/8 rounded-full blur-[160px]" />
      </motion.div>

      {/* Outer Section Frame Grid & Decorative Swirl Lines */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.12] mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="parallax-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#DFB15B" strokeWidth="1.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#parallax-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-[#DFB15B]/15 text-[#DFB15B] border border-[#DFB15B]/40 px-5 py-2 rounded-full text-[10px] md:text-xs font-black tracking-[0.3em] uppercase shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#DFB15B] animate-pulse" />
            <span>Interactive Parallax Gallery</span>
          </div>
          <h3 className="text-3xl sm:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#DFB15B] to-yellow-100 tracking-tight drop-shadow-md">
            Artisanal Confection Track
          </h3>
          <p className="text-zinc-300 text-xs sm:text-sm font-bold italic max-w-xl mx-auto leading-relaxed">
            Scroll vertically to watch our gourmet masterpieces float and slide dynamically in physical depth.
          </p>
        </motion.div>
      </div>

      {/* TRACK 1: LEFT-TO-RIGHT SLIDER */}
      <div className="relative z-10 py-6 overflow-hidden">
        <motion.div 
          style={{ x: x1, rotate: rotate1 }} 
          className="flex gap-4 sm:gap-8 w-max px-[10%] will-change-transform"
        >
          {row1.map((product) => (
            <Link 
              to={`/product/${product.id}`} 
              key={product.id}
              onClick={playSlidePop}
              className="block shrink-0"
            >
              <div className="w-[240px] sm:w-[320px] rounded-[32px] sm:rounded-[40px] bg-gradient-to-b from-[#1E0D09]/95 to-[#0F0503]/95 border-2 border-[#DFB15B]/20 p-4 sm:p-5 relative group transition-all duration-500 hover:border-[#DFB15B]/80 hover:shadow-[0_20px_50px_rgba(223,177,91,0.25)] hover:-translate-y-2">
                
                {/* Visual Accent Corner Glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#DFB15B]/5 rounded-full blur-xl group-hover:bg-[#DFB15B]/15 transition-all duration-500" />
                
                {/* 3D Curved Photo Container */}
                <div className="w-full aspect-[4/3] rounded-[24px] sm:rounded-[30px] overflow-hidden relative bg-black/40">
                  <img 
                    src={product.images?.[0] || ''} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[1.05]"
                    onError={handleImageError}
                    referrerPolicy="no-referrer"
                  />
                  {product.isBestseller && (
                    <span className="absolute top-3 left-3 bg-[#DFB15B] text-black text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                      BESTSELLER
                    </span>
                  )}
                  {/* Glass shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                </div>

                {/* Info block */}
                <div className="mt-4 sm:mt-5 space-y-2 text-left">
                  <span className="text-[8px] sm:text-[9px] font-black uppercase text-[#DE9088] tracking-[0.2em]">
                    {product.categories?.[0] || 'Premium Bakes'}
                  </span>
                  <h4 className="text-sm sm:text-base font-display font-black text-white group-hover:text-[#DFB15B] transition-colors truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[#DFB15B] font-serif font-black italic text-base sm:text-lg">
                      ₹{product.price}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="bg-[#DFB15B] hover:bg-white text-black hover:text-black py-1.5 px-4 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300"
                    >
                      ADD +
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* TRACK 2: RIGHT-TO-LEFT SLIDER */}
      <div className="relative z-10 py-6 overflow-hidden mt-2 sm:mt-6">
        <motion.div 
          style={{ x: x2, rotate: rotate2 }} 
          className="flex gap-4 sm:gap-8 w-max px-[10%] will-change-transform"
        >
          {row2.map((product) => (
            <Link 
              to={`/product/${product.id}`} 
              key={product.id}
              onClick={playSlidePop}
              className="block shrink-0"
            >
              <div className="w-[240px] sm:w-[320px] rounded-[32px] sm:rounded-[40px] bg-gradient-to-b from-[#1C0F0E]/95 to-[#0A0403]/95 border-2 border-[#DFB15B]/15 p-4 sm:p-5 relative group transition-all duration-500 hover:border-[#DFB15B]/80 hover:shadow-[0_20px_50px_rgba(223,177,91,0.25)] hover:-translate-y-2">
                
                {/* Visual Accent Corner Glow */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-[#DE9088]/5 rounded-full blur-xl group-hover:bg-[#DE9088]/15 transition-all duration-500" />
                
                {/* 3D Curved Photo Container */}
                <div className="w-full aspect-[4/3] rounded-[24px] sm:rounded-[30px] overflow-hidden relative bg-black/40">
                  <img 
                    src={product.images?.[0] || ''} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[1.05]"
                    onError={handleImageError}
                    referrerPolicy="no-referrer"
                  />
                  {product.rating && (
                    <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-[#DFB15B] text-[8px] font-black tracking-widest px-2.5 py-1.5 rounded-full shadow-md flex items-center gap-1 border border-[#DFB15B]/20">
                      <Star className="w-2.5 h-2.5 fill-[#DFB15B] text-[#DFB15B]" />
                      <span>{product.rating}</span>
                    </span>
                  )}
                  {/* Glass shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                </div>

                {/* Info block */}
                <div className="mt-4 sm:mt-5 space-y-2 text-left">
                  <span className="text-[8px] sm:text-[9px] font-black uppercase text-[#DE9088] tracking-[0.2em]">
                    {product.categories?.[0] || 'Artisanal Selection'}
                  </span>
                  <h4 className="text-sm sm:text-base font-display font-black text-white group-hover:text-[#DFB15B] transition-colors truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[#DFB15B] font-serif font-black italic text-base sm:text-lg">
                      ₹{product.price}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="bg-[#DFB15B] hover:bg-white text-black hover:text-black py-1.5 px-4 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300"
                    >
                      ADD +
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Floating Sparkle Elements */}
      <div className="absolute top-10 left-[8%] z-10 pointer-events-none hidden md:block">
        <motion.div 
          animate={{ y: [-10, 10], rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkle className="w-8 h-8 text-[#DFB15B] opacity-50" />
        </motion.div>
      </div>
      <div className="absolute bottom-10 right-[8%] z-10 pointer-events-none hidden md:block">
        <motion.div 
          animate={{ y: [10, -10], rotate: [360, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkle className="w-6 h-6 text-[#DE9088] opacity-40" />
        </motion.div>
      </div>
    </section>
  );
}
