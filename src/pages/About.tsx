import React from 'react';
import { motion } from 'motion/react';
import { Heart, Star, Cake } from 'lucide-react';
import SEO from '../components/SEO';

export default function About() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-6 py-20 md:py-32"
    >
      <SEO 
        title="Our Story & Culinary Heritage - Cake Urban"
        description="Learn about Cake Urban's journey. Discover how Faridabad's premier boutique bakery handcrafts luxury designer cakes and premium hampers with unmatched quality since 2026."
        keywords="about cake urban, premium bakery heritage, artisan bakers faridabad, elite cake designers delhi"
      />
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-display font-black text-[#3B1F17] tracking-tight">Our Story</h1>
          <p className="text-[#D89C95] text-xl font-serif italic">Baking memories since 2020</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="rounded-[40px] overflow-hidden aspect-square shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800" 
              className="w-full h-full object-cover"
              alt="Artisan Bakery"
            />
          </div>
          <div className="space-y-6 text-[#3B1F17]/70 leading-relaxed font-medium italic text-lg">
            <p>At CakeUrban, we believe that every cake tells a story. What started as a passion for creating beautiful desserts in a small home kitchen in Faridabad has grown into a premier artisan bakery.</p>
            <p>Our lead artisan recipes blend traditional baking techniques with modern design aesthetics, ensuring that every bite is as delicious as it is stunning.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
          {[
            { icon: Heart, title: 'Made with Love', desc: 'Every cake is handcrafted with the finest ingredients.' },
            { icon: Star, title: 'Quality First', desc: 'We never compromise on taste or freshness.' },
            { icon: Cake, title: 'Custom Art', desc: 'Your imagination is our blueprint.' }
          ].map((benefit, i) => (
            <div key={i} className="bg-white p-8 rounded-[32px] border border-[#E8DDD7] text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-[#D89C95]/10 rounded-full flex items-center justify-center mx-auto">
                <benefit.icon className="w-8 h-8 text-[#D89C95]" />
              </div>
              <h3 className="text-xl font-display font-bold text-[#3B1F17]">{benefit.title}</h3>
              <p className="text-sm text-[#3B1F17]/50 font-medium italic">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
