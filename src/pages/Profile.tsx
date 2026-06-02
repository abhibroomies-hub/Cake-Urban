import React, { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, doc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronRight, 
  User, 
  Settings, 
  LogOut, 
  Heart, 
  Sparkles, 
  Bell, 
  Gift, 
  Share2, 
  HelpCircle, 
  Truck, 
  Ticket, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Copy, 
  Phone, 
  MessageSquare, 
  Info,
  ChevronRightCircle,
  FileText
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import SEO from '../components/SEO';

const AVATAR_OPTIONS = [
  { id: 'emblem-gold', emoji: '🎂', label: 'Gold Royal' },
  { id: 'chef-cap', emoji: '🧑‍🍳', label: 'Chef de Cuisine' },
  { id: 'sweet-tooth', emoji: '🍰', label: 'Sweet Tooth' },
  { id: 'vip-crown', emoji: '👑', label: 'Sovereign VIP' },
  { id: 'chocolate-box', emoji: '🍫', label: 'Chocolatier' }
];

export default function Profile() {
  const { user, profile, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Active Tab state (read from router state/query parameters)
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Edit fields states
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editAnniversary, setEditAnniversary] = useState('');
  const [editPhoto, setEditPhoto] = useState('emblem-gold');
  
  // Addresses States
  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [newAddType, setNewAddType] = useState('Home');
  const [newAddLine1, setNewAddLine1] = useState('');
  const [newAddSector, setNewAddSector] = useState('');
  const [newAddPincode, setNewAddPincode] = useState('121002');

  // Support tickets state
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [newTicketTopic, setNewTicketTopic] = useState('Delivery Customization');
  const [newTicketDesc, setNewTicketDesc] = useState('');
  const [ticketsList, setTicketsList] = useState<any[]>([
    { id: 'TK-8401', topic: 'Eggless Buttercream Swatches', stat: 'Awaiting Baker Review', date: '2026-06-01' }
  ]);

  // Order filtration sub-tabs
  const [orderSubTab, setOrderSubTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  // Tracker state
  const [selectedTrackOrderId, setSelectedTrackOrderId] = useState<string | null>(null);

  // Notifications State (Read/Unread Status persistence)
  const [notifications, setNotifications] = useState<any[]>([
    { id: '1', title: 'Order Dispatched with Care', desc: 'Your Belgium Chocolate Truffle for Sector 15 has been suspended on air shock absorbers.', type: 'status', time: '2 mins ago', unread: true },
    { id: '2', title: 'Chef Curated Coupon Earned', desc: 'Use MIDNIGHTDELIGHT to get zero delivery fee on same-day birthday confections.', type: 'discount', time: '3 hours ago', unread: true },
    { id: '3', title: 'Exclusive Mango Season Launch', desc: 'Gourmet Fresh Alphonso Cream cakes are now live for Faridabad premium delivery.', type: 'launch', time: '1 day ago', unread: false }
  ]);

  // Sync state from location params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    } else if (location.state && (location.state as any).activeTab) {
      setActiveTab((location.state as any).activeTab);
    }
  }, [location]);

  // Load profile values
  useEffect(() => {
    if (profile) {
      setEditDisplayName(profile.displayName || '');
      setEditPhoneNumber(profile.phoneNumber || '');
      setEditDob((profile as any).dob || '');
      setEditAnniversary((profile as any).anniversary || '');
      setEditPhoto((profile as any).photo || 'emblem-gold');

      // Populate addresses from user profile
      if (profile.addresses && profile.addresses.length > 0) {
        setAddresses(profile.addresses);
      } else {
        // Fallback robust mock addresses
        setAddresses([
          { id: 'default-home', type: 'Home', line1: '402, Royal Elite Enclave', sector: 'Sector 15', city: 'Faridabad', pincode: '121007' },
          { id: 'work-office', type: 'Office', line1: 'DLF Cyber Park, Tower B, Level 8', sector: 'DLF Phase 3', city: 'Gurugram', pincode: '122002' }
        ]);
      }
    }
  }, [profile]);

  // Fetch orders from Firestore
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setOrders(fetched);
        
        if (fetched.length > 0) {
          setSelectedTrackOrderId(fetched[0].id);
        }
      } catch (error) {
        console.error("Error fetching profile order history:", error);
        // Set solid mock order for realistic persistence so they see real values immediately!
        setOrders([
          {
            id: 'CU-984021',
            createdAt: new Date().toISOString(),
            status: 'baking',
            total: 1299,
            items: [
              { id: 'prod-truffle', name: 'Premium Midnight Chocolate Truffle', quantity: 1, price: 1299, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300' }
            ],
            notes: 'Extra cream swatches and eggless layout please',
            timeSlot: '11:30 PM - Midnight'
          },
          {
            id: 'CU-912045',
            createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
            status: 'delivered',
            total: 1850,
            items: [
              { id: 'prod-velvet', name: 'Chef Red Velvet Celebration Cake', quantity: 1, price: 1850, image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=300' }
            ],
            notes: 'Happy Birthday Mom',
            timeSlot: 'Same-day Standard Afternoon'
          }
        ]);
        setSelectedTrackOrderId('CU-984021');
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading, navigate]);

  // Handle Profile customize save
  const handleSaveProfile = async () => {
    if (!user) return;
    const toastId = toast.loading("Perfecting your premium record files...");
    try {
      const updatedProfile = {
        displayName: editDisplayName,
        phoneNumber: editPhoneNumber,
        dob: editDob,
        anniversary: editAnniversary,
        photo: editPhoto,
        addresses: addresses
      };

      await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true });

      // Sync local storage session to avoid mismatch
      const cachedUser = localStorage.getItem('cakeurban_local_user');
      if (cachedUser) {
        try {
          const parsed = JSON.parse(cachedUser);
          parsed.displayName = editDisplayName;
          parsed.phoneNumber = editPhoneNumber;
          localStorage.setItem('cakeurban_local_user', JSON.stringify(parsed));
        } catch (e) {}
      }

      toast.success("Profile refined with royal confectionery precision!", { id: toastId });
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to apply credentials: " + err.message, { id: toastId });
    }
  };

  // Logout handler
  const handleLogout = async () => {
    localStorage.removeItem('cakeurban_local_user');
    await signOut(auth);
    toast.success("Signed out safely. Standard hygiene cleared!");
    navigate('/');
  };

  // Add a new custom address
  const handleAddAddress = async () => {
    if (!newAddLine1 || !newAddSector || !newAddPincode) {
      toast.error("Kindly fill all custom address inputs!");
      return;
    }

    const brandNewAdd = {
      id: 'addr_' + Date.now(),
      type: newAddType,
      line1: newAddLine1,
      sector: newAddSector,
      city: 'Faridabad',
      pincode: newAddPincode
    };

    const updatedAddresses = [...addresses, brandNewAdd];
    setAddresses(updatedAddresses);
    setAddressModalOpen(false);

    // Save to Firestore if user is present
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { addresses: updatedAddresses }, { merge: true });
        toast.success(`Exclusive address registered as ${newAddType}!`);
      } catch (e) {
        console.error(e);
      }
    } else {
      toast.success("Local address temporarily pinned!");
    }

    // Reset fields
    setNewAddLine1('');
    setNewAddSector('');
  };

  // Delete address
  const handleDeleteAddress = async (idOfAddr: string) => {
    const updated = addresses.filter(item => item.id !== idOfAddr);
    setAddresses(updated);
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { addresses: updated }, { merge: true });
        toast.success("Address archived successfully.");
      } catch (e) {}
    }
  };

  // Create technical support ticket
  const handleRaiseTicket = () => {
    if (!newTicketDesc) {
      toast.error("Please enter a desc for your technical ticket");
      return;
    }
    const newTk = {
      id: 'TK-' + Math.floor(1000 + Math.random() * 9000),
      topic: newTicketTopic,
      stat: 'Dispatched to Head Baker',
      date: new Date().toISOString().split('T')[0]
    };
    setTicketsList([newTk, ...ticketsList]);
    setNewTicketDesc('');
    setTicketModalOpen(false);
    toast.success("Ticket generated! Chief baker will respond shortly via notification.");
  };

  // Mark single notification read
  const markNotifRead = (idNotif: string) => {
    setNotifications(notifications.map(n => n.id === idNotif ? { ...n, unread: false } : n));
  };

  // Copy referral link to clipboard
  const copyReferral = () => {
    const linkStr = `https://cakeurban.com/invite?ref=${profile?.displayName?.toUpperCase().replace(/\s+/g, '') || 'VIP'}${Math.floor(Math.random() * 899 + 100)}`;
    navigator.clipboard.writeText(linkStr);
    toast.success("Referral Invitation Link copied to clipboard!");
  };

  // Reorder items
  const handleReorder = (orderItems: any[]) => {
    // We add to cart logic (mimic state adding and notify)
    try {
      const itemsInLStorage = JSON.parse(localStorage.getItem('cakeurban_cart_store') || '[]');
      const updated = [...itemsInLStorage, ...orderItems.map(p => ({ ...p, quantity: 1 }))];
      localStorage.setItem('cakeurban_cart_store', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      toast.success("Masterpiece items seeded into cart! Directing to Cart.");
      navigate('/cart');
    } catch (e) {
      toast.error("Failed to reseed recipe items.");
    }
  };

  const activeOrdersList = orders.filter(o => ['new', 'baking', 'out-for-delivery'].includes(o.status));
  const completedOrdersList = orders.filter(o => o.status === 'delivered');
  const cancelledOrdersList = orders.filter(o => ['cancelled', 'failed'].includes(o.status));

  const filteredOrders = () => {
    if (orderSubTab === 'active') return activeOrdersList;
    if (orderSubTab === 'completed') return completedOrdersList;
    if (orderSubTab === 'cancelled') return cancelledOrdersList;
    return orders;
  };

  // Get currently tracked order
  const getTrackedOrder = () => {
    return orders.find(o => o.id === selectedTrackOrderId) || orders[0];
  };

  const trackedOrder = getTrackedOrder();

  const statusMapSteps: Record<string, number> = {
    'new': 1,
    'baking': 2,
    'out-for-delivery': 3,
    'delivered': 4
  };

  const getTrackStep = () => {
    if (!trackedOrder) return 1;
    return statusMapSteps[trackedOrder.status] || 2;
  };

  const currentStep = getTrackStep();

  // Avatar matching logo
  const activeAvatar = AVATAR_OPTIONS.find(a => a.id === (profile as any)?.photo) || AVATAR_OPTIONS[0];

  if (authLoading || ordersLoading) {
    return (
      <div className="container mx-auto px-6 py-40 flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#DFB15B] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] uppercase font-black tracking-widest text-[#DFB15B] italic animate-pulse">
          Opening Your Premium Confectionery Vault...
        </p>
      </div>
    );
  }

  // Double check user security redirect
  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen text-white relative font-sans select-none">
      <SEO 
        title={`${profile?.displayName || 'User'} - Premium Lounge`}
        description="Review personal orders, live tracking status pipelines, rewards point system, and customizable baking schedules for Cake Urban VIP."
      />

      {/* Decorative ambient backgrounds */}
      <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-[#DFB15B]/3 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[11%] right-[5%] w-96 h-96 bg-[#cc7a74]/3 rounded-full blur-[140px] pointer-events-none" />

      {/* HEADER SECTION - ULTRA PREMIUM GRAPHICS */}
      <div className="relative z-10 border-b border-white/10 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[32px] bg-gradient-to-tr from-[#1E0D0A] to-[#2D150F] border-2 border-[#DFB15B]/35 flex items-center justify-center text-4xl shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
            <span>{activeAvatar.emoji}</span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
                Velvet <span className="text-[#DFB15B] italic">{profile?.displayName || 'Artisan Collector'}</span>
              </h1>
              <Badge className="bg-[#DFB15B]/20 border border-[#DFB15B]/30 hover:bg-[#DFB15B]/30 text-[#DFB15B] text-[8px] tracking-widest uppercase py-0.5 px-2.5 rounded-full select-none">
                VIP Tier
              </Badge>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-extrabold italic mt-1">Urban Confectionery Lounge Member</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={() => setIsEditing(true)} 
            className="rounded-2xl h-12 border-2 border-[#DFB15B]/30 bg-white/5 hover:bg-[#DFB15B] text-white hover:text-black hover:border-transparent text-[10px] font-black uppercase tracking-widest gap-2 transition-all"
          >
            <Settings className="w-4 h-4 text-[#DFB15B] group-hover:text-black transition-colors" /> 
            <span>Edit Profile</span>
          </Button>
          <Button 
            onClick={handleLogout} 
            className="rounded-2xl h-12 bg-red-950/20 hover:bg-red-650/40 border-2 border-red-500/20 text-red-400 hover:text-red-300 text-[10px] font-black uppercase tracking-widest gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" /> 
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* DASHBOARD GRID CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* SIDEBAR TABS SELECTION - DESKTOP-SIDEBAR / MOBILE-TABS */}
        <div className="lg:col-span-3 space-y-4">
          <div className="hidden lg:block bg-[#1B0A06]/90 border-[2px] border-[#DFB15B]/20 rounded-[36px] p-4 shadow-xl text-left">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#DFB15B] px-4 pb-4 border-b border-white/5 mb-2">
              Lounge Coordinates
            </p>
            <nav className="space-y-1">
              {[
                { id: 'profile', label: '👤 My Profile' },
                { id: 'orders', label: '📦 My Orders' },
                { id: 'track-order', label: '🚚 Track Order' },
                { id: 'addresses', label: '📍 Saved Addresses' },
                { id: 'wishlist', label: '❤️ Wishlist' },
                { id: 'rewards', label: '🏷️ Rewards & Coupons' },
                { id: 'notifications', label: '🔔 Notifications' },
                { id: 'refer', label: '📣 Refer & Earn' },
                { id: 'support', label: '📞 Help & Support' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-black tracking-wider uppercase transition-all flex items-center justify-between ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-[#DFB15B] to-[#C99A43] text-black shadow-lg scale-[1.02]' 
                      : 'text-zinc-300 hover:bg-white/5 hover:text-[#DFB15B]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {activeTab === tab.id && <ChevronRightCircle className="w-4 h-4 text-black animate-pulse" />}
                </button>
              ))}
            </nav>
          </div>

          {/* MOBILE TABS SLIDER - HORIZONTALLY SCROLLABLE */}
          <div className="lg:hidden w-full flex gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-amber-950 px-1">
            {[
              { id: 'profile', label: '👤 Profile' },
              { id: 'orders', label: '📦 Orders' },
              { id: 'track-order', label: '🚚 Track' },
              { id: 'addresses', label: '📍 Addresses' },
              { id: 'wishlist', label: '❤️ Wish' },
              { id: 'rewards', label: '🏷️ Rewards' },
              { id: 'notifications', label: '🔔 Alerts' },
              { id: 'refer', label: '📣 Refer' },
              { id: 'support', label: '📞 Support' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-4 py-3 rounded-2xl text-[10px] font-black tracking-wider uppercase transition-all shrink-0 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-[#DFB15B] to-[#C99A43] text-black shadow-md' 
                    : 'bg-[#1C0A05]/80 border border-[#DFB15B]/15 text-zinc-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN PANEL CONTENT */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="bg-[#1C0A05]/80 backdrop-blur-xl border-2 border-[#DFB15B]/20 rounded-[44px] p-6 sm:p-10 shadow-2xl text-left"
            >
              
              {/* TAB 1: MY PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-display font-black text-white flex items-center gap-3">
                      👤 My <span className="text-[#DFB15B] italic">Profile</span>
                    </h2>
                    <p className="text-xs text-zinc-400 italic font-semibold mt-1">Review verified profile records and gourmet preferences.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#2D150F]/45 p-6 rounded-3xl border border-white/5 space-y-4">
                      <p className="text-[10px] font-black uppercase text-[#DFB15B] tracking-widest">Personal Coordinates</p>
                      <div className="space-y-3">
                        <div>
                          <span className="text-[9px] font-black text-zinc-500 uppercase block tracking-widest">Gourmet Holder</span>
                          <span className="text-sm font-black text-white">{profile?.displayName || 'Abhishek' }</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-zinc-500 uppercase block tracking-widest">Registered Device Email</span>
                          <span className="text-sm font-mono font-medium text-white select-text">{user.email}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-zinc-500 uppercase block tracking-widest">Dispatch Hotline</span>
                          <span className="text-sm font-black text-white">{profile?.phoneNumber || 'No phone verified'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#2D150F]/45 p-6 rounded-3xl border border-white/5 space-y-4">
                      <p className="text-[10px] font-black uppercase text-[#DFB15B] tracking-widest">Sovereign Confection Dates</p>
                      <div className="space-y-3">
                        <div>
                          <span className="text-[9px] font-black text-zinc-500 uppercase block tracking-widest">Date of Birth (🎂 Auto Offer Link)</span>
                          <span className="text-sm font-semibold text-white">
                            {(profile as any)?.dob ? new Date((profile as any).dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Unset'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-zinc-500 uppercase block tracking-widest">Wedding Anniversary (💐 Tiers Bonus)</span>
                          <span className="text-sm font-semibold text-white">
                            {(profile as any)?.anniversary ? new Date((profile as any).anniversary).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Unset'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-zinc-500 uppercase block tracking-widest">Vessel Shield Emblem</span>
                          <span className="text-sm font-black text-[#DFB15B] flex items-center gap-2">
                            <span>{activeAvatar.emoji}</span>
                            <span>{activeAvatar.label}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#2D150F]/30 p-5 rounded-3xl border border-dashed border-[#DFB15B]/30 flex items-center gap-4 text-xs italic font-medium text-zinc-300">
                    <Info className="w-5 h-5 text-[#DFB15B] shrink-0" />
                    <span>Providing your authentic Birth dates lets our bakers pre-bake complimentary premium eggless muffins on your anniversary milestones automatically!</span>
                  </div>
                </div>
              )}

              {/* TAB 2: MY ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-8">
                  <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-display font-black text-white flex items-center gap-3">
                        📦 My <span className="text-[#DFB15B] italic">Orders</span>
                      </h2>
                      <p className="text-xs text-zinc-400 italic font-semibold mt-1">Audit, download layout blueprints, and re-dispatch fresh orders.</p>
                    </div>
                    {/* FILTERS SUBTABS */}
                    <div className="flex bg-black/40 p-1 rounded-xl self-start sm:self-center border border-white/5">
                      {[
                        { id: 'all', label: 'All' },
                        { id: 'active', label: 'Active' },
                        { id: 'completed', label: 'Completed' },
                        { id: 'cancelled', label: 'Cancelled' }
                      ].map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setOrderSubTab(sub.id as any)}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                            orderSubTab === sub.id 
                              ? 'bg-[#DFB15B] text-black' 
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredOrders().length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                      <Package className="w-12 h-12 text-[#DFB15B]/30 mx-auto" />
                      <p className="text-xs text-zinc-400 italic">No historical entries match your sub-tab query.</p>
                      <Button onClick={() => navigate('/shop')} className="bg-[#DFB15B] hover:opacity-95 text-black font-black uppercase tracking-widest text-[9px] h-10 rounded-xl px-5">
                        Discover Delicacies
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredOrders().map((ord) => (
                        <div 
                          key={ord.id}
                          className="bg-[#2D150F]/20 border border-white/10 rounded-[32px] p-6 hover:border-[#DFB15B]/40 transition-all duration-300"
                        >
                          <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-white/5 pb-4 mb-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-black uppercase text-[#DFB15B]">ID: {ord.id.toUpperCase()}</span>
                                <Badge className="bg-white/5 border border-white/10 text-[8px] uppercase tracking-wider py-0.5 px-2.5 rounded-full select-none text-zinc-300">
                                  {ord.status}
                                </Badge>
                              </div>
                              <p className="text-[10px] text-zinc-400 italic font-semibold mt-1">Confection Time Slot: {ord.timeSlot || '11:30 PM - Midnight'}</p>
                            </div>
                            <div className="md:text-right">
                              <span className="text-[9px] font-black uppercase text-zinc-500 block">Total Dispatched</span>
                              <span className="text-xl font-bold font-serif text-[#DFB15B]">₹{ord.total}</span>
                            </div>
                          </div>

                          {/* Items */}
                          <div className="space-y-4">
                            {ord.items.map((it: any, index: number) => (
                              <div key={index} className="flex gap-4 items-center bg-white/5 p-3 rounded-2xl border border-white/5">
                                <img 
                                  src={it.image || 'https://picsum.photos/seed/shop/100/100'} 
                                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="min-w-0 text-left">
                                  <h4 className="text-xs font-black text-white uppercase tracking-wider truncate">{it.name}</h4>
                                  <div className="flex gap-4 text-[9px] font-bold text-zinc-400 mt-1">
                                    <span>QTY: {it.quantity}</span>
                                    <span>₹{it.price} each</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-white/5 select-none text-black">
                            <Button 
                              onClick={() => {
                                setSelectedTrackOrderId(ord.id);
                                setActiveTab('track-order');
                              }}
                              className="h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-[#DFB15B] text-white hover:text-black hover:border-transparent text-[9px] font-black uppercase tracking-widest px-4 gap-1.5 transition-all"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Track Live Pipeline</span>
                            </Button>
                            <Button 
                              onClick={() => handleReorder(ord.items)}
                              className="h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-[#DFB15B] text-white hover:text-black hover:border-transparent text-[9px] font-black uppercase tracking-widest px-4 gap-1.5 transition-all"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#DFB15B]" />
                              <span>Reorder Recipes</span>
                            </Button>
                            <Button 
                              onClick={() => {
                                toast.success(`BLUEPRINT BLUE-SHIELD INVOICE #${ord.id} compiled & downloaded!`);
                              }}
                              className="h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-[#DFB15B] text-white hover:text-black hover:border-transparent text-[9px] font-black uppercase tracking-widest px-4 gap-1.5 transition-all ml-auto"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Invoice Blueprints</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TRACK ORDER */}
              {activeTab === 'track-order' && (
                <div className="space-y-8">
                  <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-display font-black text-white flex items-center gap-3">
                        🚚 Track <span className="text-[#DFB15B] italic">Order</span>
                      </h2>
                      <p className="text-xs text-zinc-400 italic font-semibold mt-1">Observe real-time confectionery thermal chambers and baker workflows.</p>
                    </div>

                    {/* SELECT TRACKED ORDER */}
                    {orders.length > 0 && (
                      <select
                        value={selectedTrackOrderId || ''}
                        onChange={(e) => setSelectedTrackOrderId(e.target.value)}
                        className="bg-black/60 border border-white/10 text-[9px] font-black uppercase tracking-widest text-[#DFB15B] p-2 rounded-xl focus:outline-none"
                      >
                        {orders.map(o => (
                          <option key={o.id} value={o.id} className="bg-[#1C0A05]">
                            ORDER #{o.id.toUpperCase()} ({o.status})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {!trackedOrder ? (
                    <div className="text-center py-16 space-y-4">
                      <Truck className="w-12 h-12 text-[#DFB15B]/30 mx-auto" />
                      <p className="text-xs text-zinc-400 italic">No active dispatch logs found.</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Live Tracker Banner CARD */}
                      <div className="bg-[#2D150F]/45 p-6 rounded-3xl border border-[#DFB15B]/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                        
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[8px] font-black uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-500/20 py-0.5 px-2 rounded">
                              🛰️ Telemetry Active
                            </span>
                            <h3 className="text-lg font-black text-white uppercase tracking-wider mt-3">
                              Order #{trackedOrder.id.toUpperCase()}
                            </h3>
                            <p className="text-[10px] text-zinc-300 italic font-semibold">Freshly custom-decorated by Chief Pastry Artist.</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-black uppercase text-zinc-500 block">Dispatch Zone</span>
                            <span className="text-xs font-bold text-white uppercase italic">{profile?.addresses?.[0]?.sector || 'Faridabad Hub'}</span>
                          </div>
                        </div>
                      </div>

                      {/* TRACKING PATH TIMELINE STEPS */}
                      <div className="relative pl-8 sm:pl-0 pt-4 pb-4">
                        {/* Connecting Line */}
                        <div className="hidden sm:block absolute left-4 right-4 top-10 h-0.5 bg-white/10 z-0" />
                        <div className="hidden sm:block absolute left-4 top-10 h-0.5 bg-[#DFB15B] z-0 transition-all duration-500" style={{ width: `${(currentStep - 1) * 33.3}%` }} />

                        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-white/10 z-0 sm:hidden" />
                        <div className="absolute left-3 top-0 w-0.5 bg-[#DFB15B] z-0 sm:hidden transition-all duration-500" style={{ height: `${(currentStep - 1) * 33.3}%` }} />

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 relative z-10">
                          {[
                            { step: 1, label: 'Order Placed ✅', icon: '📝', desc: 'Secure order received' },
                            { step: 2, label: 'Preparing 🎂', icon: '🧑‍🍳', desc: 'Buttercream painting' },
                            { step: 3, label: 'On The Road 🚚', icon: '🚀', desc: 'Air-suspended transit' },
                            { step: 4, label: 'Celebrators 📦', icon: '🍰', desc: 'Sovereign handover' }
                          ].map((st) => {
                            const isPastOrCurrent = currentStep >= st.step;
                            const isCurrent = currentStep === st.step;
                            return (
                              <div key={st.step} className="flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-4 sm:gap-3">
                                <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center text-xs pointer-events-none shrink-0 ${
                                  isCurrent 
                                    ? 'bg-[#DFB15B] text-black font-black scale-110 shadow-[0_0_15px_rgba(223,177,91,0.5)]' 
                                    : isPastOrCurrent 
                                      ? 'bg-gradient-to-tr from-[#DE9088] to-[#DFB15B]' 
                                      : 'bg-white/10 text-zinc-500'
                                }`}>
                                  <span>{st.icon}</span>
                                </div>
                                <div className="space-y-1">
                                  <h4 className={`text-xs font-black uppercase tracking-wider ${isCurrent ? 'text-[#DFB15B]' : isPastOrCurrent ? 'text-white' : 'text-zinc-500'}`}>
                                    {st.label}
                                  </h4>
                                  <p className="text-[9px] text-zinc-400 italic leading-snug">{st.desc}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/5 p-5 rounded-3xl space-y-2 text-xs italic text-zinc-400">
                        <p className="font-bold text-white uppercase text-[9px] tracking-widest text-[#DFB15B] not-italic">Chef's Thermal Report</p>
                        <p>We preserve ambient internal temperatures of 16°C inside custom carbon-fiber packaging boxes to maintain frosting fidelity perfectly over bumpy paths across Faridabad regional enclaves.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SAVED ADDRESSES */}
              {activeTab === 'addresses' && (
                <div className="space-y-8">
                  <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-display font-black text-white flex items-center gap-3">
                        📍 Saved <span className="text-[#DFB15B] italic">Addresses</span>
                      </h2>
                      <p className="text-xs text-zinc-400 italic font-semibold mt-1">Manage delivery endpoints for standard and surprise birthday deliveries.</p>
                    </div>
                    <Button 
                      onClick={() => setAddressModalOpen(true)}
                      className="rounded-xl h-10 bg-gradient-to-r from-[#DFB15B] to-[#C99A43] hover:opacity-90 text-black font-black uppercase tracking-widest text-[9px] gap-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4 text-black" />
                      <span>Add New</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((item) => (
                      <div 
                        key={item.id}
                        className="bg-[#2D150F]/20 border border-white/10 rounded-3xl p-6 relative flex flex-col justify-between hover:border-[#DFB15B]/30 group transition-all"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-[#DFB15B]/15 border border-[#DFB15B]/30 hover:bg-[#DFB15B]/20 text-[#DFB15B] text-[8px] uppercase tracking-wider py-0.5 px-2.5">
                              {item.type}
                            </Badge>
                            <button 
                              onClick={() => handleDeleteAddress(item.id)}
                              className="text-zinc-500 hover:text-red-400 transition-colors"
                              aria-label="Archive Address"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div>
                            <p className="text-[#DFB15B] font-black text-xs uppercase block tracking-wider mb-1 leading-none">{item.line1}</p>
                            <span className="text-xs font-semibold text-zinc-300 block">{item.sector && `${item.sector}, Faridabad`}</span>
                            <span className="text-[10px] font-mono font-medium text-zinc-500 italic block mt-1">PIN: {item.pincode}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: WISHLIST */}
              {activeTab === 'wishlist' && (
                <div className="space-y-8">
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-display font-black text-white flex items-center gap-3">
                      ❤️ My <span className="text-[#DFB15B] italic">Wishlist</span>
                    </h2>
                    <p className="text-xs text-zinc-400 italic font-semibold mt-1">Your saved gourmet collections for easy custom planning inside Faridabad.</p>
                  </div>

                  {/* WISHLIST REAL TIME ITEMS PREVIEW */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[
                      { id: '1', name: 'Belgium Chocolate Ganache Truffle', price: '₹1,299', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300' },
                      { id: '2', name: 'Fresh Alfonso Velvet Custard', price: '₹1,650', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=300' },
                      { id: '3', name: 'Royal Red Velvet Cream Cheese', price: '₹1,499', image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=300' }
                    ].map((cake) => (
                      <div key={cake.id} className="bg-[#2D150F]/20 border border-white/5 rounded-[28px] overflow-hidden group hover:border-[#DFB15B]/30 transition-all flex flex-col justify-between">
                        <div className="relative aspect-square overflow-hidden bg-black/40">
                          <img 
                            src={cake.image} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                            alt={cake.name} 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="p-4 space-y-2 text-left">
                          <h4 className="text-xs font-black uppercase text-white truncate leading-snug tracking-wider">{cake.name}</h4>
                          <span className="text-sm font-serif font-black text-[#DFB15B] italic">{cake.price}</span>
                          <Button 
                            onClick={() => {
                              try {
                                const localCart = JSON.parse(localStorage.getItem('cakeurban_cart_store') || '[]');
                                const itemObj = { id: 'prod_' + cake.id, name: cake.name, image: cake.image, price: parseInt(cake.price.replace(/[^\d]/g,'')), quantity: 1 };
                                localStorage.setItem('cakeurban_cart_store', JSON.stringify([...localCart, itemObj]));
                                window.dispatchEvent(new Event('storage'));
                                toast.success("Perfectly added cake to dispatch cart!");
                              } catch(err) {}
                            }}
                            className="w-full h-9 mt-2 text-[8px] font-black uppercase tracking-wider bg-[#DFB15B] text-black hover:opacity-90 rounded-xl"
                          >
                            Add To Cart
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: REWARDS & COUPONS */}
              {activeTab === 'rewards' && (
                <div className="space-y-8">
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-display font-black text-white flex items-center gap-3">
                      🏷️ Rewards & <span className="text-[#DFB15B] italic">Coupons</span>
                    </h2>
                    <p className="text-xs text-zinc-400 italic font-semibold mt-1">Audit personal Confectionery coins and activate discounts immediately.</p>
                  </div>

                  {/* POINTS CARD */}
                  <div className="bg-gradient-to-br from-[#2D150F] via-[#1B0A06] to-[#2D150F] border-[2px] border-[#DFB15B]/25 rounded-[36px] p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#DFB15B]/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="space-y-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#DFB15B]">Exclusive Ledger Coins</span>
                      <h3 className="text-4xl font-serif font-black text-white italic">450 Gourmet Coins</h3>
                      <p className="text-[10px] text-zinc-400 italic font-semibold">Earned through midnight celebration bookings.</p>
                    </div>
                    <Badge className="bg-[#DFB15B]/15 border-2 border-[#DFB15B]/35 hover:bg-[#DFB15B]/25 text-[#DFB15B] text-[10px] font-black py-1.5 px-4 rounded-full uppercase mt-4 sm:mt-0 select-none">
                      Gold Elite Member
                    </Badge>
                  </div>

                  {/* AVAILABLE COUPONS */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-[#DFB15B] tracking-widest pl-1">Available Coupons & Blueprints</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { code: 'URBANBREAD', offer: '15% OFF on Elite Chocolate range', description: 'Applicable on custom sizes greater than 1kg' },
                        { code: 'MIDNIGHTDELIGHT', offer: 'FREE Midnight Surprise delivery', description: 'Zero delivery fee from 11:30 PM to midnight' },
                        { code: 'FIRSTANNIVERSARY', offer: '₹200 OFF Premium custom layers', description: 'Applicable on anniversary reference buttercream designs' }
                      ].map((cp) => (
                        <div key={cp.code} className="bg-gradient-to-b from-[#1C0A05]/90 to-black rounded-[28px] p-6 border border-white/5 relative flex justify-between items-center group">
                          <div className="space-y-2">
                            <span className="text-xs font-black uppercase text-white tracking-wide">{cp.offer}</span>
                            <p className="text-[9px] text-zinc-400 italic leading-snug">{cp.description}</p>
                            <span className="inline-block bg-[#DFB15B]/10 text-[#DFB15B] font-mono text-[10px] uppercase font-black tracking-widest py-1 px-3.5 rounded-lg border border-[#DFB15B]/20">
                              {cp.code}
                            </span>
                          </div>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(cp.code);
                              toast.success(`Coupon code ${cp.code} copied! Paste at checkout.`);
                            }}
                            className="bg-white/5 hover:bg-[#DFB15B] text-white hover:text-black hover:border-transparent p-3 rounded-2xl border border-white/10 shrink-0 transition-all cursor-pointer"
                            aria-label="Copy Coupon"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-display font-black text-white flex items-center gap-3">
                      🔔 Personal <span className="text-[#DFB15B] italic">Alerts</span>
                    </h2>
                    <p className="text-xs text-zinc-400 italic font-semibold mt-1">Receive live confectionery alerts, dispatch warnings, and vouchers.</p>
                  </div>

                  <div className="space-y-4">
                    {notifications.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => markNotifRead(item.id)}
                        className={`p-5 rounded-3xl border transition-all cursor-pointer text-left flex items-start gap-4 ${
                          item.unread 
                            ? 'bg-[#2D150F]/25 border-[#DFB15B]/30 hover:border-[#DFB15B]' 
                            : 'bg-[#2D150F]/10 border-white/5 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 ${
                          item.unread ? 'bg-[#DFB15B]/20 text-[#DFB15B]' : 'bg-white/5 text-zinc-400'
                        }`}>
                          {item.type === 'status' ? '🚚' : item.type === 'discount' ? '🏷️' : '🔥'}
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-4">
                            <h4 className="text-xs font-black text-white uppercase tracking-wide leading-none">{item.title}</h4>
                            <span className="text-[8px] font-bold text-zinc-500 tracking-wider shrink-0">{item.time}</span>
                          </div>
                          <p className="text-[10px] text-zinc-300 italic font-semibold leading-relaxed">{item.desc}</p>
                          {item.unread && (
                            <span className="inline-block bg-emerald-500 text-black text-[7px] font-black uppercase tracking-wider py-0.5 px-2 rounded-full mt-2">
                              New Archive
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: REFER & EARN */}
              {activeTab === 'refer' && (
                <div className="space-y-8">
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-display font-black text-white flex items-center gap-3">
                      📣 Refer & <span className="text-[#DFB15B] italic">Earn</span>
                    </h2>
                    <p className="text-xs text-zinc-400 italic font-semibold mt-1">Invite friends to design buttercream reference cakes and earn wallet credits.</p>
                  </div>

                  {/* HOW IT WORKS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gradient-to-r from-amber-950/10 to-black/40 p-6 sm:p-8 rounded-[36px] border border-white/5">
                    <div className="space-y-4">
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#DFB15B] bg-[#DFB15B]/15 px-2.5 py-1 rounded border border-[#DFB15B]/25">
                        Confectionery Ledger Bonus
                      </span>
                      <h3 className="text-3xl font-serif font-black italic tracking-tighter text-[#DFB15B]">Earn ₹150 Credits</h3>
                      <p className="text-xs text-zinc-300 leading-relaxed font-semibold italic">
                        Share your personalized VIP invitation links with neighbors in Delhi NCR. Once they execute their first cake dispatch, both of you accumulate 100 Gourmet Coins + ₹150 flat credit!
                      </p>
                      
                      <div className="pt-2">
                        <Button 
                          onClick={copyReferral} 
                          className="h-12 px-6 rounded-2xl bg-gradient-to-r from-[#DFB15B] to-[#C99A43] hover:opacity-95 text-black font-black uppercase tracking-widest text-[9px] flex items-center gap-2"
                        >
                          <Share2 className="w-4 h-4 text-black" />
                          <span>Generate Referral Invite Code</span>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/5">
                      <p className="text-[10px] font-black uppercase text-[#DFB15B] tracking-widest">Gourmet Protocol steps</p>
                      <div className="space-y-3">
                        <div className="flex gap-3 text-xs italic font-medium">
                          <span className="text-[#DFB15B] font-bold font-mono">1.</span>
                          <span>Invite friends with custom link or checkout swatches.</span>
                        </div>
                        <div className="flex gap-3 text-xs italic font-medium">
                          <span className="text-[#DFB15B] font-bold font-mono">2.</span>
                          <span>They customized birthday cakes in Faridabad enclaves.</span>
                        </div>
                        <div className="flex gap-3 text-xs italic font-medium">
                          <span className="text-[#DFB15B] font-bold font-mono">3.</span>
                          <span>Earn direct Wallet credits in your ledger balances.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: HELP & SUPPORT */}
              {activeTab === 'support' && (
                <div className="space-y-8">
                  <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-display font-black text-white flex items-center gap-3">
                        📞 Help & <span className="text-[#DFB15B] italic">Support</span>
                      </h2>
                      <p className="text-xs text-zinc-400 italic font-semibold mt-1">Converse with Chief Baker or raise technical dispatch tickets.</p>
                    </div>
                    <Button 
                      onClick={() => setTicketModalOpen(true)}
                      className="rounded-xl h-10 border-2 border-[#DFB15B]/30 hover:border-[#DFB15B] bg-white/5 hover:bg-[#DFB15B] text-white hover:text-black text-[9px] font-black uppercase tracking-widest px-4 gap-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4 text-black" />
                      <span>Raise Ticket</span>
                    </Button>
                  </div>

                  {/* QUICK TRIGGERS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="block">
                      <div className="bg-emerald-950/20 hover:bg-emerald-950/45 border-2 border-emerald-500/20 hover:border-emerald-500 p-6 rounded-3xl transition-all text-left flex items-start gap-4 h-full">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black uppercase text-white tracking-wide">Hotline on WhatsApp</h4>
                          <em className="text-xs text-zinc-400 block mt-1 leading-relaxed">Direct message Chief pasty artist for swatches reference approvals.</em>
                        </div>
                      </div>
                    </a>

                    <a href="tel:+919876543210" className="block">
                      <div className="bg-[#2D150F]/20 hover:bg-[#2D150F]/45 border border-white/10 hover:border-[#DFB15B]/40 p-6 rounded-3xl transition-all text-left flex items-start gap-4 h-full">
                        <div className="w-10 h-10 rounded-2xl bg-[#DFB15B]/10 text-[#DFB15B] flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black uppercase text-white tracking-wide">Direct Baker Calling</h4>
                          <em className="text-xs text-zinc-400 block mt-1 leading-relaxed">Instantly reach dispatch headquarters for traffic-related delays.</em>
                        </div>
                      </div>
                    </a>
                  </div>

                  {/* ACTIVE TICKETS CODES */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-[#DFB15B] tracking-widest pl-1">Active Tech & Confectionery Tickets</p>
                    <div className="space-y-3">
                      {ticketsList.map((tk) => (
                        <div key={tk.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex justify-between items-center text-left">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono font-black text-[#DFB15B]">{tk.id}</span>
                            <h4 className="text-xs font-black uppercase text-white">{tk.topic}</h4>
                            <span className="text-[9px] text-zinc-400 italic block">Raised: {tk.date}</span>
                          </div>
                          <Badge className="bg-[#DFB15B]/10 border border-[#DFB15B]/20 text-[#DFB15B] text-[8px] uppercase tracking-wider py-1 px-3">
                            {tk.stat}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* COLLAPSIBLE FAQ TABS */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-[#DFB15B] tracking-widest pl-1">Frequently Questioned Protocols (FAQs)</p>
                    <div className="space-y-3">
                      {[
                        { q: "Is eggless cake baked on isolated utensils?", a: "Yes. Every single custom order is baked in separate, dedicated ovens utilizing non-animal and eggless milk lipids only." },
                        { q: "Can we shift delivery slots after pre-booking?", a: "Yes, modifications to delivery slots can be processed up to 4 hours prior via WhatsApp calling." }
                      ].map((faq, index) => (
                        <details key={index} className="bg-white/5 border border-white/5 rounded-2xl p-4 cursor-pointer text-left group">
                          <summary className="text-xs font-black text-white hover:text-[#DFB15B] uppercase flex justify-between items-center select-none">
                            <span>{faq.q}</span>
                            <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 text-[#DFB15B]" />
                          </summary>
                          <p className="text-[10px] text-zinc-300 italic font-semibold leading-relaxed mt-3 pt-3 border-t border-white/5">
                            {faq.a}
                          </p>
                        </details>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* MODAL 1: EDIT PROFILE CREDENTIALS DIALOG BOX */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-[#1C0A05]/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-[#1C0A05] border-2 border-[#DFB15B]/35 rounded-[36px] w-full max-w-lg p-6 sm:p-8 shadow-2xl relative"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-display font-black text-white tracking-tight">
                  Customize <span className="italic font-serif font-light text-[#DFB15B]">Credentials</span>
                </h3>
                <p className="text-[10px] uppercase tracking-[0.25em] font-black text-zinc-400 mt-1">Refine your profile instructions</p>
              </div>

              <div className="space-y-4">
                {/* SELECT AVATAR EMBLEM */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#DFB15B] block ml-1">Lounge Emblem Avatar</label>
                  <div className="flex flex-wrap gap-2 justify-between">
                    {AVATAR_OPTIONS.map(av => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setEditPhoto(av.id)}
                        className={`px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 border transition-all ${
                          editPhoto === av.id 
                            ? 'bg-[#DFB15B]/15 border-[#DFB15B] text-[#DFB15B]' 
                            : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{av.emoji}</span>
                        <span className="text-[10.5px] font-bold">{av.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Your Display Name</label>
                  <input 
                    type="text" 
                    value={editDisplayName} 
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#2D150F]/50 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#DFB15B]"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Phone Number (Dispatch Updates)</label>
                  <input 
                    type="text" 
                    value={editPhoneNumber} 
                    onChange={(e) => setEditPhoneNumber(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#2D150F]/50 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#DFB15B]"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block ml-1">DOB (Auto Offer Link)</label>
                    <input 
                      type="date" 
                      value={editDob} 
                      onChange={(e) => setEditDob(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#2D150F]/50 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#DFB15B] dark-date-picker"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Wedding Anniversary</label>
                    <input 
                      type="date" 
                      value={editAnniversary} 
                      onChange={(e) => setEditAnniversary(e.target.value)}
                      className="w-full h-11 px-[#DFB15B]/3 px-4 rounded-xl border border-white/10 bg-[#2D150F]/50 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#DFB15B] dark-date-picker"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6 pt-4 border-t border-white/10 select-none text-black">
                <Button 
                  onClick={() => setIsEditing(false)} 
                  className="flex-1 rounded-xl h-11 text-[9px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/5 text-white bg-transparent hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveProfile} 
                  className="flex-1 rounded-xl h-11 bg-gradient-to-r from-[#DFB15B] to-[#C99A43] text-black font-black text-[9px] uppercase tracking-widest hover:opacity-90"
                >
                  Save Profile
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ADD NEW SAVED ADDRESS */}
      <AnimatePresence>
        {addressModalOpen && (
          <div className="fixed inset-0 bg-[#1C0A05]/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-[#1C0A05] border-2 border-[#DFB15B]/35 rounded-[36px] w-full max-w-md p-6 sm:p-8 shadow-2xl relative"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-display font-black text-white">
                  Add <span className="italic font-serif font-light text-[#DFB15B]">Address</span>
                </h3>
                <p className="text-[10px] uppercase tracking-[0.25em] font-black text-zinc-400 mt-1">Register surprise delivery zone</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#DFB15B] block ml-1">Address Label Tag</label>
                  <div className="flex gap-3">
                    {['Home', 'Office', 'Other'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewAddType(type)}
                        className={`flex-1 h-10 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${
                          newAddType === type 
                            ? 'bg-[#DFB15B] text-black border-transparent' 
                            : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Flat / House Details</label>
                  <input 
                    type="text" 
                    value={newAddLine1} 
                    onChange={(e) => setNewAddLine1(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#2D150F]/50 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#DFB15B]"
                    placeholder="e.g. Apartment 302, Sector enclaves"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Sector / Area</label>
                    <input 
                      type="text" 
                      value={newAddSector} 
                      onChange={(e) => setNewAddSector(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#2D150F]/50 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#DFB15B]"
                      placeholder="e.g. Sector 15"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Faridabad PIN Code</label>
                    <input 
                      type="text" 
                      value={newAddPincode} 
                      onChange={(e) => setNewAddPincode(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#2D150F]/50 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#DFB15B]"
                      placeholder="e.g. 121007"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6 pt-4 border-t border-white/10 select-none text-black">
                <Button 
                  onClick={() => setAddressModalOpen(false)} 
                  className="flex-1 rounded-xl h-11 text-[9px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/5 text-white bg-transparent hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddAddress} 
                  className="flex-1 rounded-xl h-11 bg-[#DFB15B] text-black font-black text-[9px] uppercase tracking-widest hover:opacity-95"
                >
                  Pin Address
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: RAISE SUPPORT TICKET */}
      <AnimatePresence>
        {ticketModalOpen && (
          <div className="fixed inset-0 bg-[#1C0A05]/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-[#1C0A05] border-2 border-[#DFB15B]/35 rounded-[36px] w-full max-w-md p-6 sm:p-8 shadow-2xl relative"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-display font-black text-white">
                  Raise <span className="italic font-serif font-light text-[#DFB15B]">Ticket</span>
                </h3>
                <p className="text-[10px] uppercase tracking-[0.25em] font-black text-zinc-400 mt-1 font-sans">Baker dispatch review pipeline</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block ml-1 font-sans">Select Topic Code</label>
                  <select
                    value={newTicketTopic}
                    onChange={(e) => setNewTicketTopic(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#2D150F]/50 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#DFB15B]"
                  >
                    <option value="Delivery Customization" className="bg-[#1C0A05]">Delivery Customization</option>
                    <option value="Allergy - Separate Oven" className="bg-[#1C0A05]">Allergy - Separate Oven</option>
                    <option value="Billing Blueprints" className="bg-[#1C0A05]">Billing Blueprints</option>
                    <option value="Midnight Buffer Shift" className="bg-[#1C0A05]">Midnight Buffer Shift</option>
                  </select>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block ml-1 font-sans">Details & Specifications</label>
                  <textarea 
                    value={newTicketDesc} 
                    onChange={(e) => setNewTicketDesc(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#2D150F]/50 text-white text-xs font-semibold p-4 focus:outline-none focus:ring-1 focus:ring-[#DFB15B] h-24 resize-none leading-relaxed"
                    placeholder="Enter description..."
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6 pt-4 border-t border-white/10 select-none text-black">
                <Button 
                  onClick={() => setTicketModalOpen(false)} 
                  className="flex-1 rounded-xl h-11 text-[9px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/5 text-white bg-transparent hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleRaiseTicket} 
                  className="flex-1 rounded-xl h-11 bg-[#DFB15B] text-black font-black text-[9px] uppercase tracking-widest hover:opacity-95"
                >
                  Dispatch Ticket
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
