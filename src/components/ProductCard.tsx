import React, { useState } from 'react';
import { ShoppingCart, Eye, Star, X, Check, ArrowRight, Sparkles, AlertCircle, Heart, Sparkle } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '../lib/store';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { playSuccessChime, playSlidePop, playBtnTap } from '../lib/sound';
import { toast } from 'sonner';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  // 3D Parallax hover tracking refs
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    cardRef.current.style.setProperty('--card-mouse-x', `${x}`);
    cardRef.current.style.setProperty('--card-mouse-y', `${y}`);
    cardRef.current.style.setProperty('--card-rotate-x', `${y * -15}deg`);
    cardRef.current.style.setProperty('--card-rotate-y', `${x * 15}deg`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--card-mouse-x', '0');
    cardRef.current.style.setProperty('--card-mouse-y', '0');
    cardRef.current.style.setProperty('--card-rotate-x', '0deg');
    cardRef.current.style.setProperty('--card-rotate-y', '0deg');
  };

  const [isExpanded, setIsExpanded] = useState(false);
  
  // Customization state for Starbucks-style interactive panel
  const [selectedWeight, setSelectedWeight] = useState(0.5);
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors?.[0] || 'Original');
  const [isEggless, setIsEggless] = useState(true);
  const [inscription, setInscription] = useState('');
  const [addedSuccessfully, setAddedSuccessfully] = useState(false);

  // Weight selection inline overlay states
  const [isWeightSelecting, setIsWeightSelecting] = useState(false);
  const [pendingAction, setPendingAction] = useState<'add_to_cart' | 'buy_now' | null>(null);

  // Price calculation based on weight multiplier
  const basePrice = product.price;
  const weightMultiplier = selectedWeight === 0.5 ? 1 : selectedWeight === 1 ? 1.8 : selectedWeight === 2 ? 3.4 : 5;
  const calculatedPrice = Math.round(basePrice * weightMultiplier);

  const handleAddToCart = () => {
    const customizedItem = {
      ...product,
      price: calculatedPrice,
      selectedWeight,
      selectedFlavor,
      cakeMessage: inscription,
      eggless: isEggless,
    };
    
    addItem(customizedItem);
    playSuccessChime();
    setAddedSuccessfully(true);
    setTimeout(() => {
      setAddedSuccessfully(false);
    }, 2000);
  };

  const openDirectWeightSelector = (action: 'add_to_cart' | 'buy_now') => {
    setPendingAction(action);
    setIsWeightSelecting(true);
  };

  const handleConfirmWeight = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const customizedItem = {
      ...product,
      price: calculatedPrice,
      selectedWeight,
      selectedFlavor,
      cakeMessage: inscription || '',
      eggless: isEggless,
    };

    addItem(customizedItem);
    playSuccessChime();
    
    setIsWeightSelecting(false);
    
    if (pendingAction === 'buy_now') {
      toast.success(`Success! Added ${product.name} (${selectedWeight} KG) to cart. Loading checkout...`);
      setTimeout(() => {
        window.location.href = '/checkout';
      }, 800);
    } else {
      toast.success(`Bespoke choice! ${product.name} (${selectedWeight} KG) added to your basket.`);
    }
  };

  return (
    <>
      {/* 1. FULL HD PREMIUM FLOATING CAKE CARD */}
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
          transform: 'rotateX(var(--card-rotate-x, 0deg)) rotateY(var(--card-rotate-y, 0deg))',
          transition: 'transform 0.1s ease-out'
        }}
        className="group relative bg-[#27272A]/90 backdrop-blur-xl rounded-[28px] xs:rounded-[38px] md:rounded-[48px] p-3.5 xs:p-4.5 md:p-6 flex flex-col justify-between border border-[#EAB308]/30 hover:border-[#EAB308]/90 shadow-[0_22px_55px_rgba(0,0,0,0.5)] hover:shadow-[0_32px_75px_rgba(223,177,91,0.3)] transition-all duration-300 ease-out transform-gpu h-full cursor-pointer overflow-hidden w-full min-w-0 box-border text-[#FFFDFB]"
        onClick={() => { playSlidePop(); setIsExpanded(true); }}
        id={`product-card-${product.id}`}
      >
        {/* Glow gold backdrop on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#DFB15B]/15 via-transparent to-[#2D150F]/30 rounded-[24px] xs:rounded-[34px] md:rounded-[44px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

        <div className="w-full flex flex-col">
          {/* Beautiful Rounded Image Pedestal */}
          <div style={{
              transform: 'translateZ(15px)'
            }}
            className="relative w-full aspect-square rounded-[22px] xs:rounded-[30px] md:rounded-[38px] overflow-hidden drop-shadow-[0_18px_35px_rgba(0,0,0,0.55)] border border-white/10 bg-[#1D0A07] transition-all duration-500 group-hover:drop-shadow-[0_28px_50px_rgba(223,177,91,0.2)]">
            <img 
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600'} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              referrerPolicy="no-referrer"
              alt={product.name}
            />

            {/* Bestseller Badge */}
            {product.isBestseller && (
              <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 bg-gradient-to-r from-[#FAD390] to-[#DFB15B] text-[#2D150F] border border-amber-600/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1 z-10 transition-transform duration-300 group-hover:scale-105">
                <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-[#2D150F] text-[#2D150F]" /> BESTSELLER
              </div>
            )}
            
            {product.isNew && (
              <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white border border-yellow-400 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1 z-10 transition-transform duration-300 group-hover:scale-105">
                NEW BATCH
              </div>
            )}
          </div>

          {/* Ratings, Title and Wishlist Header Row */}
          <div className="flex flex-col gap-2 mt-4 sm:mt-6 w-full">
            {/* Small helper row for rating and wishlist on mobile only */}
            <div className="flex items-center justify-between w-full sm:hidden">
              {/* STAR RATING BADGE */}
              <div className="flex items-center gap-1 bg-[#1C0D0A]/85 border border-white/15 px-2.5 py-1 rounded-xl shadow-sm shrink-0">
                <Star className="w-3 h-3 fill-[#DFB15B] text-[#EAB308]" />
                <span className="text-[10px] font-black text-[#FFFDFB]">4.9</span>
                <span className="text-[8px] font-black text-[#FFFDFB]/60">({product.reviewsCount || 42})</span>
              </div>
              {/* WISHLIST HEART */}
              <button 
                className="w-8 h-8 rounded-full bg-[#1C0D0A]/90 hover:bg-[#DE9088]/25 text-[#FFFDFB] hover:text-[#DE9088] transition-all flex items-center justify-center border border-white/15 shrink-0 active:scale-90"
                onClick={(e) => {
                  e.stopPropagation();
                  playBtnTap();
                  toast.success(`Savour later! Added ${product.name} to wishlist.`);
                }}
              >
                <Heart className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Main row layout (Rating & Heart are displayed inline only on desktop) */}
            <div className="flex items-center justify-between gap-2.5 w-full">
              {/* Title layout with highly readable sizes replacing microscopic clamp */}
              <h4 className="text-sm xs:text-base md:text-xl font-display font-black text-[#FFFDFB] flex-grow text-left leading-tight line-clamp-1 group-hover:text-[#EAB308] transition-colors truncate">
                {product.name}
              </h4>

              {/* Rating badge & heart button for tablet & desktop (hidden on mobile) */}
              <div className="hidden sm:flex items-center gap-2.5 shrink-0">
                <div className="flex items-center gap-1.5 bg-[#1C0D0A]/70 border border-white/10 px-3 py-1.5 rounded-2xl shadow-sm shrink-0">
                  <Star className="w-3.5 h-3.5 fill-[#DFB15B] text-[#EAB308]" />
                  <span className="text-xs font-black text-[#FFFDFB]">4.9</span>
                  <span className="text-[9px] font-black tracking-normal text-[#FFFDFB]/50 uppercase">({product.reviewsCount || 42})</span>
                </div>

                <button 
                  className="w-9 h-9 rounded-full bg-[#1C0D0A]/70 hover:bg-[#DE9088]/20 text-[#FFFDFB] hover:text-[#DE9088] transition-all duration-300 flex items-center justify-center border border-white/10 shrink-0 active:scale-90"
                  onClick={(e) => {
                    e.stopPropagation();
                    playBtnTap();
                    toast.success(`Savour later! Added ${product.name} to wishlist.`);
                  }}
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Separation Line with central gold diamond ornament */}
          <div className="flex items-center justify-center my-3 w-full">
            <div className="h-[1px] bg-white/15 flex-grow" />
            <Sparkle className="w-3 h-3 text-[#EAB308] mx-2 animate-spin-slow shrink-0" />
            <div className="h-[1px] bg-white/15 flex-grow" />
          </div>

          {/* Description */}
          <p className="text-center text-[#FFFDFB]/90 text-[11.5px] xs:text-[12.5px] sm:text-sm leading-relaxed font-semibold italic line-clamp-2 min-h-[34px] xs:min-h-[38px] sm:min-h-[42px] w-full px-0.5">
            {product.description}
          </p>

          {/* Custom micro boundary lines */}
          <div className="h-[1px] bg-white/10 my-3 w-full" />
        </div>

        {/* Pricing, Personalise and Direct Buy Buttons */}
        <div className="w-full flex flex-col space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between gap-1.5 sm:gap-4 w-full">
            {/* Price section */}
            <div className="text-left shrink-0">
              <span className="text-[9px] xs:text-[10px] sm:text-xs font-black text-zinc-400 uppercase tracking-[0.2em] block leading-none mb-1">Starting from</span>
              <div className="flex items-center gap-1">
                <span className="text-base xs:text-lg sm:text-2xl font-serif font-black text-[#EAB308] italic tracking-tighter leading-none">
                  ₹{product.price}
                </span>
                <Sparkle className="w-3 h-3 text-[#DE9088] animate-pulse shrink-0" />
              </div>
            </div>

            {/* Personalise details button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                playSlidePop();
                setIsExpanded(true);
              }}
              className="h-8 xs:h-9 sm:h-11 px-3 sm:px-5 rounded-full bg-gradient-to-r from-[#DFB15B] to-[#C99A43] hover:from-[#FFFDFB] hover:to-[#FFFDFB] text-black hover:text-[#2D150F] border border-[#EAB308]/30 font-black text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 shadow-md hover:shadow-lg active:scale-95 shrink-0"
            >
              <span>Personalise</span>
              <ArrowRight className="w-3 h-3 shrink-0" />
            </button>
          </div>

          {/* Direct Buy Buttons Row - Sits beautifully alongside */}
          <div className="flex items-center gap-2 w-full">
            {/* Direct ADD TO CART */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                playSlidePop();
                openDirectWeightSelector('add_to_cart');
              }}
              className="flex-1 min-w-0 h-9 xs:h-10 sm:h-12 rounded-xl xs:rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/20 font-black text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-all duration-300 shadow-sm active:scale-95"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">Add to Cart</span>
            </button>

            {/* Direct BUY NOW */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                playSlidePop();
                openDirectWeightSelector('buy_now');
              }}
              className="flex-1 min-w-0 h-9 xs:h-10 sm:h-12 rounded-xl xs:rounded-2xl bg-[#EAB308] hover:bg-white text-[#140603] font-black text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-all duration-300 shadow-md active:scale-95 cursor-pointer"
            >
              <span className="font-black truncate">⚡ Buy Now</span>
            </button>
          </div>

          {/* Premium Quality Indicators Footer inside the card */}
          <div className="grid grid-cols-3 gap-0.5 pt-3 sm:pt-4 border-t border-white/10 w-full text-center">
            <div className="flex items-center justify-center gap-1 text-[8.5px] xs:text-[10px] sm:text-[11px] md:text-xs font-black text-white uppercase tracking-wider">
              <span className="text-[#EAB308] text-[10px] md:text-base">🛡️</span>
              <span className="truncate">Premium</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-[8.5px] xs:text-[10px] sm:text-[11px] md:text-xs font-black text-white uppercase tracking-wider border-x border-white/10 px-1">
              <span className="text-[#EAB308] text-[10px] md:text-base">🍰</span>
              <span className="truncate">Fresh</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-[8.5px] xs:text-[10px] sm:text-[11px] md:text-xs font-black text-white uppercase tracking-wider">
              <span className="text-[#EAB308] text-[10px] md:text-base">🚚</span>
              <span className="truncate">Fast Delv</span>
            </div>
          </div>
        </div>

        {/* Animated Slide-Up Direct Weight Selector Panel */}
        <AnimatePresence>
          {isWeightSelecting && (
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 24 }}
              className="absolute inset-0 bg-[#25120E]/95 backdrop-blur-2xl z-30 p-3 xs:p-4 md:p-5 flex flex-col justify-between rounded-[20px] xs:rounded-[32px] md:rounded-[44px] border border-[#EAB308]/40 shadow-[0_-15px_40px_rgba(0,0,0,0.6)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                {/* Header inside overlay */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase font-black tracking-[0.2em] text-[#EAB308]">
                    Select Cake Weight
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); playSlidePop(); setIsWeightSelecting(false); }}
                    className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Product preview line */}
                <div className="text-left space-y-0.5">
                  <p className="text-xs font-black text-white truncate">{product.name}</p>
                  <p className="text-[10px] text-emerald-400 font-bold block">✓ Handcrafted Eggless Available</p>
                </div>

                {/* Weight Options Grid */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[0.5, 1.0, 2.0, 3.0].map((weight) => (
                    <button
                      key={weight}
                      onClick={(e) => {
                        e.stopPropagation();
                        playBtnTap();
                        setSelectedWeight(weight);
                      }}
                      className={`py-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                        selectedWeight === weight 
                          ? 'bg-[#EAB308] text-black border-[#EAB308] shadow-md font-black scale-105'
                          : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-[#DE9088]/10'
                      }`}
                    >
                      <span className="text-xs font-black tracking-tighter">{weight} KG</span>
                      <span className={`text-[7px] font-black uppercase tracking-wider ${selectedWeight === weight ? 'text-amber-950 opacity-100' : 'opacity-60'}`}>
                        {weight === 0.5 ? 'Classic' : weight === 1.0 ? 'Premium' : weight === 2.0 ? 'Party' : 'Grand'}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Pure vegetarian switch options */}
                <button
                  onClick={(e) => { e.stopPropagation(); playBtnTap(); setIsEggless(!isEggless); }}
                  className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2.5 rounded-xl text-left transition-colors"
                >
                  <div>
                    <p className="text-[7px] font-black text-zinc-400 uppercase tracking-widest leading-none">Dietary Choice</p>
                    <p className="text-[10px] font-black text-white mt-0.5">{isEggless ? '100% Chef Eggless' : 'Vegetarian Only'}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${
                    isEggless 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-white/5 text-zinc-300 border border-white/10'
                  }`}>
                    {isEggless ? '✓ Active Eggless' : 'Normal Vegetarian'}
                  </span>
                </button>
              </div>

              {/* Price & Confirm action */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2.5">
                <div className="text-left">
                  <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest block leading-none mb-0.5">Calculated Rate</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-serif font-black text-[#EAB308] italic">
                      ₹{calculatedPrice}
                    </span>
                    <span className="text-[8px] font-black text-zinc-400 uppercase">
                      ({selectedWeight} KG)
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmWeight}
                  className={`flex-grow h-11 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 text-white ${
                    pendingAction === 'buy_now' 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700' 
                      : 'bg-gradient-to-r from-[#DFB15B] to-[#C99A43] text-black hover:opacity-90'
                  }`}
                >
                  {pendingAction === 'buy_now' ? '⚡ Buy Now' : '✓ Add To Basket'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. STARBUCKS-STYLE SMOOTH INFUSED DETAILED OVERLAY EXPANSION */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Blur backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="absolute inset-0 bg-[#2D150F]/70 backdrop-blur-md"
            />

            {/* Expanding Spring Panel Container */}
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="relative w-full max-w-4xl bg-[#18181B] rounded-[48px] overflow-hidden shadow-[0_30px_80px_rgba(20,6,3,0.9)] border border-[#EAB308]/25 max-h-[90vh] overflow-y-auto no-scrollbar z-10 grid grid-cols-1 md:grid-cols-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsExpanded(false)}
                className="absolute top-6 right-6 w-11 h-11 rounded-full bg-[#2D150F]/70 hover:bg-[#EAB308] text-white hover:text-[#140603] transition-all duration-300 flex items-center justify-center shadow-md hover:scale-105 z-50 active:scale-95 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* LEFT COLUMN: VISUAL SPECTACLE & HERO IMAGE DISPLAY */}
              <div className="p-8 sm:p-12 flex flex-col justify-center items-center bg-[#27272A]/45 relative border-b md:border-b-0 md:border-r border-[#EAB308]/15 min-h-[300px] md:min-h-auto">
                <div className="absolute inset-12 rounded-full bg-gradient-to-tr from-[#DFB15B]/10 to-[#140603] scale-110 blur-xl pointer-events-none" />
                
                {/* Micro Category Tag */}
                <div className="absolute top-8 left-8 flex items-center gap-1 bg-[#EAB308]/10 text-[#EAB308] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Artisanal Spec</span>
                </div>

                {/* Main scale-motion spring image */}
                <motion.div
                  initial={{ scale: 0.8, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-10/12 aspect-square rounded-[40px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.5)] border-4 border-[#140603] transform hover:scale-105 transition-transform duration-500 relative z-10"
                >
                  <img 
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600'} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    alt={product.name}
                  />
                </motion.div>

                {/* Delivery Indicator pill */}
                <div className="mt-8 bg-[#18181B] border border-[#EAB308]/20 rounded-2xl px-5 py-3 shadow-md flex items-center gap-3 relative z-10">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FFFDFB]">
                    Express Midnight Dispatch Available
                  </span>
                </div>
              </div>

              {/* RIGHT COLUMN: INTERACTIVE CUSTOMIZATION PANEL */}
              <div className="p-8 sm:p-12 text-left flex flex-col justify-between space-y-8 max-h-[80vh] overflow-y-auto no-scrollbar bg-[#18181B]">
                
                {/* Title and Ratings Header */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-[#EAB308]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <span className="text-xs font-black text-[#FFFDFB]/70 ml-1">4.9 (42)</span>
                  </div>
                  <h3 className="text-2xl sm:text-3.5xl font-display font-black text-white leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#FFFDFB]/80 font-semibold italic leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* 1. SELECT CAKE WEIGHT TAB SELECTORS */}
                <div className="space-y-3">
                  <h5 className="text-[10px] uppercase font-black tracking-widest text-[#FFFDFB]/70 flex items-center justify-between">
                    <span>1. SELECT CAKE WEIGHT</span>
                    <span className="text-[#EAB308] font-bold">Standard 0.5kg to 3kg+</span>
                  </h5>
                  <div className="grid grid-cols-4 gap-2">
                    {[0.5, 1.0, 2.0, 3.0].map((weight) => (
                      <button
                        key={weight}
                        onClick={() => { playBtnTap(); setSelectedWeight(weight); }}
                        className={`py-3.5 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                          selectedWeight === weight 
                            ? 'bg-[#EAB308] text-[#140603] border-[#EAB308] shadow-lg scale-105 font-black'
                            : 'bg-[#18181B] text-[#FFFDFB] border-[#EAB308]/20 hover:bg-[#EAB308]/10'
                        }`}
                      >
                        <span className="text-sm font-black tracking-tighter">{weight} KG</span>
                        <span className={`text-[8px] font-black tracking-widest uppercase ${selectedWeight === weight ? 'text-[#140603]/80' : 'text-white/40'}`}>
                          {weight === 0.5 ? 'Classic' : weight === 1.0 ? 'Premium' : weight === 2.0 ? 'Party' : 'Grand'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. SELECT FLAVOR DIAL SELECTORS */}
                <div className="space-y-3">
                  <h5 className="text-[10px] uppercase font-black tracking-widest text-[#FFFDFB]/70">
                    2. CUSTOMIZE FLAVOR PROFILE
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {['Belgian Chocolate', 'Hazelnut Praline', 'Royal Velveteer', 'Speculoos Biscoff'].map((flv) => (
                      <button
                        key={flv}
                        onClick={() => { playBtnTap(); setSelectedFlavor(flv); }}
                        className={`px-4 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                          selectedFlavor === flv 
                            ? 'bg-[#EAB308] text-[#140603] border-[#EAB308] shadow-md scale-105'
                            : 'bg-[#18181B]/80 text-[#FFFDFB]/70 border-[#EAB308]/20 hover:border-[#EAB308]/50'
                        }`}
                      >
                        {flv}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. DIETARY PREFERENCES DIAL */}
                <div className="bg-[#27272A]/45 rounded-2xl p-4 border border-[#EAB308]/15 flex items-center justify-between">
                  <div className="space-y-0.5 text-left">
                     <p className="text-xs font-black text-white uppercase tracking-wide flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      <span>100% Pure Vegetarian</span>
                     </p>
                     <p className="text-[10px] text-[#FFFDFB]/60 italic font-medium leading-none">Absolutely eggless-first guarantee with zero footprint</p>
                  </div>
                  <button 
                    onClick={() => { playBtnTap(); setIsEggless(!isEggless); }}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      isEggless 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'bg-[#18181B] text-[#FFFDFB]/60 border border-[#EAB308]/15'
                    }`}
                  >
                    {isEggless ? '✓ Active Eggless' : 'Vegetarian Only'}
                  </button>
                </div>

                {/* 4. THE INSCRIPTION WRITING */}
                <div className="space-y-3">
                  <h5 className="text-[10px] uppercase font-black tracking-widest text-[#FFFDFB]/70">
                    4. THE INSCRIPTION / MESSAGE ON CAKE
                  </h5>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={32}
                      value={inscription}
                      onChange={(e) => setInscription(e.target.value)}
                      placeholder='Write "Happy Birthday Arjun!" or "Happy 25th"'
                      className="w-full bg-[#18181B] border border-[#EAB308]/20 rounded-2xl px-5 py-3.5 text-xs text-white placeholder-white/35 font-medium focus:outline-none focus:border-[#EAB308] transition-all shadow-inner"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-[#FFFDFB]/50 uppercase tracking-widest">
                      {32 - inscription.length} chars
                    </div>
                  </div>
                </div>

                {/* PRICING & FINAL ADD CONVERTOR */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4 bg-[#18181B]">
                  <div className="text-left">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-0.5">Calculated Rate</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-serif font-black text-[#EAB308] italic tracking-tighter">
                        ₹{calculatedPrice}
                      </span>
                      <span className="text-[10px] font-sans font-black text-[#FFFDFB]/60 uppercase tracking-widest">
                        ({selectedWeight} KG)
                      </span>
                    </div>
                  </div>

                  <div className="flex-grow flex justify-end">
                    <Button
                      onClick={handleAddToCart}
                      className={`h-14 px-8 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transform active:scale-95 transition-all duration-300 shadow-xl cursor-pointer ${
                        addedSuccessfully 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200' 
                          : 'bg-[#EAB308] hover:bg-white text-[#140603] hover:text-[#140603]'
                      }`}
                    >
                      {addedSuccessfully ? (
                        <>
                          <Check className="w-4 h-4 animate-bounce" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span>Buy & Add to Basket</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
