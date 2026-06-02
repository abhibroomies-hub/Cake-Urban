import React, { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, doc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { Package, MapPin, Calendar, Clock, ChevronRight, User, Settings, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SEO from '../components/SEO';

export default function Profile() {
  const { user, profile, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const navigate = useNavigate();

  // Profile Edit fields states
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editLine1, setEditLine1] = useState('');
  const [editSector, setEditSector] = useState('');
  const [editPincode, setEditPincode] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditDisplayName(profile.displayName || '');
      setEditPhoneNumber(profile.phoneNumber || '');
      const defaultAddressObj = profile.addresses?.[0] || (profile as any)?.address;
      setEditLine1(typeof defaultAddressObj === 'string' ? defaultAddressObj : (defaultAddressObj?.line1 || ''));
      setEditSector(defaultAddressObj?.sector || 'Sector 15');
      setEditPincode(defaultAddressObj?.pincode || '121007');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const updatedAddress = {
        id: 'default-address',
        type: 'home' as const,
        line1: editLine1,
        sector: editSector,
        city: 'Faridabad',
        pincode: editPincode
      };

      const updatedProfile = {
        displayName: editDisplayName,
        phoneNumber: editPhoneNumber,
        addresses: [updatedAddress]
      };

      await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true });

      // Sync to local storage for local session persistence
      const cachedUser = localStorage.getItem('cakeurban_local_user');
      if (cachedUser) {
        try {
          const parsed = JSON.parse(cachedUser);
          parsed.displayName = editDisplayName;
          parsed.phoneNumber = editPhoneNumber;
          localStorage.setItem('cakeurban_local_user', JSON.stringify(parsed));
        } catch (e) {}
      }

      toast.success("Profile customized with elite precision!");
      setIsEditing(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err: any) {
      console.error("Error setting profile:", err);
      toast.error("Failed to update profile: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

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
        setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error fetching profile order history:", error);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    localStorage.removeItem('cakeurban_local_user');
    await signOut(auth);
    toast.success("Signed out successfully");
    navigate('/');
  };

  const loading = authLoading || ordersLoading;

  const defaultAddress = profile?.addresses?.[0] || (profile as any)?.address;

  const statusColors: any = {
    'new': 'bg-blue-500/10 text-blue-500',
    'baking': 'bg-[#D89C95]/10 text-[#D89C95]',
    'out-for-delivery': 'bg-[#3B1F17]/10 text-[#3B1F17]',
    'delivered': 'bg-green-500/10 text-green-500',
  };

  if (loading) {
    return (
      <div className="container mx-auto px-10 py-32 flex justify-center">
        <div className="w-10 h-10 border-4 border-[#D89C95] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-10 py-24 min-h-screen bg-transparent">
      <SEO 
        title="My Account" 
        description="Access and manage your Cake Urban profile. View your order chronology, reward points tiers, and manage eggless artisan confections delivered to your door in Faridabad." 
        keywords="Cake Urban account, customer profile, bakery orders, Faridabad eggless cake order history"
      />
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between border-b border-[#E8DDD7] pb-12">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-[32px] bg-white border border-[#E8DDD7] shadow-sm flex items-center justify-center p-2">
              <div className="w-full h-full rounded-[24px] bg-[#F8F4F1] flex items-center justify-center">
                <User className="w-10 h-10 text-[#D89C95] opacity-40" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-display font-black text-[#3B1F17] tracking-tighter">
                Velvet <span className="italic font-serif font-light text-[#D89C95]">{profile?.displayName || 'Collector'}</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-[#3B1F17]/40 italic">Urban Artisan Member</p>
            </div>
          </div>
          <div className="flex gap-4">
               <Button onClick={() => setIsEditing(true)} variant="outline" className="rounded-2xl h-14 border-[#E8DDD7] bg-white hover:bg-[#D89C95]/10 text-[10px] font-black uppercase tracking-widest gap-2 transition-all">
                   <Settings className="w-4 h-4 text-[#D89C95]" /> Edit Profile
               </Button>
               <Button onClick={handleLogout} variant="ghost" className="rounded-2xl h-14 text-red-400 hover:text-red-500 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest gap-2">
                   <LogOut className="w-4 h-4" /> Sign Out
               </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Order History */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-display font-black text-[#3B1F17] italic">Order Chronology</h3>
              <Badge className="bg-white border border-[#E8DDD7] text-[#3B1F17]/40 font-black text-[9px] uppercase tracking-widest rounded-full">{orders.length} Sessions</Badge>
            </div>

            {orders.length === 0 ? (
                <Card className="rounded-[40px] border-dashed border-2 border-[#E8DDD7] bg-transparent p-12 text-center">
                    <Package className="w-12 h-12 text-[#3B1F17]/10 mx-auto mb-6" strokeWidth={1} />
                    <p className="text-[#3B1F17]/40 font-medium italic text-sm">Your acquisition history is currently blank. Discover your first masterpiece in our gallery.</p>
                    <Button onClick={() => navigate('/shop')} className="mt-8 rounded-full bg-[#3B1F17] px-8 h-12 text-[10px] font-black uppercase tracking-widest text-white shadow-xl">Explore Shop</Button>
                </Card>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <motion.div 
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-[#E8DDD7] rounded-[40px] p-8 shadow-sm hover:translate-x-1 transition-all duration-300"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <p className="font-display font-black text-[#3B1F17] text-xl">#{order.id.slice(-6).toUpperCase()}</p>
                                        <Badge className={`${statusColors[order.status] || 'bg-gray-100'} border-none font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-full`}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-[#3B1F17]/30">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Package className="w-3 h-3" />
                                            {order.items.length} Curated Items
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 self-end md:self-center">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B1F17]/30 mb-1">Value</p>
                                        <p className="text-2xl font-serif font-bold text-[#D89C95] italic leading-none">₹{order.total}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-2xl border border-[#E8DDD7] h-12 w-12 text-[#3B1F17]/20 hover:text-[#D89C95] hover:bg-[#F8F4F1] transition-all">
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="rounded-[48px] border border-[#E8DDD7] bg-white p-8 shadow-sm">
                <CardHeader className="p-0 mb-8 border-b border-[#E8DDD7] pb-6">
                    <CardTitle className="text-xl font-display font-bold text-[#3B1F17] tracking-tight flex items-center gap-3">
                        <MapPin className="text-[#D89C95] w-5 h-5" /> Default Address
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#3B1F17]/30">Location</p>
                            <p className="text-sm font-bold text-[#3B1F17]">{defaultAddress?.line1 || 'No address saved'}</p>
                            <p className="text-sm font-bold text-[#3B1F17]">{defaultAddress?.sector && `Sector ${defaultAddress.sector}, Faridabad`}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#3B1F17]/30">Protocol</p>
                            <p className="text-sm font-serif font-light italic text-[#D89C95]">{defaultAddress?.pincode || 'Update Info'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-[#3B1F17] rounded-[48px] p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D89C95] opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity" />
                <div className="relative z-10 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D89C95]">Exclusive Tier</p>
                    <h4 className="text-2xl font-serif font-light italic tracking-tighter text-[#D89C95]">Artisan Rewards</h4>
                    <p className="text-xs text-white/50 leading-relaxed font-medium">You are 2 requisitions away from the <span className="text-[#D89C95] font-bold">Midnight Sovereign</span> tier. Unlock complimentary midnight deliveries across Faridabad.</p>
                    <div className="pt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#D89C95] w-2/3" />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal Dialog Box */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-[#3B1F17]/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white border-[6px] border-[#DFB15B]/20 rounded-[48px] w-full max-w-lg p-8 sm:p-10 shadow-2xl relative overflow-hidden"
            >
              {/* Top Accent Lines */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#DFB15B] via-[#D89C95] to-[#DFB15B]" />
              
              {/* Header */}
              <div className="text-center mb-8">
                <h3 className="text-3xl font-display font-black text-[#3B1F17] tracking-tight">Customize <span className="italic font-serif font-light text-[#D89C95]">Credentials</span></h3>
                <p className="text-[9px] uppercase tracking-[0.25em] font-black text-[#D89C95]/80 mt-1">Refine your profile instructions</p>
              </div>

              {/* Form Inputs */}
              <div className="space-y-5">
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#3B1F17]/40 block ml-1">Your Name</label>
                  <input 
                    type="text" 
                    value={editDisplayName} 
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-[#E8DDD7] bg-[#FFFDFB] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#DFB15B] text-[#3B1F17]"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#3B1F17]/40 block ml-1">Phone Number (For Fresh Dispatch updates)</label>
                  <input 
                    type="text" 
                    value={editPhoneNumber} 
                    onChange={(e) => setEditPhoneNumber(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-[#E8DDD7] bg-[#FFFDFB] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#DFB15B] text-[#3B1F17]"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#3B1F17]/40 block ml-1">Default Delivery Address</label>
                  <input 
                    type="text" 
                    value={editLine1} 
                    onChange={(e) => setEditLine1(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-[#E8DDD7] bg-[#FFFDFB] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#DFB15B] text-[#3B1F17]"
                    placeholder="House / Flat / Area detail"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#3B1F17]/40 block ml-1">Sector / Area</label>
                    <input 
                      type="text" 
                      value={editSector} 
                      onChange={(e) => setEditSector(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-[#E8DDD7] bg-[#FFFDFB] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#DFB15B] text-[#3B1F17]"
                      placeholder="e.g. Sector 31 or Sector 15"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#3B1F17]/40 block ml-1">Pincode</label>
                    <input 
                      type="text" 
                      value={editPincode} 
                      onChange={(e) => setEditPincode(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-[#E8DDD7] bg-[#FFFDFB] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#DFB15B] text-[#3B1F17]"
                      placeholder="e.g. 121003"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-8 pt-4 border-t border-[#E8DDD7]/60">
                <Button 
                  onClick={() => setIsEditing(false)} 
                  variant="outline" 
                  className="flex-1 rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest border-[#E8DDD7] hover:bg-neutral-50"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={isSaving}
                  className="flex-1 rounded-2xl h-12 bg-[#3B1F17] hover:bg-[#D89C95] text-white font-black text-[10px] uppercase tracking-widest shadow-md transition-all duration-300"
                >
                  {isSaving ? 'Processing...' : 'Save Profile'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
