import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Map, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  Cake, 
  Star, 
  ShoppingBag, 
  ArrowRight,
  Shield,
  Sparkle
} from 'lucide-react';
import SEO from '../components/SEO';
import { FALLBACK_PRODUCTS } from '../lib/fallbackProducts';
import { ProductCard } from '../components/ProductCard';

interface LocalFAQ {
  q: string;
  a: string;
}

interface LocationDetails {
  city: string;
  title: string;
  description: string;
  keywords: string;
  heroText: string;
  subText: string;
  deliveryTime: string;
  charge: string;
  faqs: LocalFAQ[];
}

const LOCATION_DATA_MAP: Record<string, LocationDetails> = {
  'bakery-in-delhi': {
    city: 'Delhi',
    title: 'Luxury Bakery Shop in Delhi - Gourmet Cakes & Pastries',
    description: 'Order premium luxury cakes, French macarons, and bespoke celebration hampers in Delhi. Hand-crafted using pure dairy and highest grade ingredients. Safe 100% contactless hand catering.',
    keywords: 'best bakery in delhi, cake delivery delhi, premium cakes delhi, online cakes order south delhi, eggless cakes delhi',
    heroText: 'Delhi\'s Royal Artisanal Bakery Enclave',
    subText: 'Indulge in royal chocolate truffles, organic berry cheesecakes, and custom tiered monuments delivered pristine across South Delhi, West Delhi, Dwarka, and North Delhi.',
    deliveryTime: '60-90 minutes delivery',
    charge: 'Calculated at checkout',
    faqs: [
      { q: "Where does Cake Urban deliver in Delhi?", a: "We hand-deliver to South Delhi (Vasant Kunj, GK, Saket, etc.), West Delhi (Dwarka, Punjabi Bagh), Central Delhi, and North Delhi using our climate-controlled temperature-managed vans." },
      { q: "Are eggless varieties prepared separately?", a: "Yes, 100%. We operate a fully sanitized, independent pure veg baking enclave for all eggless and vegan requests to avoid cross-contamination." },
      { q: "Do you offer late midnight deliveries in Delhi?", a: "Yes, we offer late surprise slots in Delhi from 11:30 PM to 12:00 midnight for birthday announcements and midnight surprises." }
    ]
  },
  'bakery-in-noida': {
    city: 'Noida',
    title: 'Elite Cake Shop in Noida - Hand-crafted Eggless Delicacies',
    description: 'Discover the premier designer cake bakery in Noida. Order bespoke chocolate gateaux, theme cakes, and warm fresh pastries delivered to your doorstep in Noida and Greater Noida.',
    keywords: 'cake shop in noida, cake delivery noida, eggless cakes noida, best birthday cakes noida, customized cakes noida',
    heroText: 'Elegant Artisanal Baking in Noida',
    subText: 'Sourcing standard Belgian chocolate, fresh orchard strawberries, and double-whipped real dairy cream for Noida Sector 15 to 150, and Greater Noida.',
    deliveryTime: 'Same-day 60 mins delivery',
    charge: 'Calculated at checkout',
    faqs: [
      { q: "Do you cater customized theme cakes to Greater Noida?", a: "Yes! Our Custom Studio designs tier-monuments and character fondant bakes and ships them with dedicated care to all sectors of Noida & Greater Noida." },
      { q: "Is same-day cake delivery possible in Noida?", a: "Absolutely. Standard orders like Belgian Truffles and Pineapple Paradise can be ordered and delivered within 1 to 2 hours of payment confirmation." }
    ]
  },
  'bakery-in-faridabad': {
    city: 'Faridabad',
    title: 'Faridabad\'s Bestseller Premium Cake Shop - Cake Urban',
    description: 'Cake Urban is Faridabad\'s elite home-grown premium bakery. Hand-designed cakes, instant cupcakes, brownies & customized hampers delivered across Faridabad.',
    keywords: 'best bakery in faridabad, cake delivery faridabad, custom cakes faridabad, birthday cakes near me, eggless pastries faridabad',
    heroText: 'Home of Faridabad\'s Finest Master bakers',
    subText: 'Proudly hand-catering pristine celebrations inside Sector 14, 15, 21, Greenfield, Greater Faridabad, and all neighboring residential sectors.',
    deliveryTime: 'Instant 30-45 mins delivery',
    charge: 'Free internal residential delivery above ₹500',
    faqs: [
      { q: "Where is the physical Cake Urban boutique located?", a: "We operate our premium micro-bakery center in Faridabad, allowing extremely fast 30-minute hot delivery cycles to nearby sectors." },
      { q: "Can I directly brief the Chef for custom cupcakes?", a: "Yes, our Custom Studio allows you to upload reference reference images and add specific flavor requirements for direct Chef action." }
    ]
  },
  'bakery-in-gurgaon': {
    city: 'Gurgaon',
    title: 'Premium Artisan Bakery in Gurgaon (Gurugram) - Elegant Cakes',
    description: 'Order standard premium cakes and luxury dessert curation boxes in Gurgaon. Hand-delivered across DLF Phase 1-5, Golf Course Road, Sohna Road, and cyber enclaves.',
    keywords: 'bakery in gurgaon, premium cake shop gurgaon, custom cake delivery gurugram, birthday cake order gurugram, eggless cakes gurgaon',
    heroText: 'Gurgaon\'s Elite Gourmet Cake Atelier',
    subText: 'Bespoke Belgian chocolate truffles, organic tea loaves, and customized kids birthday theme bakes hand-delivered to luxury residential enclaves.',
    deliveryTime: '60-80 minutes delivery',
    charge: 'Calculated at checkout',
    faqs: [
      { q: "Do you deliver to DLF Phase 1-5 and Golf Course Extension?", a: "Yes, we run regular daily delivery runs to DLF, Golf Course Road, Sohna Road, Sector 80-95, and suburban residential zones." },
      { q: "Can we book a corporate cake bulk order?", a: "We provide bespoke corporate branding bakes, customized pastries, and artisan gift baskets with custom logos and themes." }
    ]
  },
  'custom-cakes-noida': {
    city: 'Noida (Custom Spec)',
    title: 'Customized & Theme Cakes in Noida - Custom Studio',
    description: 'Browse outstanding design models or upload reference reference files to have Noida\'s champion chefs design your dream customized birthday block cake.',
    keywords: 'custom cakes noida, theme cakes noida, designer cakes noida, photo cake order noida, kids birthday cake noida',
    heroText: 'Bespoke Theme Cakes customized for Noida',
    subText: 'Convert any inspiration - digital references, toy shapes, luxury brand colors, or 3D characters - into delicious hand-sculpted celebration cakes.',
    deliveryTime: 'Requires 12-24 hours advance bake time',
    charge: 'Calculated at checkout',
    faqs: [
      { q: "How do I place a custom design request?", a: "Enter our digital Custom Studio page, choose the approximate weight, input flavor choice, and upload your reference image or sketch." },
      { q: "Are custom 3D fondant characters edible?", a: "Our characters are shaped by hand with high-grade imported Swiss sugar paste and are 100% edible and premium." }
    ]
  },
  'birthday-cakes-delhi': {
    city: 'Delhi (Birthday Spec)',
    title: 'Delicious Birthday Cakes Online Delivery in Delhi',
    description: 'Make birthdays brilliant! Double-whipped dark chocolate, floral velvet swirls, and cute bento surprise boxes inside Delhi NCR.',
    keywords: 'birthday cake delhi, online birthday cake delivery delhi, best birthday cake shop delhi, eggless birthday cakes',
    heroText: 'The Birthday Masterpieces of Delhi',
    subText: 'Our birthday enclaves are packed with pristine sparklers, handcrafted golden crown toppers, matching candles and fully customized wish labels.',
    deliveryTime: 'Within 90 mins or midnight slot',
    charge: 'Calculated at checkout',
    faqs: [
      { q: "Do you provide complimentary candles & knives?", a: "Absolutely! Every single birthday cake order includes a custom design cake knife, matches, and fancy pastel candles." },
      { q: "Can we have a printed edible photo on the birthday cake?", a: "Yes, we print clear edible photo cakes using standard food-quality starch inks." }
    ]
  },
  'anniversary-cakes-faridabad': {
    city: 'Faridabad (Anniversary Spec)',
    title: 'Anniversary Cakes in Faridabad - Elegant Anniversary Delights',
    description: 'Elegant tiered wedding cakes, rose bouquet swatches, and red velvet cheese creations designed beautifully to celebrate years of togetherness in Faridabad.',
    keywords: 'anniversary cake faridabad, wedding anniversary cakes, premium couple cake, red velvet anniversary cake faridabad',
    heroText: 'Handcrafting Romantic Love Journeys',
    subText: 'Celebrate years of togetherness with our elite Red Velvet Cheese Frosting or signature rose design boxes crafted fresh inside Faridabad.',
    deliveryTime: 'Instant 30 mins delivery',
    charge: 'Calculated at checkout',
    faqs: [
      { q: "Do you bake multi-tiered anniversary cakes?", a: "We specialize in two-tier and three-tier anniversary cakes with robust support bases for smooth delivery transit." },
      { q: "Can we customize the text message on plaque?", a: "Yes, you can add any personalized couple wish which our chefs will hand-pipe on a premium chocolate slab placed on the cake." }
    ]
  },
  'cake-delivery-in-faridabad': {
    city: 'Faridabad Delivery Hub',
    title: 'Same Day Eggless Cake Delivery in Faridabad - Cake Urban',
    description: 'Craving sugar? Order birthday cakes, premium pastries, brownies, and hampers online in Faridabad with rapid 30-45 minutes home delivery. 100% pure vegetarian-certified ovens.',
    keywords: 'cake delivery in faridabad, online cake delivery faridabad, eggless cake order faridabad, same day cake delivery faridabad, bakery sector 15 faridabad',
    heroText: 'Faridabad\'s Lighting Fast Cake Delivery Hub',
    subText: 'Indulge in freshly baked pastries and luxury chocolate truffles dispatched straight from our Sector 15 ovens to your doorstep in minutes.',
    deliveryTime: '30 to 45 minutes instant dispatch',
    charge: 'Free delivery above ₹500 across Faridabad',
    faqs: [
      { q: "What is your fastest delivery time in Faridabad?", a: "For our catalog favorites like Belgian Chocolate Truffle and Fresh Fruit cakes, we can bake, pack and deliver in just 30 to 45 minutes." },
      { q: "Do you support surprise midnight deliveries in Faridabad?", a: "Yes, we support premium midnight deliveries between 11:30 PM & 12:00 AM across Faridabad residential sectors." }
    ]
  },
  'designer-cakes-in-noida': {
    city: 'Noida Premium Studio',
    title: 'Customized Designer Theme Cakes in Noida - Custom Studio',
    description: 'Handcrafting spectacular designer cakes, cartoon shapes, makeup boxes, and customized tiered creations in Noida. Pure vegetarian bakes optimized for perfect celebration events.',
    keywords: 'designer cakes in noida, customized theme cake noida, birthday designer cake noida, baby shower cakes noida, top cake shop noida',
    heroText: 'Noida\'s Landmark Designer Cake Studio',
    subText: 'Translate your vision, doodles, or Pinterest boards into delicious hand-sculpted buttercream and edible fondant masterpieces.',
    deliveryTime: '12-24 hours advance ordering',
    charge: 'Calculated at checkout based on location',
    faqs: [
      { q: "Can I choose my own customized shape and character?", a: "Absolutely! Simply drop your reference picture or sketch in our Custom Studio page and mention your flavor preferences." },
      { q: "Are all components of Noida designer cakes edible?", a: "Our hand-sculpted toppers are crafted from premium Swiss fondant paste and are 100% food-safe and delicious." }
    ]
  },
  'custom-cakes-in-gurgaon': {
    city: 'Gurgaon Custom Atelier',
    title: 'Customized & Tiered Theme Cakes in Gurgaon - Cake Urban',
    description: 'Indulge in customized corporate branding cakes, multi-tier wedding confections, and theme birthday cakes in Gurgaon. 100% vegetarian, organic recipes.',
    keywords: 'custom cakes in gurgaon, customized birthday cake gurgaon, kids theme cakes gurugram, dlf phase 3 cake delivery, premium customized bakes',
    heroText: 'Gurgaon\'s Premier Custom Cake Atelier',
    subText: 'Catering luxurious celebrations, kids birthday motifs, and brand launch milestones across DLF, Golf Course Road, and Gurgaon enclaves.',
    deliveryTime: 'Requires 12 to 24 hours prep time',
    charge: 'Free delivery across Golf Course Ext Road',
    faqs: [
      { q: "Can we order customized gift hampers or branding cupcakes?", a: "Yes! We specialize in premium branded bulk corporate bakes and bespoke dessert hampers with edible logo tags." },
      { q: "Do you deliver to cyber sectors and corporate tech parks?", a: "We run fully refrigerated van dispatch routes directly to corporate tech parks and DLF complexes with customized setups." }
    ]
  },
  'photo-cakes-in-ghaziabad': {
    city: 'Ghaziabad Printed Confections',
    title: 'Edible Photo Printed Cake Delivery in Ghaziabad - Cake Urban',
    description: 'Cherish memories with high-resolution edible photo cakes ordered online in Ghaziabad. Certified organic starch ink, fully eggless, and safe cream frosting.',
    keywords: 'photo cakes in ghaziabad, edible picture cake ghaziabad, print photo cake online, custom picture cake delivery',
    heroText: 'High-Res Edible Photo Cakes in Ghaziabad',
    subText: 'Transform your precious family moments, corporate designs, or character poster prints into customized, delicious, safe edible photo frames.',
    deliveryTime: 'Same-day delivery within 2-3 hours',
    charge: 'Calculated based on residential sectors',
    faqs: [
      { q: "Is the photo print paper on the cake edible?", a: "Yes! We use 100% safe, certified vegetarian potato/starch edible sheets and food-grade organic coloring ink." },
      { q: "How should I submit the photo for printing?", a: "You can upload high-resolution images during checkout or custom orders page to ensure a crisp, clean photo print." }
    ]
  },
  'cake-delivery-faridabad-sector-15': {
    city: 'Faridabad Sector 15',
    title: 'Top Cake Delivery in Sector 15 Faridabad - Cake Urban',
    description: 'Craving freshly baked cakes in Sector 15 Faridabad? Order eggless Belgian chocolate truffles, red velvet romance, and photo cakes for instant 30-min home delivery.',
    keywords: 'cake delivery faridabad sector 15, bakery in sector 15 faridabad, best cake shop faridabad sector 15, online eggless cakes faridabad',
    heroText: 'Premium Oven Delivery in Faridabad Sector 15',
    subText: 'Located right in Sector 15, we dispatch our signature warm chocolate crusts and seasonal toppings within minutes of baking.',
    deliveryTime: 'Rapid 20-35 mins delivery',
    charge: 'Complimentary delivery in Sector 15 above ₹499',
    faqs: [
      { q: "Is home delivery free in Sector 15 Faridabad?", a: "Yes, we offer completely free home delivery for all orders above ₹499 within Sector 15 and surrounding sectors." },
      { q: "Can I self-pickup my cake from your kitchen?", a: "Yes, you can choose the self-pickup option during checkout to collect your fresh cake directly from our local center." }
    ]
  },
  'cake-delivery-noida-sector-62': {
    city: 'Noida Sector 62',
    title: 'Chef Special Cakes in Noida Sector 62 - Free Office Delivery',
    description: 'Looking for a cake shop in Noida Sector 62? Order high-end customized cakes, corporate hampers, and fresh dessert jars for rapid delivery to IT parks or homes.',
    keywords: 'cake delivery noida sector 62, cake shop in sector 62 noida, office cake delivery noida, eggless birthday cakes sector 62',
    heroText: 'Luxurious Confections for Sector 62 Noida',
    subText: 'Delicious Belgian cocoa bakes and fresh pineapple towers crafted for IT park events, birthday surprises, and home celebrations in Sector 62.',
    deliveryTime: '45-60 mins temperature-safe delivery',
    charge: 'Calculated at checkout',
    faqs: [
      { q: "Do you deliver to corporate offices in Sector 62 IT Parks?", a: "Yes, we regularly deliver customized celebration cakes, cupcakes, and snack hampers directly to IT parks and offices in Sector 62 with proper gate entry care." },
      { q: "Do you offer custom logo engraving on office celebration cakes?", a: "Certainly. Our Custom Studio can print high-resolution edible logos or customized messages on premium chocolate bars for any team celebration." }
    ]
  },
  'cake-delivery-gurgaon-dlf': {
    city: 'Gurgaon DLF Phase',
    title: 'Premium Cake Delivery in DLF Phase 1-5 Gurgaon - Cake Urban',
    description: 'Savor organic, pure-grade eggless cakes and hand-rolled pastries in DLF Phase 1, 2, 3, 4, 5 Gurgaon. Safely delivered in specialized climate-controlled vans.',
    keywords: 'cake delivery gurgaon dlf, best bakery dlf phase 3, customized cake delivery gurugram, dlf phase 4 cake shop, eggless cakes dlf phase 5',
    heroText: 'DLF Phase Elite Celebration Hub',
    subText: 'Baking spectacular theme cakes and single-slice treats of unparalleled tier-chef craftsmanship, serving all DLF phases and Golf Course Road.',
    deliveryTime: 'Same-day 45-75 mins delivery',
    charge: 'Calculated at checkout',
    faqs: [
      { q: "Do you cover all DLF Phases in Gurgaon?", a: "Yes, we offer lightning-fast, premium van deliveries to DLF Phase 1, Phase 2, Phase 3, Phase 4, Phase 5, and Sector 25/56 zones with pristine packaging." },
      { q: "Are cold-storage cheesecakes delivered safely to Gurgaon?", a: "Yes! All cold-set items like our blueberry cheesecake are shipped in frozen gel-pack coolers, ensuring they arrive chilled and perfect." }
    ]
  },
  'cake-delivery-delhi-dwarka': {
    city: 'Dwarka Delhi',
    title: 'Top Eggless Cake Delivery in Dwarka Delhi - Cake Urban',
    description: 'Order freshly baked, 100% vegetarian designer cakes, fruit cakes, and standard celebration boxes in Dwarka, Delhi. Trust our sanitized separate ovens.',
    keywords: 'cake delivery delhi dwarka, best cake shop in dwarka, online eggless cake dwarka delhi, custom birthday cakes dwarka',
    heroText: 'Dwarka\'s Pure Vegetarian Cake Atelier',
    subText: 'Delicious butterscotch towers, truffle crowns, and adorable children custom photo cakes delivered straight to your residential sector in Dwarka.',
    deliveryTime: 'Same-day 60-90 mins delivery',
    charge: 'Free delivery above ₹799',
    faqs: [
      { q: "Can we request custom theme cakes in Dwarka Sector 10/12/22?", a: "Yes! We serve all residential sectors of Dwarka with our premium Custom Studio designs. Simply share your custom references with the Chef." },
      { q: "Is the kitchen in Dwarka fully pure vegetarian-certified?", a: "Indeed. All our eggless bakes are prepared in a dedicated, certified 100% vegetarian sanitized enclave." }
    ]
  },
  'cake-delivery-faridabad-sector-31': {
    city: 'Sector 31 Faridabad (NIT & 15km Radius)',
    title: 'Cake Delivery in Sector 31 Faridabad - Best Bakery Shop Near me',
    description: 'Order highly curated, 100% vegetarian cakes for delivery in Sector 31 Faridabad & 15km radius (Sector 14, 15, 16, 21, 28, 30, 35, 37, NIT, Greenfields Colony, Surajkund Road).',
    keywords: 'cake delivery in sector 31 faridabad, best cake shop near sector 31 faridabad, eggless cakes sector 31 faridabad, birthday cake faridabad sector 31, cake delivery near NIT faridabad, greenfields colony cake home delivery, premium cake shop faridabad sector 21, cake shop near sector 15 faridabad, midnight cake delivery faridabad sector 31',
    heroText: 'Ultra-Fast Pure Eggless Cake Delivery in Sector 31 Faridabad',
    subText: 'Serving Sector 31, Sector 14, 15, 16, 21, 28, 30, 34, 35, 37, 46, NIT Faridabad, Greenfield Colony, Charmwood, and Surajkund within a rapid 30-minute hot-dispatch cycle.',
    deliveryTime: 'Superfast 30-45 Mins Transit (15km radius guaranteed)',
    charge: 'Free home delivery for orders above ₹499',
    faqs: [
      { q: "What areas within 15km of Sector 31 Faridabad do you cover for same-day delivery?", a: "We cover every single corner within a 15km radius of Sector 31, including Sector 14, 15, 16, 17, 21A/21D, 28, 29, 30, 31, 35, 37, NIT Faridabad (1, 2, 3, 5), Greenfield Colony, Charmwood, Surajkund Road, Sarai, and Mathura Road." },
      { q: "Do you offer pure vegetarian eggless cakes in Sector 31?", a: "Absolutely! Every cake baked for Sector 31 Faridabad is 100% vegetarian, prepared in a certified eggless-only sanitary zone, ensuring perfect religious and dietary satisfaction." },
      { q: "Can we order midnight customized designer cakes in Faridabad Sector 31?", a: "Yes, we specialize in midnight delivery (11:30 PM - 12:00 AM) across Sector 31 and surrounding neighborhoods. Customizations are welcomed by our head chefs!" }
    ]
  },
  'best-cake-in-greenfield-faridabad': {
    city: 'Greenfield Colony Faridabad',
    title: 'Best Cake in Greenfield Colony Faridabad | 100% Eggless Home Delivery',
    description: 'Looking for the best cake in Greenfield Colony Faridabad? Order eggless red velvet deluxe, rich Belgian chocolate truffle, and customized theme cakes for door delivery within 30 mins.',
    keywords: 'best cake in greenfield faridabad, cake delivery in greenfield colony faridabad, eggless cakes greenfield faridabad, best cake shop near greenfields colony, customized cake delivery greenfield plc, online bakery shop greenfield colony faridabad',
    heroText: 'Greenfield Colony\'s Ultimate Artisanal Cake Corner',
    subText: 'Delivering hand-creamed custom bakes, premium bento gems, and signature celebration layers directly into Greenfield Colony gates inside 30-40 mintues flat.',
    deliveryTime: 'Rapid 30-40 mins delivery inside Greenfield Colony',
    charge: 'Free delivery above ₹499 in Greenfields',
    faqs: [
      { q: "Is home delivery fully free inside Greenfield Colony Faridabad?", a: "Yes, we offer complimentary contactless doorstep delivery within Greenfield Colony and immediately surrounding areas for all orders above ₹499." },
      { q: "Where closest is your oven located to Greenfield Colony?", a: "We operate our major oven facility extremely close by, enabling super-fast, warm, fresh product handovers with no transport damages." },
      { q: "Can we get custom shapes, photos, or message plaques in Greenfields?", a: "Absolutely! You can use our customized studio or share ideas directly with our Head Chef to get high-resolution edible photos and beautiful sugar models made fresh." }
    ]
  }
};

