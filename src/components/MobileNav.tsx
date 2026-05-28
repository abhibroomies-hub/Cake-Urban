import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useUI, useCart } from '../lib/store';

export function MobileNav() {
  const location = useLocation();
  const { setSearchOpen } = useUI();
  const cartItems = useCart((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const NAV_ITEMS = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid, label: 'Categories', path: '/shop' },
    { icon: Search, label: 'Search', action: () => setSearchOpen(true) },
    { icon: Heart, label: 'Wishlist', path: '/account' },
    { icon: ShoppingBag, label: 'Cart', path: '/cart', badge: cartCount },
    { icon: User, label: 'Profile', path: '/account' },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-[440px]">
      <nav className="bg-white/80 backdrop-blur-2xl border border-[#E8DDD7] rounded-[32px] p-2 flex items-center justify-between shadow-[0_20px_50px_-10px_rgba(80,40,20,0.2)]">
        {NAV_ITEMS.map((item, index) => {
          const isActive = item.path ? location.pathname === item.path : false;
          
          const itemContent = (
            <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-[22px] transition-all duration-500 relative ${
              isActive ? 'text-[#D89C95] bg-[#D89C95]/10 font-bold' : 'text-[#3B1F17]/50 hover:text-[#3B1F17]'
            }`}>
              <item.icon className="w-4.5 h-4.5 mb-0.5" strokeWidth={2.5} />
              <span className="text-[7px] font-black uppercase tracking-tighter leading-none">{item.label}</span>
              
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D89C95] text-white text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center border border-white">
                  {item.badge}
                </span>
              )}
              
              {isActive && (
                <motion.div 
                  layoutId="activeBubble"
                  className="absolute -bottom-1 w-1 h-1 bg-[#D89C95] rounded-full"
                />
              )}
            </div>
          );

          if (item.action) {
            return (
              <button 
                key={index} 
                onClick={item.action}
                className="focus:outline-none shrink-0"
              >
                {itemContent}
              </button>
            );
          }

          return (
            <Link
              key={index}
              to={item.path || '#'}
              className="shrink-0"
            >
              {itemContent}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
