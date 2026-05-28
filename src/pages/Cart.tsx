import React from 'react';
import { useCart } from '../lib/store';
import { Button } from '../components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-[#F8F4F1] rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-[#E8DDD7]" />
        </div>
        <h2 className="text-3xl font-extrabold text-[#3B1F17] mb-4">Your bag is empty</h2>
        <p className="text-[#3B1F17]/50 max-w-sm mb-8 italic">Looks like you haven't added any artisanal creations to your bag yet. Let's explore the boutique!</p>
        <Link to="/shop">
          <Button size="lg" className="rounded-full bg-[#3B1F17] hover:bg-[#2A1610] h-14 px-10 text-lg font-bold">
            Explore Boutique
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-6 md:px-10 py-12 md:py-24"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-20">
        <div className="space-y-4 text-center md:text-left">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#D89C95] italic">Collection</h4>
            <h2 className="text-4xl md:text-5xl font-display font-black text-[#3B1F17] tracking-tighter leading-tight">Your <span className="italic font-serif font-light text-[#D89C95]">Shopping Bag</span></h2>
        </div>
        <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#3B1F17]/40 px-6 py-2.5 bg-white rounded-full border border-[#E8DDD7] shadow-sm italic hidden md:block">
            Curating {items.length} artisanal selections
        </div>
      </div>
      
      <div className="flex flex-col xl:flex-row gap-12 md:gap-20">
        {/* Cart Items */}
        <div className="flex-grow space-y-6 md:space-y-8">
          <AnimatePresence mode='popLayout'>
            {items.map((item) => (
              <motion.div 
                key={`${item.id}-${item.selectedWeight}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col sm:flex-row items-center gap-6 md:gap-10 p-6 md:p-10 bg-white border border-[#E8DDD7] rounded-[40px] md:rounded-[48px] shadow-sm hover:translate-x-2 transition-all duration-500"
              >
                <div className="w-24 md:w-32 h-24 md:h-32 rounded-3xl md:rounded-[32px] overflow-hidden bg-[#F8F4F1] shrink-0 border border-[#E8DDD7] p-2 md:p-3">
                  <img src={item.images?.[0] || 'https://picsum.photos/seed/cart/200/200'} className="w-full h-full object-cover rounded-2xl md:rounded-[20px]" alt={item.name} />
                </div>
                
                <div className="flex-grow space-y-3 text-center sm:text-left">
                  <h3 className="font-display font-bold text-[#3B1F17] text-xl md:text-2xl tracking-tight leading-tight">{item.name}</h3>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#3B1F17]/60">
                    {item.selectedWeight && <span className="px-3 py-1 bg-[#F8F4F1] rounded-full">{item.selectedWeight}kg</span>}
                    {item.selectedFlavor && <span className="px-3 py-1 bg-[#F8F4F1] rounded-full">{item.selectedFlavor}</span>}
                    {item.eggless && <span className="px-3 py-1 bg-[#D89C95]/10 text-[#D89C95] rounded-full">Eggless</span>}
                  </div>
                  {item.cakeMessage && <p className="text-[10px] md:text-xs italic text-[#D89C95] font-serif mt-2 opacity-60">Annotation: "{item.cakeMessage}"</p>}
                </div>

                <div className="flex flex-row sm:flex-row items-center justify-between sm:justify-end gap-6 md:gap-10 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-none border-[#E8DDD7]">
                  <div className="flex items-center bg-[#F8F4F1] rounded-2xl p-1 shrink-0 border border-[#E8DDD7]">
                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedWeight)} className="h-10 w-10 text-[#3B1F17] hover:bg-white">
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-10 text-center font-black text-[#3B1F17] text-[10px]">{item.quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedWeight)} className="h-10 w-10 text-[#3B1F17] hover:bg-white">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="text-right shrink-0 min-w-[80px] md:min-w-[100px]">
                    <p className="text-xl md:text-2xl font-serif font-bold text-[#3B1F17] italic leading-none">₹{item.price * item.quantity}</p>
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#3B1F17]/30 mt-1.5 md:mt-1">₹{item.price} each</p>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeItem(item.id, item.selectedWeight)}
                    className="text-[#3B1F17]/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-6 md:pt-10">
             <Button variant="ghost" onClick={clearCart} className="text-[#3B1F17]/40 hover:text-red-400 font-black text-[10px] uppercase tracking-[0.2em] transition-colors leading-none">
                 Dissolve Bag
             </Button>
             <Link to="/shop" className="w-full sm:w-auto">
                <Button variant="ghost" className="w-full sm:w-auto text-[#D89C95] font-black text-[10px] uppercase tracking-[0.2em] italic hover:bg-[#D89C95]/5 border border-[#D89C95]/10 sm:border-none py-4 sm:py-2 rounded-2xl sm:rounded-none">Continue Browsing Boutique</Button>
             </Link>
          </div>
        </div>

        {/* Summary Card */}
        <div className="w-full xl:w-[400px] space-y-8 mt-12 xl:mt-0">
          <div className="bg-white border border-[#E8DDD7] rounded-[60px] p-8 md:p-12 sticky top-28 shadow-xl">
            <h3 className="text-3xl font-serif font-bold text-[#3B1F17] mb-8 md:mb-10 tracking-tighter">Order Summary</h3>
            <div className="space-y-6 mb-8 md:mb-10">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-[#3B1F17]/60">
                <span>Artistic Value</span>
                <span className="text-[#3B1F17]">₹{getTotal()}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-[#3B1F17]/60">
                <span>Logistics</span>
                <span className="text-[#D89C95]">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-[#3B1F17]/60">
                <span>Curation Tax</span>
                <span className="text-[#3B1F17]/30 italic">Included</span>
              </div>
            </div>
            <div className="border-t border-[#E8DDD7] pt-8 md:pt-10 mb-8 md:mb-10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3B1F17]">Final Total</span>
                <span className="text-4xl font-serif font-bold text-[#D89C95] italic leading-none">₹{getTotal()}</span>
              </div>
            </div>
            <Button 
              className="w-full h-20 rounded-[32px] bg-[#3B1F17] hover:bg-[#2A1610] text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-between px-10 shadow-2xl transition-all duration-300"
              onClick={() => navigate('/checkout')}
            >
              Secure Order
              <ArrowRight className="w-5 h-5 ml-2 opacity-40 shrink-0" />
            </Button>
            
            <div className="mt-12 pt-10 border-t border-[#E8DDD7] space-y-6">
                <p className="text-[9px] text-center text-[#3B1F17]/40 font-black uppercase tracking-[0.2em] leading-loose">
                    100% SECURE PAYMENTS • FREE FARIDABAD DELIVERY • ARTISAN CRAFTED
                </p>
                <div className="flex justify-center gap-4">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#D89C95]" />
                   <div className="w-1.5 h-1.5 rounded-full bg-[#3B1F17]" />
                   <div className="w-1.5 h-1.5 rounded-full bg-[#E8DDD7]" />
                </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
