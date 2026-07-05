import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  LogOut, 
  Smartphone, 
  MapPin, 
  Bookmark, 
  UserCheck, 
  Trash2, 
  AlertCircle,
  RefreshCw,
  Loader2,
  FileCode2,
  ArrowLeft
} from 'lucide-react';
import { playSuccessChime, playBtnTap, playSlidePop } from '../lib/sound';


type AuthViewMode = 'login' | 'signup' | 'forgot' | 'google-details';

export default function AuthPortal() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [authMode, setAuthMode] = useState<AuthViewMode>('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading and action state indicators
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Check query parameter for signup mode
  useEffect(() => {
    if (searchParams.get('signup') === 'true') {
      setAuthMode('signup');
    }
  }, [searchParams]);

  // Monitor Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setFetchingProfile(true);
        try {
          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserProfile(data);
            // Fill edit fields
            setFullName(data.displayName || user.displayName || '');
            setPhone(data.phoneNumber || '');
            setCity(data.city || '');
            setBio(data.bio || '');

            if (data.phoneNumber) {
              // User has completed details, so we can safely redirect
              const path = window.location.pathname;
              if (path === '/login' || path === '/signup') {
                navigate(redirectTo);
              }
            } else {
              // Missing compulsory details (e.g., phone number)
              setAuthMode('google-details');
            }
          } else {
            // First time Google / social sign-in: show details completion form
            setAuthMode('google-details');
            setFullName(user.displayName || '');
            setPhone('');
            setCity('');
            setBio('Authenticated securely via Google Identity Single Sign-On.');
          }
        } catch (err) {
          console.error("Auth status sync error:", err);
        } finally {
          setFetchingProfile(false);
        }
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, [navigate, redirectTo]);

  const fetchUserProfile = async (uid: string) => {
    setFetchingProfile(true);
    try {
      const userRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserProfile(data);
        // Fill edit fields
        setFullName(data.displayName || '');
        setPhone(data.phoneNumber || '');
        setCity(data.city || '');
        setBio(data.bio || '');
        
        if (!data.phoneNumber) {
          setAuthMode('google-details');
        }
      } else {
        // Create initial default profile in firestore if it doesn't exist yet
        const initialProfile = {
          uid,
          email: auth.currentUser?.email || '',
          displayName: auth.currentUser?.displayName || 'Premium User',
          phoneNumber: '',
          city: '',
          bio: 'Welcome to your premium dashboard!',
          role: 'customer',
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, initialProfile);
        setUserProfile(initialProfile);
        setAuthMode('google-details');
      }
    } catch (err: any) {
      console.error("Error fetching user profile:", err);
      toast.error("Failed to read your Firestore profile data.");
    } finally {
      setFetchingProfile(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    playBtnTap();
    try {
      const cleanEmail = email.trim();
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      playSuccessChime();
      toast.success("Logged in successfully! Welcome to your secure dashboard.");
      navigate(redirectTo);
    } catch (err: any) {
      console.error("Login failure:", err);
      let errMsg = "Invalid credentials. Please verify your email and password.";
      if (err.code === 'auth/user-not-found') {
        errMsg = "User account not found. Please sign up to create an account.";
      } else if (err.code === 'auth/wrong-password') {
        errMsg = "Incorrect password. Please try again or click Forgot Password.";
      } else if (err.code === 'auth/invalid-email') {
        errMsg = "Please enter a valid email address.";
      }
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please verify.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    playBtnTap();
    try {
      const cleanEmail = email.trim();
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      // Instantly create and save their Firestore profile structure
      const userRef = doc(db, 'users', user.uid);
      const initialProfile = {
        uid: user.uid,
        email: cleanEmail,
        displayName: fullName.trim() || 'New User',
        phoneNumber: phone.trim(),
        city: city.trim(),
        bio: bio.trim() || 'Welcome to my secure account profile!',
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      
      await setDoc(userRef, initialProfile);
      setUserProfile(initialProfile);
      
      playSuccessChime();
      toast.success("Account created and configured successfully!");
      navigate(redirectTo);
    } catch (err: any) {
      console.error("Signup failure:", err);
      let errMsg = "Failed to create your account. Please try again.";
      if (err.code === 'auth/email-already-in-use') {
        errMsg = "This email is already registered. Please login instead.";
      } else if (err.code === 'auth/invalid-email') {
        errMsg = "Please provide a valid email address.";
      } else if (err.code === 'auth/weak-password') {
        errMsg = "Password is too weak. Please use a stronger security code.";
      }
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    playBtnTap();
    try {
      const cleanEmail = email.trim();
      await sendPasswordResetEmail(auth, cleanEmail);
      toast.success("Password reset instructions have been dispatched to: " + cleanEmail);
      setAuthMode('login');
    } catch (err: any) {
      console.error("Forgot password failure:", err);
      toast.error(err.message || "Failed to initiate password reset.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;
    const provider = new GoogleAuthProvider();
    setLoading(true);
    playBtnTap();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists() && snap.data()?.phoneNumber) {
        setUserProfile(snap.data());
        playSuccessChime();
        toast.success("Signed in with Google authentication successfully!");
        navigate(redirectTo);
      } else {
        // First-time or incomplete details: request fields
        setFullName(user.displayName || '');
        setPhone('');
        setCity('');
        setBio('Authenticated securely via Google Identity Single Sign-On.');
        setAuthMode('google-details');
        toast.info("Aapka account detail form active ho gaya hai, please phone number enter kijiye!");
      }
    } catch (err: any) {
      console.error("Google login failure:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        toast.error("Sign-in popup was closed before completion.");
      } else if (err.code === 'auth/operation-not-allowed') {
        toast.error(
          "Google Sign-In is NOT enabled in your Firebase Console! Please navigate to Firebase Console > Build > Authentication > Sign-in method, click 'Add new provider', choose Google, and enable it. Save configurations before retrying.",
          { duration: 15000 }
        );
      } else if (err.code === 'auth/unauthorized-domain' || err.message?.includes('unauthorized-domain')) {
        toast.error(
          "Domain Not Authorized! Please add '" + window.location.hostname + "' in Firebase Console > Authentication > Settings > Authorized Domains",
          { duration: 15000 }
        );
      } else if (err.code === 'auth/web-storage-unsupported' || err.message?.includes('third-party cookies')) {
        toast.error("Iframe browser block: Please click the 'Open in New Tab' button in the upper right to enable safe Google Sign-in!", { duration: 8000 });
      } else {
        toast.error(err.message || "Failed to authenticate via Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteGoogleDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !currentUser) return;
    if (!phone || phone.trim().length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    playBtnTap();
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const finalProfile = {
        uid: currentUser.uid,
        email: currentUser.email || '',
        displayName: fullName.trim() || currentUser.displayName || 'Google Collector',
        phoneNumber: phone.trim(),
        city: city.trim(),
        bio: bio.trim() || 'Authenticated securely via Google Identity Single Sign-On.',
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      await setDoc(userRef, finalProfile);
      setUserProfile(finalProfile);
      playSuccessChime();
      toast.success("Account registration completed successfully!");
      navigate(redirectTo);
    } catch (err: any) {
      console.error("Failed to complete Google profile details:", err);
      toast.error(err.message || "Failed to save profile details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || updatingProfile) return;
    setUpdatingProfile(true);
    playBtnTap();
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const updatedData = {
        ...userProfile,
        displayName: fullName.trim(),
        phoneNumber: phone.trim(),
        city: city.trim(),
        bio: bio.trim(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(userRef, updatedData, { merge: true });
      setUserProfile(updatedData);
      playSuccessChime();
      toast.success("Your secure cloud profile was updated successfully!");
    } catch (err: any) {
      console.error("Update profile failure:", err);
      toast.error("Failed to synchronize profile settings with Firestore cloud.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleLogout = async () => {
    playBtnTap();
    try {
      await signOut(auth);
      toast.success("Logged out of secure cloud session safely.");
    } catch (err: any) {
      console.error("Logout failure:", err);
      toast.error("Failed to sign out of active session.");
    }
  };

  // Delete / Reset All My Firestore Data
  const handleDeleteMyData = async () => {
    if (!currentUser) return;
    const confirmText = prompt("Type 'DELETE' to erase your stored Firestore profile and clear previous cached session data:");
    if (confirmText !== 'DELETE') {
      toast.info("Database reset operation cancelled.");
      return;
    }

    setLoading(true);
    playBtnTap();
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await deleteDoc(userRef);
      
      // Force update locally too
      setUserProfile(null);
      await signOut(auth);
      playSuccessChime();
      toast.success("Successfully erased your cloud Firestore account document!");
    } catch (err: any) {
      console.error("Reset firestore profile error:", err);
      toast.error("Failed to erase firestore data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#DFB15B]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      <div className="w-full max-w-4xl z-10 flex flex-col md:flex-row gap-8 items-stretch">
        
        {/* Left Informational Showcase Sidebar (Visual Hook) */}
        <div className="w-full md:w-5/12 bg-gradient-to-b from-[#1C0F0E]/90 to-[#0C0503]/95 border-2 border-[#DFB15B]/20 rounded-[40px] p-8 flex flex-col justify-between relative shadow-2xl overflow-hidden min-h-[380px] md:min-h-auto">
          {/* Subtle gold sparkles layer */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(223,177,91,0.08),transparent)] pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#DFB15B] to-amber-300 flex items-center justify-center text-[#1C0F0E] shadow-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black tracking-[0.25em] text-[#DFB15B] uppercase">SECURE PORTAL</span>
                <span className="text-lg font-bold font-serif text-white tracking-wide">CakeUrban Access</span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex gap-3">
                <div className="w-5 h-5 mt-1 shrink-0 text-[#DFB15B]">✦</div>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                  <strong>Firebase Authentication</strong>: Secure identity validation supporting modern login/signup and credential management.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 mt-1 shrink-0 text-[#DFB15B]">✦</div>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                  <strong>Cloud Firestore Sync</strong>: Real-time user profiles storage, editable settings, and complete database persistence.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 mt-1 shrink-0 text-[#DFB15B]">✦</div>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                  <strong>Interactive Controls</strong>: Instant state toggle, custom validation error outputs, and full-fidelity form mechanics.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-zinc-800/80">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#DFB15B]/70 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              <span>FIREBASE SERVICE ONLINE</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-medium">
              Connected securely to the active database project.
            </p>
          </div>
        </div>

        {/* Right Forms Content Column */}
        <div className="w-full md:w-7/12 flex flex-col">
          <AnimatePresence mode="wait">
            {(!currentUser || authMode === 'google-details') ? (
              /* =======================================================
                 UNAUTHENTICATED VIEWS: LOGIN / SIGNUP / FORGOT PASSWORD
                 ======================================================= */
              <motion.div
                key="auth-forms"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="bg-[#FFFDFB] text-zinc-800 rounded-[40px] border-[5px] border-[#DFB15B]/20 p-8 sm:p-10 shadow-2xl flex flex-col justify-between"
              >
                {/* View 1: LOGIN */}
                {authMode === 'login' && (
                  <motion.div
                    key="login-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-700 hover:text-amber-950 transition-all bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-full"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        Back to Home
                      </button>
                    </div>
                    <div className="mb-6">
                      <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#1C0F0E] flex items-center gap-1.5">
                        Log In <span className="text-[#DFB15B] text-xl">✦</span>
                      </h2>
                      <p className="text-xs text-zinc-500 mt-1">
                        Access your secure profile. Please fill in your login credentials.
                      </p>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C0F0E]">
                          Email Address
                        </label>
                        <div className="relative flex items-center">
                          <Mail className="absolute left-4 w-4 h-4 text-zinc-400" />
                          <input
                            type="email"
                            required
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-12 rounded-2xl border border-zinc-200 pl-11 pr-4 bg-zinc-50 text-xs font-semibold focus:outline-none focus:border-[#DFB15B] focus:ring-1 focus:ring-[#DFB15B] text-zinc-800"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C0F0E]">
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={() => setAuthMode('forgot')}
                            className="text-[10px] font-black text-amber-600 uppercase tracking-wider hover:underline"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative flex items-center">
                          <Lock className="absolute left-4 w-4 h-4 text-zinc-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-12 rounded-2xl border border-zinc-200 pl-11 pr-11 bg-zinc-50 text-xs font-semibold focus:outline-none focus:border-[#DFB15B] focus:ring-1 focus:ring-[#DFB15B] text-zinc-800"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 text-zinc-400 hover:text-zinc-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 mt-4 rounded-2xl bg-[#1C0F0E] hover:bg-[#DFB15B]/90 text-white hover:text-zinc-950 transition-all font-black tracking-[0.2em] text-xs uppercase flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SECURE SIGN IN'}
                      </button>
                    </form>

                    <div className="relative flex items-center justify-center my-6">
                      <div className="h-[1px] bg-zinc-200 w-full" />
                      <span className="absolute bg-[#FFFDFB] px-4 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        OR
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full h-12 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 transition-all flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.15em] text-zinc-700 shadow-sm disabled:opacity-50"
                    >
                      <img 
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                        className="w-5 h-5" 
                        alt="Google" 
                      />
                      Continue with Google
                    </button>

                    <div className="text-center mt-6 pt-2 border-t border-zinc-100">
                      <p className="text-xs text-zinc-500 font-medium">
                        Don't have an account yet?{' '}
                        <button
                          onClick={() => setAuthMode('signup')}
                          className="text-amber-600 font-black uppercase tracking-wider hover:underline ml-1"
                        >
                          Sign Up
                        </button>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* View 2: SIGNUP */}
                {authMode === 'signup' && (
                  <motion.div
                    key="signup-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-700 hover:text-amber-950 transition-all bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-full"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        Back to Home
                      </button>
                    </div>
                    <div className="mb-6">
                      <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#1C0F0E] flex items-center gap-1.5">
                        Sign Up <span className="text-[#DFB15B] text-xl">✦</span>
                      </h2>
                      <p className="text-xs text-zinc-500 mt-1">
                        Create a free, secure user account synchronized with Cloud Firestore.
                      </p>
                    </div>

                    <form onSubmit={handleEmailSignup} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C0F0E]">
                            Full Name
                          </label>
                          <div className="relative flex items-center">
                            <UserIcon className="absolute left-4 w-4 h-4 text-zinc-400" />
                            <input
                              type="text"
                              required
                              placeholder="Your full name"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full h-12 rounded-2xl border border-zinc-200 pl-11 pr-4 bg-zinc-50 text-xs font-semibold focus:outline-none focus:border-[#DFB15B] focus:ring-1 focus:ring-[#DFB15B] text-zinc-800"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C0F0E]">
                            Phone Number
                          </label>
                          <div className="relative flex items-center">
                            <Smartphone className="absolute left-4 w-4 h-4 text-zinc-400" />
                            <input
                              type="tel"
                              placeholder="Your phone number"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full h-12 rounded-2xl border border-zinc-200 pl-11 pr-4 bg-zinc-50 text-xs font-semibold focus:outline-none focus:border-[#DFB15B] focus:ring-1 focus:ring-[#DFB15B] text-zinc-800"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C0F0E]">
                          Email Address
                        </label>
                        <div className="relative flex items-center">
                          <Mail className="absolute left-4 w-4 h-4 text-zinc-400" />
                          <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-12 rounded-2xl border border-zinc-200 pl-11 pr-4 bg-zinc-50 text-xs font-semibold focus:outline-none focus:border-[#DFB15B] focus:ring-1 focus:ring-[#DFB15B] text-zinc-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C0F0E]">
                            Password
                          </label>
                          <div className="relative flex items-center">
                            <Lock className="absolute left-4 w-4 h-4 text-zinc-400" />
                            <input
                              type={showPassword ? "text" : "password"}
                              required
                              placeholder="Min 6 chars"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full h-12 rounded-2xl border border-zinc-200 pl-11 pr-11 bg-zinc-50 text-xs font-semibold focus:outline-none focus:border-[#DFB15B] focus:ring-1 focus:ring-[#DFB15B] text-zinc-800"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 text-zinc-400 hover:text-zinc-600"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C0F0E]">
                            Confirm Password
                          </label>
                          <div className="relative flex items-center">
                            <Lock className="absolute left-4 w-4 h-4 text-zinc-400" />
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              required
                              placeholder="Re-enter password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full h-12 rounded-2xl border border-zinc-200 pl-11 pr-11 bg-zinc-50 text-xs font-semibold focus:outline-none focus:border-[#DFB15B] focus:ring-1 focus:ring-[#DFB15B] text-zinc-800"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-4 text-zinc-400 hover:text-zinc-600"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 mt-4 rounded-2xl bg-[#1C0F0E] hover:bg-[#DFB15B]/90 text-white hover:text-zinc-950 transition-all font-black tracking-[0.2em] text-xs uppercase flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'CREATE CLOUD ACCOUNT'}
                      </button>
                    </form>

                    <div className="text-center mt-6 pt-2 border-t border-zinc-100">
                      <p className="text-xs text-zinc-500 font-medium">
                        Already have an account?{' '}
                        <button
                          onClick={() => setAuthMode('login')}
                          className="text-amber-600 font-black uppercase tracking-wider hover:underline ml-1"
                        >
                          Log In
                        </button>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* View 3: FORGOT PASSWORD */}
                {authMode === 'forgot' && (
                  <motion.div
                    key="forgot-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-700 hover:text-amber-950 transition-all bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-full"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        Back to Home
                      </button>
                    </div>
                    <div className="mb-6">
                      <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#1C0F0E] flex items-center gap-1.5">
                        Recover Password <span className="text-[#DFB15B] text-xl">✦</span>
                      </h2>
                      <p className="text-xs text-zinc-500 mt-1">
                        Provide your registered email. We will dispatch a secure reset credential link.
                      </p>
                    </div>

                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C0F0E]">
                          Registered Email Address
                        </label>
                        <div className="relative flex items-center">
                          <Mail className="absolute left-4 w-4 h-4 text-zinc-400" />
                          <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-12 rounded-2xl border border-zinc-200 pl-11 pr-4 bg-zinc-50 text-xs font-semibold focus:outline-none focus:border-[#DFB15B] focus:ring-1 focus:ring-[#DFB15B] text-zinc-800"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 mt-4 rounded-2xl bg-[#1C0F0E] hover:bg-[#DFB15B]/90 text-white hover:text-zinc-950 transition-all font-black tracking-[0.2em] text-xs uppercase flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'DISPATCH RESET EMAIL'}
                      </button>
                    </form>

                    <div className="text-center mt-6 pt-2 border-t border-zinc-100">
                      <button
                        onClick={() => setAuthMode('login')}
                        className="text-xs text-amber-600 font-black uppercase tracking-widest hover:underline"
                      >
                        ← Back to Login
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* View 4: GOOGLE DETAILS COMPLETION */}
                {authMode === 'google-details' && (
                  <motion.div
                    key="google-details-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#1C0F0E] flex items-center gap-1.5">
                        Almost There! <span className="text-[#DFB15B] text-xl">✦</span>
                      </h2>
                      <p className="text-xs text-zinc-500 mt-1">
                        Please complete your Cakehouse registration details. A phone number is compulsory.
                      </p>
                    </div>

                    <form onSubmit={handleCompleteGoogleDetails} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C0F0E]">
                          Email Address (Google verified)
                        </label>
                        <input
                          type="email"
                          disabled
                          value={currentUser?.email || ''}
                          className="w-full h-12 rounded-2xl border border-zinc-200 pl-4 bg-zinc-100 text-xs font-semibold text-zinc-400 cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C0F0E]">
                          Full Name
                        </label>
                        <div className="relative flex items-center">
                          <UserIcon className="absolute left-4 w-4 h-4 text-zinc-400" />
                          <input
                            type="text"
                            required
                            placeholder="Your full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full h-12 rounded-2xl border border-zinc-200 pl-11 pr-4 bg-zinc-50 text-xs font-semibold focus:outline-none focus:border-[#DFB15B] focus:ring-1 focus:ring-[#DFB15B] text-zinc-800"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C0F0E]">
                          Phone Number (Compulsory)
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-4 text-xs font-bold text-zinc-500">+91</span>
                          <input
                            type="tel"
                            required
                            placeholder="99999 99999"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            className="w-full h-12 rounded-2xl border border-zinc-200 pl-12 pr-4 bg-zinc-50 text-xs font-semibold focus:outline-none focus:border-[#DFB15B] focus:ring-1 focus:ring-[#DFB15B] text-zinc-800 tracking-wider font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C0F0E]">
                          City / Location (Optional)
                        </label>
                        <div className="relative flex items-center">
                          <MapPin className="absolute left-4 w-4 h-4 text-zinc-400" />
                          <input
                            type="text"
                            placeholder="Delhi NCR, Gurgaon, etc."
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full h-12 rounded-2xl border border-[#DFB15B]/30 focus:border-[#DFB15B] pl-11 pr-4 bg-zinc-50 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#DFB15B] text-zinc-800"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 mt-4 rounded-2xl bg-[#1C0F0E] hover:bg-[#DFB15B]/90 text-white hover:text-zinc-950 transition-all font-black tracking-[0.2em] text-xs uppercase flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SAVE DETAILS & START SHOPPING'}
                      </button>
                    </form>

                    <div className="text-center mt-6 pt-2 border-t border-zinc-100">
                      <button
                        onClick={async () => {
                          playBtnTap();
                          await signOut(auth);
                          setAuthMode('login');
                        }}
                        className="text-xs text-zinc-500 hover:text-zinc-800 font-bold uppercase tracking-wider"
                      >
                        ← Cancel & Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* =======================================================
                 AUTHENTICATED STATE: PREMIUM USER SETTINGS & CONTROL CENTER
                 ======================================================= */
              <motion.div
                key="user-profile-dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.35 }}
                className="bg-[#FFFDFB] text-zinc-800 rounded-[40px] border-[5px] border-[#DFB15B]/20 p-8 sm:p-10 shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-6 pb-4 border-b border-zinc-100">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>CLOUD SESSION ACTIVE</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#1C0F0E] mt-1">
                        Aapka Account <span className="text-[#DFB15B] text-xl">✦</span>
                      </h2>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 hover:text-[#DE9088] font-black text-[10px] uppercase tracking-wider transition-all shadow-sm"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>

                  {fetchingProfile ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-3">
                      <Loader2 className="w-8 h-8 text-[#DFB15B] animate-spin" />
                      <span className="text-xs text-zinc-500 font-medium">Synchronizing Secure User Data...</span>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* Interactive Security Banner */}
                      <div className="bg-gradient-to-r from-amber-500/5 to-[#DFB15B]/10 border border-[#DFB15B]/20 rounded-2xl p-4 flex gap-3.5 items-center">
                        <Sparkles className="w-5 h-5 text-[#DFB15B] shrink-0" />
                        <div className="text-left">
                          <p className="text-xs font-bold text-zinc-800">
                            Logged in as: <span className="font-black text-amber-700 underline">{currentUser?.email}</span>
                          </p>
                          <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                            ID token generated. Your profile changes are stored in Firestore with real-time cloud triggers.
                          </p>
                        </div>
                      </div>

                      {/* User profile metadata form */}
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1 text-left">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                              Edit Display Name
                            </label>
                            <input
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full h-11 rounded-xl border border-zinc-200 px-4 bg-zinc-50 text-xs font-semibold focus:outline-none focus:border-[#DFB15B] text-zinc-800"
                            />
                          </div>

                          <div className="space-y-1 text-left">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                              Mobile Number
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full h-11 rounded-xl border border-zinc-200 px-4 bg-zinc-50 text-xs font-semibold focus:outline-none focus:border-[#DFB15B] text-zinc-800 font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1 text-left">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                              Location / City
                            </label>
                            <input
                              type="text"
                              placeholder="Delhi NCR, Gurgaon, etc."
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="w-full h-11 rounded-xl border border-zinc-200 px-4 bg-zinc-50 text-xs font-semibold focus:outline-none focus:border-[#DFB15B] text-zinc-800"
                            />
                          </div>

                          <div className="space-y-1 text-left">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                              Role Privilege
                            </label>
                            <input
                              type="text"
                              disabled
                              value={userProfile?.role === 'admin' ? '⚜️ Enterprise Admin' : '⭐ Verified Customer'}
                              className="w-full h-11 rounded-xl border border-zinc-100 px-4 bg-zinc-100 text-xs font-bold text-zinc-500 cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div className="space-y-1 text-left">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                            Bio Statement
                          </label>
                          <textarea
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full rounded-xl border border-zinc-200 p-4 bg-zinc-50 text-xs font-semibold focus:outline-none focus:border-[#DFB15B] text-zinc-800 resize-none"
                            placeholder="Add a bio details..."
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={updatingProfile}
                          className="w-full h-12 rounded-2xl bg-[#1C0F0E] hover:bg-[#DFB15B] text-white hover:text-zinc-950 transition-all font-black tracking-[0.2em] text-xs uppercase flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                        >
                          {updatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SYNCHRONIZE PROFILE SETTINGS'}
                        </button>
                      </form>

                      {/* Delete Account Data section for resetting */}
                      <div className="mt-8 pt-6 border-t border-zinc-100 text-left">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-1">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                          <span>DANGER ZONE / DATA RESET</span>
                        </div>
                        <p className="text-xs text-zinc-500 mb-4 leading-relaxed font-medium">
                          Clicking below will delete your user document directly from the Firestore collection. This satisfies resetting data requests immediately.
                        </p>
                        <button
                          type="button"
                          onClick={handleDeleteMyData}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-red-200 hover:border-red-600 text-red-600 hover:bg-red-50 font-black text-[10px] uppercase tracking-wider transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          Erase My Firestore Profile & Sign Out
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
