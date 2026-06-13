import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Cake, 
  LogOut, 
  Settings, 
  LayoutDashboard, 
  Sparkles, 
  Heart, 
  ChevronDown, 
  MapPin, 
  BookOpen, 
  ShoppingBag, 
  Utensils, 
  Gift,
  ArrowRight,
  Smile,
  Bell,
  Truck,
  Share2,
  HelpCircle,
  Ticket
} from 'lucide-react';
import { useUI, useCart } from '../lib/store';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FALLBACK_PRODUCTS } from '../lib/fallbackProducts';
import { toast } from 'sonner';

interface Sublink {
  label: string;
  href: string;
  isBold?: boolean;
  desc?: string;
}

interface Column {
  title?: string;
  items: Sublink[];
}

interface MenuItem {
  label: string;
  href?: string;
  dropdown?: {
    type: 'columns' | 'categories';
    columns?: Column[];
    items?: Sublink[];
  };
}

const NAVIGATION_MENU: MenuItem[] = [
  {
    label: 'Home',
    href: '/'
  },
  {
    label: 'Cakes',
    dropdown: {
      type: 'columns',
      columns: [
        {
          title: 'Specialty Cakes',
          items: [
            { label: 'Birthday Cakes', href: '/birthday-cakes', desc: 'Crafted party showstoppers' },
            { label: 'Anniversary Cakes', href: '/anniversary-cakes', desc: 'Bespoke romantic formats' },
            { label: 'Photo Cakes', href: '/photo-cake-faridabad', desc: 'Edible high-def memories' },
            { label: 'Designer Cakes', href: '/designer-cakes-faridabad', desc: 'Custom structural formats' },
            { label: 'Theme Cakes', href: '/custom-cakes-faridabad', desc: 'Character & kids collection' },
            { label: 'Custom Cakes', href: '/custom-cakes', desc: 'Oven-baked dream ideas' },
            { label: 'Wedding Cakes', href: '/wedding-cakes', desc: 'Elegant grand multi-tier bakes' },
            { label: 'Eggless Cakes', href: '/eggless-cakes-faridabad', isBold: true, desc: '100% pure vegetarian-certified' },
          ]
        },
        {
          title: 'By Flavor',
          items: [
            { label: 'Belgian Chocolate', href: '/chocolate-cakes', desc: 'Rich 54.5% cocoa ganache' },
            { label: 'Red Velvet Deluxe', href: '/red-velvet-cakes', desc: 'Silky cream cheese pairings' },
            { label: 'Butterscotch Crunch', href: '/butterscotch-cakes', desc: 'House praline & caramel' },
            { label: 'Juicy Pineapple', href: '/pineapple-cakes', desc: 'Caramelized sunshine slices' },
            { label: 'Classic Black Forest', href: '/black-forest-cakes', desc: 'Dark cherry luxury layers' },
            { label: 'Fresh Strawberry', href: '/strawberry-cakes', desc: 'Organic stewed berry curd' },
          ]
        },
        {
          title: 'Delivery Service',
          items: [
            { label: 'Same Day Delivery', href: '/same-day-cake-delivery', isBold: true, desc: 'Rapid 30-min doorstep transit' },
            { label: 'Midnight Delivery', href: '/midnight-cake-delivery', isBold: true, desc: 'Guaranteed 11:30 PM - 12:00 AM' }
          ]
        }
      ]
    }
  },
  {
    label: 'Pastries',
    dropdown: {
      type: 'categories',
      items: [
        { label: 'Chocolate Pastry', href: '/shop?category=Pastries', desc: 'Deep truffle decadence' },
        { label: 'Red Velvet Pastry', href: '/shop?category=Pastries', desc: 'Signature frosting layers' },
        { label: 'Fruit Pastry', href: '/shop?category=Pastries', desc: 'Light vanilla organic custard' },
        { label: 'Truffle Pastry', href: '/shop?category=Pastries', desc: 'Perfect dark fudge finish' },
        { label: 'Cheesecake Slice', href: '/shop?category=Pastries', desc: 'New York baked gourmet crumbs' },
      ]
    }
  },
  {
    label: 'Hampers',
    dropdown: {
      type: 'categories',
      items: [
        { label: 'Birthday Hampers', href: '/shop?category=Hampers', desc: 'Candles, cakes and greeting cards' },
        { label: 'Corporate Hampers', href: '/shop?category=Hampers', desc: 'Sleek custom branded gift trays' },
        { label: 'Festival Hampers', href: '/shop?category=Hampers', desc: 'Traditional dry cake assortments' },
        { label: 'Gift Boxes', href: '/shop?category=Hampers', desc: 'Artisanal macarons & shortbread' },
      ]
    }
  },
  {
    label: 'Custom Cake',
    dropdown: {
      type: 'categories',
      items: [
        { label: 'Design Your Cake', href: '/custom-order', desc: '3D structural real-time builder' },
        { label: 'Upload Reference Image', href: '/custom-order', desc: 'Share visual drafts with chefs' },
        { label: '2 Tier Cakes', href: '/2-tier-cakes', desc: 'Perfect for intimate gatherings' },
        { label: '3 Tier Cakes', href: '/3-tier-cakes', desc: 'Centerpiece wedding monuments' },
        { label: 'Fondant Cakes', href: '/fondant-cakes', desc: 'Smooth sugar clay artisan work' },
        { label: 'Corporate Cakes', href: '/corporate-cakes', desc: 'Sleek custom-logo milestones' },
      ]
    }
  },
  {
    label: 'Delivery Areas',
    dropdown: {
      type: 'columns',
      columns: [
        {
          title: 'Faridabad Hub',
          items: [
            { label: 'Sector 15 Faridabad', href: '/cake-delivery-faridabad-sector-15' },
            { label: 'Sector 16 Faridabad', href: '/best-cake-shop-in-faridabad' },
            { label: 'Sector 21C / 21', href: '/cake-shop-in-faridabad' },
            { label: 'Sector 31 Faridabad', href: '/cake-delivery-faridabad-sector-31' },
            { label: 'NIT Faridabad', href: '/cake-shop-in-faridabad' },
            { label: 'Greenfield Colony', href: '/best-cake-in-greenfield-faridabad', isBold: true },
            { label: 'Greater Faridabad', href: '/cake-shop-in-faridabad' },
          ]
        },
        {
          title: 'Delhi NCR Nodes',
          items: [
            { label: 'Delhi Dwarka', href: '/cake-delivery-delhi-dwarka' },
            { label: 'South Delhi Nodes', href: '/cake-delivery-delhi-dwarka' },
            { label: 'Noida Sector 62', href: '/cake-delivery-noida-sector-62' },
            { label: 'Gurgaon DLF Phase 1-5', href: '/cake-delivery-gurgaon-dlf' },
          ]
        }
      ]
    }
  },
  {
    label: 'Blog',
    dropdown: {
      type: 'categories',
      items: [
        { label: 'Cake Design Ideas', href: '/blog', desc: 'Pinterest-worthy layouts' },
        { label: 'Birthday Themes', href: '/blog', desc: 'Curated ideas for kids and milestones' },
        { label: 'Wedding Cake Guide', href: '/blog', desc: 'How to choose flavor & scale' },
        { label: 'Bakery Industry Trends', href: '/blog', desc: 'Artisan ingredients & sugar art' },
        { label: 'Health & Baking Tips', href: '/blog', desc: 'Gluten-free & allergen protocols' },
      ]
    }
  }
];

