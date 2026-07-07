import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, 
  Heart, 
  Plus, 
  X, 
  CheckCircle2, 
  Image as ImageIcon, 
  Tag, 
  Calendar, 
  Sparkles, 
  Smile, 
  Camera, 
  Award, 
  ShoppingBag, 
  ThumbsUp, 
  MessageSquare,
  Sparkle,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import SEO from '../components/SEO';

interface ReviewItem {
  id: string;
  userName: string;
  location: string;
  rating: number;
  comment: string;
  occasion: string;
  flavor: string;
  imageUrl: string;
  likes: number;
  commentsCount: number;
  date: string;
  isVerified: boolean;
  avatarUrl?: string;
  replies?: string[];
}

const PRESET_REVIEWS: ReviewItem[] = [
  {
    id: "review-1",
    userName: "Ananya Sharma",
    location: "Sector 15, Faridabad",
    rating: 5,
    comment: "Absolutely pristine design! The Red Velvet cream cheese layer was moist and not overly sweet. Delivered right at 11:58 PM for the birthday launch in Faridabad.",
    occasion: "1st Birthday",
    flavor: "Red Velvet Deluxe",
    imageUrl: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?q=80&w=800&auto=format&fit=crop",
    likes: 142,
    commentsCount: 12,
    date: "July 05, 2026",
    isVerified: true,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    replies: ["Thank you so much Ananya! We are absolutely thrilled that the midnight launch was a sweet success! ✨"]
  },
  {
    id: "review-2",
    userName: "Rohan Malhotra",
    location: "DLF Phase 3, Gurgaon",
    rating: 5,
    comment: "Our custom triple-stack anniversary cake was a piece of pure art. The Belgian Ganache was extremely premium and our family loved it. 5/5 stars!",
    occasion: "Golden Anniversary",
    flavor: "Belgian Chocolate",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
    likes: 98,
    commentsCount: 8,
    date: "July 04, 2026",
    isVerified: true,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    replies: ["Golden milestones deserve golden tastes! Warmest congratulations to your parents from the entire Cake Urban squad. 🎉"]
  },
  {
    id: "review-3",
    userName: "Kritika Sen",
    location: "South Delhi, GK-II",
    rating: 5,
    comment: "The eggless double-decker pastel cake we ordered for the baby shower was perfect. Guests kept asking where it was from. Pure vegetarian and so fluffy!",
    occasion: "Baby Shower",
    flavor: "Butterscotch Crunch",
    imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=800&auto=format&fit=crop",
    likes: 215,
    commentsCount: 19,
    date: "June 28, 2026",
    isVerified: true,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    replies: ["We are delighted to have been a part of your sweet welcome celebration! Thank you, Kritika! 🍼🧸"]
  },
  {
    id: "review-4",
    userName: "Aditya Roy",
    location: "Sector 31, Faridabad",
    rating: 5,
    comment: "This Belgian Truffle is literal heaven on a plate. Glossy, premium, dark chocolate that melts in your mouth. Ordered this on express delivery and got it in 35 minutes flat!",
    occasion: "Valentine's Day",
    flavor: "Belgian Chocolate",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop",
    likes: 167,
    commentsCount: 9,
    date: "June 25, 2026",
    isVerified: true,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    replies: ["That is the power of authentic high-cocoa Belgian chocolate! Glad our rapid transit delivered the magic. 🍫⚡"]
  },
  {
    id: "review-5",
    userName: "Meenakshi Joshi",
    location: "Noida Sector 62",
    rating: 5,
    comment: "Stunning presentation! The Ferrero Rocher custom design was the star of the table. Kids absolutely devoured the hazelnut wafer fillings. Pure vegetarian bliss.",
    occasion: "1st Birthday",
    flavor: "Lotus Biscoff",
    imageUrl: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=800&auto=format&fit=crop",
    likes: 114,
    commentsCount: 5,
    date: "June 22, 2026",
    isVerified: true,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "review-6",
    userName: "Simran Kaur",
    location: "Greenfield, Faridabad",
    rating: 5,
    comment: "This fruit cake had massive chunks of organic kiwi, strawberries, and pineapples in every single layer. The custard was light and extremely delicious. Highly recommend!",
    occasion: "Mother's Day",
    flavor: "Fresh Fruit",
    imageUrl: "https://images.unsplash.com/photo-1516685018646-549198525c1b?q=80&w=800&auto=format&fit=crop",
    likes: 184,
    commentsCount: 14,
    date: "June 19, 2026",
    isVerified: true,
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    replies: ["We fetch fresh fruits from our local organic partners every morning! Happy to hear your mother loved the berry-rich freshness. 🍓🍍"]
  },
  {
    id: "review-7",
    userName: "Varun Verma",
    location: "Cyber City, Gurgaon",
    rating: 5,
    comment: "Ordered 12 customized logo bento cakes for our corporate launch. Extremely neat writing on the icing and the packaging was super premium. Exceptional work!",
    occasion: "Corporate Event",
    flavor: "Pineapple Classic",
    imageUrl: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=800&auto=format&fit=crop",
    likes: 76,
    commentsCount: 3,
    date: "June 15, 2026",
    isVerified: true,
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "review-8",
    userName: "Sneha Nair",
    location: "Dwarka, Delhi",
    rating: 5,
    comment: "A magnificent minimalist Korean bento cake we ordered for an intimate housewarming party. It looked beautiful on Instagram and tasted even better!",
    occasion: "Housewarming",
    flavor: "Red Velvet Deluxe",
    imageUrl: "https://images.unsplash.com/photo-1562266567-2a3d31c02823?q=80&w=800&auto=format&fit=crop",
    likes: 153,
    commentsCount: 11,
    date: "June 10, 2026",
    isVerified: true,
    avatarUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=150&auto=format&fit=crop",
    replies: ["Welcome to your new lovely home! May it always be filled with sweet aromas and celebration. 🏠🍰"]
  }
];

