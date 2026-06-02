import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, Clock, Gift, MapPin, Search, Cake, Cookie, ShoppingBag, UtensilsCrossed, ChefHat, Heart, ChevronRight, Sparkles, Truck, Box, Sparkle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ProductCard } from '../components/ProductCard';
import { db } from '../lib/firebase';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { Product } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { handleFirestoreError, OperationType } from '../lib/firebase';
import SEO from '../components/SEO';
import { useUI } from '../lib/store';
import { FALLBACK_PRODUCTS } from '../lib/fallbackProducts';
import { playBtnTap, playSlidePop } from '../lib/sound';

// 3D spotlight targets for Apple-style fluid layout carousel with rich shiny brown gold dark backdrops
const HERO_SHOWCASED_CONFECTIONS = [
  {
    id: "lotus-biscoff-speculoos",
    name: "Lotus Biscoff Speculoos Dream",
    category: "Custom Cakes",
    price: 699,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop",
    desc: "An exquisite luxury white sponge cake interspaced with authentic creamy Speculoos spread, garnished meticulously with salted biscuit crumbs and hand-crafted brown sugar frosting rosewood spirals.",
    tagline: "FARIDABAD'S REQUISITE BIAS",
    bgColor: "from-[#2A110A] via-[#3E1E12] to-[#1C0A05]",
    shadowColor: "shadow-amber-950/50",
    accent: "text-amber-300",
    bgBadge: "bg-[#4E2719] border border-amber-500/30 text-amber-300"
  },
  {
    id: "chocolate-truffle-noir",
    name: "Elite Belgian Truffle Noir",
    category: "Regular Cakes",
    price: 549,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200&auto=format&fit=crop",
    desc: "Layers of dense moist cocoa chiffon sponge cake coated with authentic premium melted Belgian dark chocolate ganache, finished with hand-spun glaze and air-brushed 24k edible gold dust.",
    tagline: "INCOMPARABLE METALLIC GANACHE",
    bgColor: "from-[#1A0A06] via-[#2F140A] to-[#120502]",
    shadowColor: "shadow-amber-950/70",
    accent: "text-yellow-200",
    bgBadge: "bg-amber-950/80 border border-yellow-600/30 text-yellow-200"
  },
  {
    id: "royal-red-velveteer",
    name: "Royal Crimson Velvet",
    category: "Regular Cakes",
    price: 599,
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?q=80&w=1200&auto=format&fit=crop",
    desc: "Traditional fluffy cocoa buttermilk velvet cake layer arrays topped with premium fresh whipped cream cheese mousse swirls, sprinkled with dehydrated sweet crumbs.",
    tagline: "LUXURY CELEBRATION SHOWSTOPPER",
    bgColor: "from-[#330808] via-[#2D150F] to-[#1C0505]",
    shadowColor: "shadow-rose-950/60",
    accent: "text-rose-300",
    bgBadge: "bg-rose-950/80 border border-rose-500/30 text-rose-300"
  },
  {
    id: "ferrero-rocher-luxury",
    name: "Golden Imperial Ferrero Rocher",
    category: "Designer Cakes",
    price: 899,
    image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1200&auto=format&fit=crop",
    desc: "Premium crushed hazelnut creme layered with crisp wafers and imperial milk chocolate ganache, draped in smooth roasted hazelnut coating and gold leaf finish.",
    tagline: "THE ULTIMATE GOLDEN CONFECTIONERY",
    bgColor: "from-[#2A1B0E] via-[#3B2515] to-[#1C1109]",
    shadowColor: "shadow-yellow-950/60",
    accent: "text-yellow-100",
    bgBadge: "bg-yellow-950/80 border border-yellow-500/30 text-yellow-300"
  }
];

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [activeCategoryTab, setActiveCategoryTab] = useState('Regular Cakes');
  const [loading, setLoading] = useState(true);
  
  // Interactive Active spotlight carousel selection index
  const [spotlightIdx, setSpotlightIdx] = useState(0);
  const currentSpotlight = HERO_SHOWCASED_CONFECTIONS[spotlightIdx];

  // 3D Parallax Mouse Tracking states
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  // Interactive Premium Mouse Star Dust Tracking Trail
  const [trailDots, setTrailDots] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  const { setSearchOpen } = useUI();
  const navigate = useNavigate();

  useEffect(() => {
    // Auto carousel rotation interval
    const timer = setInterval(() => {
      setSpotlightIdx(prev => (prev + 1) % HERO_SHOWCASED_CONFECTIONS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let counter = 0;
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return; // Disable on small devices for battery savings
      if (Math.random() > 0.45) return; // Sparkle frequency filter

      const newDot = {
        id: counter++,
        x: e.clientX,
        y: e.clientY + window.scrollY,
        size: Math.random() * 8 + 5
      };

      setTrailDots(prev => [...prev.slice(-14), newDot]);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const path = 'products';
      try {
        const snap = await getDocs(query(collection(db, path)));
        let allProds = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        if (allProds.length === 0) {
          allProds = FALLBACK_PRODUCTS;
        }
        
        setAllProducts(allProds);
        
        // Show bestsellers first
        const bestsellers = allProds.filter(p => p.isBestseller).slice(0, 10);
        setFeaturedProducts(bestsellers.length > 0 ? bestsellers : allProds.slice(0, 10));
      } catch (error) {
        console.warn("Firestore error, loading premium fallback products catalog:", error);
        setAllProducts(FALLBACK_PRODUCTS);
        const bestsellers = FALLBACK_PRODUCTS.filter(p => p.isBestseller).slice(0, 10);
        setFeaturedProducts(bestsellers);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Parallax Handler
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5; // range: -0.5 to 0.5
    const y = (clientY - top) / height - 0.5;
    setMouseCoords({ x, y });
  };

  const handleHeroMouseLeave = () => {
    setMouseCoords({ x: 0, y: 0 });
  };

  const categories = [
    { name: 'Regular Cakes', queryName: 'Cakes', icon: Cake, color: '#fcf2f0', desc: 'Moist, fresh everyday celebration bakes' },
    { name: 'Designer Cakes', queryName: 'Custom Cakes', icon: ChefHat, color: '#fef7ef', desc: 'Bespoke multi-tier & themed masterpieces' },
    { name: 'Pastries', queryName: 'Pastries', icon: Cookie, color: '#f9f5f0', desc: 'Single slice luxury desserts & sweet treats' },
    { name: 'Curated Hampers', queryName: 'Hampers', icon: Box, color: '#f7f6f9', desc: 'Artisanal bakes & gift baskets' }
  ];

  const activeCategoryObject = categories.find(c => c.name === activeCategoryTab) || categories[0];
  const categoryProductsPreview = allProducts
    .filter(p => p.categories?.some(c => c.toLowerCase() === activeCategoryObject.queryName.toLowerCase()))
    .slice(0, 10);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pb-32 bg-transparent overflow-x-hidden min-h-screen relative"
    >
      <SEO 
        title="Cake Urban - Premium Artisan Bakery in Faridabad"
        description="Indulge in Cake Urban's luxury artisanal cakes, pastries & hampers. Freshly baked in Faridabad with 100% premium quality, fresh ingredients and customizable options."
        keywords="bakery in faridabad, best cake shop, buy premium cakes, customized birthday cakes, chocolate truffles, red velvet pastry"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Bakery",
            "name": "Cake Urban",
            "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop",
            "@id": "https://www.cakeurban.com/#bakery",
            "url": "https://www.cakeurban.com",
            "telephone": "+919876543210",
            "priceRange": "₹₹",
            "servesCuisine": "100% pure eggless customized premium designer cakes",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Artisanal Enclave, Sector 15",
              "addressLocality": "Faridabad",
              "addressRegion": "Haryana",
              "postalCode": "121002",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "28.4089",
              "longitude": "77.3178"
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ],
              "opens": "09:00",
              "closes": "23:59"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://www.cakeurban.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.cakeurban.com/shop?search={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          }
        ]}
      />

      {/* Cursor Sparkling Sparks Trail representation */}
      <AnimatePresence>
        {trailDots.map(dot => (
          <motion.div
            key={dot.id}
            initial={{ opacity: 0.9, scale: 1, rotate: 0 }}
            animate={{ opacity: 0, scale: 0.2, rotate: 180, y: "-15px" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute pointer-events-none z-[9999] select-none text-[#DFB15B]"
            style={{
              left: dot.x - dot.size / 2,
              top: dot.y - dot.size / 2,
              width: dot.size,
              height: dot.size,
            }}
          >
            <Sparkles className="w-full h-full fill-current" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* APPLE-STYLE INTERACTIVE HOVER PARALLAX HERO SECTION - PERSISTENT SPLIT GRID IN MOBILE AS REQUESTED */}
      <section 
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className={`relative px-3 sm:px-6 lg:px-8 pt-8 sm:pt-24 pb-16 overflow-hidden bg-gradient-to-b ${currentSpotlight.bgColor} transition-all duration-1000 border-b-2 border-[#DFB15B]/20`}
      >
        {/* Floating background glowing radial light orbs */}
        <div className="absolute top-1/4 right-[3%] w-72 sm:w-96 h-72 sm:h-96 bg-[#DFB15B]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-10 left-[5%] w-60 sm:w-80 h-60 sm:h-80 bg-stone-900/40 rounded-full blur-2xl pointer-events-none" />

        {/* Scattered 3D floating parallax micro elements */}
        <motion.div 
          animate={{
            x: mouseCoords.x * -35,
            y: mouseCoords.y * -35,
          }}
          className="absolute inset-0 pointer-events-none z-10 hidden md:block"
        >
          {/* Virtual crumbs, seeds, sprinkles coordinates */}
          <div className="absolute top-20 left-[12%] w-3 h-3 bg-amber-500/35 rounded-full blur-xs" />
          <div className="absolute top-[55%] left-[6%] w-4 h-4 bg-[#cc7a74]/20 rounded-full blur-xs" />
          <div className="absolute top-[12%] left-[82%] w-7 h-7 bg-white/10 backdrop-blur-md rounded-full shadow-lg border border-white/20 flex items-center justify-center">
            <Sparkle className="w-4 h-4 text-yellow-300 fill-yellow-300" />
          </div>
          <div className="absolute top-[75%] left-[88%] w-5 h-5 bg-[#DE9088]/20 rounded-full" />
        </motion.div>

        {/* ALWAYS 2-COLUMN SPLIT GRID LAYOUT (cols-2 is forced on mobile to address "ek grade mein do hone chahie na ... phone upar aur CV prakar ki device se bhi upar") */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-3 sm:gap-16 items-center px-1 sm:px-4">
          
          {/* LEFT COLUMN: TEXT & CAROUSEL TRIGGERS */}
          <div className="text-left z-20 space-y-3 sm:space-y-8 select-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSpotlight.id + '-badge'}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.35 }}
                className={`inline-flex items-center gap-1.5 ${currentSpotlight.bgBadge} px-2 sm:px-4 py-1 sm:py-2 rounded-full text-[7px] sm:text-[11px] font-black tracking-[0.2em] uppercase shadow-md`}
              >
                <Sparkle className="w-2.5 sm:w-4 h-2.5 sm:h-4 text-[#DFB15B] animate-spin" />
                <span>{currentSpotlight.tagline}</span>
              </motion.div>
            </AnimatePresence>

            <div className="space-y-1.5 sm:space-y-4">
              <h2 className="text-[13px] xs:text-[16px] sm:text-4xl md:text-5xl lg:text-7xl font-display font-black leading-[1.05] tracking-tight text-white">
                Baked <span className="italic font-serif font-light text-[#DFB15B] drop-shadow-lg">Fresh</span> <br />
                Every Day!
              </h2>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSpotlight.id + '-meta'}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ type: "spring", stiffness: 280, damping: 24 }}
                  className="space-y-1 sm:space-y-3"
                >
                  <p className="text-[11px] sm:text-2xl font-serif text-[#DFB15B] font-black italic tracking-tight line-clamp-1">
                    {currentSpotlight.name}
                  </p>
                  
                  <p className="text-white/70 text-[9px] xs:text-[10px] sm:text-sm leading-relaxed max-w-md font-medium italic line-clamp-2 min-h-[25px] sm:min-h-[60px]">
                    {currentSpotlight.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Price tag & Call to Action Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 pt-2 sm:pt-4 border-t border-white/10">
              <div className="flex flex-col">
                <span className="text-[7px] sm:text-[10px] font-black uppercase text-white/40 tracking-widest leading-none mb-0.5 sm:mb-1">Spotlight Offer</span>
                <div className="flex items-baseline gap-0.5 sm:gap-1">
                  <span className="text-sm sm:text-3.5xl font-serif font-black italic text-[#DFB15B]">
                    ₹{currentSpotlight.price}
                  </span>
                  <span className="text-[7px] sm:text-[10px] font-sans font-black text-white/40 uppercase tracking-[0.1em]">/ 0.5kg</span>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-1 sm:gap-3">
                <Link to="/shop">
                  <Button className="h-7 sm:h-14 px-2 sm:px-6 rounded-lg sm:rounded-xl bg-[#DFB15B] text-black hover:bg-white text-[7px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300">
                    Explore
                  </Button>
                </Link>
                <Link to="/custom-order">
                  <Button variant="outline" className="h-7 sm:h-14 px-2 sm:px-6 rounded-lg sm:rounded-xl border-white/20 bg-white/5 text-white hover:bg-white hover:text-black text-[7px] sm:text-xs font-black uppercase tracking-widest">
                    Custom Studio
                  </Button>
                </Link>
              </div>
            </div>

            {/* ARTISANAL SWITCH CAROUSEL INDICATORS / CONTROLS (Manual toggle switch box) */}
            <div className="pt-2 sm:pt-6 space-y-1 sm:space-y-2.5">
              <span className="text-[6px] sm:text-[9px] font-black text-white/30 uppercase tracking-[0.2em] block text-left">
                SWIPE & TOGGLE CELEBRATION DISHES
              </span>
              <div className="flex gap-1 overflow-x-auto no-scrollbar py-1">
                {HERO_SHOWCASED_CONFECTIONS.map((c, idx) => (
                  <button
                    key={c.id}
                    onClick={() => { playBtnTap(); setSpotlightIdx(idx); }}
                    className={`flex items-center gap-1.5 px-2 py-1.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-2xl border text-[6px] sm:text-xs font-black uppercase tracking-wider transition-all duration-300 shrink-0 ${
                      spotlightIdx === idx 
                        ? 'bg-[#DFB15B] text-black border-[#DFB15B] shadow-lg scale-105' 
                        : 'bg-white/5 text-white/65 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#DFB15B]" />
                    <span>{c.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: CAROUSEL HERO GLASS IMAGE PEDESTAL */}
          <div className="relative w-full flex items-center justify-center min-h-[140px] xs:min-h-[180px] sm:min-h-[480px]">
            {/* Ambient Background spinning orbit */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-[120px] xs:w-[160px] sm:w-[480px] h-[120px] xs:h-[160px] sm:h-[480px] rounded-full border border-dashed border-[#DFB15B]/15 z-0"
            />
            
            {/* Glowing spot pedestal */}
            <div className="absolute w-[110px] xs:w-[140px] sm:w-[380px] h-[110px] xs:h-[140px] sm:h-[380px] rounded-full bg-gradient-to-tr from-[#DFB15B]/10 to-transparent transition-colors duration-1000 z-0" />

            {/* Multi-layered Flying Pedestal with Spring Mouse Coordinates */}
            <motion.div
              animate={{
                x: mouseCoords.x * 25,
                y: mouseCoords.y * 25,
                rotateX: mouseCoords.y * -10,
                rotateY: mouseCoords.x * 10,
              }}
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              transition={{ type: "spring", stiffness: 150, damping: 18 }}
              className="relative p-1.5 sm:p-3 bg-white/90 backdrop-blur-md rounded-[22px] sm:rounded-[60px] shadow-2xl border border-white/20 w-11/12 max-w-[150px] xs:max-w-[200px] sm:max-w-[420px] aspect-square flex items-center justify-center z-10"
            >
              {/* Flying Cake Image Frame */}
              <div className="relative w-full h-full rounded-[14px] sm:rounded-[50px] overflow-hidden drop-shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentSpotlight.id}
                    src={currentSpotlight.image} 
                    alt={currentSpotlight.name} 
                    initial={{ scale: 0.88, opacity: 0, rotate: -4 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.88, opacity: 0, rotate: 4 }}
                    transition={{ type: "spring", stiffness: 180, damping: 18 }}
                    className="w-full h-full object-cover rounded-[14px] sm:rounded-[50px]"
                    loading="eager"
                  />
                </AnimatePresence>
                
                {/* Micro Gloss Glassmorphism Layer overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1C0A05]/25 via-transparent to-white/15" />
              </div>
              
              {/* Floating circular 100% organic guarantee badge */}
              <motion.div 
                animate={{
                  y: [-4, 4, -4],
                  rotate: [0, 4, -4, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-1.5 -right-1.5 sm:-top-6 sm:-right-6 w-9 h-9 sm:w-32 sm:h-32 bg-amber-950 text-white shadow-2xl rounded-full border border-[#DFB15B] flex flex-col items-center justify-center p-0.5 sm:p-2 text-center z-20"
              >
                <span className="text-[5px] sm:text-base font-black text-[#DFB15B] leading-none mb-0.5">100%</span>
                <span className="text-[3px] sm:text-[9px] font-bold uppercase tracking-wider leading-tight">Eggless<br/>Pure</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DYNAMIC SHINY WAVES LAYER SECTION DIVIDER (Liquid brown gold flowing chocolate theme) */}
      <div className="relative h-12 w-full overflow-hidden pointer-events-none z-10 bg-[#FAF7F5]">
        <svg viewBox="0 0 1440 120" className="absolute top-0 left-0 w-full h-24 preserve-3d" preserveAspectRatio="none">
          <path 
            fill="url(#liquid-chocolate)" 
            d="M0,32L80,48C160,64,320,96,480,96C640,96,800,64,960,48C1120,32,1280,32,1360,32L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
            className="opacity-90"
          />
          <defs>
            <linearGradient id="liquid-chocolate" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1C0A05" />
              <stop offset="100%" stopColor="#E6C2AC" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* QUICK SMART SEARCH BAR INTERACTION */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-30">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setSearchOpen(true)}
            className="w-full bg-white/95 backdrop-blur-md rounded-[24px] sm:rounded-[36px] p-4 sm:p-5 flex items-center justify-between shadow-[0_20px_45px_rgba(45,21,15,0.08)] border border-[#E8DDD7] hover:border-[#DE9088] transition-all group"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#DE9088]/15 flex items-center justify-center text-[#DE9088] group-hover:scale-105 transition-transform">
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-[10px] xs:text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#2D150F]">Looking for a specific cake?</p>
                <p className="text-[9px] xs:text-[10px] sm:text-sm text-[#3B1F17]/50 font-medium italic">Try "Chocolate Truffle Extra Creamy Eggless" or "Rainbow Smash Cake"</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-[#2D150F] text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#DE9088] transition-colors shadow-md">
              <span>Ask AI Search</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </button>
        </div>
      </section>

      {/* HIGHLY CATEGORIZED DYNAMIC INTERACTIVE SHOWCASE WITH STAGGERED ENTRACK */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-gradient-to-b from-[#1C0A05] via-[#2F140A] to-[#120502] text-white relative overflow-hidden border-y-2 border-[#DFB15B]/30 shadow-2xl">
        {/* Dynamic shining gold background atmosphere leaks */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#DFB15B]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-950/40 rounded-full blur-2xl pointer-events-none" />

        {/* Liquid chocolate wavy decorative lines in the section backdrop */}
        <div className="absolute inset-x-0 top-0 h-40 pointer-events-none opacity-20">
          <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
            <path stroke="#DFB15B" fill="none" strokeWidth="2.5" d="M0,96C240,128,480,160,720,128C960,96,1200,0,1440,32" strokeDasharray="5,10" />
            <path stroke="#DFB15B" fill="none" strokeWidth="1.5" d="M0,192C360,224,720,128,1080,160C1260,176,1350,224,1440,224" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 space-y-4"
          >
            <div className="inline-block bg-[#DFB15B]/20 text-[#DFB15B] border border-[#DFB15B]/40 px-5 py-2 rounded-full text-[10px] md:text-xs font-black tracking-[0.25em] uppercase shadow-md">
              ✨ CURATED MASTERPIECES
            </div>
            <h3 className="text-3xl sm:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#DFB15B] to-yellow-100 tracking-tight drop-shadow-md">
              Browse our Curations
            </h3>
            <p className="text-zinc-300 text-xs sm:text-base font-medium italic max-w-xl mx-auto leading-relaxed">
              We have divided our boutique into clear artisanal branches, allowing you to easily browse and select standard premium bakes, instant pastries, or bespoke creations.
            </p>
          </motion.div>

          {/* Luxury Categories Tabs Slider */}
          <div className="flex justify-start sm:justify-center overflow-x-auto pb-4 mb-10 sm:mb-16 gap-3 no-scrollbar shrink-0">
            {categories.map((cat) => {
              const tabActive = activeCategoryTab.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  onClick={() => { playSlidePop(); setActiveCategoryTab(cat.name); }}
                  className={`flex items-center gap-2 px-5 py-4 rounded-[22px] text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 border shrink-0 ${
                    tabActive 
                      ? 'bg-[#DFB15B] text-black border-[#DFB15B] shadow-[0_10px_35px_rgba(223,177,91,0.4)] scale-105' 
                      : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 hover:text-white hover:border-[#DFB15B]/40 shadow-sm'
                  }`}
                >
                  <cat.icon className={`w-4 h-4 ${tabActive ? 'text-black' : 'text-[#DFB15B]'}`} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Category Content Grid previewer with staggered animation */}
          <div className="space-y-12">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCategoryTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8"
              >
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-[360px] rounded-[32px] bg-white/5 border border-white/10 animate-pulse" />
                  ))
                ) : categoryProductsPreview.length > 0 ? (
                  categoryProductsPreview.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center bg-white/5 rounded-[40px] border border-white/10 p-10 shadow-lg">
                    <p className="text-3xl mb-4">🎂</p>
                    <p className="text-base font-serif font-semibold text-[#DFB15B] italic">No items uploaded in {activeCategoryTab} yet</p>
                    <p className="text-xs text-stone-400 italic mt-2">Check back shortly as our bakes are refreshing daily!</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Explanatory Banner & View All Button */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-between p-8 bg-[#2D150F] rounded-[32px] sm:rounded-[48px] text-white shadow-xl relative overflow-hidden group text-left"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#DE9088]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
              <div className="space-y-2 mb-6 sm:mb-0 relative z-10">
                <span className="text-[9px] font-black uppercase text-[#DE9088] tracking-[0.3em]">Excellence Hand-Crafted</span>
                <p className="text-lg sm:text-2xl font-serif font-medium tracking-tight italic">Want to explore our complete {activeCategoryTab} selection?</p>
                <p className="text-xs text-white/60 font-light">Custom size options, flavors, messages and eggless choices are fully customizable at checkout.</p>
              </div>
              <Button 
                onClick={() => { playBtnTap(); navigate(`/shop?category=${activeCategoryObject.queryName}`); }}
                className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-[#DE9088] text-white hover:bg-white hover:text-[#2D150F] text-xs font-black uppercase tracking-widest relative z-10 transition-all duration-300 shadow-md"
              >
                <span>Browse All {activeCategoryTab}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SHINY LIQUID CHOCOLATE VELVET SCROLLING WAVE 1 */}
      <div className="relative h-20 w-full overflow-hidden pointer-events-none z-10 -mt-10 opacity-80">
        <svg viewBox="0 0 1440 120" className="w-full h-full" preserveAspectRatio="none">
          <path 
            fill="url(#velvet-wave-gradient-1)" 
            d="M0,48C180,96,360,112,540,85C720,58,900,-11,1080,5C1260,21,1440,110,1440,110L1440,120L0,120Z"
          />
          <defs>
            <linearGradient id="velvet-wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1A0A06" />
              <stop offset="50%" stopColor="#DFB15B" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#2F140A" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* THREE EXQUISITE BOUTIQUE CARDS FEATURE SHOWCASE */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-3"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#DE9088]">Curator Choice</span>
            <h3 className="text-2xl sm:text-4xl font-display font-black text-[#2D150F]">Why Cake Urban Faridabad?</h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CARD 1: THE CAKE ARTISANRY */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-b from-[#FFFDFB] via-[#FAF3EC] to-[#FAF5F0] rounded-[40px] p-8 border-2 border-[#DFB15B]/30 hover:border-[#DFB15B] shadow-[0_12px_45px_rgba(45,21,15,0.04)] hover:shadow-[0_30px_70px_rgba(45,21,15,0.15)] flex flex-col justify-between group transition-all duration-500"
            >
              <div className="space-y-6 text-left">
                <div className="w-16 h-16 rounded-3xl bg-amber-950/10 flex items-center justify-center text-amber-900 group-hover:scale-110 transition-transform duration-300">
                  <Cake className="w-8 h-8" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-display font-black text-[#2D150F]">100% Chef Curated</h4>
                  <p className="text-xs text-[#2D150F]/75 leading-relaxed font-semibold italic">
                    Every frosting stroke is perfected. Chef-guided, real chocolate truffles, fresh strawberries, and luxury grade dairy.
                  </p>
                </div>
              </div>
              <div className="pt-8 border-t border-[#DFB15B]/20 mt-8 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-900">Pure Chocolate & Fruit</span>
                <Sparkles className="w-4 h-4 text-[#DE9088] animate-pulse" />
              </div>
            </motion.div>

            {/* CARD 2: MIDNIGHT SURPRISE DELIVERIES */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-b from-[#FFFDFB] via-[#FAF3EC] to-[#FAF5F0] rounded-[40px] p-8 border-2 border-[#DFB15B]/30 hover:border-[#DFB15B] shadow-[0_12px_45px_rgba(45,21,15,0.04)] hover:shadow-[0_30px_70px_rgba(45,21,15,0.15)] flex flex-col justify-between group transition-all duration-500"
            >
              <div className="space-y-6 text-left">
                <div className="w-16 h-16 rounded-3xl bg-amber-950/10 flex items-center justify-center text-amber-900 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-display font-black text-[#2D150F]">Midnight Surprise Slot</h4>
                  <p className="text-xs text-[#2D150F]/75 leading-relaxed font-semibold italic">
                    Delight those who matter most exactly when they turn a year older. Elite slot operations from 11:30 PM to midnight.
                  </p>
                </div>
              </div>
              <div className="pt-8 border-t border-[#DFB15B]/20 mt-8 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-900">Midnight Enclaves</span>
                <Truck className="w-4 h-4 text-[#DE9088] animate-bounce" />
              </div>
            </motion.div>

            {/* CARD 3: CREATIVE CUSTOM STUDIO */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-b from-[#FFFDFB] via-[#FAF3EC] to-[#FAF5F0] rounded-[40px] p-8 border-2 border-[#DFB15B]/30 hover:border-[#DFB15B] shadow-[0_12px_45px_rgba(45,21,15,0.04)] hover:shadow-[0_30px_70px_rgba(45,21,15,0.15)] flex flex-col justify-between group transition-all duration-500"
            >
              <div className="space-y-6 text-left">
                <div className="w-16 h-16 rounded-3xl bg-amber-950/10 flex items-center justify-center text-amber-900 group-hover:scale-110 transition-transform duration-300">
                  <ChefHat className="w-8 h-8" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-display font-black text-[#2D150F]">Creative Canvas Studio</h4>
                  <p className="text-xs text-[#2D150F]/75 leading-relaxed font-semibold italic">
                    Have a digital reference? We accept reference designs and color swatches to paint custom buttercream masterworks.
                  </p>
                </div>
              </div>
              <div className="pt-8 border-t border-[#DFB15B]/20 mt-8 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#DE9088]">Customizable Weights</span>
                <ChevronRight className="w-4 h-4 text-[#DE9088] group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SHINY LIQUID GOLD SHIMMER SCROLLING WAVE 2 */}
      <div className="relative h-20 w-full overflow-hidden pointer-events-none z-10 -mt-10 opacity-75">
        <svg viewBox="0 0 1440 120" className="w-full h-full" preserveAspectRatio="none">
          <path 
            fill="url(#shimmer-wave-gradient-2)" 
            d="M0,64C240,110,480,24,720,64C960,104,1200,48,1440,16L1440,120L0,120Z"
          />
          <defs>
            <linearGradient id="shimmer-wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1A0A06" />
              <stop offset="50%" stopColor="#DFB15B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FAF7F5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* BESTSELLERS SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-[#FAF7F5]">
        <div className="max-w-7xl mx-auto animate-reveal">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="h-px bg-[#E8DDD7] w-12 md:w-20" />
              <Heart className="w-4 h-4 text-[#DE9088] fill-[#DE9088]" />
              <h3 className="text-3xl md:text-5xl font-display font-black text-[#2D150F] tracking-tight">Favorite BestSellers</h3>
              <Heart className="w-4 h-4 text-[#DE9088] fill-[#DE9088]" />
              <div className="h-px bg-[#E8DDD7] w-12 md:w-20" />
            </div>
            <p className="text-[#3B1F17]/50 text-xs sm:text-lg font-medium italic">
              Indulge in Faridabad's absolute favorites. Baked fresh with pure goodness.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[10px] sm:gap-6 md:gap-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[400px] rounded-[40px] bg-[#FAF7F5] animate-pulse" />
              ))
            ) : (
              featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* DELIVERABLE NCR ZONES & SEARCH OPTIMIZATION MAP - CRITICAL SEO ACCELERATOR */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-[#FAF7F5] border-t border-[#E8DDD7]/40 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-[#cc7a74]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <span className="text-[10px] uppercase font-black tracking-[0.35em] text-[#DE9088] block">Google SEO & Delivery Map</span>
            <h3 className="text-3xl md:text-5xl font-display font-black text-[#2D150F] tracking-tight">Our Elite Delivery Zones & Region Hubs</h3>
            <p className="text-[#3B1F17]/50 max-w-lg mx-auto text-xs sm:text-base font-medium italic">
              Experience air-suspended, temperature-regulated same-day confections. Explore regional bakeries and custom studios near you across Delhi NCR.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                title: "Bakery in Faridabad",
                desc: "Same-Day Hand-Delivery & Custom Studio in Sectors 14, 15, 21 & Greenfield Enclave.",
                link: "/cake-delivery-in-faridabad"
              },
              {
                title: "Premium Bakery in Delhi",
                desc: "Plush chocolate truffles and anniversary cakes delivered with elite precision across South Delhi.",
                link: "/bakery-in-delhi"
              },
              {
                title: "Designer Cakes in Noida",
                desc: "Multi-layered customized character monuments and baby shower cakes handcrafted live.",
                link: "/designer-cakes-in-noida"
              },
              {
                title: "Custom Cakes in Gurgaon",
                desc: "Luxury fondant structures and customized brand hampers for cyber-enclaves & DLF residences.",
                link: "/custom-cakes-in-gurgaon"
              }
            ].map((node, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E8DDD7]/40 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300 text-left"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#DE9088]/10 text-[#DE9088] flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-black text-[#2D150F]">{node.title}</h4>
                  <p className="text-xs text-[#2D150F]/60 font-semibold italic leading-relaxed">{node.desc}</p>
                </div>
                <Link to={node.link} className="mt-6 flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-[#DE9088] hover:text-[#2D150F] transition-colors font-sans">
                  <span>Explore Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Master SEO Keywords cloud list */}
          <div className="bg-white rounded-[40px] p-6 sm:p-10 border border-[#E8DDD7]/40 max-w-4xl mx-auto space-y-4 shadow-sm text-center">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#DE9088] block">Our Confectionery Breadcrumbs</span>
            <p className="text-[10px] text-[#2D150F]/50 leading-relaxed italic font-medium">
              We specialize in: <strong>Custom cakes in Faridabad</strong> · <strong>Bestseller Red Velvet Pastry</strong> · Edible Photo Cakes Noida · Same Day Birthday Cakes Gurgaon · Pure Eggless Bakery Delhi NCR · French Macarons delivery · Belgian Chocolate Truffles · Pinata Smash Cakes · Double-Decker Wedding Tier cakes.
            </p>
          </div>
        </div>
      </section>

      {/* ROCKET CONVERSION & LIVE TRUST TESTIMONIALS */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-gradient-to-b from-[#FAF7F5] to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DE9088]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-12 xl:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span>Verified 4.9★ Gastronomical Rank</span>
            </div>
            
            <h3 className="text-3xl sm:text-5xl font-display font-black text-[#2D150F] tracking-tight leading-none">
              Loved by NCR's<br />
              <span className="italic font-serif font-light text-[#DE9088]">Elite Connoisseurs</span>
            </h3>

            <p className="text-xs sm:text-base text-[#3B1F17]/60 leading-relaxed font-semibold italic">
              From surprise corporate gatherings in Cyber City to sweet first birthday moments in Faridabad, over 14,200+ cakes have been shaped with pure organic dairy products and premium gourmet cocoa.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF7F5] flex items-center justify-center text-[#DE9088]">
                  <Star className="w-5 h-5 fill-[#DE9088]" />
                </div>
                <div>
                  <p className="text-xs font-black text-[#2D150F] uppercase tracking-wide">14,200+ Delivered Masters</p>
                  <p className="text-[10px] text-[#2D150F]/50 italic">Freshly dispatched & loved</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF7F5] flex items-center justify-center text-[#DE9088]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-[#2D150F] uppercase tracking-wide">Instant 30-Minute Dispatch</p>
                  <p className="text-[10px] text-[#2D150F]/50 italic">For standard cakes in Faridabad enclaves</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
                <Button className="h-14 px-8 rounded-2xl bg-[#2D150F] text-white hover:bg-[#DE9088] text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                  <span>Inquire with Chief Baker on WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>

          <div className="lg:col-span-12 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            {[
              {
                quote: "Absolutely pristine design! The Red Velvet cream cheese layer was moist and not overly sweet. Delivered right at 11:58 PM for the birthday launch in Faridabad.",
                author: "Ananya Sharma",
                loc: "Sector 15, Faridabad",
                dish: "Signature Red Velvet Cheese"
              },
              {
                quote: "Our custom triple-stack anniversary cake was a piece of pure art. The Belgian Ganache was extremely premium and our family loved it. 5/5 stars!",
                author: "Rohan Malhotra",
                loc: "DLF Phase 3, Gurgaon",
                dish: "Custom Belgian Truffle"
              }
            ].map((feed, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[36px] p-8 border border-[#E8DDD7]/40 shadow-sm text-left flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-[#2D150F]/70 leading-relaxed font-semibold italic">"{feed.quote}"</p>
                </div>
                <div className="pt-4 border-t border-[#FAF7F5] flex items-center justify-between">
                  <div>
                    <h5 className="text-[11px] font-black uppercase tracking-wide text-[#2D150F]">{feed.author}</h5>
                    <span className="text-[9px] text-[#2D150F]/50 font-medium italic">{feed.loc}</span>
                  </div>
                  <span className="bg-[#DE9088]/10 text-[#cc7a74] px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider">{feed.dish}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </motion.div>
  );
}
