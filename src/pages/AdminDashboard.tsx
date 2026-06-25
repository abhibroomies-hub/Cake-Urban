import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { 
  collection, getDocs, updateDoc, doc, query, orderBy, addDoc, deleteDoc 
} from 'firebase/firestore';
import { Order, Product, Review } from '../types';
import { useAuth } from '../hooks/useAuth';
import { handleFirestoreError, OperationType } from '../lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  LayoutDashboard, ShoppingBag, Package, TrendingUp, DollarSign, 
  Clock, CheckCircle, Truck, MoreHorizontal, MoreVertical, Sparkles, UploadCloud, 
  Search, Tag, Copy, Check, Instagram, Share2, FileText, 
  CheckCircle2, AlertCircle, ArrowLeft, Check as CheckIcon, Loader2,
  Trash2, Star, Eye, Calendar, User, Mail, Plus, ToggleLeft, ToggleRight,
  Sparkle, Award, MessageSquare, Coffee, Trash, Phone
} from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import SEO from '../components/SEO';
import { FALLBACK_PRODUCTS } from '../lib/fallbackProducts';

const MOCK_ORDERS: Order[] = [
  {
    id: "ord-91823",
    userId: "local_user_abhi",
    guestEmail: "abhibroomies@gmail.com",
    items: [
      {
        id: "p1",
        name: "Premium Belgian Truffle Cake",
        description: "Rich, dense eggless sponge packed with gourmet single-origin chocolate ganache.",
        price: 1850,
        categories: ["Cakes"],
        occasions: ["Birthday", "Anniversary"],
        flavors: ["Chocolate"],
        images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600"],
        stockStatus: "in-stock",
        isCustomizable: true,
        quantity: 1,
        selectedWeight: 1,
        selectedFlavor: "Belgian Chocolate",
        cakeMessage: "Happy Birthday Abhi!",
        eggless: true
      }
    ],
    total: 1850,
    status: "baking",
    paymentStatus: "paid",
    shippingAddress: {
      id: "addr1",
      type: "home",
      line1: "House 24, Cyber City Phase 2",
      sector: "Sector 24",
      city: "Gurugram",
      pincode: "122002"
    },
    deliveryDate: "2026-06-06",
    deliverySlot: "12:00 PM - 03:00 PM",
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: "ord-88392",
    userId: "local_user_riya",
    guestEmail: "riya.sen@outlook.com",
    items: [
      {
        id: "p2",
        name: "Rose Gold Fondant Wedding Tier",
        description: "An elegant master-curated 2-tier wedding masterpiece.",
        price: 5400,
        categories: ["Custom Cakes", "Cakes"],
        occasions: ["Wedding", "Anniversary"],
        flavors: ["Vanilla"],
        images: ["https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=600"],
        stockStatus: "in-stock",
        isCustomizable: true,
        quantity: 1,
        selectedWeight: 2,
        selectedFlavor: "Vanilla Rose",
        cakeMessage: "Riya & Dev",
        eggless: true
      }
    ],
    total: 5400,
    status: "new",
    paymentStatus: "pending",
    shippingAddress: {
      id: "addr2",
      type: "home",
      line1: "Apartment 512, DLF Phase 5",
      sector: "Sector 43",
      city: "Gurugram",
      pincode: "122009"
    },
    deliveryDate: "2026-06-10",
    deliverySlot: "04:00 PM - 07:00 PM",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    productId: "p1",
    userId: "u1",
    userName: "Simranjeet Singh",
    rating: 5,
    comment: "Absolutely breathtaking! The Belgian chocolate ganache was so smooth.",
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: "rev-2",
    productId: "p2",
    userId: "u2",
    userName: "Dr. Ananya Roy",
    rating: 5,
    comment: "Best customized designer cake in Delhi NCR. Highly professional service and timely delivery.",
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  }
];

const MOCK_CUSTOM_INQUIRIES: CustomOrderInquiry[] = [
  {
    id: "inq-2910a",
    flavor: "Belgian White Truffle with Strawberry Compote",
    shape: "Round Tiereded",
    tiers: "3 Tiers",
    icingColor: "Pastel Pink & Gold Accents",
    cakeMessage: "Dev & Riya Engagement",
    contactName: "Abhi",
    contactEmail: "abhibroomies@gmail.com",
    eventDate: "2026-06-15",
    status: "in-discussion",
    createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
  },
  {
    id: "inq-5129b",
    flavor: "Blueberry Lavender Creme",
    shape: "Square Cyberpunk Hexagon",
    tiers: "1 Tier Large",
    icingColor: "Dark Navy Blue & Neon Cyan Glaze",
    cakeMessage: "Futuristic Glitch Party 2026",
    contactName: "Sanya Roy",
    contactEmail: "sanya.roy@gmail.com",
    eventDate: "2026-06-25",
    status: "approved",
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  }
];

interface CustomOrderInquiry {
  id: string;
  flavor: string;
  shape: string;
  tiers: string;
  icingColor: string;
  cakeMessage: string;
  referenceImages?: string[];
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  eventDate: string;
  status: string;
  createdAt: any;
}

interface SeoResult {
  productName: string;
  seoTitle: string;
  slug: string;
  suggestedFilename: string;
  altText: string;
  metaDescription: string;
  keywords: string[];
  structuredSchema: string;
  instagramCaption: string;
  pinterestPin: {
    title: string;
    description: string;
  };
}

