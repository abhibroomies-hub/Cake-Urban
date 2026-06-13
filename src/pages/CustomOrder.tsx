import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Send, Sparkles, Image as ImageIcon, MapPin, Clock, ChevronRight, ChevronLeft, Cake, Layers, Palette, Upload, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firebase';
import SEO from '../components/SEO';
import { useAuth } from '../hooks/useAuth';

const STEPS = [
  { id: 'flavor', label: 'Artisan Flavor', icon: Cake },
  { id: 'structure', label: 'Tiers & Shape', icon: Layers },
  { id: 'design', label: 'Icing & Palette', icon: Palette },
  { id: 'reference', label: 'Inspirations', icon: Upload }
];

const FLAVORS = [
  { id: 'dark-choc', name: 'Belgian Dark Chocolate', desc: 'Indulgent 70% cocoa intensity', icon: '🍫' },
  { id: 'red-velvet', name: 'Classic Red Velvet', desc: 'Smooth cream cheese fusion', icon: '🎂' },
  { id: 'blueberry', name: 'Zesty Blueberry', desc: 'Fresh mountain berry compote', icon: '🫐' },
  { id: 'vanilla-bean', name: 'Madagascar Vanilla', desc: 'Pure orchid bean excellence', icon: '🍦' }
];

const SHAPES = ['Classic Round', 'Modern Square', 'Artisan Heart', 'Bespoke Abstract'];
const TIERS = ['Single Tier', 'Dual Tier (Architectural)', 'Grand Triple Tier'];

