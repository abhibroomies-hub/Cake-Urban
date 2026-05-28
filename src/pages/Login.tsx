import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import SEO from '../components/SEO';

type AuthMode = 'login' | 'register' | 'otp' | 'forgot';

export default function Login() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // OTP States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleGoogleLogin = async () => {
    if (loading) return;
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Upsert user profile
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName || 'Artisan Collector',
          role: 'customer',
          createdAt: new Date().toISOString()
        });
      }
      
      toast.success("Welcome back to Cake Urban!");
      navigate(redirect);
    } catch (error: any) {
      console.error(error);
      if (error?.code === 'auth/cancelled-popup-request' || error?.message?.includes('cancelled-popup-request')) {
        toast.error("Another sign-in request is already in progress or popups are blocked. Please retry.");
      } else if (error?.code === 'auth/popup-closed-by-user' || error?.message?.includes('popup-closed-by-user')) {
        toast.error("Sign-in popup was closed before completion. Please try again.");
      } else if (error?.code === 'auth/popup-blocked' || error?.message?.includes('popup-blocked')) {
        toast.error("Popup was blocked by your browser. Please allow popups for Cake Urban and try again!");
      } else {
        toast.error("Google Login failed. Please retry.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Signed in successfully!");
      navigate(redirect);
    } catch (error: any) {
      console.error(error);
      if (error?.code === 'auth/operation-not-allowed' || error?.message?.includes('operation-not-allowed')) {
        toast.error("Email/Password Sign-In is currently disabled. Please click 'Google Account' at the bottom to sign in instantly!", { duration: 8000 });
      } else {
        toast.error("Invalid credentials. Please verify your email and password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      toast.error("Please provide your full name.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create Firestore User profile
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: fullName,
        role: 'customer',
        createdAt: new Date().toISOString(),
        address: {
          line1: '',
          sector: '',
          pincode: ''
        }
      });

      toast.success("Registration successful! Welcome to the Atelier.");
      navigate(redirect);
    } catch (error: any) {
      console.error(error);
      if (error?.code === 'auth/operation-not-allowed' || error?.message?.includes('operation-not-allowed')) {
        toast.error("Email/Password registration is disabled in Firebase. Please use 'Google Account' at the bottom to register instantly!", { duration: 8000 });
      } else {
        toast.error(error?.message || "Registration failed. Check password length (min 6 characters) and email.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Simulating OTP Authentication Flow elegantly
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Generate a 6-digit random code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setOtpSent(true);
      setLoading(false);
      
      // Instruct testing user of verification code
      toast.success(`Artisan Security Key sent successfully! Use code: ${code}`, {
        duration: 10000,
      });
    }, 1200);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== generatedOtp) {
      toast.error("Security Key does not match. Please verify standard code.");
      return;
    }
    setLoading(true);
    try {
      // Create a persistent profile or simulate Firebase Anonymous / Custom login with pre-authenticated credentials,
      // We can also fallback to mock-login to continue perfectly into checkout or use anonymous credentials.
      // Let's create user with Simulated credential or use a test account in Firebase for pristine offline experience
      // If we can login using anonymous or just navigate to redirect with a simulated auth status,
      // we can do a sign-in with standard test credentials or create an account for them.
      // Let's create an account with simulated standard phone credentials or log in with verified phone email:
      const phoneEmail = `${phoneNumber}@cakeurban.com`;
      const phonePass = `phone_${generatedOtp}`;

      try {
        await signInWithEmailAndPassword(auth, phoneEmail, phonePass);
      } catch {
        // Create if doesn't exist yet
        const res = await createUserWithEmailAndPassword(auth, phoneEmail, phonePass);
        await setDoc(doc(db, 'users', res.user.uid), {
          email: phoneEmail,
          displayName: `Collector +91 ${phoneNumber.slice(-4)}`,
          role: 'customer',
          phoneNumber: phoneNumber,
          createdAt: new Date().toISOString()
        });
      }

      toast.success(`OTP verified! Logged in as +91*****${phoneNumber.slice(-4)}`);
      navigate(redirect);
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/operation-not-allowed' || err?.message?.includes('operation-not-allowed')) {
        toast.error("SMS Mock verification is disabled since Email/Password is disabled in Firebase. Please use 'Google Account' at the bottom!", { duration: 8000 });
      } else {
        toast.error("Verification failed. Standard SMS Authentication issue.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Security Reset Phrase sent to your email!");
      setMode('login');
    } catch (error) {
      console.error(error);
      toast.error("Email not found. Please review standard entries.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 md:px-10 py-12 md:py-32 flex items-center justify-center relative overflow-hidden bg-[#F8F4F1] min-h-screen">
      <SEO 
        title={mode === 'register' ? "Join the Atelier" : "Boutique Entrance"} 
        description="Access your luxury Cake Urban workspace. Log in using email, secure Google authentication, or instant Mobile SMS OTP."
      />
      
      <div className="absolute top-20 right-20 w-96 h-96 bg-[#D89C95] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#3B1F17] opacity-[0.02] rounded-full blur-[80px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] space-y-8 md:space-y-10 p-8 md:p-14 bg-white border border-[#E8DDD7] rounded-[48px] md:rounded-[60px] shadow-2xl relative z-10"
      >
        <div className="text-center space-y-3">
          <div className="text-2xl md:text-3xl font-display font-black tracking-tight text-[#3B1F17] mb-2 md:mb-6">
            Cake<span className="text-[#D89C95]">Urban</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-light text-[#3B1F17] tracking-tighter italic leading-tight">
            {mode === 'login' && 'Boutique Entrance'}
            {mode === 'register' && 'Exclusive Registration'}
            {mode === 'otp' && 'Instant Vault Entry'}
            {mode === 'forgot' && 'Reset Security Code'}
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D89C95] opacity-40">
            {mode === 'login' && 'Enter the world of artisanal cakes'}
            {mode === 'register' && 'Become an insider of luxury curation'}
            {mode === 'otp' && 'Fast access via mobile OTP secure channel'}
            {mode === 'forgot' && 'Recover exclusive collector key code'}
          </p>
        </div>

        {/* Tab Selection */}
        {mode !== 'forgot' && (
          <div className="flex bg-[#F8F4F1] p-1.5 rounded-[20px] border border-[#E8DDD7]/50">
            <button 
              onClick={() => { setMode('login'); setOtpSent(false); }}
              className={`flex-1 py-3 text-[9px] font-black uppercase tracking-[0.2em] rounded-[14px] transition-all ${mode === 'login' ? 'bg-white text-[#3B1F17] shadow-sm' : 'text-[#3B1F17]/40 hover:text-[#3B1F17]/70'}`}
            >
              Email Login
            </button>
            <button 
              onClick={() => { setMode('otp'); setOtpSent(false); }}
              className={`flex-1 py-3 text-[9px] font-black uppercase tracking-[0.2em] rounded-[14px] transition-all ${mode === 'otp' ? 'bg-white text-[#3B1F17] shadow-sm' : 'text-[#3B1F17]/40 hover:text-[#3B1F17]/70'}`}
            >
              Vault OTP
            </button>
            <button 
              onClick={() => { setMode('register'); setOtpSent(false); }}
              className={`flex-1 py-3 text-[9px] font-black uppercase tracking-[0.2em] rounded-[14px] transition-all ${mode === 'register' ? 'bg-white text-[#3B1F17] shadow-sm' : 'text-[#3B1F17]/40 hover:text-[#3B1F17]/70'}`}
            >
              Register
            </button>
          </div>
        )}

        {/* Auth Forms */}
        <AnimatePresence mode="wait">
          {mode === 'login' && (
            <motion.form 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleEmailLogin} 
              className="space-y-6"
            >
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.4em] opacity-40 pl-1 italic">Email Dossier</label>
                <Input 
                    type="email" 
                    placeholder="Ex. curator@cakeurban.com" 
                    className="h-16 rounded-2xl border-none bg-[#F8F4F1] p-6 font-medium focus-visible:ring-1 focus-visible:ring-[#D89C95] text-sm" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center pr-1">
                  <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.4em] opacity-40 pl-1 italic">Security Phrase</label>
                  <button type="button" onClick={() => setMode('forgot')} className="text-[9px] font-black text-[#D89C95] uppercase tracking-wider hover:underline">Forgot?</button>
                </div>
                <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-16 rounded-2xl border-none bg-[#F8F4F1] p-6 font-medium focus-visible:ring-1 focus-visible:ring-[#D89C95] text-sm" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
              </div>
              <Button type="submit" className="w-full h-16 rounded-2xl bg-[#3B1F17] hover:bg-[#2A1610] text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-xl mt-4 leading-none" disabled={loading}>
                {loading ? 'Validating credentials...' : 'Unlock Entry'}
              </Button>
            </motion.form>
          )}

          {mode === 'register' && (
            <motion.form 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleEmailRegister} 
              className="space-y-6"
            >
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.4em] opacity-40 pl-1 italic">Full Name</label>
                <Input 
                    type="text" 
                    placeholder="Ex. Abhi Sharma" 
                    className="h-16 rounded-2xl border-none bg-[#F8F4F1] p-6 font-medium focus-visible:ring-1 focus-visible:ring-[#D89C95] text-sm" 
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.4em] opacity-40 pl-1 italic">Email Address</label>
                <Input 
                    type="email" 
                    placeholder="Ex. collector@gmail.com" 
                    className="h-16 rounded-2xl border-none bg-[#F8F4F1] p-6 font-medium focus-visible:ring-1 focus-visible:ring-[#D89C95] text-sm" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.4em] opacity-40 pl-1 italic">Choose Account Password</label>
                <Input 
                    type="password" 
                    placeholder="Min 6 characters" 
                    className="h-16 rounded-2xl border-none bg-[#F8F4F1] p-6 font-medium focus-visible:ring-1 focus-visible:ring-[#D89C95] text-sm" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
              </div>
              <Button type="submit" className="w-full h-16 rounded-2xl bg-[#3B1F17] hover:bg-[#2A1610] text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-xl mt-4 leading-none" disabled={loading}>
                {loading ? 'Creating space...' : 'Create Collector Profile'}
              </Button>
            </motion.form>
          )}

          {mode === 'otp' && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              {!otpSent ? (
                <form onSubmit={handleRequestOtp} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.4em] opacity-40 pl-1 italic">Mobile Phone Route</label>
                    <div className="relative">
                      <span className="absolute left-6 top-5 font-bold text-sm text-[#3B1F17]/40">+91</span>
                      <Input 
                          type="tel" 
                          placeholder="99999 99999" 
                          maxLength={10}
                          className="h-16 rounded-2xl border-none bg-[#F8F4F1] pl-16 pr-6 font-medium focus-visible:ring-1 focus-visible:ring-[#D89C95] text-sm tracking-widest" 
                          value={phoneNumber}
                          onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                          required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-16 rounded-2xl bg-[#3B1F17] hover:bg-[#2A1610] text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-xl mt-4 leading-none" disabled={loading}>
                    {loading ? 'transmitting...' : 'Request Vault OTP'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.4em] opacity-40 pl-1 italic">6-Digit Security Vault Key</label>
                    <Input 
                        type="text" 
                        maxLength={6}
                        placeholder="Ex. 123456" 
                        className="h-16 rounded-2xl border-none bg-[#F8F4F1] p-6 text-center font-black tracking-[0.5em] text-lg focus-visible:ring-1 focus-visible:ring-[#D89C95]" 
                        value={otpCode}
                        onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        required
                    />
                    <p className="text-[9px] text-center text-[#D89C95] italic uppercase tracking-wider mt-2">Check the top toast message alert for your security key</p>
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setOtpSent(false)} className="flex-1 h-16 rounded-2xl border-[#E8DDD7] text-[10px] font-black uppercase tracking-widest">Back</Button>
                    <Button type="submit" className="flex-[2] h-16 rounded-2xl bg-[#3B1F17] hover:bg-[#2A1610] text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-xl leading-none" disabled={loading}>
                      {loading ? 'Unlocking...' : 'Verify Vault Key'}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          )}

          {mode === 'forgot' && (
            <motion.form 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleForgotPassword} 
              className="space-y-6"
            >
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#3B1F17] uppercase tracking-[0.4em] opacity-40 pl-1 italic">Enter Account Email</label>
                <Input 
                    type="email" 
                    placeholder="Ex. registered@cakeurban.com" 
                    className="h-16 rounded-2xl border-none bg-[#F8F4F1] p-6 font-medium focus-visible:ring-1 focus-visible:ring-[#D89C95] text-sm" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setMode('login')} className="flex-1 h-16 rounded-2xl border-[#E8DDD7] text-[10px] font-black uppercase tracking-widest">Cancel</Button>
                <Button type="submit" className="flex-[2] h-16 rounded-2xl bg-[#3B1F17] hover:bg-[#2A1610] text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-xl leading-none" disabled={loading}>
                  {loading ? 'Sending code...' : 'Transmit Link'}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="relative py-4 md:py-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E8DDD7]"></div></div>
          <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em] italic"><span className="bg-white px-6 text-[#3B1F17]/30">Or Continue As</span></div>
        </div>

        {/* Global Google Login Option */}
        <Button 
            variant="outline" 
            className="w-full h-16 rounded-2xl border-[#E8DDD7] gap-4 font-black text-[10px] uppercase tracking-[0.4em] text-[#3B1F17] hover:bg-[#F8F4F1] transition-all leading-none"
            onClick={handleGoogleLogin}
            disabled={loading}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 grayscale opacity-40" alt="Google" />
          Google Account
        </Button>

        <div className="flex justify-center gap-4 pt-2">
           <div className="w-1.5 h-1.5 rounded-full bg-[#D89C95]"></div>
           <div className="w-1.5 h-1.5 rounded-full bg-[#3B1F17]"></div>
           <div className="w-1.5 h-1.5 rounded-full bg-[#E8DDD7]"></div>
        </div>
      </motion.div>
    </div>
  );
}