export default function AdminDashboard() {
  const { user, profile, isAdmin } = useAuth();
  
  // Dynamic Chart points from Orders
  const generateChartPath = () => {
    if (orders.length === 0) return "M0 150 L500 150";

    // Sort orders by date
    const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // We want 8 data points, bin the orders
    const bins = Array(8).fill(0);
    const minTime = new Date(sortedOrders[0].createdAt).getTime();
    const maxTime = new Date(sortedOrders[sortedOrders.length - 1].createdAt).getTime();

    let timeRange = maxTime - minTime;
    if (timeRange === 0) timeRange = 1000; // avoid divide by zero

    sortedOrders.forEach(o => {
       const t = new Date(o.createdAt).getTime();
       const normalized = (t - minTime) / timeRange; // 0 to 1
       let binIndex = Math.floor(normalized * 8);
       if (binIndex >= 8) binIndex = 7;
       bins[binIndex] += o.total;
    });

    // Normalize bins to height 0 - 100 (y will be 150 - 50 to 150 - 130)
    const maxVal = Math.max(...bins, 1);

    // Generate SVG path string. Width is 500, Height is 150.
    let path = "M0 150";
    const stepX = 500 / 7;
    bins.forEach((val, i) => {
       const x = Math.round(i * stepX);
       const y = Math.round(150 - ((val / maxVal) * 100));
       path += ` L${x} ${y}`;
    });

    return path;
  };

  const dynamicPath = generateChartPath();
  const filledDynamicPath = dynamicPath + " L500 150 Z";

  // Dashboard Core States
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customInquiries, setCustomInquiries] = useState<CustomOrderInquiry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Product form states
  const [activeTab, setActiveTab] = useState<string>('insights');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newProductImage, setNewProductImage] = useState<string | null>(null);
  const [newProductMimeType, setNewProductMimeType] = useState<string>('image/jpeg');
  
  // Quick AI Generation States
  const [aiPrompt, setAiPrompt] = useState('');
  const [specsGenerating, setSpecsGenerating] = useState(false);
  const [aiOptimizing, setAiOptimizing] = useState(false);
  const [aiStepIndex, setAiStepIndex] = useState(0);

  // Form Fields
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodCategories, setProdCategories] = useState('Cakes, Custom Cakes');
  const [prodFlavors, setProdFlavors] = useState('Belgian Chocolate');
  const [prodOccasions, setProdOccasions] = useState('Anniversary, Birthday');
  const [prodStock, setProdStock] = useState<'in-stock' | 'out-of-stock'>('in-stock');
  const [prodCustomizable, setProdCustomizable] = useState(true);

  // New Structured Fields for Added Usability (User Intent)
  const [selectedCategory, setSelectedCategory] = useState('Cakes');
  const [selectedCakeType, setSelectedCakeType] = useState('Eggless');
  const [selectedWeights, setSelectedWeights] = useState<number[]>([0.5, 1, 2]);
  const [imageUrlMode, setImageUrlMode] = useState<'upload' | 'url'>('upload');
  const [pastedImageUrl, setPastedImageUrl] = useState('');

  // Enhanced AI SEO Fields (Autofilled by AI image SEO or Prompt generator)
  const [prodSeoTitle, setProdSeoTitle] = useState('');
  const [prodSeoSlug, setProdSeoSlug] = useState('');
  const [prodSeoKeywords, setProdSeoKeywords] = useState<string[]>([]);
  const [prodSeoMetaDescription, setProdSeoMetaDescription] = useState('');
  const [prodSeoAlt, setProdSeoAlt] = useState('');
  const [prodSeoSchema, setProdSeoSchema] = useState('');
  const [prodInstagram, setProdInstagram] = useState('');
  const [prodPinterestTitle, setProdPinterestTitle] = useState('');
  const [prodPinterestDesc, setProdPinterestDesc] = useState('');

  // Editing utilities and Full Replacement Editor States
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPriceValue, setTempPriceValue] = useState<string>('');

  // Full item editing overlay states (allows changing/replacing everything)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdPrice, setEditProdPrice] = useState('');
  const [editProdDescription, setEditProdDescription] = useState('');
  const [editProdCategories, setEditProdCategories] = useState('');
  const [editProdFlavors, setEditProdFlavors] = useState('');
  const [editProdOccasions, setEditProdOccasions] = useState('');
  const [editProdStock, setEditProdStock] = useState<'in-stock' | 'out-of-stock'>('in-stock');
  const [editProdCustomizable, setEditProdCustomizable] = useState(true);
  const [editSelectedWeights, setEditSelectedWeights] = useState<number[]>([0.5, 1, 2]);
  const [editCakeType, setEditCakeType] = useState('Eggless');
  const [editSelectedCategory, setEditSelectedCategory] = useState('Cakes');
  const [editImageUrlMode, setEditImageUrlMode] = useState<'upload' | 'url'>('url');
  const [editPastedImageUrl, setEditPastedImageUrl] = useState('');
  const [editProductImage, setEditProductImage] = useState<string | null>(null);

  // SEO Editing states
  const [editProdSeoTitle, setEditProdSeoTitle] = useState('');
  const [editProdSeoSlug, setEditProdSeoSlug] = useState('');
  const [editProdSeoKeywords, setEditProdSeoKeywords] = useState<string[]>([]);
  const [editProdSeoMetaDescription, setEditProdSeoMetaDescription] = useState('');
  const [editProdSeoAlt, setEditProdSeoAlt] = useState('');
  const [editProdSeoSchema, setEditProdSeoSchema] = useState('');
  const [editProdInstagram, setEditProdInstagram] = useState('');
  const [editProdPinterestTitle, setEditProdPinterestTitle] = useState('');
  const [editProdPinterestDesc, setEditProdPinterestDesc] = useState('');

  const aiSteps = [
    "Analyzing cake design spectrum, colors & textures...",
    "Correlating optimal Delhi NCR local search parameters...",
    "Generating metadata, high-CTR titles & alt tags...",
    "Formulating matching Rich Schema.org structures...",
    "Composing luxury social-referral descriptions..."
  ];

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Orders with safe fallback
      let ordersList: Order[] = [];
      try {
        const ordersSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
        ordersList = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      } catch (err) {
        console.warn("Failed to fetch live orders, using fallback", err);
      }
      if (ordersList.length === 0) {
        ordersList = MOCK_ORDERS;
      }
      setOrders(ordersList);

      // 2. Fetch Products with safe fallback
      let productsList: Product[] = [];
      try {
        const productsSnap = await getDocs(collection(db, 'products'));
        productsList = productsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      } catch (err) {
        console.warn("Failed to fetch live products, using fallback", err);
      }
      if (productsList.length === 0) {
        productsList = FALLBACK_PRODUCTS;
      }
      setProducts(productsList);

      // 3. Fetch Custom Inquiries with safe fallback
      let customList: any[] = [];
      try {
        const customSnap = await getDocs(query(collection(db, 'custom_orders'), orderBy('createdAt', 'desc')));
        customList = customSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      } catch (err) {
        console.warn("Failed to fetch live custom orders, using fallback", err);
      }
      if (customList.length === 0) {
        customList = MOCK_CUSTOM_INQUIRIES;
      }
      setCustomInquiries(customList);

      // 4. Fetch Reviews with safe fallback
      let reviewsList: Review[] = [];
      try {
        const reviewsSnap = await getDocs(collection(db, 'reviews'));
        reviewsList = reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Review));
      } catch (err) {
        console.warn("Failed to fetch live reviews, using fallback", err);
      }
      if (reviewsList.length === 0) {
        reviewsList = MOCK_REVIEWS;
      }
      setReviews(reviewsList);

    } catch (globalErr) {
      console.error("Critical error in secondary data fetch dispatcher", globalErr);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  // Block unauthorized users immediately
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-6 py-32 text-center min-h-[500px] flex flex-col items-center justify-center space-y-6">
        <AlertCircle className="w-16 h-16 text-rose-500 animate-pulse" />
        <h2 className="text-3xl font-display font-black text-white">Access Restricted</h2>
        <p className="text-sm text-[#FFFDFB]/60 max-w-sm font-medium italic">
          This administration dashboard is restricted exclusively to the head curator at <span className="font-bold text-[#DFB15B]">abhibroomies@gmail.com</span>. Please authenticate using the correct credential secure vault.
        </p>
      </div>
    );
  }

  // Update order status
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const path = `orders/${orderId}`;
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      toast.success(`Order status advanced to "${status}"`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  // Delete product
  const handleDeleteProduct = async (prodId: string) => {
    const path = `products/${prodId}`;
    if (!window.confirm("Are you absolutely sure you want to remove this culinary creation from the boutique?")) return;
    try {
      await deleteDoc(doc(db, 'products', prodId));
      setProducts(products.filter(p => p.id !== prodId));
      toast.success("Culinary creation archived and removed.");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  // Toggle stock availability
  const handleToggleStock = async (prodId: string, currentStock: string) => {
    const nextStock = currentStock === 'in-stock' ? 'out-of-stock' : 'in-stock';
    try {
      await updateDoc(doc(db, 'products', prodId), { stockStatus: nextStock });
      setProducts(products.map(p => p.id === prodId ? { ...p, stockStatus: nextStock as any } : p));
      toast.success(`Availability changed to ${nextStock.replace('-', ' ')}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update availability status.");
    }
  };

  // Batch fast updates for Price
  const handleSavePrice = async (prodId: string) => {
    const val = parseFloat(tempPriceValue);
    if (isNaN(val) || val <= 0) {
      toast.error("Set a valid numeric price greater than zero.");
      return;
    }
    try {
      await updateDoc(doc(db, 'products', prodId), { price: val });
      setProducts(products.map(p => p.id === prodId ? { ...p, price: val } : p));
      setEditingPriceId(null);
      toast.success("Boutique catalog pricing adjusted live!");
    } catch (error) {
      console.error(error);
      toast.error("Could not update price.");
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Moderate and permanently delete this customer review?")) return;
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      setReviews(reviews.filter(r => r.id !== reviewId));
      toast.success("Guest critique purged successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete review.");
    }
  };

  // Delete custom inquiry
  const handleDeleteInquiry = async (inqId: string) => {
    if (!window.confirm("Archive this custom cake inquiry design?")) return;
    try {
      await deleteDoc(doc(db, 'custom_orders', inqId));
      setCustomInquiries(customInquiries.filter(i => i.id !== inqId));
      toast.success("Inquiry archived from active registry.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to archiving inquiry design.");
    }
  };

  // Preset quick templates
  const applyPresetConfig = (type: string) => {
    switch (type) {
      case 'belgian-truffle':
        setProdName("Belgian Dark Truffle Luxury Cake");
        setProdPrice("1499");
        setProdDescription("Decadent Belgian 70% dark chocolate mousse layers bound with rich ganache, metallic cocoa sprinkles and glazed artisanal cherries.");
        setProdCategories("Cakes, Chocolate Cakes, Luxury Line");
        setProdFlavors("Belgian Dark Chocolate, Truffle fudge");
        setProdOccasions("Birthday, Celebration, Anniversary");
        setProdSeoTitle("Order Belgian Dark Truffle Luxury Cake Online Delhi NCR");
        setProdSeoSlug("belgian-dark-truffle-luxury-cake");
        setProdSeoAlt("Elegant dark chocolate truffle cake topped with hand-rolled chocolates and shimmering gold dust.");
        setProdSeoMetaDescription("Buy Belgian Dark Truffle Luxury Cake online in South Delhi & Faridabad. 70% cacao richness, baked same-day. Indulge in sheer Parisian gold class.");
        setProdSeoKeywords(['dark truffle cake faridabad', 'luxury chocolate cake delhi', 'belgian fudge cake delivery']);
        break;
      case 'royal-gold':
        setProdName("Royal Gold Fondant Vanilla Cake");
        setProdPrice("2299");
        setProdDescription("Madagascar orchid vanilla beans folded with golden sponge layers, rich butter cream frosting and edible 24k gold flakes on a sleek minimal pillar.");
        setProdCategories("Cakes, Custom Cakes, Wedding Tiers");
        setProdFlavors("Madagascar Orchid Vanilla, White Mousse");
        setProdOccasions("Anniversary, Wedding, Engagement");
        setProdSeoTitle("Royal Gold Fondant Wedding Cake Delivery - Cake Urban");
        setProdSeoSlug("royal-gold-fondant-vanilla-cake");
        setProdSeoAlt("Charming custom ivory vanilla fondant cake styled with elegant edible gold foil and architectural columns.");
        setProdSeoMetaDescription("Commemorate with our Royal Gold Vanilla Wedding Cake. Custom design available, delivered in refrigerated pristine condition across Delhi NCR.");
        setProdSeoKeywords(['gold wedding cake delhi', 'premium anniversary cake model', 'ivory custom cake south delhi']);
        break;
      case 'velvet-heart':
        setProdName("Red Velvet Rose Gold Heart Cake");
        setProdPrice("1299");
        setProdDescription("Traditional velvet cocoa sponge core infused with natural beetroot nectar and sandwiched between indulgent rich cream cheese layers.");
        setProdCategories("Cakes, Valentine Special, Heart Cakes");
        setProdFlavors("Classic Velvet, Swiss Cream Cheese");
        setProdOccasions("Anniversary, Valentine, Date Night");
        setProdSeoTitle("Buy Red Velvet Rose Gold Heart Cake Online - Cake Urban");
        setProdSeoSlug("red-velvet-rose-gold-heart-cake");
        setProdSeoAlt("Heart-shaped pristine red velvet cake layered in rose gold decorative petals and buttery smooth frostings.");
        setProdSeoMetaDescription("Order heart shaped Red Velvet Rose Gold luxury cake online. Perfect for anniversaries and romantic dates in Delhi, Faridabad & Gurgaon.");
        setProdSeoKeywords(['red velvet heart cake delivery', 'best anniversary cake model faridabad', 'romantic cakes delhi']);
        break;
    }
    toast.success("Boutique preset loaded! Feel free to modify before deploying.");
  };

  // AI Spec sheets Generator (Prompt-to-Form)
  const triggerTextSpecsAi = async (forEditing: boolean = false, customPrompt?: string) => {
    const promptToSend = customPrompt || aiPrompt;
    if (!promptToSend.trim()) {
      toast.error("Type in a cake concept or descriptor first! (e.g., '2 tier chocolate berry cake')");
      return;
    }

    setSpecsGenerating(true);
    try {
      const response = await fetch('/api/seo/generate-specs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToSend })
      });

      if (!response.ok) {
        throw new Error("Gemini registry error. Check backend server.");
      }

      const specs = await response.json();
      
      // Auto fill!
      if (forEditing) {
        setEditProdName(specs.productName || editProdName || '');
        setEditProdPrice(specs.price ? specs.price.toString() : '1499');
        setEditProdDescription(specs.description || '');
        setEditProdCategories(specs.categories || 'Cakes, Custom Cakes');
        setEditProdFlavors(specs.flavors || 'Chocolate');
        setEditProdOccasions(specs.occasions || 'Anniversary');
        setEditProdSeoTitle(specs.seoTitle || '');
        setEditProdSeoSlug(specs.slug || '');
        setEditProdSeoAlt(specs.altText || '');
        setEditProdSeoMetaDescription(specs.metaDescription || '');
        setEditProdSeoKeywords(specs.keywords || []);
        setEditProdSeoSchema(specs.structuredSchema || '');
        setEditProdInstagram(specs.instagramCaption || '');
        setEditProdPinterestTitle(specs.pinterestPin?.title || '');
        setEditProdPinterestDesc(specs.pinterestPin?.description || '');
      } else {
        setProdName(specs.productName || prodName || '');
        setProdPrice(specs.price ? specs.price.toString() : '1499');
        setProdDescription(specs.description || '');
        setProdCategories(specs.categories || 'Cakes, Custom Cakes');
        setProdFlavors(specs.flavors || 'Chocolate');
        setProdOccasions(specs.occasions || 'Anniversary');
        setProdSeoTitle(specs.seoTitle || '');
        setProdSeoSlug(specs.slug || '');
        setProdSeoAlt(specs.altText || '');
        setProdSeoMetaDescription(specs.metaDescription || '');
        setProdSeoKeywords(specs.keywords || []);
        setProdSeoSchema(specs.structuredSchema || '');
        setProdInstagram(specs.instagramCaption || '');
        setProdPinterestTitle(specs.pinterestPin?.title || '');
        setProdPinterestDesc(specs.pinterestPin?.description || '');
      }

      toast.success("🪄 AI Copilot has drafted complete specifications!");
    } catch (error: any) {
      console.error(error);
      toast.error("AI Spec draft failed. Ensure your server is active.");
    } finally {
      setSpecsGenerating(false);
    }
  };

  // Image scanning logic
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Supported formats include JPEG, PNG, or HEIC only.');
      return;
    }

    setNewProductMimeType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      setNewProductImage(reader.result as string);
      toast.success('Image loaded successfully. Ready for AI scanning!');
    };
    reader.readAsDataURL(file);
  };

  const triggerAiSeoOptimization = async () => {
    if (!newProductImage) {
      toast.error('First upload a reference image to trigger AI scan.');
      return;
    }

    setAiOptimizing(true);
    setAiStepIndex(0);

    const stepInterval = setInterval(() => {
      setAiStepIndex((prev) => (prev < aiSteps.length - 1 ? prev + 1 : prev));
    }, 1000);

    try {
      const response = await fetch('/api/seo/optimize-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: newProductImage,
          mimeType: newProductMimeType
        })
      });

      if (!response.ok) {
        throw new Error('Image parsing failed on AI pipeline.');
      }

      const info: SeoResult = await response.json();
      
      // Auto-populate fields
      setProdName(info.productName);
      setProdDescription(`${info.metaDescription}`);
      setProdSeoTitle(info.seoTitle);
      setProdSeoSlug(info.slug);
      setProdSeoAlt(info.altText);
      setProdSeoMetaDescription(info.metaDescription);
      setProdSeoKeywords(info.keywords);
      setProdSeoSchema(info.structuredSchema);
      setProdInstagram(info.instagramCaption);
      setProdPinterestTitle(info.pinterestPin.title);
      setProdPinterestDesc(info.pinterestPin.description);

      if (!prodPrice) {
        setProdPrice("1499");
      }

      toast.success('AI Image SEO scan auto-filled form details!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error occurred while scanning image.');
    } finally {
      clearInterval(stepInterval);
      setAiOptimizing(false);
    }
  };

  // Initiate edit Mode and load all values
  const initiateProductEdit = (p: Product) => {
    setEditingProduct(p);
    setEditProdName(p.name || '');
    setEditProdPrice(p.price?.toString() || '');
    setEditProdDescription(p.description || '');
    
    // Join other categories excluding the primary selectedCategory
    const primaryCat = p.categories?.[0] || 'Cakes';
    setEditSelectedCategory(primaryCat);
    const otherCats = p.categories ? p.categories.slice(1).join(', ') : '';
    setEditProdCategories(otherCats || p.categories?.join(', ') || 'Cakes');

    setEditProdFlavors(p.flavors?.join(', ') || 'Belgian Chocolate');
    setEditProdOccasions(p.occasions?.join(', ') || 'Birthday, Anniversary');
    setEditProdStock(p.stockStatus || 'in-stock');
    setEditProdCustomizable(p.isCustomizable !== false);
    
    setEditSelectedWeights(p.weights || [0.5, 1, 2]);
    setEditCakeType(p.dietary?.[0] || 'Eggless');

    // Detect if image is URL or upload base64
    const imgUrl = p.images?.[0] || '';
    if (imgUrl.startsWith('data:image') || imgUrl.length > 2000) {
      setEditImageUrlMode('upload');
      setEditProductImage(imgUrl);
      setEditPastedImageUrl('');
    } else {
      setEditImageUrlMode('url');
      setEditPastedImageUrl(imgUrl);
      setEditProductImage(null);
    }

    setEditProdSeoTitle(p.seoTitle || '');
    setEditProdSeoSlug(p.seoSlug || '');
    setEditProdSeoKeywords(p.seoKeywords || []);
    setEditProdSeoMetaDescription(p.seoMetaDescription || '');
    setEditProdSeoAlt(p.seoMetaDescription || ''); // Alt tag
    setEditProdSeoSchema(p.seoSchema || '');
    setEditProdInstagram(p.instagramCaption || '');
    setEditProdPinterestTitle(p.pinterestPin?.title || '');
    setEditProdPinterestDesc(p.pinterestPin?.description || '');
    
    setActiveTab('edit-product'); // Focus on edit tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit complete edit update
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editProdName || !editProdPrice) {
      toast.error('Gourmet name and INR price values are required.');
      return;
    }

    const finalImage = editImageUrlMode === 'url' ? editPastedImageUrl : editProductImage;
    if (!finalImage) {
      toast.error('An image URL or reference file is required.');
      return;
    }

    try {
      const finalPrice = parseFloat(editProdPrice);
      const mergedCategories = [editSelectedCategory, ...editProdCategories.split(',').map(c => c.trim()).filter(c => c && c !== editSelectedCategory)];

      const updateData: Partial<Product> = {
        name: editProdName,
        description: editProdDescription,
        price: finalPrice,
        categories: mergedCategories,
        flavors: editProdFlavors.split(',').map(f => f.trim()).filter(Boolean),
        occasions: editProdOccasions.split(',').map(o => o.trim()).filter(Boolean),
        images: [finalImage],
        stockStatus: editProdStock,
        isCustomizable: editProdCustomizable,
        weights: editSelectedWeights,
        dietary: [editCakeType],
        seoTitle: editProdSeoTitle || `${editProdName} - Cake Urban`,
        seoSlug: editProdSeoSlug || editProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        seoKeywords: editProdSeoKeywords.length ? editProdSeoKeywords : [editProdName.toLowerCase()],
        seoMetaDescription: editProdSeoMetaDescription || editProdDescription,
        seoSchema: editProdSeoSchema || '',
        instagramCaption: editProdInstagram || '',
        pinterestPin: {
          title: editProdPinterestTitle || editProdName,
          description: editProdPinterestDesc || editProdDescription
        }
      };

      await updateDoc(doc(db, 'products', editingProduct.id), updateData);
      toast.success('Gourmet Confection updated live in our catalog!');
      setEditingProduct(null);
      setActiveTab('products'); // return to catalog list!

      // Refresh catalog list
      const productsSnap = await getDocs(collection(db, 'products'));
      setProducts(productsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during confection update.');
    }
  };

  // Submit complete product
  const handlePublishProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice) {
      toast.error('Provide Cake Name and Price values to deploy confections.');
      return;
    }

    const finalImage = imageUrlMode === 'url' ? pastedImageUrl : newProductImage;
    if (!finalImage) {
      toast.error('Please upload an image reference or provide a direct image link URL.');
      return;
    }

    try {
      const finalPrice = parseFloat(prodPrice);
      const mergedCategories = [selectedCategory, ...prodCategories.split(',').map(c => c.trim()).filter(c => c && c !== selectedCategory)];

      await addDoc(collection(db, 'products'), {
        name: prodName,
        description: prodDescription,
        price: finalPrice,
        categories: mergedCategories,
        flavors: prodFlavors.split(',').map(f => f.trim()).filter(Boolean),
        occasions: prodOccasions.split(',').map(o => o.trim()).filter(Boolean),
        images: [finalImage],
        stockStatus: prodStock,
        isCustomizable: prodCustomizable,
        weights: selectedWeights,
        dietary: [selectedCakeType],
        seoTitle: prodSeoTitle || `${prodName} - Cake Urban`,
        seoSlug: prodSeoSlug || prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        seoKeywords: prodSeoKeywords.length ? prodSeoKeywords : [prodName.toLowerCase()],
        seoMetaDescription: prodSeoMetaDescription || prodDescription,
        seoSchema: prodSeoSchema || '',
        instagramCaption: prodInstagram || '',
        pinterestPin: {
          title: prodPinterestTitle || prodName,
          description: prodPinterestDesc || prodDescription
        },
        createdAt: new Date().toISOString()
      });

      toast.success('Gourmet Masterpiece deployed live to boutique Catalog!');
      
      // Reset forms
      setProdName('');
      setProdPrice('');
      setProdDescription('');
      setNewProductImage(null);
      setPastedImageUrl('');
      setSelectedCategory('Cakes');
      setSelectedCakeType('Eggless');
      setSelectedWeights([0.5, 1, 2]);
      setProdSeoTitle('');
      setProdSeoSlug('');
      setProdSeoAlt('');
      setProdSeoMetaDescription('');
      setProdSeoKeywords([]);
      setProdSeoSchema('');
      setProdInstagram('');
      setProdPinterestTitle('');
      setProdPinterestDesc('');
      setAiPrompt('');
      setActiveTab('products'); // Return to catalog list!

      // Refresh catalog list
      const productsSnap = await getDocs(collection(db, 'products'));
      setProducts(productsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while publishing creation.');
    }
  };

  // Calculations for Performance Tab
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + o.total, 0);
  const avgOrderValue = orders.length ? Math.round(totalRevenue / orders.length) : 0;
  const activeBakesCount = orders.filter(o => o.status === 'baking' || o.status === 'new').length;
  const avgCritiqueRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "4.9";

  const navigationTabs = [
    { value: 'insights', label: 'Performance', icon: LayoutDashboard },
    { value: 'orders', label: `active Reservations (${orders.length})`, icon: Clock },
    { value: 'inquiries', label: `Builder Inquiries (${customInquiries.length})`, icon: Sparkles },
    { value: 'products', label: `Boutique Inventory (${products.length})`, icon: Package },
    { value: 'add-product', label: 'Add New Item', icon: Plus },
    { value: 'reviews', label: `Feedback Studio (${reviews.length})`, icon: MessageSquare },
    ...(editingProduct ? [{ value: 'edit-product', label: `Edit: ${editingProduct.name.substring(0, 15)}...`, icon: FileText }] : [])
  ];

  const currentTabInfo = navigationTabs.find(t => t.value === activeTab) || navigationTabs[0];
  const CurrentTabIcon = currentTabInfo.icon;

  return (
    <div className="container mx-auto px-6 md:px-10 py-12 md:py-24 min-h-screen bg-transparent text-white font-sans selection:bg-[#DFB15B]/30 select-none">
      
      <SEO 
        title="Admin Atelier Panel - Cake Urban"
        description="Core control database panel for Cake Urban curators."
      />

      {/* HEADER BANNER */}
      <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-10 mb-16 md:mb-20">
        <div className="space-y-4 text-center lg:text-left w-full lg:w-auto">
            <div className="inline-block bg-[#DFB15B]/10 text-[#DFB15B] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-1 border border-[#DFB15B]/20">
              Curator Station
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter leading-none">
              Artisan <span className="italic font-serif font-light text-[#DFB15B]">Control Panel.</span>
            </h1>
            <p className="text-xs text-[#FFFDFB]/60 max-w-xl font-medium italic mt-1 leading-relaxed">
              Boutique Supervisor portal. Manage active baking queues, moderate feedback, and utilize the advanced Gemini AI Text Spec Builder to instant draft creations.
            </p>
        </div>

        {activeTab !== 'add-product' && activeTab !== 'edit-product' ? (
          <Button 
            onClick={() => setActiveTab('add-product')}
            className="w-full lg:w-auto rounded-[20px] h-14 px-8 bg-[#DFB15B] hover:bg-white text-[#140603] text-[10px] font-black uppercase tracking-[0.2em] gap-3 shadow-[0_4px_25px_rgba(223,177,91,0.25)] transition-all cursor-pointer grow-0 shrink-0"
          >
            <Sparkles className="w-4 h-4 animate-pulse text-[#140603]" /> Add New Cake
          </Button>
        ) : (
          <Button 
            onClick={() => {
              setEditingProduct(null);
              setActiveTab('products');
            }}
            variant="outline"
            className="w-full lg:w-auto rounded-[20px] h-14 px-8 border-white/10 text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] gap-2 cursor-pointer grow-0 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Operations
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:grid lg:grid-cols-12 lg:gap-10 lg:items-start">
          
          {/* DESKTOP STABLE LEFT SIDEBAR */}
          <TabsList className="hidden lg:flex lg:col-span-3 flex-col gap-6 sticky top-28 bg-[#2C130E]/90 backdrop-blur-xl border border-[#DFB15B]/20 rounded-[32px] p-6 shadow-2xl z-20 text-left h-auto w-full items-start">
            <div className="space-y-1 w-full pb-2 select-none border-b border-white/5">
              <div className="inline-block bg-[#DFB15B]/10 text-[#DFB15B] px-2.5 py-0.5 rounded-full text-[8.5px] font-black tracking-[0.2em] uppercase mb-1 border border-[#DFB15B]/15">
                Atelier System
              </div>
              <h3 className="text-xl font-display font-black text-white tracking-tight leading-none pt-0.5">Control Panel</h3>
              <p className="text-[10px] text-[#FFFDFB]/40 font-semibold italic pt-1 leading-normal">Cake Urban Boutiques</p>
            </div>

            <div className="flex flex-col gap-2 w-full">
              {navigationTabs.map(tab => {
                const TabIcon = tab.icon;
                const isSelected = activeTab === tab.value;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={`w-full justify-start rounded-2xl px-5 py-4 font-black text-[10px] uppercase tracking-wider transition-all duration-300 flex items-center gap-3 whitespace-nowrap data-[state=active]:bg-[#DFB15B] data-[state=active]:text-[#140603] data-[state=active]:shadow-lg ${
                      isSelected ? 'bg-[#DFB15B] text-[#140603]' : 'text-white/70 hover:text-white hover:bg-white/5 bg-transparent shadow-none border-0'
                    }`}
                  >
                    <TabIcon className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? 'text-[#140603]' : 'text-[#DFB15B]'}`} />
                    <span className="truncate">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </div>
          </TabsList>

          {/* DYNAMIC CONTENT AREA FOR THE CORRESPONDING ACTIVE TABS */}
          <div className="col-span-12 lg:col-span-9 w-full relative">
            
            {/* MOBILE COMPACT 3-DOT DROPDOWN SWITCHER BAR */}
            <div className="lg:hidden w-full relative mb-10 select-none z-30">
              <div className="bg-[#26130F]/90 backdrop-blur-md border border-[#DFB15B]/20 px-5 py-4 rounded-[24px] flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#DFB15B]/15 border border-[#DFB15B]/25 flex items-center justify-center text-[#DFB15B] shrink-0">
                    <CurrentTabIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#DFB15B]/75 block">Viewing Stage</span>
                    <h3 className="font-display font-black text-sm text-[#FFFDFB] leading-tight mt-0.5">
                      {currentTabInfo.label}
                    </h3>
                  </div>
                </div>

                <Button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  variant="ghost"
                  className="w-10 h-10 p-0 rounded-full border border-white/10 hover:bg-white/5 text-[#DFB15B] flex items-center justify-center shrink-0 active:scale-95 transition-all"
                  id="mobile-3dot-trigger"
                >
                  <MoreVertical className="w-5 h-5 text-[#DFB15B]" />
                </Button>
              </div>

              {/* OVERLAY FLOATING MENU DROPDOWN */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <>
                    <div className="fixed inset-0 bg-[#140603]/40 backdrop-blur-sm z-30" onClick={() => setMobileMenuOpen(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.95 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute right-0 top-[68px] w-72 bg-[#2d150f] border border-[#DFB15B]/30 rounded-[28px] p-3 shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-40 text-left space-y-1.5"
                    >
                      <div className="px-4 py-2.5 border-b border-white/10">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#DFB15B] block">Atelier Modules</span>
                      </div>
                      
                      <div className="py-1 space-y-1 max-h-[360px] overflow-y-auto no-scrollbar">
                        {navigationTabs.map(tab => {
                          const TabIcon = tab.icon;
                          const isSelected = activeTab === tab.value;
                          return (
                            <button
                              key={tab.value}
                              onClick={() => {
                                setActiveTab(tab.value);
                                setMobileMenuOpen(false);
                              }}
                              className={`w-full text-left rounded-xl px-4 py-3.5 transition-all duration-200 flex items-center gap-3 font-bold text-[11px] uppercase tracking-wider ${
                                isSelected 
                                  ? 'bg-[#DFB15B] text-[#140603] font-black shadow-md' 
                                  : 'text-white/80 hover:bg-white/5 hover:text-white bg-transparent'
                              }`}
                            >
                              <TabIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#140603]' : 'text-[#DFB15B]'}`} />
                              <span className="truncate">{tab.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          {activeTab === 'edit-product' && editingProduct ? (
            <TabsContent value="edit-product" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -35 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10"
              >
            {/* LEFT COLUMN: EDIT SELECTIONS FOR WEIGHTS, CATEGORY, TYPE, IMAGE */}
            <div className="lg:col-span-5 space-y-8 text-left">
              
              <div className="bg-[#26130F]/45 backdrop-blur-md border border-[#DFB15B]/15 rounded-[36px] p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#DFB15B] flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#DFB15B]" /> Revise Core Confection
                  </h3>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[8px] uppercase tracking-wider px-3 px-1.5 py-1 rounded-full">
                    Active Editor
                  </Badge>
                </div>

                {/* Cake Name */}
                <div className="space-y-2 mb-6">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/50 block">Confection Name *</label>
                  <Input 
                    placeholder="Ex. 24K Gold Flake Truffle Tower"
                    value={editProdName}
                    onChange={e => setEditProdName(e.target.value)}
                    className="h-14 rounded-xl bg-[#140603]/80 border-white/10 p-4 text-xs font-bold text-white focus:border-[#DFB15B]/40 focus:ring-1 focus:ring-[#DFB15B]/40"
                    required
                  />
                </div>

                {/* Primary Category Selector */}
                <div className="space-y-2.5 mb-6">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/50 block">Primary Boutique Category *</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['Cakes', 'Pastries', 'Cupcakes', 'Brownies', 'Desserts', 'Hampers', 'Custom Cakes'].map(category => (
                      <button
                        type="button"
                        key={category}
                        onClick={() => setEditSelectedCategory(category)}
                        className={`text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                          editSelectedCategory === category 
                            ? 'bg-[#DFB15B] text-[#140603] border-[#DFB15B] shadow-lg shadow-[#DFB15B]/10 scale-105'
                            : 'bg-[#140603]/80 border-white/10 text-white/50 hover:bg-[#140603] hover:text-white'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cake Type Selector */}
                <div className="space-y-2.5 mb-6">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/50 block">Cake Dietary Classification *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: '🌿 Eggless', value: 'Eggless' },
                      { label: '🥚 With Egg', value: 'Regular' },
                      { label: '🧁 Both', value: 'Both Available' }
                    ].map(type => (
                      <button
                        type="button"
                        key={type.value}
                        onClick={() => setEditCakeType(type.value)}
                        className={`text-[10px] font-black uppercase tracking-wider py-3.5 rounded-xl border text-center transition-all duration-350 cursor-pointer ${
                          editCakeType === type.value
                            ? 'bg-[#DFB15B] text-[#140603] border-[#DFB15B] shadow-md shadow-[#DFB15B]/10'
                            : 'bg-[#140603]/80 border-white/10 text-white/50 hover:text-white'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weights Selection Grid */}
                <div className="space-y-2.5 mb-6">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/50 block">Available Weights (Select multiple) *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[0.5, 1.0, 1.5, 2.0, 3.0, 4.0].map(w => {
                      const active = editSelectedWeights.includes(w);
                      return (
                        <button
                          type="button"
                          key={w}
                          onClick={() => {
                            if (active) {
                              setEditSelectedWeights(editSelectedWeights.filter(item => item !== w));
                            } else {
                              setEditSelectedWeights([...editSelectedWeights, w].sort((a,b)=>a-b));
                            }
                          }}
                          className={`text-[10px] font-mono font-bold py-3.5 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                            active
                              ? 'bg-[#DFB15B]/25 text-[#DFB15B] border-[#DFB15B]'
                              : 'bg-[#140603]/80 border-white/10 text-white/40 hover:text-white'
                          }`}
                        >
                          {w === 0.5 ? '0.5 Kg' : `${w.toFixed(1)} Kg`} {active ? '✓' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* IMAGE SELECTION BLOCK FOR EDITING */}
              <div className="bg-[#26130F]/45 backdrop-blur-md border border-[#DFB15B]/15 rounded-[36px] p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#DFB15B] flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-[#DFB15B]" /> Reference Visual Asset
                  </h3>
                  <div className="flex bg-[#140603]/80 p-1 border border-white/10 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setEditImageUrlMode('upload')}
                      className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg cursor-pointer ${
                        editImageUrlMode === 'upload' ? 'bg-[#DFB15B] text-[#140603]' : 'text-white/45'
                      }`}
                    >
                      File Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditImageUrlMode('url')}
                      className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg cursor-pointer ${
                        editImageUrlMode === 'url' ? 'bg-[#DFB15B] text-[#140603]' : 'text-white/45'
                      }`}
                    >
                      Image Link
                    </button>
                  </div>
                </div>

                {editImageUrlMode === 'url' ? (
                  <div className="space-y-4">
                    <Input
                      placeholder="Paste Image URL Address link (e.g., https://...)"
                      value={editPastedImageUrl}
                      onChange={e => setEditPastedImageUrl(e.target.value)}
                      className="h-14 rounded-xl bg-[#140603]/80 border-white/10 p-4 text-xs text-white"
                    />
                    {editPastedImageUrl && (
                      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#DFB15B]/15 bg-[#140603]">
                        <img src={editPastedImageUrl} alt="Pasted preview catalog" className="w-full h-full object-cover animate-fade-in" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative border border-dashed border-[#DFB15B]/20 rounded-[28px] overflow-hidden bg-[#140603]/80 group hover:border-[#DFB15B]/50 transition-colors">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            setEditProductImage(reader.result as string);
                            toast.success('Edit files reference pre-loaded.');
                          };
                          reader.readAsDataURL(file);
                        }} 
                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      />
                      
                      {editProductImage ? (
                        <div className="relative aspect-[4/3] w-full">
                          <img src={editProductImage} alt="Cake preview edit lookup" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="py-12 text-center space-y-3 px-4">
                          <UploadCloud className="w-8 h-8 text-[#DFB15B] mx-auto" />
                          <p className="text-xs text-white font-bold">Select replacement file</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: DETAIL EDIT FORM EXPLAINING REMAINING SPECIFICATIONS */}
            <div className="lg:col-span-7">
              <div className="bg-[#26130F]/45 backdrop-blur-md border border-[#DFB15B]/15 rounded-[44px] p-8 md:p-12 shadow-xl text-left space-y-8">
                
                <div className="border-b border-white/10 pb-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-serif font-bold italic text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#DFB15B]" /> Confectionery Revision Studio
                    </h3>
                    <p className="text-[10px] uppercase font-black tracking-widest text-[#DFB15B]/75 mt-0.5">Modify or replace any detail of your live confectionery masterpiece</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      if(window.confirm("Undo your current edits and return?")) {
                        setEditingProduct(null);
                      }
                    }}
                    className="text-[9px] uppercase tracking-widest text-white/50 hover:text-white"
                  >
                    Cancel Edit
                  </Button>
                </div>

                {/* AI MAGIC SINGLE CLICK BULK CONFIGURATION FOR EDITING */}
                <div className="bg-gradient-to-r from-[#DFB15B]/15 to-transparent border border-[#DFB15B]/20 p-6 rounded-[28px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#DFB15B]/5 rounded-full blur-xl -z-10" />
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#DFB15B]/15 text-[#DFB15B] rounded-2xl border border-[#DFB15B]/25">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#DFB15B] flex items-center gap-1.5">
                        🪄 Instant AI Revision Generator
                      </h4>
                      <p className="text-[11px] text-[#FFFDFB]/70 leading-relaxed italic">
                        Generate complete luxury description copy, recommendation prices, design-slug, alt tags, SEO keywords, meta description and Pinterest pins based on the newly selected name and configuration!
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      type="button"
                      onClick={() => {
                        if (!editProdName) {
                          toast.error("Please insert a Confection Name first to formulate specifications!");
                          return;
                        }
                        const weightsStr = editSelectedWeights.length ? `${editSelectedWeights.join(', ')} KG` : 'custom configurations';
                        const generatedPrompt = `Create a detail profile for a luxury cake model name: '${editProdName}' inside category: '${editSelectedCategory}' configured dietary code: '${editCakeType}' available in weight sizes: [${weightsStr}]. Provide rich descriptive text, pricing, search route-slug, high-CTR alt text, keywords, meta description and LD-JSON scripts.`;
                        triggerTextSpecsAi(true, generatedPrompt);
                      }}
                      disabled={specsGenerating || !editProdName}
                      className="w-full h-14 rounded-2xl bg-[#DFB15B] hover:bg-white text-[#140603] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(223,177,91,0.25)] transition-all cursor-pointer disabled:opacity-40 animate-pulse duration-1000 font-bold"
                    >
                      {specsGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-[#140603]" />
                          <span>Generating Gourmet Content copy...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 text-[#140603]" />
                          <span>Auto-Generate Description & SEO (1-Click)</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <form onSubmit={handleUpdateProduct} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Price */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/50 block">INR Pricing Value (₹) *</label>
                      <Input 
                        type="number"
                        placeholder="Ex. 1499"
                        value={editProdPrice}
                        onChange={e => setEditProdPrice(e.target.value)}
                        className="h-14 rounded-xl bg-[#140603]/80 border border-white/10 p-4 text-xs font-mono font-bold text-[#DFB15B] focus:border-[#DFB15B]/40 focus:ring-1"
                        required
                      />
                    </div>

                    {/* Extra Categories tags */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/50 block">Secondary categories (comma-separated if any)</label>
                      <Input 
                        placeholder="Ex. Chocolate, Custom, Designer"
                        value={editProdCategories}
                        onChange={e => setEditProdCategories(e.target.value)}
                        className="h-14 rounded-xl bg-[#140603]/80 border border-white/10 p-4 text-xs font-semibold"
                      />
                    </div>

                    {/* Flavors */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/50 block">Flavor Options (comma separated)</label>
                      <Input 
                        placeholder="Ex. Cocoa, Red Velvet"
                        value={editProdFlavors}
                        onChange={e => setEditProdFlavors(e.target.value)}
                        className="h-14 rounded-xl bg-[#140603]/80 border border-white/10 p-4 text-xs font-semibold"
                      />
                    </div>

                    {/* Occasions */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/50 block">Occasions (comma-separated)</label>
                      <Input 
                        placeholder="Ex. Birthday, Anniversary"
                        value={editProdOccasions}
                        onChange={e => setEditProdOccasions(e.target.value)}
                        className="h-14 rounded-xl bg-[#140603]/80 border border-white/10 p-4 text-xs font-semibold"
                      />
                    </div>

                    {/* Stock Status & customizable */}
                    <div className="grid grid-cols-2 gap-4 col-span-full">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/50 block">Atelier Stock Status</label>
                        <select 
                          value={editProdStock}
                          onChange={e => setEditProdStock(e.target.value as any)}
                          className="w-full h-14 rounded-xl bg-[#140603]/80 border border-white/10 px-4 text-xs font-bold focus:outline-none focus:border-[#DFB15B] text-white"
                        >
                          <option value="in-stock">Available Now</option>
                          <option value="out-of-stock">Bespoke Pre-Order Only</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/50 block">Customizable Options</label>
                        <select 
                          value={editProdCustomizable ? "yes" : "no"}
                          onChange={e => setEditProdCustomizable(e.target.value === "yes")}
                          className="w-full h-14 rounded-xl bg-[#140603]/80 border border-white/10 px-4 text-xs font-bold focus:outline-none focus:border-[#DFB15B] text-white"
                        >
                          <option value="yes">Customizations Enabled</option>
                          <option value="no">Fixed Secret Recipe</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Taste description */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/50 block">Artisan Taste description copy</label>
                    <textarea 
                      rows={4}
                      placeholder="Describe the wonderful taste, texture, crust density, design elements..."
                      value={editProdDescription}
                      onChange={e => setEditProdDescription(e.target.value)}
                      className="w-full rounded-xl bg-[#140603]/80 border border-white/10 p-4 text-xs font-medium leading-relaxed focus:outline-none focus:border-[#DFB15B] text-white"
                    />
                  </div>

                  {/* SEO REVISIONS SUBFORM */}
                  <div className="border-t border-white/10 pt-6 space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.25em] text-[#DFB15B] flex items-center gap-1.5">
                      <FileText className="w-4.5 h-4.5" /> Google Search Engines Optimization (SEO)
                    </h4>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Google Head Title */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black tracking-widest text-[#FFFDFB]/40 block">Google Search SEO Title Tag</label>
                        <Input 
                          placeholder="Ex. 24K Gold Flake Truffle Tower - Cake Urban South Delhi"
                          value={editProdSeoTitle}
                          onChange={e => setEditProdSeoTitle(e.target.value)}
                          className="h-11 rounded-lg bg-[#140603]/50 border-white/10 p-3 text-xs text-[#FFFDFB]"
                        />
                      </div>

                      {/* URL Route Slug */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black tracking-widest text-[#FFFDFB]/40 block">URL Path Slug</label>
                        <Input 
                          placeholder="Ex. 24k-gold-flake-truffle-tower"
                          value={editProdSeoSlug}
                          onChange={e => setEditProdSeoSlug(e.target.value)}
                          className="h-11 rounded-lg bg-[#140603]/50 border-white/10 p-3 text-xs font-mono text-[#FFFDFB]"
                        />
                      </div>

                      {/* Meta description */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black tracking-widest text-[#FFFDFB]/40 block">Google Meta Description Tag (max 160 chars)</label>
                        <Input 
                          placeholder="Ex. Buy Gold Flake Truffle Tower Cake online at Cake Urban..."
                          value={editProdSeoMetaDescription}
                          onChange={e => setEditProdSeoMetaDescription(e.target.value)}
                          className="h-11 rounded-lg bg-[#140603]/50 border-white/10 p-3 text-xs text-[#FFFDFB]"
                        />
                      </div>

                      {/* High-volume search keywords */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black tracking-widest text-[#FFFDFB]/40 block">High-Volume Search Keywords (comma-separated)</label>
                        <Input 
                          placeholder="Ex. best gold cake faridabad, chocolate luxury cake delhi ncr"
                          value={editProdSeoKeywords.join(', ')}
                          onChange={e => setEditProdSeoKeywords(e.target.value.split(',').map(k => k.trim()))}
                          className="h-11 rounded-lg bg-[#140603]/50 border-white/10 p-3 text-xs text-[#FFFDFB]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* FORM ACTIONS */}
                  <div className="pt-6 border-t border-white/10 flex gap-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if(window.confirm("Throw away all revision edits and return?")) {
                          setEditingProduct(null);
                        }
                      }}
                      className="flex-1 h-14 rounded-2xl border-white/10 text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-wider cursor-pointer"
                    >
                      Discard Shuffled Changes
                    </Button>
                    <Button 
                      type="submit"
                      className="flex-[2] h-14 rounded-2xl bg-[#DFB15B] hover:bg-white text-[#140603] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 cursor-pointer font-bold"
                    >
                      Commit & Replace creation
                    </Button>
                  </div>
                </form>

              </div>
            </div>
          </motion.div>
        </TabsContent>
      ) : activeTab === 'add-product' ? (
        <TabsContent value="add-product" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -35 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            {/* LEFT COLUMN: PRIMARY INPUT FIELDS FOR VELOCITY ACTIONS */}
            <div className="lg:col-span-5 space-y-8 text-left">
              
              {/* CORE FIELDS: NAME, CATEGORY, TYPE, AVAILABLE WEIGHTS */}
              <div className="bg-[#26130F]/45 backdrop-blur-md border border-[#DFB15B]/15 rounded-[36px] p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#DFB15B]/5 rounded-full blur-2xl -z-10" />
                
                <h3 className="text-xs font-black uppercase tracking-widest text-[#DFB15B] mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#DFB15B]" /> Configure Culinary Basic Values
                </h3>

                {/* Cake Name */}
                <div className="space-y-2 mb-6">
                  <label className="text-[10px] uppercase font-black tracking-widest text-[#FFFDFB]/60 block">Cake Product Name *</label>
                  <Input 
                    placeholder="Ex. 24K Gold Flake Truffle Tower"
                    value={prodName}
                    onChange={e => setProdName(e.target.value)}
                    className="h-14 rounded-xl bg-[#140603]/80 border border-[#DFB15B]/15 p-4 text-xs font-bold text-white focus:border-[#DFB15B]/40 focus:ring-1 focus:ring-[#DFB15B]/40"
                    required
                  />
                </div>

                {/* Categories Selection */}
                <div className="space-y-2.5 mb-6">
                  <label className="text-[10px] uppercase font-black tracking-widest text-[#FFFDFB]/60 block">Select Category *</label>
                  <div className="flex flex-wrap gap-2">
                    {['Cakes', 'Pastries', 'Cupcakes', 'Brownies', 'Desserts', 'Hampers', 'Custom Cakes'].map(category => (
                      <button
                        type="button"
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                          selectedCategory === category 
                            ? 'bg-[#DFB15B] text-[#140603] border-[#DFB15B] shadow-lg shadow-[#DFB15B]/10 scale-105 font-extrabold'
                            : 'bg-[#140603]/80 border-white/10 text-white/50 hover:bg-[#140603] hover:text-white'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cake Type Selector */}
                <div className="space-y-2.5 mb-6">
                  <label className="text-[10px] uppercase font-black tracking-widest text-[#FFFDFB]/60 block">Select Cake Culinary Type *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: '🌿 Eggless', value: 'Eggless' },
                      { label: '🥚 With Egg', value: 'Regular' },
                      { label: '🧁 Both', value: 'Both Available' }
                    ].map(type => (
                      <button
                        type="button"
                        key={type.value}
                        onClick={() => setSelectedCakeType(type.value)}
                        className={`text-[10px] font-black uppercase tracking-wider py-3.5 rounded-xl border text-center transition-all duration-350 cursor-pointer ${
                          selectedCakeType === type.value
                            ? 'bg-[#DFB15B] text-[#140603] border-[#DFB15B] shadow-md shadow-[#DFB15B]/10 font-black'
                            : 'bg-[#140603]/80 border-white/10 text-white/50 hover:text-white'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weights checklist capsules */}
                <div className="space-y-2.5">
                  <label className="text-[10px] uppercase font-black tracking-widest text-[#FFFDFB]/60 block">Select Available Weights *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[0.5, 1.0, 1.5, 2.0, 3.0, 4.0].map(w => {
                      const active = selectedWeights.includes(w);
                      return (
                        <button
                          type="button"
                          key={w}
                          onClick={() => {
                            if (active) {
                              setSelectedWeights(selectedWeights.filter(item => item !== w));
                            } else {
                              setSelectedWeights([...selectedWeights, w].sort((a,b)=>a-b));
                            }
                          }}
                          className={`text-[10px] font-mono font-bold py-3.5 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                            active
                              ? 'bg-[#DFB15B]/25 text-[#DFB15B] border-[#DFB15B] font-extrabold'
                              : 'bg-[#140603]/80 border-white/10 text-white/40 hover:text-white'
                          }`}
                        >
                          {w === 0.5 ? '0.5 Kg' : `${w.toFixed(1)} Kg`} {active ? '✓' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* IMAGE SELECTION MODE TOOL: UPLOAD VS LINK */}
              <div className="bg-[#26130F]/45 backdrop-blur-md border border-[#DFB15B]/15 rounded-[36px] p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#DFB15B] flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-[#DFB15B]" /> Image Setup Option
                  </h3>
                  
                  {/* Switch toggle control */}
                  <div className="flex bg-[#140603]/80 p-0.5 border border-white/10 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setImageUrlMode('upload')}
                      className={`text-[9px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-lg cursor-pointer ${
                        imageUrlMode === 'upload' ? 'bg-[#DFB15B] text-[#140603]' : 'text-white/45'
                      }`}
                    >
                      File Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUrlMode('url')}
                      className={`text-[9px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-lg cursor-pointer ${
                        imageUrlMode === 'url' ? 'bg-[#DFB15B] text-[#140603]' : 'text-white/45'
                      }`}
                    >
                      Paste Link
                    </button>
                  </div>
                </div>

                {imageUrlMode === 'url' ? (
                  <div className="space-y-4 text-left">
                    <p className="text-[10px] text-white/40 italic leading-relaxed">
                      Copy and paste any direct image address link (e.g. from Unsplash, Google Photos or Instagram links).
                    </p>
                    <Input 
                      placeholder="Paste direct Image URL address link..."
                      value={pastedImageUrl}
                      onChange={e => setPastedImageUrl(e.target.value)}
                      className="h-14 rounded-xl bg-[#140603]/80 border border-white/10 p-4 text-xs font-semibold text-white placeholder-white/20 w-full"
                    />
                    {pastedImageUrl && (
                      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#DFB15B]/15 bg-[#140603]">
                        <img src={pastedImageUrl} alt="Pasted direct preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 text-left">
                    <div className="relative border border-dashed border-[#DFB15B]/20 rounded-[28px] overflow-hidden bg-[#140603]/80 group hover:border-[#DFB15B]/50 transition-colors">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        disabled={aiOptimizing}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      />
                      
                      {newProductImage ? (
                        <div className="relative aspect-[4/3] w-full">
                          <img src={newProductImage} alt="Cake preview lookup" className="w-full h-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur-md p-3 text-center border-t border-white/10">
                            <p className="text-[10px] text-[#DFB15B] font-bold italic flex items-center justify-center gap-1.5 leading-none">
                              <CheckIcon className="w-4 h-4 text-emerald-500" /> Image uploaded successfully!
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="py-12 text-center space-y-3 px-4">
                          <UploadCloud className="w-8 h-8 text-[#DFB15B] mx-auto" />
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-white">Click or drag file here</p>
                            <p className="text-[9px] text-white/40 font-semibold font-mono">PNG, JPE, or HEIC</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {newProductImage && (
                      <Button
                        type="button"
                        onClick={triggerAiSeoOptimization}
                        disabled={aiOptimizing}
                        className="w-full h-11 rounded-xl bg-[#DFB15B]/10 hover:bg-[#DFB15B] text-[#DFB15B] hover:text-[#140603] text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" /> Analyze upload reference values
                      </Button>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: CORE SEC SPECIFICATIONS FORM */}
            <div className="lg:col-span-7">
              <div className="bg-[#26130F]/45 backdrop-blur-md border border-[#DFB15B]/15 rounded-[44px] p-8 md:p-11 shadow-xl text-left space-y-8">
                
                {/* AI MAGIC SINGLE CLICK BULK CONFIGURATION */}
                <div className="bg-gradient-to-r from-[#DFB15B]/15 to-transparent border border-[#DFB15B]/20 p-6 rounded-[28px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#DFB15B]/5 rounded-full blur-xl -z-10" />
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#DFB15B]/15 text-[#DFB15B] rounded-2xl border border-[#DFB15B]/25">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#DFB15B] flex items-center gap-1.5">
                        🪄 3. Instant AI Copilot Generator
                      </h4>
                      <p className="text-[11px] text-[#FFFDFB]/70 leading-relaxed italic">
                        Generate complete luxury description copy, recommend selling prices, design-slug, high-CTR image alt tags, search keywords, and Pinterest pins based on basic details provided on the left panel!
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      type="button"
                      onClick={() => {
                        if (!prodName) {
                          toast.error("Please insert a Cake Product Name first to formulate specifications!");
                          return;
                        }
                        const weightsStr = selectedWeights.length ? `${selectedWeights.join(', ')} KG` : 'custom configurations';
                        const generatedPrompt = `Create a detail profile for a luxury cake model name: '${prodName}' inside category: '${selectedCategory}' configured dietary code: '${selectedCakeType}' available in weight sizes: [${weightsStr}]. Provide rich descriptive text, pricing, search route-slug, high-CTR alt text, keywords, meta description and LD-JSON scripts.`;
                        setAiPrompt(generatedPrompt);
                        triggerTextSpecsAi(false, generatedPrompt);
                      }}
                      disabled={specsGenerating || !prodName}
                      className="w-full h-14 rounded-2xl bg-[#DFB15B] hover:bg-white text-[#140603] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(223,177,91,0.25)] transition-all cursor-pointer disabled:opacity-40 animate-pulse duration-1000 font-bold"
                    >
                      {specsGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-[#140603]" />
                          <span>Generating Gourmet Content copy...</span>
                        </>
                      ) : (
                        <>
                          <Sparkle className="w-5 h-5 text-[#140603]" />
                          <span>Auto-Generate Description & SEO (1-Click)</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <form onSubmit={handlePublishProduct} className="space-y-8">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-md font-serif font-bold italic text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#DFB15B]" /> Custom Confection Parameters Form
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Price */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-[#FFFDFB]/60 block font-bold">INR Selling Pricing (₹) *</label>
                      <Input 
                        type="number"
                        placeholder="Ex. 1499"
                        value={prodPrice}
                        onChange={e => setProdPrice(e.target.value)}
                        className="h-14 rounded-xl bg-[#140603]/80 border border-white/10 p-4 text-xs font-mono font-bold text-white focus:border-[#DFB15B]/40 focus:ring-1 focus:ring-[#DFB15B]/40"
                        required
                      />
                    </div>

                    {/* Secondary categories */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-[#FFFDFB]/60 block">Additional Categories (comma-separated)</label>
                      <Input 
                        placeholder="Ex. Customcakes, BelgianTruffle"
                        value={prodCategories}
                        onChange={e => setProdCategories(e.target.value)}
                        className="h-14 rounded-xl bg-[#140603]/80 border border-white/10 p-4 text-xs font-semibold"
                      />
                    </div>

                    {/* Flavors */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-[#FFFDFB]/60 block">Flavors (comma-separated)</label>
                      <Input 
                        placeholder="Ex. Cocoa sponge, Vanilla orchid cream"
                        value={prodFlavors}
                        onChange={e => setProdFlavors(e.target.value)}
                        className="h-14 rounded-xl bg-[#140603]/80 border border-white/10 p-4 text-xs font-semibold"
                      />
                    </div>

                    {/* Occasions */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-[#FFFDFB]/60 block">Occasions (comma-separated)</label>
                      <Input 
                        placeholder="Ex. Birthday, Anniversary"
                        value={prodOccasions}
                        onChange={e => setProdOccasions(e.target.value)}
                        className="h-14 rounded-xl bg-[#140603]/80 border border-white/10 p-4 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  {/* Taste description */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-[#FFFDFB]/60 block">Rich taste & Design description</label>
                    <textarea 
                      rows={4}
                      placeholder="Taste notes, design detail..."
                      value={prodDescription}
                      onChange={e => setProdDescription(e.target.value)}
                      className="w-full rounded-xl bg-[#140603]/80 border border-white/10 p-4 text-xs font-medium leading-relaxed focus:outline-none focus:border-[#DFB15B] text-white"
                    />
                  </div>

                  {/* Google Search simulator & Path slug */}
                  <div className="border-t border-white/10 pt-6 space-y-5">
                    <h4 className="text-xs font-black uppercase tracking-[0.25em] text-[#DFB15B] flex items-center gap-1.5">
                      <FileText className="w-4.5 h-4.5" /> Metatags & Rich Schema specifications
                    </h4>

                    <div className="grid grid-cols-1 gap-4">
                      {/* SEO Title */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black tracking-widest text-white/40 block">Google Search SEO Title Tag</label>
                        <Input 
                          placeholder="Ex. 24K Gold Flake Truffle Tower | Cake Urban South Delhi"
                          value={prodSeoTitle}
                          onChange={e => setProdSeoTitle(e.target.value)}
                          className="h-11 rounded-lg bg-[#140603]/50 border-white/10 p-3 text-xs text-[#FFFDFB]"
                        />
                      </div>

                      {/* Path slug */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black tracking-widest text-white/40 block">URL Path Slug</label>
                        <Input 
                          placeholder="Ex. 24k-gold-flake-truffle-tower"
                          value={prodSeoSlug}
                          onChange={e => setProdSeoSlug(e.target.value)}
                          className="h-11 rounded-lg bg-[#140603]/50 border-white/10 p-3 text-xs font-mono text-[#FFFDFB]"
                        />
                      </div>

                      {/* Meta Description */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black tracking-widest text-white/40 block">Google Meta Description Tag</label>
                        <Input 
                          placeholder="Ex. Buy Gold Flake Truffle Tower Cake online..."
                          value={prodSeoMetaDescription}
                          onChange={e => setProdSeoMetaDescription(e.target.value)}
                          className="h-11 rounded-lg bg-[#140603]/50 border-white/10 p-3 text-xs text-[#FFFDFB]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* FORM ACTIONS */}
                  <div className="pt-6 border-t border-white/10 flex gap-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab('products')}
                      className="flex-1 h-14 rounded-2xl border-white/10 text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-wider cursor-pointer"
                    >
                      Discard Draft
                    </Button>
                    <Button 
                      type="submit"
                      className="flex-[2] h-14 rounded-2xl bg-[#DFB15B] hover:bg-white text-[#140603] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 cursor-pointer font-bold duration-300"
                    >
                      Deploy Masterpiece Live (1-Click)
                    </Button>
                  </div>
                </form>

              </div>
            </div>
          </motion.div>
        </TabsContent>
      ) : (
        /* CORE STATS & FIVE INTERACTIVE COMMAND SECTIONS */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-12 animate-in fade-in duration-500"
        >
            {/* STATS OVERVIEW TILES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {/* Gross income inflow */}
              <Card className="rounded-[32px] border border-[#DFB15B]/15 shadow-2xl bg-[#26130F]/45 p-1">
                <CardContent className="p-8 flex items-center justify-between">
                  <div className="space-y-2 text-left">
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 italic">Boutique Gross Inflow</p>
                    <p className="text-3xl font-serif font-black text-white leading-none">₹{totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="w-14 h-14 bg-[#DFB15B]/15 rounded-2xl flex items-center justify-center text-[#DFB15B] shrink-0 border border-[#DFB15B]/20">
                     <DollarSign className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>

              {/* Active Reservations */}
              <Card className="rounded-[32px] border border-[#DFB15B]/15 shadow-2xl bg-[#26130F]/45 p-1">
                <CardContent className="p-8 flex items-center justify-between">
                  <div className="space-y-2 text-left">
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 italic">Baking Reservations</p>
                    <p className="text-3xl font-serif font-black text-white leading-none">{orders.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shrink-0 border border-amber-500/20">
                     <ShoppingBag className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>

              {/* Custom Tiers Builder Inquiries */}
              <Card className="rounded-[32px] border border-[#DFB15B]/15 shadow-2xl bg-[#26130F]/45 p-1">
                <CardContent className="p-8 flex items-center justify-between">
                  <div className="space-y-2 text-left">
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 italic">Designer Inquiries</p>
                    <p className="text-3xl font-serif font-black text-white leading-none">{customInquiries.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 shrink-0 border border-purple-500/20">
                     <Sparkles className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>

              {/* Average Reviews Critique Score */}
              <Card className="rounded-[32px] border border-[#DFB15B]/15 shadow-2xl bg-[#26130F]/45 p-1">
                <CardContent className="p-8 flex items-center justify-between">
                  <div className="space-y-2 text-left">
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 italic">Critique Score</p>
                    <p className="text-3xl font-serif font-black text-[#DFB15B] leading-none flex items-center gap-1">
                      {avgCritiqueRating} <span className="text-sm font-sans font-bold text-white/40">/ 5★</span>
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20">
                     <Star className="w-6 h-6 fill-emerald-400/25" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* TAB CONTENT PANELS (insights, orders, inquiries, products, reviews) */}

              {/* 📊 TAB 1: INSIGHTS & ANALYTICS OVERVIEW */}
              <TabsContent value="insights" className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Sales spline trace custom vector SVG */}
                  <Card className="lg:col-span-8 rounded-[44px] border border-[#DFB15B]/15 shadow-xl bg-[#26130F]/45 overflow-hidden text-left">
                    <CardHeader className="p-8 pb-4">
                      <CardTitle className="text-lg font-serif font-bold text-white flex items-center gap-2">
                        <TrendingUp className="text-[#DFB15B] w-5 h-5" /> Sales Projection & Growth Trajectory
                      </CardTitle>
                      <p className="text-[10px] uppercase tracking-widest font-black text-white/40">Visualizing 24-hour revenue volume clusters and baking demand peaks</p>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                      
                      {/* Gorgeous SVG Graphic Graph */}
                      <div className="relative aspect-[21/9] w-full bg-[#140603]/60 rounded-3xl border border-white/5 p-4 flex items-end justify-between overflow-hidden">
                        {/* Overlay ambient grids */}
                        <div className="absolute inset-x-0 top-1/4 border-b border-white/5" />
                        <div className="absolute inset-x-0 top-2/4 border-b border-white/5" />
                        <div className="absolute inset-x-0 top-3/4 border-b border-white/5" />
                        
                        {/* Curve Trace SVG */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#DFB15B" stopOpacity="0.3"/>
                              <stop offset="100%" stopColor="#DFB15B" stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                          {/* Smooth curved shadow area */}
                          <path d={filledDynamicPath} fill="url(#chartGradient)" />
                          {/* Rich glowing line vector */}
                          <path d={dynamicPath} fill="none" stroke="#DFB15B" strokeWidth="3" strokeLinecap="round" />
                          
                          {/* Animated pointer nodes */}
                          <circle cx="320" cy="50" r="5" fill="#140603" stroke="#DFB15B" strokeWidth="2" />
                          <circle cx="450" cy="30" r="5" fill="#140603" stroke="#DFB15B" strokeWidth="2" />
                        </svg>

                        <div className="text-[9px] font-bold uppercase font-mono tracking-widest text-[#DFB15B] absolute top-4 right-4 bg-[#DFB15B]/10 px-2.5 py-1 rounded-full border border-[#DFB15B]/20">
                          Live Trend (+18.9% Vector)
                        </div>

                        {/* Labels */}
                        <div className="text-[10px] font-bold text-white/30 relative z-10">Faridabad Sectors</div>
                        <div className="text-[10px] font-bold text-white/30 relative z-10">Gurgaon Tiers</div>
                        <div className="text-[10px] font-bold text-white/30 relative z-10">South Delhi Estates</div>
                        <div className="text-[10px] font-bold text-white/30 relative z-10">Noida Heights</div>
                      </div>

                    </CardContent>
                  </Card>

                  {/* Operational diagnostics panel */}
                  <Card className="lg:col-span-4 rounded-[44px] border border-[#DFB15B]/15 shadow-xl bg-[#26130F]/45 text-left p-1">
                    <CardHeader className="p-8">
                      <CardTitle className="text-md font-serif font-black text-white flex items-center gap-2">
                        <Coffee className="text-[#DFB15B] w-5 h-5" /> Patron Demographics
                      </CardTitle>
                      <p className="text-[9px] uppercase font-bold tracking-widest text-white/40">Real-time local demand segmentation</p>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                      
                      {/* Segment 1: Chocolate Fudge Series */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span>Chocolate Fudge Series</span>
                          <span className="text-[#DFB15B]">44% Demand</span>
                        </div>
                        <div className="h-2 w-full bg-[#140603] rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-[#DFB15B] rounded-full" style={{ width: '44%' }} />
                        </div>
                      </div>

                      {/* Segment 2: Customized Theme Pillars */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span>Customized Theme Pillars</span>
                          <span className="text-amber-500">28% Demand</span>
                        </div>
                        <div className="h-2 w-full bg-[#140603] rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: '28%' }} />
                        </div>
                      </div>

                      {/* Segment 3: Madagascar Orchids */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span>Orchid Vanilla & Fruits</span>
                          <span className="text-purple-400">18% Demand</span>
                        </div>
                        <div className="h-2 w-full bg-[#140603] rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-purple-400 rounded-full" style={{ width: '18%' }} />
                        </div>
                      </div>

                      {/* Segment 4: Gluten-Free & Vegan */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span>Dietary & Organic Sponge</span>
                          <span className="text-emerald-400">10% Demand</span>
                        </div>
                        <div className="h-2 w-full bg-[#140603] rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: '10%' }} />
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* 🛍️ TAB 2: ACTIVE RESERVATIONS (ORDERS) */}
              <TabsContent value="orders" className="mt-8">
                <Card className="rounded-[44px] border border-[#DFB15B]/15 shadow-xl bg-[#26130F]/45 overflow-hidden text-left">
                  <CardHeader className="p-8 md:p-10 border-b border-[#DFB15B]/10 bg-[#140603]/40">
                    <CardTitle className="text-lg md:text-xl font-serif font-black text-white flex items-center gap-3">
                      <Clock className="text-[#DFB15B] w-5 h-5" /> Standard Active Reservoirs
                    </CardTitle>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#DFB15B]/75 mt-0.5">Approve, update dispatch progress, or complete clients bakes</p>
                  </CardHeader>
                  <CardContent className="p-0">

                    <div className="px-8 pt-6 pb-2 flex flex-col md:flex-row items-center gap-4 border-b border-[#DFB15B]/10 justify-between">
                       <div className="flex bg-[#140603]/80 p-1 border border-white/10 rounded-xl">
                          {['All', 'new', 'baking', 'out-for-delivery', 'delivered'].map(status => (
                            <button
                              key={status}
                              onClick={() => setOrderStatusFilter(status)}
                              className={`text-[9px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-lg cursor-pointer ${
                                orderStatusFilter === status ? 'bg-[#DFB15B] text-[#140603]' : 'text-white/45'
                              }`}
                            >
                              {status === 'All' ? 'All' : status}
                            </button>
                          ))}
                       </div>
                       <Input
                          placeholder="Search Order ID or Guest Email..."
                          value={orderSearchQuery}
                          onChange={e => setOrderSearchQuery(e.target.value)}
                          className="w-full md:w-64 h-10 rounded-lg bg-[#140603]/80 border border-white/10 px-4 text-xs font-semibold text-white focus:outline-none focus:border-[#DFB15B]"
                        />
                    </div>
                    <ScrollArea className="h-[500px] w-full">
                      {orders.filter(o =>
                          (orderStatusFilter === 'All' || o.status === orderStatusFilter) &&
                          (o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                           (o.guestEmail && o.guestEmail.toLowerCase().includes(orderSearchQuery.toLowerCase())))
                       ).length === 0 ? (
                        <div className="py-24 text-center space-y-4">
                          <ShoppingBag className="w-12 h-12 text-[#DFB15B]/25 mx-auto" />
                          <p className="text-xs text-[#FFFDFB]/60 font-semibold italic">No standard reservations found in Firestore registry.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-[#DFB15B]/10">
                          {orders.filter(o =>
                              (orderStatusFilter === 'All' || o.status === orderStatusFilter) &&
                              (o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                               (o.guestEmail && o.guestEmail.toLowerCase().includes(orderSearchQuery.toLowerCase())))
                           ).map(order => (
                            <div key={order.id} className="p-8 flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 hover:bg-white/[0.02] transition duration-300">
                              
                              <div className="space-y-2.5 w-full lg:w-auto">
                                <div className="flex items-center gap-3">
                                  <span className="font-display font-black text-white text-lg tracking-wider bg-[#140603] px-3.5 py-1.5 rounded-xl border border-white/5">
                                    #{order.id.slice(-6).toUpperCase()}
                                  </span>
                                  <Badge className={`border-none font-bold text-[8px] tracking-widest uppercase px-3 py-1 rounded-full ${
                                    order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                    order.status === 'baking' ? 'bg-[#DFB15B]/20 text-[#DFB15B]' :
                                    order.status === 'out-for-delivery' ? 'bg-purple-500/20 text-purple-400' :
                                    order.status === 'cancelled' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
                                  }`}>
                                    {order.status}
                                  </Badge>
                                </div>
                                <div className="space-y-0.5">
                                  <p className="text-[10px] font-bold text-[#DFB15B] uppercase tracking-widest flex items-center gap-1">
                                    <User className="w-3.5 h-3.5 text-[#DFB15B]/60" /> Account: {order.guestEmail || 'Boutique Regular'}
                                  </p>
                                  {order.phoneNumber && (
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                        <Phone className="w-3.5 h-3.5 text-emerald-400/60" strokeWidth={2.5} /> +91 {order.phoneNumber}
                                      </p>
                                      <span className="text-white/20 select-none">|</span>
                                      <a 
                                        href={`https://wa.me/91${order.phoneNumber}?text=Hello%20there%2C%20this%20is%20Cake%20Urban%20support%20regarding%20your%20gourmet%20order%20%23${order.id.slice(-6).toUpperCase()}!`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-[9px] font-bold text-[#25D366] hover:underline uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
                                      >
                                        WhatsApp
                                      </a>
                                      <span className="text-white/20 select-none">/</span>
                                      <a 
                                        href={`tel:+91${order.phoneNumber}`} 
                                        className="text-[9px] font-bold text-[#DFB15B] hover:underline uppercase tracking-wider cursor-pointer"
                                      >
                                        Call
                                      </a>
                                    </div>
                                  )}
                                  <p className="text-[9px] font-semibold text-[#FFFDFB]/40 uppercase tracking-widest flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-white/30" /> Placed on: {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                  </p>
                                </div>
                              </div>

                              {/* Target delivery date slots */}
                              <div className="space-y-1 w-full lg:w-auto text-left lg:text-center px-4 py-2 bg-[#140603]/40 rounded-xl border border-white/5 min-w-[200px]">
                                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">SCHEDULED DELIVERY</p>
                                <p className="text-xs font-bold text-white uppercase italic">{order.deliveryDate}</p>
                                <p className="text-[9px] font-mono font-bold text-[#DFB15B]">{order.deliverySlot}</p>
                              </div>

                              {/* Price */}
                              <div className="space-y-1 w-full lg:w-auto text-left lg:text-right">
                                <p className="text-xl font-serif font-bold text-white italic">₹{order.total}</p>
                                <p className="text-[9px] text-[#DFB15B] font-bold uppercase tracking-widest">{order.items?.length || 1} Gourmet Elements</p>
                              </div>

                              {/* Status Advancer Actions */}
                              <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-end">
                                {order.status === 'new' && (
                                  <Button 
                                    onClick={() => updateOrderStatus(order.id, 'baking')}
                                    className="bg-blue-500 hover:bg-blue-600 text-[10px] tracking-wider uppercase font-black rounded-xl h-12 px-5 text-white cursor-pointer"
                                  >
                                    Initiate Baking
                                  </Button>
                                )}
                                {order.status === 'baking' && (
                                  <Button 
                                    onClick={() => updateOrderStatus(order.id, 'out-for-delivery')}
                                    className="bg-purple-500 hover:bg-purple-600 text-[10px] tracking-wider uppercase font-black rounded-xl h-12 px-5 text-white cursor-pointer"
                                  >
                                    Dispatch Courier
                                  </Button>
                                )}
                                {order.status === 'out-for-delivery' && (
                                  <Button 
                                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-[10px] tracking-wider uppercase font-black rounded-xl h-12 px-5 text-white cursor-pointer"
                                  >
                                    Mark Fulfilled
                                  </Button>
                                )}
                                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                  <Button 
                                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                    variant="ghost" 
                                    className="hover:text-rose-400 hover:bg-rose-500/10 text-white/30 text-[10px] tracking-wider uppercase font-black rounded-xl h-12 px-4 cursor-pointer"
                                  >
                                    Cancel
                                  </Button>
                                )}
                              </div>

                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 🪄 TAB 3: CUSTOM BUILDER INQUIRIES */}
              <TabsContent value="inquiries" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                  {customInquiries.length === 0 ? (
                    <div className="col-span-full py-24 text-center space-y-4 bg-[#26130F]/45 rounded-3xl border border-[#DFB15B]/15">
                      <Sparkles className="w-12 h-12 text-[#DFB15B]/20 mx-auto" />
                      <p className="text-xs text-[#FFFDFB]/60 font-semibold italic">No interactive design builder inquiries in Firestore.</p>
                    </div>
                  ) : (
                    customInquiries.map(inq => (
                      <Card key={inq.id} className="rounded-[36px] border border-[#DFB15B]/15 bg-[#26130F]/45 overflow-hidden flex flex-col shadow-xl">
                        
                        {/* Selected Reference visual or simple cake canvas */}
                        <div className="aspect-[16/10] bg-[#140603]/70 relative p-4 flex items-center justify-center">
                          {inq.referenceImages && inq.referenceImages.length > 0 ? (
                            <img src={inq.referenceImages[0]} className="w-full h-full object-cover rounded-2xl" alt="Reference draft upload" />
                          ) : (
                            <div className="text-center space-y-1.5 text-white/30">
                              <Coffee className="w-8 h-8 text-[#DFB15B]/20 mx-auto" strokeWidth={1} />
                              <span className="text-[10px] uppercase font-black tracking-widest text-[#DFB15B]/65 italic">Bespoke Blueprint Draft</span>
                            </div>
                          )}

                          <div className="absolute top-4 right-4 bg-[#140603]/80 border border-white/5 backdrop-blur-md text-[9px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full text-white">
                            {inq.tiers}
                          </div>
                        </div>

                        {/* Summary specifications list */}
                        <CardContent className="p-8 flex-1 flex flex-col justify-between">
                          <div className="space-y-5">
                            <div>
                              <p className="text-[9px] uppercase tracking-widest font-black text-white/30 mb-0.5">Bespoke Collector</p>
                              <h4 className="font-display font-black text-white text-lg tracking-tight flex items-center gap-1.5">
                                <User className="w-4 h-4 text-[#DFB15B]" /> {inq.contactName || 'Elite Customer'}
                              </h4>
                            </div>

                            <div className="space-y-2 text-xs font-medium text-[#FFFDFB]/70 border-t border-b border-white/5 py-4">
                              <p className="flex justify-between">
                                <span className="opacity-50">Flavor Focus:</span>
                                <span className="font-bold text-[#DFB15B]">{inq.flavor || 'Belgian Dark'}</span>
                              </p>
                              <p className="flex justify-between">
                                <span className="opacity-50">Shape Geometry:</span>
                                <span className="font-bold text-white">{inq.shape || 'Classic Round'}</span>
                              </p>
                              <p className="flex justify-between">
                                <span className="opacity-50">Icing Tone:</span>
                                <span className="flex items-center gap-1 font-bold text-white">
                                  <span className="w-3.5 h-3.5 rounded-full border border-white/15 inline-block" style={{ backgroundColor: inq.icingColor || '#FFFFFF' }} />
                                  {inq.icingColor || '#FFFFFF'}
                                </span>
                              </p>
                              {inq.cakeMessage && (
                                <p className="border-t border-white/5 pt-2 italic text-[#FFFDFB]/80 text-[11px] leading-relaxed">
                                  Inscribed: &quot;{inq.cakeMessage}&quot;
                                </p>
                              )}
                            </div>

                            {/* Contact indices */}
                            <div className="space-y-1">
                              {inq.contactEmail && (
                                <p className="text-[10px] font-semibold text-[#FFFDFB]/50 flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5 text-white/30" /> {inq.contactEmail}
                                </p>
                              )}
                              {inq.contactPhone && (
                                <p className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5 text-emerald-400/50" /> +91 {inq.contactPhone}
                                </p>
                              )}
                              <p className="text-[10px] font-semibold text-[#DFB15B] flex items-center gap-1.5 italic">
                                <Calendar className="w-3.5 h-3.5 text-[#DFB15B]/50" /> Target celebration: {inq.eventDate || 'Urgent pre-bake'}
                              </p>
                            </div>
                          </div>

                          <div className="pt-6 mt-6 border-t border-white/5 flex flex-col gap-2.5">
                            {inq.contactPhone ? (
                              <div className="flex flex-wrap gap-2">
                                <a 
                                  href={`https://wa.me/91${inq.contactPhone}?text=Hello%20${encodeURIComponent(inq.contactName || 'Customer')}%2C%20this%20is%20Cake%20Urban.%20We%20received%20your%20custom%20designer%20cake%20inquiry%20for%20${encodeURIComponent(inq.flavor || 'cake')}!`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 min-w-[70px]"
                                >
                                  <Button 
                                    className="w-full rounded-xl bg-[#25D366] hover:bg-emerald-600 text-white text-[9px] uppercase font-black tracking-widest h-11 cursor-pointer flex items-center justify-center gap-1"
                                  >
                                    WhatsApp
                                  </Button>
                                </a>
                                
                                <a 
                                  href={`tel:+91${inq.contactPhone}`}
                                  className="flex-1 min-w-[50px]"
                                >
                                  <Button 
                                    className="w-full rounded-xl bg-[#DFB15B] hover:bg-white text-[#140603] text-[9px] uppercase font-black tracking-widest h-11 cursor-pointer flex items-center justify-center gap-1"
                                  >
                                    Call
                                  </Button>
                                </a>

                                {inq.contactEmail && (
                                  <a 
                                    href={`mailto:${inq.contactEmail}?subject=Cake%20Urban%3A%20Custom%20Designer%2520Consultation`}
                                    className="flex-1 min-w-[50px]"
                                  >
                                    <Button 
                                      className="w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-[9px] uppercase font-black tracking-widest h-11 cursor-pointer flex items-center justify-center gap-1"
                                    >
                                      Email
                                    </Button>
                                  </a>
                                )}
                              </div>
                            ) : (
                              inq.contactEmail && (
                                <a 
                                  href={`mailto:${inq.contactEmail}?subject=Cake%20Urban%3A%20Custom%20Designer%20Consultation`}
                                  className="w-full"
                                >
                                  <Button 
                                    className="w-full rounded-xl bg-[#DFB15B] hover:bg-white text-[#140603] text-[9px] uppercase font-black tracking-widest h-11 cursor-pointer"
                                  >
                                    Reach Out Client (Email)
                                  </Button>
                                </a>
                              )
                            )}

                            <Button 
                              onClick={() => handleDeleteInquiry(inq.id)}
                              variant="outline" 
                              className="w-full rounded-xl border-white/10 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 h-10 cursor-pointer text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-1"
                            >
                              <Trash className="w-3.5 h-3.5" /> Delete Inquiry
                            </Button>
                          </div>

                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* 🧁 TAB 4: BOUTIQUE CATALOG GALLERY INVENTORY */}
              <TabsContent value="products" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.length === 0 ? (
                    <div className="col-span-full py-24 text-center space-y-4 bg-[#26130F]/45 rounded-3xl border border-[#DFB15B]/15">
                      <Package className="w-12 h-12 text-[#DFB15B]/20 mx-auto" />
                      <p className="text-xs text-[#FFFDFB]/60 font-semibold italic">No active confections in catalog.</p>
                    </div>
                  ) : (
                    products.map(p => (
                      <Card key={p.id} className="rounded-[44px] border border-[#DFB15B]/15 overflow-hidden bg-[#26130F]/45 shadow-xl flex flex-col justify-between text-left">
                        
                        <div className="aspect-[4/3] relative p-3 bg-[#140603]/40">
                          <img src={p.images?.[0]} className="w-full h-full object-cover rounded-[32px]" alt={p.name} />
                          
                          <div className="absolute top-6 right-6 flex flex-col gap-1.5 items-end">
                            {/* Stock Toggle status Badge click */}
                            <button
                              type="button"
                              onClick={() => handleToggleStock(p.id, p.stockStatus)}
                              className="focus:outline-none"
                            >
                              <Badge className={`border-none font-bold text-[8px] tracking-widest uppercase px-3 py-1.5 rounded-full cursor-pointer shadow-xl ${
                                p.stockStatus === 'in-stock' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                              }`}>
                                {p.stockStatus === 'in-stock' ? '🟢 In Stock' : '🔴 Baking Reservation'}
                              </Badge>
                            </button>

                            {p.seoSlug && (
                              <Badge className="bg-[#DFB15B] text-[#140603] border-none shadow-md font-black text-[8px] uppercase tracking-wider px-3.5 py-1.5 rounded-full flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-[#140603]" /> SEO Active
                              </Badge>
                            )}
                          </div>
                        </div>

                        <CardContent className="p-8 flex-1 flex flex-col justify-between space-y-6">
                          <div className="space-y-4">
                            <div>
                              <p className="text-[9px] uppercase tracking-[0.2em] font-black text-white/30 block mb-0.5">confectionery item</p>
                              <h3 className="font-display font-black text-white text-xl tracking-tight italic leading-tight">{p.name}</h3>
                              <p className="text-[10px] text-[#FFFDFB]/50 font-medium italic leading-relaxed line-clamp-2 mt-1">{p.description}</p>
                            </div>

                            {/* Info Lists */}
                            <div className="space-y-1.5">
                              <p className="text-[9px] font-bold text-[#DFB15B] uppercase tracking-widest leading-none">
                                Categories: <span className="text-white/70 font-sans font-medium lowercase tracking-normal">{p.categories?.join(', ')}</span>
                              </p>
                              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-none">
                                Flavors: <span className="text-white/75 font-sans font-medium">{p.flavors?.join(', ')}</span>
                              </p>
                            </div>
                          </div>

                          {/* Catalog Pricing Actions */}
                          <div className="pt-4 border-t border-white/15 flex items-center justify-between">
                            {editingPriceId === p.id ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-white text-lg font-serif italic text-[#DFB15B]">₹</span>
                                <Input 
                                  type="number"
                                  value={tempPriceValue}
                                  onChange={e => setTempPriceValue(e.target.value)}
                                  className="w-20 bg-[#140603] rounded-lg border-white/10 text-xs font-mono font-bold h-9 text-white px-2 py-1"
                                />
                                <Button 
                                  onClick={() => handleSavePrice(p.id)}
                                  className="h-9 px-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[9px] font-black tracking-wider uppercase cursor-pointer"
                                >
                                  Save
                                </Button>
                                <Button 
                                  onClick={() => setEditingPriceId(null)}
                                  variant="ghost"
                                  className="h-9 px-1 text-white/40 text-[9px] font-bold rounded-lg cursor-pointer"
                                >
                                  X
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-0.5">
                                <span className="font-serif font-black text-[#DFB15B] text-2xl italic">₹{p.price}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingPriceId(p.id);
                                    setTempPriceValue(p.price.toString());
                                  }}
                                  className="text-[9px] uppercase tracking-widest text-[#FFFDFB]/40 block hover:text-[#DFB15B] font-bold cursor-pointer underline"
                                >
                                  Adjust Price
                                </button>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <Button 
                                onClick={() => initiateProductEdit(p)}
                                className="bg-[#DFB15B] hover:bg-white text-[#140603] text-[9px] font-black uppercase tracking-widest h-10 px-3.5 rounded-xl cursor-pointer transition-all duration-300 shadow-[0_2px_10px_rgba(223,177,91,0.15)] font-bold"
                              >
                                Edit Details
                              </Button>
                              <Button 
                                onClick={() => handleDeleteProduct(p.id)}
                                variant="ghost" 
                                className="rounded-xl border border-white/5 hover:border-rose-500/20 text-white/30 hover:text-rose-400 p-2 h-10 w-10 cursor-pointer transition duration-300"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                        </CardContent>

                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* 💬 TAB 5: GRAPHIC FEEDBACK STUDIO (REVIEWS MODERATION) */}
              <TabsContent value="reviews" className="mt-8">
                <Card className="rounded-[44px] border border-[#DFB15B]/15 shadow-xl bg-[#26130F]/45 overflow-hidden text-left">
                  <CardHeader className="p-8 border-b border-[#DFB15B]/10 bg-[#140603]/40">
                    <CardTitle className="text-lg md:text-xl font-serif font-bold text-white flex items-center gap-2">
                      <MessageSquare className="text-[#DFB15B] w-5 h-5" /> Customer Feedback & Critique Moderation
                    </CardTitle>
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/40">Audit critiques submitted by guest accounts to maintain brand standards</p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[500px] w-full">
                      {reviews.length === 0 ? (
                        <div className="py-24 text-center space-y-4">
                          <MessageSquare className="w-12 h-12 text-[#DFB15B]/20 mx-auto" />
                          <p className="text-xs text-[#FFFDFB]/60 font-semibold italic">No guest feedback submissions recorded in Firestore.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-[#DFB15B]/10">
                          {reviews.map(rev => {
                            // Find product name
                            const relProd = products.find(p => p.id === rev.productId);
                            return (
                              <div key={rev.id} className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/[0.012] transition duration-300">
                                
                                <div className="space-y-2.5 flex-1">
                                  <div className="flex flex-wrap items-center gap-2.5">
                                    <span className="text-xs font-bold font-sans text-white bg-[#140603] border border-white/5 px-3 py-1.5 rounded-xl">
                                      Author: {rev.userName || 'Boutique Curator'}
                                    </span>
                                    {/* Star ratings */}
                                    <div className="flex items-center gap-0.5 text-[#DFB15B]">
                                      {Array.from({ length: 5 }).map((_, idx) => (
                                        <Star key={idx} className={`w-3.5 h-3.5 ${idx < (rev.rating || 5) ? 'fill-[#DFB15B]' : 'opacity-20'}`} />
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <p className="text-xs font-medium text-[#FFFDFB]/80 italic max-w-2xl leading-relaxed">
                                    &ldquo;{rev.comment}&rdquo;
                                  </p>

                                  {relProd && (
                                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#DFB15B]/75 block pt-1 bg-[#DFB15B]/5 px-2.5 py-1 rounded border border-[#DFB15B]/10 max-w-fit leading-none">
                                      Target Confection: {relProd.name}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-4 text-xs font-mono text-white/30 shrink-0 select-none">
                                  <span>{rev.createdAt ? new Date(rev.createdAt.seconds * 1000).toLocaleDateString() : 'Boutique Record'}</span>
                                  <Button
                                    onClick={() => handleDeleteReview(rev.id)}
                                    variant="ghost"
                                    className="text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl h-11 px-4 text-xs font-bold uppercase cursor-pointer"
                                  >
                                    Moderate / Delete
                                  </Button>
                                </div>

                              </div>
                            );
                          })}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

          </motion.div>
        )}

          </div>
        </Tabs>
      </AnimatePresence>

    </div>
  );
}
