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

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [activeCategoryTab, setActiveCategoryTab] = useState('Cakes');
  const [loading, setLoading] = useState(true);
  const { setSearchOpen } = useUI();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const path = 'products';
      try {
        const snap = await getDocs(query(collection(db, path)));
        let allProds = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        // If Firestore is empty, load 25+ Fallback products so the website is gorgeous
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

  const categories = [
    { name: 'Cakes', icon: Cake, color: '#fcf2f0', desc: 'Custom design & premium celebration regular cakes' },
    { name: 'Pastries', icon: Cookie, color: '#f9f5f0', desc: 'Indulgent classic single slice treats' },
    { name: 'Hampers', icon: Box, color: '#f7f6f9', desc: 'Gifting selections & curated bakery combos' },
    { name: 'Custom Cakes', icon: ChefHat, color: '#fef7ef', desc: 'Bespoke cakes handcrafted to order' },
    { name: 'Breads', icon: UtensilsCrossed, color: '#fcf2f0', desc: 'Artisanal morning bakes & fresh loaves' }
  ];

  // Dynamically filter active preview product list based on selected category tab
  const categoryProductsPreview = allProducts
    .filter(p => p.categories?.some(c => c.toLowerCase() === activeCategoryTab.toLowerCase()))
    .slice(0, 10);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pb-32 bg-[#FAF7F5] overflow-x-hidden min-h-screen"
    >
      <SEO 
        title="Cake Urban - Premium Artisan Bakery in Faridabad"
        description="Indulge in Cake Urban's luxury artisanal cakes, pastries & hampers. Freshly baked in Faridabad with 100% premium quality, fresh ingredients and customizable options."
        keywords="bakery in faridabad, best cake shop, buy premium cakes, customized birthday cakes, chocolate truffles, red velvet pastry"
        schema={{
          "@context": "https://schema.org",
          "@type": "Bakery",
          "name": "Cake Urban",
          "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop",
          "@id": "https://www.cakeurban.com",
          "url": "https://www.cakeurban.com",
          "telephone": "+919876543210",
          "priceRange": "₹₹",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Artisanal Enclave, Sector 15",
            "addressLocality": "Faridabad",
            "addressRegion": "NCR",
            "postalCode": "121007",
            "addressCountry": "IN"
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
        }}
      />

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-8 sm:pt-20 pb-12 overflow-hidden bg-gradient-to-b from-[#fffefe] to-[#FAF7F5]">
        {/* Luxury Background Circles */}
        <div className="absolute top-1/4 right-[5%] w-96 h-96 bg-[#DE9088]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-[10%] w-72 h-72 bg-[#3B1F17]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-4 sm:gap-12 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left z-10"
          >
            <div className="inline-flex items-center gap-2 bg-[#DE9088]/10 text-[#cc7a74] px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[8px] sm:text-[10px] md:text-xs font-black tracking-[0.25em] uppercase mb-4 sm:mb-8 shadow-sm">
              <Sparkle className="w-3 h-3 animate-spin text-[#DE9088]" />
              <span>Faridabad's Elite Bakery</span>
            </div>

            <h2 className="text-[20px] xs:text-[28px] sm:text-[46px] md:text-[68px] lg:text-[78px] font-display font-black leading-[1.05] sm:leading-[1.02] tracking-tight text-[#2D150F] mb-4 sm:mb-6">
              Crafting<br />
              <span className="italic font-serif font-light text-[#DE9088]">Sweet Stories</span><br />
              in Every Crumb
            </h2>

            <p className="text-[#3B1F17]/65 text-[10px] xs:text-xs sm:text-base md:text-xl leading-relaxed max-w-md mx-0 mb-5 sm:mb-10 font-medium italic">
              Experience local boutique baking at its absolute finest. 100% freshly whipped artisanal celebration masterpieces with convenient same-day hand-delivery.
            </p>

            <div className="flex flex-row gap-2 sm:gap-4 items-center justify-start">
              <Link to="/shop">
                <Button className="h-10 sm:h-14 md:h-16 px-4 sm:px-10 rounded-xl sm:rounded-2xl bg-[#2D150F] hover:bg-[#DE9088] hover:text-white text-[10px] sm:text-sm font-black uppercase tracking-widest shadow-xl flex items-center gap-1.5 sm:gap-2 group transition-all duration-300">
                  Shop Cakes <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/custom-order">
                <Button variant="outline" className="h-10 sm:h-14 md:h-16 px-4 sm:px-10 rounded-xl sm:rounded-2xl border-[#E8DDD7] bg-white text-[#2D150F] hover:bg-[#FAF7F5] text-[10px] sm:text-sm font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5 sm:gap-2">
                  Custom Studio <Cake className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#DE9088]" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative p-1.5 sm:p-3 bg-white rounded-[28px] sm:rounded-[60px] shadow-2xl xl:shadow-[0_45px_100px_rgba(45,21,15,0.08)] border border-[#eadfd8]/30"
            >
              <img 
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop" 
                alt="Signature Velvet Cake" 
                className="w-full h-[150px] xs:h-[190px] sm:h-[420px] md:h-[540px] object-cover rounded-[22px] sm:rounded-[50px]"
                loading="eager"
              />
              
              {/* Premium Experience Floating Badge */}
              <div className="absolute -top-2 -right-2 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white shadow-2xl rounded-full border border-dashed border-[#DE9088]/40 flex flex-col items-center justify-center p-1 sm:p-4 text-center z-10 group hover:rotate-12 transition-transform duration-700">
                <span className="text-xs sm:text-2xl md:text-3xl font-black text-[#2D150F] leading-none mb-0.5 sm:mb-1">100%</span>
                <span className="text-[5px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#DE9088] leading-tight">Freshly<br/>Baked</span>
                <Heart className="w-1.5 h-1.5 sm:w-3.5 sm:h-3.5 text-[#DE9088] mt-1 sm:mt-2 fill-[#DE9088]" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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

      {/* HIGHLY CATEGORIZED DYNAMIC INTERACTIVE SHOWCASE */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-gradient-to-b from-[#FAF7F5] via-[#fffdfc] to-[#FAF7F5] relative">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <div className="inline-block bg-[#DE9088]/10 text-[#cc7a74] px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black tracking-[0.2em] uppercase">
              Curated Masterpieces
            </div>
            <h3 className="text-3xl sm:text-5xl font-display font-black text-[#2D150F] tracking-tight">Browse our Curations</h3>
            <p className="text-[#3B1F17]/50 text-xs sm:text-lg font-medium italic max-w-xl mx-auto">
              We have divided our boutique into clear artisanal branches, allowing you to easily browse and select standard premium cakes, instant pastries, or bespoke creations.
            </p>
          </div>

          {/* Luxury Categories Tabs Slider */}
          <div className="flex justify-start sm:justify-center overflow-x-auto pb-4 mb-10 sm:mb-16 gap-3 no-scrollbar shrink-0">
            {categories.map((cat) => {
              const tabActive = activeCategoryTab.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategoryTab(cat.name)}
                  className={`flex items-center gap-2 px-5 py-4 rounded-[22px] text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 border shrink-0 ${
                    tabActive 
                      ? 'bg-[#2D150F] text-white border-[#2D150F] shadow-lg scale-105' 
                      : 'bg-white text-[#2D150F]/70 border-[#E8DDD7] hover:bg-[#DE9088]/5 hover:text-[#2D150F]'
                  }`}
                >
                  <cat.icon className={`w-4 h-4 ${tabActive ? 'text-[#DE9088]' : 'text-[#2D150F]/45'}`} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Category Content Grid previewer */}
          <div className="space-y-12">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCategoryTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8"
              >
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-[360px] rounded-[32px] bg-[#fffdfc] border border-[#eadfd8]/30 animate-pulse" />
                  ))
                ) : categoryProductsPreview.length > 0 ? (
                  categoryProductsPreview.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center bg-white rounded-[40px] border border-[#E8DDD7]/40 p-10 shadow-sm">
                    <p className="text-3xl mb-4">🍰</p>
                    <p className="text-base font-serif font-semibold text-[#2D150F] italic">No items uploaded in {activeCategoryTab} yet</p>
                    <p className="text-xs text-[#3B1F17]/50 italic mt-2">Check back shortly as our bakes are refreshing daily!</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Explanatory Banner & View All Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-8 bg-[#2D150F] rounded-[32px] sm:rounded-[48px] text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#DE9088]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
              <div className="space-y-2 mb-6 sm:mb-0 text-left relative z-10">
                <span className="text-[9px] font-black uppercase text-[#DE9088] tracking-[0.3em]">Excellence Hand-Crafted</span>
                <p className="text-lg sm:text-2xl font-serif font-medium tracking-tight italic">Want to explore our complete {activeCategoryTab} selection?</p>
                <p className="text-xs text-white/60 font-light">Custom size options, flavors, messages and eggless choices are fully customizable at checkout.</p>
              </div>
              <Button 
                onClick={() => navigate(`/shop?category=${activeCategoryTab}`)}
                className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-[#DE9088] text-white hover:bg-white hover:text-[#2D150F] text-xs font-black uppercase tracking-widest relative z-10 transition-all duration-300 shadow-md"
              >
                <span>Browse All {activeCategoryTab}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* THREE EXQUISITE BOUTIQUE CARDS FEATURE SHOWCASE */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section title */}
          <div className="text-center space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#DE9088]">Curator Choice</span>
            <h3 className="text-2xl sm:text-4xl font-display font-black text-[#2D150F]">Why Cake Urban Faridabad?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CARD 1: THE CAKE ARTISANRY */}
            <div className="bg-white rounded-[40px] p-8 border border-[#E8DDD7]/40 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all duration-500">
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-[#fcf2f0] flex items-center justify-center text-[#DE9088] group-hover:scale-110 transition-transform duration-300">
                  <Cake className="w-8 h-8" />
                </div>
                <div className="space-y-3 text-left">
                  <h4 className="text-xl font-display font-black text-[#2D150F]">100% Chef Curated</h4>
                  <p className="text-xs text-[#2D150F]/60 leading-relaxed font-semibold italic">
                    Every frosting stroke is perfected. Chef-guided, real chocolate truffles, fresh strawberries, and luxury grade dairy.
                  </p>
                </div>
              </div>
              <div className="pt-8 border-t border-[#F8F4F1] mt-8 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#DE9088]">Pure Chocolate & Fruit</span>
                <Sparkles className="w-4 h-4 text-[#DE9088] animate-pulse" />
              </div>
            </div>

            {/* CARD 2: MIDNIGHT SURPRISE DELIVERIES */}
            <div className="bg-white rounded-[40px] p-8 border border-[#E8DDD7]/40 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all duration-500">
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-[#f9f5f0] flex items-center justify-center text-[#DE9088] group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8" />
                </div>
                <div className="space-y-3 text-left">
                  <h4 className="text-xl font-display font-black text-[#2D150F]">Midnight Surprise Slot</h4>
                  <p className="text-xs text-[#2D150F]/60 leading-relaxed font-semibold italic">
                    Delight those who matter most exactly when they turn a year older. Elite slot operations from 11:30 PM to midnight.
                  </p>
                </div>
              </div>
              <div className="pt-8 border-t border-[#F8F4F1] mt-8 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#DE9088]">Midnight Enclaves</span>
                <Truck className="w-4 h-4 text-[#DE9088] animate-bounce" />
              </div>
            </div>

            {/* CARD 3: CREATIVE CUSTOM STUDIO */}
            <div className="bg-white rounded-[40px] p-8 border border-[#E8DDD7]/40 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all duration-500">
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-[#fef7ef] flex items-center justify-center text-[#DE9088] group-hover:scale-110 transition-transform duration-300">
                  <ChefHat className="w-8 h-8" />
                </div>
                <div className="space-y-3 text-left">
                  <h4 className="text-xl font-display font-black text-[#2D150F]">Creative Canvas Studio</h4>
                  <p className="text-xs text-[#2D150F]/60 leading-relaxed font-semibold italic">
                    Have a digital reference? We accept reference designs and color swatches to paint custom buttercream masterworks.
                  </p>
                </div>
              </div>
              <div className="pt-8 border-t border-[#F8F4F1] mt-8 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#DE9088]">Customizable Weights</span>
                <ChevronRight className="w-4 h-4 text-[#DE9088] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BESTSELLERS SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-[#FAF7F5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
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
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10">
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
          <div className="text-center space-y-4">
            <span className="text-[10px] uppercase font-black tracking-[0.35em] text-[#DE9088] block">Google SEO & Delivery Map</span>
            <h3 className="text-3xl md:text-5xl font-display font-black text-[#2D150F] tracking-tight">我们的 Delivery Zones & Region Hubs</h3>
            <p className="text-[#3B1F17]/50 max-w-lg mx-auto text-xs sm:text-base font-medium italic">
              Experience air-suspended, temperature-regulated same-day confections. Explore regional bakeries and custom studios near you across Delhi NCR.
            </p>
          </div>

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
                <Link to={node.link} className="mt-6 flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-[#DE9088] hover:text-[#2D150F] transition-colors">
                  <span>Explore Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Master SEO Keywords cloud list */}
          <div className="bg-white rounded-[40px] p-6 sm:p-10 border border-[#E8DDD7]/40 max-w-4xl mx-auto space-y-4 shadow-sm">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#DE9088]">Our Confectionery Breadcrumbs</span>
            <p className="text-[10px] text-[#2D150F]/50 leading-relaxed italic text-center font-medium">
              We specialize in: <strong>Custom cakes in Faridabad</strong> · <strong>Bestseller Red Velvet Pastry</strong> · Edible Photo Cakes Noida · Same Day Birthday Cakes Gurgaon · Pure Eggless Bakery Delhi NCR · French Macarons delivery · Belgian Chocolate Truffles · Pinata Smash Cakes · Double-Decker Wedding Tier cakes.
            </p>
          </div>
        </div>
      </section>

      {/* ROCKET CONVERSION & LIVE TRUST TESTIMONIALS */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-gradient-to-b from-[#FAF7F5] to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DE9088]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6 text-left">
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

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
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