export default function CustomOrder() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    flavor: 'dark-choc',
    shape: 'Classic Round',
    tiers: 'Single Tier',
    icingColor: '#FFFFFF',
    cakeMessage: '',
    referenceImages: [] as string[],
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    eventDate: ''
  });
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        contactName: prev.contactName || profile.displayName || '',
        contactEmail: prev.contactEmail || profile.email || '',
        contactPhone: prev.contactPhone || profile.phoneNumber || ''
      }));
    }
  }, [profile]);

  const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (step < STEPS.length - 1) {
      nextStep();
      return;
    }

    if (!formData.contactName.trim()) {
      toast.error("Please provide your name.");
      return;
    }
    if (!formData.contactEmail.trim()) {
      toast.error("Please provide your email address.");
      return;
    }
    if (!formData.contactPhone || formData.contactPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit registered phone number.");
      return;
    }
    if (!formData.eventDate) {
      toast.error("Please select a target celebration date.");
      return;
    }

    setLoading(true);
    const path = 'custom_orders';
    try {
      await addDoc(collection(db, path), {
        ...formData,
        status: 'received',
        createdAt: serverTimestamp(),
      });

      // Dispatch automated transactional email confirmation via GoDaddy SMTP or fallback simulation
      try {
        await fetch('/api/email/send-auto-reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.contactEmail,
            type: 'custom_inquiry',
            details: {
              name: formData.contactName,
              flavor: formData.flavor,
              shape: formData.shape,
              message: formData.cakeMessage,
              date: formData.eventDate,
              phone: formData.contactPhone
            }
          })
        });
      } catch (emailErr) {
        console.error("Automated inquiry auto-reply trigger failed:", emailErr);
      }

      toast.success("Vision Received! Our lead artisan will contact you shortly.");
      setStep(0);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 md:px-10 py-12 md:py-24 min-h-screen bg-transparent"
    >
      <SEO 
        title="Custom Cake Builder & Designer Studio - Cake Urban"
        description="Design and build your dream cake step-by-step with Cake Urban's interactive Custom Cake Builder Studio. Choose flavors, sizes, icing textures, and reference photos."
        keywords="custom cake builder, design cake online, buy customized cakes faridabad, elite designer cakes local delivery"
      />
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
           <div className="inline-block bg-[#DFB15B]/10 text-[#DFB15B] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-4 border border-[#DFB15B]/20">
              Visionary Studio
            </div>
            <h1 className="text-[44px] md:text-[64px] font-display font-black text-white tracking-tight leading-none mb-6">
              Cake <span className="italic font-serif font-light text-[#DFB15B]">Builder.</span>
            </h1>
            <p className="text-[#FFFDFB]/80 text-sm md:text-lg font-medium italic max-w-lg mx-auto leading-relaxed">
              Curate your masterpiece step-by-step. From architectural tiers to botanical palettes.
            </p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between items-center max-w-2xl mx-auto relative mb-16">
           <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -translate-y-1/2 z-0" />
           {STEPS.map((s, i) => (
             <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 border ${
                  i === step ? 'bg-[#DFB15B] text-[#140603] border-[#DFB15B] shadow-[0_4px_20px_rgba(223,177,91,0.25)] scale-110' : 
                  i < step ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-[#140603] border-white/10 text-white/30'
                }`}>
                   {i < step ? <Check className="w-5 h-5 md:w-6 md:h-6" /> : <s.icon className="w-4 h-4 md:w-5 md:h-5" />}
                </div>
                <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest hidden md:block ${
                  i === step ? 'text-[#DFB15B] font-bold' : 'text-white/30'
                }`}>{s.label}</span>
             </div>
           ))}
        </div>

        {/* Builder Area */}
        <Card className="rounded-[48px] md:rounded-[60px] border border-[#DFB15B]/15 shadow-[0_30px_70px_rgba(0,0,0,0.5)] bg-[#26130F]/45 backdrop-blur-md overflow-hidden p-3 md:p-6 min-h-[500px] flex flex-col">
           <CardContent className="flex-1 p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  {/* STEP 1: FLAVOR */}
                  {step === 0 && (
                    <div className="space-y-8">
                       <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight">Select Artisan <span className="italic font-serif font-light text-[#DFB15B]">Base</span></h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {FLAVORS.map(f => (
                            <div 
                              key={f.id}
                              onClick={() => setFormData({...formData, flavor: f.id})}
                              className={`p-6 rounded-[32px] border cursor-pointer transition-all ${
                                formData.flavor === f.id ? 'border-[#DFB15B] bg-[#DFB15B]/10 shadow-[0_0_25px_rgba(223,177,91,0.15)]' : 'border-[#DFB15B]/10 bg-[#140603]/40 hover:border-[#DFB15B]/30'
                              }`}
                            >
                               <div className="flex items-center gap-6">
                                  <span className="text-4xl">{f.icon}</span>
                                  <div className="flex flex-col text-left">
                                     <span className="text-lg font-bold text-white">{f.name}</span>
                                     <span className="text-xs text-[#FFFDFB]/60 font-medium italic mt-0.5">{f.desc}</span>
                                  </div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  )}

                  {/* STEP 2: STRUCTURE */}
                  {step === 1 && (
                    <div className="space-y-12 text-left">
                       <div className="space-y-8">
                          <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight">The <span className="italic font-serif font-light text-[#DFB15B]">Structure</span></h3>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-[#FFFDFB]/70 uppercase tracking-widest block">Layers / Tiers</label>
                             <div className="flex flex-wrap gap-4">
                                {TIERS.map(t => (
                                  <button
                                    key={t}
                                    onClick={() => setFormData({...formData, tiers: t})}
                                    className={`px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                                      formData.tiers === t ? 'bg-[#DFB15B] text-[#140603] border-[#DFB15B] shadow-md font-black' : 'bg-[#140603] text-white border-[#DFB15B]/20 hover:bg-[#DFB15B]/10'
                                    }`}
                                  >
                                    {t}
                                  </button>
                                ))}
                             </div>
                          </div>
                          <div className="space-y-4 font-sans">
                             <label className="text-[10px] font-black text-[#FFFDFB]/70 uppercase tracking-widest block">Geometry / Shape</label>
                             <div className="flex flex-wrap gap-4 font-sans">
                                {SHAPES.map(s => (
                                  <button
                                    key={s}
                                    onClick={() => setFormData({...formData, shape: s})}
                                    className={`px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                                      formData.shape === s ? 'bg-[#DFB15B] text-[#140603] border-[#DFB15B] shadow-md font-black' : 'bg-[#140603] text-white border-[#DFB15B]/20 hover:bg-[#DFB15B]/10'
                                    }`}
                                  >
                                    {s}
                                  </button>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                  )}

                  {/* STEP 3: DESIGN */}
                  {step === 2 && (
                    <div className="space-y-10 text-left">
                       <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight">Aesthetic <span className="italic font-serif font-light text-[#DFB15B]">Details</span></h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-[#FFFDFB]/70 uppercase tracking-widest block">Icing Palette</label>
                             <div className="flex items-center gap-4">
                                <input 
                                  type="color" 
                                  value={formData.icingColor}
                                  onChange={e => setFormData({...formData, icingColor: e.target.value})}
                                  className="w-16 h-16 rounded-2xl border-none p-1 cursor-pointer bg-[#140603] shadow-md border border-[#DFB15B]/25"
                                />
                                <span className="text-xs font-bold uppercase tracking-widest text-[#FFFDFB]/80 font-medium italic">Pick your primary hue</span>
                             </div>
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-[#FFFDFB]/70 uppercase tracking-widest block">Cake Inscription</label>
                             <Input 
                                placeholder="E.g. Let's Celebrate Julian"
                                className="h-16 rounded-2xl border border-[#DFB15B]/20 bg-[#140603] p-6 text-white placeholder-white/35 focus:ring-1 focus:ring-[#DFB15B] outline-none"
                                value={formData.cakeMessage}
                                onChange={e => setFormData({...formData, cakeMessage: e.target.value})}
                             />
                          </div>
                       </div>
                    </div>
                  )}

                  {/* STEP 4: CONTACT & REFERENCE */}
                  {step === 3 && (
                    <div className="space-y-10 text-left">
                       <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight">The <span className="italic font-serif font-light text-[#DFB15B]">Requisition</span></h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-[#FFFDFB]/70 uppercase tracking-widest block">Your Identity</label>
                             <Input 
                                placeholder="Full Name"
                                className="h-16 rounded-2xl border border-[#DFB15B]/20 bg-[#140603] p-6 text-white placeholder-white/35 focus:ring-1 focus:ring-[#DFB15B] outline-none"
                                value={formData.contactName}
                                onChange={e => setFormData({...formData, contactName: e.target.value})}
                             />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-[#FFFDFB]/70 uppercase tracking-widest block">Email Address</label>
                             <Input 
                                type="email"
                                placeholder="name@domain.com"
                                className="h-16 rounded-2xl border border-[#DFB15B]/20 bg-[#140603] p-6 text-white placeholder-white/35 focus:ring-1 focus:ring-[#DFB15B] outline-none"
                                value={formData.contactEmail}
                                onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                             />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-[#FFFDFB]/70 uppercase tracking-widest block">Mobile Number (Required)</label>
                             <div className="relative flex items-center">
                                <span className="absolute left-6 font-bold text-sm text-white/50">+91</span>
                                <Input 
                                   type="tel"
                                   placeholder="99999 99999"
                                   maxLength={10}
                                   className="h-16 rounded-2xl border border-[#DFB15B]/20 bg-[#140603] pl-16 pr-6 text-white placeholder-white/35 focus:ring-1 focus:ring-[#DFB15B] outline-none w-full"
                                   value={formData.contactPhone}
                                   onChange={e => setFormData({...formData, contactPhone: e.target.value.replace(/\D/g, '')})}
                                />
                             </div>
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-[#FFFDFB]/70 uppercase tracking-widest block">Target Celebration Date</label>
                             <Input 
                                type="date"
                                className="h-16 rounded-2xl border border-[#DFB15B]/20 bg-[#140603] p-6 text-white placeholder-white/35 focus:ring-1 focus:ring-[#DFB15B] outline-none"
                                value={formData.eventDate}
                                onChange={e => setFormData({...formData, eventDate: e.target.value})}
                             />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-[#FFFDFB]/70 uppercase tracking-widest block">Inspiration & References</label>
                          <div className="border border-dashed border-[#DFB15B]/30 rounded-[32px] p-12 text-center space-y-4 bg-[#140603] hover:border-[#DFB15B]/60 transition-colors cursor-pointer">
                             <ImageIcon className="w-10 h-10 text-[#DFB15B]/40 mx-auto" strokeWidth={1} />
                             <p className="text-xs font-bold uppercase tracking-widest text-[#FFFDFB]/70 italic">Tap to upload reference drafts</p>
                          </div>
                       </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
           </CardContent>

           {/* Footer Actions */}
           <div className="p-8 md:p-12 pt-0 border-t border-white/10 flex items-center justify-between bg-transparent">
              <Button 
                variant="ghost" 
                onClick={prevStep}
                disabled={step === 0}
                className="h-16 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#FFFDFB] hover:text-[#DFB15B] hover:bg-[#DFB15B]/10 disabled:opacity-0 transition-all flex items-center gap-2 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="h-16 px-12 rounded-2xl bg-[#DFB15B] hover:bg-white text-[#140603] text-[10px] uppercase font-black tracking-widest shadow-xl flex items-center gap-4 transition-all active:scale-95 cursor-pointer"
              >
                {step === STEPS.length - 1 ? (loading ? 'Deploying...' : 'Deploy Inquiry') : 'Next Configuration'}
                {step < STEPS.length - 1 && <ChevronRight className="w-4 h-4" />}
                {step === STEPS.length - 1 && !loading && <Send className="w-4 h-4" />}
              </Button>
           </div>
        </Card>

        {/* Small Tip */}
        <div className="flex items-center justify-center gap-4 text-[#FFFDFB]/60 italic font-medium">
           <MapPin className="w-4 h-4 text-[#DFB15B]" />
           <span className="text-xs">Exclusively serving the elite sectors of Faridabad since 2024.</span>
        </div>
      </div>
    </motion.div>
  );
}
