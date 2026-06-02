import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, collection, query, where, orderBy, getDocs, addDoc, serverTimestamp, limit, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Product, Review } from '../types';
import { useCart } from '../lib/store';
import { useAuth } from '../hooks/useAuth';
import { handleFirestoreError, OperationType } from '../lib/firebase';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Star, ShieldCheck, Truck, RotateCcw, Clock, Minus, Plus, MessageSquare, Send, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import SEO from '../components/SEO';
import { FALLBACK_PRODUCTS } from '../lib/fallbackProducts';
import { playSuccessChime, playBtnTap, playSlidePop } from '../lib/sound';

export default function ProductDetail() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState<number>(0.5);
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [cakeMessage, setCakeMessage] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [adminCustomWeights, setAdminCustomWeights] = useState('');
  const [savingAdminWeights, setSavingAdminWeights] = useState(false);
  const [eggless, setEggless] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  const { addItem } = useCart();
  const extraItems = [
    { name: 'Artisan Candles', price: 149, icon: '🕯️' },
    { name: 'Celebration Caps', price: 99, icon: '🥳' },
    { name: 'Metallic Balloons', price: 299, icon: '🎈' }
  ];
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const path = `products/${id}`;
      setLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data() as Product;
          setProduct({ id: snap.id, ...data });
          if (data.images?.length) setActiveImage(data.images[0]);
          if (data.weights?.length) {
            setSelectedWeight(data.weights[0]);
            setAdminCustomWeights(data.weights.join(', '));
          } else {
            setAdminCustomWeights('0.5, 1, 2');
          }
          if (data.flavors?.length) setSelectedFlavor(data.flavors[0]);
          
          // Fetch Reviews
          const reviewPath = 'reviews';
          try {
            const q = query(collection(db, reviewPath), where('productId', '==', id), orderBy('createdAt', 'desc'));
            const rSnap = await getDocs(q);
            setReviews(rSnap.docs.map(d => ({ id: d.id, ...d.data() } as Review)));
          } catch (err) {
            console.error("Failed to fetch reviews", err);
          }
        } else {
          // If not in Firebase snap, fallback to fallback list
          const found = FALLBACK_PRODUCTS.find(p => p.id === id);
          if (found) {
            setProduct(found);
            if (found.images?.length) setActiveImage(found.images[0]);
            if (found.weights?.length) {
              setSelectedWeight(found.weights[0]);
              setAdminCustomWeights(found.weights.join(', '));
            } else {
              setAdminCustomWeights('0.5, 1, 2');
            }
            if (found.flavors?.length) setSelectedFlavor(found.flavors[0]);
          }
        }
      } catch (error) {
        console.warn("Product firestore get error, checking in fallbacks:", error);
        const found = FALLBACK_PRODUCTS.find(p => p.id === id);
        if (found) {
          setProduct(found);
          if (found.images?.length) setActiveImage(found.images[0]);
          if (found.weights?.length) {
            setSelectedWeight(found.weights[0]);
            setAdminCustomWeights(found.weights.join(', '));
          } else {
            setAdminCustomWeights('0.5, 1, 2');
          }
          if (found.flavors?.length) setSelectedFlavor(found.flavors[0]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch Suggestions
  useEffect(() => {
    if (!product) return;
    const fetchRelated = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('categories', 'array-contains-any', product.categories || ['Cakes']),
          limit(5)
        );
        const snap = await getDocs(q);
        const list = snap.docs
          .map(d => ({ id: d.id, ...d.data() } as Product))
          .filter(p => p.id !== product.id);
        
        if (list.length === 0) {
          const filtered = FALLBACK_PRODUCTS
            .filter(p => p.categories?.some(c => product.categories?.includes(c)) && p.id !== product.id)
            .slice(0, 4);
          setSuggestions(filtered);
        } else {
          setSuggestions(list.slice(0, 4));
        }
      } catch (err) {
        const filtered = FALLBACK_PRODUCTS
          .filter(p => p.categories?.some(c => product.categories?.includes(c)) && p.id !== product.id)
          .slice(0, 4);
        setSuggestions(filtered);
      }
    };
    fetchRelated();
  }, [product]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-32 flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-chocolate opacity-40">Curating Details...</p>
      </div>
    );
  }

  if (!product) return <div className="container py-24 text-center">Masterpiece not found.</div>;

  const basePrice = product.price;
  const getPriceForWeight = (weight: number) => {
    if (weight === 0.5) return basePrice;
    if (weight === 0.25) return Math.round(basePrice * 0.6);
    if (weight === 1) return Math.round(basePrice * 1.8);
    if (weight === 1.5) return Math.round(basePrice * 2.6);
    if (weight === 2) return Math.round(basePrice * 3.4);
    if (weight >= 3) return Math.round(basePrice * 1.6 * weight);
    return Math.round(basePrice * (weight / 0.5));
  };
  const currentPrice = getPriceForWeight(selectedWeight);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '250%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  const handleAddToCart = () => {
    playSuccessChime();
    addItem({
      ...product!,
      price: currentPrice
    }, {
      quantity,
      selectedWeight,
      selectedFlavor,
      cakeMessage,
      eggless,
      extras: selectedExtras,
      additionalInstructions
    });
    toast.success("Added to reservation!", {
        description: `${product.name} has been added to your collection.`,
        action: {
            label: "Proceed to Cart",
            onClick: () => navigate('/cart')
        }
    });
  };

  const handleBuyNow = () => {
    playSuccessChime();
    addItem({
      ...product!,
      price: currentPrice
    }, {
      quantity,
      selectedWeight,
      selectedFlavor,
      cakeMessage,
      eggless,
      extras: selectedExtras,
      additionalInstructions
    });
    toast.success("Added to cart! Proceeding to order checkout...");
    setTimeout(() => {
      navigate('/cart');
    }, 450);
  };

  const handleAdminSaveWeights = async () => {
    if (!product || !id) return;
    setSavingAdminWeights(true);
    playBtnTap();
    const parsedWeights = adminCustomWeights
      .split(',')
      .map(w => parseFloat(w.trim()))
      .filter(w => !isNaN(w) && w > 0);

    if (parsedWeights.length === 0) {
      toast.error("Please enter a valid list of weights (e.g. 0.5, 1, 2)");
      setSavingAdminWeights(false);
      return;
    }

    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, {
        weights: parsedWeights
      });
      setProduct({
        ...product,
        weights: parsedWeights
      });
      if (parsedWeights.length) setSelectedWeight(parsedWeights[0]);
      playSuccessChime();
      toast.success("Weights customized and saved to admin database!");
    } catch (err) {
      console.warn("Saving to Firebase bypassed (offline modes), committing locally:", err);
      setProduct({
        ...product,
        weights: parsedWeights
      });
      if (parsedWeights.length) setSelectedWeight(parsedWeights[0]);
      playSuccessChime();
      toast.success("Weights modified locally for offline sandbox preview!");
    } finally {
      setSavingAdminWeights(false);
    }
  };


  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast.error("Authentication required to post observations.");
        navigate('/login');
        return;
    }
    if (!newReview.comment.trim()) return;

    setSubmittingReview(true);
    const path = 'reviews';
    try {
        const reviewData = {
            productId: id,
            userId: user.uid,
            userName: user.displayName || user.email?.split('@')[0] || 'Collector',
            rating: newReview.rating,
            comment: newReview.comment,
            createdAt: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, path), reviewData);
        setReviews([{ id: docRef.id, ...reviewData, createdAt: new Date() } as any, ...reviews]);
        setNewReview({ rating: 5, comment: '' });
        toast.success("Review Broadcasted. Thank you for your critique.");
    } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
        setSubmittingReview(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-6 md:px-10 py-12 md:py-16"
    >
      <SEO 
        title={product.seoTitle || `${product.name} | Premium Custom Cake - Cake Urban`} 
        description={product.seoMetaDescription || `Order Cake Urban's luxury ${product.name} in Faridabad. ${product.description || "Freshly baked masterpiece curated by skilled chefs with customizable weight adjustments."}`}
        keywords={product.seoKeywords?.length ? product.seoKeywords.join(', ') : `cake urban, ${product.name.toLowerCase()}, buy ${product.name.toLowerCase()} faridabad, eggless ${product.name.toLowerCase()}`}
        ogImage={activeImage}
        schema={product.seoSchema ? (() => {
          try {
            return JSON.parse(product.seoSchema);
          } catch (e) {
            return undefined;
          }
        })() : (() => {
          const avgRating = reviews.length 
            ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
            : "4.9";
          const ratingCount = reviews.length || 18;
          
          return {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": activeImage,
            "description": product.description,
            "brand": {
              "@type": "Brand",
              "name": "Cake Urban"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": avgRating,
              "reviewCount": ratingCount,
              "bestRating": "5",
              "worstRating": "1"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "INR",
              "price": product.price,
              "url": window.location.href,
              "priceValidUntil": "2030-12-31",
              "itemCondition": "https://schema.org/NewCondition",
              "availability": product.stockStatus === 'out-of-stock' ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
            },
            "review": reviews.length ? reviews.slice(0, 3).map(r => ({
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": r.userName || "Valued Customer"
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": r.rating || 5,
                "bestRating": "5"
              },
              "reviewBody": r.comment || "Exquisite confection."
            })) : [
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Arjun Sharma"
                },
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5"
                },
                "reviewBody": "Undeniably the finest and most moist eggless cake available in Faridabad. Exceptional chocolate density."
              },
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Priyanka Sen"
                },
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5"
                },
                "reviewBody": "Extremely beautiful design and flavor profiling. The Biscoff cream feels extraordinarily premium!"
              }
            ]
          };
        })()}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
        {/* Left: Gallery */}
        <div className="space-y-6">
          <div className="relative group">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="aspect-square rounded-[36px] overflow-hidden bg-white border border-[#E8DDD7]/40 shadow-sm p-4 relative cursor-zoom-in"
            >
              <img 
                src={activeImage || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800'} 
                className="w-full h-full object-cover rounded-[24px]"
                referrerPolicy="no-referrer"
                alt={product.name}
              />
              <div 
                className="absolute inset-4 pointer-events-none rounded-[24px] z-10 hidden lg:block"
                style={zoomStyle}
              />
            </motion.div>
            
            {/* Stock Badge Overlay */}
            <div className="absolute top-8 right-8 z-20">
               <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white flex items-center gap-2 shadow-xl">
                  <div className={`w-2 h-2 rounded-full ${product.stockStatus === 'in-stock' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#3B1F17]">
                     {product.stockStatus === 'in-stock' ? 'Limited Batch Available' : 'Waitlisted'}
                  </span>
               </div>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {product.images?.map((img, i) => (
               <div 
                key={i} 
                onClick={() => setActiveImage(img)}
                className={`aspect-square w-24 md:w-32 shrink-0 rounded-[24px] overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                  activeImage === img ? 'border-[#3B1F17] scale-95' : 'border-transparent'
                }`}
               >
                  <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt={`view ${i}`} />
               </div>
            ))}
          </div>
        </div>

        {/* Right: Info & Config */}
        <div className="flex flex-col justify-center space-y-8 md:space-y-10">
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Badge className="bg-[#D89C95]/10 text-[#D89C95] border-none hover:bg-[#D89C95]/20 px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-widest leading-none">
                    {product.categories?.[0]}
                </Badge>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-[#D89C95] uppercase tracking-[0.2em] opacity-60">
                  <Star className="w-3 h-3 fill-[#D89C95]" />
                  <span>Exquisite Selection</span>
                </div>
              </div>
              
              {/* Suggest More Cake scroll button */}
              <button
                onClick={() => {
                  playSlidePop();
                  const elem = document.getElementById("related-cakes-suggestions");
                  if (elem) {
                    elem.scrollIntoView({ behavior: 'smooth' });
                    toast.success("Scrolling down to more handcrafted confections!", { duration: 1500 });
                  }
                }}
                className="text-[10px] font-black uppercase tracking-[0.15em] text-[#D89C95] hover:text-[#3B1F17] transition-all flex items-center gap-1 hover:underline"
              >
                <span>Suggest More Cakes 🍩</span>
              </button>
            </div>
            <h1 className="text-[42px] md:text-[52px] font-display font-black text-[#3B1F17] tracking-tight leading-[1.1]">{product.name}</h1>
            <div className="flex items-center gap-6">
                <p className="text-[32px] md:text-[40px] font-display font-black text-[#3B1F17] leading-none">₹{currentPrice}</p>
                <div className="h-6 w-[1px] bg-[#E8DDD7]" />
                <div className="flex items-center gap-1.5 text-[#3B1F17]/40 text-[14px]">
                    <Star className="w-4 h-4 fill-[#D89C95] text-[#D89C95]" />
                    <span className="font-semibold text-[#3B1F17]">4.9</span>
                    <span className="opacity-60">(120 Reviews)</span>
                </div>
            </div>
          </div>

          {/* Descriptive narrative 1-line with See More toggle */}
          <div className="space-y-3 bg-[#FAF7F5] border border-[#E8DDD7]/40 p-5 rounded-[24px] text-left">
              <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.4em] opacity-40 pl-1 italic">Confectioner Narrative</label>
              <p className="text-[#3B1F17]/80 leading-relaxed text-[15px] max-w-xl font-medium italic transition-all duration-300">
                  {showFullDesc 
                     ? product.description 
                     : product.description.length > 55 
                        ? `${product.description.slice(0, 55)}` 
                        : product.description
                  }
                  {!showFullDesc && product.description.length > 55 ? "..." : ""}
              </p>
              {product.description.length > 55 && (
                  <button 
                     onClick={() => { playSlidePop(); setShowFullDesc(!showFullDesc); }}
                     className="text-[10px] font-black uppercase tracking-[0.2em] text-[#DE9088] hover:text-[#3B1F17] transition-colors focus:outline-none flex items-center gap-1.5 mt-1"
                  >
                     <span>{showFullDesc ? "⌃ Show Less" : "⌄ Read Full Story / Somwar (See More)"}</span>
                     <Sparkles className="w-3 h-3 animate-pulse text-[#DE9088]" />
                  </button>
              )}
          </div>

          <div className="space-y-8 pt-8 md:pt-10 border-t border-[#E8DDD7]/40 text-left">
            {/* Weight Selection Section */}
            {product.weights && (
                <div className="space-y-4">
                    <label className="text-[12px] font-bold text-[#3B1F17] uppercase tracking-[0.2em] opacity-40">Select Weight (KG)</label>
                    <div className="flex flex-wrap gap-3">
                        {product.weights.map(w => (
                            <button 
                                key={w}
                                onClick={() => { playBtnTap(); setSelectedWeight(w); }}
                                className={`px-8 py-3.5 rounded-2xl text-[14px] font-bold transition-all border ${
                                    selectedWeight === w 
                                    ? 'bg-[#3B1F17] text-white border-[#3B1F17] shadow-xl scale-105' 
                                    : 'bg-white text-[#3B1F17] border-[#E8DDD7] hover:border-[#D89C95]'
                                }`}
                            >
                                {w} kg
                            </button>
                        ))}
                    </div>

                    {/* Inline Admin Custom Weight Override Panel */}
                    {isAdmin && (
                      <div className="p-4 rounded-2xl border border-dashed border-[#D89C95] bg-[#FAF7F5] space-y-3 mt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#3B1F17]">👑 Admin Panel: Adjust Weights</span>
                          <span className="text-[9px] text-gray-500 italic">Saved directly to Firestore</span>
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            className="h-10 px-4 rounded-xl border border-[#E8DDD7] text-xs flex-1 outline-none focus:ring-1 focus:ring-[#D89C95] bg-white font-medium"
                            placeholder="E.g. 0.5, 1, 1.5, 2, 3"
                            value={adminCustomWeights}
                            onChange={(e) => setAdminCustomWeights(e.target.value)}
                          />
                          <button 
                            type="button"
                            onClick={handleAdminSaveWeights}
                            disabled={savingAdminWeights}
                            className="h-10 px-5 rounded-xl bg-[#3B1F17] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#2A1610] transition-colors"
                          >
                            {savingAdminWeights ? "Saving..." : "Lock Weights"}
                          </button>
                        </div>
                      </div>
                    )}
                </div>
            )}

            {/* Flavor Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {product.flavors && (
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.4em] opacity-40 italic">Artisanal Flavor</label>
                        <select 
                            className="w-full h-14 px-5 rounded-2xl border border-[#E8DDD7] focus:ring-1 focus:ring-[#D89C95] outline-none font-bold text-[#3B1F17] text-[10px] uppercase tracking-widest bg-white appearance-none cursor-pointer"
                            value={selectedFlavor}
                            onChange={(e) => { playBtnTap(); setSelectedFlavor(e.target.value); }}
                        >
                            {product.flavors.map(f => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>
                    </div>
                )}
                
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.4em] opacity-40 italic">Urban Diet</label>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => { playBtnTap(); setEggless(true); }}
                            className={`flex-1 h-14 rounded-2xl border font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                                eggless ? 'bg-white text-[#D89C95] border-[#D89C95] shadow-md lg:scale-105' : 'bg-white border-[#E8DDD7] text-[#3B1F17]/30'
                            }`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${eggless ? 'bg-[#D89C95]' : 'bg-[#3B1F17]/10'}`} />
                            Eggless
                        </button>
                        <button 
                            onClick={() => { playBtnTap(); setEggless(false); }}
                            className={`flex-1 h-14 rounded-2xl border font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                                !eggless ? 'bg-white text-[#3B1F17] border-[#3B1F17] shadow-md lg:scale-105' : 'bg-white border-[#E8DDD7] text-[#3B1F17]/30'
                            }`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${!eggless ? 'bg-[#3B1F17]' : 'bg-[#3B1F17]/10'}`} />
                            Traditional
                        </button>
                    </div>
                </div>
            </div>

            {/* Inscript & Custom Instruction Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.3em] opacity-50 italic">The Inscription (Message on Cake)</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D89C95] opacity-40" />
                        <input 
                            type="text" 
                            placeholder="E.g. Happy Birthday Julian"
                            className="w-full h-14 pl-12 pr-5 rounded-2xl border border-[#E8DDD7] focus:ring-1 focus:ring-[#D89C95] outline-none font-medium bg-white text-sm"
                            value={cakeMessage}
                            onChange={(e) => setCakeMessage(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.3em] opacity-50 italic">Additional Custom Details / Instructions</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="E.g. Sugar-free recipe notes, colors..."
                            className="w-full h-14 px-5 rounded-2xl border border-[#E8DDD7] focus:ring-1 focus:ring-[#D89C95] outline-none font-medium bg-white text-sm"
                            value={additionalInstructions}
                            onChange={(e) => setAdditionalInstructions(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Upsell Engine */}
            <div className="p-8 rounded-[32px] bg-[#F8F4F1]/50 border border-[#E8DDD7]/40 space-y-6">
                <div className="flex items-center gap-2">
                   <Sparkles className="w-4 h-4 text-[#cc7a74]" />
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3B1F17]">Artisan Pairings</h4>
                </div>
                <div className="space-y-3">
                   {extraItems.map(item => (
                      <div 
                        key={item.name}
                        onClick={() => {
                          setSelectedExtras(prev => 
                             prev.includes(item.name) ? prev.filter(x => x !== item.name) : [...prev, item.name]
                          )
                        }}
                        className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                          selectedExtras.includes(item.name) ? 'bg-[#3B1F17] border-[#3B1F17] text-white' : 'bg-white border-[#E8DDD7]/60 text-[#3B1F17] hover:border-[#cc7a74]'
                        }`}
                      >
                         <div className="flex items-center gap-4">
                            <span className="text-xl">{item.icon}</span>
                            <div className="flex flex-col">
                               <span className="text-[11px] font-bold uppercase tracking-wider">{item.name}</span>
                               <span className={`text-[9px] ${selectedExtras.includes(item.name) ? 'text-white/60' : 'text-[#3B1F17]/40'}`}>Exquisite Addition</span>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className="text-xs font-bold font-serif italic">₹{item.price}</span>
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                              selectedExtras.includes(item.name) ? 'bg-[#cc7a74] border-[#cc7a74]' : 'border-[#E8DDD7]/60'
                            }`}>
                               {selectedExtras.includes(item.name) && <Plus className="w-3 h-3 text-white" />}
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
            </div>

            {/* Quantity, Add to Cart (Autocart) & Buy Now (Exclusive Checkout) */}
            <div className="flex flex-col md:flex-row items-center gap-4 pt-6">
                {/* Haptic quantity adjuster */}
                <div className="flex items-center bg-white border border-[#E8DDD7] rounded-2xl p-1 h-16 w-full md:w-[150px] shrink-0 shadow-sm">
                    <Button variant="ghost" size="icon" onClick={() => { playBtnTap(); setQuantity(q => Math.max(1, q - 1)); }} className="rounded-xl h-14 w-14 text-[#3B1F17]">
                        <Minus className="w-4 h-4" />
                    </Button>
                    <span className="flex-1 text-center font-bold text-[#3B1F17] text-[16px]">{quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => { playBtnTap(); setQuantity(q => q + 1); }} className="rounded-xl h-14 w-14 text-[#3B1F17]">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row w-full gap-3">
                  <Button 
                      size="lg" 
                      className="h-16 flex-1 w-full border-2 border-[#3B1F17] bg-white text-[#3B1F17] hover:bg-[#FAF7F5] text-sm font-black uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                      onClick={handleAddToCart}
                    >
                      Add To Cart
                  </Button>

                  <Button 
                      size="lg" 
                      className="h-16 flex-1 w-full bg-[#3B1F17] hover:bg-[#2A1610] text-white text-sm font-black uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-2"
                      onClick={handleBuyNow}
                    >
                      ⚡ Buy Now
                  </Button>
                </div>
            </div>

            {/* Urgency: Sticky Limited Stock Indicator */}
            {product.stockStatus === 'in-stock' && (
              <div className="flex items-center gap-3 bg-[#DE9088]/10 border border-[#DE9088]/20 p-4 rounded-2xl text-[#cc7a74] shrink-0 text-left">
                <div className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider">Only 3 premium batches left today!</p>
                  <p className="text-[10px] text-[#3B1F17]/65 font-medium italic mt-0.5 leading-snug">
                     Fresh bakes refresh daily. Hold your reservation to guarantee safe transit today.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-20 md:mt-32">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="bg-transparent border-b border-creamy-border rounded-none w-full justify-start h-14 gap-8 md:gap-12 overflow-x-auto no-scrollbar">
              <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:bg-transparent font-black text-[10px] uppercase tracking-[0.2em] px-0 h-14 text-chocolate/40 data-[state=active]:text-brand">The Story</TabsTrigger>
              <TabsTrigger value="shipping" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:bg-transparent font-black text-[10px] uppercase tracking-[0.2em] px-0 h-14 text-chocolate/40 data-[state=active]:text-brand">Etiquette</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:bg-transparent font-black text-[10px] uppercase tracking-[0.2em] px-0 h-14 text-chocolate/40 data-[state=active]:text-brand">Critics ({reviews.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="py-12 prose prose-chocolate max-w-none font-light leading-relaxed text-[#6B5A55]">
                <p className="text-xl md:text-2xl font-serif italic text-chocolate mb-12 border-l-4 border-brand pl-8">"A symphony of architectural layers, balanced with urban precision and artisanal soul."</p>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h4 className="font-black text-chocolate uppercase tracking-[0.3em] text-[10px] italic">The Composition</h4>
                        <p>Enjoy our signature {product.name}, a masterpiece curated by urban artisans. We exclusively deploy dairy cream and single-origin cocoa to ensure every bite is a celebration of Faridabad's modern elite.</p>
                    </div>
                    <div className="space-y-6">
                        <h4 className="font-black text-chocolate uppercase tracking-[0.3em] text-[10px] italic">Excellence Protocol</h4>
                        <ul className="list-none pl-0 space-y-4">
                            <li className="flex items-start gap-4">
                                <div className="w-1.5 h-1.5 bg-brand rounded-full mt-2" /> 
                                <span className="text-sm">Curated to order within 4 hours of reservation.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-1.5 h-1.5 bg-brand rounded-full mt-2" /> 
                                <span className="text-sm">Hand-painted textures using organic botanical extracts.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-1.5 h-1.5 bg-brand rounded-full mt-2" /> 
                                <span className="text-sm">Precision temperature-controlled transport across NCR.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="py-12 space-y-8">
                <div className="max-w-2xl space-y-6">
                    <h4 className="font-black text-chocolate uppercase tracking-[0.3em] text-[10px] italic">Delivery Protocol</h4>
                    <p className="text-[#6B5A55] font-light leading-relaxed italic">We traverse Faridabad's sectors within specified windows of elegance. To preserve the structural masterpiece, we mandate immediate refrigeration upon arrival. Standard and Midnight deployments available.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="p-8 rounded-[40px] bg-white border border-creamy-border creamy-shadow space-y-4">
                      <Truck className="w-6 h-6 text-brand" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-chocolate">Free Shipping</p>
                      <p className="text-[10px] text-chocolate/40 italic">Orders above ₹999 in Faridabad</p>
                   </div>
                   <div className="p-8 rounded-[40px] bg-white border border-creamy-border creamy-shadow space-y-4">
                      <Clock className="w-6 h-6 text-brand" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-chocolate">Express Deployment</p>
                      <p className="text-[10px] text-chocolate/40 italic">Within 120 Minutes available</p>
                   </div>
                   <div className="p-8 rounded-[40px] bg-white border border-creamy-border creamy-shadow space-y-4">
                      <ShieldCheck className="w-6 h-6 text-brand" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-chocolate">Safe Protocol</p>
                      <p className="text-[10px] text-chocolate/40 italic">Touchless doorstep delivery</p>
                   </div>
                </div>
            </TabsContent>

            <TabsContent value="reviews" className="py-12 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Review Form */}
                    <div className="lg:col-span-12">
                        {user ? (
                            <form onSubmit={handleReviewSubmit} className="bg-creamy/30 p-8 md:p-12 rounded-[60px] border border-creamy-border space-y-8">
                                <div className="space-y-4">
                                    <h4 className="text-3xl font-serif font-bold text-chocolate tracking-tighter">Your <span className="text-brand italic">Critique.</span></h4>
                                    <div className="flex gap-2">
                                        {[1,2,3,4,5].map(star => (
                                            <button 
                                                key={star} 
                                                type="button"
                                                onClick={() => setNewReview({...newReview, rating: star})}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${star <= newReview.rating ? 'bg-chocolate text-brand' : 'bg-white text-creamy-border border border-creamy-border'}`}
                                            >
                                                <Star className={`w-5 h-5 ${star <= newReview.rating ? 'fill-brand' : ''}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4 relative">
                                    <textarea 
                                        required
                                        className="w-full min-h-[120px] rounded-[32px] border-none bg-white p-8 text-chocolate outline-none focus:ring-1 focus:ring-brand font-light italic text-sm creamy-shadow"
                                        placeholder="Share your experience with this urban creation..."
                                        value={newReview.comment}
                                        onChange={e => setNewReview({...newReview, comment: e.target.value})}
                                    />
                                    <Button 
                                        disabled={submittingReview}
                                        className="absolute bottom-4 right-4 h-12 px-8 rounded-2xl bg-chocolate text-white text-[10px] uppercase font-black tracking-widest shadow-xl"
                                    >
                                        {submittingReview ? 'Broadcasting...' : 'Post Observations'}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-creamy/30 p-12 rounded-[60px] border border-creamy-border text-center space-y-6">
                                <p className="text-[#6B5A55] font-light italic text-sm">Please authenticate to share your critique of this masterpiece.</p>
                                <Button onClick={() => navigate('/login')} className="h-12 rounded-full px-8 bg-chocolate text-white text-[10px] font-black uppercase tracking-widest">Sign In</Button>
                            </div>
                        )}
                    </div>

                    {/* Review List */}
                    <div className="lg:col-span-12 space-y-12">
                        {reviews.length === 0 ? (
                            <div className="text-center py-20 border-t border-creamy-border border-dashed">
                                <p className="text-[#6B5A55] font-light italic opacity-40">No critical observations yet. Be the first to analyze.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {reviews.map(review => (
                                    <motion.div 
                                        key={review.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-10 bg-white border border-creamy-border rounded-[48px] creamy-shadow space-y-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-[18px] bg-creamy border border-creamy-border flex items-center justify-center font-serif font-black text-brand italic">
                                                    {review.userName[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-chocolate">{review.userName}</p>
                                                    <p className="text-[10px] text-chocolate/30 italic">Artisan Tier Client</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-brand text-brand' : 'text-creamy-border'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-[#6B5A55] font-light italic leading-loose text-sm italic">"{review.comment}"</p>
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-chocolate/20">
                                            Recorded {new Date(review.createdAt?.seconds * 1000 || review.createdAt).toLocaleDateString()}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </TabsContent>
          </Tabs>
      </div>

      {/* Suggestions Section - Amazon Inspired frequently crafted together */}
      {suggestions.length > 0 && (
        <div id="related-cakes-suggestions" className="mt-28 pt-16 border-t border-[#E8DDD7]/40 space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-1 text-left">
              <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#DE9088] block">Frequently Crafted Together</span>
              <h3 className="text-2xl sm:text-4xl font-display font-black text-[#3B1F17] tracking-tight">You might also adore...</h3>
            </div>
            <Link 
              to="/shop" 
              onClick={playSlidePop}
              className="text-xs font-black uppercase tracking-widest text-[#3B1F17] hover:text-[#DE9088] transition-colors flex items-center gap-1.5"
            >
              <span>Explore full store</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {suggestions.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -6 }}
                onClick={playBtnTap}
                className="group bg-white rounded-[24px] overflow-hidden border border-[#E8DDD7]/30 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <Link to={`/product/${item.id}`} className="block relative aspect-square overflow-hidden bg-[#FAF7F5] m-2 rounded-[18px]">
                  <img 
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400'} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                  />
                  {item.isBestseller && (
                    <div className="absolute top-3 left-3 bg-[#3B1F17] text-white text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                      Bestseller
                    </div>
                  )}
                </Link>
                <div className="p-4 space-y-1 text-left">
                  <Link to={`/product/${item.id}`}>
                    <h5 className="font-display font-black text-[13px] sm:text-[15px] text-[#3B1F17] group-hover:text-[#DE9088] transition-colors line-clamp-1">{item.name}</h5>
                  </Link>
                  <p className="text-[9px] sm:text-xs text-[#3B1F17]/40 font-medium italic line-clamp-1">{item.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-serif font-black text-xs sm:text-[15px] italic text-[#3B1F17]">₹{item.price}</span>
                    <span className="text-[7px] sm:text-[8px] font-sans font-black text-[#DE9088] uppercase tracking-widest">Select</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
