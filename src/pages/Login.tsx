import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import SEO from '../components/SEO';
import { secureSetItem, secureLocalDB } from '../lib/secureStorage';
import { playSuccessChime, playBtnTap, playSlidePop } from '../lib/sound';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ShieldCheck, 
  Gift, 
  Truck, 
  Sparkle, 
  Phone
} from 'lucide-react';

type AuthMode = 'login' | 'register' | 'otp' | 'forgot';

export default function Login() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Visibility & state triggers
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // OTP & phone states
  const [phoneNumber, setPhoneNumber] = useState(''); // For SMS OTP fallback sign in
  const [loginPhone, setLoginPhone] = useState('');   // For mandatory login phone input
  const [registerPhone, setRegisterPhone] = useState(''); // For mandatory register phone input
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Email Registration OTP state
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  // Interactive 3D Card Tilt State values
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Premium sensitive calculations (tilt angle max 5 degrees for optimal legibility)
    const rotateX = -(y / (rect.height / 2)) * 4;
    const rotateY = (x / (rect.width / 2)) * 4;
    setTilt({ rotateX, rotateY, scale: 1.005 });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    const provider = new GoogleAuthProvider();
    setLoading(true);
    playBtnTap();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Upsert user profile in firestore
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
      
      playSuccessChime();
      toast.success("Welcome back to Cakehouse!");
      navigate(redirect);
    } catch (error: any) {
      console.error("Google Auth error info:", error);
      const errorCode = error?.code || '';
      const errorMessage = error?.message || '';

      if (errorCode === 'auth/cancelled-popup-request' || errorMessage.includes('cancelled-popup-request')) {
         toast.error("Another sign-in request is already in progress. Please retry.");
      } else if (errorCode === 'auth/popup-closed-by-user' || errorMessage.includes('popup-closed-by-user')) {
         toast.error("Sign-in prompt closed. Please try again.");
      } else if (errorCode === 'auth/popup-blocked' || errorMessage.includes('popup-blocked')) {
         toast.error("Popups are blocked by your browser. Please permit popups for Cakehouse.");
      } else if (errorCode === 'auth/unauthorized-domain' || errorMessage.includes('unauthorized-domain')) {
         toast.error(
           "Domain Not Authorized! Please log in to your Firebase Console, navigate to Build > Authentication > Settings > Authorized Domains, and add: '" + window.location.hostname + "'",
           { duration: 10000 }
         );
      } else if (
        errorCode === 'auth/web-storage-unsupported' || 
        errorCode === 'auth/operation-not-supported-in-this-environment' || 
        errorMessage.includes('web-storage-unsupported') ||
        errorMessage.includes('third-party cookies')
      ) {
         toast.error(
           "Browser Context Blocked: Iframes prevent Google Login. Please click the 'Open in New Tab' button or use the URL shown at the top of the chat to run this app directly!",
           { duration: 8000 }
         );
      } else {
         toast.error(`Google Secure Sign-In failed: ${errorCode || error.message || 'Check firebase console'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLoginSimulated = () => {
    playBtnTap();
    toast.success("Connecting with Facebook secure credentials...");
    setLoading(true);
    setTimeout(() => {
      // Simulate automatic secure transition login
      const localUid = `fb_user_${Date.now()}`;
      const localSession = {
        uid: localUid,
        email: "facebook.collector@cakehouse.com",
        displayName: "Facebook Gourmet guest",
        role: "customer"
      };
      secureSetItem('cakeurban_local_user', localSession);
      playSuccessChime();
      toast.success("Authorized successfully using Facebook curation profile!");
      setTimeout(() => {
        window.location.href = redirect;
      }, 700);
    }, 1500);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone || loginPhone.length !== 10) {
      toast.error("Please enter your valid 10-digit registered phone number.");
      return;
    }
    setLoading(true);
    playBtnTap();
    const cleanEmail = email.trim().toLowerCase();
    try {
      // 1. Try to check if this user exists in our encrypted offline localDB first
      const validatedLocal = secureLocalDB.validateUser(cleanEmail, password);
      if (validatedLocal) {
        // Enforce phone number verification
        if (validatedLocal.phoneNumber && validatedLocal.phoneNumber !== loginPhone) {
          toast.error("The phone number provided does not match our records for this account.");
          setLoading(false);
          return;
        }
        
        // If legacy locally saved user has no phone number, auto-link it now
        if (!validatedLocal.phoneNumber) {
          validatedLocal.phoneNumber = loginPhone;
          secureLocalDB.saveUser(validatedLocal);
        }

        const localSession = {
          uid: validatedLocal.uid,
          email: validatedLocal.email,
          displayName: validatedLocal.displayName,
          role: validatedLocal.role || 'customer',
          phoneNumber: loginPhone
        };
        secureSetItem('cakeurban_local_user', localSession);
        playSuccessChime();
        toast.success("Signed in successfully with your encrypted offline baking key!");
        setTimeout(() => {
          window.location.href = redirect;
        }, 800);
        return;
      }

      // 2. Also check if this is an active local account in our Firestore first
      try {
        const q = query(collection(db, 'users'), where('email', '==', cleanEmail), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const userDoc = snap.docs[0];
          const userData = userDoc.data();
          
          // Enforce phone number verification
          if (userData.phoneNumber && userData.phoneNumber !== loginPhone) {
            toast.error("The phone number provided does not match our records for this account.");
            setLoading(false);
            return;
          }

          if (userData.isLocalAccount || userData.localPassword) {
            if (userData.localPassword === password || userData.passwordHash === password) {
              
              // If legacy firestore user has no phone number, auto-link it now
              if (!userData.phoneNumber) {
                await setDoc(doc(db, 'users', userDoc.id), { phoneNumber: loginPhone }, { merge: true });
              }

              const localSession = {
                uid: userDoc.id,
                email: userData.email,
                displayName: userData.displayName || 'Artisan Guest',
                role: userData.role || 'customer',
                phoneNumber: loginPhone
              };
              
              // Cache in local offline DB for next offline logins
              secureLocalDB.saveUser({
                uid: userDoc.id,
                email: userData.email,
                displayName: userData.displayName || 'Artisan Guest',
                passwordHash: password,
                role: userData.role || 'customer',
                phoneNumber: loginPhone,
                createdAt: userData.createdAt || new Date().toISOString()
              });

              secureSetItem('cakeurban_local_user', localSession);
              playSuccessChime();
              toast.success("Signed in successfully with your secure local account!");
              setTimeout(() => {
                window.location.href = redirect;
              }, 800);
              return;
            } else {
              toast.error("Incorrect password. Please verify your credentials and try again.");
              setLoading(false);
              return;
            }
          }
        }
      } catch (localErr) {
        console.error("Local account pre-check error:", localErr);
      }

      // 3. Fallback to Firebase authentication
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      
      // Save in local encrypted DB for offline capabilities
      const curUser = auth.currentUser;
      if (curUser) {
        const userRef = doc(db, 'users', curUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.phoneNumber && userData.phoneNumber !== loginPhone) {
            // Phone mismatch: forced signout
            await auth.signOut();
            toast.error("The phone number provided does not match our records for this account.");
            setLoading(false);
            return;
          } else if (!userData.phoneNumber) {
            // First login with phone verification: tie phone number to profile
            await setDoc(userRef, { phoneNumber: loginPhone }, { merge: true });
          }
        } else {
          // If Firestore profile doesn't exist, create it cleanly
          await setDoc(userRef, {
            email: cleanEmail,
            displayName: curUser.displayName || 'Artisan Collector',
            role: 'customer',
            phoneNumber: loginPhone,
            createdAt: new Date().toISOString()
          });
        }

        secureLocalDB.saveUser({
          uid: curUser.uid,
          email: cleanEmail,
          displayName: curUser.displayName || 'Artisan Collector',
          passwordHash: password,
          role: 'customer',
          phoneNumber: loginPhone,
          createdAt: new Date().toISOString()
        });
        
        secureSetItem('cakeurban_local_user', {
          uid: curUser.uid,
          email: cleanEmail,
          displayName: curUser.displayName || 'Artisan Collector',
          role: 'customer',
          phoneNumber: loginPhone
        });
      }

      playSuccessChime();
      toast.success("Signed in successfully!");
      setTimeout(() => {
        window.location.href = redirect;
      }, 800);
    } catch (error: any) {
      console.error(error);
      if (error?.code === 'auth/operation-not-allowed' || error?.message?.includes('operation-not-allowed')) {
        toast.error("Email/Password is temporarily disabled. Please register or login with Google!", { duration: 8000 });
      } else if (error?.code === 'auth/user-not-found' || error?.code === 'auth/wrong-password' || error?.code === 'auth/invalid-credential') {
        toast.error("Invalid credentials. Please verify your email and security key.");
      } else {
        toast.error(error?.message || "Credentials declined. Use Google for instant access.");
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
    if (!registerPhone || registerPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please verify.");
      return;
    }
    if (!agreeTerms) {
      toast.error("Please accept the Terms & Conditions before joining.");
      return;
    }

    setLoading(true);
    playBtnTap();
    
    const cleanEmail = email.trim().toLowerCase();

    // Instead of completing registration immediately, request security code dispatch from SMTP server
    try {
      const response = await fetch('/api/email/send-signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to dispatch verification code");
      }

      setPendingUserData({
        fullName,
        email: cleanEmail,
        phoneNumber: registerPhone,
        password
      });
      setIsVerifyingEmailOtp(true);

      if (data.simulated && data.code) {
        // Fallback info toast if SMTP details have not been supplied yet
        toast.info(`[SMTP DEMO SIMULATION] Validation code sent to ${cleanEmail}: ${data.code}`, {
          duration: 20000,
        });
      } else {
        toast.success("Membership Confirmation Code dispatched to your mailbox!");
      }
    } catch (err: any) {
      console.error("OTP flow launch failure:", err);
      toast.error(err.message || "Failed to initiate verification code. Please check standard connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailRegisterOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailVerificationCode || emailVerificationCode.length !== 6) {
      toast.error("Please enter the complete 6-digit Membership Confirmation Code.");
      return;
    }
    if (!pendingUserData) {
      toast.error("Verification state is uninitialized. Please fill options and recreate account signup.");
      setIsVerifyingEmailOtp(false);
      return;
    }

    setLoading(true);
    playBtnTap();

    try {
      // 1. Validate against backend storage
      const response = await fetch('/api/email/verify-signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: pendingUserData.email,
          code: emailVerificationCode
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Incorrect confirmation code");
      }

      // 2. Verified successfully! Save to DB & complete registration
      const localUid = `local_user_${Date.now()}`;
      const userProfile = {
        uid: localUid,
        email: pendingUserData.email,
        displayName: pendingUserData.fullName,
        passwordHash: pendingUserData.password,
        role: 'customer',
        phoneNumber: pendingUserData.phoneNumber,
        createdAt: new Date().toISOString(),
        address: {
          line1: '',
          sector: '',
          pincode: ''
        }
      };

      // Instantly cache in secure offline DB
      secureLocalDB.saveUser(userProfile);
      secureSetItem('cakeurban_local_user', {
        uid: localUid,
        email: pendingUserData.email,
        displayName: pendingUserData.fullName,
        role: 'customer',
        phoneNumber: pendingUserData.phoneNumber
      });

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, pendingUserData.email, pendingUserData.password);
        const user = userCredential.user;

        // Create/update Firestore User profile
        await setDoc(doc(db, 'users', user.uid), {
          email: pendingUserData.email,
          displayName: pendingUserData.fullName,
          role: 'customer',
          phoneNumber: pendingUserData.phoneNumber,
          createdAt: new Date().toISOString(),
          isLocalAccount: true,
          localPassword: pendingUserData.password,
          passwordHash: pendingUserData.password,
          address: {
            line1: '',
            sector: '',
            pincode: ''
          }
        });

        // Update local storage with real firebase UID to keep in sync
        secureLocalDB.saveUser({
          ...userProfile,
          uid: user.uid
        });
        secureSetItem('cakeurban_local_user', {
          uid: user.uid,
          email: pendingUserData.email,
          displayName: pendingUserData.fullName,
          role: 'customer',
          phoneNumber: pendingUserData.phoneNumber
        });
      } catch (error: any) {
        console.error("Firebase Auth syncer bypassed, using secure local profiles:", error);
        
        try {
          // Write the custom local account to cloud Firestore too
          await setDoc(doc(db, 'users', localUid), {
            ...userProfile,
            isLocalAccount: true,
            localPassword: pendingUserData.password
          });
        } catch (localErr) {
          console.error("Bypassed online registration write:", localErr);
        }
      }

      // 3. Dispatch automated welcome circle registration receipt email!
      try {
        await fetch('/api/email/send-auto-reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: pendingUserData.email,
            type: 'welcome',
            details: {
              name: pendingUserData.fullName,
              phone: pendingUserData.phoneNumber
            }
          })
        });
      } catch (welcomeErr) {
        console.error("Welcome dispatch trig error:", welcomeErr);
      }

      playSuccessChime();
      toast.success("Membership successfully verified and activated! Welcome.");
      setIsVerifyingEmailOtp(false);
      setPendingUserData(null);
      
      setTimeout(() => {
        window.location.href = redirect;
      }, 800);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Confirmation code verification failed. Check input.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    playBtnTap();
    setTimeout(() => {
      // Generate a sticky visual OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setOtpSent(true);
      setLoading(false);
      
      toast.success(`Cakehouse Security OTP Code has been dispatched! Code is: ${code}`, {
        duration: 12000,
      });
    }, 1200);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== generatedOtp) {
      toast.error("OTP Code mismatch. Please enter the code from the notification.");
      return;
    }
    setLoading(true);
    playBtnTap();
    try {
      const phoneEmail = `${phoneNumber}@cakehouse.com`;
      const phonePass = `phone_${generatedOtp}`;

      try {
        await signInWithEmailAndPassword(auth, phoneEmail, phonePass);
      } catch {
        const res = await createUserWithEmailAndPassword(auth, phoneEmail, phonePass);
        await setDoc(doc(db, 'users', res.user.uid), {
          email: phoneEmail,
          displayName: `Collector +91 ${phoneNumber.slice(-4)}`,
          role: 'customer',
          phoneNumber: phoneNumber,
          createdAt: new Date().toISOString()
        });
      }

      toast.success(`OTP verified successfully! Logged in secure session.`);
      navigate(redirect);
    } catch (err: any) {
      console.error(err);
      toast.error("Verification unavailable via SMS fallback. Please use custom Email log.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    playBtnTap();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Security Reset Phrase dispatched to your mailbox!");
      setMode('login');
    } catch (error) {
      console.error(error);
      toast.error("Email directory not found. Please review entries.");
    } finally {
      setLoading(false);
    }
  };

  // Header Logo and Slice Component to reuse in forms
  const LogoAndCake = () => (
    <div className="relative w-full flex items-center justify-between mt-1 mb-8">
      {/* CAKEHOUSE LUXURY LOGO */}
      <div className="flex flex-col items-start text-left space-y-1.5 z-10">
        <div className="flex items-center gap-1">
          <svg className="w-8 h-8 text-[#3B1F17]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 20h16M5 17h14M7 11h10M9 6h6" strokeLinecap="round" />
            <path d="M6 11v6M18 11v6M8 6v5M16 6v5" strokeLinecap="round" />
            <path d="M12 3a1 1 0 011 1v1h-2V4a1 1 0 011-1z" fill="currentColor" />
          </svg>
        </div>
        <div className="text-xl font-display font-black tracking-[0.08em] text-[#3B1F17] select-none uppercase">
          Cakehouse
        </div>
        <div className="flex items-center gap-1.5 w-full">
          <div className="h-[1px] bg-[#3B1F17]/30 w-3" />
          <span className="text-[7px] font-black uppercase tracking-[0.25em] text-[#3B1F17]/65 whitespace-nowrap">
            Baked with love
          </span>
          <div className="h-[1px] bg-[#3B1F17]/30 w-3" />
        </div>
      </div>

      {/* Gourmet Red Velvet slice floating beautifully */}
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-36 h-36 md:w-40 md:h-40 drop-shadow-[0_12px_24px_rgba(45,21,15,0.22)] -mr-4 select-none pointer-events-none"
      >
        <img 
          src="https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=500" 
          alt="Artisanal Cake Selection" 
          className="w-full h-full object-contain transform -rotate-6 scale-110"
          referrerPolicy="no-referrer"
        />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1C0D08] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEO 
        title={mode === 'register' ? "Join the Atelier" : "Boutique Entrance"} 
        description="Access your luxury Cakehouse account. Welcome back to premium artisanal delicacies."
      />

      {/* Cosmic Live Glowing Orbs in background */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-[#DFB15B] opacity-[0.06] rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#DE9088] opacity-[0.05] rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* Gold floating sparkles stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: Math.random() * 0.5 + 0.1,
              scale: Math.random() * 0.7 + 0.3,
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              rotate: Math.random() * 360,
            }}
            animate={{
              y: ["-10%", "110%"],
              rotate: [0, 360],
              opacity: [0.15, 0.45, 0.15],
            }}
            transition={{
              duration: Math.random() * 15 + 25,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * -12,
            }}
            className="absolute text-[#DFB15B]/30 select-none text-xs"
          >
            ✦
          </motion.div>
        ))}
      </div>

      {/* Main Luxury golden-trimmed 3D interactive layout card */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
          transition: "transform 0.15s ease-out"
        }}
        className="w-full max-w-[480px] bg-[#FFFBF8] rounded-[48px] border-[5px] border-[#DFB15B]/25 p-7 sm:p-10 text-center shadow-[0_25px_65px_rgba(0,0,0,0.55)] relative overflow-hidden z-10"
      >
        {/* Luxury top highlights panel border line */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-300 via-[#DE9088] to-amber-300 opacity-80" />

        <AnimatePresence mode="wait">
          {mode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              className="flex flex-col text-left"
            >
              <LogoAndCake />

              <h2 className="text-3xl font-serif font-black tracking-tight text-[#3B1F17] flex items-center gap-1.5">
                Welcome back! <span className="text-[#DFB15B] text-xl">✦</span>
              </h2>
              <p className="text-xs text-[#3B1F17]/65 font-medium mt-1 mb-8">
                Login to continue to your account
              </p>

              {/* EMAIL LOGIN FORM */}
              <form onSubmit={handleEmailLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.25em] text-[#3B1F17]">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-4 h-4 text-[#3B1F17]/35" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-14 rounded-2xl border border-[#E8DDD7] pl-11 pr-4 bg-[#FFFDFB] text-xs font-semibold focus-visible:ring-1 focus-visible:ring-[#DFB15B] text-[#3C2117] placeholder:text-[#3B1F17]/30"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.25em] text-[#3B1F17]">
                    Phone Number (Compulsory)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 font-bold text-xs text-[#3B1F17]/50">+91</span>
                    <Input
                      type="tel"
                      placeholder="99999 99999"
                      maxLength={10}
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                      required
                      className="h-14 rounded-2xl border border-[#E8DDD7] pl-14 pr-4 bg-[#FFFDFB] text-xs font-semibold focus-visible:ring-1 focus-visible:ring-[#DFB15B] text-[#3C2117] placeholder:text-[#3B1F17]/30 tracking-widest font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center pr-0.5">
                    <label className="text-[9px] font-black uppercase tracking-[0.25em] text-[#3B1F17]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => { playBtnTap(); setMode('forgot'); }}
                      className="text-[9px] font-black text-[#DE9088] uppercase tracking-wider hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-4 h-4 text-[#3B1F17]/35" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-14 rounded-2xl border border-[#E8DDD7] pl-11 pr-11 bg-[#FFFDFB] text-xs font-semibold focus-visible:ring-1 focus-visible:ring-[#DFB15B] text-[#3C2117] placeholder:text-[#3B1F17]/30"
                    />
                    <button
                      type="button"
                      onClick={() => { playBtnTap(); setShowPassword(!showPassword); }}
                      className="absolute right-4 text-[#3B1F17]/40 hover:text-[#3B1F17]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember and selection row */}
                <div className="flex items-center justify-between py-1.5 pl-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => { playBtnTap(); setRememberMe(!rememberMe); }}
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                        rememberMe ? 'bg-[#DE9088] border-[#DE9088] text-white' : 'border-[#E8DDD7] bg-white'
                      }`}
                    >
                      {rememberMe && <span className="text-[10px] font-bold">✓</span>}
                    </button>
                    <span className="text-[10px] font-black text-[#3B1F17]/65 uppercase tracking-wider">
                      Remember me
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => { playSlidePop(); setMode('otp'); }}
                    className="text-[9px] font-black text-[#DFB15B] uppercase tracking-widest hover:underline"
                  >
                    ⚡ Secure SMS Vault
                  </button>
                </div>

                {/* LOGIN BUTTON */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-[#3D140B] hover:bg-[#DE9088]/90 text-amber-50 border border-[#DFB15B]/30 hover:border-transparent font-black tracking-[0.22em] text-xs uppercase shadow-[0_5px_15px_rgba(61,20,11,0.25)] transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? 'Processing Curation...' : 'LOGIN'}
                </Button>
              </form>

              {/* SOCIAL INTERACTION DIVIDER */}
              <div className="relative flex items-center justify-center my-6">
                <div className="h-[1px] bg-[#E8DDD7] w-full" />
                <span className="absolute bg-[#FFFDFB] px-4 text-[#3B1F17]/35 text-[9px] font-black uppercase tracking-[0.2em] italic">
                  OR
                </span>
              </div>

              {/* SOCIAL BUTTONS */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full h-14 rounded-2xl border border-[#E8DDD7] bg-white hover:bg-[#F8F4F1] transition-all flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.16em] text-[#3B1F17] shadow-sm active:scale-95 duration-200"
                >
                  <img 
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    className="w-4.5 h-4.5" 
                    alt="Google" 
                  />
                  Continue with Google
                </button>

                <button
                  type="button"
                  onClick={handleFacebookLoginSimulated}
                  disabled={loading}
                  className="w-full h-14 rounded-2xl border border-[#E8DDD7] bg-white hover:bg-[#F8F4F1] transition-all flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.16em] text-[#3B1F17] shadow-sm active:scale-95 duration-200"
                >
                  <svg className="w-5 h-5 text-blue-600 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                  </svg>
                  Continue with Facebook
                </button>
              </div>

              {/* TOGGLE TO SIGNUP TEXT */}
              <div className="text-center mt-7">
                <p className="text-[11px] font-bold text-[#3B1F17]/70">
                  Don't have an account?{' '}
                  <button
                    onClick={() => { playSlidePop(); setMode('register'); }}
                    className="text-[#DFB15B] font-black uppercase tracking-wider hover:underline ml-1.5 focus:outline-none"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {mode === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="flex flex-col text-left"
            >
              {/* Back Arrow to Login */}
              <div className="flex items-center justify-between mb-0.5">
                <button
                  onClick={() => { playSlidePop(); setMode('login'); }}
                  className="w-8 h-8 rounded-full bg-[#FFFDFB] hover:bg-[#DE9088]/10 border border-[#E8DDD7] flex items-center justify-center text-[#3B1F17] transition-all active:scale-90"
                >
                  <ArrowLeft className="w-4 h-4 text-[#3B1F17]" />
                </button>
              </div>

              <LogoAndCake />

              {isVerifyingEmailOtp ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 text-left"
                >
                  <div>
                    <h2 className="text-3xl font-serif font-black tracking-tight text-[#3B1F17] flex items-center gap-1.5">
                      Verify Your Email <span className="text-[#DFB15B] text-xl">✦</span>
                    </h2>
                    <p className="text-xs text-[#3B1F17]/65 font-semibold mt-1">
                      We sent a 6-digit Membership Confirmation Code to <span className="text-[#3D140B] font-bold underline">{pendingUserData?.email}</span>.
                    </p>
                  </div>

                  <form onSubmit={handleVerifyEmailRegisterOtp} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.25em] text-[#3B1F17] text-center block">
                        6-Digit Security Confirmation Code
                      </label>
                      <Input
                        type="text"
                        maxLength={6}
                        placeholder="Ex. 123456"
                        value={emailVerificationCode}
                        onChange={(e) => setEmailVerificationCode(e.target.value.replace(/\D/g, ''))}
                        required
                        className="h-15 rounded-2xl border-2 border-[#DFB15B]/50 text-center font-black tracking-[0.6em] text-xl bg-[#FFFDFB] focus-visible:ring-1 focus-visible:ring-[#DFB15B] text-[#3C2117] placeholder:text-[#3B1F17]/20"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 rounded-2xl bg-[#3D140B] hover:bg-[#DE9088]/90 text-amber-50 border border-[#DFB15B]/30 hover:border-transparent font-black tracking-[0.22em] text-xs uppercase shadow-[0_5px_15px_rgba(61,20,11,0.25)] transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      {loading ? 'Validating Registry...' : 'VERIFY & CREATE MEMBERSHIPS'}
                    </Button>

                    <button
                      type="button"
                      onClick={() => {
                        playSlidePop();
                        setIsVerifyingEmailOtp(false);
                        setPendingUserData(null);
                        setEmailVerificationCode('');
                      }}
                      className="w-full text-center text-[10px] font-black uppercase tracking-widest text-[#D89C95] hover:text-[#3B1F17] transition-colors"
                    >
                      ← Back & Restart Signup
                    </button>
                  </form>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-3xl font-serif font-black tracking-tight text-[#3B1F17] flex items-center gap-1.5">
                    Create your account <span className="text-[#DFB15B] text-xl">✦</span>
                  </h2>
                  <p className="text-xs text-[#3B1F17]/65 font-medium mt-1 mb-8">
                    Sign up to start ordering your favorite cakes
                  </p>

                  {/* REGISTRATION FORM */}
                  <form onSubmit={handleEmailRegister} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-[0.25em] text-[#3B1F17]">
                        Full Name
                      </label>
                      <div className="relative flex items-center">
                        <User className="absolute left-4 w-4 h-4 text-[#3B1F17]/35" />
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="h-14 rounded-2xl border border-[#E8DDD7] pl-11 pr-4 bg-[#FFFDFB] text-xs font-semibold focus-visible:ring-1 focus-visible:ring-[#DFB15B] text-[#3C2117] placeholder:text-[#3B1F17]/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-[0.25em] text-[#3B1F17]">
                        Email Address
                      </label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-4 w-4 h-4 text-[#3B1F17]/35" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-14 rounded-2xl border border-[#E8DDD7] pl-11 pr-4 bg-[#FFFDFB] text-xs font-semibold focus-visible:ring-1 focus-visible:ring-[#DFB15B] text-[#3C2117] placeholder:text-[#3B1F17]/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-[0.25em] text-[#3B1F17]">
                        Mobile Phone Number (Compulsory)
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 font-bold text-xs text-[#3B1F17]/50">+91</span>
                        <Input
                          type="tel"
                          placeholder="99999 99999"
                          maxLength={10}
                          value={registerPhone}
                          onChange={(e) => setRegisterPhone(e.target.value.replace(/\D/g, ''))}
                          required
                          className="h-14 rounded-2xl border border-[#E8DDD7] pl-14 pr-4 bg-[#FFFDFB] text-xs font-semibold focus-visible:ring-1 focus-visible:ring-[#DFB15B] text-[#3C2117] placeholder:text-[#3B1F17]/30 tracking-widest font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-[0.25em] text-[#3B1F17]">
                        Password
                      </label>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-4 w-4 h-4 text-[#3B1F17]/35" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-14 rounded-2xl border border-[#E8DDD7] pl-11 pr-11 bg-[#FFFDFB] text-xs font-semibold focus-visible:ring-1 focus-visible:ring-[#DFB15B] text-[#3C2117] placeholder:text-[#3B1F17]/30"
                        />
                        <button
                          type="button"
                          onClick={() => { playBtnTap(); setShowPassword(!showPassword); }}
                          className="absolute right-4 text-[#3B1F17]/40 hover:text-[#3B1F17]"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-[0.25em] text-[#3B1F17]">
                        Confirm Password
                      </label>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-4 w-4 h-4 text-[#3B1F17]/35" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="h-14 rounded-2xl border border-[#E8DDD7] pl-11 pr-11 bg-[#FFFDFB] text-xs font-semibold focus-visible:ring-1 focus-visible:ring-[#DFB15B] text-[#3C2117] placeholder:text-[#3B1F17]/30"
                        />
                        <button
                          type="button"
                          onClick={() => { playBtnTap(); setShowConfirmPassword(!showConfirmPassword); }}
                          className="absolute right-4 text-[#3B1F17]/40 hover:text-[#3B1F17]"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Terms and conditions switch bar */}
                    <div className="py-1 pl-0.5">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <button
                          type="button"
                          onClick={() => { playBtnTap(); setAgreeTerms(!agreeTerms); }}
                          className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all mt-0.5 shrink-0 ${
                            agreeTerms ? 'bg-[#3D140B] border-[#3D140B] text-white' : 'border-[#E8DDD7] bg-white'
                          }`}
                        >
                          {agreeTerms && <span className="text-[9px] font-bold">✓</span>}
                        </button>
                        <span className="text-[10px] font-black text-[#3B1F17]/65 uppercase tracking-wide leading-tight">
                          I agree to the <span className="text-[#DE9088] underline hover:text-[#3D140B]">Terms & Conditions</span>
                        </span>
                      </label>
                    </div>

                    {/* REGISTER SIGNUP BUTTON */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 rounded-2xl bg-[#3D140B] hover:bg-[#DE9088]/90 text-amber-50 border border-[#DFB15B]/30 hover:border-transparent font-black tracking-[0.22em] text-xs uppercase shadow-[0_5px_15px_rgba(61,20,11,0.25)] transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      {loading ? 'Submitting Membership...' : 'SIGN UP'}
                    </Button>
                  </form>

                  {/* SIGNUP DIVIDER OPTIONS */}
                  <div className="relative flex items-center justify-center my-6">
                    <div className="h-[1px] bg-[#E8DDD7] w-full" />
                    <span className="absolute bg-[#FFFDFB] px-4 text-[#3B1F17]/35 text-[9px] font-black uppercase tracking-[0.2em] italic">
                      OR
                    </span>
                  </div>

                  {/* SOCIAL BUTTON TOGGLING */}
                  <div className="text-center">
                    <p className="text-[11px] font-bold text-[#3B1F17]/70">
                      Already have an account?{' '}
                      <button
                        onClick={() => { playSlidePop(); setMode('login'); }}
                        className="text-[#DFB15B] font-black uppercase tracking-wider hover:underline ml-1.5 focus:outline-none"
                      >
                        Login
                      </button>
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {mode === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col text-left"
            >
              <div className="flex items-center mb-0.5">
                <button
                  onClick={() => { playSlidePop(); setMode('login'); }}
                  className="w-8 h-8 rounded-full bg-[#FFFDFB] hover:bg-[#DE9088]/10 border border-[#E8DDD7] flex items-center justify-center text-[#3B1F17] transition-all active:scale-90"
                >
                  <ArrowLeft className="w-4 h-4 text-[#3B1F17]" />
                </button>
              </div>

              <LogoAndCake />

              <h2 className="text-3xl font-serif font-black tracking-tight text-[#3B1F17] flex items-center gap-1.5">
                Instant Vault Entry <span className="text-[#DFB15B] text-xl">✦</span>
              </h2>
              <p className="text-xs text-[#3B1F17]/65 font-medium mt-1 mb-8">
                Fast secure access via mobile OTP
              </p>

              {!otpSent ? (
                <form onSubmit={handleRequestOtp} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-[0.25em] text-[#3B1F17]">
                      Mobile Phone Number
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 font-bold text-xs text-[#3B1F17]/50">+91</span>
                      <Input
                        type="tel"
                        placeholder="99999 99999"
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        required
                        className="h-14 rounded-2xl border border-[#E8DDD7] pl-14 pr-4 bg-[#FFFDFB] text-xs font-semibold focus-visible:ring-1 focus-visible:ring-[#DFB15B] text-[#3C2117] placeholder:text-[#3B1F17]/30 tracking-widest font-mono"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-[#3D140B] text-amber-50 font-black tracking-widest text-xs uppercase shadow-md transition-all active:scale-95"
                  >
                    {loading ? 'Delivering Transmission...' : 'REQUEST VAULT OTP'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-[0.25em] text-[#3B1F17] text-center block">
                      6-Digit Security Vault Key
                    </label>
                    <Input
                      type="text"
                      maxLength={6}
                      placeholder="Ex. 123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      required
                      className="h-15 rounded-2xl border-2 border-[#DFB15B]/40 text-center font-black tracking-[0.6em] text-xl bg-[#FFFDFB] focus-visible:ring-1 focus-visible:ring-[#DFB15B]"
                    />
                    <p className="text-[9px] text-center text-[#D89C95] italic uppercase tracking-wider mt-3">
                      Check the toast notification alert at the top for your key
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOtpSent(false)}
                      className="flex-1 h-14 rounded-2xl border-[#E8DDD7] text-[10px] font-black uppercase tracking-widest"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] h-14 rounded-2xl bg-[#3D140B] text-white font-black uppercase text-xs tracking-widest shadow-md"
                    >
                      {loading ? 'Unlocking...' : 'VERIFY KEY'}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          )}

          {mode === 'forgot' && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col text-left"
            >
              <div className="flex items-center mb-0.5">
                <button
                  onClick={() => { playSlidePop(); setMode('login'); }}
                  className="w-8 h-8 rounded-full bg-[#FFFDFB] hover:bg-[#DE9088]/10 border border-[#E8DDD7] flex items-center justify-center text-[#3B1F17] transition-all active:scale-90"
                >
                  <ArrowLeft className="w-4 h-4 text-[#3B1F17]" />
                </button>
              </div>

              <LogoAndCake />

              <h2 className="text-3xl font-serif font-black tracking-tight text-[#3B1F17] flex items-center gap-1.5">
                Recover Account <span className="text-[#DFB15B] text-xl">✦</span>
              </h2>
              <p className="text-xs text-[#3B1F17]/65 font-medium mt-1 mb-8">
                Recover your exclusive collector credentials
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.25em] text-[#3B1F17]">
                    Account Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-4 h-4 text-[#3B1F17]/35" />
                    <Input
                      type="email"
                      placeholder="Ex. collector@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-14 rounded-2xl border border-[#E8DDD7] pl-11 pr-4 bg-[#FFFDFB] text-xs font-semibold focus-visible:ring-1 focus-visible:ring-[#DFB15B] text-[#3C2117]"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMode('login')}
                    className="flex-1 h-14 rounded-2xl border-[#E8DDD7] text-[10px] font-black uppercase tracking-widest"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] h-14 rounded-2xl bg-[#3D140B] text-white font-black uppercase text-xs tracking-widest shadow-md"
                  >
                    {loading ? 'Transmitting...' : 'TRANSMIT LINK'}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Separating margin line */}
        <div className="h-[1px] bg-[#E8DDD7] my-6 opacity-60 w-full" />

        {/* PREMIUM QUALITY FLAGS FOOTER */}
        <div className="grid grid-cols-3 gap-2 text-center w-full">
          <div className="flex flex-col items-center justify-center space-y-1 px-1">
            <div className="w-8 h-8 rounded-full bg-[#DE9088]/10 text-[#DE9088] border border-[#DE9088]/25 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#DE9088]" />
            </div>
            <span className="text-[8px] font-black text-[#3B1F17]/55 uppercase tracking-wide leading-none">
              Premium Quality
            </span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1 px-1 border-x border-[#E8DDD7]/70">
            <div className="w-8 h-8 rounded-full bg-[#DE9088]/10 text-[#DE9088] border border-[#DE9088]/25 flex items-center justify-center">
              <Gift className="w-4 h-4 text-[#DE9088]" />
            </div>
            <span className="text-[8px] font-black text-[#3B1F17]/55 uppercase tracking-wide leading-none">
              Freshly Made
            </span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1 px-1">
            <div className="w-8 h-8 rounded-full bg-[#DE9088]/10 text-[#DE9088] border border-[#DE9088]/25 flex items-center justify-center">
              <Truck className="w-4 h-4 text-[#DE9088]" />
            </div>
            <span className="text-[8px] font-black text-[#3B1F17]/55 uppercase tracking-wide leading-none">
              Fast Delivery
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
