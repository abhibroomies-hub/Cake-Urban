import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, Clock, Gift, MapPin, Search, Cake, Cookie, ShoppingBag, UtensilsCrossed, ChefHat, Heart, ChevronRight, Sparkles, Truck, Box, Sparkle, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ProductCard } from '../components/ProductCard';
import { Rotating3DCake } from '../components/Rotating3DCake';
import { LiquidGoldButton } from '../components/LiquidGoldButton';
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
    bgColor: "from-[#080808] via-[#141210] to-[#020202]",
    shadowColor: "shadow-amber-950/50",
    accent: "text-amber-300",
    bgBadge: "bg-[#2A1812] border border-amber-500/30 text-amber-300"
  },
  {
    id: "chocolate-truffle-noir",
    name: "Elite Belgian Truffle Noir",
    category: "Regular Cakes",
    price: 549,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200&auto=format&fit=crop",
    desc: "Layers of dense moist cocoa chiffon sponge cake coated with authentic premium melted Belgian dark chocolate ganache, finished with hand-spun glaze and air-brushed 24k edible gold dust.",
    tagline: "INCOMPARABLE METALLIC GANACHE",
    bgColor: "from-[#080808] via-[#12110F] to-[#020202]",
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
    bgColor: "from-[#080808] via-[#161111] to-[#020202]",
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
    bgColor: "from-[#080808] via-[#14120E] to-[#020202]",
    shadowColor: "shadow-yellow-950/60",
    accent: "text-yellow-100",
    bgBadge: "bg-yellow-950/80 border border-yellow-500/30 text-yellow-300"
  }
];

// ---------------------------------------------------------
// DYNAMIC HOLIDAY & SEASONS PLANNERS (DAILY SMART COUTDOWN BANNER ENGINE)
// ---------------------------------------------------------
export interface FestiveOccasion {
  id: string;
  name: string;
  emoji: string;
  title: string;
  tagline: string;
  bannerMessage: string;
  bannerImage: string;
  code: string;
  accentColor: string;
  accentBg: string;
  filterKeywords: string[];
  flourishes: string[];
}

export const FESTIVE_OCCASIONS: FestiveOccasion[] = [
  {
    id: 'diwali',
    name: 'Diwali Festive',
    emoji: '🪔',
    title: 'Festival of Lights Grand Celebration',
    tagline: 'GOLD FLAKES & SAFFRON ELIXIR',
    bannerMessage: 'Shubh Deepavali! Pure eggless fusion cakes crafted with real 24k edible Gold leaf, Saffron Pistachio mousse, and caramelized rose petals.',
    bannerImage: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=1200&auto=format&fit=crop',
    code: 'DIWALI15',
    accentColor: '#FF9933',
    accentBg: 'rgba(255, 153, 51, 0.15)',
    filterKeywords: ['chocolate', 'truffle', 'royal', 'speculoos', 'gold', 'ferrero', 'hazelnut'],
    flourishes: ['✨', '🪔', '🌟', '🏵️']
  },
  {
    id: 'christmas',
    name: 'Christmas Winter',
    emoji: '🎄',
    title: 'Winter Wonderland Baking Studio',
    tagline: 'CRANBERRY COCOA & PLUM GLAZE',
    bannerMessage: 'Merry Christmas! Experience winter joy with spiced red-velvet logs, snow-cream clouds, and chocolate-hazelnut peaks.',
    bannerImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop',
    code: 'SNOW15',
    accentColor: '#EF4444',
    accentBg: 'rgba(239, 68, 68, 0.15)',
    filterKeywords: ['velvet', 'strawberry', 'chiffon', 'biscoff', 'speculoos', 'white'],
    flourishes: ['❄️', '🎄', '🎁', '✨']
  },
  {
    id: 'valentines',
    name: "Valentine's Rose",
    emoji: '💖',
    title: 'Season of Sweet Amour & Petals',
    tagline: 'CRIMSON VELVET & FRESH STRAWBERRY CREAM',
    bannerMessage: 'Celebrate Love! Elegant crimson red velvet bouquets, whipped rose syrup sponges, and heart-shaped strawberry confections.',
    bannerImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop',
    code: 'LOVE15',
    accentColor: '#EC4899',
    accentBg: 'rgba(236, 72, 153, 0.15)',
    filterKeywords: ['velvet', 'crimson', 'strawberry', 'macaron', 'blush'],
    flourishes: ['💖', '🌹', '✨', '🎈']
  },
  {
    id: 'halloween',
    name: 'Spooky Carnival',
    emoji: '🎃',
    title: 'Midnight Witching Cocoa Brews',
    tagline: 'DARK CHOCOLATE NOIR & CHARCOAL FUDGE',
    bannerMessage: 'Trick or Treat! Witchy chocolate glazes, charcoal fudge cobwebs, and delicious blood-orange cream pastries.',
    bannerImage: 'https://images.unsplash.com/photo-1508349082404-55310f5949ec?q=80&w=1200&auto=format&fit=crop',
    code: 'BOO15',
    accentColor: '#F97316',
    accentBg: 'rgba(249, 115, 22, 0.15)',
    filterKeywords: ['fudge', 'noir', 'truffle', 'espresso', 'caramel', 'cocoa'],
    flourishes: ['🎃', '🦇', '👻', '🌌']
  },
  {
    id: 'anniversary',
    name: 'Bespoke Milestone',
    emoji: '👑',
    title: 'Grand Milestone & Custom Design',
    tagline: 'CUSTOM TIER MASTERPIECE & FLOWERS',
    bannerMessage: 'Perfect Centerpieces! Royal designer tier cakes, luxury golden decorations, and handcrafted personalized models.',
    bannerImage: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1200&auto=format&fit=crop',
    code: 'ROYAL15',
    accentColor: '#DFB15B',
    accentBg: 'rgba(223, 177, 91, 0.15)',
    filterKeywords: ['designer', 'custom', 'imperial', 'rocher', 'luxury'],
    flourishes: ['✨', '👑', '🎉', '🌟']
  }
];

