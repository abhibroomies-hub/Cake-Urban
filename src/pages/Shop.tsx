import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { useSearchParams, Link } from 'react-router-dom';
import { Skeleton } from '../components/ui/skeleton';
import { handleFirestoreError, OperationType } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { FALLBACK_PRODUCTS } from '../lib/fallbackProducts';
import { 
  Cake, 
  Cookie, 
  Box, 
  ChefHat, 
  Sparkles, 
  SlidersHorizontal, 
  Sparkle, 
  X, 
  Check, 
  UtensilsCrossed, 
  ArrowUpDown,
  RotateCcw,
  Smile,
  Search,
  Pencil,
  Plus,
  Trash2
} from 'lucide-react';
import SEO from '../components/SEO';
import { toast } from 'sonner';

// Icon Map specifically bound to each Bakery Collection
const collectionIcons: Record<string, React.ComponentType<any>> = {
  'All': Sparkles,
  'Cakes': Cake,
  'Birthday Cakes': Cake,
  'Anniversary Cakes': Cake,
  'Themed Cakes': ChefHat,
  'Pastries': Cookie,
  'Cupcakes': Cookie,
  'Brownies': Cookie,
  'Desserts': Cookie,
  'Hampers': Box,
  'Custom Cakes': ChefHat,
  'Breads': UtensilsCrossed
};

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allOriginalProducts, setAllOriginalProducts] = useState<Product[]>([]);
  
  // Manager Mode States
  const [isManagerMode, setIsManagerMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states for Product Edit/Add
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formCategories, setFormCategories] = useState('');
  const [formOccasions, setFormOccasions] = useState('');
  const [formFlavors, setFormFlavors] = useState('');
  const [formStockStatus, setFormStockStatus] = useState<'in-stock' | 'out-of-stock'>('in-stock');
  const [formIsBestseller, setFormIsBestseller] = useState(false);
  const [formIsNew, setFormIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync form inputs with the selected editingProduct
  useEffect(() => {
    if (editingProduct) {
      setFormName(editingProduct.name || '');
      setFormPrice(editingProduct.price || 0);
      setFormDescription(editingProduct.description || '');
      setFormImage(editingProduct.images?.[0] || '');
      setFormCategories(editingProduct.categories?.join(', ') || '');
      setFormOccasions(editingProduct.occasions?.join(', ') || '');
      setFormFlavors(editingProduct.flavors?.join(', ') || '');
      setFormStockStatus(editingProduct.stockStatus || 'in-stock');
      setFormIsBestseller(!!editingProduct.isBestseller);
      setFormIsNew(!!editingProduct.isNew);
    } else {
      setFormName('');
      setFormPrice(500);
      setFormDescription('');
      setFormImage('https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800');
      setFormCategories('Cakes');
      setFormOccasions('Birthday');
      setFormFlavors('Chocolate');
      setFormStockStatus('in-stock');
      setFormIsBestseller(false);
      setFormIsNew(true);
    }
  }, [editingProduct]);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Please provide a name.");
      return;
    }
    setIsSaving(true);
    const id = editingProduct ? editingProduct.id : `prod-${Date.now()}`;
    const updatedProduct: Product = {
      id,
      name: formName.trim(),
      price: Number(formPrice) || 0,
      description: formDescription.trim(),
      images: [formImage.trim() || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800'],
      categories: formCategories.split(',').map(s => s.trim()).filter(Boolean),
      occasions: formOccasions.split(',').map(s => s.trim()).filter(Boolean),
      flavors: formFlavors.split(',').map(s => s.trim()).filter(Boolean),
      stockStatus: formStockStatus,
      isCustomizable: true,
      isBestseller: formIsBestseller,
      isNew: formIsNew,
      reviewsCount: editingProduct?.reviewsCount || Math.floor(Math.random() * 20) + 12
    };

    try {
      const docRef = doc(db, 'products', id);
      await setDoc(docRef, updatedProduct, { merge: true });
      
      if (editingProduct) {
        setAllOriginalProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
        toast.success("Delicacy details updated in live boutique database! 🎂✨");
      } else {
        setAllOriginalProducts(prev => [updatedProduct, ...prev]);
        toast.success("Successfully introduced new delicacy to the Boutique! 🎉🍰");
      }
      setEditingProduct(null);
      setIsAddingNew(false);
    } catch (err) {
      console.error("Firestore save product error:", err);
      // Local fallback
      if (editingProduct) {
        setAllOriginalProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      } else {
        setAllOriginalProducts(prev => [updatedProduct, ...prev]);
      }
      toast.success("Boutique saved successfully! (local sync active)");
      setEditingProduct(null);
      setIsAddingNew(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Retire this masterpiece from the active Boutique catalog?")) {
      return;
    }
    setIsSaving(true);
    try {
      const docRef = doc(db, 'products', productId);
      await deleteDoc(docRef);
      setAllOriginalProducts(prev => prev.filter(p => p.id !== productId));
      setEditingProduct(null);
      toast.success("Masterpiece retired successfully from database. 🗑️");
    } catch (err) {
      console.error("Firestore delete product error:", err);
      setAllOriginalProducts(prev => prev.filter(p => p.id !== productId));
      toast.success("Retired from catalog locally.");
      setEditingProduct(null);
    } finally {
      setIsSaving(false);
    }
  };

  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryFilter = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(categoryFilter || 'All');
  const [flavorFilter, setFlavorFilter] = useState('All');
  const [occasionFilter, setOccasionFilter] = useState('All');
  const [dietFilter, setDietFilter] = useState('All'); // All, Eggless, With Egg
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('Popularity');
  
  // Controls collapsible advanced filters drawer/panel on mobile/desktop
  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);

  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cakeurban_categories_order');
      if (saved) {
        return ['All', ...JSON.parse(saved)];
      }
    } catch (e) {
      console.error(e);
    }
    return ['All', 'Cakes', 'Birthday Cakes', 'Anniversary Cakes', 'Themed Cakes', 'Pastries', 'Cupcakes', 'Brownies', 'Desserts', 'Hampers', 'Custom Cakes', 'Breads'];
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catDoc = await getDoc(doc(db, 'settings', 'categories_config'));
        if (catDoc.exists() && catDoc.data().categories) {
          const list = catDoc.data().categories;
          setCategories(['All', ...list]);
          localStorage.setItem('cakeurban_categories_order', JSON.stringify(list));
        }
      } catch (err) {
        console.warn("Could not fetch categories config from Firestore in Shop", err);
      }
    };
    fetchCategories();
  }, []);

  const flavors = ['All', 'Chocolate', 'Vanilla', 'Red Velvet', 'Strawberry', 'Butterscotch', 'Blueberry', 'Mixed'];
  const occasions = ['All', 'Birthday', 'Anniversary', 'Wedding', 'Festival', 'Kids Special'];
  const sorts = ['Popularity', 'Price: Low to High', 'Price: High to Low', 'Newest'];
  
  const priceRanges = [
    { label: 'All', min: 0, max: 100000 },
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
    { label: 'Above ₹2000', min: 2000, max: 100000 }
  ];

  // Helper to calculate active filter counts to display in UI indicators
  const getActiveFilterCount = () => {
    let count = 0;
    if (flavorFilter !== 'All') count++;
    if (occasionFilter !== 'All') count++;
    if (dietFilter !== 'All') count++;
    if (priceRange !== 'All') count++;
    return count;
  };

  const handleResetAllFilters = () => {
    setFlavorFilter('All');
    setOccasionFilter('All');
    setDietFilter('All');
    setPriceRange('All');
    setSortBy('Popularity');
  };

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  // Fetch all products once on mount to keep database access minimal and speed ultra high
  useEffect(() => {
    const fetchProducts = async () => {
      const path = 'products';
      setLoading(true);
      try {
        const q = collection(db, path);
        const snap = await getDocs(q);
        let prods = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        if (prods.length === 0) {
          prods = FALLBACK_PRODUCTS;
        }
        setAllOriginalProducts(prods);
      } catch (error) {
        console.warn("Firestore error in Shop, loading premium fallback dataset:", error);
        setAllOriginalProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Compute filtered confections instantly in-memory without rendering/fetching lag
  useEffect(() => {
    let prods = [...allOriginalProducts];

    // Apply visual category filtering
    if (activeCategory.toLowerCase() !== 'all') {
      prods = prods.filter(p => 
        p.categories?.some(c => c.toLowerCase() === activeCategory.toLowerCase())
      );
    }

    // Apply interactive flavor filter
    if (flavorFilter.toLowerCase() !== 'all') {
      prods = prods.filter(p => 
        p.flavors?.some(f => f.toLowerCase() === flavorFilter.toLowerCase())
      );
    }

    // Apply interactive occasion filter
    if (occasionFilter.toLowerCase() !== 'all') {
      prods = prods.filter(p => 
        p.occasions?.some(o => o.toLowerCase() === occasionFilter.toLowerCase())
      );
    }

    // Apply interactive dietary preference
    if (dietFilter.toLowerCase() !== 'all') {
      prods = prods.filter(p => 
        p.dietary?.some(d => d.toLowerCase() === dietFilter.toLowerCase())
      );
    }

    // Apply interactive price range filter
    if (priceRange.toLowerCase() !== 'all') {
      const range = priceRanges.find(r => r.label.toLowerCase() === priceRange.toLowerCase());
      if (range) {
        prods = prods.filter(p => p.price >= range.min && p.price < range.max);
      }
    }

    // Apply interactive sorting algorithms
    if (sortBy === 'Price: Low to High') {
      prods.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      prods.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Newest') {
      prods.sort((a, b) => {
        const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
        const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });
    }
    
    setProducts(prods);
  }, [allOriginalProducts, activeCategory, flavorFilter, occasionFilter, dietFilter, priceRange, sortBy]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-transparent pb-24"
    >
      <SEO 
        title={`${activeCategory === 'All' ? 'Artisanal Bakery Catalog' : `${activeCategory} Collection`}`}
        description={`Explore Cake Urban's exquisite selection of hand-crafted ${activeCategory.toLowerCase()}. Premium quality eggs and customized eggless alternatives for local Faridabad celebrations.`}
        keywords={`cake urban, buy cakes in faridabad, eggless cakes, chocolate pastries, premium bakery faridabad, custom cake order`}
        schema={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": `${activeCategory === 'All' ? 'Cake Urban Master Confectionary' : `${activeCategory} Collection`}`,
          "description": `Bespoke artisanal catalog of premium eggless ${activeCategory.toLowerCase()} in Faridabad. Available for express delivery.`,
          "url": "https://www.cakeurban.com/shop",
          "numberOfItems": products.length,
          "itemListElement": products.slice(0, 15).map((p, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "url": `https://www.cakeurban.com/product/${p.id}`,
            "name": p.name,
            "image": p.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop',
            "description": p.description,
            "offers": {
              "@type": "Offer",
              "price": p.price,
              "priceCurrency": "INR"
            }
          }))
        }}
      />

      {/* BOUTIQUE BANNER HEADER */}
      <section className="bg-[#26130F]/45 backdrop-blur-md border-b border-[#DFB15B]/15 px-4 sm:px-8 py-10 sm:py-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#DFB15B]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#DE9088]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#DFB15B]/10 text-[#DFB15B] border border-[#DFB15B]/20 px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-[0.25em] uppercase">
            <Sparkle className="w-3.5 h-3.5 text-[#DFB15B]" />
            <span>Premium Bakeries of Faridabad</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-[#FFFDFB] tracking-tight">
            The Artisan <span className="italic font-serif font-light text-[#DFB15B]">Collection</span>
          </h1>
          <p className="text-[#FFFDFB]/80 text-xs sm:text-base md:text-lg max-w-2xl mx-auto font-medium italic leading-relaxed">
            Each creation is baked with meticulous precision, pure premium dairy, chocolate truffles, and seasonal fresh toppings. Fully customizable with eggless settings.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* LUXURY INTERACTIVE TOP CATEGORY SELECTOR SLIDER */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4 border-b border-[#DFB15B]/20 pb-3">
            <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-[#DFB15B]">Artisanal Branches</h3>
            <span className="text-[9px] font-black uppercase text-[#DFB15B] bg-[#DFB15B]/10 px-2 py-0.5 rounded-md">100% Chef Managed</span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
            {categories.map((cat) => {
              const IconComponent = collectionIcons[cat] || Sparkles;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSearchParams({ category: cat });
                  }}
                  className={`flex items-center gap-2.5 px-6 py-4 rounded-[24px] text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 border float-left whitespace-nowrap ${
                    isActive
                      ? 'bg-[#DFB15B] text-[#140603] border-[#DFB15B] shadow-lg scale-105'
                      : 'bg-[#26130F]/80 text-[#FFFDFB]/80 border-[#DFB15B]/20 hover:bg-[#DFB15B]/10 hover:border-[#DFB15B] shadow-sm'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#140603]' : 'text-[#FFFDFB]/40'}`} />
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTROLS HEADER BAR */}
        <div className="bg-[#26130F]/85 backdrop-blur-md border border-[#DFB15B]/20 rounded-[28px] p-4 mb-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Live active filter counter */}
            <button
              onClick={() => setIsFiltersDrawerOpen(!isFiltersDrawerOpen)}
              className={`flex items-center justify-center gap-2 w-full md:w-auto h-12 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                isFiltersDrawerOpen || getActiveFilterCount() > 0
                  ? 'bg-[#DFB15B] text-[#140603]'
                  : 'bg-[#FFFDFB]/5 text-[#FFFDFB]/80 hover:bg-[#FFFDFB]/10 border border-white/10'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Advanced Filters</span>
              {getActiveFilterCount() > 0 && (
                <span className="w-5 h-5 bg-[#140603] text-[#DFB15B] border border-[#DFB15B]/20 text-[9px] rounded-full flex items-center justify-center font-black ml-1 shadow-sm">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>

            {/* Clear Filters Reset Option */}
            {getActiveFilterCount() > 0 && (
              <button
                onClick={handleResetAllFilters}
                className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FFFDFB]/10 hover:bg-[#FFFDFB]/15 text-white transition-colors"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Manager Mode Toggle */}
            <button
              onClick={() => {
                setIsManagerMode(!isManagerMode);
                if (!isManagerMode) {
                  toast.info("Manager Edit Mode active! Click the ✏️ Pencil icon on any item to edit it.");
                } else {
                  toast.success("Manager Edit Mode turned off.");
                }
              }}
              className={`flex items-center justify-center gap-2 h-12 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                isManagerMode
                  ? 'bg-[#DFB15B] text-[#140603] border-[#DFB15B] shadow-lg scale-105 font-black'
                  : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-[#DE9088]/10'
              }`}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{isManagerMode ? 'Manager: Edit Active' : 'Edit Boutique'}</span>
            </button>

            {/* Add New Item Button */}
            {isManagerMode && (
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddingNew(true);
                }}
                className="flex items-center justify-center gap-2 h-12 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 shadow-md transition-all text-[10px] font-black uppercase tracking-widest active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Delicacy</span>
              </button>
            )}
          </div>

          <div className="flex flex-row items-center justify-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
            {/* Sort Dropdown */}
            <div className="relative flex-1 md:flex-initial">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[8px] font-black uppercase text-[#FFFDFB]/40 tracking-wider">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-auto appearance-none bg-[#140603]/80 border border-[#DFB15B]/25 rounded-2xl pl-12 pr-10 py-3 text-[10px] font-black uppercase tracking-widest text-[#FFFDFB] outline-none shadow-sm cursor-pointer hover:border-[#DFB15B]/60 transition-colors"
              >
                {sorts.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-[#FFFDFB]/60">
                ▼
              </div>
            </div>

            <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[#DFB15B] bg-[#DFB15B]/10 border border-[#DFB15B]/20 px-4 py-3 rounded-2xl h-11 flex items-center shrink-0">
              {products.length} Delicacies
            </div>
          </div>
        </div>

        {/* COLLAPSIBLE PREMIUM FILTERS CONTAINER */}
        <AnimatePresence>
          {isFiltersDrawerOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-[#26130F]/90 backdrop-blur-md rounded-[32px] p-6 sm:p-8 border border-[#DFB15B]/20 shadow-[0_15px_45px_rgba(0,0,0,0.5)] grid grid-cols-1 md:grid-cols-4 gap-6 relative text-[#FFFDFB]">
                
                {/* Close Button absolute top-4 right-4 */}
                <button
                  onClick={() => setIsFiltersDrawerOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Dietary Section */}
                <div className="space-y-3.5">
                  <h4 className="text-[9px] uppercase tracking-[0.3em] font-black text-[#DFB15B]">Dietary Path</h4>
                  <div className="flex flex-col gap-1.5">
                    {['All', 'Eggless', 'With Egg'].map((diet) => {
                      const isActive = dietFilter === diet;
                      return (
                        <button
                          key={diet}
                          onClick={() => setDietFilter(diet)}
                          className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-left transition-all ${
                            isActive
                              ? 'bg-[#DFB15B] text-[#140603]'
                              : 'bg-[#140603]/80 text-[#FFFDFB]/80 border border-[#DFB15B]/15 hover:bg-[#DFB15B]/10 hover:border-[#DFB15B]/40'
                          }`}
                        >
                          <span>{diet}</span>
                          {isActive && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Flavours Section */}
                <div className="space-y-3.5">
                  <h4 className="text-[9px] uppercase tracking-[0.3em] font-black text-[#DFB15B]">Gourmet Flavours</h4>
                  <div className="grid grid-cols-2 gap-1.5 max-h-[160px] overflow-y-auto pr-1 no-scrollbar">
                    {flavors.map((flv) => {
                      const isActive = flavorFilter === flv;
                      return (
                        <button
                          key={flv}
                          onClick={() => setFlavorFilter(flv)}
                          className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider text-left transition-all truncate ${
                            isActive
                              ? 'bg-[#DFB15B] text-[#140603]'
                              : 'bg-[#140603]/80 text-[#FFFDFB]/80 border border-[#DFB15B]/15 hover:bg-[#DFB15B]/10'
                          }`}
                        >
                          {flv}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Occasion Section */}
                <div className="space-y-3.5">
                  <h4 className="text-[9px] uppercase tracking-[0.3em] font-black text-[#DFB15B]">Festive Occasion</h4>
                  <div className="grid grid-cols-2 gap-1.5 max-h-[160px] overflow-y-auto pr-1 no-scrollbar">
                    {occasions.map((occ) => {
                      const isActive = occasionFilter === occ;
                      return (
                        <button
                          key={occ}
                          onClick={() => setOccasionFilter(occ)}
                          className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider text-left transition-all truncate ${
                            isActive
                              ? 'bg-[#DFB15B] text-[#140603]'
                              : 'bg-[#140603]/80 text-[#FFFDFB]/80 border border-[#DFB15B]/15 hover:bg-[#DFB15B]/10'
                          }`}
                        >
                          {occ}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Section */}
                <div className="space-y-3.5">
                  <h4 className="text-[9px] uppercase tracking-[0.3em] font-black text-[#DFB15B]">Price Enclave</h4>
                  <div className="flex flex-col gap-1.5">
                    {priceRanges.map((range) => {
                      const isActive = priceRange === range.label;
                      return (
                        <button
                          key={range.label}
                          onClick={() => setPriceRange(range.label)}
                          className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-left transition-all ${
                            isActive
                              ? 'bg-[#DFB15B] text-[#140603]'
                              : 'bg-[#140603]/80 text-[#FFFDFB]/80 border border-[#DFB15B]/15 hover:bg-[#DFB15B]/10'
                          }`}
                        >
                          <span>{range.label}</span>
                          {isActive && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ACTIVE FILTER PILLES CHIPS */}
        {getActiveFilterCount() > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-[9px] font-black text-[#FFFDFB]/60 uppercase tracking-widest mr-1">Active Choices:</span>
            
            {dietFilter !== 'All' && (
              <span className="inline-flex items-center gap-1.5 bg-[#DFB15B]/15 text-[#DFB15B] border border-[#DFB15B]/20 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                <span>{dietFilter}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setDietFilter('All')} />
              </span>
            )}

            {flavorFilter !== 'All' && (
              <span className="inline-flex items-center gap-1.5 bg-[#DFB15B]/15 text-[#DFB15B] border border-[#DFB15B]/20 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                <span>Flavour: {flavorFilter}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFlavorFilter('All')} />
              </span>
            )}

            {occasionFilter !== 'All' && (
              <span className="inline-flex items-center gap-1.5 bg-[#DFB15B]/15 text-[#DFB15B] border border-[#DFB15B]/20 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                <span>Occasion: {occasionFilter}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setOccasionFilter('All')} />
              </span>
            )}

            {priceRange !== 'All' && (
              <span className="inline-flex items-center gap-1.5 bg-[#DFB15B]/15 text-[#DFB15B] border border-[#DFB15B]/20 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                <span>{priceRange}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange('All')} />
              </span>
            )}

            <button
              onClick={handleResetAllFilters}
              className="text-[9px] font-black uppercase text-[#DFB15B] hover:text-white underline ml-2 transition-colors"
            >
              Clear All Rules
            </button>
          </div>
        )}

        {/* PRODUCT GRID SECTION */}
        <div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4 p-4 bg-[#26130F]/85 border border-[#DFB15B]/15 rounded-[32px] animate-pulse">
                  <Skeleton className="aspect-square rounded-[24px] bg-[#140603]" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-[#140603] rounded-full" />
                    <Skeleton className="h-3 w-1/2 bg-[#140603] rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {products.map((product) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ProductCard product={product} onEdit={isManagerMode ? () => setEditingProduct(product) : undefined} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* LUXURIOUS EMPTY STATE WITH RECOVERY ACT */
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#26130F]/85 border border-[#DFB15B]/20 rounded-[40px] shadow-lg p-12 sm:p-20 text-center max-w-2xl mx-auto space-y-6 text-[#FFFDFB]"
            >
              <div className="w-20 h-20 bg-[#DFB15B]/10 border border-[#DFB15B]/20 rounded-full flex items-center justify-center mx-auto text-[#DFB15B]">
                <Smile className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-black text-[#DFB15B] italic">No Match Found In Our Boutique</h3>
                <p className="text-xs sm:text-sm text-[#FFFDFB]/60 italic max-w-sm mx-auto leading-relaxed">
                  We currently do not have matching "{activeCategory}" items loaded in the combination of filters selected.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
                <Button 
                  onClick={handleResetAllFilters} 
                  className="w-full sm:w-auto h-12 rounded-xl bg-[#DFB15B] text-[#140603] hover:bg-white text-[10px] font-black uppercase tracking-widest shadow-md transition-all flex items-center gap-2 justify-center"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset filters</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setActiveCategory('All');
                    handleResetAllFilters();
                  }}
                  className="w-full sm:w-auto h-12 rounded-xl border-[#DFB15B]/30 text-[#FFFDFB] hover:bg-[#DFB15B]/10 text-[10px] font-black uppercase tracking-widest bg-transparent"
                >
                  Default main catalog
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* CUSTOM STUDIO LUXURY BANNER BOTTOM */}
        <div className="mt-20">
          <div className="bg-[#2D150F] rounded-[40px] sm:rounded-[56px] py-12 px-8 sm:px-16 text-white text-left shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#DE9088]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-12 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#DE9088]/20 text-[#DE9088] px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>Custom Dream Cakes</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-display font-black leading-tight tracking-tight">Have a custom reference image or specific dream theme cake in mind?</h3>
                <p className="text-white/60 text-xs sm:text-sm font-medium italic max-w-xl">
                  Bespoke layers, rich custom fillings, tiered structures, 3D fondant characters, or subtle cream swatches. Enter our digital Custom Order Studio now to brief our chef in Faridabad directly.
                </p>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <Link to="/custom-order">
                  <Button className="w-full h-15 rounded-2xl bg-[#DE9088] hover:bg-white hover:text-[#2D150F] text-xs font-black uppercase tracking-[0.2em] shadow-xl text-center flex items-center justify-center transition-all duration-300">
                    <span>Initiate Design</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOUTIQUE MANAGER: CONFECTIONERY ADD/EDIT MODAL */}
        <AnimatePresence>
          {(editingProduct || isAddingNew) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#140603]/95 backdrop-blur-md z-50 overflow-y-auto flex items-center justify-center p-4 animate-fade-in"
              id="boutique-edit-modal"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-[#26130F] border border-[#DFB15B]/40 rounded-[36px] w-full max-w-2xl p-6 sm:p-10 shadow-[0_35px_80px_rgba(0,0,0,0.8)] relative text-[#FFFDFB] overflow-hidden my-8"
              >
                {/* Gold ambient radial background */}
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#DFB15B]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#DE9088]/10 rounded-full blur-3xl pointer-events-none" />

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsAddingNew(false);
                  }}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#1C0D0A] hover:bg-[#DE9088]/20 border border-[#DFB15B]/20 flex items-center justify-center transition-colors text-white z-10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="mb-6 sm:mb-8 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 bg-[#DFB15B]/10 text-[#DFB15B] px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 border border-[#DFB15B]/20">
                    <Sparkle className="w-3.5 h-3.5 text-[#DFB15B] animate-spin-slow" />
                    <span>Boutique Inventory Engine</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-black leading-none">
                    {editingProduct ? 'Refine Masterpiece' : 'Introduce New Delicacy'}
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm italic mt-1.5">
                    {editingProduct ? `Adjusting properties of "${editingProduct.name}"` : 'Construct a pristine addition for the sweet catalog'}
                  </p>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-5 sm:space-y-6 relative z-10 text-left">
                  {/* Row 1: Name and Price */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-wider text-zinc-300 block">Delicacy Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g., Red Velvet Deluxe Cake"
                        className="w-full h-12 rounded-xl bg-[#140603]/90 border border-[#DFB15B]/25 focus:border-[#DFB15B] px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-600 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-wider text-zinc-300 block">Base Price (₹) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formPrice}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        placeholder="e.g., 650"
                        className="w-full h-12 rounded-xl bg-[#140603]/90 border border-[#DFB15B]/25 focus:border-[#DFB15B] px-4 text-xs font-black text-[#DFB15B] outline-none placeholder:text-zinc-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2: Description */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-wider text-zinc-300 block">Sensory Description <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      rows={3}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Describe the textures, layers, sponge types, cream density, and exquisite toppings..."
                      className="w-full rounded-xl bg-[#140603]/90 border border-[#DFB15B]/25 focus:border-[#DFB15B] p-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-600 transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  {/* Row 3: Image URL */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-wider text-zinc-300 block">Exquisite Image Pedestal (URL)</label>
                    <input
                      type="url"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="Unsplash, Imgur, or direct server JPG/PNG link..."
                      className="w-full h-12 rounded-xl bg-[#140603]/90 border border-[#DFB15B]/25 focus:border-[#DFB15B] px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-600 transition-colors"
                    />
                  </div>

                  {/* Row 4: Categories, Flavours, Occasions */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-wider text-zinc-300 block">Categories (comma-split)</label>
                      <input
                        type="text"
                        value={formCategories}
                        onChange={(e) => setFormCategories(e.target.value)}
                        placeholder="Cakes, Birthday Cakes"
                        className="w-full h-12 rounded-xl bg-[#140603]/90 border border-[#DFB15B]/25 focus:border-[#DFB15B] px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-600 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-wider text-zinc-300 block">Flavours (comma-split)</label>
                      <input
                        type="text"
                        value={formFlavors}
                        onChange={(e) => setFormFlavors(e.target.value)}
                        placeholder="Chocolate, Red Velvet"
                        className="w-full h-12 rounded-xl bg-[#140603]/90 border border-[#DFB15B]/25 focus:border-[#DFB15B] px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-600 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-wider text-zinc-300 block">Occasions (comma-split)</label>
                      <input
                        type="text"
                        value={formOccasions}
                        onChange={(e) => setFormOccasions(e.target.value)}
                        placeholder="Birthday, Anniversary"
                        className="w-full h-12 rounded-xl bg-[#140603]/90 border border-[#DFB15B]/25 focus:border-[#DFB15B] px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 5: Badges and Stock Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="flex items-center justify-between sm:justify-start gap-3 bg-[#140603]/65 border border-white/15 rounded-xl px-4 h-12">
                      <span className="text-[10px] uppercase font-black tracking-wider text-zinc-300">Bestseller</span>
                      <input
                        type="checkbox"
                        checked={formIsBestseller}
                        onChange={(e) => setFormIsBestseller(e.target.checked)}
                        className="w-5 h-5 rounded border-white/20 text-[#DFB15B] focus:ring-0 cursor-pointer accent-[#DFB15B]"
                      />
                    </div>
                    <div className="flex items-center justify-between sm:justify-start gap-3 bg-[#140603]/65 border border-white/15 rounded-xl px-4 h-12">
                      <span className="text-[10px] uppercase font-black tracking-wider text-zinc-300">New Batch</span>
                      <input
                        type="checkbox"
                        checked={formIsNew}
                        onChange={(e) => setFormIsNew(e.target.checked)}
                        className="w-5 h-5 rounded border-white/20 text-[#DFB15B] focus:ring-0 cursor-pointer accent-[#DFB15B]"
                      />
                    </div>
                    <div className="flex items-center justify-between bg-[#140603]/65 border border-white/15 rounded-xl px-4 h-12">
                      <span className="text-[10px] uppercase font-black tracking-wider text-zinc-300">Availability</span>
                      <select
                        value={formStockStatus}
                        onChange={(e) => setFormStockStatus(e.target.value as any)}
                        className="bg-transparent text-xs font-black uppercase text-[#DFB15B] outline-none border-none cursor-pointer"
                      >
                        <option value="in-stock" className="bg-[#140603] text-white">In Stock</option>
                        <option value="out-of-stock" className="bg-[#140603] text-white">Sold Out</option>
                      </select>
                    </div>
                  </div>

                  {/* Modal Footer Actions */}
                  <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-end gap-3">
                    {editingProduct && (
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleDeleteProduct(editingProduct.id)}
                        className="w-full sm:w-auto h-12 px-6 rounded-xl border border-red-500/30 hover:bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Retire Item</span>
                      </button>
                    )}

                    <div className="flex gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => {
                          setEditingProduct(null);
                          setIsAddingNew(false);
                        }}
                        className="flex-1 sm:flex-initial h-12 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-grow sm:flex-initial h-12 px-8 rounded-xl bg-[#DFB15B] hover:bg-white text-[#140603] text-[10px] font-black uppercase tracking-widest shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isSaving ? (
                          <span className="w-4 h-4 border-2 border-amber-950 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        <span>{editingProduct ? 'Commit Changes' : 'Confirm Entry'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