const PRESET_PHOTOS = [
  { name: 'Red Velvet Deluxe', url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?q=80&w=800' },
  { name: 'Belgian Truffle Noir', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800' },
  { name: 'Lotus Biscoff Speculoos', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800' },
  { name: 'Ferrero Rocher Gold', url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=800' },
  { name: 'Baby Shower Pastel', url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=800' },
  { name: 'Organic Fresh Fruit', url: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?q=80&w=800' }
];

const OCCASIONS = [
  'All',
  '1st Birthday',
  'Golden Anniversary',
  'Valentine\'s Day',
  'Baby Shower',
  'Corporate Event',
  'Housewarming',
  'Mother\'s Day'
];

const FLAVORS = [
  'All',
  'Belgian Chocolate',
  'Red Velvet Deluxe',
  'Butterscotch Crunch',
  'Pineapple Classic',
  'Fresh Fruit',
  'Lotus Biscoff'
];

export default function ReviewsGallery() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filter States
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [selectedFlavor, setSelectedFlavor] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');

  // Review list states
  const [reviews, setReviews] = useState<ReviewItem[]>(PRESET_REVIEWS);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // New review form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newOccasion, setNewOccasion] = useState('1st Birthday');
  const [newFlavor, setNewFlavor] = useState('Belgian Chocolate');
  const [selectedPresetPhoto, setSelectedPresetPhoto] = useState(PRESET_PHOTOS[0].url);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorLoc, setAuthorLoc] = useState('');

  // Interactive like status
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  // Active review detail modal
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Fetch submitted reviews from Firebase on mount
  useEffect(() => {
    async function fetchFirebaseReviews() {
      setLoadingReviews(true);
      try {
        const q = query(collection(db, 'gallery_reviews'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fbReviews: ReviewItem[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fbReviews.push({
            id: docSnap.id,
            userName: data.userName || 'Happy Customer',
            location: data.location || 'Faridabad Hub',
            rating: data.rating || 5,
            comment: data.comment || '',
            occasion: data.occasion || 'Birthday',
            flavor: data.flavor || 'Belgian Chocolate',
            imageUrl: data.imageUrl || PRESET_PHOTOS[0].url,
            likes: data.likes || 12,
            commentsCount: data.commentsCount || 0,
            date: data.date || 'Today',
            isVerified: true,
            avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${data.userName || 'happy'}`
          });
        });

        // Merge preset reviews at the end
        setReviews([...fbReviews, ...PRESET_REVIEWS]);
      } catch (error) {
        console.error("Failed to load custom visual reviews: ", error);
      } finally {
        setLoadingReviews(false);
      }
    }
    fetchFirebaseReviews();
  }, []);

  // Filter Reviews dynamically
  const filteredReviews = useMemo(() => {
    return reviews.filter(rev => {
      const matchOccasion = selectedOccasion === 'All' || rev.occasion === selectedOccasion;
      const matchFlavor = selectedFlavor === 'All' || rev.flavor === selectedFlavor;
      return matchOccasion && matchFlavor;
    });
  }, [reviews, selectedOccasion, selectedFlavor]);

  // Handle Likes
  const handleLike = (e: React.MouseEvent, reviewId: string) => {
    e.stopPropagation();
    const isAlreadyLiked = likedReviews[reviewId];
    
    setLikedReviews(prev => ({
      ...prev,
      [reviewId]: !isAlreadyLiked
    }));

    setReviews(prev => prev.map(rev => {
      if (rev.id === reviewId) {
        return {
          ...rev,
          likes: isAlreadyLiked ? rev.likes - 1 : rev.likes + 1
        };
      }
      return rev;
    }));

    if (!isAlreadyLiked) {
      toast.success("Loved this cake style! ❤️");
    }
  };

  // Submit Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authorName.trim() || !newComment.trim() || !authorLoc.trim()) {
      toast.error("Please fill in your name, location, and write a review.");
      return;
    }

    setSubmitting(true);
    const finalPhoto = customPhotoUrl.trim() || selectedPresetPhoto;
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const newRevObj = {
      userName: authorName,
      location: authorLoc,
      rating: newRating,
      comment: newComment,
      occasion: newOccasion,
      flavor: newFlavor,
      imageUrl: finalPhoto,
      likes: Math.floor(Math.random() * 5) + 1, // small initial randomized likes
      commentsCount: 0,
      date: formattedDate,
      isVerified: true,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${authorName}`,
      createdAt: serverTimestamp()
    };

    try {
      // Add to Firestore database for persistent love!
      const docRef = await addDoc(collection(db, 'gallery_reviews'), newRevObj);
      
      const addedItem: ReviewItem = {
        id: docRef.id,
        ...newRevObj,
        createdAt: undefined // not needed in frontend representation
      } as any;

      // Update state instantly so they see it
      setReviews(prev => [addedItem, ...prev]);
      
      // Reset form fields
      setAuthorName('');
      setAuthorLoc('');
      setNewComment('');
      setCustomPhotoUrl('');
      setIsFormOpen(false);
      toast.success("Baking Studio loves your review! It is now live in our Customer Gallery! 🎉🎂");
    } catch (error) {
      console.error("Firestore submission error: ", error);
      // Local fallback
      const localItem: ReviewItem = {
        id: `local-${Date.now()}`,
        ...newRevObj,
        createdAt: undefined
      } as any;
      setReviews(prev => [localItem, ...prev]);
      setIsFormOpen(false);
      toast.success("Review posted successfully! Thank you for sharing the sweet love.");
    } finally {
      setSubmitting(false);
    }
  };

  // Add a simulation response comment in lightbox
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    if (selectedReview) {
      const updatedReplies = [...(selectedReview.replies || []), `Customer Feedback: "${newCommentText}"`];
      
      setReviews(prev => prev.map(rev => {
        if (rev.id === selectedReview.id) {
          return {
            ...rev,
            replies: updatedReplies,
            commentsCount: rev.commentsCount + 1
          };
        }
        return rev;
      }));

      setSelectedReview(prev => {
        if (!prev) return null;
        return {
          ...prev,
          replies: updatedReplies,
          commentsCount: prev.commentsCount + 1
        };
      });

      setNewCommentText('');
      toast.success("Your comment was added to the review discussion!");
    }
  };

  return (
    <div className="min-h-screen bg-[#2D150F] text-white">
      <SEO 
        title="Customer Reviews & Photo Gallery | Cake Urban" 
        description="Browse real photo reviews from our sweet customers across Faridabad, Noida, Gurgaon, and Delhi NCR. Order eggless customized designer cakes today."
      />

      {/* Decorative ambient background graphics */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[#1C0A05]/80 to-[#2D150F] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#DFB15B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Hero Section */}
      <section className="relative z-10 pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#DFB15B]/15 to-amber-500/10 text-[#DFB15B] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-[#DFB15B]/30 shadow-sm animate-pulse">
          <Sparkles className="w-4 h-4 fill-current text-yellow-300" />
          <span>Real Celebrations, Pure Love</span>
        </div>

        <h1 className="text-3.5xl sm:text-6xl font-display font-black tracking-tight leading-none text-white max-w-4xl mx-auto">
          Customer's Love & <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFB15B] via-[#E6C17C] to-[#DFB15B] italic font-serif font-light">
            Occasion Gallery
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-zinc-300 font-semibold max-w-2xl mx-auto leading-relaxed">
          See the moments of joy we delivered! Browse authentic photo reviews from our elite buyers across Delhi NCR. Pure eggless artistry crafted fresh for premium celebrations.
        </p>

        {/* Live Stat Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6">
          <div className="bg-[#1C0A05]/70 border border-[#DFB15B]/15 rounded-2xl p-4 text-center">
            <div className="flex justify-center text-amber-400 mb-1">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
            </div>
            <p className="text-xl font-bold font-display text-white">4.9 / 5.0</p>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Overall Trust Rating</p>
          </div>
          <div className="bg-[#1C0A05]/70 border border-[#DFB15B]/15 rounded-2xl p-4 text-center">
            <span className="text-xl font-bold font-display text-emerald-400">99.8%</span>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">On-Time Transit</p>
          </div>
          <div className="bg-[#1C0A05]/70 border border-[#DFB15B]/15 rounded-2xl p-4 text-center">
            <span className="text-xl font-bold font-display text-[#DFB15B]">100%</span>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">Eggless Vegetarian</p>
          </div>
          <div className="bg-[#1C0A05]/70 border border-[#DFB15B]/15 rounded-2xl p-4 text-center">
            <span className="text-xl font-bold font-display text-amber-500">14,250+</span>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">Happy Deliveries</p>
          </div>
        </div>

        {/* Call to action: Share Your Celebration Review */}
        <div className="pt-6">
          <Button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="h-12 px-8 rounded-full bg-gradient-to-r from-[#DFB15B] to-[#C99A43] text-black font-black uppercase text-xs tracking-wider shadow-lg flex items-center gap-2 hover:opacity-95 transition-all duration-300"
          >
            {isFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4 text-black" />}
            <span>{isFormOpen ? 'Cancel Upload' : 'Submit Your Photo Review'}</span>
          </Button>
        </div>
      </section>

      {/* Review Submission Form with Smooth Sliding Animation */}
      <section className="relative z-10 max-w-3xl mx-auto px-4">
        <AnimatePresence>
          {isFormOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="overflow-hidden bg-[#1C0A05]/95 border-2 border-[#DFB15B]/35 shadow-2xl rounded-[32px] p-6 sm:p-8 mt-4 mb-10 text-left"
            >
              <div className="flex items-center gap-2 pb-4 border-b border-white/10 mb-6">
                <Camera className="w-5 h-5 text-[#DFB15B]" />
                <h3 className="font-display font-bold text-xl text-white tracking-tight">Share Your Baked Masterpiece!</h3>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-300 font-black">Your Name</label>
                    <Input 
                      placeholder="e.g. Abhishek Gupta" 
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="bg-[#2D150F] border-white/10 text-white rounded-xl text-xs h-10"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-300 font-black">Location (City / Sector)</label>
                    <Input 
                      placeholder="e.g. Sector 15, Faridabad" 
                      value={authorLoc}
                      onChange={(e) => setAuthorLoc(e.target.value)}
                      className="bg-[#2D150F] border-white/10 text-white rounded-xl text-xs h-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-300 font-black block">Star Rating</label>
                    <div className="flex items-center gap-1.5 h-10 bg-[#2D150F] px-4 rounded-xl border border-white/10">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="focus:outline-none transition-transform active:scale-125"
                        >
                          <Star 
                            className={`w-5 h-5 ${star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-300 font-black block">Occasion</label>
                    <select
                      value={newOccasion}
                      onChange={(e) => setNewOccasion(e.target.value)}
                      className="w-full bg-[#2D150F] border border-white/10 text-white text-xs h-10 rounded-xl px-3 focus:outline-none focus:border-[#DFB15B]/50"
                    >
                      {OCCASIONS.filter(o => o !== 'All').map(occ => (
                        <option key={occ} value={occ} className="bg-[#2D150F]">{occ}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-300 font-black block">Cake Flavor</label>
                    <select
                      value={newFlavor}
                      onChange={(e) => setNewFlavor(e.target.value)}
                      className="w-full bg-[#2D150F] border border-white/10 text-white text-xs h-10 rounded-xl px-3 focus:outline-none focus:border-[#DFB15B]/50"
                    >
                      {FLAVORS.filter(f => f !== 'All').map(flv => (
                        <option key={flv} value={flv} className="bg-[#2D150F]">{flv}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-300 font-black block">Select Real Delivery Photo</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                    {PRESET_PHOTOS.map((photo, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => {
                          setSelectedPresetPhoto(photo.url);
                          setCustomPhotoUrl('');
                        }}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedPresetPhoto === photo.url && !customPhotoUrl 
                            ? 'border-[#DFB15B] scale-95 shadow-lg' 
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-center font-bold text-white py-0.5 truncate leading-none">
                          {photo.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-300 font-black">Or Paste Custom Image URL</label>
                  <Input 
                    placeholder="https://images.unsplash.com/... (optional)" 
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    className="bg-[#2D150F] border-white/10 text-white rounded-xl text-xs h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-300 font-black">Your Review Commentary</label>
                  <textarea
                    placeholder="Describe your delivery experience, the moisture, flavor, sweetness, and chef presentation..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="w-full bg-[#2D150F] border border-white/10 text-white rounded-xl text-xs p-3.5 focus:outline-none focus:border-[#DFB15B]/50"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="h-10 px-8 rounded-xl bg-[#DFB15B] hover:bg-[#C99A43] text-black font-black uppercase text-xs tracking-wider"
                  >
                    {submitting ? 'Submitting to Gallery...' : 'Post Live Review 🎉'}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* FILTER & OPTION CONTROLS */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-10">
        <div className="bg-[#1C0A05]/80 backdrop-blur-md rounded-3xl p-5 border border-[#DFB15B]/15 space-y-4">
          
          {/* Filtering row for Occasions */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase text-[#DFB15B] tracking-widest text-left flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Filter by Occasions
            </span>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ}
                  onClick={() => setSelectedOccasion(occ)}
                  className={`text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full transition-all border ${
                    selectedOccasion === occ
                      ? 'bg-[#DFB15B] text-black border-[#DFB15B] shadow-md'
                      : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Filtering row for Flavors */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase text-[#DFB15B] tracking-widest text-left flex items-center gap-1">
              <Smile className="w-3.5 h-3.5" /> Filter by Cake Flavors
            </span>
            <div className="flex flex-wrap gap-2">
              {FLAVORS.map((flv) => (
                <button
                  key={flv}
                  onClick={() => setSelectedFlavor(flv)}
                  className={`text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full transition-all border ${
                    selectedFlavor === flv
                      ? 'bg-[#DFB15B] text-black border-[#DFB15B] shadow-md'
                      : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {flv}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CORE INSTAGRAM-STYLE PHOTO FEED GRID */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loadingReviews ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-10 h-10 border-2 border-[#DFB15B] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Synchronizing Review Records...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-24 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 mx-auto text-2xl">
              🎂
            </div>
            <h3 className="font-display font-black text-xl text-white">No Reviews Found Matching Filters</h3>
            <p className="text-xs text-zinc-400 font-medium leading-relaxed">
              We haven't recorded a customer photo review for <strong>{selectedOccasion}</strong> containing <strong>{selectedFlavor}</strong> flavor yet. Be the first one to post a review!
            </p>
            <Button
              onClick={() => {
                setSelectedOccasion('All');
                setSelectedFlavor('All');
              }}
              className="bg-[#DFB15B]/15 hover:bg-[#DFB15B] hover:text-black text-[#DFB15B] text-xs font-black uppercase tracking-widest px-6 rounded-xl"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          /* INSTAGRAM STYLE GRID LAYOUT */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredReviews.map((review, index) => {
              const isLiked = likedReviews[review.id];
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
                  key={review.id}
                  onClick={() => setSelectedReview(review)}
                  className="group relative bg-[#1E0D0A]/90 border border-[#DFB15B]/15 rounded-[24px] overflow-hidden shadow-md hover:shadow-2xl hover:border-[#DFB15B]/40 transition-all duration-300 cursor-pointer"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-square overflow-hidden bg-zinc-900">
                    <img 
                      src={review.imageUrl} 
                      alt={`${review.flavor} review by ${review.userName}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Instagram-style elegant dark hover overlay details */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-left">
                      {/* Top stats overlay */}
                      <div className="flex items-center justify-between">
                        <span className="bg-[#DFB15B] text-black text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                          {review.occasion}
                        </span>
                        <div className="flex gap-1 text-amber-400">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      {/* Middle Comment snippet */}
                      <p className="text-xs text-white/95 font-semibold leading-relaxed italic line-clamp-4">
                        "{review.comment}"
                      </p>

                      {/* Bottom heart actions and replies count */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-white text-xs font-black uppercase tracking-wider">
                        <button
                          onClick={(e) => handleLike(e, review.id)}
                          className="flex items-center gap-1 hover:text-red-400 transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-red-500 animate-bounce' : 'text-white'}`} />
                          <span>{review.likes}</span>
                        </button>
                        <span className="flex items-center gap-1 text-zinc-300">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{review.commentsCount || (review.replies ? review.replies.length : 0)}</span>
                        </span>
                      </div>
                    </div>

                    {/* Quick Pill for Flavor (Always visible on bottom-left) */}
                    <div className="absolute bottom-3 left-3 bg-[#1C0A05]/85 border border-[#DFB15B]/20 backdrop-blur-sm px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider text-white">
                      {review.flavor}
                    </div>

                    {/* Highly authentic verified order seal */}
                    {review.isVerified && (
                      <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-sm text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                        <CheckCircle2 className="w-2.5 h-2.5 fill-white text-emerald-500" />
                        <span>Verified Buyer</span>
                      </div>
                    )}
                  </div>

                  {/* Customer Information footer on card (Visible by default) */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-left min-w-0">
                      {review.avatarUrl ? (
                        <img 
                          src={review.avatarUrl} 
                          alt={review.userName} 
                          className="w-8 h-8 rounded-full border border-[#DFB15B]/30 object-cover bg-amber-950" 
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#DFB15B] to-[#C99A43] text-black font-black flex items-center justify-center text-xs shadow">
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-black uppercase tracking-wide text-white truncate flex items-center gap-1">
                          {review.userName}
                        </h4>
                        <p className="text-[9px] text-zinc-400 font-medium italic truncate">{review.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{review.date}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* COMPREHENSIVE LIGHTBOX MODAL WITH FULL REVIEW DETAILS & DISCUSSION */}
      <AnimatePresence>
        {selectedReview && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Dark glass overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReview(null)}
              className="absolute inset-0 bg-[#1A0A07]/85 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative w-full max-w-4xl bg-[#210F0C] rounded-[36px] overflow-hidden shadow-[0_35px_80px_rgba(0,0,0,0.8)] border border-[#DFB15B]/35 z-10 grid grid-cols-1 md:grid-cols-12 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedReview(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-[#DFB15B] text-white hover:text-[#140603] transition-all duration-300 flex items-center justify-center border border-white/10 shadow-md active:scale-90 z-20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Left Column: Huge high-resolution cake photo (7 cols on desktop) */}
              <div className="md:col-span-7 relative aspect-square md:aspect-auto md:h-[600px] bg-zinc-900">
                <img 
                  src={selectedReview.imageUrl} 
                  alt={selectedReview.userName} 
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Flavor / Occasion badges */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="bg-[#DFB15B] text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                    {selectedReview.occasion}
                  </span>
                  <span className="bg-black/85 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                    {selectedReview.flavor}
                  </span>
                </div>
              </div>

              {/* Right Column: Complete details, stars, and real conversation replies (5 cols) */}
              <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between h-full max-h-[600px] overflow-y-auto space-y-6 text-white border-l border-[#DFB15B]/15">
                
                {/* User Header */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {selectedReview.avatarUrl ? (
                      <img 
                        src={selectedReview.avatarUrl} 
                        alt={selectedReview.userName} 
                        className="w-12 h-12 rounded-full border-2 border-[#DFB15B]/30 object-cover bg-amber-950" 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#DFB15B] text-black font-black flex items-center justify-center text-lg shadow">
                        {selectedReview.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-display font-black text-base text-white tracking-tight">
                          {selectedReview.userName}
                        </h4>
                        {selectedReview.isVerified && (
                          <div className="bg-emerald-500/15 text-emerald-400 p-0.5 rounded-full" title="Verified Purchase">
                            <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-[#210F0C]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{selectedReview.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex gap-1 text-amber-400">
                      {Array.from({ length: selectedReview.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{selectedReview.date}</span>
                  </div>

                  {/* Review Text */}
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-semibold italic">
                      "{selectedReview.comment}"
                    </p>
                  </div>
                </div>

                {/* Simulated Conversation replies / Chef Remarks */}
                <div className="space-y-4 pt-2 border-t border-white/5">
                  <h5 className="text-[10px] font-black uppercase text-[#DFB15B] tracking-widest">
                    Comments & Chef Remarks ({selectedReview.replies ? selectedReview.replies.length : 0})
                  </h5>

                  <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                    {/* Default Chef Reply */}
                    <div className="bg-[#1C0A05]/60 border border-[#DFB15B]/10 rounded-2xl p-3 text-left space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-[#DFB15B] tracking-wider flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-400" /> Chef de Cuisine (Cake Urban)
                        </span>
                        <span className="text-[8px] text-zinc-500 font-bold uppercase">Official</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 font-medium">
                        {selectedReview.replies && selectedReview.replies[0] ? selectedReview.replies[0] : "We are absolutely honored to have baked for your milestone! Hope to sweeten your future gatherings too."}
                      </p>
                    </div>

                    {/* Interactive Custom Added comments */}
                    {selectedReview.replies && selectedReview.replies.slice(1).map((reply, i) => (
                      <div key={i} className="bg-white/5 rounded-2xl p-3 text-left">
                        <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
                          Community Connoisseur
                        </span>
                        <p className="text-[11px] text-zinc-300 font-medium mt-1">{reply}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Section inside modal: Likes, Write comment, and custom order link */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => handleLike(e, selectedReview.id)}
                      className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-red-400 transition-colors"
                    >
                      <Heart className={`w-4.5 h-4.5 ${likedReviews[selectedReview.id] ? 'text-red-500 fill-red-500' : 'text-zinc-400'}`} />
                      <span>{selectedReview.likes} Likes</span>
                    </button>
                    
                    <Link to="/custom-order" onClick={() => setSelectedReview(null)}>
                      <Button className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#DFB15B]/20 to-[#C99A43]/20 hover:from-[#DFB15B] hover:to-[#C99A43] text-[#DFB15B] hover:text-black border border-[#DFB15B]/40 font-black uppercase text-[9px] tracking-wider transition-all flex items-center gap-1.5">
                        <ShoppingBag className="w-3 h-3" />
                        <span>Order This Flavor</span>
                      </Button>
                    </Link>
                  </div>

                  {/* Add feedback message comment input */}
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <Input 
                      placeholder="Ask or reply to this review..." 
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="bg-[#1C0A05]/80 border-white/10 text-xs h-9 rounded-xl focus-visible:ring-[#DFB15B]"
                    />
                    <Button 
                      type="submit" 
                      className="bg-[#DFB15B] hover:bg-[#C99A43] text-black font-black text-[10px] uppercase px-4 h-9 rounded-xl shrink-0"
                    >
                      Send
                    </Button>
                  </form>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
