/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AnimatePresence } from 'motion/react';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import CustomOrder from './pages/CustomOrder';
import Contact from './pages/Contact';
import About from './pages/About';
import LocationSEOPage from './pages/LocationSEOPage';
import Blog from './pages/Blog';
import SeoStudio from './pages/SeoStudio';
import { seedProducts } from './lib/seed';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
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
        
        {/* Dynamic Local SEO Pages for Delhi NCR */}
        <Route path="/bakery-in-delhi" element={<LocationSEOPage />} />
        <Route path="/bakery-in-noida" element={<LocationSEOPage />} />
        <Route path="/bakery-in-faridabad" element={<LocationSEOPage />} />
        <Route path="/bakery-in-gurgaon" element={<LocationSEOPage />} />
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
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
}


