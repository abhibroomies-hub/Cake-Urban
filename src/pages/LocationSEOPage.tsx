import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Map, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  Cake, 
  Star, 
  ShoppingBag, 
  ArrowRight,
  Shield,
  Sparkle
} from 'lucide-react';
import SEO from '../components/SEO';
import { FALLBACK_PRODUCTS } from '../lib/fallbackProducts';
import { ProductCard } from '../components/ProductCard';

interface LocalFAQ {
  q: string;
  a: string;
}

interface LocationDetails {
  city: string;
  title: string;
  description: string;
  keywords: string;
  heroText: string;
  subText: string;
  deliveryTime: string;
  charge: string;
  faqs: LocalFAQ[];
}

const LOCATION_DATA_MAP: Record<string, LocationDetails> = {
  'bakery-in-delhi': {
    city: 'Delhi',
    title: 'Luxury Bakery Shop in Delhi - Gourmet Cakes & Pastries',
    description: 'Order premium luxury cakes, French macarons, and bespoke celebration hampers in Delhi. Hand-crafted using pure dairy and highest grade ingredients. Safe 100% contactless hand catering.',
    keywords: 'best bakery in delhi, cake delivery delhi, premium cakes delhi, online cakes order south delhi, eggless cakes delhi',
    heroText: 'Delhi\'s Royal Artisanal Bakery Enclave',
    subText: 'Indulge in royal chocolate truffles, organic berry cheesecakes, and custom tiered monuments delivered pristine across South Delhi, West Delhi, Dwarka, and North Delhi.',
    deliveryTime: '60-90 minutes delivery',
    charge: 'Calculated at checkout',
    faqs: [
      { q: "Where does Cake Urban deliver in Delhi?", a: "We hand-deliver to South Delhi (Vasant Kunj, GK, Saket, etc.), West Delhi (Dwarka, Punjabi Bagh), Central Delhi, and North Delhi using our climate-controlled temperature-managed vans." },
      { q: "Are eggless varieties prepared separately?", a: "Yes, 100%. We operate a fully sanitized, independent pure veg baking enclave for all eggless and vegan requests to avoid cross-contamination." },
      { q: "Do you offer late midnight deliveries in Delhi?", a: "Yes, we offer late surprise slots in Delhi from 11:30 PM to 12:00 midnight for birthday announcements and midnight surprises." }
    ]
  },
  'bakery-in-noida': {
    city: 'Noida',
    title: 'Elite Cake Shop in Noida - Hand-crafted Eggless Delicacies',
    description: 'Discover the premier designer cake bakery in Noida. Order bespoke chocolate gateaux, theme cakes, and warm fresh pastries delivered to your doorstep in Noida and Greater Noida.',
    keywords: 'cake shop in noida, cake delivery noida, eggless cakes noida, best birthday cakes noida, customized cakes noida',
    heroText: 'Elegant Artisanal Baking in Noida',
    subText: 'Sourcing standard Belgian chocolate, fresh orchard strawberries, and double-whipped real dairy cream for Noida Sector 15 to 150, and Greater Noida.',
    deliveryTime: 'Same-day 60 mins delivery',
    charge: 'Calculated at checkout',
    faqs: [
      { q: "Do you cater customized theme cakes to Greater Noida?", a: "Yes! Our Custom Studio designs tier-monuments and character fondant bakes and ships them with dedicated care to all sectors of Noida & Greater Noida." },
      { q: "Is same-day cake delivery possible in Noida?", a: "Absolutely. Standard orders like Belgian Truffles and Pineapple Paradise can be ordered and delivered within 1 to 2 hours of payment confirmation." }
    ]
  },
  'bakery-in-faridabad': {
    city: 'Faridabad',
    title: 'Faridabad\'s Bestseller Premium Cake Shop - Cake Urban',
    description: 'Cake Urban is Faridabad\'s elite home-grown premium bakery. Hand-designed cakes, instant cupcakes, brownies & customized hampers delivered across Faridabad.',
    keywords: 'best bakery in faridabad, cake delivery faridabad, custom cakes faridabad, birthday cakes near me, eggless pastries faridabad',
    heroText: 'Home of Faridabad\'s Finest Master bakers',
    subText: 'Proudly hand-catering pristine celebrations inside Sector 14, 15, 21, Greenfield, Greater Faridabad, and all neighboring residential sectors.',
    deliveryTime: 'Instant 30-45 mins delivery',
    charge: 'Free internal residential delivery above ₹500',
    faqs: [
      { q: "Where is the physical Cake Urban boutique located?", a: "We operate our premium micro-bakery center in Faridabad, allowing extremely fast 30-minute hot delivery cycles to nearby sectors." },
      { q: "Can I directly brief the Chef for custom cupcakes?", a: "Yes, our Custom Studio allows you to upload reference reference images and add specific flavor requirements for direct Chef action." }
    ]
  },
  'bakery-in-gurgaon': {
    city: 'Gurgaon',
    title: 'Premium Artisan Bakery in Gurgaon (Gurugram) - Elegant Cakes',
    description: 'Order standard premium cakes and luxury dessert curation boxes in Gurgaon. Hand-delivered across DLF Phase 1-5, Golf Course Road, Sohna Road, and cyber enclaves.',
    keywords: 'bakery in gurgaon, premium cake shop gurgaon, custom cake delivery gurugram, birthday cake order gurugram, eggless cakes gurgaon',
    heroText: 'Gurgaon\'s Elite Gourmet Cake Atelier',
    subText: 'Bespoke Belgian chocolate truffles, organic tea loaves, and customized kids birthday theme bakes hand-delivered to luxury residential enclaves.',
    deliveryTime: '60-80 minutes delivery',
    charge: 'Calculated at checkout',
    faqs: [
      { q: "Do you deliver to DLF Phase 1-5 and Golf Course Extension?", a: "Yes, we run regular daily delivery runs to DLF, Golf Course Road, Sohna Road, Sector 80-95, and suburban residential zones." },
      { q: "Can we book a corporate cake bulk order?", a: "We provide bespoke corporate branding bakes, customized pastries, and artisan gift baskets with custom logos and themes." }
    ]
  },
  'custom-cakes-noida': {
    city: 'Noida (Custom Spec)',
    title: 'Customized & Theme Cakes in Noida - Custom Studio',
    description: 'Browse outstanding design models or upload reference reference files to have Noida\'s champion chefs design your dream customized birthday block cake.',
    keywords: 'custom cakes noida, theme cakes noida, designer cakes noida, photo cake order noida, kids birthday cake noida',
    heroText: 'Bespoke Theme Cakes customized for Noida',
    subText: 'Convert any inspiration - digital references, toy shapes, luxury brand colors, or 3D characters - into delicious hand-sculpted celebration cakes.',
    deliveryTime: 'Requires 12-24 hours advance bake time',
    charge: 'Calculated at checkout',
    faqs: [
      { q: "How do I place a custom design request?", a: "Enter our digital Custom Studio page, choose the approximate weight, input flavor choice, and upload your reference image or sketch." },
      { q: "Are custom 3D fondant characters edible?", a: "Our characters are shaped by hand with high-grade imported Swiss sugar paste and are 100% edible and premium." }
    ]
  },
  'birthday-cakes-delhi': {
    city: 'Delhi (Birthday Spec)',
    title: 'Delicious Birthday Cakes Online Delivery in Delhi',
    description: 'Make birthdays brilliant! Double-whipped dark chocolate, floral velvet swirls, and cute bento surprise boxes inside Delhi NCR.',
    keywords: 'birthday cake delhi, online birthday cake delivery delhi, best birthday cake shop delhi, eggless birthday cakes',
    heroText: 'The Birthday Masterpieces of Delhi',
    subText: 'Our birthday enclaves are packed with pristine sparklers, handcrafted golden crown toppers, matching candles and fully customized wish labels.',
    deliveryTime: 'Within 90 mins or midnight slot',
    charge: 'Calculated at checkout',
    faqs: [
      { q: "Do you provide complimentary candles & knives?", a: "Absolutely! Every single birthday cake order includes a custom design cake knife, matches, and fancy pastel candles." },
      { q: "Can we have a printed edible photo on the birthday cake?", a: "Yes, we print clear edible photo cakes using standard food-quality starch inks." }
    ]
  },
  'anniversary-cakes-faridabad': {
    city: 'Faridabad (Anniversary Spec)',
    title: 'Anniversary Cakes in Faridabad - Elegant Anniversary Delights',
    description: 'Elegant tiered wedding cakes, rose bouquet swatches, and red velvet cheese creations designed beautifully to celebrate years of togetherness in Faridabad.',
    keywords: 'anniversary cake faridabad, wedding anniversary cakes, premium couple cake, red velvet anniversary cake faridabad',
    heroText: 'Handcrafting Romantic Love Journeys',
    subText: 'Celebrate years of togetherness with our elite Red Velvet Cheese Frosting or signature rose design boxes crafted fresh inside Faridabad.',
    deliveryTime: 'Instant 30 mins delivery',
    charge: 'Calculated at checkout',
    faqs: [
      { q: "Do you bake multi-tiered anniversary cakes?", a: "We specialize in two-tier and three-tier anniversary cakes with robust support bases for smooth delivery transit." },
      { q: "Can we customize the text message on plaque?", a: "Yes, you can add any personalized couple wish which our chefs will hand-pipe on a premium chocolate slab placed on the cake." }
    ]
  },
  'cake-delivery-in-faridabad': {
    city: 'Faridabad Delivery Hub',
    title: 'Same Day Eggless Cake Delivery in Faridabad - Cake Urban',
    description: 'Craving sugar? Order birthday cakes, premium pastries, brownies, and hampers online in Faridabad with rapid 30-45 minutes home delivery. 100% pure vegetarian-certified ovens.',
    keywords: 'cake delivery in faridabad, online cake delivery faridabad, eggless cake order faridabad, same day cake delivery faridabad, bakery sector 15 faridabad',
    heroText: 'Faridabad\'s Lighting Fast Cake Delivery Hub',
    subText: 'Indulge in freshly baked pastries and luxury chocolate truffles dispatched straight from our Sector 15 ovens to your doorstep in minutes.',
    deliveryTime: '30 to 45 minutes instant dispatch',
    charge: 'Free delivery above ₹500 across Faridabad',
    faqs: [
      { q: "What is your fastest delivery time in Faridabad?", a: "For our catalog favorites like Belgian Chocolate Truffle and Fresh Fruit cakes, we can bake, pack and deliver in just 30 to 45 minutes." },
      { q: "Do you support surprise midnight deliveries in Faridabad?", a: "Yes, we support premium midnight deliveries between 11:30 PM & 12:00 AM across Faridabad residential sectors." }
    ]
  },
  'designer-cakes-in-noida': {
    city: 'Noida Premium Studio',
    title: 'Customized Designer Theme Cakes in Noida - Custom Studio',
    description: 'Handcrafting spectacular designer cakes, cartoon shapes, makeup boxes, and customized tiered creations in Noida. Pure vegetarian bakes optimized for perfect celebration events.',
    keywords: 'designer cakes in noida, customized theme cake noida, birthday designer cake noida, baby shower cakes noida, top cake shop noida',
    heroText: 'Noida\'s Landmark Designer Cake Studio',
    subText: 'Translate your vision, doodles, or Pinterest boards into delicious hand-sculpted buttercream and edible fondant masterpieces.',
    deliveryTime: '12-24 hours advance ordering',
    charge: 'Calculated at checkout based on location',
    faqs: [
      { q: "Can I choose my own customized shape and character?", a: "Absolutely! Simply drop your reference picture or sketch in our Custom Studio page and mention your flavor preferences." },
      { q: "Are all components of Noida designer cakes edible?", a: "Our hand-sculpted toppers are crafted from premium Swiss fondant paste and are 100% food-safe and delicious." }
    ]
  },
  'custom-cakes-in-gurgaon': {
    city: 'Gurgaon Custom Atelier',
    title: 'Customized & Tiered Theme Cakes in Gurgaon - Cake Urban',
    description: 'Indulge in customized corporate branding cakes, multi-tier wedding confections, and theme birthday cakes in Gurgaon. 100% vegetarian, organic recipes.',
    keywords: 'custom cakes in gurgaon, customized birthday cake gurgaon, kids theme cakes gurugram, dlf phase 3 cake delivery, premium customized bakes',
    heroText: 'Gurgaon\'s Premier Custom Cake Atelier',
    subText: 'Catering luxurious celebrations, kids birthday motifs, and brand launch milestones across DLF, Golf Course Road, and Gurgaon enclaves.',
    deliveryTime: 'Requires 12 to 24 hours prep time',
    charge: 'Free delivery across Golf Course Ext Road',
    faqs: [
      { q: "Can we order customized gift hampers or branding cupcakes?", a: "Yes! We specialize in premium branded bulk corporate bakes and bespoke dessert hampers with edible logo tags." },
      { q: "Do you deliver to cyber sectors and corporate tech parks?", a: "We run fully refrigerated van dispatch routes directly to corporate tech parks and DLF complexes with customized setups." }
    ]
  },
  'photo-cakes-in-ghaziabad': {
    city: 'Ghaziabad Printed Confections',
    title: 'Edible Photo Printed Cake Delivery in Ghaziabad - Cake Urban',
    description: 'Cherish memories with high-resolution edible photo cakes ordered online in Ghaziabad. Certified organic starch ink, fully eggless, and safe cream frosting.',
    keywords: 'photo cakes in ghaziabad, edible picture cake ghaziabad, print photo cake online, custom picture cake delivery',
    heroText: 'High-Res Edible Photo Cakes in Ghaziabad',
    subText: 'Transform your precious family moments, corporate designs, or character poster prints into customized, delicious, safe edible photo frames.',
    deliveryTime: 'Same-day delivery within 2-3 hours',
    charge: 'Calculated based on residential sectors',
    faqs: [
      { q: "Is the photo print paper on the cake edible?", a: "Yes! We use 100% safe, certified vegetarian potato/starch edible sheets and food-grade organic coloring ink." },
      { q: "How should I submit the photo for printing?", a: "You can upload high-resolution images during checkout or custom orders page to ensure a crisp, clean photo print." }
    ]
  }
};

