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
      <motion.div 
        whileHover={{ y: -8, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 350, damping: 20 }}
        className="group relative bg-[#FFFDF9] rounded-[24px] xs:rounded-[36px] md:rounded-[48px] p-2.5 xs:p-3.5 md:p-5 flex flex-col justify-between border-2 border-[#E8DDD7] hover:border-[#DE9088] shadow-[0_15px_45px_rgba(45,21,15,0.05)] hover:shadow-[0_25px_65px_rgba(45,21,15,0.12)] transition-all duration-300 h-full cursor-pointer overflow-hidden w-full min-w-0 box-border"
        onClick={() => { playSlidePop(); setIsExpanded(true); }}
        id={`product-card-${product.id}`}
      >
        {/* Glow gold backdrop on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#DFB15B]/5 via-transparent to-[#2D150F]/5 rounded-[20px] xs:rounded-[32px] md:rounded-[44px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

        <div className="w-full flex flex-col">
          {/* Beautiful Rounded Image Pedestal */}
          <div className="relative w-full aspect-square rounded-[18px] xs:rounded-[28px] md:rounded-[36px] overflow-hidden drop-shadow-[0_15px_30px_rgba(45,21,15,0.12)] border border-[#E8DDD7]/60 bg-[#FAF7F5] transition-all duration-500 group-hover:drop-shadow-[0_25px_45px_rgba(45,21,15,0.2)]">
            <img 
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600'} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              referrerPolicy="no-referrer"
              alt={product.name}
            />

            {/* Bestseller Badge */}
            {product.isBestseller && (
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-gradient-to-r from-[#FAD390] to-[#DFB15B] text-[#2D150F] border border-[#DE9088]/20 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[7px] sm:text-[9px] font-black uppercase tracking-wider shadow-md flex items-center gap-0.5 sm:gap-1 z-10 transition-transform duration-300 group-hover:scale-105">
                <Star className="w-2 sm:w-2.5 h-2 sm:h-2.5 fill-[#2D150F] text-[#2D150F]" /> BESTSELLER
              </div>
            )}
            
            {product.isNew && (
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white border border-yellow-400 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[7px] sm:text-[9px] font-black uppercase tracking-wider shadow-md flex items-center gap-0.5 sm:gap-1 z-10 transition-transform duration-300 group-hover:scale-105">
                NEW BATCH
              </div>
            )}
          </div>

          {/* Ratings, Title and Wishlist Header Row */}
          <div className="flex flex-col gap-1.5 xs:gap-2 mt-3 sm:mt-5 w-full">
            {/* Small helper row for rating and wishlist on mobile only */}
            <div className="flex items-center justify-between w-full sm:hidden">
              {/* STAR RATING BADGE */}
              <div className="flex items-center gap-0.5 bg-[#FAF7F5] border border-[#E8DDD7] px-2 py-1 rounded-xl shadow-sm shrink-0">
                <Star className="w-2.5 h-2.5 fill-[#DFB15B] text-[#DFB15B]" />
                <span className="text-[9px] font-black text-[#2D150F]">4.9</span>
                <span className="text-[7px] font-black text-[#3B1F17]/50">({product.reviewsCount || 42})</span>
              </div>
              {/* WISHLIST HEART */}
              <button 
                className="w-7 h-7 rounded-full bg-white hover:bg-[#DE9088]/10 text-[#2D150F]/60 hover:text-[#DE9088] transition-all flex items-center justify-center border border-[#E8DDD7]/70 shrink-0 active:scale-90"
                onClick={(e) => {
                  e.stopPropagation();
                  playBtnTap();
                  toast.success(`Savour later! Added ${product.name} to wishlist.`);
                }}
              >
                <Heart className="w-3 h-3" />
              </button>
            </div>

            {/* Main row layout (Rating & Heart are displayed inline only on desktop) */}
            <div className="flex items-center justify-between gap-1.5 sm:gap-2.5 w-full">
              {/* Title layout using fluid typography and clamp */}
              <h4 className="text-[clamp(11px,3.8vw,18px)] font-display font-black text-[#2D150F] flex-grow text-left leading-tight line-clamp-1 group-hover:text-amber-800 transition-colors truncate">
                {product.name}
              </h4>

              {/* Rating badge & heart button for tablet & desktop (hidden on mobile) */}
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 bg-[#FAF7F5] border border-[#E8DDD7] px-2.5 py-1.5 rounded-2xl shadow-sm shrink-0">
                  <Star className="w-3 h-3 fill-[#DFB15B] text-[#DFB15B]" />
                  <span className="text-[10px] font-black text-[#2D150F]">4.9</span>
                  <span className="text-[7px] font-black tracking-normal text-[#3B1F17]/50 uppercase">({product.reviewsCount || 42})</span>
                </div>

                <button 
                  className="w-8 h-8 rounded-full bg-white hover:bg-[#DE9088]/10 text-[#2D150F]/60 hover:text-[#DE9088] transition-all duration-300 flex items-center justify-center border border-[#E8DDD7]/70 shrink-0 active:scale-90"
                  onClick={(e) => {
                    e.stopPropagation();
                    playBtnTap();
                    toast.success(`Savour later! Added ${product.name} to wishlist.`);
                  }}
                >
                  <Heart className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Separation Line with central gold diamond ornament */}
          <div className="flex items-center justify-center my-2 sm:my-3 w-full">
            <div className="h-[1px] bg-[#E8DDD7]/70 flex-grow" />
            <Sparkle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#DFB15B] mx-1.5 sm:mx-2 animate-spin-slow shrink-0" />
            <div className="h-[1px] bg-[#E8DDD7]/70 flex-grow" />
          </div>

          {/* Description */}
          <p className="text-center text-[#2D150F]/75 text-[9px] xs:text-[10px] sm:text-xs leading-relaxed font-semibold italic line-clamp-2 min-h-[24px] xs:min-h-[28px] sm:min-h-[32px] w-full px-0.5">
            {product.description}
          </p>

          {/* Custom micro boundary lines */}
          <div className="h-[1px] bg-[#E8DDD7]/40 my-2 sm:my-3 w-full" />
        </div>

        {/* Pricing, Personalise and Direct Buy Buttons */}
        <div className="w-full flex flex-col space-y-2.5 sm:space-y-4">
          <div className="flex items-center justify-between gap-1 sm:gap-4 w-full">
            {/* Price section */}
            <div className="text-left shrink-0">
              <span className="text-[7px] xs:text-[8px] sm:text-[9px] font-black text-[#3B1F17]/55 uppercase tracking-[0.12em] xs:tracking-[0.25em] block leading-none mb-0.5">Starting from</span>
              <div className="flex items-center gap-0.5 xs:gap-1">
                <span className="text-[clamp(14px,4.5vw,24px)] font-serif font-black text-amber-900 italic tracking-tighter leading-none">
                  ₹{product.price}
                </span>
                <Sparkle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#DE9088] animate-pulse shrink-0" />
              </div>
            </div>

            {/* Personalise details button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                playSlidePop();
                setIsExpanded(true);
              }}
              className="h-7 xs:h-8 sm:h-10 px-2 sm:px-4 rounded-full bg-gradient-to-r from-[#3B1F17] to-[#1E0D08] hover:from-[#DE9088] hover:to-[#cc7a74] text-amber-100 hover:text-white border border-[#DFB15B]/30 font-black text-[7px] xs:text-[8px] sm:text-[9px] uppercase tracking-wider transition-all duration-300 flex items-center gap-1 shadow-md hover:shadow-lg active:scale-95 shrink-0"
            >
              <span>Personalise</span>
              <ArrowRight className="w-2.5 sm:w-3 h-2.5 sm:h-3 shrink-0" />
            </button>
          </div>

          {/* Direct Buy Buttons Row - Sits beautifully alongside */}
          <div className="flex items-center gap-1.5 xs:gap-2.5 w-full">
            {/* Direct ADD TO CART */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                playSlidePop();
                openDirectWeightSelector('add_to_cart');
              }}
              className="flex-1 min-w-0 h-8 xs:h-9 sm:h-11 rounded-xl xs:rounded-2xl bg-white hover:bg-[#FAF7F5] text-[#2D150F] border border-[#2D150F] font-black text-[clamp(7px,1.8vw,10px)] uppercase tracking-tight xs:tracking-wider flex items-center justify-center gap-1 transition-all duration-300 shadow-sm active:scale-95"
            >
              <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">Add to Cart</span>
            </button>

            {/* Direct BUY NOW */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                playSlidePop();
                openDirectWeightSelector('buy_now');
              }}
              className="flex-1 min-w-0 h-8 xs:h-9 sm:h-11 rounded-xl xs:rounded-2xl bg-gradient-to-r from-[#DFB15B] to-[#C99A43] hover:from-[#EABF73] hover:to-[#B68732] text-black font-black text-[clamp(7px,1.8vw,10px)] uppercase tracking-tight xs:tracking-wider flex items-center justify-center gap-1 transition-all duration-300 shadow-md active:scale-95"
            >
              <span className="text-amber-950 font-black truncate">⚡ Buy Now</span>
            </button>
          </div>

          {/* Premium Quality Indicators Footer inside the card */}
          <div className="grid grid-cols-3 gap-0.5 pt-2 sm:pt-3.5 border-t border-[#E8DDD7]/40 w-full text-center">
            <div className="flex items-center justify-center gap-0.5 xs:gap-1 text-[6px] xs:text-[7px] md:text-[8px] font-black text-[#2D150F]/55 uppercase tracking-tight md:tracking-wider">
              <span className="text-[#DE9088] text-[8px] md:text-sm">🛡️</span>
              <span className="truncate">Premium</span>
            </div>
            <div className="flex items-center justify-center gap-0.5 xs:gap-1 text-[6px] xs:text-[7px] md:text-[8px] font-black text-[#2D150F]/55 uppercase tracking-tight md:tracking-wider border-x border-[#E8DDD7]/40 px-0.5">
              <span className="text-[#DE9088] text-[8px] md:text-sm">🍰</span>
              <span className="truncate">Fresh</span>
            </div>
            <div className="flex items-center justify-center gap-0.5 xs:gap-1 text-[6px] xs:text-[7px] md:text-[8px] font-black text-[#2D150F]/55 uppercase tracking-tight md:tracking-wider">
              <span className="text-[#DE9088] text-[8px] md:text-sm">🚚</span>
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
              className="absolute inset-0 bg-[#FFFDFB] z-30 p-3 xs:p-4 md:p-5 flex flex-col justify-between rounded-[20px] xs:rounded-[32px] md:rounded-[44px] border-2 border-[#DE9088]/60 shadow-[0_-15px_40px_rgba(45,21,15,0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                {/* Header inside overlay */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase font-black tracking-[0.2em] text-[#DE9088]">
                    Select Cake Weight
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); playSlidePop(); setIsWeightSelecting(false); }}
                    className="w-7 h-7 rounded-full bg-[#FAF7F5] hover:bg-[#DE9088]/15 border border-[#E8DDD7] text-[#2D150F] flex items-center justify-center transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Product preview line */}
                <div className="text-left space-y-0.5">
                  <p className="text-xs font-black text-[#2D150F] truncate">{product.name}</p>
                  <p className="text-[10px] text-emerald-600 font-bold block">✓ Handcrafted Eggless Available</p>
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
                          ? 'bg-[#2D150F] text-white border-[#2D150F] shadow-md font-black scale-105' 
                          : 'bg-[#FAF7F5] text-[#2D150F]/70 border-[#E8DDD7]/70 hover:bg-[#DE9088]/5'
                      }`}
                    >
                      <span className="text-xs font-black tracking-tighter">{weight} KG</span>
                      <span className="text-[7px] font-black uppercase tracking-wider opacity-60">
                        {weight === 0.5 ? 'Classic' : weight === 1.0 ? 'Premium' : weight === 2.0 ? 'Party' : 'Grand'}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Pure vegetarian switch options */}
                <button
                  onClick={(e) => { e.stopPropagation(); playBtnTap(); setIsEggless(!isEggless); }}
                  className="w-full flex items-center justify-between bg-[#FAF7F5] hover:bg-[#DE9088]/5 border border-[#E8DDD7]/60 px-3 py-2.5 rounded-xl text-left transition-colors"
                >
                  <div>
                    <p className="text-[7px] font-black text-[#2D150F]/45 uppercase tracking-widest leading-none">Dietary Choice</p>
                    <p className="text-[10px] font-black text-[#2D150F] mt-0.5">{isEggless ? '100% Chef Eggless' : 'Vegetarian Only'}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${
                    isEggless 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-white text-[#2D150F]/50 border border-[#E8DDD7]'
                  }`}>
                    {isEggless ? '✓ Active Eggless' : 'Normal Vegetarian'}
                  </span>
                </button>
              </div>

              {/* Price & Confirm action */}
              <div className="pt-3 border-t border-[#E8DDD7]/55 flex items-center justify-between gap-2.5">
                <div className="text-left">
                  <span className="text-[8px] font-black text-[#3B1F17]/50 uppercase tracking-widest block leading-none mb-0.5">Calculated Rate</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-serif font-black text-amber-950 italic">
                      ₹{calculatedPrice}
                    </span>
                    <span className="text-[8px] font-black text-[#2D150F]/50 uppercase">
                      ({selectedWeight} KG)
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmWeight}
                  className={`flex-grow h-11 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 text-white ${
                    pendingAction === 'buy_now' 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700' 
                      : 'bg-[#2D150F] hover:bg-[#DE9088]'
                  }`}
                >
                  {pendingAction === 'buy_now' ? '⚡ Buy Now' : '✓ Add To Basket'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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
              className="relative w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-[48px] overflow-hidden shadow-[0_30px_80px_rgba(45,21,15,0.4)] border border-[#E8DDD7]/50 max-h-[90vh] overflow-y-auto no-scrollbar z-10 grid grid-cols-1 md:grid-cols-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsExpanded(false)}
                className="absolute top-6 right-6 w-11 h-11 rounded-full bg-[#FAF7F5]/80 hover:bg-[#DE9088] text-[#2D150F] hover:text-white transition-all duration-300 flex items-center justify-center shadow-md hover:scale-105 z-50 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>

              {/* LEFT COLUMN: VISUAL SPECTACLE & HERO IMAGE DISPLAY */}
              <div className="p-8 sm:p-12 flex flex-col justify-center items-center bg-[#FAF7F5]/70 relative border-b md:border-b-0 md:border-r border-[#E8DDD7]/40 min-h-[300px] md:min-h-auto">
                <div className="absolute inset-12 rounded-full bg-gradient-to-tr from-[#DE9088]/10 to-[#FAF7F5] scale-110 blur-xl pointer-events-none" />
                
                {/* Micro Category Tag */}
                <div className="absolute top-8 left-8 flex items-center gap-1 bg-[#DE9088]/15 text-[#cc7a74] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Artisanal Spec</span>
                </div>

                {/* Main scale-motion spring image */}
                <motion.div
                  initial={{ scale: 0.8, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-10/12 aspect-square rounded-[40px] overflow-hidden shadow-[0_25px_60px_rgba(45,21,15,0.18)] border-4 border-white transform hover:scale-105 transition-transform duration-500 relative z-10"
                >
                  <img 
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600'} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    alt={product.name}
                  />
                </motion.div>

                {/* Delivery Indicator pill */}
                <div className="mt-8 bg-white/80 backdrop-blur-sm border border-[#E8DDD7]/50 rounded-2xl px-5 py-3 shadow-md flex items-center gap-3 relative z-10">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#2D150F]">
                    Express Midnight Dispatch Available
                  </span>
                </div>
              </div>

              {/* RIGHT COLUMN: INTERACTIVE CUSTOMIZATION PANEL */}
              <div className="p-8 sm:p-12 text-left flex flex-col justify-between space-y-8 max-h-[80vh] overflow-y-auto no-scrollbar">
                
                {/* Title and Ratings Header */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <span className="text-xs font-black text-[#2D150F]/70 ml-1">4.9 (42)</span>
                  </div>
                  <h3 className="text-2xl sm:text-3.5xl font-display font-black text-[#2D150F] leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#2D150F]/60 font-semibold italic leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* 1. SELECT CAKE WEIGHT TAB SELECTORS */}
                <div className="space-y-3">
                  <h5 className="text-[10px] uppercase font-black tracking-widest text-[#2D150F]/40 flex items-center justify-between">
                    <span>1. SELECT CAKE WEIGHT</span>
                    <span className="text-[#DE9088] font-bold">Standard 0.5kg to 3kg+</span>
                  </h5>
                  <div className="grid grid-cols-4 gap-2">
                    {[0.5, 1.0, 2.0, 3.0].map((weight) => (
                      <button
                        key={weight}
                        onClick={() => { playBtnTap(); setSelectedWeight(weight); }}
                        className={`py-3.5 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-0.5 ${
                          selectedWeight === weight 
                            ? 'bg-[#2D150F] text-white border-[#2D150F] shadow-lg scale-105 font-black' 
                            : 'bg-white text-[#2D150F]/70 border-[#E8DDD7] hover:bg-[#FAF7F5]'
                        }`}
                      >
                        <span className="text-sm font-black tracking-tighter">{weight} KG</span>
                        <span className="text-[8px] opacity-75 font-black tracking-widest uppercase">
                          {weight === 0.5 ? 'Classic' : weight === 1.0 ? 'Premium' : weight === 2.0 ? 'Party' : 'Grand'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. SELECT FLAVOR DIAL SELECTORS */}
                <div className="space-y-3">
                  <h5 className="text-[10px] uppercase font-black tracking-widest text-[#2D150F]/40">
                    2. CUSTOMIZE FLAVOR PROFILE
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {['Belgian Chocolate', 'Hazelnut Praline', 'Royal Velveteer', 'Speculoos Biscoff'].map((flv) => (
                      <button
                        key={flv}
                        onClick={() => { playBtnTap(); setSelectedFlavor(flv); }}
                        className={`px-4 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                          selectedFlavor === flv 
                            ? 'bg-[#DE9088] text-white border-[#DE9088] shadow-md scale-105' 
                            : 'bg-white text-[#2D150F]/65 border-[#E8DDD7] hover:bg-[#DE9088]/5'
                        }`}
                      >
                        {flv}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. DIETARY PREFERENCES DIAL */}
                <div className="bg-[#FAF7F5]/70 rounded-2xl p-4 border border-[#E8DDD7]/40 flex items-center justify-between">
                  <div className="space-y-0.5 text-left">
                    <p className="text-xs font-black text-[#2D150F] uppercase tracking-wide flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      <span>100% Pure Vegetarian</span>
                    </p>
                    <p className="text-[10px] text-[#2D150F]/50 italic font-medium leading-none">Absolutely eggless-first guarantee with zero footprint</p>
                  </div>
                  <button 
                    onClick={() => { playBtnTap(); setIsEggless(!isEggless); }}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
                      isEggless 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'bg-white text-[#2D150F]/40 border border-[#E8DDD7]'
                    }`}
                  >
                    {isEggless ? '✓ Active Eggless' : 'Vegetarian Only'}
                  </button>
                </div>

                {/* 4. THE INSCRIPTION WRITING */}
                <div className="space-y-3">
                  <h5 className="text-[10px] uppercase font-black tracking-widest text-[#2D150F]/40">
                    4. THE INSCRIPTION / MESSAGE ON CAKE
                  </h5>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={32}
                      value={inscription}
                      onChange={(e) => setInscription(e.target.value)}
                      placeholder='Write "Happy Birthday Arjun!" or "Happy 25th"'
                      className="w-full bg-[#FAF7F5]/50 border border-[#E8DDD7] rounded-2xl px-5 py-3.5 text-xs text-[#2D150F] placeholder-[#3B1F17]/30 font-medium focus:outline-none focus:border-[#DE9088] focus:bg-white transition-all shadow-inner"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-[#2D150F]/30 uppercase tracking-widest">
                      {32 - inscription.length} chars
                    </div>
                  </div>
                </div>

                {/* PRICING & FINAL ADD CONVERTOR */}
                <div className="pt-6 border-t border-[#FAF7F5] flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black text-[#3B1F17]/30 uppercase tracking-widest block mb-0.5">Calculated Rate</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-serif font-black text-[#2D150F] italic tracking-tighter">
                        ₹{calculatedPrice}
                      </span>
                      <span className="text-[10px] font-sans font-black text-[#2D150F]/40 uppercase tracking-widest">
                        ({selectedWeight} KG)
                      </span>
                    </div>
                  </div>

                  <div className="flex-grow flex justify-end">
                    <Button
                      onClick={handleAddToCart}
                      className={`h-14 px-8 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transform active:scale-95 transition-all duration-300 shadow-xl ${
                        addedSuccessfully 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200' 
                          : 'bg-[#2D150F] hover:bg-[#DE9088] text-white hover:shadow-[#DE9088]/20'
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
