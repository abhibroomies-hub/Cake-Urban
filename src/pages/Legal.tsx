import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, FileText, Truck, RefreshCw, Sparkles, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';

type LegalTab = 'terms' | 'privacy' | 'shipping' | 'refunds';

export default function Legal() {
  const [activeTab, setActiveTab] = useState<LegalTab>('terms');

  const tabs: { id: LegalTab; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'refunds', label: 'Refunds & Returns', icon: RefreshCw },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-6 py-20 md:py-32 bg-[#fffdfc]"
    >
      <SEO 
        title="Terms, Privacy Policy & Delivery Guidelines - Cake Urban"
        description="Review Cake Urban's Terms of Service, Privacy policies, same-day refrigerated local shipping rules, and refund guidelines for Faridabad & Delhi NCR."
        keywords="terms conditions cake urban, privacy policy bakery, cake cancellation policy, same day cake shipping faridabad"
      />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Editorial Title */}
        <div className="text-center space-y-4">
          <span className="text-[10px] uppercase font-black tracking-[0.35em] text-[#DE9088] block">Boutique Regulations</span>
          <h1 className="text-5xl md:text-7xl font-display font-black text-[#3B1F17] tracking-tight">
            Legal & <span className="italic font-serif font-light text-[#DE9088]">Policy Hub</span>
          </h1>
          <p className="text-[#3B1F17]/50 max-w-lg mx-auto text-sm font-medium italic">
            Transparent compliance documents built to ensure elite safety, reliable delivery, and full transactional clarity across Delhi NCR.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex flex-wrap items-center justify-center gap-3 bg-[#FAF7F5] p-2 rounded-[28px] border border-[#E8DDD7] max-w-3xl mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                  isActive 
                    ? 'bg-[#3B1F17] text-white shadow-xl' 
                    : 'text-[#3B1F17]/60 hover:text-[#3B1F17] hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#DE9088]' : 'text-[#3B1F17]/40'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Legal Details */}
        <div className="bg-white border border-[#E8DDD7] rounded-[48px] p-8 md:p-16 shadow-sm text-left max-w-4xl mx-auto">
          {activeTab === 'terms' && (
            <div className="space-y-6 text-[#3B1F17]/80 leading-relaxed font-sans text-sm">
              <h2 className="text-2xl font-serif font-bold text-[#3B1F17] flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#DE9088]" /> Terms & Conditions
              </h2>
              <p className="text-xs text-gray-400 font-mono italic">Last updated: May 28, 2026</p>
              
              <div className="space-y-4">
                <p>Welcome to <strong>Cake Urban</strong> (www.cakeurban.com). By visiting our website or ordering regular, designer, or customizable cakes, you agree to comply with and be bound by the following Terms and Conditions.</p>
                
                <h3 className="text-base font-bold text-[#3B1F17] mt-6">1. Product Integrity & Visual Descriptions</h3>
                <p>Our regular and custom cakes are handcrafted by chef curators. Since designs are made-to-order, minor variations in colors, shading, decorations, or placement of edible elements may occur relative to catalog photos or AI SEO previews. Such slight aesthetic variations do not constitute a culinary defect.</p>
                
                <h3 className="text-base font-bold text-[#3B1F17] mt-6">2. Order Placement & Confirmations</h3>
                <p>Orders are validated upon full online gateway processing or verified manual approval block. For heavy customized structures requiring dedicated stands, multi-layered support, or non-edible accents, we will contact you on WhatsApp using the phone number verified on check-out.</p>

                <h3 className="text-base font-bold text-[#3B1F17] mt-6">3. Customer-Provided Visual Uploads</h3>
                <p>When you upload references to our Custom Studio, you confirm that you hold reproduction rights or license permits. We reserve the authority to reject orders with materials containing defamatory or abusive elements.</p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6 text-[#3B1F17]/80 leading-relaxed font-sans text-sm">
              <h2 className="text-2xl font-serif font-bold text-[#3B1F17] flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#DE9088]" /> Privacy Policy
              </h2>
              <p className="text-xs text-gray-400 font-mono italic">Last updated: May 28, 2026</p>

              <div className="space-y-4">
                <p>At Cake Urban, safeguarding your digital privacy is our sacred trust. This section clarifies how we capture, manage, and process data for order fulfillment.</p>

                <h3 className="text-base font-bold text-[#3B1F17] mt-6">1. Personal Information Gathered</h3>
                <p>We store details essential to dispatch custom baked goodies, specifically: Name, delivery address, phone coordinates, verified email address, and order customization preferences. Sensitive financial metrics (including PINs) are processed strictly via PCI-DSS certified Razoypay gateways and do not touch our permanent databases.</p>

                <h3 className="text-base font-bold text-[#3B1F17] mt-6">2. Utilization of Data</h3>
                <p>Telemetry, caching, and local profiles are monitored solely to deliver lightning-fast page transitions, personalized recommended products, state persistence in carts, and real-time support on dispatch updates.</p>

                <h3 className="text-base font-bold text-[#3B1F17] mt-6">3. Cookies</h3>
                <p>We implement micro-cookie caches to remember favorite flavors and custom canvas formulations. You may configure browser flags to block cookies, though this may pause checkout features.</p>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-6 text-[#3B1F17]/80 leading-relaxed font-sans text-sm">
              <h2 className="text-2xl font-serif font-bold text-[#3B1F17] flex items-center gap-2">
                <Truck className="w-6 h-6 text-[#DE9088]" /> Shipping & Delivery Policy
              </h2>
              <p className="text-xs text-gray-400 font-mono italic">Last updated: May 28, 2026</p>

              <div className="space-y-4">
                <p>Cakes are highly delicate structures. We operate dedicated temperature-regulated, shock-absorbing delivery vehicles across Faridabad, South Delhi, Noida, Gurgaon, and Ghaziabad to guarantee absolute freshness.</p>

                <h3 className="text-base font-bold text-[#3B1F17] mt-6">1. Logistics Reach & Geo Timings</h3>
                <p>Delivery slots range from 09:00 AM to 11:59 PM. Same-day regular preparations usually ship within 2 to 4 hours of order authorization. Custom 3D designer cakes must be commissioned at least 24 hours prior to logistics release.</p>

                <h3 className="text-base font-bold text-[#3B1F17] mt-6">2. Drop-off Protocols</h3>
                <p>Due to the perishable nature of gourmet frostings and fresh whipped creams, our riders require active phone response to confirm physical drop-off. In cases of locked premises or unreachable call-outs, the cake is routed back to our local hub to maintain temperature integrity.</p>

                <h3 className="text-base font-bold text-[#3B1F17] mt-6">3. Delivery Surcharges</h3>
                <p>Transport costs are automatically computed on checkout based on coordinates. High-tier orders and selected premium areas qualify for free logistics care!</p>
              </div>
            </div>
          )}

          {activeTab === 'refunds' && (
            <div className="space-y-6 text-[#3B1F17]/80 leading-relaxed font-sans text-sm">
              <h2 className="text-2xl font-serif font-bold text-[#3B1F17] flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-[#DE9088]" /> Refunds, Cancellations & Returns
              </h2>
              <p className="text-xs text-gray-400 font-mono italic">Last updated: May 28, 2026</p>

              <div className="space-y-4">
                <p>Our priority is providing flawless confectionery creations. As baked items are freshly prepared food substances, standard return practices do not apply.</p>

                <h3 className="text-base font-bold text-[#3B1F17] mt-6">1. Cancellations</h3>
                <p>Orders can be cancelled with complete 100% wallet or gateway reimbursement if done at least 12 hours prior to the requested delivery window. Once the custom icing has been whipped, or structural layers have been stacked by the pastry chefs, we cannot entertain cancellation requests.</p>

                <h3 className="text-base font-bold text-[#3B1F17] mt-6">2. Damage During Dispatch</h3>
                <p>While we guarantee top-tier transit structures, in the rare event that your cake experiences structural deformation during delivery, please send a clear photo snapshot immediately to our support team at <strong>hello@cakeurban.com</strong> or our verified WhatsApp number within 1 hour of delivery. We will issue an express replacement or credit a 100% refund immediately.</p>

                <h3 className="text-base font-bold text-[#3B1F17] mt-6">3. Reimbursement Windows</h3>
                <p>Authorized refunds are issued instantly and are normally processed back to the original source payment method in 3 to 5 banking business days.</p>
              </div>
            </div>
          )}
        </div>

        {/* Compliance Footer Trust Shield */}
        <div className="max-w-2xl mx-auto bg-[#FAF7F5] border border-[#E8DDD7] rounded-[36px] p-6 text-center space-y-3">
          <p className="text-xs text-[#3B1F17]/60 font-medium italic">
            "Your delightful absolute satisfaction, seamless fast transaction safety, and supreme hygiene compliance are the foundational core values of the Cake Urban atelier team."
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#DE9088]">
            <CheckCircle className="w-4 h-4" /> FSSAI Certified Operations · 100% Clean Gateways
          </div>
        </div>

      </div>
    </motion.div>
  );
}