export default function LocationSEOPage() {
  const { pathName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Resolve which config to load
  const routeKey = location.pathname.replace(/^\//, '');
  const data = LOCATION_DATA_MAP[routeKey] || LOCATION_DATA_MAP['bakery-in-faridabad'];

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Filter 4 relevant products to display on the location landing page to encourage instant conversions
  const relevantProducts = FALLBACK_PRODUCTS.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#FAF7F5] pb-24"
    >
      <SEO 
        title={data.title}
        description={data.description}
        keywords={data.keywords}
        schema={{
          "@context": "https://schema.org",
          "@type": "Bakery",
          "name": "Cake Urban",
          "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop",
          "@id": "https://www.cakeurban.com",
          "url": "https://www.cakeurban.com",
          "telephone": "+919876543210",
          "priceRange": "$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Artisanal Enclave, Sector 15",
            "addressLocality": data.city,
            "addressRegion": "NCR",
            "postalCode": "121007",
            "addressCountry": "IN"
          }
        }}
      />

      {/* HEADER SECTION banner */}
      <header className="bg-gradient-to-b from-white to-[#FAF7F5] border-b border-[#E8DDD7]/40 px-6 py-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#DE9088]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#2D150F]/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#DE9088]/10 text-[#cc7a74] px-4 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
            <MapPin className="w-3.5 h-3.5 text-[#DE9088]" />
            <span>Serving {data.city} & Surrounding Enclaves</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-[#2D150F] leading-tight tracking-tight">
            {data.heroText}
          </h1>
          
          <p className="text-xs sm:text-base md:text-lg text-[#3B1F17]/60 max-w-2xl mx-auto italic font-medium leading-relaxed">
            {data.subText}
          </p>

          <div className="flex flex-wrap gap-4 items-center justify-center pt-2">
            <div className="bg-white px-5 py-3.5 rounded-2xl border border-[#E8DDD7]/40 text-[10px] font-black uppercase tracking-widest text-[#2D150F] flex items-center gap-2 shadow-sm">
              <Clock className="w-4 h-4 text-[#DE9088]" />
              <span>{data.deliveryTime}</span>
            </div>
            <div className="bg-white px-5 py-3.5 rounded-2xl border border-[#E8DDD7]/40 text-[10px] font-black uppercase tracking-widest text-[#2D150F] flex items-center gap-2 shadow-sm">
              <Shield className="w-4 h-4 text-[#DE9088]" />
              <span>100% Certified Safe Delivery</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-20">
        
        {/* CONVERSION CATEGORIES */}
        <section className="text-center space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-display font-black text-[#2D150F]">Explore Our Signature Curation</h2>
            <p className="text-[#3B1F17]/50 text-xs sm:text-base italic max-w-lg mx-auto">Selected standard items currently serving {data.city} for instant celebrate checks.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Celebration Cakes', desc: 'Moist Belgium truffle or red velvet custom designs', cat: 'Cakes' },
              { title: 'Single Pastries', desc: 'Slices, fudge brownies and chocolate lava pools', cat: 'Pastries' },
              { title: 'Gifting Hampers', desc: 'Luxury cookies and customized celebratory caskets', cat: 'Hampers' },
              { title: 'Bespoke Studio', desc: 'Brief our master pastry chef with your own references', cat: 'Custom Cakes' }
            ].map((box, i) => (
              <div 
                key={i}
                className="bg-white rounded-[32px] p-6 border border-[#E8DDD7]/40 shadow-sm text-center flex flex-col justify-between group hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-[#DE9088]/15 rounded-2xl flex items-center justify-center mx-auto text-[#DE9088]">
                    <Cake className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-[#2D150F]">{box.title}</h3>
                  <p className="text-[10px] text-[#2D150F]/50 italic leading-snug">{box.desc}</p>
                </div>
                
                <button
                  onClick={() => navigate(`/shop?category=${box.cat}`)}
                  className="mt-6 w-full h-10 rounded-xl bg-[#FAF7F5] group-hover:bg-[#DE9088] group-hover:text-white text-[9px] font-black uppercase tracking-widest text-[#2D150F] flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* RELEVANT RECOMMENDATIONS GRID */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E8DDD7]/40 pb-5">
            <div className="text-left">
              <h3 className="text-xl sm:text-2xl font-display font-black text-[#2D150F]">Bestsellers Ready for Immediate Delivery</h3>
              <p className="text-[10px] sm:text-xs text-[#2D150F]/50 italic">Catering fresh celebrations with premium materials.</p>
            </div>
            <Link to="/shop">
              <button className="h-10 px-6 rounded-xl border border-[#E8DDD7] text-[10px] font-black uppercase text-[#2D150F] hover:bg-[#FAF7F5] transition-colors tracking-widest">
                Browse Full Catalog
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[10px] sm:gap-6 md:gap-8">
            {relevantProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* UNIQUE RICH GEO-LOCATION COPY WRITING & FAQ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-8">
          {/* Dynamic Description Box */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#DE9088]">Premium Standards</span>
            <h3 className="text-2xl sm:text-4xl font-display font-black text-[#2D150F] leading-tight tracking-tight">The Cake Urban Promise</h3>
            
            <div className="space-y-4 text-xs text-[#2D150F]/70 leading-relaxed italic font-medium">
              <p>
                Our baking philosophy centers on culinary excellence. We believe a celebration cake is not just dessert; it is the center ornament of your memory.
              </p>
              <p>
                For our premium patrons in {data.city}, we source real Madagascar vanilla pods, highest grade chocolate ganache, pure local dairy butter, and fresh seasonal fruit coulis.
              </p>
              <p>
                Every hand-designed cake features customizable eggless settings, prepared in separate sanitized ovens to offer the finest vegetarian baking NCR has ever experienced.
              </p>
            </div>

            <div className="space-y-2.5 pt-4">
              <div className="flex items-center gap-2 text-xs font-black text-[#2D150F]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Zero Margarine & Artificial Syrups</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-black text-[#2D150F]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Hygiene Certified Temperature Controlled Transit</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-black text-[#2D150F]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Midnight Surprise Deliveries Activated</span>
              </div>
            </div>
          </div>

          {/* Dynamic FAQ section */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#DE9088]">Help & Service Care</span>
            <h3 className="text-2xl sm:text-4xl font-display font-black text-[#2D150F]">Local FAQs in {data.city}</h3>
            
            <div className="space-y-4">
              {data.faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div 
                    key={index}
                    className="bg-white rounded-2xl border border-[#E8DDD7]/40 overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-start justify-between gap-4 font-bold text-xs sm:text-sm text-[#2D150F] hover:bg-[#FAF7F5]/50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <span className="text-sm text-[#DE9088] font-black">{isOpen ? '−' : '+'}</span>
                    </button>
                    
                    {isOpen && (
                      <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-[#2D150F]/65 leading-relaxed font-semibold italic border-t border-[#FAF7F5]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Extra Conversion Card */}
            <div className="bg-[#DE9088]/10 rounded-3xl p-6 sm:p-8 flex items-center justify-between flex-wrap gap-4 mt-8">
              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-[#2D150F]">Need custom catering?</h4>
                <p className="text-[10px] text-[#2D150F]/60 font-semibold italic">Tiered baby shower cakes, wedding setups, and luxury gift orders.</p>
              </div>
              <Link to="/custom-order">
                <button className="h-11 px-5 rounded-xl bg-[#2D150F] text-white hover:bg-[#DE9088] text-[9px] font-black uppercase tracking-widest shadow-md transition-all">
                  Brief the Chef
                </button>
              </Link>
            </div>

          </div>
        </section>

      </div>
    </motion.div>
  );
}
