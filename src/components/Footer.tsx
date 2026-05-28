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

      {/* Extreme Bottom details */}
      <div className="bg-[#200D09] py-8 border-t border-[#3B1F17]/10 text-center text-[10px] text-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Cake Urban. Elite Gourmet Pastry Group. All rights reserved.</p>
          <p className="flex items-center gap-1 italic">
            Handcrafted with <Heart className="w-3 h-3 text-[#DE9088] fill-[#DE9088]" /> in Faridabad, Delhi NCR.
          </p>
        </div>
      </div>

    </footer>
  );
}