export function generateDynamicSEO(slug: string): LocationDetails {
  const cleanSlug = slug.toLowerCase();

  let city = 'Faridabad & Delhi NCR';
  let title = 'Premium Artisan Cakes Online Home Delivery';
  let description = 'Order 100% vegetarian, eggless designer cakes, cupcakes, and chocolate truffles online at Cake Urban. Fast home delivery within minutes.';
  let keywords = `${slug.replace(/-/g, ' ')}, cake delivery, online cake shop, eggless cakes near me`;
  let heroText = 'Artisanal Cakes Crafted with Passion';
  let subText = 'Delivering fresh cream cakes, customized celebration creations, and premium bento options to your door with temperature-controlled precision.';
  let deliveryTime = '30-45 minutes rapid transit';
  let charge = 'Free home delivery for orders above ₹499';
  
  let faqs = [
    { q: "What makes Cake Urban different from normal bakeries?", a: "We operate dedicated 100% pure vegetarian-certified ovens using real gourmet ingredients like Belgian chocolate and Madagascar vanilla. No cheap synthetic gels or artificial fats." },
    { q: "Do you offer safe contactless delivery?", a: "Yes, our team is certified in health-safe transits. All orders are moved in temperature-regulated containers to avoid cream melts." },
    { q: "Can I customize message plates and shapes?", a: "Absolutely! You can upload custom layouts in our Custom Studio or request custom plates directly during ordering." }
  ];

  // Specific dynamic rules based on slug words:
  if (cleanSlug.includes('sector-15')) {
    city = 'Sector 15 Faridabad';
  } else if (cleanSlug.includes('sector-16')) {
    city = 'Sector 16 Faridabad';
  } else if (cleanSlug.includes('sector-21')) {
    city = 'Sector 21 Faridabad';
  } else if (cleanSlug.includes('sector-28')) {
    city = 'Sector 28 Faridabad';
  } else if (cleanSlug.includes('sector-31')) {
    city = 'Sector 31 Faridabad';
  } else if (cleanSlug.includes('sector-37')) {
    city = 'Sector 37 Faridabad';
  } else if (cleanSlug.includes('sector-46')) {
    city = 'Sector 46 Faridabad';
  } else if (cleanSlug.includes('greenfield')) {
    city = 'Greenfield Colony Faridabad';
  } else if (cleanSlug.includes('nit-faridabad') || cleanSlug.includes('nit')) {
    city = 'NIT Faridabad';
  } else if (cleanSlug.includes('greater-faridabad')) {
    city = 'Greater Faridabad';
  } else if (cleanSlug.includes('surajkund')) {
    city = 'Surajkund Faridabad';
  } else if (cleanSlug.includes('charmwood')) {
    city = 'Charmwood Faridabad';
  } else if (cleanSlug.includes('dwarka')) {
    city = 'Dwarka, Delhi';
  } else if (cleanSlug.includes('south-delhi')) {
    city = 'South Delhi';
  } else if (cleanSlug.includes('noida-sector-15')) {
    city = 'Sector 15 Noida';
  } else if (cleanSlug.includes('noida-sector-18')) {
    city = 'Sector 18 Noida';
  } else if (cleanSlug.includes('noida-sector-62')) {
    city = 'Sector 62 Noida';
  } else if (cleanSlug.includes('dlf-phase')) {
    const phaseMatch = cleanSlug.match(/phase-(\d+)/);
    city = `DLF Phase ${phaseMatch ? phaseMatch[1] : '1-5'} Gurgaon`;
  } else if (cleanSlug.includes('golf-course')) {
    city = 'Golf Course Road Gurgaon';
  } else if (cleanSlug.includes('faridabad')) {
    city = 'Faridabad';
  } else if (cleanSlug.includes('delhi')) {
    city = 'Delhi';
  } else if (cleanSlug.includes('noida')) {
    city = 'Noida';
  } else if (cleanSlug.includes('gurgaon') || cleanSlug.includes('gurugram')) {
    city = 'Gurgaon';
  }

  // Detect Flavors
  if (cleanSlug.includes('chocolate')) {
    title = `Order Rich Belgian Chocolate Cakes in ${city} | Cake Urban`;
    heroText = `Premium Chocolate Truffle & Fudge Cakes in ${city}`;
    subText = `Indulge in our exquisite layers of premium Belgian chocolate ganache, moist dark cocoa bakes, and velvety chocolate curls.`;
    description = `Order the most premium 100% vegetarian Belgian chocolate cakes online in ${city}. Rapid 30-min home delivery, fresh raw dairy cream guaranteed.`;
    faqs[0] = { q: "Do you use real dark Belgian chocolate?", a: "Yes, we exclusively work with couverture dark Belgian chocolate with 54.5% cocoa solids to achieve a rich, premium flavor profile." };
  } else if (cleanSlug.includes('red-velvet')) {
    title = `Luxurious Red Velvet Cakes Delivery in ${city} | Cream Cheese Frosting`;
    heroText = `Double-Whipped Red Velvet Delights in ${city}`;
    subText = `Experience the silky textures of gourmet red velvet crumbs combined beautifully with our signature premium cream cheese frosting.`;
    description = `Shop handcrafted eggless Red Velvet cakes in ${city}. Infused with genuine cream cheese frosting and rich artisan design touches.`;
    faqs[0] = { q: "Is the frosting real cream cheese?", a: "Absolutely! We do not use cheap artificial mock-cream. Our frosting is whipped with genuine artisan dairy cream cheese." };
  } else if (cleanSlug.includes('black-forest')) {
    title = `Classic Creamy Black Forest Cake Delivery in ${city}`;
    heroText = `Traditional Premium Black Forest in ${city}`;
    subText = `Layers of super-moist chocolate sponge, tart dark cherries, and fresh dairy whipped cream, finished with premium chocolate flakes.`;
  } else if (cleanSlug.includes('pineapple')) {
    title = `Fresh Juicy Pineapple Cakes Online in ${city} | Cake Urban`;
    heroText = `Signature Sunshine Pineapple Cakes in ${city}`;
    subText = `Whipped cream layered with organic caramelized pineapple chunks, vanilla-infused sponge, and sweet glazed cherries.`;
  } else if (cleanSlug.includes('butterscotch')) {
    title = `Crunchy Golden Butterscotch Cakes Delivery in ${city}`;
    heroText = `Premium Handcrafted Butterscotch in ${city}`;
    subText = `Symphony of brown sugar caramel, light butterscotch sponge, and homemade crunchy cashew praline elements.`;
  } else if (cleanSlug.includes('fruit')) {
    title = `Healthy Fresh Seasonal Fruit Cakes in ${city}`;
    heroText = `Gourmet Orchards Fresh Fruit Cakes in ${city}`;
    subText = `Lush layers of Madagascar vanilla cream loaded with hand-cut kiwi, apples, grapes, plums, orange segments, and sweet berries.`;
  } else if (cleanSlug.includes('vanilla')) {
    title = `Premium Madagascar Vanilla Bean Cakes in ${city}`;
    heroText = `Pure Vanilla Bean Masterpieces in ${city}`;
    subText = `Experience vanilla the way nature intended! Crafted using premium organic vanilla bean caviar and super light whipped sponge.`;
  } else if (cleanSlug.includes('strawberry')) {
    title = `Sweet Summer Strawberry Cakes in ${city} | Cake Urban`;
    heroText = `Fragrant Strawberry Cream Cakes in ${city}`;
    subText = `A light, sweet escape layered with home-stewed organic strawberry compote and freshly whipped light dairy cream.`;
  }
  
  // Detect Occasions
  else if (cleanSlug.includes('birthday')) {
    title = `Best Birthday Cakes Online Delivery in ${city} | 100% Eggless`;
    heroText = `Make Birthdays Brilliant inside ${city}`;
    subText = `Discover our range of custom birthday creations, personalized photo frames, cute mini bento boxes, and luxury tiered showstoppers.`;
    description = `Order delicious, pure eggless birthday cakes online in ${city} with rapid home delivery. Complimentary candles, matches, and designer wish knife.`;
    faqs[1] = { q: "Do you provide birthday packages?", a: "Yes! Every birthday cake receives our luxury curation kit (premium gold-lined cake board, complimentary candles, matchbox, and a premium designer cake knife)." };
  } else if (cleanSlug.includes('anniversary')) {
    title = `Elegant Wedding Anniversary Cakes in ${city} | Cake Urban`;
    heroText = `Bespoke Romantic Anniversary Cakes in ${city}`;
    subText = `Celebrate your beautiful milestone with romantic custom silhouettes, rose-gold blush decorations, and rich double-cream layers.`;
    description = `Premium anniversary bakes in ${city}. Beautifully hand-creamed red velvet, rich chocolate truffles, and custom tier arrangements for a lovely night.`;
  } else if (cleanSlug.includes('wedding')) {
    title = `Bespoke Multi-Tiered Wedding Cakes in ${city} | Designer Studio`;
    heroText = `Your Dream Wedding Cake Designed for ${city}`;
    subText = `Collaborate with our Head Pastry Chef to build spectacular tiered centerpiece monuments decorated with handcrafted sugar flowers.`;
    deliveryTime = 'Requires 24-48 hours lead time';
  } else if (cleanSlug.includes('engagement') || cleanSlug.includes('roka')) {
    title = `Customized Engagement & Roka Ceremony Cakes in ${city}`;
    heroText = `Elegant Engagement Cake Art in ${city}`;
    subText = `Aesthetic modern layouts, premium gold-leaf foliage wrappers, and customizable single or double-tier structures.`;
  } else if (cleanSlug.includes('baby-shower')) {
    title = `Delicious Baby Shower Theme Cakes in ${city} | 100% Vegetarian`;
    heroText = `Welcoming Little Miracles inside ${city}`;
    subText = `Super cute butter-cream designs, pastel stencils, teddy bears, and edible clouds customizable in baby blue, pink, or neutral mint colors.`;
  } else if (cleanSlug.includes('retirement') || cleanSlug.includes('farewell')) {
    title = `Warm Farewell & Retirement Celebration Cakes in ${city}`;
    heroText = `Honoring Beautiful Journeys in ${city}`;
    subText = `Thoughtful, customizable book-shapes, suitcase designs, or sweet custom-piped wishes commemorating decades of success.`;
  } else if (cleanSlug.includes('corporate')) {
    title = `Corporate Events & Milestone Branding Cakes in ${city}`;
    heroText = `Premium Branded Corporate Bakes in ${city}`;
    subText = `Sleek high-resolution edible company logos, matching customized cupcakes, and customized gourmet chocolate presentation trays.`;
  }

  // Detect Delivery Options
  else if (cleanSlug.includes('midnight')) {
    title = `Midnight Cake Delivery in ${city} | Safe Contactless Online Cake Order`;
    heroText = `Surprise announcements at Midnight in ${city}`;
    subText = `Hand-delivery scheduled carefully between 11:30 PM & 12:00 midnight to trigger a beautiful surprise at the start of their special day.`;
    deliveryTime = 'Guaranteed 11:30 PM - 12:00 AM Slot';
    faqs[1] = { q: "How do you guarantee prompt midnight delivery?", a: "We run a dedicated midnight delivery fleet that operates with absolute priority to hand over your order precisely within the 11:30 PM to midnight window." };
  } else if (cleanSlug.includes('same-day')) {
    title = `Same Day Eggless Cake Delivery in ${city} | Freshly Baked 30-Mins`;
    heroText = `Fresh Oven-to-Door Cakes in ${city} Today`;
    subText = `Spontaneous celebration? Don't worry. Choose our master-chef favorites and have a warm, fresh artisan cake doorstep-delivered in under 45 mins.`;
  } else if (cleanSlug.includes('express')) {
    title = `Express Online Cake Delivery in ${city} | Cake Urban`;
    heroText = `Lightning Fast Express Baking in ${city}`;
    subText = `Skipped the calendar check? Our hyper-local dispatch gets fresh cream layers baked, decorated, and delivered to you within minutes.`;
  } else if (cleanSlug.includes('near-me')) {
    title = `Best Cake Shop Near Me in ${city} | Cake Urban 100% Veg`;
    heroText = `Your Neighborhood's Best Quality Cake Corner`;
    subText = `Stop looking for local mediocre sweet stands. Indulge in certified eggless luxury baking utilizing pure cream and rich premium ingredients near you.`;
  }

  // General SEO fallback updates:
  else if (cleanSlug.includes('best-cake-shop') || cleanSlug.includes('best-cake-in')) {
    title = `Best Cake Shop in ${city} | Order 100% Eggless Gourmet Cakes`;
    heroText = `The Master Baker Elite in ${city}`;
    subText = `Acclaimed for our hand-craftsmanship, premium couverture chocolates, separate pure veg ovens, and prompt contactless home delivery.`;
  } else if (cleanSlug.includes('online-cake') || cleanSlug.includes('cake-delivery')) {
    title = `Online Eggless Cake Delivery in ${city} | Gourmet Cakes Order`;
    heroText = `Online Cake Delivery to your Door in ${city}`;
    subText = `Choose from an array of premium, designer, photo, and customized cream cakes baked inside local pure vegetarian kitchens.`;
  } else if (cleanSlug.includes('eggless-cake')) {
    title = `100% Pure Vegetarian Eggless Cakes in ${city} | Cake Urban`;
    heroText = `Certified 100% Pure Eggless Cakes inside ${city}`;
    subText = `Prepared inside our separate certified sanitised pure-vegetarian enclaves. Double-checked to satisfy religious and dietary guidelines.`;
    faqs[1] = { q: "Is the kitchen strictly pure-veg?", a: "Yes, our baking spaces are thoroughly 100% eggless. No eggs, egg derivatives, or synthetic animal gelatin are allowed in our master bakery." };
  }

  return {
    city,
    title,
    description,
    keywords,
    heroText,
    subText,
    deliveryTime,
    charge,
    faqs
  };
}

