import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  User, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Copy, 
  Check, 
  TrendingUp, 
  Cake, 
  Heart, 
  Utensils, 
  MessageSquare,
  Facebook,
  Twitter,
  ArrowRight
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { FALLBACK_PRODUCTS } from '../lib/fallbackProducts';
import { ProductCard } from '../components/ProductCard';
import { handleImageError } from '../lib/utils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: 'Design Trends' | 'Fascinating Facts' | 'Holiday Gifting' | 'Artisanal Breads';
  image: string;
  relatedProductIds: string[];
  faqs: { q: string; a: string; }[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'secrets-of-wedding-tier-cakes',
    title: 'The Secret Architecture of Designing Multi-Tier Wedding Cakes',
    slug: 'secrets-of-wedding-tier-cakes',
    excerpt: 'From structural support pillars to premium Swiss icing palettes, delve into the high-precision craft behind our flagship tiered masterpieces.',
    author: 'Chef Vikram Sharma',
    date: 'May 24, 2026',
    readTime: '6 min read',
    category: 'Design Trends',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800',
    relatedProductIds: ['wedding-tier-lux', 'rose-bouquet-bespoke', 'royal-gold-leaf'],
    content: `
      <h2>The Foundation of Celebration Artistry</h2>
      <p>A multi-tiered wedding cake is more than just butter, sugar, and flour. It is a structural engineering marvel designed to command attention, stand firm in air-conditioned banquet halls for hours, and taste exceptionally moist when sliced.</p>
      
      <p>At Cake Urban, constructing a masterpiece like our *Luxurious Wedding Tier* involves dynamic vertical wooden dowels and custom-cut acrylic plates hidden within the sponge core. This distributes the weight of dense chocolate sponge layers, preventing sagging or tilting during transit across Delhi NCR.</p>

      <h2>Temperature Management and Buttercream Sourcing</h2>
      <p>The humidity in Faridabad and Noida during wedding seasons requires precise frosting selection. We avoid heavy cheap fats and utilize real premium dairy butter double-whipped with fine confectioner sweet-frost. This ensures a silky texture that melts in the mouth, but retains its perfect artistic piping shapes down to 22°C.</p>

      <blockquote>"A wedding cake is the sweet center-piece around which family memories are permanently framed. We take that responsibility down to the micro-milligram of golden leaf detail."</blockquote>

      <h2>Flavor Profiling</h2>
      <p>We recommend pairing contrasting profiles: a rich Belgian chocolate truffle layer at the base, and a lighter, vibrant red velvet romance sponge with whipped cream cheese at the crown. This offers guests a delightful spectrum of flavors to choose from.</p>
    `,
    faqs: [
      { q: "How many days in advance should we order a Tier Cake?", a: "We require at least 3 to 5 days advance booking for multi-tiered wedding cakes to ensure structural curing and edible gold floral setup." },
      { q: "Do you deliver wedding cakes directly to the banquet hall?", a: "Yes, we handle priority hand-delivery inside climate-stabilized vans with professional setup assistants on-site." }
    ]
  },
  {
    id: 'sourdough-boule-digestive-goodness',
    title: 'Sourdough Boule: Why Slow Fermentation is Highly Superior',
    slug: 'sourdough-boule-digestive-goodness',
    excerpt: 'Explore the 36-hour proofing cycle, natural wild lactobacilli growth, and premium crumb crust that sets real sourdough apart.',
    author: 'Baker Elena Petrova',
    date: 'May 18, 2026',
    readTime: '4 min read',
    category: 'Artisanal Breads',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=800',
    relatedProductIds: ['sourdough-boule-classic', 'multiseed-loaf', 'bakers-special-box'],
    content: `
      <h2>The Ancient Magic of Wild Yeast</h2>
      <p>Standard industrial bread is bloated with quick chemical yeast packets and rising agents that skip organic enzymatic breakdowns. Real sourdough fermentation takes patience, premium unbleached grains, and our sacred 5-year-old starter culture kept at precise warm hydration.</p>

      <h2>Why It Cares For Your Digestive Comfort</h2>
      <p>Daily sourdough baking isn't just about the thick, crackly golden crust. Over our 36-hour cold proofing cycle, the wild lactobacilli digest complex starches and break down gluten proteins. This renders the bread highly bio-available and significantly lighter on your gut, with a tangy signature flavor profile.</p>

      <h2>How to Serve Sourdough Like a Connoisseur</h2>
      <p>Never microwave sourdough. Always toast a slice on a well-heated cast-iron pan with salted butter, or serve alongside a hot bowl of fresh vegetable soup to savor the chewy, premium crumb texture.</p>
    `,
    faqs: [
      { q: "Is sourdough bread gluten-free?", a: "While it is not 100% gluten-free (it is baked from premium wheat and rye), the long fermentation breaks down gluten structures to a level where many wheat-sensitive individuals digest it comfortably." },
      { q: "How should I store my artisan sourdough boule?", a: "Wrap it in a dry clean cotton cloth or place inside a paper bread bag. Avoid plastic bags or refrigerators, which can soften the crunchy crust." }
    ]
  },
  {
    id: 'curating-unforgettable-gifting-hampers',
    title: 'The Art of Curating Unforgettable Gourmet Bakery Hampers',
    slug: 'curating-unforgettable-gifting-hampers',
    excerpt: 'Make festivals and corporate events prestigious. Tips on pairing pralines, custom mini bento cakes, and fairytale lights inside a luxury box.',
    author: 'Rhea Sen (Gifting Stylist)',
    date: 'May 10, 2026',
    readTime: '5 min read',
    category: 'Holiday Gifting',
    image: 'https://images.unsplash.com/photo-1549462980-6a03f721ff03?auto=format&fit=crop&q=80&w=800',
    relatedProductIds: ['premium-luxury-hamper', 'gold-truffle-basket', 'birthday-surprise-casket'],
    content: `
      <h2>Moving Beyond Bored Chocolate Boxes</h2>
      <p>Giving a bulk-produced commercial chocolate box conveys little thought. Elite gifting requires texture variation, personalized tags, and fresh boutique item diversity.</p>

      <h2>Contrast: The Core Secret of Gifting</h2>
      <p>An amazing bakery basket must balance dry with rich, and crunchy with smooth. We suggest stacking our handcrafted praline selections for texture, baked multi-seed cookie tins for crunch, and a delicious red velvet cake jar for rich indulgence.</p>

      <h2>Aesthetic Fairy-Light Presentation</h2>
      <p>Our flagship *Bespoke Birthday Surprise Casket* features an elegant black magnetic box embellished with cozy, ambient battery-operated copper fairy lights. The moment your recipient unboxes the hamper, they are greeted with a warm glowing golden atmosphere.</p>
    `,
    faqs: [
      { q: "Can we include personalized corporate logo cards?", a: "Yes, we support bulk corporate branding including custom wax-seals and printed designer card sleeves." },
      { q: "How long can items inside the hamper stay fresh?", a: "Our handmade cookies, truffles, and bakes are sealed at premium airtight levels, keeping them fresh for up to 15-20 days." }
    ]
  }
];

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPostId = searchParams.get('id');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Resolve current active reading post
  const activePost = BLOG_POSTS.find(p => p.id === currentPostId);

  // Filter lists based on category tab
  const filteredPosts = activeCategory === 'All' 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(p => p.category === activeCategory);

  const categories = ['All', 'Design Trends', 'Holiday Gifting', 'Artisanal Breads'];

  return (
    <div className="min-h-screen bg-transparent pb-24">
      
      {/* Dynamic SEO depending on whether we are reading or listing */}
      <SEO 
        title={activePost ? `${activePost.title} - Cake Urban Blog` : "Baking Crafts & Gifting Masterclass Blog - Cake Urban"}
        description={activePost ? activePost.excerpt : "Discover insider baking tips, chef wedding design secrets, and sourdough health benefits from Faridabad's leading master bakers."}
      />

      {/* JSON-LD Rich Snippet Blog post injection */}
      {activePost && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": activePost.title,
            "image": activePost.image,
            "datePublished": activePost.date,
            "author": {
              "@type": "Person",
              "name": activePost.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Cake Urban"
            },
            "description": activePost.excerpt
          })}
        </script>
      )}

      {/* Hero Header */}
      {!activePost ? (
        <header className="bg-gradient-to-b from-white to-[#FAF7F5] border-b border-[#E8DDD7]/40 px-6 py-16 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="inline-block bg-[#DE9088]/10 text-[#cc7a74] px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black tracking-[0.2em] uppercase">
              The Cake Diaries
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-[#2D150F]">Culinary Crafts & Stories</h1>
            <p className="text-xs sm:text-base text-[#3B1F17]/60 max-w-lg mx-auto italic font-medium">
              Dive into our boutique baking logs, seasonal gifting guidelines, and health benefits of genuine slow-fermented bakes.
            </p>
          </div>
        </header>
      ) : null}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        <AnimatePresence mode="wait">
          {!activePost ? (
            /* ================= INDEX LIST VIEW ================= */
            <motion.div
              key="list-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              {/* Category tabs */}
              <div className="flex justify-start sm:justify-center overflow-x-auto pb-2 gap-2 no-scrollbar shrink-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-3 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shrink-0 border ${
                      activeCategory === cat 
                        ? 'bg-[#2D150F] text-white border-[#2D150F] shadow-md' 
                        : 'bg-white text-[#2D150F]/70 border-[#E8DDD7] hover:bg-[#DE9088]/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <article 
                    key={post.id}
                    className="bg-white rounded-[40px] overflow-hidden border border-[#E8DDD7]/40 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-all duration-300"
                  >
                    <div>
                      <div className="relative overflow-hidden aspect-[4/3]">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          onError={handleImageError}
                        />
                        <span className="absolute top-4 left-4 bg-[#2D150F] text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                          {post.category}
                        </span>
                      </div>
                      
                      <div className="p-8 space-y-4 text-left">
                        <div className="flex items-center gap-4 text-[10px] text-[#2D150F]/50 font-black uppercase tracking-wider">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#DE9088]" />{post.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#DE9088]" />{post.readTime}</span>
                        </div>
                        <h3 className="text-xl font-display font-black text-[#2D150F] leading-snug group-hover:text-[#DE9088] transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-[#2D150F]/60 line-clamp-3 leading-relaxed font-semibold italic">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-8 pb-8 text-left">
                      <button
                        onClick={() => setSearchParams({ id: post.id })}
                        className="w-full h-12 rounded-2xl bg-[#FAF7F5] hover:bg-[#2D150F] hover:text-white text-[10px] font-black uppercase tracking-widest text-[#2D150F] flex items-center justify-center gap-2 transition-all"
                      >
                        <span>Read Chapter</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          ) : (
            /* ================= DETAILED READING VIEW ================= */
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              {/* Back Navigation Bar */}
              <div className="flex items-center justify-between border-b border-[#E8DDD7]/40 pb-4">
                <button 
                  onClick={() => setSearchParams({})}
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#2D150F] hover:text-[#DE9088] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Chapters</span>
                </button>
                
                {/* Micro Actions */}
                <div className="flex items-center gap-3">
                  <span className="bg-[#DE9088]/15 text-[#DE9088] text-[9px] font-black uppercase px-3 py-1.5 rounded-full tracking-widest">
                    {activePost.category}
                  </span>
                  
                  <button 
                    onClick={handleCopyLink}
                    className="w-9 h-9 bg-white border border-[#E8DDD7] rounded-xl flex items-center justify-center text-[#2D150F] hover:bg-[#FAF7F5] transition-all"
                    title="Copy Link to Article"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  
                  <a 
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(activePost.title + ' ' + window.location.href)}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="w-9 h-9 bg-green-500 border border-green-600 rounded-xl flex items-center justify-center text-white hover:bg-green-600 transition-all"
                    title="Share to WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Title & Author Info */}
              <div className="space-y-4 text-left">
                <h1 className="text-3xl sm:text-5xl font-display font-black text-[#2D150F] leading-tight tracking-tight">
                  {activePost.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-[11px] text-[#2D150F]/50 font-black uppercase tracking-wider bg-white rounded-2xl p-4 border border-[#E8DDD7]/30">
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-[#DE9088]" />{activePost.author}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#DE9088]" />{activePost.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#DE9088]" />{activePost.readTime}</span>
                </div>
              </div>

              {/* Cover Image */}
              <div className="relative overflow-hidden rounded-[32px] sm:rounded-[48px] aspect-[16/9] shadow-md border border-[#E8DDD7]/40">
                <img 
                  src={activePost.image} 
                  alt={activePost.title} 
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>

              {/* Main Content Body */}
              <article className="prose prose-stone prose-headings:font-display prose-headings:font-black prose-headings:text-[#2D150F] prose-p:text-[#2D150F]/70 prose-p:leading-relaxed prose-p:font-semibold prose-p:italic text-left bg-white p-6 sm:p-12 rounded-[32px] sm:rounded-[48px] border border-[#E8DDD7]/40 shadow-sm">
                <div 
                  dangerouslySetInnerHTML={{ __html: activePost.content }} 
                  className="space-y-6"
                />
              </article>

              {/* Dynamic Related FAQ Schema list */}
              <div className="bg-white p-6 sm:p-12 rounded-[32px] sm:rounded-[48px] border border-[#E8DDD7]/40 text-left space-y-6 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-[#DE9088] tracking-widest">
                  <MessageSquare className="w-4 h-4" />
                  <span>Related Chapter FAQs</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-black text-[#2D150F]">Understand More About This Recipe</h3>
                
                <div className="space-y-4">
                  {activePost.faqs.map((faq, idx) => (
                    <div key={idx} className="bg-[#FAF7F5] rounded-2xl p-5 border border-[#E8DDD7]/20">
                      <p className="font-bold text-xs sm:text-sm text-[#2D150F] mb-1.5">Q: {faq.q}</p>
                      <p className="text-xs sm:text-sm text-[#2D150F]/65 font-semibold italic">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Bestseller Products Section */}
              <div className="space-y-8 text-left">
                <div className="border-b border-[#E8DDD7]/40 pb-4">
                  <h3 className="text-xl sm:text-2xl font-display font-black text-[#2D150F]">Recommended for This Reading</h3>
                  <p className="text-xs text-[#2D150F]/50 font-semibold italic">Handcrafted fresh in Faridabad, ready-to-celebrate.</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-[10px] sm:gap-6">
                  {FALLBACK_PRODUCTS
                    .filter(p => activePost.relatedProductIds.includes(p.id))
                    .map((prod) => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
