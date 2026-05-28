import React, { useState } from 'react';
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
    eventDate: ''
  });
  const [loading, setLoading] = useState(false);

  const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (step < STEPS.length - 1) {
      nextStep();
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
      className="container mx-auto px-4 md:px-10 py-12 md:py-24 min-h-screen bg-[#fffdfc]"
    >
      <SEO 
        title="Custom Cake Builder & Designer Studio - Cake Urban"
        description="Design and build your dream cake step-by-step with Cake Urban's interactive Custom Cake Builder Studio. Choose flavors, sizes, icing textures, and reference photos."
        keywords="custom cake builder, design cake online, buy customized cakes faridabad, elite designer cakes local delivery"
      />
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
           <div className="inline-block bg-[#fdf2ef] text-[#c7857c] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
              Visionary Studio
            </div>
            <h1 className="text-[44px] md:text-[64px] font-display font-black text-[#3B1F17] tracking-tight leading-none mb-6">
              Cake <span className="italic font-serif font-light text-[#cc7a74]">Builder.</span>
            </h1>
            <p className="text-[#3B1F17]/50 text-sm md:text-lg font-medium italic max-w-lg mx-auto">
              Curate your masterpiece step-by-step. From architectural tiers to botanical palettes.
            </p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between items-center max-w-2xl mx-auto relative mb-16">
           <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#F8F4F1] -translate-y-1/2 z-0" />
           {STEPS.map((s, i) => (
             <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  i === step ? 'bg-[#3B1F17] text-white shadow-xl scale-110' : 
                  i < step ? 'bg-[#cc7a74] text-white' : 'bg-white border-2 border-[#F8F4F1] text-[#3B1F17]/20'
                }`}>
                   {i < step ? <Check className="w-6 h-6" /> : <s.icon className="w-5 h-5 md:w-6 md:h-6" />}
                </div>
                <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest hidden md:block ${
                  i === step ? 'text-[#3B1F17]' : 'text-[#3B1F17]/30'
                }`}>{s.label}</span>
             </div>
           ))}
        </div>

        {/* Builder Area */}
        <Card className="rounded-[48px] md:rounded-[60px] border border-[#F8F4F1] shadow-2xl bg-white overflow-hidden p-3 md:p-6 min-h-[500px] flex flex-col">
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
                       <h3 className="text-2xl md:text-3xl font-display font-black text-[#3B1F17] uppercase tracking-tight">Select Artisan <span className="italic font-serif font-light text-[#cc7a74]">Base</span></h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {FLAVORS.map(f => (
                            <div 
                              key={f.id}
                              onClick={() => setFormData({...formData, flavor: f.id})}
                              className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all ${
                                formData.flavor === f.id ? 'border-[#3B1F17] bg-[#F8F4F1]/30' : 'border-[#F8F4F1] hover:border-[#cc7a74]/30'
                              }`}
                            >
                               <div className="flex items-center gap-6">
                                  <span className="text-4xl">{f.icon}</span>
                                  <div className="flex flex-col">
                                     <span className="text-lg font-bold text-[#3B1F17]">{f.name}</span>
                                     <span className="text-xs text-[#3B1F17]/40 font-medium italic">{f.desc}</span>
                                  </div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  )}

                  {/* STEP 2: STRUCTURE */}
                  {step === 1 && (
                    <div className="space-y-12">
                       <div className="space-y-8">
                          <h3 className="text-2xl md:text-3xl font-display font-black text-[#3B1F17] uppercase tracking-tight">The <span className="italic font-serif font-light text-[#cc7a74]">Structure</span></h3>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-widest opacity-40">Layers / Tiers</label>
                             <div className="flex flex-wrap gap-4">
                                {TIERS.map(t => (
                                  <button
                                    key={t}
                                    onClick={() => setFormData({...formData, tiers: t})}
                                    className={`px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest border transition-all ${
                                      formData.tiers === t ? 'bg-[#3B1F17] text-white border-[#3B1F17]' : 'bg-white text-[#3B1F17] border-[#F8F4F1] hover:bg-[#F8F4F1]'
                                    }`}
                                  >
                                    {t}
                                  </button>
                                ))}
                             </div>
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-widest opacity-40">Geometry / Shape</label>
                             <div className="flex flex-wrap gap-4">
                                {SHAPES.map(s => (
                                  <button
                                    key={s}
                                    onClick={() => setFormData({...formData, shape: s})}
                                    className={`px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest border transition-all ${
                                      formData.shape === s ? 'bg-[#3B1F17] text-white border-[#3B1F17]' : 'bg-white text-[#3B1F17] border-[#F8F4F1] hover:bg-[#F8F4F1]'
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
                    <div className="space-y-10">
                       <h3 className="text-2xl md:text-3xl font-display font-black text-[#3B1F17] uppercase tracking-tight">Aesthetic <span className="italic font-serif font-light text-[#cc7a74]">Details</span></h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-widest opacity-40">Icing Palette</label>
                             <div className="flex items-center gap-4">
                                <input 
                                  type="color" 
                                  value={formData.icingColor}
                                  onChange={e => setFormData({...formData, icingColor: e.target.value})}
                                  className="w-16 h-16 rounded-2xl border-none p-1 cursor-pointer bg-white shadow-xl"
                                />
                                <span className="text-xs font-bold uppercase tracking-widest text-[#3B1F17]/60">Pick your primary hue</span>
                             </div>
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-widest opacity-40">Cake Inscription</label>
                             <Input 
                                placeholder="E.g. Let's Celebrate Julian"
                                className="h-16 rounded-2xl border-none bg-[#F8F4F1] shadow-inner p-6 font-medium"
                                value={formData.cakeMessage}
                                onChange={e => setFormData({...formData, cakeMessage: e.target.value})}
                             />
                          </div>
                       </div>
                    </div>
                  )}

                  {/* STEP 4: CONTACT & REFERENCE */}
                  {step === 3 && (
                    <div className="space-y-10">
                       <h3 className="text-2xl md:text-3xl font-display font-black text-[#3B1F17] uppercase tracking-tight">The <span className="italic font-serif font-light text-[#cc7a74]">Requisition</span></h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-widest opacity-40">Your Identity</label>
                             <Input 
                                placeholder="Full Name"
                                className="h-16 rounded-2xl border-none bg-[#F8F4F1] shadow-inner p-6 font-medium"
                                value={formData.contactName}
                                onChange={e => setFormData({...formData, contactName: e.target.value})}
                             />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-widest opacity-40">Target Date</label>
                             <Input 
                                type="date"
                                className="h-16 rounded-2xl border-none bg-[#F8F4F1] shadow-inner p-6 font-medium"
                                value={formData.eventDate}
                                onChange={e => setFormData({...formData, eventDate: e.target.value})}
                             />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-widest opacity-40">Inspiration & References</label>
                          <div className="border-2 border-dashed border-[#F8F4F1] rounded-[32px] p-12 text-center space-y-4 hover:border-[#cc7a74]/30 transition-colors bg-[#fffdfc] cursor-pointer">
                             <ImageIcon className="w-10 h-10 text-[#cc7a74]/30 mx-auto" strokeWidth={1} />
                             <p className="text-xs font-bold uppercase tracking-widest text-[#3B1F17]/40">Tap to upload reference drafts</p>
                          </div>
                       </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
           </CardContent>

           {/* Footer Actions */}
           <div className="p-8 md:p-12 pt-0 border-t border-[#F8F4F1] flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={prevStep}
                disabled={step === 0}
                className="h-16 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#3B1F17] disabled:opacity-0 transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="h-16 px-12 rounded-2xl bg-[#3B1F17] hover:bg-[#2A1610] text-white text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-4 transition-all active:scale-95"
              >
                {step === STEPS.length - 1 ? (loading ? 'Deploying...' : 'Deploy Inquiry') : 'Next Configuration'}
                {step < STEPS.length - 1 && <ChevronRight className="w-4 h-4" />}
                {step === STEPS.length - 1 && !loading && <Send className="w-4 h-4" />}
              </Button>
           </div>
        </Card>

        {/* Small Tip */}
        <div className="flex items-center justify-center gap-4 text-[#3B1F17]/40 italic">
           <MapPin className="w-4 h-4" />
           <span className="text-xs">Exclusively serving the elite sectors of Faridabad since 2024.</span>
        </div>
      </div>
    </motion.div>
  );
}