export default function LocationSEOPage() {
  const { pathName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Resolve which config to load
  const routeKey = location.pathname.replace(/^\//, '');
  const data = LOCATION_DATA_MAP[routeKey] || generateDynamicSEO(routeKey);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Filter 4 relevant products to display on the location landing page to encourage instant conversions
  const relevantProducts = FALLBACK_PRODUCTS.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-transparent pb-24"
    >
      <SEO 
        title={data.title}
        description={data.description}
        keywords={data.keywords}
        schema={{
          "@context": "https://schema.org",
          "@type": "Bakery",
          "name": "Cake Urban",
          "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop",
          "@id": "https://www.cakeurban.com",
          "url": "https://www.cakeurban.com",
          "telephone": "+919876543210",
          "priceRange": "$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Artisanal Enclave, Sector 15",
            "addressLocality": data.city,
            "addressRegion": "NCR",
            "postalCode": "121007",
            "addressCountry": "IN"
          }
        }}
      />

      {/* HEADER SECTION banner */}
      <header className="bg-gradient-to-b from-white to-[#FAF7F5] border-b border-[#E8DDD7]/40 px-6 py-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#DE9088]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#2D150F]/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#DE9088]/10 text-[#cc7a74] px-4 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
            <MapPin className="w-3.5 h-3.5 text-[#DE9088]" />
            <span>Serving {data.city} & Surrounding Enclaves</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-[#2D150F] leading-tight tracking-tight">
            {data.heroText}
          </h1>
          
          <p className="text-xs sm:text-base md:text-lg text-[#3B1F17]/60 max-w-2xl mx-auto italic font-medium leading-relaxed">
            {data.subText}
          </p>

          <div className="flex flex-wrap gap-4 items-center justify-center pt-2">
            <div className="bg-white px-5 py-3.5 rounded-2xl border border-[#E8DDD7]/40 text-[10px] font-black uppercase tracking-widest text-[#2D150F] flex items-center gap-2 shadow-sm">
              <Clock className="w-4 h-4 text-[#DE9088]" />
              <span>{data.deliveryTime}</span>
            </div>
            <div className="bg-white px-5 py-3.5 rounded-2xl border border-[#E8DDD7]/40 text-[10px] font-black uppercase tracking-widest text-[#2D150F] flex items-center gap-2 shadow-sm">
              <Shield className="w-4 h-4 text-[#DE9088]" />
              <span>100% Certified Safe Delivery</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-20">
        
        {/* CONVERSION CATEGORIES */}
        <section className="text-center space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-display font-black text-[#2D150F]">Explore Our Signature Curation</h2>
            <p className="text-[#3B1F17]/50 text-xs sm:text-base italic max-w-lg mx-auto">Selected standard items currently serving {data.city} for instant celebrate checks.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Celebration Cakes', desc: 'Moist Belgium truffle or red velvet custom designs', cat: 'Cakes' },
              { title: 'Single Pastries', desc: 'Slices, fudge brownies and chocolate lava pools', cat: 'Pastries' },
              { title: 'Gifting Hampers', desc: 'Luxury cookies and customized celebratory caskets', cat: 'Hampers' },
              { title: 'Bespoke Studio', desc: 'Brief our master pastry chef with your own references', cat: 'Custom Cakes' }
            ].map((box, i) => (
              <div 
                key={i}
                className="bg-white rounded-[32px] p-6 border border-[#E8DDD7]/40 shadow-sm text-center flex flex-col justify-between group hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-[#DE9088]/15 rounded-2xl flex items-center justify-center mx-auto text-[#DE9088]">
                    <Cake className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-[#2D150F]">{box.title}</h3>
                  <p className="text-[10px] text-[#2D150F]/50 italic leading-snug">{box.desc}</p>
                </div>
                
                <button
                  onClick={() => navigate(`/shop?category=${box.cat}`)}
                  className="mt-6 w-full h-10 rounded-xl bg-[#FAF7F5] group-hover:bg-[#DE9088] group-hover:text-white text-[9px] font-black uppercase tracking-widest text-[#2D150F] flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* RELEVANT RECOMMENDATIONS GRID */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E8DDD7]/40 pb-5">
            <div className="text-left">
              <h3 className="text-xl sm:text-2xl font-display font-black text-[#2D150F]">Bestsellers Ready for Immediate Delivery</h3>
              <p className="text-[10px] sm:text-xs text-[#2D150F]/50 italic">Catering fresh celebrations with premium materials.</p>
            </div>
            <Link to="/shop">
              <button className="h-10 px-6 rounded-xl border border-[#E8DDD7] text-[10px] font-black uppercase text-[#2D150F] hover:bg-[#FAF7F5] transition-colors tracking-widest">
                Browse Full Catalog
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[10px] sm:gap-6 md:gap-8">
            {relevantProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* UNIQUE RICH GEO-LOCATION COPY WRITING & FAQ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-8">
          {/* Dynamic Description Box */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#DE9088]">Premium Standards</span>
            <h3 className="text-2xl sm:text-4xl font-display font-black text-[#2D150F] leading-tight tracking-tight">The Cake Urban Promise</h3>
            
            <div className="space-y-4 text-xs text-[#2D150F]/70 leading-relaxed italic font-medium">
              <p>
                Our baking philosophy centers on culinary excellence. We believe a celebration cake is not just dessert; it is the center ornament of your memory.
              </p>
              <p>
                For our premium patrons in {data.city}, we source real Madagascar vanilla pods, highest grade chocolate ganache, pure local dairy butter, and fresh seasonal fruit coulis.
              </p>
              <p>
                Every hand-designed cake features customizable eggless settings, prepared in separate sanitized ovens to offer the finest vegetarian baking NCR has ever experienced.
              </p>
            </div>

            <div className="space-y-2.5 pt-4">
              <div className="flex items-center gap-2 text-xs font-black text-[#2D150F]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Zero Margarine & Artificial Syrups</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-black text-[#2D150F]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Hygiene Certified Temperature Controlled Transit</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-black text-[#2D150F]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Midnight Surprise Deliveries Activated</span>
              </div>
            </div>
          </div>

          {/* Dynamic FAQ section */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#DE9088]">Help & Service Care</span>
            <h3 className="text-2xl sm:text-4xl font-display font-black text-[#2D150F]">Local FAQs in {data.city}</h3>
            
            <div className="space-y-4">
              {data.faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div 
                    key={index}
                    className="bg-white rounded-2xl border border-[#E8DDD7]/40 overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-start justify-between gap-4 font-bold text-xs sm:text-sm text-[#2D150F] hover:bg-[#FAF7F5]/50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <span className="text-sm text-[#DE9088] font-black">{isOpen ? '−' : '+'}</span>
                    </button>
                    
                    {isOpen && (
                      <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-[#2D150F]/65 leading-relaxed font-semibold italic border-t border-[#FAF7F5]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Extra Conversion Card */}
            <div className="bg-[#DE9088]/10 rounded-3xl p-6 sm:p-8 flex items-center justify-between flex-wrap gap-4 mt-8">
              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-[#2D150F]">Need custom catering?</h4>
                <p className="text-[10px] text-[#2D150F]/60 font-semibold italic">Tiered baby shower cakes, wedding setups, and luxury gift orders.</p>
              </div>
              <Link to="/custom-order">
                <button className="h-11 px-5 rounded-xl bg-[#2D150F] text-white hover:bg-[#DE9088] text-[9px] font-black uppercase tracking-widest shadow-md transition-all">
                  Brief the Chef
                </button>
              </Link>
            </div>

          </div>
        </section>

      </div>
    </motion.div>
  );
}
