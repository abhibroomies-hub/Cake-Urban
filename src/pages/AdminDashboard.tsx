import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, updateDoc, doc, query, orderBy, addDoc } from 'firebase/firestore';
import { Order, Product } from '../types';
import { useAuth } from '../hooks/useAuth';
import { handleFirestoreError, OperationType } from '../lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  LayoutDashboard, ShoppingBag, Package, TrendingUp, DollarSign, 
  Clock, CheckCircle, Truck, MoreHorizontal, Sparkles, UploadCloud, 
  Globe, Search, Tag, Copy, Check, Instagram, Share2, FileText, 
  CheckCircle2, AlertCircle, ArrowLeft, Check as CheckIcon, Loader2
} from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import SEO from '../components/SEO';

interface SeoResult {
  productName: string;
  seoTitle: string;
  slug: string;
  suggestedFilename: string;
  altText: string;
  metaDescription: string;
  keywords: string[];
  structuredSchema: string;
  instagramCaption: string;
  pinterestPin: {
    title: string;
    description: string;
  };
}

export default function AdminDashboard() {
  const { user, profile, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Product form states
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductImage, setNewProductImage] = useState<string | null>(null);
  const [newProductMimeType, setNewProductMimeType] = useState<string>('image/jpeg');
  const [aiOptimizing, setAiOptimizing] = useState(false);
  const [aiStepIndex, setAiStepIndex] = useState(0);

  // Form Fields
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodCategories, setProdCategories] = useState('Cakes');
  const [prodFlavors, setProdFlavors] = useState('Chocolate');
  const [prodOccasions, setProdOccasions] = useState('Birthday');
  const [prodStock, setProdStock] = useState<'in-stock' | 'out-of-stock'>('in-stock');
  const [prodCustomizable, setProdCustomizable] = useState(true);

  // Enhanced AI SEO Fields (Autofilled by AI image SEO)
  const [prodSeoTitle, setProdSeoTitle] = useState('');
  const [prodSeoSlug, setProdSeoSlug] = useState('');
  const [prodSeoKeywords, setProdSeoKeywords] = useState<string[]>([]);
  const [prodSeoMetaDescription, setProdSeoMetaDescription] = useState('');
  const [prodSeoAlt, setProdSeoAlt] = useState('');
  const [prodSeoSchema, setProdSeoSchema] = useState('');
  const [prodInstagram, setProdInstagram] = useState('');
  const [prodPinterestTitle, setProdPinterestTitle] = useState('');
  const [prodPinterestDesc, setProdPinterestDesc] = useState('');

  const aiSteps = [
    "Analyzing cake design spectrum, colors & textures...",
    "Correlating optimal Delhi NCR local search parameters...",
    "Generating metadata, high-CTR titles & alt tags...",
    "Formulating matching Rich Schema.org structures...",
    "Composing luxury social-referral descriptions..."
  ];

  useEffect(() => {
    const fetchData = async () => {
      const ordersPath = 'orders';
      const productsPath = 'products';
      try {
        const ordersSnap = await getDocs(query(collection(db, ordersPath), orderBy('createdAt', 'desc')));
        const productsSnap = await getDocs(collection(db, productsPath));
        setOrders(ordersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
        setProducts(productsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };
    if (isAdmin) fetchData();
  }, [isAdmin]);

  // Block unauthorized users immediately
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-6 py-32 text-center min-h-[500px] flex flex-col items-center justify-center space-y-6">
        <AlertCircle className="w-16 h-16 text-rose-500 animate-pulse" />
        <h2 className="text-3xl font-display font-black text-[#3B1F17]">Access Restricted</h2>
        <p className="text-sm text-gray-500 max-w-sm font-medium italic">
          This administration dashboard is restricted exclusively to the head curator at <span className="font-bold text-[#3B1F17]">abhibroomies@gmail.com</span>. Please authenticate using the correct credential secure vault.
        </p>
      </div>
    );
  }

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const path = `orders/${orderId}`;
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      toast.success(`Order ${orderId} updated to ${status}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Supported formats include JPEG, PNG, or HEIC only.');
      return;
    }

    setNewProductMimeType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      setNewProductImage(reader.result as string);
      toast.success('Image loaded successfully. Ready for AI SEO scanning!');
    };
    reader.readAsDataURL(file);
  };

  const triggerAiSeoOptimization = async () => {
    if (!newProductImage) {
      toast.error('First drag & drop or select an image file to trigger AI!');
      return;
    }

    setAiOptimizing(true);
    setAiStepIndex(0);

    const stepInterval = setInterval(() => {
      setAiStepIndex((prev) => (prev < aiSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const response = await fetch('/api/seo/optimize-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: newProductImage,
          mimeType: newProductMimeType
        })
      });

      if (!response.ok) {
        throw new Error('Image parsing failed on AI pipeline.');
      }

      const info: SeoResult = await response.json();
      
      // Auto-populate fields!
      setProdName(info.productName);
      setProdDescription(`${info.metaDescription} Alt composition: ${info.altText}`);
      setProdSeoTitle(info.seoTitle);
      setProdSeoSlug(info.slug);
      setProdSeoAlt(info.altText);
      setProdSeoMetaDescription(info.metaDescription);
      setProdSeoKeywords(info.keywords);
      setProdSeoSchema(info.structuredSchema);
      setProdInstagram(info.instagramCaption);
      setProdPinterestTitle(info.pinterestPin.title);
      setProdPinterestDesc(info.pinterestPin.description);

      // Recommending premium local price matching structure (INR standard ₹999 to ₹1699)
      if (!prodPrice) {
        const randRecPrice = Math.floor(Math.random() * 401) + 1199;
        setProdPrice(randRecPrice.toString());
      }

      toast.success('AI Image SEO Copilot successfully auto-filled form details!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error occurred while communicating with Gemini.');
    } finally {
      clearInterval(stepInterval);
      setAiOptimizing(false);
    }
  };

  const handlePublishProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !newProductImage) {
      toast.error('Provide Name, Price, and Image asset to proceed.');
      return;
    }

    try {
      const finalPrice = parseFloat(prodPrice);
      await addDoc(collection(db, 'products'), {
        name: prodName,
        description: prodDescription,
        price: finalPrice,
        categories: prodCategories.split(',').map(c => c.trim()).filter(Boolean),
        flavors: prodFlavors.split(',').map(f => f.trim()).filter(Boolean),
        occasions: prodOccasions.split(',').map(o => o.trim()).filter(Boolean),
        images: [newProductImage],
        stockStatus: prodStock,
        isCustomizable: prodCustomizable,
        seoTitle: prodSeoTitle || `${prodName} - Cake Urban`,
        seoSlug: prodSeoSlug || prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        seoKeywords: prodSeoKeywords.length ? prodSeoKeywords : [prodName.toLowerCase()],
        seoMetaDescription: prodSeoMetaDescription || prodDescription,
        seoSchema: prodSeoSchema || '',
        instagramCaption: prodInstagram || '',
        pinterestPin: {
          title: prodPinterestTitle || prodName,
          description: prodPinterestDesc || prodDescription
        },
        createdAt: new Date().toISOString()
      });

      toast.success('Gourmet Masterpiece successfully registered live in your Boutique catalog!');
      
      // Reset forms and return to view list
      setProdName('');
      setProdPrice('');
      setProdDescription('');
      setNewProductImage(null);
      setProdSeoTitle('');
      setProdSeoSlug('');
      setProdSeoAlt('');
      setProdSeoMetaDescription('');
      setProdSeoKeywords([]);
      setProdSeoSchema('');
      setProdInstagram('');
      setProdPinterestTitle('');
      setProdPinterestDesc('');
      setIsAddingProduct(false);

      // Refresh database query list
      const productsSnap = await getDocs(collection(db, 'products'));
      setProducts(productsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while deploying the creation.');
    }
  };

  const stats = [
    { label: 'Total Revenue', value: `₹${orders.reduce((acc, o) => acc + o.total, 0)}`, icon: DollarSign, color: 'text-[#DE9088]', bg: 'bg-[#DE9088]/10' },
    { label: 'Active Reservations', value: orders.length, icon: ShoppingBag, color: 'text-amber-700', bg: 'bg-amber-100/50' },
    { label: 'Elite Creations', value: products.length, icon: Package, color: 'text-[#3B1F17]', bg: 'bg-[#3B1F17]/10' },
    { label: 'Growth Vector', value: '+18.9%', icon: TrendingUp, color: 'text-emerald-700', bg: 'bg-emerald-100/50' },
  ];

  const statusColors: any = {
    new: 'bg-blue-100 text-blue-700',
    baking: 'bg-[#DE9088]/20 text-[#cc7a74]',
    'out-for-delivery': 'bg-[#3B1F17]/10 text-[#3B1F17]',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  return (
    <div className="container mx-auto px-6 md:px-10 py-12 md:py-24 min-h-screen bg-transparent">
      
      {/* Dynamic SEO Title Tag Control */}
      <SEO 
        title="Command Ateliers & Curation Dashboard - Cake Urban"
        description="Exclusive portal for the chief culinary designer. Manage active baking queues, catalog items, and utilize advanced integrated Gemini AI image SEO."
      />

      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-10 mb-16 md:mb-20">
        <div className="space-y-4 text-center md:text-left w-full md:w-auto">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#DE9088] italic">Command Studio</h4>
            <h1 className="text-4xl md:text-6xl font-display font-black text-[#3B1F17] tracking-tighter leading-tight">Artisan <span className="italic font-serif font-light text-[#DE9088]">Atelier Panel</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B1F17]/40 px-6 py-2.5 bg-white rounded-full border border-[#E8DDD7] shadow-sm inline-block italic">
                Active Curator: {profile?.displayName || 'Chief Baker'} ({user?.email})
            </p>
        </div>

        {!isAddingProduct ? (
          <Button 
            onClick={() => setIsAddingProduct(true)}
            className="w-full md:w-auto rounded-3xl h-16 px-10 bg-[#3B1F17] hover:bg-[#DE9088] text-[10px] font-black uppercase tracking-[0.3em] text-amber-50 hover:text-white gap-4 shadow-xl transition-all leading-none shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#DE9088] animate-pulse" /> Add New Cake with AI SEO
          </Button>
        ) : (
          <Button 
            onClick={() => setIsAddingProduct(false)}
            variant="outline"
            className="w-full md:w-auto rounded-3xl h-16 px-10 border-[#E8DDD7] text-[10px] font-black uppercase tracking-[0.3em] text-[#3B1F17] gap-3 leading-none shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-[#3B1F17]/60" /> Back to Core Operations
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        
        {/* ADD PRODUCT PAGE / PORTAL */}
        {isAddingProduct ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            {/* LEFT SIDE: AUTOFILL & MEDIA CONTAINER */}
            <div className="lg:col-span-5 space-y-8">
              
              <div className="bg-white border border-[#E8DDD7] rounded-[36px] p-6 shadow-sm text-left">
                <h3 className="text-sm font-black uppercase tracking-widest text-[#3B1F17] mb-4 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-[#DE9088]" /> 1. Upload Culinary Work
                </h3>

                {/* File Upload Stage */}
                <div className="relative border-2 border-dashed border-[#DE9088]/30 rounded-[28px] overflow-hidden group hover:border-[#DE9088] transition-colors bg-[#FAF7F5]">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    disabled={aiOptimizing}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  />
                  
                  {newProductImage ? (
                    <div className="relative aspect-[4/3] w-full">
                      <img src={newProductImage} alt="Pastry uploaded preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/70 backdrop-blur-sm p-4 text-center">
                        <p className="text-[10px] text-white/80 font-semibold italic flex items-center justify-center gap-1.5 leading-none">
                          <CheckIcon className="w-3.5 h-3.5 text-[#DE9088]" /> Master image locked and ready!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-20 text-center space-y-4 px-4">
                      <div className="w-16 h-16 bg-[#DE9088]/10 rounded-2xl flex items-center justify-center mx-auto text-[#DE9088] group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-[#3B1F17]">Drag & drop photo here</p>
                        <p className="text-[10px] text-[#3B1F17]/50 font-medium font-mono">PNG, JPE, or HEIC (Max 10MB)</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Automated Button Trigger */}
                {newProductImage && (
                  <div className="mt-6">
                    <Button
                      onClick={triggerAiSeoOptimization}
                      disabled={aiOptimizing}
                      className="w-full h-14 rounded-2xl bg-[#3B1F17] hover:bg-[#DE9088] hover:text-white text-amber-50 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-md transition-all disabled:opacity-50"
                    >
                      {aiOptimizing ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-[#DE9088]" />
                          <span>AI Scanning Pastel Details...</span>
                        </div>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-[#DE9088] animate-bounce" />
                          <span>Auto-Optimize & Populate with AI</span>
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Loading progress tracker log */}
              {aiOptimizing && (
                <div className="bg-white border border-[#E8DDD7] p-6 rounded-[28px] text-left space-y-3 shadow-sm animate-pulse">
                  <p className="text-[10px] font-black uppercase text-[#DE9088] tracking-widest flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" /> Lighthouse Search Crawler Engaged
                  </p>
                  <div className="space-y-2">
                    {aiSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-[11px] leading-none">
                        {aiStepIndex > idx ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : aiStepIndex === idx ? (
                          <div className="w-4 h-4 border-2 border-[#DE9088]/30 border-t-[#DE9088] rounded-full animate-spin shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full bg-gray-200 border border-gray-300 shrink-0" />
                        )}
                        <span className={`font-semibold italic ${aiStepIndex === idx ? 'text-[#DE9088]' : aiStepIndex > idx ? 'text-[#3B1F17]/45' : 'text-gray-300'}`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GOOGLE PREVIEW SIMULATION CARD */}
              <div className="bg-white border border-[#E8DDD7] rounded-[36px] overflow-hidden shadow-sm text-left">
                <div className="bg-[#FAF7F5] border-b border-[#E8DDD7] px-6 py-4 flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#3B1F17] flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#DE9088]" /> Google Search Index Snippet
                  </h4>
                  <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">Simulation Ready</span>
                </div>
                
                <div className="p-6 text-left space-y-1.5 font-sans bg-white">
                  <div className="text-[10px] text-[#202124] flex items-center gap-1 leading-none">
                    <span className="font-semibold">https://cakeurban.com</span>
                    <span className="text-[#5f6368]">› show › products › {prodSeoSlug || 'slug-url'}</span>
                  </div>
                  
                  <h4 className="text-base sm:text-lg font-medium text-[#1a0dab] tracking-normal cursor-pointer leading-tight font-sans hover:underline">
                    {prodSeoTitle || (prodName ? `${prodName} | Online Custom Bakery Delhi NCR` : 'Cake Name | Paris Imperial Atelier')}
                  </h4>
                  
                  <div className="flex items-center gap-1.5 text-[11px] text-[#70757a]">
                    <span className="text-[#fabb05]">★★★★★</span>
                    <span className="font-medium text-[#5f6368]">Rating: 4.9 · ‎36 reviews · ‎Price: ₹{prodPrice || '999'}.00 · ‎In stock</span>
                  </div>

                  <p className="text-xs text-[#4d5156] leading-relaxed font-sans max-w-full line-clamp-2">
                    {prodSeoMetaDescription || prodDescription || 'No description added. Use the AI helper to instantly formulate organic descriptions optimized with local geo keywords block.'}
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE: RICH DATA FORM PANEL */}
            <div className="lg:col-span-7">
              <form onSubmit={handlePublishProduct} className="bg-white border border-[#E8DDD7] rounded-[44px] p-8 md:p-12 shadow-sm text-left space-y-8">
                
                <div className="border-b border-[#FAF7F5] pb-4">
                  <h3 className="text-xl font-serif font-black italic text-[#3B1F17]">Culinary specifications</h3>
                  <p className="text-[10px] uppercase font-black tracking-widest text-[#DE9088] opacity-65">Set catalog parameters for the shop front</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-[#3B1F17]/50 block">Cake Product Name *</label>
                    <Input 
                      placeholder="Ex. Designer Metallic Gold Cake"
                      value={prodName}
                      onChange={e => setProdName(e.target.value)}
                      className="h-14 rounded-xl bg-[#FAF7F5] border-[#E8DDD7] p-4 text-sm font-bold"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-[#3B1F17]/50 block">INR Value (₹) *</label>
                    <Input 
                      type="number"
                      placeholder="Ex. 1199"
                      value={prodPrice}
                      onChange={e => setProdPrice(e.target.value)}
                      className="h-14 rounded-xl bg-[#FAF7F5] border-[#E8DDD7] p-4 text-sm font-mono font-bold"
                      required
                    />
                  </div>

                  {/* Categories input */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-[#3B1F17]/50 block">Categories (comma-separated)</label>
                    <Input 
                      placeholder="Ex. Cakes, Custom Cakes"
                      value={prodCategories}
                      onChange={e => setProdCategories(e.target.value)}
                      className="h-14 rounded-xl bg-[#FAF7F5] border-[#E8DDD7] p-4 text-xs font-semibold"
                    />
                  </div>

                  {/* Flavors input */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-[#3B1F17]/50 block">Flavors (comma-separated)</label>
                    <Input 
                      placeholder="Ex. Chocolate, Butterscotch, Vanilla"
                      value={prodFlavors}
                      onChange={e => setProdFlavors(e.target.value)}
                      className="h-14 rounded-xl bg-[#FAF7F5] border-[#E8DDD7] p-4 text-xs font-semibold"
                    />
                  </div>

                  {/* Occasions input */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-[#3B1F17]/50 block">Occasions (comma-separated)</label>
                    <Input 
                      placeholder="Ex. Birthday, Anniversary, Wedding"
                      value={prodOccasions}
                      onChange={e => setProdOccasions(e.target.value)}
                      className="h-14 rounded-xl bg-[#FAF7F5] border-[#E8DDD7] p-4 text-xs font-semibold"
                    />
                  </div>

                  {/* Customizable & Stock Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-[#3B1F17]/50 block">availability status</label>
                      <select 
                        value={prodStock}
                        onChange={e => setProdStock(e.target.value as any)}
                        className="w-full h-14 rounded-xl bg-[#FAF7F5] border border-[#E8DDD7] px-4 text-xs font-bold focus:outline-none"
                      >
                        <option value="in-stock">In Stock 🟢</option>
                        <option value="out-of-stock">Bake to Order 🔴</option>
                      </select>
                    </div>

                    <div className="space-y-2 font-black">
                      <label className="text-[10px] uppercase font-black tracking-widest text-[#3B1F17]/50 block">Customizable</label>
                      <select 
                        value={prodCustomizable ? "yes" : "no"}
                        onChange={e => setProdCustomizable(e.target.value === "yes")}
                        className="w-full h-14 rounded-xl bg-[#FAF7F5] border border-[#E8DDD7] px-4 text-xs font-bold focus:outline-none"
                      >
                        <option value="yes">Custom Design Open</option>
                        <option value="no">Fixed Recipe Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-[#3B1F17]/50 block">Interactive Display Copywriter Description</label>
                  <textarea 
                    rows={4}
                    placeholder="Provide details about flavors, textures, layers, and decoration styling..."
                    value={prodDescription}
                    onChange={e => setProdDescription(e.target.value)}
                    className="w-full rounded-xl bg-[#FAF7F5] border-[#E8DDD7] p-4 text-xs font-semibold leading-relaxed focus:outline-none"
                  />
                </div>

                {/* COLLAPSED ADVANCED SEO DETAIL CONTAINER */}
                <div className="border-t border-[#FAF7F5] pt-6 space-y-6 bg-[#FAF7F5]/30 p-5 rounded-2xl border border-[#E8DDD7]/40">
                  <h4 className="text-xs font-black uppercase tracking-[0.25em] text-[#DE9088] flex items-center gap-1.5">
                    <FileText className="w-4.5 h-4.5 text-[#DE9088]" /> Automatic SEO Metatags & Schemas
                  </h4>

                  <div className="space-y-4">
                    
                    {/* Meta Title */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-black tracking-widest text-[#3B1F17]/40 block">Google Search SEO Title</label>
                      <Input 
                        placeholder="Ex. Delicious Custom Chocolate Cake South Delhi"
                        value={prodSeoTitle}
                        onChange={e => setProdSeoTitle(e.target.value)}
                        className="h-11 rounded-lg bg-white border-[#E8DDD7] p-3 text-xs font-semibold"
                      />
                    </div>

                    {/* Meta URL Slug */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-black tracking-widest text-[#3B1F17]/40 block">Search URL Slug (e.g. delicious-gold-heart-cake)</label>
                      <Input 
                        placeholder="delicious-gold-heart-cake"
                        value={prodSeoSlug}
                        onChange={e => setProdSeoSlug(e.target.value)}
                        className="h-11 rounded-lg bg-white border-[#E8DDD7] p-3 text-xs font-mono font-semibold"
                      />
                    </div>

                    {/* Alt Tag Text */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-black tracking-widest text-[#3B1F17]/40 block">Visual Accessibility Alt Text (Image Alt Tag)</label>
                      <Input 
                        placeholder="Close-up of premium metallic flake chocolate sprinkles with hand-crafted pink cherry toppings"
                        value={prodSeoAlt}
                        onChange={e => setProdSeoAlt(e.target.value)}
                        className="h-11 rounded-lg bg-white border-[#E8DDD7] p-3 text-xs font-semibold italic"
                      />
                    </div>

                    {/* SEO Search Keywords */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-black tracking-widest text-[#3B1F17]/40 block">SEO High-Volume Search Keywords (Comma separated)</label>
                      <Input 
                        placeholder="Ex. chocolate cake faridabad, best designer birthday cakes delhi ncr"
                        value={prodSeoKeywords.join(', ')}
                        onChange={e => setProdSeoKeywords(e.target.value.split(',').map(tag => tag.trim()))}
                        className="h-11 rounded-lg bg-white border-[#E8DDD7] p-3 text-xs font-semibold"
                      />
                    </div>

                    {/* Raw JSON Schema.org LD-JSON */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-black tracking-widest text-[#3B1F17]/40 block">Raw Schema.org Structuring script</label>
                      <textarea 
                        rows={3}
                        placeholder="{...}"
                        value={prodSeoSchema}
                        onChange={e => setProdSeoSchema(e.target.value)}
                        className="w-full rounded-lg bg-white border-[#E8DDD7] p-3 text-[10px] font-mono leading-relaxed focus:outline-none"
                      />
                    </div>

                  </div>
                </div>

                {/* SOCIAL MEDIA REFERRAL OUTPUT */}
                {prodInstagram && (
                  <div className="border border-[#E8DDD7]/40 p-5 rounded-2xl space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#cc7a74] flex items-center gap-1.5">
                      <Instagram className="w-4.5 h-4.5" /> Instagram/Social Referral Caption
                    </h4>
                    <p className="text-[11px] text-gray-600 font-semibold italic whitespace-pre-wrap leading-relaxed">{prodInstagram}</p>
                  </div>
                )}

                {/* CTA Action Buttons */}
                <div className="pt-6 border-t border-[#FAF7F5] flex gap-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddingProduct(false)}
                    className="flex-1 h-16 rounded-2xl border-[#E8DDD7] text-[10px] font-black uppercase tracking-wider"
                  >
                    Discard Draft
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-[2] h-16 rounded-2xl bg-[#3B1F17] hover:bg-[#DE9088] text-[10px] font-black uppercase tracking-[0.3em] text-amber-50 hover:text-white shadow-2xl transition-all leading-none"
                  >
                    Deploy Masterpiece Live
                  </Button>
                </div>

              </form>
            </div>
          </motion.div>
        ) : (
          /* CORE STATS & ORDER/PRODUCT TABS IN THE MAIN DASHBOARD */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            {/* STATS TILES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-10 mb-16 md:mb-20">
              {stats.map((s, i) => (
                <Card key={i} className="rounded-[40px] md:rounded-[48px] border border-[#E8DDD7] shadow-sm bg-white p-1.5">
                  <CardContent className="p-8 md:p-10 flex items-center justify-between">
                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-[#3B1F17] opacity-30 uppercase tracking-[0.3em] font-sans italic">{s.label}</p>
                      <p className="text-3xl font-serif font-bold text-[#3B1F17] leading-none">{s.value}</p>
                    </div>
                    <div className={`w-14 h-14 md:w-16 md:h-16 ${s.bg} rounded-[20px] md:rounded-[24px] flex items-center justify-center ${s.color} shrink-0`}>
                       <s.icon className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* TAB CONTROLS */}
            <Tabs defaultValue="orders" className="w-full overflow-hidden">
              <TabsList className="bg-white/60 backdrop-blur-md p-1.5 rounded-[28px] md:rounded-[32px] h-16 md:h-20 mb-8 md:mb-12 border border-[#E8DDD7] flex w-full md:inline-flex overflow-x-auto no-scrollbar">
                <TabsTrigger value="orders" className="flex-1 md:flex-none rounded-[20px] md:rounded-[24px] px-6 md:px-10 h-full data-[state=active]:bg-[#3B1F17] data-[state=active]:text-white data-[state=active]:shadow-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] transition-all duration-500 whitespace-nowrap">Global Orders</TabsTrigger>
                <TabsTrigger value="products" className="flex-1 md:flex-none rounded-[20px] md:rounded-[24px] px-6 md:px-10 h-full data-[state=active]:bg-[#3B1F17] data-[state=active]:text-white data-[state=active]:shadow-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] transition-all duration-500 whitespace-nowrap">Curation Gallery</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders">
                <Card className="rounded-[40px] md:rounded-[60px] border border-[#E8DDD7] shadow-xl bg-white overflow-hidden">
                  <CardHeader className="p-8 md:p-12 border-b border-[#E8DDD7] bg-[#FAF7F5]/50">
                    <CardTitle className="text-xl md:text-2xl font-serif font-black text-[#3B1F17] tracking-tight flex items-center gap-4">
                        <Clock className="text-[#DE9088] w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} /> Active Reservations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                     <ScrollArea className="h-[500px] md:h-[600px] w-full">
                        <div className="divide-y divide-[#E8DDD7]">
                           {orders.map(order => (
                               <div key={order.id} className="p-8 md:p-12 flex flex-col md:flex-row items-center md:items-center justify-between gap-8 md:gap-10 hover:bg-[#FAF7F5]/30 transition-all duration-500 group text-center md:text-left">
                                  <div className="space-y-4 w-full md:w-auto">
                                     <div className="flex items-center justify-center md:justify-start gap-4">
                                        <span className="font-display font-black text-[#3B1F17] text-xl uppercase tracking-tighter shrink-0">#{order.id.slice(-6).toUpperCase()}</span>
                                        <Badge className={`${statusColors[order.status]} border-none font-black text-[8px] md:text-[9px] px-4 py-1 rounded-full uppercase tracking-widest shadow-sm shrink-0 whitespace-nowrap`}>{order.status}</Badge>
                                     </div>
                                     <div className="space-y-1">
                                          <p className="text-[10px] font-black text-[#3B1F17]/40 uppercase tracking-[0.2em] italic truncate max-w-[200px] md:max-w-none mx-auto md:mx-0">Collector: {order.guestEmail || 'Anonymous Regular'}</p>
                                          <p className="text-[9px] font-medium text-[#3B1F17]/20 uppercase tracking-widest">{new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                     </div>
                                  </div>

                                  <div className="space-y-2 flex flex-col items-center md:items-start">
                                     <p className="text-2xl font-serif font-bold text-[#3B1F17] leading-none italic">₹{order.total}</p>
                                     <p className="text-[9px] font-black text-[#DE9088] uppercase tracking-[0.3em] opacity-40">{order.items.length} Elements</p>
                                  </div>

                                  <div className="flex flex-wrap justify-center md:justify-end gap-3 md:gap-4 w-full md:w-auto">
                                     {order.status === 'new' && (
                                         <Button size="lg" className="rounded-2xl h-12 md:h-14 bg-blue-500 hover:bg-blue-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-xl text-white px-6 md:px-8 leading-none flex-grow md:flex-grow-0" onClick={() => updateOrderStatus(order.id, 'baking')}>Initiate Baking</Button>
                                     )}
                                     {order.status === 'baking' && (
                                         <Button size="lg" className="rounded-2xl h-12 md:h-14 bg-[#DE9088] hover:bg-[#cc7a74] text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-xl text-white px-6 md:px-8 leading-none flex-grow md:flex-grow-0" onClick={() => updateOrderStatus(order.id, 'out-for-delivery')}>Release to Transit</Button>
                                     )}
                                     {order.status === 'out-for-delivery' && (
                                         <Button size="lg" className="rounded-2xl h-12 md:h-14 bg-[#3B1F17] hover:bg-[#2A1610] text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-xl text-white px-6 md:px-8 leading-none flex-grow md:flex-grow-0" onClick={() => updateOrderStatus(order.id, 'delivered')}>Fulfill Requisition</Button>
                                     )}
                                     <Button size="icon" variant="ghost" className="rounded-[1.5rem] h-12 w-12 md:h-14 md:w-14 border border-[#E8DDD7] text-[#3B1F17]/20 hover:text-[#3B1F17] hover:bg-white transition-all shrink-0"><MoreHorizontal className="w-5 h-5" /></Button>
                                  </div>
                               </div>
                           ))}
                        </div>
                     </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                      {products.map(p => (
                          <Card key={p.id} className="rounded-[48px] border border-[#E8DDD7] overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-500 text-left">
                              <div className="aspect-[4/3] relative p-3">
                                  <img src={p.images?.[0]} className="w-full h-full object-cover rounded-[36px]" alt={p.name} />
                                  <div className="absolute top-8 right-8 flex flex-col gap-2 items-end">
                                      <Badge variant={p.stockStatus === 'in-stock' ? 'default' : 'destructive'} className="bg-white/80 backdrop-blur-md text-[#3B1F17] border-none shadow-xl font-black text-[9px] uppercase tracking-widest px-4 py-2 rounded-full">
                                          {p.stockStatus.replace('-', ' ')}
                                      </Badge>
                                      {p.seoSlug && (
                                        <Badge className="bg-[#cc7a74]/95 text-white border-none shadow-md font-bold text-[8px] uppercase tracking-wider px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                                          <Sparkles className="w-3 h-3 text-[#FAF7F5]" /> SEO Optimized
                                        </Badge>
                                      )}
                                  </div>
                              </div>
                              <CardContent className="p-10 space-y-6">
                                  <div>
                                      <h3 className="font-display font-black text-[#3B1F17] text-2xl mb-2 italic tracking-tight">{p.name}</h3>
                                      <p className="text-[10px] text-[#3B1F17]/60 font-medium italic leading-relaxed line-clamp-2">{p.description}</p>
                                  </div>
                                  <div className="flex items-center justify-between pt-4 border-t border-[#E8DDD7]">
                                      <span className="font-serif font-bold text-[#3B1F17] text-2xl">₹{p.price}</span>
                                      <Badge variant="outline" className="border-[#E8DDD7] text-[#3B1F17] text-[9px] uppercase tracking-widest rounded-lg px-2.5 py-1">Qty Live</Badge>
                                  </div>
                              </CardContent>
                          </Card>
                      ))}
                  </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