export function Header() {
  const { setSearchOpen } = useUI();
  const cartItems = useCart((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Custom states for premium navigation experience
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordions, setMobileAccordions] = useState<Record<string, boolean>>({});
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Close profile dropdown on document click (outside drop)
  useEffect(() => {
    const handleOutsideClick = () => {
      setProfileDropdownOpen(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // Sync wishlist from localstorage on mount and whenever sheet opens
  const syncWishlist = () => {
    try {
      const items = localStorage.getItem('cakeurban_wishlist') || '[]';
      // Fallback/mock items for demo or retrieve if user added some
      setWishlistItems(JSON.parse(items));
    } catch (e) {
      setWishlistItems([]);
    }
  };

  useEffect(() => {
    syncWishlist();
    // Wrap localStorage set to trigger event or listen to storage event
    const handleStorageChange = () => syncWishlist();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [wishlistOpen]);

  // Read current pathname to close mobile stuff
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMenu(null);
  }, [location.pathname]);

  const handleLogout = async () => {
    localStorage.removeItem('cakeurban_local_user');
    try {
      await signOut(auth);
    } catch (e) {}
    toast.success("Disconnected securely!");
    navigate('/');
  };

  const toggleMobileAccordion = (label: string) => {
    setMobileAccordions(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#26130F]/85 border-b border-[#DFB15B]/15 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 md:h-22 flex items-center justify-between">
          
          {/* Mobile Menu Icon (Left) */}
          <div className="lg:hidden flex-1 flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="text-white hover:text-[#DFB15B] p-2 transition-colors duration-200"
              aria-label="Open Navigation Directory"
            >
              <Menu className="w-6 h-6 md:w-7 md:h-7" />
            </button>
          </div>

          {/* BRAND LOGO (Left on desktop, Centered on mobile) */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <Link to="/" className="group flex items-center gap-4">
              <div className="relative w-12 h-12 md:w-16 md:h-16 shrink-0 flex items-center justify-center rounded-[18px] overflow-hidden group-hover:scale-105 transition-transform duration-300 bg-[#2D150F] border border-[#DFB15B]/25 shadow-md">
                <img 
                  src="/favicon.png" 
                  alt="Cake Urban Logo" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col text-left justify-center">
                <h1 className="text-2xl md:text-3.5xl font-display font-bold leading-none tracking-tight text-white select-none whitespace-nowrap">
                  Cake<span className="text-[#DFB15B]">Urban</span><span className="text-[#DFB15B]">.</span>
                </h1>
                <p className="text-[8px] md:text-[10px] tracking-[0.25em] md:tracking-[0.28em] uppercase text-[#DFB15B]/90 font-bold mt-1.5 select-none leading-none">
                  Artisan Bakery
                </p>
              </div>
            </Link>
          </div>

          {/* DESKTOP NAV BAR (Centered, Premium structure requested by User) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-black text-[10px] xl:text-xs uppercase tracking-[0.2em] flex-1 justify-center relative">
            {NAVIGATION_MENU.map((menuItem) => {
              const hasDropdown = !!menuItem.dropdown;
              const isActive = activeMenu === menuItem.label;

              return (
                <div 
                  key={menuItem.label}
                  className="relative group py-6"
                  onMouseEnter={() => hasDropdown && setActiveMenu(menuItem.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {/* Menu Button Link */}
                  {menuItem.href ? (
                    <Link 
                      to={menuItem.href} 
                      className="text-[#FFFDFB]/85 hover:text-[#DFB15B] transition-colors duration-200 flex items-center gap-1 py-1"
                    >
                      {menuItem.label}
                    </Link>
                  ) : (
                    <button 
                      className={`text-[#FFFDFB]/85 hover:text-[#DFB15B] transition-colors duration-200 flex items-center gap-1 py-1 ${isActive ? 'text-[#DFB15B]' : ''}`}
                    >
                      {menuItem.label}
                      <ChevronDown className={`w-3.5 h-3.5 text-[#FFFDFB]/40 group-hover:text-[#DFB15B] transition-transform duration-300 ${isActive ? 'rotate-180 text-[#DFB15B]' : ''}`} />
                    </button>
                  )}

                  {/* Underline indicators on active or hover */}
                  <div className="absolute bottom-4 left-0 right-0 h-0.5 bg-[#DFB15B] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                  {/* DROP DOWN OVERLAYS */}
                  <AnimatePresence>
                    {isActive && menuItem.dropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[260px] sm:w-[650px] bg-[#1E0D0A]/95 border-[3px] border-[#DFB15B]/35 shadow-2xl rounded-[32px] p-6 lg:p-8 z-50 text-left overflow-hidden pointer-events-auto backdrop-blur-2xl text-white"
                        style={{
                          width: menuItem.dropdown.type === 'categories' ? '280px' : '720px'
                        }}
                      >
                        {/* Elegant background graphics and colors inside the dropdown */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 bg-[#DFB15B]/10 rounded-full blur-3xl pointer-events-none" />
                        
                        {/* Sub Category lists or double column grids */}
                        {menuItem.dropdown.type === 'columns' && menuItem.dropdown.columns && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-10 font-black">
                            {menuItem.dropdown.columns.map((col, colIdx) => (
                              <div key={colIdx} className="space-y-4">
                                {col.title && (
                                  <h4 className="text-[9px] font-black tracking-widest text-[#DFB15B]/65 uppercase pb-2 border-b border-white/10">
                                    {col.title}
                                  </h4>
                                )}
                                <ul className="space-y-2">
                                  {col.items.map((sub, idx) => (
                                    <li key={idx}>
                                      <Link 
                                        to={sub.href}
                                        className={`group/item block p-1.5 rounded-xl hover:bg-white/5 transition-colors ${sub.isBold ? 'text-[#DFB15B]' : 'text-zinc-200'}`}
                                      >
                                        <div className="font-bold text-xs uppercase tracking-wide flex items-center gap-1 text-zinc-150 group-hover/item:text-[#DFB15B] transition-colors">
                                          {sub.label}
                                          {sub.isBold && <Sparkles className="w-2.5 h-2.5 text-[#DFB15B] shrink-0 fill-[#DFB15B]" />}
                                        </div>
                                        {sub.desc && (
                                          <p className="text-[9px] font-medium text-zinc-400 capitalize italic normal-case tracking-normal leading-tight mt-0.5">
                                            {sub.desc}
                                          </p>
                                        )}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Traditional linear lists (e.g. Pastries, Hampers etc) */}
                        {menuItem.dropdown.type === 'categories' && menuItem.dropdown.items && (
                          <ul className="space-y-1 relative z-10 font-black">
                            {menuItem.dropdown.items.map((sub, idx) => (
                              <li key={idx}>
                                <Link 
                                  to={sub.href}
                                  className="group/item flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                                >
                                  <div>
                                    <div className="font-bold text-xs uppercase tracking-wide text-zinc-100 group-hover/item:text-[#DFB15B] transition-colors">
                                      {sub.label}
                                    </div>
                                    {sub.desc && (
                                      <p className="text-[9px] font-medium text-zinc-400 italic capitalize normal-case tracking-normal mt-0.5">
                                        {sub.desc}
                                      </p>
                                    )}
                                  </div>
                                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 opacity-0 group-hover/item:opacity-100 group-hover/item:text-[#DFB15B] transition-all duration-300 -translate-x-2 group-hover/item:translate-x-0" />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                        
                        {/* Dropdown Footer Branding Promo */}
                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                          <span className="text-[8px] font-black uppercase text-[#DFB15B]/80 tracking-widest flex items-center gap-1">
                            <Smile className="w-3.5 h-3.5 text-amber-400 fill-amber-950/40" /> Veg-Certified & Fresh Prepared
                          </span>
                          <span className="text-[8px] font-black uppercase text-[#DFB15B] tracking-wider">
                            Award Winning Baker Ovens
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* ACTION BUTTONS (Right) - Search, Account, Wishlist, Cart */}
          <div className="flex-1 lg:flex-none flex items-center justify-end gap-2 md:gap-4 font-black">
            
            {/* Search Icon */}
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2.5 text-white hover:text-[#DFB15B] hover:bg-white/5 rounded-xl transition-colors duration-200"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5 md:w-5.5 md:h-5.5" />
            </button>
            
            {/* User Account with Premium Click Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                className={`p-2.5 rounded-xl transition-colors duration-200 flex items-center gap-1 focus:outline-none ${
                  profileDropdownOpen 
                    ? 'text-[#DFB15B] bg-white/5' 
                    : 'text-white hover:text-[#DFB15B] hover:bg-white/5'
                }`}
                aria-label="User Account Menu"
              >
                <User className="w-5 h-5 md:w-5.5 md:h-5.5" />
                <ChevronDown className={`w-3 h-3 opacity-60 transition-transform duration-350 ${profileDropdownOpen ? 'rotate-180 text-[#DFB15B]' : ''}`} />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-3 w-72 bg-[#1C0A05]/95 border-2 border-[#DFB15B]/35 shadow-2xl rounded-[28px] overflow-hidden z-50 backdrop-blur-xl text-left font-sans"
                  >
                    {!user ? (
                      /* Guest User (Login Nahi Hai) */
                      <div className="p-5 space-y-4 text-white">
                        <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                          <div className="w-9 h-9 rounded-full bg-[#DFB15B]/15 flex items-center justify-center text-[#DFB15B]">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black uppercase text-white tracking-widest">Account</h4>
                            <p className="text-[10px] text-zinc-400 font-medium italic">Welcome to Cake Urban</p>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Link 
                            to="/login"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-white/5 hover:text-[#DFB15B] rounded-xl transition-all"
                          >
                            <ArrowRight className="w-3.5 h-3.5 text-[#DFB15B]" />
                            <span>Login</span>
                          </Link>
                          <Link 
                            to="/login?signup=true"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-white/5 hover:text-[#DFB15B] rounded-xl transition-all"
                          >
                            <ArrowRight className="w-3.5 h-3.5 text-[#DFB15B]" />
                            <span>Sign Up</span>
                          </Link>
                          <Link 
                            to="/account?tab=track-order"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-white/5 hover:text-[#DFB15B] rounded-xl transition-all"
                          >
                            <Truck className="w-3.5 h-3.5 text-[#DFB15B]" />
                            <span>Track Order</span>
                          </Link>
                          <Link 
                            to="/account?tab=support"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-white/5 hover:text-[#DFB15B] rounded-xl transition-all"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-[#DFB15B]" />
                            <span>Help & Support</span>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      /* Logged In User */
                      <div className="p-1">
                        <div className="p-4 bg-white/5 border-b border-white/5 flex items-center gap-3 rounded-[24px]">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#DFB15B] to-[#C99A43] text-black font-black flex items-center justify-center text-sm shadow">
                            {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-black text-white uppercase tracking-wider truncate">
                              Hi, {profile?.displayName?.split(' ')[0] || user.displayName?.split(' ')[0] || 'Abhishek'}
                            </h4>
                            <p className="text-[10px] text-zinc-400 select-none italic font-semibold truncate">{user.email}</p>
                          </div>
                        </div>

                        <div className="p-2 space-y-0.5">
                          {/* Block 1 */}
                          <Link 
                            to="/account?tab=profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3.5 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest text-[#DFB15B] hover:bg-white/5 hover:text-white rounded-xl transition-all"
                          >
                            <User className="w-4 h-4 text-[#DFB15B]" />
                            <span>My Profile</span>
                          </Link>
                          <Link 
                            to="/account?tab=orders"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3.5 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest text-zinc-200 hover:bg-white/5 hover:text-[#DFB15B] rounded-xl transition-all"
                          >
                            <ShoppingBag className="w-4 h-4 text-zinc-400" />
                            <span>My Orders</span>
                          </Link>
                          <Link 
                            to="/account?tab=track-order"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3.5 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest text-zinc-200 hover:bg-white/5 hover:text-[#DFB15B] rounded-xl transition-all"
                          >
                            <Truck className="w-4 h-4 text-zinc-400" />
                            <span>Track Order</span>
                          </Link>

                          {/* Line Divider */}
                          <div className="h-px bg-white/10 my-1" />

                          {/* Block 2 */}
                          <Link 
                            to="/account?tab=addresses"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3.5 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest text-zinc-200 hover:bg-white/5 hover:text-[#DFB15B] rounded-xl transition-all"
                          >
                            <MapPin className="w-4 h-4 text-zinc-400" />
                            <span>Saved Addresses</span>
                          </Link>
                          <Link 
                            to="/account?tab=wishlist"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3.5 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest text-zinc-200 hover:bg-white/5 hover:text-[#DFB15B] rounded-xl transition-all"
                          >
                            <Heart className="w-4 h-4 text-zinc-400" />
                            <span>Wishlist</span>
                          </Link>
                          <Link 
                            to="/account?tab=rewards"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3.5 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest text-zinc-200 hover:bg-white/5 hover:text-[#DFB15B] rounded-xl transition-all"
                          >
                            <Ticket className="w-4 h-4 text-zinc-400" />
                            <span>Rewards & Coupons</span>
                          </Link>

                          {/* Line Divider */}
                          <div className="h-px bg-white/10 my-1" />

                          {/* Block 3 */}
                          <Link 
                            to="/account?tab=notifications"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3.5 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest text-zinc-200 hover:bg-white/5 hover:text-[#DFB15B] rounded-xl transition-all"
                          >
                            <Bell className="w-4 h-4 text-zinc-400" />
                            <span>Notifications</span>
                          </Link>
                          <Link 
                            to="/account?tab=refer"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3.5 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest text-zinc-200 hover:bg-white/5 hover:text-[#DFB15B] rounded-xl transition-all"
                          >
                            <Share2 className="w-4 h-4 text-zinc-400" />
                            <span>Refer & Earn</span>
                          </Link>
                          <Link 
                            to="/account?tab=support"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3.5 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest text-zinc-200 hover:bg-white/5 hover:text-[#DFB15B] rounded-xl transition-all"
                          >
                            <HelpCircle className="w-4 h-4 text-zinc-400" />
                            <span>Help & Support</span>
                          </Link>
                          
                          {isAdmin && (
                            <Link 
                              to="/admin"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-3.5 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all"
                            >
                              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                              <span>Admin Dashboard</span>
                            </Link>
                          )}

                          {/* Line Divider */}
                          <div className="h-px bg-white/10 my-1" />

                          {/* Logout */}
                          <button 
                            onClick={async () => {
                              setProfileDropdownOpen(false);
                              localStorage.removeItem('cakeurban_local_user');
                              await signOut(auth);
                              toast.success("Successfully logged out from Cake Urban");
                              navigate('/');
                            }}
                            className="w-full flex items-center gap-3.5 px-3.5 py-2 text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-500/15 rounded-xl transition-all text-left"
                          >
                            <LogOut className="w-4 h-4 text-red-400" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Premium Wishlist Trigger Button */}
            <button 
              onClick={() => {
                syncWishlist();
                setWishlistOpen(true);
              }}
              className="p-2.5 text-white hover:text-[#DFB15B] hover:bg-white/5 rounded-xl transition-colors duration-200 relative"
              aria-label="Open Wishlist"
            >
              <Heart className="w-5 h-5 md:w-5.5 md:h-5.5 hover:scale-105 transition-transform" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#DE9088] text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black animate-scale-up">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <Link to="/cart">
              <button className="bg-white/5 hover:bg-white/10 text-[#DFB15B] hover:text-white h-11 px-3 sm:px-5 rounded-2xl font-black uppercase tracking-[0.16em] text-[10px] md:text-xs flex items-center justify-center relative shadow-sm transition-all duration-300 border border-[#DFB15B]/20">
                <ShoppingCart className="w-4 h-4 md:w-4.5 md:h-4.5 text-[#DFB15B]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#DFB15B] text-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow">
                    {cartCount}
                  </span>
                )}
                <span className="hidden sm:inline ml-2 font-black">Cart</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* MOBILE SITE DRAWER NAVIGATION (COLLAPSIBLE SIDE PANEL) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden flex">
            {/* Dark blur overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#3B1F17]/60 backdrop-blur-md"
            />

            {/* Sliding Container menu */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[320px] bg-[#fffdfc] border-r-[4px] border-[#DFB15B]/20 h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10"
            >
              {/* Header inside Menu */}
              <div>
                <div className="p-6 flex items-center justify-between border-b border-[#E8DDD7]/60 bg-[#F8F4F1]/40">
                  <div className="flex items-center gap-3 text-left">
                    <img 
                      src="/favicon.png" 
                      alt="Cake" 
                      className="w-12 h-12 object-cover bg-[#FAF7F5] border border-[#DE9088]/20 rounded-xl shrink-0" 
                    />
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#2D150F] tracking-tight leading-none">
                        Cake<span className="text-[#DE9088]">Urban</span><span className="text-[#DE9088]">.</span>
                      </h3>
                      <p className="text-[7.5px] uppercase tracking-[0.2em] text-amber-700/80 font-bold mt-1 leading-none">Artisan Bakery</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#3B1F17] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Collapsible Accordions directory */}
                <div className="px-4 py-6 space-y-3">
                  {NAVIGATION_MENU.map((item) => {
                    const hasSub = !!item.dropdown;
                    const isOpen = !!mobileAccordions[item.label];

                    return (
                      <div key={item.label} className="border-b border-[#E8DDD7]/30 pb-2">
                        {item.href ? (
                          <Link 
                            to={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full flex items-center justify-between py-2 text-left text-xs font-black uppercase text-[#3B1F17] hover:text-[#DE9088] tracking-widest"
                          >
                            <span>{item.label}</span>
                          </Link>
                        ) : (
                          <div>
                            <button 
                              onClick={() => toggleMobileAccordion(item.label)}
                              className="w-full flex items-center justify-between py-2 text-left text-xs font-black uppercase text-[#3B1F17] hover:text-[#DE9088] tracking-widest"
                            >
                              <span>{item.label}</span>
                              <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180 text-[#DE9088]' : ''}`} />
                            </button>

                            {/* Dropdown lists inside Accordion */}
                            <AnimatePresence initial={false}>
                              {isOpen && item.dropdown && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden bg-[#F8F4F1]/30 rounded-xl mt-1.5 px-3 py-2 text-left space-y-1.5"
                                >
                                  {item.dropdown.type === 'columns' && item.dropdown.columns?.map((col, idx) => (
                                    <div key={idx} className="space-y-1 py-1">
                                      {col.title && (
                                        <p className="text-[8px] font-black uppercase text-amber-700/50 tracking-wider mb-1 px-1">
                                          {col.title}
                                        </p>
                                      )}
                                      {col.items.map((sub, sIdx) => (
                                        <Link 
                                          key={sIdx} 
                                          to={sub.href}
                                          onClick={() => setMobileMenuOpen(false)}
                                          className={`block py-1.5 px-2.5 rounded-lg text-xs font-bold uppercase transition-colors text-zinc-700 hover:bg-[#DE9088]/10 hover:text-[#DE9088] ${sub.isBold ? 'text-[#DE9088]' : ''}`}
                                        >
                                          {sub.label}
                                        </Link>
                                      ))}
                                    </div>
                                  ))}

                                  {item.dropdown.type === 'categories' && item.dropdown.items?.map((sub, idx) => (
                                    <Link 
                                      key={idx} 
                                      to={sub.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="block py-1.5 px-2.5 rounded-lg text-xs font-bold uppercase text-zinc-700 hover:bg-[#DE9088]/10 hover:text-[#DE9088] transition-colors"
                                    >
                                      {sub.label}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Drawer Footer with simple actions */}
              <div className="p-6 border-t border-[#E8DDD7]/60 bg-[#FAF7F5]/50 text-center space-y-4">
                {user ? (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-[#3B1F17]/60 leading-none">LoggedIn with {user.email}</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('/account');
                        }}
                        className="flex-1 text-[9px] uppercase tracking-wider font-black rounded-lg h-9 bg-[#3B1F17] hover:bg-[#DE9088]"
                      >
                        Account Map
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={handleLogout}
                        className="text-[9px] uppercase tracking-wider font-black rounded-lg h-9 border-red-200 text-red-500 hover:bg-red-50"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    className="w-full text-[10px] uppercase tracking-wider font-black rounded-xl h-11 bg-[#DE9088] hover:bg-[#3B1F17] text-white"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/login');
                    }}
                  >
                    Enter Baking Studio
                  </Button>
                )}
                <p className="text-[8px] tracking-[1.5px] uppercase font-black text-neutral-400">Cake Urban Delhi NCR</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PREMIUM WISHLIST DRAWER SIDEBAR PANEL */}
      <AnimatePresence>
        {wishlistOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Blurry dark background mask */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setWishlistOpen(false)}
              className="fixed inset-0 bg-[#3B1F17]/50 backdrop-blur-sm shadow-inner"
            />

            {/* Sliding Drawer Body */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-[380px] bg-[#fffdfc] border-l-[6px] border-[#DFB15B]/20 h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10"
            >
              {/* Header row */}
              <div>
                <div className="p-6 bg-[#F8F4F1]/50 border-b border-[#E8DDD7] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[#DE9088] fill-[#DE9088]" />
                    <h3 className="font-display font-black text-xl text-[#3B1F17]">Saved <span className="italic font-serif font-light text-[#DE9088]">Treats</span></h3>
                  </div>
                  <button 
                    onClick={() => setWishlistOpen(false)}
                    className="p-1.5 rounded-full hover:bg-neutral-200 text-[#3B1F17]/50 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Display items list or clean empty banner */}
                <div className="p-5 space-y-4">
                  {wishlistItems.length > 0 ? (
                    <div className="space-y-4">
                      {wishlistItems.map((item: any, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-4 bg-[#FAF7F5] border border-[#E8DDD7]/60 p-3.5 rounded-[20px] shadow-sm relative group hover:border-[#DE9088] transition-colors"
                        >
                          {/* Image */}
                          <img 
                            src={item.images?.[0] || 'https://picsum.photos/seed/cake/100/100'} 
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover border border-[#E8DDD7]/40 shrink-0" 
                          />
                          
                          {/* Info Column */}
                          <div className="flex-grow min-w-0 text-left">
                            <h4 className="text-xs font-black text-[#2D150F] truncate uppercase tracking-wider">{item.name}</h4>
                            <p className="text-[10px] font-black text-[#DE9088] mt-1">₹{item.price}</p>
                            
                            {/* Action Row */}
                            <div className="flex gap-2 mt-2">
                              {/* Simple Add to Order or view details */}
                              <Link 
                                to={`/product/${item.id}`}
                                onClick={() => setWishlistOpen(false)}
                                className="text-[8px] font-black uppercase tracking-wider px-2 py-1 bg-white hover:bg-[#DE9088] border border-[#DE9088] text-[#DE9088] hover:text-white rounded-lg transition-colors flex items-center gap-0.5"
                              >
                                Customize & Cart <ArrowRight className="w-2 h-2" />
                              </Link>
                            </div>
                          </div>

                          {/* Quick delete/remove button */}
                          <button 
                            onClick={() => {
                              try {
                                const fresh = wishlistItems.filter((_, fIdx) => fIdx !== idx);
                                localStorage.setItem('cakeurban_wishlist', JSON.stringify(fresh));
                                setWishlistItems(fresh);
                                toast.success("Savour block deleted!");
                              } catch (e) {}
                            }}
                            className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-white shadow-md border border-neutral-100 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove from favorites"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center space-y-5">
                      <div className="w-16 h-16 bg-[#F8F4F1] rounded-full mx-auto flex items-center justify-center">
                        <Heart className="w-6 h-6 text-neutral-300" />
                      </div>
                      <div className="space-y-1 px-4">
                        <h4 className="text-xs font-black text-[#2D150F] uppercase tracking-widest">Oven is quiet here!</h4>
                        <p className="text-[10px] text-zinc-400 leading-relaxed max-w-xs mx-auto italic">
                          Tap the heart button on any artisan bakes, bento cakes, and rich cream fudges to save them in your wishful chronology.
                        </p>
                      </div>
                      <Link 
                        to="/shop" 
                        onClick={() => setWishlistOpen(false)}
                        className="inline-block px-6 py-2.5 bg-[#3B1F17] hover:bg-[#DE9088] text-white text-[9px] uppercase tracking-widest font-black rounded-xl transition-all shadow"
                      >
                        Explore the Shop
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer bottom segment */}
              {wishlistItems.length > 0 && (
                <div className="p-6 border-t border-[#E8DDD7]/60 bg-[#FAF7F5]/50 space-y-3">
                  <div className="flex justify-between items-center text-xs font-black uppercase text-[#3B1F17] tracking-wider">
                    <span>Total Saved Items</span>
                    <span className="text-[#DE9088]">{wishlistItems.length} Products</span>
                  </div>
                  <Button 
                    onClick={() => {
                      try {
                        localStorage.setItem('cakeurban_wishlist', '[]');
                        setWishlistItems([]);
                        toast.success("Chronology cleared!");
                      } catch (e) {}
                    }}
                    variant="outline" 
                    className="w-full text-[9px] uppercase tracking-widest font-black rounded-xl border-[#E8DDD7] hover:bg-neutral-50 h-11"
                  >
                    Clear All Saved
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AISearchModal />
    </>
  );
}

export function AISearchModal() {
  const { isSearchOpen, setSearchOpen } = useUI();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        let list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (list.length === 0) {
          list = FALLBACK_PRODUCTS;
        }
        setProducts(list);
      } catch (e) {
        setProducts(FALLBACK_PRODUCTS);
      }
    };
    if (isSearchOpen) fetchProducts();
  }, [isSearchOpen]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          products: products.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            flavors: p.flavors || []
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const matchedIds = await response.json();
      const matchedProducts = products.filter(p => Array.isArray(matchedIds) && matchedIds.includes(p.id));
      setResults(matchedProducts);
    } catch (error) {
      console.error("AI Search Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl bg-[#1C0A05]/95 border-2 border-[#DFB15B]/35 shadow-2xl rounded-[32px] p-0.5 overflow-hidden relative z-10 backdrop-blur-xl text-white"
          >
            <div className="p-8">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#DFB15B]" />
                <Input 
                  autoFocus
                  placeholder="Try: 'Chocolate truffle for my wife's 30th birthday'"
                  className="pl-14 h-16 text-sm rounded-2xl border-2 border-[#DFB15B]/20 bg-[#2D150F] text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#DFB15B] focus:border-transparent transition-all"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-3 h-10 px-6 bg-gradient-to-r from-[#DFB15B] to-[#C99A43] text-black rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all text-amber-950"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : "AI Search"}
                </button>
              </form>

              <div className="mt-8">
                {results.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[50vh] pb-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#DFB15B] opacity-80 px-2">Matches found for you</p>
                    {results.map((product) => (
                      <Link 
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#DFB15B]/25 hover:bg-white/10 transition-all group"
                      >
                        <img 
                          src={product.images?.[0] || 'https://picsum.photos/seed/cake/100/100'} 
                          className="w-20 h-20 rounded-2xl object-cover border border-white/10 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-left">
                          <h4 className="font-bold text-white group-hover:text-[#DFB15B] transition-colors text-lg uppercase tracking-wider">{product.name}</h4>
                          <p className="text-sm font-black text-[#DFB15B]">₹{product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : query && !loading ? (
                    <div className="text-center py-12">
                        <p className="text-zinc-400 font-medium italic">We couldn't find a perfect match for "{query}". Try something different?</p>
                    </div>
                ) : (
                    <div className="py-4 text-left">
                         <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#DFB15B]/85 opacity-100 px-2 mb-4">Curated Selections</p>
                         <div className="flex flex-wrap gap-3 px-2">
                             {['Red Velvet', 'Eggless Chocolate', 'Anniversary Heart Cake', 'Peppa Pig Theme'].map(tag => (
                                 <button 
                                    key={tag}
                                    onClick={() => setQuery(tag)}
                                    className="px-5 py-2.5 bg-white/5 border border-[#DFB15B]/25 rounded-full text-xs font-black tracking-widest uppercase text-white hover:bg-[#DFB15B] hover:text-black hover:border-transparent transition-all duration-300"
                                 >
                                     {tag}
                                 </button>
                             ))}
                         </div>
                    </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
