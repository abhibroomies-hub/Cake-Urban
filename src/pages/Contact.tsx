import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import SEO from '../components/SEO';

export default function Contact() {
  return (
    <div className="min-h-screen bg-transparent">
      <SEO 
        title="Contact Chef & Customer Service - Cake Urban"
        description="Connect with Cake Urban's head chef and order support desk. Reach us via Phone, Mail, or WhatsApp for same-day delivery query or customization booking support in Faridabad and across Delhi NCR."
        keywords="contact cake urban, bakery phone faridabad, cake shop customer service delhi, order custom cakes ncr"
      />
      {/* Hero Section */}
      <section className="container mx-auto px-10 py-32 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D89C95] opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />
        <motion.h4 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] uppercase tracking-[0.5em] font-black text-[#D89C95] italic">Get in Touch</motion.h4>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl md:text-8xl font-display font-black text-[#3B1F17] tracking-tighter leading-none">
            The Artisan <span className="italic font-serif font-light text-[#D89C95] block md:inline">Connection.</span>
        </motion.h1>
      </section>

      {/* Info Grid */}
      <section className="container mx-auto px-10 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4 space-y-12">
            {/* Contact Items */}
            <div className="space-y-10">
              <div className="flex gap-8 group">
                <div className="w-16 h-16 bg-white rounded-[24px] border border-[#E8DDD7] shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <Phone className="w-6 h-6 text-[#D89C95]" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B1F17]/40">Voice Channel</p>
                  <p className="text-xl font-display font-bold text-[#3B1F17]">+91 98765 43210</p>
                  <p className="text-xs text-[#3B1F17]/40 italic">Available 9am - 9pm IST</p>
                </div>
              </div>

              <div className="flex gap-8 group">
                <div className="w-16 h-16 bg-white rounded-[24px] border border-[#E8DDD7] shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <Mail className="w-6 h-6 text-[#D89C95]" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B1F17]/40">Digital Correspondence</p>
                  <p className="text-xl font-display font-bold text-[#3B1F17]">hello@cakeurban.com</p>
                  <p className="text-xs text-[#3B1F17]/40 italic">Response within 24 hours</p>
                </div>
              </div>

              <div className="flex gap-8 group">
                <div className="w-16 h-16 bg-white rounded-[24px] border border-[#E8DDD7] shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <MapPin className="w-6 h-6 text-[#D89C95]" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B1F17]/40">The Studio</p>
                  <p className="text-xl font-display font-bold text-[#3B1F17] italic">Faridabad, Haryana</p>
                  <p className="text-xs text-[#3B1F17]/40 italic">Curating excellence since 2024</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-12 border-t border-[#E8DDD7] space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3B1F17]">Urban Communities</p>
                <div className="flex gap-4">
                    {[Instagram, Facebook, Twitter].map((Icon, i) => (
                        <button key={i} className="w-12 h-12 bg-white border border-[#E8DDD7] rounded-xl flex items-center justify-center hover:bg-[#D89C95] hover:text-white transition-all duration-300">
                            <Icon className="w-5 h-5" />
                        </button>
                    ))}
                </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <Card className="rounded-[60px] border-none shadow-2xl bg-white overflow-hidden">
               <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-16 space-y-10 order-2 md:order-1">
                     <div className="space-y-4">
                         <h3 className="text-4xl font-serif font-bold text-[#3B1F17] tracking-tighter">Compose a <span className="italic font-serif font-light text-[#D89C95] text-5xl">Letter.</span></h3>
                         <p className="text-xs text-[#3B1F17]/40 italic font-medium italic">Whether general curiosity or specific requisition, we await your message.</p>
                     </div>

                     <form className="space-y-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.3em] opacity-40">Identity</label>
                           <Input className="h-16 rounded-2xl border-none bg-[#F8F4F1] shadow-inner p-6" placeholder="Your Name" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.3em] opacity-40">Digital Portal</label>
                           <Input className="h-16 rounded-2xl border-none bg-[#F8F4F1] shadow-inner p-6" placeholder="Email Address" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.3em] opacity-40">The Requisition</label>
                           <textarea className="w-full min-h-[120px] rounded-[32px] border-none bg-[#F8F4F1] shadow-inner p-8 text-[#3B1F17] outline-none focus:ring-1 focus:ring-[#D89C95] font-medium placeholder:text-[#3B1F17]/20" placeholder="A message of curiosity..." />
                        </div>
                        <Button className="w-full h-20 rounded-[32px] bg-[#3B1F17] hover:bg-[#2A1610] text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl transition-all">
                            Dispatch Message
                        </Button>
                     </form>
                  </div>
                  <div className="relative h-80 md:h-auto order-1 md:order-2">
                     <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover" alt="Artisan Cake" />
                     <div className="absolute inset-0 bg-[#3B1F17]/10 backdrop-blur-[2px]" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="p-10 bg-white/10 backdrop-blur-md rounded-[48px] border border-white/20 text-center max-w-[280px] space-y-4">
                           <Clock className="w-8 h-8 text-[#D89C95] mx-auto mb-2" />
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Curator Hours</p>
                           <p className="text-xl font-serif font-bold text-white italic">Mon — Sun</p>
                           <p className="text-xs text-white/50 font-medium italic">Faridabad's midnight artisan at your service.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
