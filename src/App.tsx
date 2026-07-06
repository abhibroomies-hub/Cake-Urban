/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { ThemeProvider } from './lib/theme';
import { seedProducts } from './lib/seed';

// Lazy load all pages for peak performance
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const CustomOrder = lazy(() => import('./pages/CustomOrder'));
const Profile = lazy(() => import('./pages/Profile'));
const Blog = lazy(() => import('./pages/Blog'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SeoStudio = lazy(() => import('./pages/SeoStudio'));
const SeoDirectory = lazy(() => import('./pages/SeoDirectory'));
const LocationSEOPage = lazy(() => import('./pages/LocationSEOPage'));
const Legal = lazy(() => import('./pages/Legal'));
const AuthPortal = lazy(() => import('./pages/AuthPortal'));

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-8 h-8 text-[#DFB15B] animate-spin" />
      <p className="text-[10px] uppercase tracking-[0.25em] font-black text-[#DFB15B]/50 italic">
        Loading CakeUrban Experience...
      </p>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Core Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/custom-order" element={<CustomOrder />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/seo-studio" element={<SeoStudio />} />
        <Route path="/seo-directory" element={<SeoDirectory />} />
        <Route path="/legal" element={<Legal />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<AuthPortal />} />
        <Route path="/signup" element={<AuthPortal />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/account" element={<Profile />} />

        {/* Dynamic catch-all for Local SEO Pages */}
        <Route path="/:slug" element={<LocationSEOPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  useEffect(() => {
    seedProducts().catch(err => console.error("Auto-seeding failure on startup:", err));
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <AnimatedRoutes />
          </Suspense>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}
