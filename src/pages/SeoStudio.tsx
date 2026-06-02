import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, UploadCloud, Globe, Search, Image as ImageIcon, 
  Tag, Copy, Check, Instagram, Share2, FileText, CheckCircle, 
  ArrowRight, ShieldCheck, HelpCircle, Save, CheckCircle2, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import SEO from '../components/SEO';

import { useAuth } from '../hooks/useAuth';

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

export default function SeoStudio() {
  const { isAdmin } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<SeoResult | null>(null);
  const [copyStates, setCopyStates] = useState<Record<string, boolean>>({});
  const [isPersisting, setIsPersisting] = useState(false);
  const [persisted, setPersisted] = useState(false);

  // Loading animation simulation messages
  const steps = [
    "Analyzing cake decoration layers & color spectrum...",
    "Scanning visual elements (frosting type, accents)...",
    "Calibrating high-volume search parameters for Delhi NCR...",
    "Crafting location-targeted high-CTR meta titles & alt tags...",
    "Compiling Schema.org structured JSON-LD schemas...",
    "Finalizing social-share referral captions..."
  ];

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-6 py-32 text-center min-h-[500px] flex flex-col items-center justify-center space-y-6 bg-[#FDFBF9]">
        <AlertCircle className="w-16 h-16 text-rose-500 animate-pulse" strokeWidth={1.5} />
        <h2 className="text-3xl font-display font-black text-[#3B1F17]">Access Restricted</h2>
        <p className="text-sm text-gray-500 max-w-sm font-medium italic leading-relaxed">
          This advanced intelligence SEO laboratory is restricted exclusively to the chief curator at <span className="font-bold text-[#3B1F17]">abhibroomies@gmail.com</span> on verified admin connection.
        </p>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setResult(null);
      setPersisted(false);
    };
    reader.readAsDataURL(file);
  };

  const triggerOptimize = async () => {
    if (!image) return;

    setLoading(true);
    setResult(null);
    setPersisted(false);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      const response = await fetch('/api/seo/optimize-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: image,
          mimeType,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server processing failed');
      }

      const data = await response.json();
      setResult(data);
      toast.success('Cake Optimized Successfully! Organic assets generated');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to perform auto-SEO');
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopyStates((prev) => ({ ...prev, [key]: true }));
    toast.success('Copied to clipboard!');
    setTimeout(() => {
      setCopyStates((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const handleSaveToCatalog = async () => {
    if (!result || !image) return;
    setIsPersisting(true);

    try {
      // Add product document directly into Firestore "products" collection 
      // so it goes live instantly in the Boutique Shop!
      const finalPrice = Math.floor(Math.random() * 401) + 899; // 899 to 1299
      await addDoc(collection(db, 'products'), {
        name: result.productName,
        description: `${result.metaDescription} Alt details: ${result.altText}`,
        price: finalPrice,
        categories: ['Cakes'],
        occasions: ['Birthday'],
        flavors: ['Specialty'],
        images: [image], // Direct base64 inline image, great for preview display
        stockStatus: 'in-stock',
        isCustomizable: true,
        seoSlug: result.slug,
        seoKeywords: result.keywords,
        createdAt: new Date().toISOString()
      });

      setPersisted(true);
      toast.success('Published directly live into your catalog!');
    } catch (err) {
      console.error('Failed to write product:', err);
      toast.error('Saved to local clipboard, catalog push require firebase configuration');
    } finally {
      setIsPersisting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#2D150F] py-20">
      <SEO 
        title="AI Image SEO Optimizer Studio - Cake Urban"
        description="Automate search rankings for your cakes. Upload any photo, and Cake Urban's machine-vision AI generates instant SEO titles, alt tags, keywords, and Schema.org scripts."
        keywords="ai image seo, optimize cake photos, local business schema generator, automatically list cakes south delhi"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Title Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#DE9088]/10 text-[#cc7a74] text-[10px] font-black uppercase tracking-[0.25em] italic border border-[#DE9088]/20">
            <Sparkles className="w-3.5 h-3.5" /> Luxury AI Engine
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-black leading-none tracking-tight">
            AI Image <span className="font-serif font-light italic text-[#DE9088]">SEO Studio</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#2D150F]/60 max-w-xl mx-auto italic font-medium leading-relaxed">
            Upload any original cake photo, raw design sheet, or chef snapshot. Our intelligent machine-vision agent instantly analyzes the pastry and deploys ultra-optimized SEO metadata, location keywords, schemas, and descriptors to dominate search engines.
          </p>
        </div>

        {/* Brand Shield Trust Banner */}
        <div className="mt-10 max-w-xl mx-auto bg-white border border-[#E8DDD7] p-5 rounded-[28px] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#2D150F] flex items-center justify-center text-white shrink-0 shadow-inner">
            <ShieldCheck className="w-6 h-6 text-[#DE9088]" />
          </div>
          <div className="text-left space-y-0.5">
            <p className="text-xs font-black uppercase tracking-wider text-[#2D150F]">Cake Urban Authority</p>
            <p className="text-[10px] text-[#2D150F]/50 font-medium italic">
              Empowering local SEO indexing for South Delhi, Faridabad, Gurgaon, and Noida automatically.
            </p>
          </div>
        </div>

        {/* Dynamic Interactive Panel */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: UPLOADER & IMAGE CONTROL */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E8DDD7] rounded-[36px] p-6 shadow-sm">
              <h3 className="text-lg font-bold font-serif mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#DE9088]" /> 1. Upload Masterclass
              </h3>
              
              {/* Drag/Drop Box */}
              <div className="relative border-2 border-dashed border-[#DE9088]/30 rounded-[28px] overflow-hidden group hover:border-[#DE9088] transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  disabled={loading}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                />
                
                {image ? (
                  <div className="relative aspect-[4/3] w-full">
                    <img src={image} alt="Cake preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <UploadCloud className="w-4 h-4 text-[#DE9088]" /> Replace Master Image
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center space-y-4 px-4 bg-[#FAF7F5]">
                    <div className="w-16 h-16 bg-[#DE9088]/15 rounded-2xl flex items-center justify-center mx-auto text-[#DE9088] group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-[#2D150F]">Drag & drop photo here</p>
                      <p className="text-[10px] text-[#2D150F]/50 font-medium">PNG, JPEG, HEIC supported (Up to 10MB)</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Trigger */}
              {image && (
                <div className="mt-6">
                  <Button 
                    onClick={triggerOptimize}
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-[#2D150F] hover:bg-[#DE9088] hover:text-white text-amber-50 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-md transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>SEO Engine Engaged...</span>
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#DE9088] animate-pulse" />
                        <span>Perform Auto-SEO Optimization</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* How it helps box */}
            <div className="bg-[#FAF7F5] border border-[#E8DDD7] rounded-[32px] p-6 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#2D150F] flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#DE9088]" /> Visual Search Dominance
              </h4>
              <ul className="space-y-3.5 text-[11px] text-[#2D150F]/75 font-semibold italic leading-relaxed text-left">
                <li className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DE9088] mt-1.5 shrink-0" />
                  <span>Google Images drives over 22% of total search query volume online. Optimized image alt tags let spiders understand exactly what you bake.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DE9088] mt-1.5 shrink-0" />
                  <span>Structured Schemas prompt Google to generate exquisite Rich Snippets displaying ratings, pricing, and availability tags directly inside search lists!</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DE9088] mt-1.5 shrink-0" />
                  <span>Geographically relevant keywords capture local intent searches such as 'designer chocolate cake in Vasant Kunj' or 'anniversary cake deliver Gurgaon'.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT: LOADING OR RESULTS CONTAINER */}
          <div className="lg:col-span-7">
            
            {/* 1. INITIAL EMPTY STATE */}
            {!loading && !result && (
              <div className="bg-white border border-[#E8DDD7] rounded-[44px] py-24 text-center space-y-6 px-8 h-full flex flex-col justify-center items-center">
                <div className="w-20 h-20 rounded-full bg-[#FDFBF9] border border-[#E8DDD7] flex items-center justify-center text-[#DE9088] shadow-sm">
                  <Globe className="w-10 h-10 animate-spin-slow" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h3 className="text-xl font-display font-black leading-tight text-[#2D150F]">SEO Output Awaiting</h3>
                  <p className="text-xs text-[#2D150F]/50 font-medium italic leading-relaxed">
                    Upload an elite creation on the left and engage the AI wizard. The organic metadata assets will render here automatically.
                  </p>
                </div>
              </div>
            )}

            {/* 2. LOADING STATE */}
            {loading && (
              <div className="bg-white border border-[#E8DDD7] rounded-[44px] py-16 px-6 sm:px-12 text-center space-y-8 h-full flex flex-col justify-center min-h-[500px]">
                <div className="space-y-4">
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <span className="absolute inset-0 bg-[#DE9088]/10 rounded-full animate-ping scale-110" />
                    <div className="w-20 h-20 bg-[#2D150F] rounded-full flex items-center justify-center border-2 border-[#DE9088]/40 shadow-xl">
                      <Sparkles className="w-10 h-10 text-[#DE9088] animate-spin" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif font-bold italic text-[#2D150F]">Cultivating SEO Payload</h3>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-black text-[#DE9088]">Lighthouse Engine Active</p>
                </div>

                {/* Simulated Steps Output log */}
                <div className="max-w-md mx-auto w-full bg-[#FAF7F5] border border-[#E8DDD7] p-5 rounded-2xl text-left space-y-3">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs leading-none">
                      {loadingStep > idx ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : loadingStep === idx ? (
                        <div className="w-4 h-4 border-2 border-[#DE9088]/30 border-t-[#DE9088] rounded-full animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-gray-200 border border-gray-300 shrink-0" />
                      )}
                      <span className={`font-semibold italic ${loadingStep === idx ? 'text-[#DE9088]' : loadingStep > idx ? 'text-[#2D150F]/45' : 'text-gray-300'}`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. COMPLETED RESULTS DISPLAY */}
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                
                {/* Save To Live Catalog Button */}
                {!persisted ? (
                  <div className="bg-[#DE9088]/10 border border-[#DE9088]/20 p-6 rounded-[28px] flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-left space-y-1">
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#cc7a74] flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> SEO Optimization Ready!
                      </h4>
                      <p className="text-[10px] text-[#2D150F]/60 font-medium italic">
                        Deploy this fully optimized pastry directly to your live shop catalog catalogued instantly for Delhi NCR searchers!
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleSaveToCatalog}
                      disabled={isPersisting}
                      className="w-full sm:w-auto h-12 px-6 rounded-xl bg-[#2D150F] hover:bg-[#DE9088] text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shrink-0 shadow"
                    >
                      {isPersisting ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 text-[#DE9088]" />
                          <span>Publish Live to Catalog</span>
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-[28px] flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800">Direct Live Catalog Release</h4>
                      <p className="text-[10px] text-emerald-700 font-semibold italic">
                        Success! Your newly optimized product has been written into the Cake Urban catalog directory. It is now accessible live in your store interface.
                      </p>
                    </div>
                  </div>
                )}

                {/* Google Search Snippet Card Preview */}
                <div className="bg-white border border-[#E8DDD7] rounded-[36px] overflow-hidden shadow-sm">
                  <div className="bg-[#FAF7F5] border-b border-[#E8DDD7] px-6 py-4 flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#2D150F] flex items-center gap-2">
                      <Search className="w-4 h-4 text-[#DE9088]" /> Google Search Result Snippet
                    </h4>
                    <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">Interactive Preview</span>
                  </div>
                  
                  <div className="p-6 text-left space-y-2 font-sans bg-white">
                    <div className="text-[10px] sm:text-xs text-[#202124] flex items-center gap-1 leading-none">
                      <span className="font-semibold">https://cakeurban.com</span>
                      <span className="text-[#5f6368]">› shop › cakes › {result.slug || 'slug'}</span>
                    </div>
                    
                    <h4 className="text-lg sm:text-xl font-medium text-[#1a0dab] tracking-normal cursor-pointer leading-tight font-sans hover:underline">
                      {result.seoTitle}
                    </h4>
                    
                    {/* Rich snippet stars */}
                    <div className="flex items-center gap-1.5 text-xs text-[#70757a]">
                      <span className="text-[#fabb05]">★★★★★</span>
                      <span className="font-medium text-[#5f6368]">Rating: 4.9 · ‎18 votes · ‎Price: ₹1,199.00 · ‎In stock</span>
                    </div>

                    <p className="text-xs text-[#4d5156] leading-relaxed max-w-2xl font-sans">
                      {result.metaDescription}
                    </p>
                  </div>
                </div>

                {/* Primary Metadata Table */}
                <div className="bg-white border border-[#E8DDD7] rounded-[36px] p-6 shadow-sm text-left space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#2D150F] border-b border-white/5 pb-2 flex items-center gap-1.5">
                    <FileText className="w-4.5 h-4.5 text-[#DE9088]" /> Organic SEO Meta Tags
                  </h4>

                  <div className="space-y-5">
                    
                    {/* Product Name (Suggested Website Name) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-black tracking-widest text-[#2D150F]/50">alluring Product title</label>
                        <button onClick={() => handleCopy(result.productName, 'name')} className="text-xs text-[#DE9088] hover:text-[#2D150F] flex items-center gap-1 font-semibold leading-none">
                          {copyStates['name'] ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copyStates['name'] ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="bg-[#FAF7F5] border border-[#E8DDD7] p-3.5 rounded-xl font-serif font-bold text-lg leading-snug">
                        {result.productName}
                      </div>
                    </div>

                    {/* Meta Title */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-black tracking-widest text-[#2D150F]/50">meta title header</label>
                        <button onClick={() => handleCopy(result.seoTitle, 'title')} className="text-xs text-[#DE9088] hover:text-[#2D150F] flex items-center gap-1 font-semibold leading-none">
                          {copyStates['title'] ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copyStates['title'] ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="bg-[#FAF7F5] border border-[#E8DDD7] p-3.5 rounded-xl font-mono text-xs font-semibold leading-relaxed">
                        {result.seoTitle}
                      </div>
                    </div>

                    {/* Slug */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-black tracking-widest text-[#2D150F]/50">Search Engine URL Slug</label>
                        <button onClick={() => handleCopy(result.slug, 'slug')} className="text-xs text-[#DE9088] hover:text-[#2D150F] flex items-center gap-1 font-semibold leading-none">
                          {copyStates['slug'] ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copyStates['slug'] ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="bg-[#FAF7F5] border border-[#E8DDD7] p-3.5 rounded-xl font-mono text-xs font-semibold text-[#DE9088] leading-none">
                        {result.slug}
                      </div>
                    </div>

                    {/* Alt Tag Description */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-black tracking-widest text-[#2D150F]/50">Alt tag text (Accessibility & Image Crawl)</label>
                        <button onClick={() => handleCopy(result.altText, 'alt')} className="text-xs text-[#DE9088] hover:text-[#2D150F] flex items-center gap-1 font-semibold leading-none">
                          {copyStates['alt'] ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copyStates['alt'] ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="bg-[#FAF7F5] border border-[#E8DDD7] p-3.5 rounded-xl text-xs font-semibold leading-relaxed italic text-[#2D150F]/80">
                        {result.altText}
                      </div>
                    </div>

                    {/* Suggested Filename */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-black tracking-widest text-[#2D150F]/50">SEO Image File Name</label>
                        <button onClick={() => handleCopy(result.suggestedFilename, 'filename')} className="text-xs text-[#DE9088] hover:text-[#2D150F] flex items-center gap-1 font-semibold leading-none">
                          {copyStates['filename'] ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copyStates['filename'] ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="bg-[#FAF7F5] border border-[#E8DDD7] p-3.5 rounded-xl font-mono text-xs font-semibold leading-none">
                        {result.suggestedFilename}
                      </div>
                    </div>

                    {/* High Traffic Search Keywords */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-widest text-[#2D150F]/50 block">High Volume Local Search Tags</label>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {result.keywords.map((kw, i) => (
                          <span key={i} className="px-3 py-1.5 bg-[#DE9088]/5 font-semibold text-[10px] border border-[#DE9088]/15 rounded-full text-[#cc7a74] italic">
                            #{kw.replace(/\s+/g, '').toLowerCase()}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Tab layout / Extra SEO utilities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  
                  {/* INSTAGRAM & SOCIAL CAPTION SHARE CARD */}
                  <div className="bg-white border border-[#E8DDD7] rounded-[36px] p-6 shadow-sm flex flex-col justify-between">
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#2D150F] flex items-center gap-1.5 pb-2 border-b border-white/5">
                        <Instagram className="w-4 h-4 text-[#DE9088]" /> Instagram/Facebook Blueprint
                      </h4>
                      <p className="text-[11px] text-[#2D150F]/70 font-semibold italic leading-relaxed whitespace-pre-wrap">
                        {result.instagramCaption}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-[#E8DDD7]/40 mt-6 shrink-0">
                      <Button 
                        onClick={() => handleCopy(result.instagramCaption, 'ig')}
                        className="w-full h-11 rounded-xl bg-[#FAF7F5] hover:bg-[#DE9088]/10 text-[#DE9088] border border-[#DE9088]/30 hover:border-[#DE9088] text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors"
                      >
                        {copyStates['ig'] ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copyStates['ig'] ? 'Copied' : 'Copy Caption & Tags'}</span>
                      </Button>
                    </div>
                  </div>

                  {/* SCHEMA ORG RAW STUFF DATA */}
                  <div className="bg-white border border-[#E8DDD7] rounded-[36px] p-6 shadow-sm flex flex-col justify-between">
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#2D150F] flex items-center gap-1.5 pb-2 border-b border-white/5">
                        <Tag className="w-4 h-4 text-[#DE9088]" /> JSON-LD Product Schema
                      </h4>
                      <pre className="text-[9px] bg-[#FAF7F5] border border-[#E8DDD7] p-4 rounded-xl text-[#3B1F17]/80 font-mono overflow-x-auto h-[180px]">
                        {(() => {
                          try {
                            return result.structuredSchema ? JSON.stringify(JSON.parse(result.structuredSchema), null, 2) : '';
                          } catch (e) {
                            return result.structuredSchema;
                          }
                        })()}
                      </pre>
                    </div>

                    <div className="pt-6 border-t border-[#E8DDD7]/40 mt-6 shrink-0">
                      <Button 
                        onClick={() => handleCopy(result.structuredSchema, 'schema')}
                        className="w-full h-11 rounded-xl bg-[#FAF7F5] hover:bg-[#DE9088]/10 text-[#DE9088] border border-[#DE9088]/30 hover:border-[#DE9088] text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors"
                      >
                        {copyStates['schema'] ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copyStates['schema'] ? 'Copied' : 'Copy JSON-LD Schema'}</span>
                      </Button>
                    </div>
                  </div>

                </div>

                {/* Pinterest Pin Optimization Panel */}
                <div className="bg-white border border-[#E8DDD7] rounded-[36px] p-6 shadow-sm text-left space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#2D150F] flex items-center gap-1.5 pb-2 border-b border-white/5">
                    <Share2 className="w-4.5 h-4.5 text-[#DE9088]" /> Pinterest Pin Referral Optimization
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF7F5] p-5 rounded-2xl border border-[#E8DDD7]">
                    <div className="space-y-1">
                      <p className="text-[8px] uppercase font-black tracking-widest text-[#2D150F]/50">Pinterest Pin Board Title</p>
                      <p className="text-sm font-bold text-[#2D150F] font-serif">{result.pinterestPin.title}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] uppercase font-black tracking-widest text-[#2D150F]/50">Optimized Description</p>
                      <p className="text-xs italic text-[#2D150F]/70 leading-relaxed font-semibold">{result.pinterestPin.description}</p>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
