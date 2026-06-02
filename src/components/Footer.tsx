import { Instagram, Facebook, Mail, MapPin, Phone, MessageCircle, Heart, Sparkles, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#2D150F] text-white border-t border-[#3B1F17] relative z-20">
      
      {/* Upper Footer: Premium Newsletter & Trust Badge */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 border-b border-[#3B1F17]/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 text-left space-y-2">
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#DE9088] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Luxury Experience Club
            </span>
            <p className="text-xl sm:text-2xl font-serif font-medium tracking-tight italic text-amber-50/90">
              Subscribe for chef special releases & weekend hampers
            </p>
          </div>
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-3">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="bg-white/5 border-[#3B1F17] text-white placeholder:text-white/30 h-12 rounded-xl text-xs font-semibold focus-visible:ring-[#DE9088] focus-visible:ring-offset-0" 
            />
            <Button className="bg-[#DE9088] hover:bg-white hover:text-[#2D150F] text-[10px] font-black uppercase tracking-wider h-12 px-8 rounded-xl shrink-0 transition-colors">
              Join Elite Club
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-10">
        
        {/* Branch 1: Brand & Bio */}
        <div className="col-span-2 lg:col-span-4 text-left space-y-5">
          <h4 className="text-3xl font-display font-black tracking-tight text-white">
            Cake<span className="text-[#DE9088] font-serif font-light italic">Urban</span>
          </h4>
          <p className="text-[#f3ddd6]/70 leading-relaxed text-xs sm:text-sm font-medium italic">
            Elite online bakery presenting Chef-curated regular cakes, instant high-quality single-slice treats, and spectacular custom celebration designs hand-catering Delhi, Noida, Gurgaon, and Faridabad.
          </p>
          <div className="flex items-center gap-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#DE9088]/20 flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/5">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#DE9088]/20 flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/5">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="mailto:hello@cakeurban.com" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#DE9088]/20 flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/5">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Branch 2: General & Gifting */}
        <div className="col-span-1 lg:col-span-2 text-left space-y-4">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-[#DE9088] border-b border-white/5 pb-2">Patron Care</h5>
          <div className="space-y-2.5 text-xs text-[#f3ddd6]/80 font-semibold italic">
            <Link to="/" className="block hover:text-[#DE9088] transition">Home</Link>
            <Link to="/shop" className="block hover:text-[#DE9088] transition">Shop Boutique</Link>
            <Link to="/custom-order" className="block hover:text-[#DE9088] transition">Custom Studio</Link>
            <Link to="/blog" className="block hover:text-[#DE9088] transition flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-[#DE9088]" />The Cake Diaries</Link>
            <Link to="/about" className="block hover:text-[#DE9088] transition">Our Story</Link>
            <Link to="/contact" className="block hover:text-[#DE9088] transition">Contact Chef</Link>
          </div>
        </div>

        {/* Branch 3: Delhi NCR Hub links (SEO local business maps) */}
        <div className="col-span-1 lg:col-span-3 text-left space-y-4">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-[#DE9088] border-b border-white/5 pb-2">Location Landing hubs</h5>
          <div className="space-y-2 text-[11px] text-[#f3ddd6]/80 font-medium italic">
            <Link to="/bakery-in-delhi" className="block hover:text-[#DE9088] transition flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#DE9088]" />Bakery in South Delhi</Link>
            <Link to="/bakery-in-noida" className="block hover:text-[#DE9088] transition flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#DE9088]" />Premium Oven Noida</Link>
            <Link to="/bakery-in-gurgaon" className="block hover:text-[#DE9088] transition flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#DE9088]" />DLF Gourmet Gurgaon</Link>
            <Link to="/bakery-in-faridabad" className="block hover:text-[#DE9088] transition flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#DE9088]" />Main Bakery Faridabad</Link>
          </div>
          <h5 className="text-[9px] font-black uppercase tracking-widest text-amber-100 border-b border-white/5 pt-4 pb-1">Specialty Hubs</h5>
          <div className="space-y-1.5 text-[10px] text-stone-200/80 font-medium italic">
            <Link to="/cake-delivery-in-faridabad" className="block hover:text-amber-300 transition">⚡ Eggless Delivery Faridabad</Link>
            <Link to="/designer-cakes-in-noida" className="block hover:text-amber-300 transition">🎨 Designer Theme Noida</Link>
            <Link to="/custom-cakes-in-gurgaon" className="block hover:text-amber-300 transition">🏢 Corporate & Tiered Gurgaon</Link>
            <Link to="/photo-cakes-in-ghaziabad" className="block hover:text-amber-300 transition">📸 Photo Print Ghaziabad</Link>
          </div>
        </div>

        {/* Branch 4: Specialty niches */}
        <div className="col-span-2 lg:col-span-3 text-left space-y-4">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-[#DE9088] border-b border-white/5 pb-2">Dedicated Niche Celebs</h5>
          <div className="space-y-2 text-[11px] text-[#f3ddd6]/80 font-medium italic">
            <Link to="/custom-cakes-noida" className="block hover:text-[#DE9088] transition">Theme Design Studio Noida</Link>
            <Link to="/birthday-cakes-delhi" className="block hover:text-[#DE9088] transition">Birthday Surprise Delivery Delhi</Link>
            <Link to="/anniversary-cakes-faridabad" className="block hover:text-[#DE9088] transition">Wedding Anniversary Faridabad</Link>
            <div className="pt-2 border-t border-white/5 mt-2 text-[9px] text-white/50 text-left">
              <span className="font-bold text-white/70 block">Support lines:</span>
              <span>Available 9:00 AM - Midnight daily. Friendly help on Whatsapp.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Localized Sector and Area Targeting SEO Hubs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-t border-[#3B1F17]/30 pt-10">
        <div className="text-left space-y-4">
          <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#DE9088] flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#DE9088]" /> Popular Area Delivery Sectors (Local SEO Hubs)
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-[11px] font-medium italic text-[#f3ddd6]/70">
            <div className="space-y-1.5">
              <span className="font-bold text-white text-[10px] block not-italic uppercase tracking-wider text-[#DE9088]">Faridabad Sectors</span>
              <Link to="/cake-delivery-faridabad-sector-31" className="block hover:text-[#DE9088] transition font-bold text-[#DE9088]">Sector 31 & NIT (15km radius)</Link>
              <Link to="/cake-delivery-faridabad-sector-15" className="block hover:text-[#DE9088] transition">Sector 15 Faridabad</Link>
              <Link to="/bakery-in-faridabad" className="block hover:text-[#DE9088] transition">Sector 14 & 21 Faridabad</Link>
              <Link to="/best-cake-in-greenfield-faridabad" className="block hover:text-[#DE9088] transition font-bold text-[#DE9088]">Best Cake in Greenfield</Link>
            </div>
            <div className="space-y-1.5">
              <span className="font-bold text-white text-[10px] block not-italic uppercase tracking-wider text-[#DE9088]">Noida Sectors</span>
              <Link to="/cake-delivery-noida-sector-62" className="block hover:text-[#DE9088] transition">Noida Sector 62</Link>
              <Link to="/bakery-in-noida" className="block hover:text-[#DE9088] transition">Noida Sector 15 & 18</Link>
              <Link to="/designer-cakes-in-noida" className="block hover:text-[#DE9088] transition">Noida Sector 137 & 150</Link>
            </div>
            <div className="space-y-1.5">
              <span className="font-bold text-white text-[10px] block not-italic uppercase tracking-wider text-[#DE9088]">Gurgaon Sectors</span>
              <Link to="/cake-delivery-gurgaon-dlf" className="block hover:text-[#DE9088] transition">DLF Phase 1-5 Gurgaon</Link>
              <Link to="/custom-cakes-in-gurgaon" className="block hover:text-[#DE9088] transition">Golf Course Road</Link>
              <Link to="/bakery-in-gurgaon" className="block hover:text-[#DE9088] transition">Sohna Road Gurgaon</Link>
            </div>
            <div className="space-y-1.5">
              <span className="font-bold text-white text-[10px] block not-italic uppercase tracking-wider text-[#DE9088]">Delhi Areas</span>
              <Link to="/cake-delivery-delhi-dwarka" className="block hover:text-[#DE9088] transition">Dwarka Delhi</Link>
              <Link to="/bakery-in-delhi" className="block hover:text-[#DE9088] transition">South Delhi (Saket, GK)</Link>
              <Link to="/birthday-cakes-delhi" className="block hover:text-[#DE9088] transition">West Delhi (Punjabi Bagh)</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Extreme Bottom details */}
      <div className="bg-[#200D09] py-8 border-t border-[#3B1F17]/10 text-center text-[10px] text-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Cake Urban. Elite Gourmet Pastry Group. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#f3ddd6]/40">
            <Link to="/legal" className="hover:text-[#DE9088] transition">Terms & Conditions</Link>
            <span>•</span>
            <Link to="/legal" className="hover:text-[#DE9088] transition">Privacy Policy</Link>
            <span>•</span>
            <Link to="/legal" className="hover:text-[#DE9088] transition">Delivery & Refund Policies</Link>
          </div>
          <p className="flex items-center gap-1 italic">
            Handcrafted with <Heart className="w-3 h-3 text-[#DE9088] fill-[#DE9088]" /> in Faridabad, Delhi NCR.
          </p>
        </div>
      </div>

    </footer>
  );
}
