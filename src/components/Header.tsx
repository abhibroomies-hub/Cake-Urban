import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, Cake, LogOut, Settings, LayoutDashboard, Sparkles } from 'lucide-react';
import { useUI, useCart } from '../lib/store';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FALLBACK_PRODUCTS } from '../lib/fallbackProducts';

export function Header() {
  const { setSearchOpen } = useUI();
  const cartItems = useCart((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const adminDoc = await getDoc(doc(db, 'admins', u.uid));
        setIsAdmin(adminDoc.exists() || u.email === 'abhibroomies@gmail.com');
      } else {
        setIsAdmin(false);
      }
    });
    return unsub;
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('cakeurban_local_user');
    await signOut(auth);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#fffdfce6] border-b border-[#eadfd8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden flex-1 flex items-center">
          <button className="text-[#3B1F17] p-2">
            <Menu className="w-6 h-6 md:w-7 md:h-7" />
          </button>
        </div>

        {/* LOGO */}
        <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
          <Link to="/" className="group flex items-center gap-3.5">
            {/* Custom Leather/Gold Shield Logo matching User uploaded branding */}
            <div className="relative w-11 h-11 md:w-14 md:h-14 shrink-0 flex items-center justify-center drop-shadow-md rounded-xl overflow-hidden group-hover:scale-110 transition-transform duration-300 bg-[#FAF7F5] border border-[#DE9088]/20 shadow-sm">
              <img 
                src="/favicon.png" 
                alt="Cake Urban Logo" 
                className="w-full h-full object-cover scale-[1.95] translate-y-[-6%]" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-3xl font-display font-black leading-none tracking-tight text-[#2D150F]">
                Cake<span className="text-[#DE9088]">Urban</span>
              </h1>
              <p className="text-[7px] md:text-[11px] tracking-[2px] md:tracking-[4px] uppercase text-[#DE9088] font-bold mt-0.5">
                Artisan Bakery
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10 font-bold text-[15px] uppercase tracking-wider flex-1 justify-center">
          <Link to="/" className="text-[#2D150F] hover:text-[#DE9088] transition-colors duration-200">Home</Link>
          <Link to="/shop?category=Cakes" className="text-[#2D150F] hover:text-[#DE9088] transition-colors duration-200">Cakes</Link>
          <Link to="/shop?category=Pastries" className="text-[#2D150F] hover:text-[#DE9088] transition-colors duration-200">Pastries</Link>
          <Link to="/shop?category=Hampers" className="text-[#2D150F] hover:text-[#DE9088] transition-colors duration-200">Hampers</Link>
          <Link to="/custom-order" className="text-[#2D150F] hover:text-[#DE9088] transition-colors duration-200">Custom Studio</Link>
          <Link to="/blog" className="text-[#2D150F] hover:text-[#DE9088] transition-colors duration-200">The Diaries</Link>
          <Link to="/contact" className="text-[#2D150F] hover:text-[#DE9088] transition-colors duration-200">Contact</Link>
        </nav>

        {/* Action Icons */}
        <div className="flex-1 lg:flex-none flex items-center justify-end gap-2 md:gap-5">
          <button 
            onClick={() => setSearchOpen(true)}
            className="p-2 text-[#2D150F] hover:text-[#DE9088] transition-colors"
          >
            <Search className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          <Link to="/account" className="p-2 text-[#2D150F] hover:text-[#DE9088] transition-colors">
            <User className="w-5 h-5 md:w-6 md:h-6" />
          </Link>

          <Link to="/cart">
            <button className="bg-[#DE9088]/15 hover:bg-[#DE9088]/25 transition-all text-[#DE9088] w-10 h-10 md:w-auto md:px-5 md:py-3 rounded-xl md:rounded-2xl font-black uppercase tracking-wider text-xs flex items-center justify-center relative shadow-sm hover:shadow">
              <ShoppingCart className="w-5 h-5 text-[#DE9088]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#2D150F] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
              <span className="hidden md:inline ml-2">Cart</span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function AISearchModal() {
  const { isSearchOpen, setSearchOpen } = useUI();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // In-memory products for search context (should be fetched from Firestore)
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
            className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden relative z-10"
          >
            <div className="p-8">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand opacity-40 italic" />
                <Input 
                  autoFocus
                  placeholder="Try: 'Chocolate truffle for my wife's 30th birthday'"
                  className="pl-14 h-16 text-sm rounded-2xl border border-creamy-border bg-white creamy-shadow focus-visible:ring-1 focus-visible:ring-brand"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-3 h-10 px-6 bg-chocolate text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#5C4033] transition-colors"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : "AI Search"}
                </button>
              </form>

              <div className="mt-8">
                {results.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[50vh] pb-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 px-2">Matches found for you</p>
                    {results.map((product) => (
                      <Link 
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-6 p-4 rounded-2xl hover:bg-brand/5 transition-all group"
                      >
                        <img 
                          src={product.images?.[0] || 'https://picsum.photos/seed/cake/100/100'} 
                          className="w-20 h-20 rounded-2xl object-cover creamy-shadow"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="font-serif font-bold text-chocolate group-hover:text-brand transition-colors text-lg">{product.name}</h4>
                          <p className="text-sm font-medium text-brand">₹{product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : query && !loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 font-light italic">We couldn't find a perfect match for "{query}". Try something different?</p>
                    </div>
                ) : (
                    <div className="py-4">
                         <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 px-2 mb-4">Curated Selections</p>
                         <div className="flex flex-wrap gap-3 px-2">
                             {['Red Velvet', 'Eggless Chocolate', 'Anniversary Heart Cake', 'Peppa Pig Theme'].map(tag => (
                                 <button 
                                    key={tag}
                                    onClick={() => setQuery(tag)}
                                    className="px-5 py-2.5 bg-creamy border border-creamy-border rounded-full text-xs font-bold tracking-widest uppercase hover:bg-brand/10 transition-colors"
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
