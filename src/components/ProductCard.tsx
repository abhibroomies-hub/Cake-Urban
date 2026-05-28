import React from 'react';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '../lib/store';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-[32px] overflow-hidden border border-[#E8DDD7]/40 shadow-[0_12px_40px_rgba(45,21,15,0.04)] hover:shadow-[0_20px_50px_rgba(45,21,15,0.08)] hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col"
    >
      <div className="relative overflow-hidden aspect-square p-2.5 bg-[#FAF7F5]/30">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600'} 
            className="w-full h-full object-cover rounded-[24px] md:rounded-[28px] transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
            alt={product.name}
          />
        </Link>
        <div className="absolute top-5 left-5 flex flex-col gap-1.5 z-10">
            {product.isBestseller && (
              <div className="bg-[#2D150F] text-white px-2.5 py-1 rounded-md text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] shadow-sm">
                Bestseller
              </div>
            )}
            {product.isNew && (
               <div className="bg-[#DE9088] text-white px-2.5 py-1 rounded-md text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] shadow-sm">
                  New
               </div>
            )}
        </div>
      </div>

      <div className="px-5 pb-5 pt-3.5 flex flex-col flex-grow bg-white">
        <div className="flex-grow space-y-2">
          {/* Rating and Delivery Info Row */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-black tracking-wider uppercase mb-1">
            <div className="flex items-center gap-1 bg-[#DE9088]/10 text-[#cc7a74] px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 fill-[#DE9088] text-[#DE9088]" strokeWidth={0} />
              <span>4.9 (42)</span>
            </div>
            <span className="text-[#2D150F]/40 font-bold shrink-0">30-60m delivery</span>
          </div>

          <Link to={`/product/${product.id}`} className="block">
            <h4 className="text-[15px] sm:text-lg font-display font-black leading-tight text-[#2D150F] group-hover:text-[#DE9088] transition-colors line-clamp-1">{product.name}</h4>
          </Link>
          
          <p className="text-[#2D150F]/50 text-[10px] sm:text-xs md:text-sm font-medium italic min-h-[30px] sm:min-h-[40px] line-clamp-2 leading-relaxed">{product.description}</p>
          
          <div className="flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block border border-white shadow-sm animate-pulse" />
            <span className="text-[8px] sm:text-[9px] uppercase font-black tracking-[0.1em] text-emerald-600">100% Eggless Option</span>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-5 flex items-center justify-between pt-3 border-t border-[#FAF7F5]">
          <div className="text-base sm:text-xl font-serif font-black text-[#2D150F] italic tracking-tighter">
            ₹{product.price} <span className="text-[8px] sm:text-[10px] font-sans font-black text-[#2D150F]/30 uppercase tracking-widest not-italic">/ 0.5kg</span>
          </div>
          <button 
            onClick={() => addItem(product)}
            className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#DE9088] hover:bg-[#2D150F] text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center transform active:scale-95"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 h-5 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
