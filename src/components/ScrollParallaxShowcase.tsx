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
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  React.useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        ('ontouchstart' in window) || 
        (navigator.maxTouchPoints > 0) || 
        (window.innerWidth < 1024)
      );
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

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

  // Track 1: Slides left-to-right as page scrolls down (adjusted wide for infinite repeated lists)
  const x1 = useTransform(smoothProgress, [0, 1], ["-65%", "5%"]);
  // Track 2: Slides right-to-left as page scrolls down
  const x2 = useTransform(smoothProgress, [0, 1], ["5%", "-65%"]);
  
  // Dynamic rotate/scale effects for elements based on scroll progress
  const rotate1 = useTransform(smoothProgress, [0, 1], [-6, 6]);
  const rotate2 = useTransform(smoothProgress, [0, 1], [6, -6]);
  const bgGlowY = useTransform(smoothProgress, [0, 1], ["-15%", "15%"]);

  // Categorize or slice products to distribute into two stunning tracks
  const showcaseRow1 = products.filter(p => p.isBestseller).slice(0, 7);
  const showcaseRow2 = products.filter(p => !p.isBestseller).slice(0, 7);

  // If we don't have enough products, fall back to slicing the main array
  const row1 = showcaseRow1.length > 0 ? showcaseRow1 : products.slice(0, 5);
  const row2 = showcaseRow2.length > 0 ? showcaseRow2 : products.slice(5, 10);

  // Create infinite-feeling arrays by repeating 4 times with unique keys
  const row1Repeated = Array.from({ length: 4 }).flatMap((_, idx) => 
    row1.map(item => ({ ...item, uniqueKey: `${item.id}-r1-${idx}` }))
  );
  const row2Repeated = Array.from({ length: 4 }).flatMap((_, idx) => 
    row2.map(item => ({ ...item, uniqueKey: `${item.id}-r2-${idx}` }))
  );

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
          <div className="inline-flex items-center gap-2 bg-[#DFB15B]/15 text-[#DFB15B] border border-[#DFB15B]/40 px-5 py-2 rounded-full text-[10px] md:text-xs font-black tracking-[0.3em] uppercase shadow-md animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#DFB15B]" />
            <span>Interactive Parallax Gallery & Glass Orbs</span>
          </div>
          <h3 className="text-3xl sm:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#DFB15B] to-yellow-100 tracking-tight drop-shadow-md">
            Artisanal Confection Track
          </h3>
          <p className="text-zinc-300 text-xs sm:text-sm font-bold italic max-w-xl mx-auto leading-relaxed">
            {isTouchDevice 
              ? "Touch and swipe horizontally to browse our delicious selection of freshly baked premium cakes."
              : "Scroll vertically to watch our gourmet masterpieces float and slide dynamically in physical depth."}
          </p>
          {isTouchDevice && (
            <div className="flex items-center justify-center gap-2 text-[#DFB15B] text-[10px] font-black uppercase tracking-[0.25em] bg-black/40 border border-[#DFB15B]/20 py-1.5 px-4 rounded-full w-max mx-auto animate-pulse mt-2">
              <span>Swipe left & right ⟵ ⟶</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* TRACK 1: LEFT-TO-RIGHT SLIDER (CIRCULAR GLASS ORB DESIGN) */}
      <div className={`relative z-10 py-8 ${isTouchDevice ? 'overflow-x-auto no-scrollbar snap-x snap-mandatory flex w-full' : 'overflow-hidden'}`}>
        <motion.div 
          style={isTouchDevice ? undefined : { x: x1, rotate: rotate1 }} 
          className={`flex gap-6 sm:gap-10 will-change-transform ${isTouchDevice ? 'px-6 w-auto' : 'w-max px-[8%]'}`}
        >
          {row1Repeated.map((product) => (
            <Link 
              to={`/product/${product.id}`} 
              key={product.uniqueKey}
              onClick={playSlidePop}
              className={`block shrink-0 ${isTouchDevice ? 'snap-center' : ''}`}
            >
              {/* Circular Premium Glassmorph Card with dynamic focal zoom */}
              <motion.div 
                initial={{ scale: 0.82, opacity: 0.45, filter: "blur(1px)" }}
                whileInView={{ scale: 1.05, opacity: 1, filter: "blur(0px)" }}
                viewport={{ once: false, amount: 0.45 }}
                whileHover={{ scale: 1.12, zIndex: 10 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="w-[280px] sm:w-[340px] aspect-square rounded-full bg-[#1C0A05]/75 backdrop-blur-xl border-2 border-[#DFB15B]/25 p-6 relative group flex flex-col items-center justify-center text-center overflow-hidden"
              >
                
                {/* Rotating Gold Dash Orbit Ring */}
                <div className="absolute inset-3 rounded-full border border-dashed border-[#DFB15B]/30 group-hover:rotate-45 transition-transform duration-[8s] ease-out pointer-events-none" />
                <div className="absolute inset-5 rounded-full border border-[#DFB15B]/5 group-hover:-rotate-90 transition-transform duration-[12s] ease-in-out pointer-events-none" />

                {/* Shimmer flare overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-10" />

                {/* Inner layout with circular focal photo */}
                <div className="relative z-10 flex flex-col items-center justify-center space-y-3 w-full max-w-[85%]">
                  
                  {/* Perfectly round zoom photo ring with interactive hover tilt */}
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-[#DFB15B]/40 shadow-inner relative bg-black/40 group-hover:scale-110 transition-transform duration-700 group-hover:border-[#DFB15B]">
                    <img 
                      src={product.images?.[0] || ''} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 filter brightness-[1.05]"
                      onError={handleImageError}
                      referrerPolicy="no-referrer"
                    />
                    {product.isBestseller && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[#DFB15B] text-black text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-md whitespace-nowrap leading-none scale-90">
                        BEST
                      </span>
                    )}
                  </div>

                  {/* Cake labels & text content */}
                  <div className="space-y-1">
                    <span className="text-[7px] sm:text-[8px] font-black uppercase text-[#DE9088] tracking-[0.25em] block leading-none">
                      {product.categories?.[0] || 'Premium Bakes'}
                    </span>
                    <h4 className="text-xs sm:text-sm font-display font-black text-white group-hover:text-[#DFB15B] transition-colors truncate max-w-[200px]">
                      {product.name}
                    </h4>
                    <p className="text-[8px] sm:text-[10px] text-[#FFFDFB]/55 font-medium italic line-clamp-1 max-w-[180px]">
                      {product.description || 'Exquisite luxury sweet creation'}
                    </p>
                  </div>

                  {/* Actions & pricing */}
                  <div className="flex items-center gap-3 pt-2 border-t border-white/10 w-full justify-center">
                    <span className="text-[#DFB15B] font-serif font-black italic text-xs sm:text-sm">
                      ₹{product.price}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="bg-[#DFB15B] hover:bg-white text-black py-1 px-3 rounded-full text-[8px] font-black uppercase tracking-widest transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                    >
                      ADD +
                    </button>
                  </div>
                </div>

                {/* Frosted Circular glass rim shadow reflection effect */}
                <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none group-hover:border-[#DFB15B]/40 transition-colors duration-500" />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* TRACK 2: RIGHT-TO-LEFT SLIDER (CIRCULAR GLASS ORB DESIGN) */}
      <div className={`relative z-10 py-8 mt-4 sm:mt-6 ${isTouchDevice ? 'overflow-x-auto no-scrollbar snap-x snap-mandatory flex w-full' : 'overflow-hidden'}`}>
        <motion.div 
          style={isTouchDevice ? undefined : { x: x2, rotate: rotate2 }} 
          className={`flex gap-6 sm:gap-10 will-change-transform ${isTouchDevice ? 'px-6 w-auto' : 'w-max px-[8%]'}`}
        >
          {row2Repeated.map((product) => (
            <Link 
              to={`/product/${product.id}`} 
              key={product.uniqueKey}
              onClick={playSlidePop}
              className={`block shrink-0 ${isTouchDevice ? 'snap-center' : ''}`}
            >
              {/* Circular Premium Glassmorph Card with dynamic focal zoom */}
              <motion.div 
                initial={{ scale: 0.82, opacity: 0.45, filter: "blur(1px)" }}
                whileInView={{ scale: 1.05, opacity: 1, filter: "blur(0px)" }}
                viewport={{ once: false, amount: 0.45 }}
                whileHover={{ scale: 1.12, zIndex: 10 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="w-[280px] sm:w-[340px] aspect-square rounded-full bg-[#180A08]/75 backdrop-blur-xl border-2 border-[#DFB15B]/20 p-6 relative group flex flex-col items-center justify-center text-center overflow-hidden"
              >
                
                {/* Rotating Gold Dash Orbit Ring */}
                <div className="absolute inset-3 rounded-full border border-dashed border-[#DFB15B]/30 group-hover:rotate-45 transition-transform duration-[8s] ease-out pointer-events-none" />
                <div className="absolute inset-5 rounded-full border border-[#DFB15B]/5 group-hover:-rotate-90 transition-transform duration-[12s] ease-in-out pointer-events-none" />

                {/* Shimmer flare overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-10" />

                {/* Inner layout with circular focal photo */}
                <div className="relative z-10 flex flex-col items-center justify-center space-y-3 w-full max-w-[85%]">
                  
                  {/* Perfectly round zoom photo ring with interactive hover tilt */}
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-[#DFB15B]/35 shadow-inner relative bg-black/40 group-hover:scale-110 transition-transform duration-700 group-hover:border-[#DFB15B]">
                    <img 
                      src={product.images?.[0] || ''} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 filter brightness-[1.05]"
                      onError={handleImageError}
                      referrerPolicy="no-referrer"
                    />
                    {product.rating && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md text-[#DFB15B] text-[7px] font-black tracking-widest px-2.5 py-1 rounded-full shadow-md flex items-center gap-0.5 border border-[#DFB15B]/20 leading-none">
                        <Star className="w-2.5 h-2.5 fill-[#DFB15B] text-[#DFB15B]" />
                        <span>{product.rating}</span>
                      </span>
                    )}
                  </div>

                  {/* Cake labels & text content */}
                  <div className="space-y-1">
                    <span className="text-[7px] sm:text-[8px] font-black uppercase text-[#DE9088] tracking-[0.25em] block leading-none">
                      {product.categories?.[0] || 'Artisanal Selection'}
                    </span>
                    <h4 className="text-xs sm:text-sm font-display font-black text-white group-hover:text-[#DFB15B] transition-colors truncate max-w-[200px]">
                      {product.name}
                    </h4>
                    <p className="text-[8px] sm:text-[10px] text-[#FFFDFB]/55 font-medium italic line-clamp-1 max-w-[180px]">
                      {product.description || 'Meticulously crafted treat'}
                    </p>
                  </div>

                  {/* Actions & pricing */}
                  <div className="flex items-center gap-3 pt-2 border-t border-white/10 w-full justify-center">
                    <span className="text-[#DFB15B] font-serif font-black italic text-xs sm:text-sm">
                      ₹{product.price}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="bg-[#DFB15B] hover:bg-white text-black py-1 px-3 rounded-full text-[8px] font-black uppercase tracking-widest transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                    >
                      ADD +
                    </button>
                  </div>
                </div>

                {/* Frosted Circular glass rim shadow reflection effect */}
                <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none group-hover:border-[#DFB15B]/40 transition-colors duration-500" />
              </motion.div>
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
