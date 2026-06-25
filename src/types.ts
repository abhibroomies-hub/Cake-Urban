export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categories: string[];
  occasions: string[];
  flavors: string[];
  images: string[];
  stockStatus: 'in-stock' | 'out-of-stock';
  isCustomizable: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  weights?: number[];
  dietary?: string[];
  createdAt?: any;
  seoTitle?: string;
  seoSlug?: string;
  seoKeywords?: string[];
  seoMetaDescription?: string;
  seoSchema?: string;
  instagramCaption?: string;
  pinterestPin?: {
    title: string;
    description: string;
  };
  reviewsCount?: number;
  rating?: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedWeight?: number;
  selectedFlavor?: string;
  cakeMessage?: string;
  eggless?: boolean;
  extras?: string[];
  additionalInstructions?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  addresses?: Address[];
  role: 'customer' | 'admin';
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  line1: string;
  line2?: string;
  sector: string;
  city: string;
  pincode: string;
}

export interface Order {
  id: string;
  userId?: string;
  guestEmail?: string;
  phoneNumber?: string;
  items: CartItem[];
  total: number;
  status: 'new' | 'baking' | 'out-for-delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: Address;
  deliveryDate: string;
  deliverySlot: string;
  createdAt: string;
  cakeInstructions?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}
