/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { seedProducts } from './lib/seed';

const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const CustomOrder = lazy(() => import('./pages/CustomOrder'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const LocationSEOPage = lazy(() => import('./pages/LocationSEOPage'));
const Blog = lazy(() => import('./pages/Blog'));
const SeoStudio = lazy(() => import('./pages/SeoStudio'));
const Legal = lazy(() => import('./pages/Legal'));

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-8 h-8 text-[#DE9088] animate-spin" />
      <p className="text-[10px] uppercase tracking-[0.25em] font-black text-[#3B1F17]/40 italic">
        Preparing Artisan Confections...
      </p>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/custom-order" element={<CustomOrder />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/seo-studio" element={<SeoStudio />} />
        <Route path="/legal" element={<Legal />} />
        
        {/* Dynamic Local SEO Pages for Delhi NCR */}
        <Route path="/bakery-in-delhi" element={<LocationSEOPage />} />
        <Route path="/bakery-in-noida" element={<LocationSEOPage />} />
        <Route path="/bakery-in-faridabad" element={<LocationSEOPage />} />
        <Route path="/bakery-in-gurgaon" element={<LocationSEOPage />} />
        
        {/* Sector and Neighborhood Specific Local SEO pages */}
        <Route path="/cake-delivery-faridabad-sector-15" element={<LocationSEOPage />} />
        <Route path="/cake-delivery-faridabad-sector-31" element={<LocationSEOPage />} />
        <Route path="/best-cake-in-greenfield-faridabad" element={<LocationSEOPage />} />
        <Route path="/cake-delivery-noida-sector-62" element={<LocationSEOPage />} />
        <Route path="/cake-delivery-gurgaon-dlf" element={<LocationSEOPage />} />
        <Route path="/cake-delivery-delhi-dwarka" element={<LocationSEOPage />} />
        
        {/* Sitemap Specific Dynamic Mappings */}
        <Route path="/cake-delivery-in-faridabad" element={<LocationSEOPage />} />
        <Route path="/designer-cakes-in-noida" element={<LocationSEOPage />} />
        <Route path="/custom-cakes-in-gurgaon" element={<LocationSEOPage />} />
        <Route path="/photo-cakes-in-ghaziabad" element={<LocationSEOPage />} />

        <Route path="/custom-cakes-noida" element={<LocationSEOPage />} />
        <Route path="/birthday-cakes-delhi" element={<LocationSEOPage />} />
        <Route path="/anniversary-cakes-faridabad" element={<LocationSEOPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  useEffect(() => {
    seedProducts();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <AnimatedRoutes />
        </Suspense>
      </Layout>
    </Router>
  );
}