export function FestiveParticles({ flourishes }: { flourishes: string[] }) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; s: number; d: number; char: string }[]>([]);

  useEffect(() => {
    const arr = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      x: Math.random() * 95,
      y: Math.random() * 100,
      s: Math.random() * 1.4 + 0.7,
      d: Math.random() * 8 + 6,
      char: flourishes[i % flourishes.length]
    }));
    setParticles(arr);
  }, [flourishes]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 select-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -60, opacity: 0 }}
          animate={{
            y: ['0vh', '100vh'],
            x: [`${p.x}vw`, `${p.x + (Math.random() * 10 - 5)}vw`],
            opacity: [0, 0.75, 0.75, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: p.d,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute text-sm sm:text-lg filter drop-shadow-md"
          style={{
            left: `${p.x}%`,
            top: `-5%`,
          }}
        >
          {p.char}
        </motion.div>
      ))}
    </div>
  );
}

export function getFestiveSortedProducts(products: Product[], keywords: string[]) {
  return [...products].sort((a, b) => {
    const aMatch = keywords.some(kw =>
      a.name.toLowerCase().includes(kw) || a.description?.toLowerCase().includes(kw)
    );
    const bMatch = keywords.some(kw =>
      b.name.toLowerCase().includes(kw) || b.description?.toLowerCase().includes(kw)
    );
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });
}

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [activeCategoryTab, setActiveCategoryTab] = useState('Regular Cakes');
  const [loading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  
  // Interactive Active spotlight carousel selection index
  const [spotlightIdx, setSpotlightIdx] = useState(0);
  const currentSpotlight = HERO_SHOWCASED_CONFECTIONS[spotlightIdx];

  // 3D Parallax Mouse Tracking wrapper ref
  const heroSectionRef = useRef<HTMLDivElement>(null);

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

  // Parallax Handler using highly performant CSS variables to completely bypass React re-renders during mouse move!
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroSectionRef.current) return;
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5; // range: -0.5 to 0.5
    const y = (clientY - top) / height - 0.5;
    
    heroSectionRef.current.style.setProperty('--hero-mouse-x', `${x}`);
    heroSectionRef.current.style.setProperty('--hero-mouse-y', `${y}`);
    heroSectionRef.current.style.setProperty('--hero-rotate-x', `${y * -10}deg`);
    heroSectionRef.current.style.setProperty('--hero-rotate-y', `${x * 10}deg`);
  };

  const handleHeroMouseLeave = () => {
    if (!heroSectionRef.current) return;
    heroSectionRef.current.style.setProperty('--hero-mouse-x', '0');
    heroSectionRef.current.style.setProperty('--hero-mouse-y', '0');
    heroSectionRef.current.style.setProperty('--hero-rotate-x', '0deg');
    heroSectionRef.current.style.setProperty('--hero-rotate-y', '0deg');
  };

  // Dynamic Festival calendar initialization (auto-detect based on calendar date system)
  const getInitialOccasion = () => {
    const month = new Date().getMonth(); // 0 is Jan, 11 is Dec
    if (month === 1) return 'valentines';
    if (month === 9) return 'halloween';
    if (month === 10) return 'diwali';
    if (month === 11) return 'christmas';
    return 'anniversary'; // default sweet celebration milestones
  };

  const [selectedOccasionId, setSelectedOccasionId] = useState<string>(getInitialOccasion());
  const activeOccasion = FESTIVE_OCCASIONS.find(o => o.id === selectedOccasionId) || FESTIVE_OCCASIONS[4];

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

  // Dynamic sorting based on selected holiday filter keywords!
  const festiveCategoryProducts = getFestiveSortedProducts(categoryProductsPreview, activeOccasion.filterKeywords);
  const festiveFeaturedProducts = getFestiveSortedProducts(featuredProducts, activeOccasion.filterKeywords);

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
            "telephone": "+917318531953",
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

      {/* APPLE-STYLE INTERACTIVE HOVER PARALLAX HERO SECTION - PERSISTENT SPLIT GRID IN MOBILE AS REQUESTED */}
      <section 
        ref={heroSectionRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className={`relative px-3 sm:px-6 lg:px-8 pt-8 sm:pt-24 pb-16 overflow-hidden bg-gradient-to-b ${currentSpotlight.bgColor} transition-all duration-1000 border-b-2 border-[#DFB15B]/20`}
      >
        {/* Floating background glowing radial light orbs */}
        <div className="absolute top-1/4 right-[3%] w-72 sm:w-96 h-72 sm:h-96 bg-[#DFB15B]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-10 left-[5%] w-60 sm:w-80 h-60 sm:h-80 bg-stone-900/40 rounded-full blur-2xl pointer-events-none" />

        {/* Scattered 3D floating parallax micro elements utilizing CSS performance variables */}
        <div 
          style={{
            transform: 'translate(calc(var(--hero-mouse-x, 0) * -35px), calc(var(--hero-mouse-y, 0) * -35px))',
            transition: 'transform 0.1s ease-out'
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
        </div>

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

              <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 items-center w-full">
                <Link to="/shop" className="w-full sm:w-auto">
                  <LiquidGoldButton text="ORDER NOW" />
                </Link>
                <Link to="/custom-order" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-6 rounded-2xl border-2 border-white/20 bg-white/5 text-white hover:bg-white hover:text-black text-[10px] sm:text-xs font-black uppercase tracking-widest">
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

          {/* RIGHT COLUMN: HIGH-END 3D ROTATING CAKE IN PERSPECTIVE VIEW */}
          <div className="relative w-full flex items-center justify-center z-10 min-h-[220px] xs:min-h-[260px] sm:min-h-[480px]">
            <Rotating3DCake />
          </div>
        </div>
      </section>

      {/* DYNAMIC SHINY WAVES LAYER SECTION DIVIDER (Liquid brown gold flowing chocolate theme) */}
      <div className="relative h-12 w-full overflow-hidden pointer-events-none z-10 bg-transparent">
        <svg viewBox="0 0 1440 120" className="absolute top-0 left-0 w-full h-24 preserve-3d" preserveAspectRatio="none">
          <path 
            fill="url(#liquid-chocolate)" 
            d="M0,32L80,48C160,64,320,96,480,96C640,96,800,64,960,48C1120,32,1280,32,1360,32L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
            className="opacity-90"
          />
          <defs>
            <linearGradient id="liquid-chocolate" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1C0A05" />
              <stop offset="100%" stopColor="#2D150F" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* QUICK SMART SEARCH BAR INTERACTION */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-30">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setSearchOpen(true)}
            className="w-full bg-[#26130F]/90 backdrop-blur-md rounded-[24px] sm:rounded-[36px] p-4 sm:p-5 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#DFB15B]/25 hover:border-[#DFB15B]/80 transition-all group text-white"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#DFB15B]/15 flex items-center justify-center text-[#DFB15B] group-hover:scale-105 transition-transform">
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-[10px] xs:text-[11px] sm:text-xs font-black uppercase tracking-widest text-white">Looking for a specific cake?</p>
                <p className="text-[9px] xs:text-[10px] sm:text-sm text-[#FFFDFB]/60 font-medium italic">Try "Chocolate Truffle Extra Creamy Eggless" or "Rainbow Smash Cake"</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#DFB15B] to-[#C99A43] text-black px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-95 transition-opacity shadow-md">
              <span className="font-black text-amber-950">Ask AI Search</span>
              <ArrowRight className="w-4 h-4 ml-1 text-amber-950" />
            </div>
          </button>
        </div>
      </section>

      {/* FESTIVE TIMELINE SYSTEM & AMBIENT SPOTLIGHT BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 relative z-30 -mt-2">
        <div className="max-w-7xl mx-auto space-y-6 relative">

          {/* Active Particle Flourishes floating layer */}
          <FestiveParticles flourishes={activeOccasion.flourishes} />

          {/* Interactive Event Timeline Select Bar */}
          <div className="bg-[#26130F]/90 backdrop-blur-md rounded-[32px] p-4 sm:p-5 border border-[#DFB15B]/20 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3 text-left">
              <span className="text-2xl animate-pulse">📅</span>
              <div>
                <h4 className="text-xs sm:text-sm font-display font-black text-white leading-none uppercase tracking-wider">Atelier Festival Calendar & Vibe Simulator</h4>
                <p className="text-[10px] text-zinc-400 font-medium italic mt-1">Select any celebration event to dynamically customize the menu and showcase relevant bakes!</p>
              </div>
            </div>

            {/* Selector Pills Slider */}
            <div className="flex flex-wrap items-center gap-2 max-w-full pb-1 no-scrollbar shrink-0">
              {FESTIVE_OCCASIONS.map(occ => {
                const isSelected = selectedOccasionId === occ.id;
                return (
                  <button
                    key={occ.id}
                    onClick={() => {
                      playSlidePop();
                      setSelectedOccasionId(occ.id);
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border cursor-pointer select-none ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#DFB15B] to-[#C99A43] text-[#140603] border-white/40 shadow-md scale-105'
                        : 'bg-white/5 text-[#FFFDFB]/80 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span>{occ.emoji}</span>
                    <span>{occ.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Festive Highlight Banner */}
          <motion.div
            key={activeOccasion.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-[40px] border border-[#DFB15B]/20 bg-[#26130F]/45 overflow-hidden text-left shadow-2xl relative min-h-[200px] flex flex-col justify-between"
          >
            {/* Ambient Background decoration specific to the event */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-[0.16] z-0 transition-all duration-700 pointer-events-none"
              style={{ backgroundImage: `url(${activeOccasion.bannerImage})` }}
            />
            {/* Radiant glow specific to the active festival color */}
            <div
              className="absolute inset-0 opacity-[0.25] pointer-events-none z-0"
              style={{
                background: `radial-gradient(circle 500px at right, ${activeOccasion.accentColor}, transparent)`
              }}
            />

            <div className="p-6 sm:p-10 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 w-full">
              <div className="space-y-4 max-w-2xl text-left">
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border"
                  style={{
                    color: activeOccasion.accentColor,
                    borderColor: `${activeOccasion.accentColor}30`,
                    backgroundColor: activeOccasion.accentBg
                  }}
                >
                  <span>{activeOccasion.emoji}</span>
                  <span>TODAY'S SEASONAL SPOTLIGHT</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-display font-black text-white leading-tight">
                  {activeOccasion.title}
                </h3>

                <p className="text-[#FFFDFB]/80 text-xs sm:text-sm md:text-base leading-relaxed font-semibold italic">
                  {activeOccasion.bannerMessage}
                </p>

                <div className="flex items-center gap-2.5 text-[10px] uppercase font-mono text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-[#DFB15B]" />
                  <span>SAME-DAY EXPRESS DELIVERIES NCR BOUND: <strong className="text-[#DFB15B]">ORDER BEFORE 4:00 PM</strong></span>
                </div>
              </div>

              {/* Instant discount voucher card */}
              <div className="w-full md:w-auto shrink-0 bg-white/5 border border-white/10 rounded-[30px] p-6 text-center space-y-4 relative overflow-hidden backdrop-blur-sm z-10">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#DFB15B]/10 rounded-full blur-xl" />
                <span className="text-[10px] uppercase font-black tracking-widest text-[#DFB15B]">FESTIVAL PROMO CODE</span>
                <div className="bg-black/50 border border-dashed border-[#DFB15B]/30 py-3 px-6 rounded-2xl">
                  <span className="font-mono text-xl sm:text-2xl font-black text-white tracking-widest">{activeOccasion.code}</span>
                </div>
                <p className="text-[10px] font-medium text-zinc-300">Apply during checkout for <strong className="text-white">15% Instant Off</strong></p>
              </div>
            </div>
          </motion.div>

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
            <div className="inline-block bg-[#DFB15B]/20 text-[#DFB15B] border border-[#DFB15B]/40 px-5 py-2 rounded-full text-[10px] md:text-xs font-black tracking-[0.25em] uppercase shadow-md animate-pulse">
              ✨ FRESH & EGGLESS
            </div>
            <h3 className="text-3xl sm:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#DFB15B] to-yellow-100 tracking-tight drop-shadow-md">
              Our Cake Boutique
            </h3>
            <p className="text-zinc-300 text-xs sm:text-sm font-bold italic max-w-xl mx-auto leading-relaxed">
              Select your favorite sweet category below and customize your order instantly!
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
                ) : festiveCategoryProducts.length > 0 ? (
                  festiveCategoryProducts.map((product) => (
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
              <div className="space-y-2 mb-6 sm:mb-0 relative z-10 text-left">
                <span className="text-[9px] font-black uppercase text-[#DE9088] tracking-[0.3em]">Freshly Baked for You</span>
                <p className="text-lg sm:text-2xl font-serif font-black italic">Explore all {activeCategoryTab} designs</p>
                <p className="text-xs text-white/70 font-semibold">100% customizable size, flavor, and custom messages at checkout.</p>
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
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#DFB15B]">Curator Choice</span>
            <h3 className="text-2xl sm:text-4xl font-display font-black text-white">Why Cake Urban Faridabad?</h3>
          </motion.div>

<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 max-w-7xl mx-auto">
            {/* CARD 1: THE CAKE ARTISANRY */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              onClick={() => {
                playSlidePop();
                setSelectedFeature({
                  title: "100% Chef Curated",
                  icon: "Cake",
                  headline: "Curated Masterpieces & Fine Patisserie Care",
                  content: "Every single frosting stroke at Cake Urban is perfected under professional oversight. We run a boutique kitchen where only luxury dairy cream, authentic Belgian chocolate truffle batches, and real field-plucked strawberries are ever allowed. Nothing artificial, no pre-baked freezing. Our chefs curate each design dynamically to ensure it matches your dream celebration perfectly.",
                  badge: "Pure Chocolate & Fruit"
                });
              }}
              className="bg-[#26130F]/85 backdrop-blur-xl rounded-[24px] sm:rounded-[36px] p-4 sm:p-6 border border-[#DFB15B]/25 hover:border-[#DFB15B]/80 shadow-[0_10px_25px_rgba(0,0,0,0.55)] hover:shadow-[0_20px_50px_rgba(223,177,91,0.25)] flex flex-col justify-between group transition-all duration-500 text-white cursor-pointer hover:-translate-y-1.5 animate-reveal"
            >
              <div className="space-y-3 sm:space-y-6 text-left">
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-[18px] sm:rounded-3xl bg-[#DFB15B]/15 flex items-center justify-center text-[#DFB15B] group-hover:scale-110 transition-transform duration-300">
                  <Cake className="w-5 h-5 sm:w-8 sm:h-8" />
                </div>
                <div className="space-y-1.5 sm:space-y-3">
                  <h4 className="text-xs sm:text-lg font-display font-black text-white group-hover:text-[#DFB15B] transition-colors line-clamp-1">100% Chef Curated</h4>
                  <p className="text-[10px] sm:text-xs text-[#FFFDFB]/60 leading-normal sm:leading-relaxed font-semibold font-sans">
                    Gourmet dairy, signature Belgian cocoa, and fresh organic fruits. No pre-mixes!</p>
                </div>
              </div>
            </motion.div>

            {/* CARD 2: MIDNIGHT SURPRISE DELIVERIES */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                playSlidePop();
                setSelectedFeature({
                  title: "Midnight Surprise Slot",
                  icon: "Clock",
                  headline: "Elite Midnight Delivery Service",
                  content: "Want to surprise your favorite person exactly at 12:00 AM? We operate a dedicated midnight delivery fleet that handles local transit with cold-storage boxes between 11:30 PM and midnight. Experience premium promptness across Faridabad, Noida, and NCR sectors.",
                  badge: "Midnight Enclaves"
                });
              }}
              className="bg-[#26130F]/85 backdrop-blur-xl rounded-[24px] sm:rounded-[36px] p-4 sm:p-6 border border-[#DFB15B]/25 hover:border-[#DFB15B]/80 shadow-[0_10px_25px_rgba(0,0,0,0.55)] hover:shadow-[0_20px_50px_rgba(223,177,91,0.25)] flex flex-col justify-between group transition-all duration-500 text-white cursor-pointer hover:-translate-y-1.5 animate-reveal"
            >
              <div className="space-y-3 sm:space-y-6 text-left">
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-[18px] sm:rounded-3xl bg-[#DFB15B]/15 flex items-center justify-center text-[#DFB15B] group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-5 h-5 sm:w-8 sm:h-8" />
                </div>
                <div className="space-y-1.5 sm:space-y-3">
                  <h4 className="text-xs sm:text-lg font-display font-black text-white group-hover:text-[#DFB15B] transition-colors line-clamp-1">Midnight Surprise</h4>
                  <p className="text-[10px] sm:text-xs text-[#FFFDFB]/60 leading-normal sm:leading-relaxed font-semibold font-sans">
                    Surprise them exactly at 12:00 AM. Guaranteed cold-chain temperature routing!</p>
                </div>
              </div>
            </motion.div>

            {/* CARD 3: CREATIVE CUSTOM STUDIO */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              onClick={() => {
                playSlidePop();
                setSelectedFeature({
                  title: "Creative Canvas Studio",
                  icon: "ChefHat",
                  headline: "Bespoke Sculptures & Flavor Engineering",
                  content: "If you have a Google Image reference, a digital sketch, or a specific Pantone shade card, our lead pastry artist will transform it into sugar and cake. From custom-sculpted fondant toppers to 3D architectural bakes, your imagination is our master blueprint.",
                  badge: "Customizable Weights"
                });
              }}
              className="bg-[#26130F]/85 backdrop-blur-xl rounded-[24px] sm:rounded-[36px] p-4 sm:p-6 border border-[#DFB15B]/25 hover:border-[#DFB15B]/80 shadow-[0_10px_25px_rgba(0,0,0,0.55)] hover:shadow-[0_20px_50px_rgba(223,177,91,0.25)] flex flex-col justify-between group transition-all duration-500 text-white cursor-pointer hover:-translate-y-1.5 animate-reveal"
            >
              <div className="space-y-3 sm:space-y-6 text-left">
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-[18px] sm:rounded-3xl bg-[#DFB15B]/15 flex items-center justify-center text-[#DFB15B] group-hover:scale-110 transition-transform duration-300">
                  <ChefHat className="w-5 h-5 sm:w-8 sm:h-8" />
                </div>
                <div className="space-y-1.5 sm:space-y-3">
                  <h4 className="text-xs sm:text-lg font-display font-black text-white group-hover:text-[#DFB15B] transition-colors line-clamp-1">Creative Canvas</h4>
                  <p className="text-[10px] sm:text-xs text-[#FFFDFB]/60 leading-normal sm:leading-relaxed font-semibold font-sans">
                    Have an image reference? Send us any design to bring your custom cake to life!</p>
                </div>
              </div>
            </motion.div>

            {/* CARD 4: ARTISANAL LUXURY HAMPERS */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              onClick={() => {
                playSlidePop();
                setSelectedFeature({
                  title: "Artisanal Gifting Hampers",
                  icon: "Gift",
                  headline: "Curated Hampers & Premium Packaging",
                  content: "Perfect for corporate events, elegant festivals, or precious family gatherings. We curate luxury crates carrying handmade pralines, tea loaves, custom Helium balloons, and fine pastries. Each box is decorated with premium satin ribbons.",
                  badge: "Bespoke Box Curations"
                });
              }}
              className="bg-[#26130F]/85 backdrop-blur-xl rounded-[24px] sm:rounded-[36px] p-4 sm:p-6 border border-[#DFB15B]/25 hover:border-[#DFB15B]/80 shadow-[0_10px_25px_rgba(0,0,0,0.55)] hover:shadow-[0_20px_50px_rgba(223,177,91,0.25)] flex flex-col justify-between group transition-all duration-500 text-white cursor-pointer hover:-translate-y-1.5 animate-reveal"
            >
              <div className="space-y-3 sm:space-y-6 text-left">
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-[18px] sm:rounded-3xl bg-[#DFB15B]/15 flex items-center justify-center text-[#DFB15B] group-hover:scale-110 transition-transform duration-300">
                  <Gift className="w-5 h-5 sm:w-8 sm:h-8" />
                </div>
                <div className="space-y-1.5 sm:space-y-3">
                  <h4 className="text-xs sm:text-lg font-display font-black text-white group-hover:text-[#DFB15B] transition-colors line-clamp-1">Luxury Hampers</h4>
                  <p className="text-[10px] sm:text-xs text-[#FFFDFB]/60 leading-normal sm:leading-relaxed font-semibold font-sans">
                    Handcrafted premium gift boxes filled with exquisite pralines, cookies, and ribbons!</p>
                </div>
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
              <stop offset="100%" stopColor="#240F0A" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* BESTSELLERS SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-transparent">
        <div className="max-w-7xl mx-auto animate-reveal">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="h-px bg-white/10 w-12 md:w-20" />
              <Heart className="w-4 h-4 text-[#DE9088] fill-[#DE9088]" />
              <h3 className="text-3xl md:text-5xl font-display font-black text-white tracking-tight">Favorite BestSellers</h3>
              <Heart className="w-4 h-4 text-[#DE9088] fill-[#DE9088]" />
              <div className="h-px bg-white/10 w-12 md:w-20" />
            </div>
            <p className="text-white/60 text-xs sm:text-lg font-medium italic">
              Indulge in Faridabad's absolute favorites. Baked fresh with pure goodness.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[10px] sm:gap-6 md:gap-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[400px] rounded-[40px] bg-[#2D150F]/45 animate-pulse" />
              ))
            ) : (
              festiveFeaturedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* DELIVERABLE NCR ZONES & SEARCH OPTIMIZATION MAP - CRITICAL SEO ACCELERATOR */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-transparent border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-[#cc7a74]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <span className="text-[10px] uppercase font-black tracking-[0.35em] text-[#DFB15B] block">Google SEO & Delivery Map</span>
            <h3 className="text-3xl md:text-5xl font-display font-black text-white tracking-tight">Our Elite Delivery Zones & Region Hubs</h3>
            <p className="text-white/60 max-w-lg mx-auto text-xs sm:text-base font-medium italic">
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
              <div
                key={idx}
                className="bg-[#26130F]/85 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 border border-[#DFB15B]/25 shadow-lg flex flex-col justify-between hover:shadow-2xl hover:border-[#DFB15B]/80 hover:shadow-[0_20px_45px_rgba(223,177,91,0.15)] hover:-translate-y-1.5 transform-gpu transition-all duration-300 text-left text-white"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#DFB15B]/15 text-[#DFB15B] flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-black text-white">{node.title}</h4>
                  <p className="text-xs text-zinc-300 font-semibold italic leading-relaxed">{node.desc}</p>
                </div>
                <Link to={node.link} className="mt-6 flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-[#DFB15B] hover:text-white transition-colors font-sans">
                  <span>Explore Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

          {/* Master SEO Keywords cloud list */}
          <div className="bg-[#1E0D0A]/90 backdrop-blur-md rounded-[40px] p-6 sm:p-10 border border-[#DFB15B]/25 max-w-4xl mx-auto space-y-4 shadow-lg text-center text-white">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#DFB15B] block">Our Confectionery Breadcrumbs</span>
            <p className="text-[10px] text-white/70 leading-relaxed italic font-medium">
              We specialize in: <strong>Custom cakes in Faridabad</strong> · <strong>Bestseller Red Velvet Pastry</strong> · Edible Photo Cakes Noida · Same Day Birthday Cakes Gurgaon · Pure Eggless Bakery Delhi NCR · French Macarons delivery · Belgian Chocolate Truffles · Pinata Smash Cakes · Double-Decker Wedding Tier cakes.
            </p>
          </div>
        </div>
      </section>

      {/* ROCKET CONVERSION & LIVE TRUST TESTIMONIALS */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DFB15B]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-12 xl:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 bg-emerald-400/15 text-emerald-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/25">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              <span>Verified 4.9★ Gastronomical Rank</span>
            </div>
            
            <h3 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-none">
              Loved by NCR's<br />
              <span className="italic font-serif font-light text-[#DFB15B]">Elite Connoisseurs</span>
            </h3>

            <p className="text-xs sm:text-base text-white/70 leading-relaxed font-semibold italic">
              From surprise corporate gatherings in Cyber City to sweet first birthday moments in Faridabad, over 14,200+ cakes have been shaped with pure organic dairy products and premium gourmet cocoa.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#DFB15B] border border-white/10">
                  <Star className="w-5 h-5 fill-[#DFB15B]" />
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-wide">14,200+ Delivered Masters</p>
                  <p className="text-[10px] text-zinc-400 italic">Freshly dispatched & loved</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#DFB15B] border border-white/10">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-wide">Instant 30-Minute Dispatch</p>
                  <p className="text-[10px] text-zinc-400 italic">For standard cakes in Faridabad enclaves</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <a href="https://wa.me/917318531953" target="_blank" rel="noreferrer">
                <Button className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[#DFB15B] to-[#C99A43] text-black font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:opacity-90">
                  <span>Inquire with Chief Baker on WhatsApp</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </Button>
              </a>
            </div>
          </div>

          <div className="lg:col-span-12 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 relative text-white">
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
                className="bg-[#26130F]/90 backdrop-blur-xl rounded-[36px] p-8 border border-[#DFB15B]/25 shadow-lg text-left flex flex-col justify-between space-y-6 text-white"
              >
                <div className="space-y-4">
                  <div className="flex gap-1 text-[#DFB15B]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current animate-pulse" />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-200 leading-relaxed font-semibold italic">"{feed.quote}"</p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <h5 className="text-[11px] font-black uppercase tracking-wide text-white">{feed.author}</h5>
                    <span className="text-[9px] text-zinc-400 font-medium italic">{feed.loc}</span>
                  </div>
                  <span className="bg-[#DFB15B]/15 text-[#DFB15B] px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider">{feed.dish}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. EXQUISITE INTERACTIVE FEATURE DETAIL MODAL popup */}
      <AnimatePresence>
        {selectedFeature && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Dark glass backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeature(null)}
              className="absolute inset-0 bg-[#1A0A07]/80 backdrop-blur-md"
            />

            {/* Modal Body with Golden accents */}
            <motion.div
              initial={{ scale: 0.92, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="relative w-full max-w-xl bg-[#210F0C] rounded-[36px] overflow-hidden shadow-[0_35px_80px_rgba(0,0,0,0.8)] border border-[#DFB15B]/35 z-10 p-6 sm:p-10 text-left text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 hover:bg-[#DFB15B] text-white hover:text-[#140603] transition-all duration-300 flex items-center justify-center border border-white/10 shadow-md active:scale-90 z-20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon Pedestal */}
              <div className="w-16 h-16 rounded-2xl bg-[#DFB15B]/15 flex items-center justify-center text-[#DFB15B] mb-6">
                {selectedFeature.icon === 'Cake' && <Cake className="w-8 h-8" />}
                {selectedFeature.icon === 'Clock' && <Clock className="w-8 h-8" />}
                {selectedFeature.icon === 'ChefHat' && <ChefHat className="w-8 h-8" />}
                {selectedFeature.icon === 'Gift' && <Gift className="w-8 h-8" />}
              </div>

              {/* Title, Headline & Badge */}
              <div className="space-y-2 mb-6">
                <span className="bg-[#DFB15B]/15 text-[#DFB15B] px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                  {selectedFeature.badge}
                </span>
                <h4 className="text-2xl sm:text-3xl font-display font-black text-white leading-tight pt-1">
                  {selectedFeature.title}
                </h4>
                <p className="text-xs sm:text-sm font-bold text-amber-300 italic">
                  {selectedFeature.headline}
                </p>
              </div>

              {/* Content text */}
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-semibold">
                  {selectedFeature.content}
                </p>
              </div>

              {/* CTA button to close or consult */}
              <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                <Button
                  onClick={() => setSelectedFeature(null)}
                  className="px-6 rounded-2xl bg-gradient-to-r from-[#DFB15B] to-[#C99A43] text-black font-black uppercase text-xs tracking-widest hover:opacity-90 active:scale-95 transition-all"
                >
                  Wonderful, I Got It!
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
