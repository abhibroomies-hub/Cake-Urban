import React, { useState, useEffect } from 'react';
import { useCart } from '../lib/store';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CreditCard, MapPin, Truck, ChevronRight, CheckCircle2, Calendar, Clock, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firebase';
import { toast } from 'sonner';
import SEO from '../components/SEO';

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart();
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Step state (starts on Logistics because user MUST be logged in to access checkout details)
  const [step, setStep] = useState(2); // 2: Address/Logistics, 3: Payment
  
  // Delivery details states
  const [address, setAddress] = useState({
    line1: '',
    sector: '',
    city: 'Faridabad',
    pincode: '121001'
  });
  const [deliveryDate, setDeliveryDate] = useState(() => {
    // Default to tomorrow in YYYY-MM-DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().substring(0, 10);
  });
  const [deliverySlot, setDeliverySlot] = useState('6:00 PM - 10:00 PM (Evening)');
  const [cakeInstructions, setCakeInstructions] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Enforce Login or Signup step before entering Checkout.
  // After login, the user will be automatically redirected back here!
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("An authenticated entry is required to initiate secure checkout.");
      navigate('/login?redirect=/checkout');
    }
  }, [user, authLoading, navigate]);

  // Pre-populate address from user profile once loaded
  useEffect(() => {
    if (profile?.addresses && profile.addresses.length > 0) {
      const firstAddr = profile.addresses[0];
      setAddress({
        line1: firstAddr.line1 || '',
        sector: firstAddr.sector || '',
        city: 'Faridabad',
        pincode: firstAddr.pincode || '121001'
      });
    }
  }, [profile]);

  const handleNextStep = () => {
    if (!address.line1 || !address.sector || !address.pincode) {
      toast.error("Please fill in complete address details before proceeding.");
      return;
    }
    setStep(s => s + 1);
  };

  const handlePayment = async () => {
    setLoading(true);
    // Mocking Razorpay premium payments delay
    await new Promise(r => setTimeout(r, 2000));
    
    const path = 'orders';
    try {
      const orderData = {
        userId: user?.uid || null,
        guestEmail: user?.email || null,
        phoneNumber: profile?.phoneNumber || null,
        items,
        total: getTotal(),
        status: 'new',
        paymentStatus: 'paid',
        shippingAddress: address,
        deliveryDate,
        deliverySlot,
        cakeInstructions,
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, path), orderData);

      // Dispatch automated order completion transactional email via SMTP
      try {
        const orderEmail = user?.email || profile?.email || null;
        if (orderEmail) {
          await fetch('/api/email/send-auto-reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: orderEmail,
              type: 'order_completion',
              details: {
                total: getTotal(),
                deliveryDate,
                deliverySlot,
                instructions: cakeInstructions,
                items: items.map(item => `${item.quantity}x ${item.name}${item.selectedWeight ? ` (${item.selectedWeight} kg)` : ''}${item.selectedFlavor ? ` [${item.selectedFlavor}]` : ''}`).join(', ')
              }
            })
          });
        }
      } catch (emailErr) {
        console.error("Order auto-reply trigger failed:", emailErr);
      }

      setOrderComplete(true);
      clearCart();
      toast.success("Artisanal order requested successfully!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-10 py-32 flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#D89C95] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orderComplete) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto py-32 flex flex-col items-center text-center bg-transparent min-h-screen relative overflow-hidden"
      >
        <SEO 
          title="Reservation Successful" 
          description="Your premium Cake Urban order is complete! Our Faridabad bakery atelier has received your details and is preparing to build your masterpiece."
        />
        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/50 pointer-events-none" style={{ clipPath: 'ellipse(100% 40% at 50% 0%)' }} />
        
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} className="w-40 h-40 bg-white border border-[#E8DDD7] rounded-[48px] flex items-center justify-center mb-12 shadow-2xl relative z-10">
            <CheckCircle2 className="w-20 h-20 text-[#D89C95]" strokeWidth={1} />
        </motion.div>
        
        <div className="relative z-10 space-y-6 px-4">
            <h1 className="text-5xl md:text-6xl font-display font-black text-[#3B1F17] tracking-tighter">Your Masterpiece is <span className="italic font-serif font-light text-[#D89C95] text-6xl md:text-7xl block md:inline mt-4 md:mt-0">Commencing.</span></h1>
            <p className="text-[#3B1F17]/60 text-base md:text-xl font-medium italic max-w-xl mx-auto leading-relaxed">Our designers and chefs have received your logistics details. The custom baking ritual is starting. We will notify you when the delivery to {address.sector || "your enclave"} is active.</p>
            <div className="pt-12">
                <Button 
                    size="lg" 
                    className="rounded-full bg-[#3B1F17] hover:bg-[#2A1610] px-12 h-16 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl transition-all duration-300" 
                    onClick={() => navigate('/account')}
                >
                    Track in Account Chronology
                </Button>
            </div>
        </div>

        <div className="mt-20 flex gap-4 opacity-10">
            <div className="w-1.5 h-40 bg-[#3B1F17] rounded-full" />
            <div className="w-1.5 h-60 bg-[#D89C95] rounded-full" />
            <div className="w-1.5 h-40 bg-[#3B1F17] rounded-full" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-6 md:px-10 py-12 md:py-24 max-w-7xl min-h-screen"
    >
      <SEO 
        title="Secure Curation Request" 
        description="Complete and customize your order. Choose from flexible hand-picked delivery slots including elite Midnight deliveries across Faridabad."
      />

      {/* Checkout step visual indicators */}
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-16 md:mb-24 overflow-x-auto pb-6 no-scrollbar justify-start md:justify-center">
        {[
          { n: 2, l: 'Logistics Options', active: step >= 2 },
          { n: 3, l: 'Secure Settlement', active: step >= 3 }
        ].map(s => (
          <div key={s.n} className="flex items-center gap-4 md:gap-6 shrink-0 group">
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-[10px] md:text-xs font-black transition-all duration-500 border-2 ${
              s.active ? 'bg-[#3B1F17] border-[#3B1F17] text-white shadow-xl rotate-3' : 'bg-white border-[#E8DDD7] text-[#3B1F17]/20'
            }`}>
              {s.active && s.n < step ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : s.n - 1}
            </div>
            <div className="flex flex-col min-w-[60px]">
                <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 ${s.active ? 'text-[#3B1F17]' : 'text-[#3B1F17]/20'}`}>{s.l}</span>
                {s.active && <div className="h-0.5 w-full bg-[#D89C95]/30 mt-1 rounded-full animate-pulse" />}
            </div>
            {s.n < 3 && (
                <div className="w-12 md:w-20 h-[1px] bg-[#E8DDD7] relative mx-2 md:mx-4">
                    {s.active && <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="absolute top-0 left-0 h-full bg-[#D89C95]" />}
                </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
        <div className="lg:col-span-8">
          <AnimatePresence mode='wait'>
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Card className="rounded-[40px] md:rounded-[60px] border border-[#E8DDD7] shadow-xl bg-white p-2">
                  <CardHeader className="p-8 md:p-12">
                    <CardTitle className="text-3xl md:text-4xl font-serif font-bold text-[#3B1F17] tracking-tighter flex items-center gap-4 md:gap-6">
                        <MapPin className="text-[#D89C95] w-8 h-8 md:w-10 md:h-10" strokeWidth={1} /> Logistics details
                    </CardTitle>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3B1F17]/40 mt-4">Where and when shall the creation reach its destination?</p>
                  </CardHeader>
                  <CardContent className="p-8 md:p-12 pt-0 space-y-8 md:space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Address Fields */}
                        <div className="space-y-3 md:col-span-2">
                           <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.4em] opacity-40 pl-1 italic">Door No / Atelier / Residence Building</label>
                           <Input className="h-16 rounded-2xl border-none bg-[#F8F4F1] focus-visible:ring-1 focus-visible:ring-[#D89C95] font-medium text-sm pl-6 shadow-inner" placeholder="Ex. Flat 402, Luxury Heights" value={address.line1} onChange={e => setAddress({...address, line1: e.target.value})} required />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.4em] opacity-40 pl-1 italic">Sector / Enclave (Faridabad)</label>
                           <Input className="h-16 rounded-2xl border-none bg-[#F8F4F1] focus-visible:ring-1 focus-visible:ring-[#D89C95] font-medium text-sm pl-6 shadow-inner" placeholder="Ex. Sector 15" value={address.sector} onChange={e => setAddress({...address, sector: e.target.value})} required />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.4em] opacity-40 pl-1 italic">The City</label>
                           <Input className="h-16 rounded-2xl bg-white border border-[#E8DDD7] text-[#3B1F17]/40 font-serif italic text-sm pl-6" readOnly value="Faridabad" />
                        </div>

                        {/* Delivery Handpicked Calendars */}
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.4em] opacity-40 pl-1 italic flex items-center gap-2">
                             <Calendar className="w-3.5 h-3.5 text-[#cc7a74]" /> Handpicked Delivery Date
                           </label>
                           <Input 
                             type="date" 
                             min={new Date().toISOString().substring(0, 10)}
                             className="h-16 rounded-2xl border-none bg-[#F8F4F1] focus-visible:ring-1 focus-visible:ring-[#D89C95] font-medium text-sm pl-6 shadow-inner" 
                             value={deliveryDate} 
                             onChange={e => setDeliveryDate(e.target.value)} 
                             required 
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.4em] opacity-40 pl-1 italic flex items-center gap-2">
                             <Clock className="w-3.5 h-3.5 text-[#cc7a74]" /> Standard Delivery Slot
                           </label>
                           <select 
                             className="w-full h-16 rounded-2xl border-none bg-[#F8F4F1] focus:ring-1 focus:ring-[#D89C95] font-medium text-sm pl-6 shadow-inner text-[#3B1F17]"
                             value={deliverySlot} 
                             onChange={e => setDeliverySlot(e.target.value)}
                           >
                             <option value="10:00 AM - 2:00 PM (Morning Premium)">10:00 AM - 2:00 PM (Morning Premium)</option>
                             <option value="2:00 PM - 6:00 PM (Afternoon Matinee)">2:00 PM - 6:00 PM (Afternoon Matinee)</option>
                             <option value="6:00 PM - 10:00 PM (Evening Twilight)">6:00 PM - 10:00 PM (Evening Twilight)</option>
                             <option value="11:30 PM - 12:15 AM (Elite Midnight Supreme)">11:30 PM - 12:15 AM (Elite Midnight Supreme)</option>
                           </select>
                        </div>

                        {/* Custom Instructions */}
                        <div className="space-y-3 md:col-span-2">
                           <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.4em] opacity-40 pl-1 italic flex items-center gap-2">
                             <Edit3 className="w-3.5 h-3.5 text-[#cc7a74]" /> Custom Workshop Notes / Gate Protocols
                           </label>
                           <textarea 
                             className="w-full h-24 rounded-2xl border-none bg-[#F8F4F1] focus:ring-1 focus:ring-[#D89C95] font-medium text-sm p-6 shadow-inner resize-none text-[#3B1F17]" 
                             placeholder="Ex. Please write 'Happy Birthday Kiara!' in italic cursive gold frosting. Call upon arrival."
                             value={cakeInstructions}
                             onChange={e => setCakeInstructions(e.target.value)}
                           />
                        </div>
                    </div>
                    
                    <Button className="w-full h-20 rounded-[32px] bg-[#3B1F17] hover:bg-[#2A1610] text-white font-black text-[10px] uppercase tracking-[0.4em] mt-6 shadow-2xl transition-all" onClick={handleNextStep}>
                        Proceed to Secure Payment
                        <ChevronRight className="w-5 h-5 ml-2 opacity-40 animate-bounce" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="rounded-[40px] md:rounded-[60px] border-none shadow-2xl bg-[#3B1F17] text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#D89C95] opacity-[0.05] rounded-full blur-3xl group-hover:opacity-[0.1] transition-opacity pointer-events-none" />
                  <CardHeader className="p-8 md:p-12 relative z-10">
                    <CardTitle className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tighter flex items-center gap-4 md:gap-6">
                        <CreditCard className="text-[#D89C95] w-8 h-8 md:w-10 md:h-10" strokeWidth={1} /> Secure Acquisition
                    </CardTitle>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mt-4">Exchanging value for hand-crafted superiority</p>
                  </CardHeader>
                  <CardContent className="p-8 md:p-12 pt-0 space-y-10 md:space-y-12 relative z-10">
                    <div className="space-y-8 md:space-y-10">
                        <p className="text-white/60 text-[13px] leading-relaxed max-w-lg font-light italic">You are navigating our secure order gateway. Premium unified UPI, instant local cards, and secure banking transfers are verified via Razorpay seamlessly.</p>
                        
                        <div className="p-8 md:p-10 bg-white/5 border border-white/10 rounded-[32px] md:rounded-[40px] flex items-center justify-between backdrop-blur-md">
                            <div className="space-y-3">
                                <p className="text-[8px] md:text-[9px] text-white/30 uppercase font-black tracking-[0.4em]">Transaction Total</p>
                                <p className="text-4xl md:text-5xl font-serif font-bold text-[#D89C95] italic leading-none">₹{getTotal()}</p>
                            </div>
                            <div className="opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                                <img src="https://razorpay.com/assets/razorpay-logo.svg" className="w-12 h-12 md:w-16 md:h-16" alt="Razorpay" />
                            </div>
                        </div>

                        {/* Logistics Summary Review */}
                        <div className="p-6 bg-white/5 border border-white/5 rounded-2xl text-[11px] space-y-2 font-medium">
                          <p className="text-[#D89C95] font-black uppercase text-[8px] tracking-[0.3em]">Logistics Reservation Checked</p>
                          <p className="text-white/80"><span className="text-white/40">Ship To:</span> {address.line1}, {address.sector}, Faridabad</p>
                          <p className="text-white/80"><span className="text-white/40">When:</span> {new Date(deliveryDate).toLocaleDateString('en-IN', {month: 'long', day: 'numeric'})} during {deliverySlot}</p>
                          {cakeInstructions && <p className="text-white/80 italic text-white/50"><span className="text-white/40">Instructions:</span> "{cakeInstructions}"</p>}
                        </div>
                    </div>
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 h-20 rounded-[32px] border-white/10 text-white hover:bg-white/5 uppercase font-black text-[10px] tracking-widest leading-none">Back</Button>
                      <Button 
                        className="flex-[2] h-20 rounded-[32px] bg-white hover:bg-[#F8F4F1] text-[10px] font-black uppercase tracking-[0.4em] text-[#3B1F17] shadow-2xl transition-all" 
                        onClick={handlePayment}
                        disabled={loading}
                      >
                        {loading ? 'Transmitting details...' : 'Finalize Reservation'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mini Product List Summary */}
        <div className="lg:col-span-4 space-y-8 md:space-y-10 animate-fade-in">
           <div className="bg-white border border-[#E8DDD7] rounded-[40px] md:rounded-[48px] p-8 md:p-10 shadow-sm sticky top-28">
                <h3 className="font-serif font-bold text-[#3B1F17] text-2xl mb-8 md:mb-10 tracking-tight flex items-center gap-4">
                    <Truck className="w-5 h-5 md:w-6 md:h-6 text-[#D89C95]" strokeWidth={1} /> Selected Gallery
                </h3>
                <div className="space-y-6 md:space-y-8">
                    {items.map(item => (
                        <div key={`${item.id}-${item.selectedWeight}`} className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                                <p className="text-[#3B1F17] font-serif font-bold italic text-base md:text-lg leading-tight">{item.name}</p>
                                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#3B1F17]/50">{item.quantity} x {item.selectedWeight}kg {item.eggless ? '• Eggless' : ''}</p>
                            </div>
                            <span className="font-serif font-bold text-[#3B1F17] text-base md:text-lg whitespace-nowrap">₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                    <div className="border-t border-[#E8DDD7] pt-8 md:pt-10 flex justify-between items-end">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#3B1F17]/40 pb-1">Final Amount</span>
                        <span className="text-3xl font-serif font-bold text-[#D89C95] italic leading-none">₹{getTotal()}</span>
                    </div>
                </div>
           </div>

           <div className="p-8 md:p-10 rounded-[40px] md:rounded-[48px] bg-white border border-[#E8DDD7] flex flex-col gap-6 shadow-sm">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#F8F4F1] rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-[#D89C95]" />
              </div>
              <div>
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-[#D89C95] italic mb-3">Benefit Unlocked</p>
                <p className="text-xs text-[#3B1F17]/60 leading-relaxed font-medium italic">Your artisan selection is qualified for <span className="text-[#D89C95] font-bold">Midnight Delivery</span> across Faridabad. A premium celebration of urban cake culture. 🎇</p>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
