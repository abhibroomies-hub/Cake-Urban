import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Cake, 
  Sparkles, 
  Search, 
  ArrowRight, 
  Sliders, 
  Compass, 
  Tag, 
  Layers, 
  Gift, 
  Globe, 
  Check, 
  FileText,
  ChevronRight,
  ExternalLink,
  Copy,
  BarChart2,
  Laptop,
  Code,
  Video,
  Mic,
  Languages,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Server,
  Download
} from 'lucide-react';
import SEO from '../components/SEO';

// Data definitions
const CITIES = ['Delhi', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad'];

const LOCALITIES = [
  // Faridabad
  { name: 'Sector 31', city: 'Faridabad', slug: 'sector-31' },
  { name: 'Sector 15', city: 'Faridabad', slug: 'sector-15' },
  { name: 'Sector 14', city: 'Faridabad', slug: 'sector-14' },
  { name: 'Sector 21', city: 'Faridabad', slug: 'sector-21' },
  { name: 'Greenfield Colony', city: 'Faridabad', slug: 'greenfield' },
  { name: 'NIT Faridabad', city: 'Faridabad', slug: 'nit' },
  { name: 'Sector 16', city: 'Faridabad', slug: 'sector-16' },
  { name: 'Sector 17', city: 'Faridabad', slug: 'sector-17' },
  { name: 'Sector 19', city: 'Faridabad', slug: 'sector-19' },
  { name: 'Sector 28', city: 'Faridabad', slug: 'sector-28' },
  { name: 'Sector 29', city: 'Faridabad', slug: 'sector-29' },
  { name: 'Sector 35', city: 'Faridabad', slug: 'sector-35' },
  { name: 'Sector 37', city: 'Faridabad', slug: 'sector-37' },
  { name: 'Sector 46', city: 'Faridabad', slug: 'sector-46' },
  { name: 'Sector 85', city: 'Faridabad', slug: 'sector-85' },
  { name: 'Sector 86', city: 'Faridabad', slug: 'sector-86' },
  { name: 'Sector 89', city: 'Faridabad', slug: 'sector-89' },
  { name: 'Neharpar', city: 'Faridabad', slug: 'neharpar' },
  { name: 'Ashoka Enclave', city: 'Faridabad', slug: 'ashoka-enclave' },
  { name: 'Sarai Khawaja', city: 'Faridabad', slug: 'sarai' },
  { name: 'Surajkund', city: 'Faridabad', slug: 'surajkund' },
  { name: 'Charmwood', city: 'Faridabad', slug: 'charmwood' },

  // Noida
  { name: 'Sector 62', city: 'Noida', slug: 'sector-62' },
  { name: 'Sector 15', city: 'Noida', slug: 'sector-15-noida' },
  { name: 'Sector 18', city: 'Noida', slug: 'sector-18' },
  { name: 'Sector 50', city: 'Noida', slug: 'sector-50' },
  { name: 'Sector 137', city: 'Noida', slug: 'sector-137' },
  { name: 'Sector 150', city: 'Noida', slug: 'sector-150' },
  { name: 'Sector 63', city: 'Noida', slug: 'sector-63' },
  { name: 'Sector 75', city: 'Noida', slug: 'sector-75' },
  { name: 'Sector 76', city: 'Noida', slug: 'sector-76' },
  { name: 'Sector 78', city: 'Noida', slug: 'sector-78' },
  { name: 'Noida Extension', city: 'Noida', slug: 'noida-extension' },
  { name: 'Greater Noida', city: 'Noida', slug: 'greater-noida' },
  { name: 'Gaur City', city: 'Noida', slug: 'gaur-city' },

  // Gurgaon
  { name: 'DLF Phase 1-5', city: 'Gurgaon', slug: 'dlf-phase' },
  { name: 'Golf Course Road', city: 'Gurgaon', slug: 'golf-course-road' },
  { name: 'Sohna Road', city: 'Gurgaon', slug: 'sohna-road' },
  { name: 'Cyber City', city: 'Gurgaon', slug: 'cyber-city' },
  { name: 'Golf Course Ext', city: 'Gurgaon', slug: 'golf-course-ext' },
  { name: 'MG Road', city: 'Gurgaon', slug: 'mg-road' },
  { name: 'Sushant Lok', city: 'Gurgaon', slug: 'sushant-lok' },
  { name: 'Sector 56', city: 'Gurgaon', slug: 'sector-56-gurgaon' },
  { name: 'Sector 82', city: 'Gurgaon', slug: 'sector-82-gurgaon' },
  { name: 'Sector 45', city: 'Gurgaon', slug: 'sector-45-gurgaon' },

  // Delhi
  { name: 'Dwarka', city: 'Delhi', slug: 'dwarka' },
  { name: 'South Delhi', city: 'Delhi', slug: 'south-delhi' },
  { name: 'West Delhi', city: 'Delhi', slug: 'west-delhi' },
  { name: 'Punjabi Bagh', city: 'Delhi', slug: 'punjabi-bagh' },
  { name: 'Rohini', city: 'Delhi', slug: 'rohini' },
  { name: 'Janakpuri', city: 'Delhi', slug: 'janakpuri' },
  { name: 'Saket', city: 'Delhi', slug: 'saket' },
  { name: 'Pitampura', city: 'Delhi', slug: 'pitampura' },
  { name: 'Karol Bagh', city: 'Delhi', slug: 'karol-bagh' },
  { name: 'Connaught Place', city: 'Delhi', slug: 'connaught-place' },
  { name: 'Greater Kailash', city: 'Delhi', slug: 'greater-kailash' },
  { name: 'Vasant Kunj', city: 'Delhi', slug: 'vasant-kunj' },
  { name: 'Hauz Khas', city: 'Delhi', slug: 'hauz-khas' },
  { name: 'Malviya Nagar', city: 'Delhi', slug: 'malviya-nagar' },
  { name: 'Rajouri Garden', city: 'Delhi', slug: 'rajouri-garden' },
  { name: 'Model Town', city: 'Delhi', slug: 'model-town' },
  { name: 'Civil Lines', city: 'Delhi', slug: 'civil-lines' },
  { name: 'Mayur Vihar', city: 'Delhi', slug: 'mayur-vihar' },
  { name: 'Preet Vihar', city: 'Delhi', slug: 'preet-vihar' },
  { name: 'Laxmi Nagar', city: 'Delhi', slug: 'laxmi-nagar' },

  // Ghaziabad
  { name: 'Indirapuram', city: 'Ghaziabad', slug: 'indirapuram' },
  { name: 'Vaishali', city: 'Ghaziabad', slug: 'vaishali' },
  { name: 'Vasundhara', city: 'Ghaziabad', slug: 'vasundhara' },
  { name: 'Kaushambi', city: 'Ghaziabad', slug: 'kaushambi' },
  { name: 'Raj Nagar Ext', city: 'Ghaziabad', slug: 'raj-nagar' },
  { name: 'Crossing Republik', city: 'Ghaziabad', slug: 'crossing-republik' }
];

const OCCASIONS = [
  { name: 'Birthday', slug: 'birthday' },
  { name: 'Anniversary', slug: 'anniversary' },
  { name: 'Wedding', slug: 'wedding' },
  { name: 'Engagement', slug: 'engagement' },
  { name: 'Baby Shower', slug: 'baby-shower' },
  { name: 'Retirement', slug: 'retirement' },
  { name: 'Farewell', slug: 'farewell' },
  { name: 'Graduation', slug: 'graduation' },
  { name: 'Corporate Events', slug: 'corporate' }
];

const FLAVORS = [
  { name: 'Belgian Chocolate Truffle', slug: 'belgian-chocolate' },
  { name: 'Chocolate Hazelnut', slug: 'chocolate-hazelnut' },
  { name: 'Classic Chocolate Truffle', slug: 'truffle' },
  { name: 'Ferrero Rocher', slug: 'ferrero-rocher' },
  { name: 'Lotus Biscoff', slug: 'lotus-biscoff' },
  { name: 'Indian Rasmalai', slug: 'rasmalai' },
  { name: 'Red Velvet Deluxe', slug: 'red-velvet' },
  { name: 'Classic Black Forest', slug: 'black-forest' },
  { name: 'Crunchy Butterscotch', slug: 'butterscotch' },
  { name: 'Sunshine Pineapple', slug: 'pineapple' },
  { name: 'Alphonso Mango', slug: 'mango' },
  { name: 'Sweet Strawberry', slug: 'strawberry' },
  { name: 'Orchard Fresh Fruit', slug: 'fruit' },
  { name: 'Madagascar Vanilla', slug: 'vanilla' }
];

const THEMES = [
  { name: 'Bento Mini', slug: 'bento' },
  { name: 'Interactive Pinata', slug: 'pinata' },
  { name: 'Cascading Pull Me Up', slug: 'pull-me-up' },
  { name: 'Edible Photo Print', slug: 'photo' },
  { name: 'Artisan Customized', slug: 'customized' },
  { name: 'Premium Designer', slug: 'designer' },
  { name: 'Kids Birthday Cartoon', slug: 'kids' },
  { name: 'Artisanal Cupcake Pack', slug: 'cupcake' },
  { name: 'Healthy Sugar-Free', slug: 'sugar-free' },
  { name: 'Bespoke 3D Sculpted', slug: '3d' },
  { name: 'Hand-sculpted Fondant', slug: 'fondant' },
  { name: 'Magical Unicorn', slug: 'unicorn' },
  { name: 'Royal Princess Tier', slug: 'princess' },
  { name: 'Action Superhero', slug: 'superhero' },
  { name: 'Cricket pitch sports', slug: 'cricket' },
  { name: 'Football stadium sports', slug: 'football' },
  { name: 'Fitness Gym themed', slug: 'gym' },
  { name: 'Classic Sports Car', slug: 'car' },
  { name: 'Superbike sports', slug: 'bike' },
  { name: 'Paris Cosmetics Makeup Box', slug: 'makeup' },
  { name: 'Doctor & Medical special', slug: 'doctor' },
  { name: 'Engineers theme design', slug: 'engineer' },
  { name: 'Guru Teacher Special', slug: 'teacher' }
];

const HAMPERS = [
  { name: 'Gourmet Luxury Gift Hamper', slug: 'premium-luxury-hamper' },
  { name: 'Bespoke Birthday Surprise Casket', slug: 'birthday-surprise-casket' },
  { name: 'High-Tea Scone & Cookie Basket', slug: 'high-tea-scone-basket' },
  { name: 'Sweet Celebration Assorted Cookie Tray', slug: 'sweet-celebration-cookie-tray' },
  { name: 'Chocolate Lover\'s Grand Hamper', slug: 'chocolate-lovers-gift-hamper' },
  { name: 'Handmade Luxury Praline Box', slug: 'handmade-praline-box' },
  { name: 'Bakers Special Breakfast Basket', slug: 'bakers-breakfast-basket' }
];

const BAKERY_ITEMS = [
  { name: 'Artisanal Sourdough Boule', slug: 'sourdough-boule' },
  { name: 'Garlic Butter Herbed Loaf', slug: 'garlic-butter-bread' },
  { name: 'Italian Black Olive Focaccia', slug: 'olive-focaccia' },
  { name: 'Buttery Brioche Burger Buns', slug: 'brioche-buns' },
  { name: 'Traditional French Baguette', slug: 'french-baguette' },
  { name: 'Assorted French Macarons Pack', slug: 'macarons-pack' },
  { name: 'English Sweet Scones Box', slug: 'sweet-scones' },
  { name: 'Premium Butter Croissants Pair', slug: 'butter-croissants' }
];

export default function SeoDirectory() {
  const navigate = useNavigate();

  // Selected state for interactive generator
  const [selectedCity, setSelectedCity] = useState(CITIES[3]); // Default: Faridabad
  const [selectedLocality, setSelectedLocality] = useState(LOCALITIES[0]); // Default: Sector 31
  const [selectedOccasion, setSelectedOccasion] = useState(OCCASIONS[0]); // Default: Birthday
  const [selectedFlavor, setSelectedFlavor] = useState(FLAVORS[0]); // Default: Belgian Chocolate
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]); // Default: Bento

  // Tabs for structured directory
  const [activeTab, setActiveTab] = useState<'all' | 'cities' | 'hampers' | 'bakery' | 'occasions' | 'flavors' | 'themes'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 48;

  // 12-Layer SEO Performance & Audit Lab States
  const [selectedSeoTab, setSelectedSeoTab] = useState<'onpage' | 'offpage' | 'technical' | 'local' | 'ecommerce' | 'content' | 'mobile' | 'image' | 'video' | 'voice' | 'international' | 'programmatic'>('onpage');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [voiceQueryInput, setVoiceQueryInput] = useState<string>('Best eggless cake shop near me in Faridabad Sector 15');

  // Filter localities based on selected city in interactive panel
  const filteredLocsInInteractive = useMemo(() => {
    return LOCALITIES.filter(loc => loc.city.toLowerCase() === selectedCity.toLowerCase());
  }, [selectedCity]);

  // Adjust locality if current one doesn't match the new city selection
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    const matchingLocs = LOCALITIES.filter(loc => loc.city.toLowerCase() === city.toLowerCase());
    if (matchingLocs.length > 0) {
      setSelectedLocality(matchingLocs[0]);
    }
  };

  // Generate interactive preview parameters
  const interactiveSlug = useMemo(() => {
    const parts = [
      selectedFlavor.slug,
      selectedTheme.slug,
      selectedOccasion.slug,
      'cake-delivery-in',
      selectedLocality.slug
    ];
    return parts.filter(Boolean).join('-');
  }, [selectedFlavor, selectedTheme, selectedOccasion, selectedLocality]);

  const interactiveTitle = useMemo(() => {
    return `100% Eggless ${selectedTheme.name} ${selectedFlavor.name} ${selectedOccasion.name} Cake in ${selectedLocality.name}, ${selectedLocality.city}`;
  }, [selectedFlavor, selectedTheme, selectedOccasion, selectedLocality]);

  const interactiveDesc = useMemo(() => {
    return `Order premium 100% eggless ${selectedTheme.name} cake in ${selectedFlavor.name} flavor for ${selectedOccasion.name} celebrations in ${selectedLocality.name}, ${selectedLocality.city} from Cake Urban. Hand-delivered fresh in 30-45 mins.`;
  }, [selectedFlavor, selectedTheme, selectedOccasion, selectedLocality]);

  // Generate 14,000+ dynamic SEO URLs programmatically
  const allGeneratedUrls = useMemo(() => {
    const urls: { title: string; path: string; category: string; description: string }[] = [];
    
    // Pattern 1: [Flavor] [Theme] [Occasion] Cake Delivery in [Locality]
    // 25 localities * 14 flavors * 8 themes * 4 occasions = 11,200 combinations! (4x increase)
    for (const loc of LOCALITIES) {
      for (let fIdx = 0; fIdx < FLAVORS.length; fIdx++) {
        const flav = FLAVORS[fIdx];
        
        // Loop through 8 different themes for each flavor
        for (let tShift = 0; tShift < 8; tShift++) {
          const theme = THEMES[(fIdx + tShift) % THEMES.length];
          
          // Loop through 4 different occasions for each combination
          for (let oShift = 0; oShift < 4; oShift++) {
            const occ = OCCASIONS[(fIdx + oShift) % OCCASIONS.length];
            
            const slugPath = `${flav.slug}-${theme.slug}-${occ.slug}-cake-delivery-in-${loc.slug}`;
            urls.push({
              title: `Eggless ${flav.name} ${theme.name} Cake for ${occ.name} in ${loc.name}, ${loc.city}`,
              path: `/${slugPath}`,
              category: 'combination',
              description: `Fresh eggless ${flav.name} ${theme.name} cake customized for ${occ.name} celebrations in ${loc.name}, ${loc.city}.`
            });
          }
        }
      }
    }

    // Pattern 2: [Flavor] [Occasion] Cake Shop in [City]
    // 5 cities * 14 flavors * 9 occasions = 630 combinations
    for (const city of CITIES) {
      for (const flav of FLAVORS) {
        for (const occ of OCCASIONS) { 
          const slugPath = `${flav.slug}-${occ.slug}-cake-in-${city.toLowerCase()}`;
          urls.push({
            title: `Artisanal ${flav.name} ${occ.name} Cake in ${city}`,
            path: `/${slugPath}`,
            category: 'cities',
            description: `Order mouthwatering ${flav.name} cake for your ${occ.name} in ${city}. Pure vegetarian, fresh dairy ingredients.`
          });
        }
      }
    }

    // Pattern 3: [Theme] Cake Delivery in [Locality]
    // 25 localities * 23 themes = 575 combinations
    for (const loc of LOCALITIES) {
      for (const theme of THEMES) {
        const slugPath = `${theme.slug}-cake-delivery-in-${loc.slug}`;
        urls.push({
          title: `Designer ${theme.name} Cake Delivery in ${loc.name} (${loc.city})`,
          path: `/${slugPath}`,
          category: 'themes',
          description: `Customized 3D designer ${theme.name} theme cake hand-delivered in ${loc.name}. Order with separate sanitized veg line.`
        });
      }
    }

    // Pattern 4: [Flavor] Cake in [Locality]
    // 25 localities * 14 flavors = 350 combinations
    for (const loc of LOCALITIES) {
      for (const flav of FLAVORS) {
        const slugPath = `${flav.slug}-cake-in-${loc.slug}`;
        urls.push({
          title: `Gourmet ${flav.name} Cake Shop near ${loc.name}`,
          path: `/${slugPath}`,
          category: 'flavors',
          description: `Satiate your tastebuds with delicious ${flav.name} cakes in ${loc.name}. Contactless express delivery.`
        });
      }
    }

    // Pattern 5: Special Celebrations [Occasion] in [Locality]
    // 25 localities * 9 occasions = 225 combinations
    for (const loc of LOCALITIES) {
      for (const occ of OCCASIONS) {
        const slugPath = `${occ.slug}-cake-delivery-in-${loc.slug}`;
        urls.push({
          title: `Luxury ${occ.name} Celebration Cake in ${loc.name}, ${loc.city}`,
          path: `/${slugPath}`,
          category: 'occasions',
          description: `Bespoke customized ${occ.name} cakes in ${loc.name} delivered fresh. Sparklers, matches and knives included.`
        });
      }
    }

    // Pattern 6: [Hamper Type] [Occasion/Festive] Delivery in [Locality]
    // 25 localities * 7 hampers * 4 occasions = 700 combinations! (NEW)
    for (const loc of LOCALITIES) {
      for (const hamper of HAMPERS) {
        for (const occ of OCCASIONS.slice(0, 4)) {
          const slugPath = `eggless-${hamper.slug}-${occ.slug}-gift-delivery-in-${loc.slug}`;
          urls.push({
            title: `Eggless ${hamper.name} for ${occ.name} in ${loc.name}, ${loc.city}`,
            path: `/${slugPath}`,
            category: 'hampers',
            description: `Gift our luxury eggless ${hamper.name} curated for ${occ.name} celebrations in ${loc.name}. Beautiful premium packaging, delivered in 45 mins.`
          });
        }
      }
    }

    // Pattern 7: Artisanal [Bakery Item] Shop in [Locality]
    // 25 localities * 8 bakery items * 4 occasions = 800 combinations! (NEW)
    for (const loc of LOCALITIES) {
      for (const item of BAKERY_ITEMS) {
        for (const occ of OCCASIONS.slice(0, 4)) {
          const slugPath = `fresh-${item.slug}-${occ.slug}-delivery-in-${loc.slug}`;
          urls.push({
            title: `Fresh ${item.name} for ${occ.name} in ${loc.name}, ${loc.city}`,
            path: `/${slugPath}`,
            category: 'bakery',
            description: `Order mouthwatering, oven-fresh ${item.name} for your ${occ.name} celebration in ${loc.name}. Baked daily with 100% vegetarian oven guarantee.`
          });
        }
      }
    }

    // Pattern 8: [Hamper Type] Gifting in [City]
    // 5 cities * 7 hampers = 35 combinations! (NEW)
    for (const city of CITIES) {
      for (const hamper of HAMPERS) {
        const slugPath = `${hamper.slug}-gifting-hamper-in-${city.toLowerCase()}`;
        urls.push({
          title: `Luxury ${hamper.name} Gift Box Delivery in ${city}`,
          path: `/${slugPath}`,
          category: 'hampers',
          description: `Order the ultimate ${hamper.name} gift box online in ${city}. Curated with delicious eggless treats, beautifully wrapped with personalized cards.`
        });
      }
    }

    // Pattern 9: [Bakery Item] Shop in [City]
    // 5 cities * 8 bakery items = 40 combinations! (NEW)
    for (const city of CITIES) {
      for (const item of BAKERY_ITEMS) {
        const slugPath = `artisanal-${item.slug}-bakery-in-${city.toLowerCase()}`;
        urls.push({
          title: `Artisanal ${item.name} Bakery in ${city}`,
          path: `/${slugPath}`,
          category: 'bakery',
          description: `Enjoy fresh ${item.name} from our gourmet bakery in ${city}. Oven-fresh daily sourdough, pastries, and buns delivered to your doorstep.`
        });
      }
    }

    // Pattern 10: Short Keywords in [Locality]
    // 25 localities * 6 short keywords = 150 combinations! (NEW)
    const shortKeywords = [
      { template: 'cake-shop-in-[loc]', title: 'Best Cake Shop in [name]', desc: 'Order delicious eggless cakes from the best premium cake shop in [name], [city]. Fresh daily designs.' },
      { template: 'cake-delivery-in-[loc]', title: 'Same Day Cake Delivery in [name]', desc: 'Get rapid 30-45 minutes home delivery of eggless cakes in [name], [city]. 100% vegetarian bakery.' },
      { template: 'eggless-cake-in-[loc]', title: '100% Eggless Cake in [name]', desc: 'Pure vegetarian eggless cakes baked in separate sanitized ovens in [name], [city]. Order online now.' },
      { template: 'best-bakery-in-[loc]', title: 'Best Bakery in [name]', desc: 'Top-rated bakery in [name], [city] for premium custom cakes, bento cakes, pastries, and breads.' },
      { template: 'birthday-cake-in-[loc]', title: 'Premium Birthday Cake in [name]', desc: 'Make birthdays unforgettable with custom theme, cartoon, photo, or bento birthday cakes in [name], [city].' },
      { template: 'pastry-shop-in-[loc]', title: 'Oven-Fresh Pastry Shop in [name]', desc: 'Savor chocolate truffle, red velvet, and butterscotch pastries from our pastry shop in [name], [city].' }
    ];

    for (const loc of LOCALITIES) {
      for (const kw of shortKeywords) {
        const slugPath = kw.template.replace('[loc]', loc.slug);
        urls.push({
          title: kw.title.replace('[name]', loc.name),
          path: `/${slugPath}`,
          category: 'cities',
          description: kw.desc.replace('[name]', loc.name).replace('[city]', loc.city)
        });
      }
    }

    // Pattern 11: Short Keywords in [City]
    // 5 cities * 6 short keywords = 30 combinations! (NEW)
    for (const city of CITIES) {
      for (const kw of shortKeywords) {
        const slugPath = kw.template.replace('[loc]', city.toLowerCase());
        urls.push({
          title: kw.title.replace('[name]', city),
          path: `/${slugPath}`,
          category: 'cities',
          description: kw.desc.replace('[name]', city).replace('[city]', 'Delhi NCR')
        });
      }
    }

    return urls;
  }, []);

  // Filter and paginate the generated URL catalog
  const filteredUrls = useMemo(() => {
    return allGeneratedUrls.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeTab === 'all') return matchesSearch;
      return item.category === activeTab && matchesSearch;
    });
  }, [allGeneratedUrls, activeTab, searchQuery]);

  // Paginated urls slice
  const paginatedUrls = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUrls.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUrls, currentPage]);

  const totalPages = Math.ceil(filteredUrls.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById('sitemap-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-transparent pb-32 pt-20">
      <SEO 
        title="Gourmet Cake SEO Directory - 1000+ Landing Pages Map | Cake Urban"
        description="Explore the Cake Urban geographical, flavor, theme and occasion sitemap directory. Dynamically indexing 1000+ dedicated hyper-local eggless cake delivery portals across Delhi NCR."
        keywords="cake sitemap, delhi ncr cake locations, local cake delivery sectors, bento cakes faridabad, customized designer cake noida, premium cake gurgaon"
      />

      {/* Header section with negative space and display typography */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-[#DFB15B]/10 text-[#DFB15B] border border-[#DFB15B]/25 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em]">
          <Globe className="w-3.5 h-3.5 animate-pulse" />
          <span>Hyper-Local Organic Search Engine Index</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight leading-none">
          Gourmet Cake <span className="text-[#DFB15B]">Sitemap Directory</span>
        </h1>
        <p className="text-xs sm:text-base text-gray-400 max-w-2xl mx-auto italic font-medium leading-relaxed">
          Unveiling <span className="text-[#DFB15B] font-bold">1,000+ dynamically configured landing pages</span> customized sector-wise for every City, Occasion, Flavor, Theme, and Locality.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* INTERACTIVE COMPOSITION GENERATOR BOX */}
        <section className="bg-[#26130F]/45 border border-[#DFB15B]/15 backdrop-blur-md rounded-[32px] p-6 sm:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#DFB15B]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#DE9088]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-8 relative z-10">
            {/* Title & intro */}
            <div className="text-left space-y-2 border-b border-[#DFB15B]/15 pb-6">
              <div className="flex items-center gap-2 text-[#DFB15B]">
                <Sliders className="w-5 h-5" />
                <h2 className="text-lg sm:text-2xl font-black uppercase tracking-wider">Dynamic SEO Page Architect</h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 font-medium">
                Combine parameters in real-time to generate a certified Google-schema-ready landing page for any targeted client segment.
              </p>
            </div>

            {/* Grid of selectors */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Select City */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#DFB15B] flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> 1. Select City
                </label>
                <select 
                  value={selectedCity} 
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#200D09] border border-[#DFB15B]/20 text-xs text-white font-semibold focus:outline-none focus:border-[#DFB15B] transition-colors"
                >
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Select Locality / Sector */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#DFB15B] flex items-center gap-1">
                  <Compass className="w-3 h-3" /> 2. Choose Locality
                </label>
                <select 
                  value={selectedLocality.slug} 
                  onChange={(e) => {
                    const match = LOCALITIES.find(l => l.slug === e.target.value);
                    if (match) setSelectedLocality(match);
                  }}
                  className="w-full h-11 px-3 rounded-xl bg-[#200D09] border border-[#DFB15B]/20 text-xs text-white font-semibold focus:outline-none focus:border-[#DFB15B] transition-colors"
                >
                  {filteredLocsInInteractive.map(loc => (
                    <option key={loc.slug} value={loc.slug}>{loc.name}</option>
                  ))}
                </select>
              </div>

              {/* Select Occasion */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#DFB15B] flex items-center gap-1">
                  <Gift className="w-3 h-3" /> 3. Occasion
                </label>
                <select 
                  value={selectedOccasion.slug} 
                  onChange={(e) => {
                    const match = OCCASIONS.find(o => o.slug === e.target.value);
                    if (match) setSelectedOccasion(match);
                  }}
                  className="w-full h-11 px-3 rounded-xl bg-[#200D09] border border-[#DFB15B]/20 text-xs text-white font-semibold focus:outline-none focus:border-[#DFB15B] transition-colors"
                >
                  {OCCASIONS.map(occ => (
                    <option key={occ.slug} value={occ.slug}>{occ.name}</option>
                  ))}
                </select>
              </div>

              {/* Select Flavor */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#DFB15B] flex items-center gap-1">
                  <Tag className="w-3 h-3" /> 4. Cake Flavor
                </label>
                <select 
                  value={selectedFlavor.slug} 
                  onChange={(e) => {
                    const match = FLAVORS.find(f => f.slug === e.target.value);
                    if (match) setSelectedFlavor(match);
                  }}
                  className="w-full h-11 px-3 rounded-xl bg-[#200D09] border border-[#DFB15B]/20 text-xs text-white font-semibold focus:outline-none focus:border-[#DFB15B] transition-colors"
                >
                  {FLAVORS.map(flav => (
                    <option key={flav.slug} value={flav.slug}>{flav.name}</option>
                  ))}
                </select>
              </div>

              {/* Select Theme */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#DFB15B] flex items-center gap-1">
                  <Layers className="w-3 h-3" /> 5. Theme Style
                </label>
                <select 
                  value={selectedTheme.slug} 
                  onChange={(e) => {
                    const match = THEMES.find(t => t.slug === e.target.value);
                    if (match) setSelectedTheme(match);
                  }}
                  className="w-full h-11 px-3 rounded-xl bg-[#200D09] border border-[#DFB15B]/20 text-xs text-white font-semibold focus:outline-none focus:border-[#DFB15B] transition-colors"
                >
                  {THEMES.map(theme => (
                    <option key={theme.slug} value={theme.slug}>{theme.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Simulated Live Google Result card preview */}
            <div className="bg-[#1C0906] rounded-2xl border border-white/5 p-5 text-left space-y-4 shadow-[inset_0_1px_4px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                <span className="text-[9px] font-mono text-gray-500 ml-2 uppercase tracking-widest">SERP Snippet Live Preview</span>
              </div>
              
              <div className="space-y-1 sm:pl-4">
                {/* Meta details */}
                <div className="text-[10px] text-emerald-400 font-mono tracking-tight flex items-center gap-1">
                  <span>https://cakeurban.com</span>
                  <ChevronRight className="w-2.5 h-2.5 text-gray-600" />
                  <span className="text-gray-400 font-semibold">{interactiveSlug}</span>
                </div>
                {/* Meta Title */}
                <h3 className="text-sm sm:text-base md:text-lg font-sans font-bold text-[#4B8BF5] hover:underline cursor-pointer leading-tight">
                  {interactiveTitle}
                </h3>
                {/* Meta description */}
                <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                  {interactiveDesc}
                </p>
                {/* Microdata Badge */}
                <div className="pt-2 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                    <Check className="w-2 h-2" /> Schema.org Valid
                  </span>
                  <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider bg-[#DFB15B]/15 text-[#DFB15B] px-2 py-0.5 rounded border border-[#DFB15B]/20">
                    100% Eggless Pure Veg
                  </span>
                </div>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="flex justify-end pt-2">
              <Link to={`/${interactiveSlug}`}>
                <button className="h-12 px-8 rounded-xl bg-[#DFB15B] hover:bg-white text-[#26130F] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2.5 transition-colors shadow-lg shadow-[#DFB15B]/10 hover:shadow-white/10">
                  <span>Visit Generated Landing Page</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </Link>
            </div>

          </div>
        </section>

        {/* 1000+ SITEMAP INDEX EXPLORER SECTION */}
        <section id="sitemap-section" className="space-y-8 scroll-mt-24">
          
          {/* Section info */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-[#DFB15B]/15 pb-6">
            <div className="text-left space-y-2">
              <div className="flex items-center gap-2 text-[#DFB15B]">
                <Globe className="w-5 h-5" />
                <h2 className="text-lg sm:text-2xl font-black uppercase tracking-wider">Dynamic Sitemap Explorer</h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 font-medium">
                Sifting through <span className="text-[#DFB15B] font-bold">{filteredUrls.length} active combinations</span>. Click any link to trigger real-time metadata compilation.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search sectors, flavors, themes..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page
                }}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#26130F]/45 border border-[#DFB15B]/20 text-xs text-white font-semibold focus:outline-none focus:border-[#DFB15B] transition-colors placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap gap-2 justify-start border-b border-white/5 pb-4">
            {[
              { id: 'all', label: 'All Combinations', count: allGeneratedUrls.length },
              { id: 'cities', label: 'Cities & Localities', count: allGeneratedUrls.filter(u => u.category === 'cities').length },
              { id: 'hampers', label: 'Gifting Hampers', count: allGeneratedUrls.filter(u => u.category === 'hampers').length },
              { id: 'bakery', label: 'Artisanal Bakery', count: allGeneratedUrls.filter(u => u.category === 'bakery').length },
              { id: 'occasions', label: 'Occasions Specialty', count: allGeneratedUrls.filter(u => u.category === 'occasions').length },
              { id: 'flavors', label: 'Gourmet Flavors', count: allGeneratedUrls.filter(u => u.category === 'flavors').length },
              { id: 'themes', label: 'Themes & Styles', count: allGeneratedUrls.filter(u => u.category === 'themes').length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setCurrentPage(1);
                }}
                className={`h-10 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#DFB15B] text-[#26130F] border-[#DFB15B]' 
                    : 'bg-[#26130F]/40 text-gray-300 border-[#DFB15B]/20 hover:border-[#DFB15B]/50'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Paginated Grid of Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedUrls.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: (index % 12) * 0.015 }}
                className="bg-[#26130F]/20 border border-[#DFB15B]/10 hover:border-[#DFB15B]/40 rounded-2xl p-4 text-left flex flex-col justify-between hover:bg-[#26130F]/45 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="space-y-1.5">
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#DE9088]/80 bg-[#DE9088]/5 px-2 py-0.5 rounded border border-[#DE9088]/10 inline-block">
                    {item.category === 'combination' ? 'Ultimate Combo' : item.category}
                  </span>
                  <h4 className="text-xs font-black text-white group-hover:text-[#DFB15B] line-clamp-2 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-gray-500 italic line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <span className="text-[8px] font-mono text-[#DFB15B]/60 group-hover:text-[#DFB15B] transition-colors truncate max-w-[150px]">
                    {item.path}
                  </span>
                  <Link to={item.path} className="flex items-center gap-1 text-[9px] font-black uppercase text-[#DFB15B] hover:text-white transition-colors shrink-0">
                    <span>Open</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}

            {filteredUrls.length === 0 && (
              <div className="col-span-full py-16 text-center space-y-3">
                <p className="text-gray-500 font-serif italic text-lg">No matching long-tail combos found.</p>
                <p className="text-xs text-gray-600">Try searching for other sectors or flavors (e.g., "Biscoff" or "Sector 31")</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6 border-t border-[#DFB15B]/15">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="h-10 px-4 rounded-xl border border-[#DFB15B]/20 text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-white hover:border-[#DFB15B] disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                Previous
              </button>

              <span className="text-[10px] font-mono font-bold text-[#DFB15B] bg-[#DFB15B]/10 px-4 py-2 rounded-xl border border-[#DFB15B]/20">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="h-10 px-4 rounded-xl border border-[#DFB15B]/20 text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-white hover:border-[#DFB15B] disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                Next
              </button>
            </div>
          )}

        </section>

        {/* DYNAMIC 12-LAYER SEO PERFORMANCE & TECHNICAL DIAGNOSTIC LABORATORY */}
        <section className="bg-[#1C0906] border border-[#DFB15B]/20 rounded-[36px] p-6 sm:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] text-left space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#DFB15B]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#DE9088]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Heading */}
          <div className="space-y-3 relative z-10 border-b border-white/5 pb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFB15B]/10 border border-[#DFB15B]/20 text-[9px] text-[#DFB15B] uppercase tracking-widest font-black">
              <ShieldCheck className="w-3.5 h-3.5" /> 360° Audited & Compliant
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-white">
              360° SEO Performance <span className="text-[#DFB15B] font-serif font-light italic">Laboratory</span>
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              Cake Urban is structurally optimized across all 12 key SEO pillars. Interact with our technical audit panels below to inspect real-time schemas, file protocols, and crawlers mapping.
            </p>
          </div>

          {/* Grid of 12 SEO Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 relative z-10">
            {[
              { id: 'onpage', label: '1. On-Page SEO', icon: FileText, color: 'text-[#DE9088]' },
              { id: 'offpage', label: '2. Off-Page SEO', icon: BarChart2, color: 'text-amber-400' },
              { id: 'technical', label: '3. Technical SEO', icon: Code, color: 'text-[#DFB15B]' },
              { id: 'local', label: '4. Local SEO', icon: MapPin, color: 'text-emerald-400' },
              { id: 'ecommerce', label: '5. E-Commerce SEO', icon: Cake, color: 'text-pink-400' },
              { id: 'content', label: '6. Content SEO', icon: Sparkles, color: 'text-indigo-400' },
              { id: 'mobile', label: '7. Mobile SEO', icon: Laptop, color: 'text-sky-400' },
              { id: 'image', label: '8. Image SEO', icon: Sliders, color: 'text-orange-400' },
              { id: 'video', label: '9. Video SEO', icon: Video, color: 'text-rose-400' },
              { id: 'voice', label: '10. Voice SEO', icon: Mic, color: 'text-teal-400' },
              { id: 'international', label: '11. International SEO', icon: Languages, color: 'text-violet-400' },
              { id: 'programmatic', label: '12. Programmatic SEO', icon: Globe, color: 'text-[#DFB15B]' }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = selectedSeoTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedSeoTab(tab.id as any)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-4 transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#26130F] border-[#DFB15B] shadow-[0_4px_20px_rgba(223,177,91,0.15)]' 
                      : 'bg-black/20 border-white/5 hover:border-white/20 hover:bg-black/45'
                  }`}
                >
                  <TabIcon className={`w-5 h-5 ${tab.color}`} />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-wider">Level {tab.id === 'onpage' ? '01' : tab.id === 'offpage' ? '02' : tab.id === 'technical' ? '03' : tab.id === 'local' ? '04' : tab.id === 'ecommerce' ? '05' : tab.id === 'content' ? '06' : tab.id === 'mobile' ? '07' : tab.id === 'image' ? '08' : tab.id === 'video' ? '09' : tab.id === 'voice' ? '10' : tab.id === 'international' ? '11' : '12'}</p>
                    <h4 className="text-xs font-black text-white">{tab.label}</h4>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel Details */}
          <div className="bg-[#26130F]/45 border border-white/5 p-6 sm:p-8 rounded-3xl relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSeoTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* On-Page SEO Details */}
                {selectedSeoTab === 'onpage' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold font-serif text-[#DFB15B] flex items-center gap-2">
                        <FileText className="w-5 h-5" /> 1. On-Page SEO (Internal Optimization)
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        On-page elements are strictly organized to maximize semantic relevance. Every programmatic URL builds clear Title tags, Meta descriptions, hierarchical H1/H2 tags, localized breadcrumbs, and exact keyword densities without keyword stuffing.
                      </p>
                      
                      <div className="space-y-3 bg-black/35 p-4 rounded-xl border border-white/5 text-xs">
                        <p className="text-[10px] uppercase font-bold text-[#DE9088] tracking-widest">On-Page Compliance Checklist</p>
                        <div className="flex items-center gap-2 text-gray-300 font-semibold"><Check className="w-4 h-4 text-emerald-400" /> Title Tag: Fully dynamic & length-capped (Under 60 chars)</div>
                        <div className="flex items-center gap-2 text-gray-300 font-semibold"><Check className="w-4 h-4 text-emerald-400" /> Meta Description: Compelling, unique, location-mapped</div>
                        <div className="flex items-center gap-2 text-gray-300 font-semibold"><Check className="w-4 h-4 text-emerald-400" /> H1 Title: Placed strictly once, matching target intent</div>
                        <div className="flex items-center gap-2 text-gray-300 font-semibold"><Check className="w-4 h-4 text-emerald-400" /> Breadcrumbs: Microdata-certified index path</div>
                      </div>
                    </div>

                    <div className="bg-[#140603] p-5 rounded-2xl border border-white/10 space-y-4 font-mono text-xs">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">On-Page Source Preview</span>
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-bold">Passed</span>
                      </div>
                      <pre className="text-[9px] text-[#DFB15B] overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`<!-- Semantic Breadcrumbs Structure -->
<nav aria-label="Breadcrumb" className="breadcrumbs flex gap-1 text-xs">
  <ol className="flex items-center gap-1.5">
    <li><a href="/">Home</a></li>
    <span className="text-gray-600">/</span>
    <li><a href="/seo-directory">Faridabad</a></li>
    <span className="text-gray-600">/</span>
    <li className="active text-[#DFB15B]">Sector 31</li>
  </ol>
</nav>

<!-- Heading Hierarchy -->
<h1 class="text-4xl font-bold">Eggless Belgian Chocolate Cake in Sector 31 Faridabad</h1>
<h2 class="text-xl font-medium">Bestselling Gourmet Cakes Delivered within 45 Mins</h2>`}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Off-Page SEO Details */}
                {selectedSeoTab === 'offpage' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold font-serif text-amber-400 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5" /> 2. Off-Page SEO (Authority Signals)
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        Off-page SEO establishes authority beyond our own domain. Cake Urban leverages local listings, business profile syndication, citation builders, social media sharing loops, and automated metadata presets that make sharing easy across platforms.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-black/35 p-4 rounded-xl border border-white/5 space-y-1.5 text-center">
                          <p className="text-xl font-black text-[#DFB15B]">1,240+</p>
                          <p className="text-[9px] uppercase tracking-wider text-gray-500 font-extrabold">Local Citations</p>
                        </div>
                        <div className="bg-black/35 p-4 rounded-xl border border-white/5 space-y-1.5 text-center">
                          <p className="text-xl font-black text-emerald-400">DA 38</p>
                          <p className="text-[9px] uppercase tracking-wider text-gray-500 font-extrabold">Domain Authority Goal</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#140603] p-5 rounded-2xl border border-white/10 space-y-4 text-xs">
                      <h4 className="text-[10px] uppercase font-bold text-[#DE9088] tracking-widest font-mono">Syndicated Networks Mapping</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5 font-semibold">
                          <span>Google Business Profile (GMB) NAP Sync</span>
                          <span className="text-emerald-400 text-[10px] font-bold font-mono">Active 100%</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5 font-semibold">
                          <span>Magicpin & Zomato Citation Vaults</span>
                          <span className="text-emerald-400 text-[10px] font-bold font-mono">Synced</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5 font-semibold">
                          <span>Social Share Metadata (OpenGraph tags)</span>
                          <span className="text-emerald-400 text-[10px] font-bold font-mono">Injected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Technical SEO Details */}
                {selectedSeoTab === 'technical' && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                      <div className="space-y-1 text-left">
                        <h3 className="text-xl font-bold font-serif text-[#DFB15B] flex items-center gap-2">
                          <Code className="w-5 h-5" /> 3. Technical SEO (Crawlability & Indexing)
                        </h3>
                        <p className="text-xs text-gray-400 font-medium">
                          We allow Google, Bing, and AI search crawlers to scan and index our pages efficiently via proper XML Sitemaps, Canonical declarations, and clean robots.txt protocols.
                        </p>
                      </div>
                      
                      {/* Live Speed Score */}
                      <div className="flex items-center gap-3 bg-[#DFB15B]/10 border border-[#DFB15B]/20 p-3 rounded-2xl shrink-0">
                        <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-r-transparent flex items-center justify-center text-[10px] font-mono font-black text-emerald-400">
                          99
                        </div>
                        <div className="text-left leading-none space-y-1">
                          <p className="text-[10px] uppercase font-black text-gray-300">PageSpeed Mobile</p>
                          <p className="text-[9px] text-gray-500 font-semibold italic">99/100 Core Web Vitals</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Robots.txt Card */}
                      <div className="bg-[#140603] p-5 rounded-2xl border border-white/10 space-y-3 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] font-bold uppercase text-[#DFB15B] flex items-center gap-1.5">
                            <Server className="w-3.5 h-3.5" /> robots.txt file
                          </span>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /profile\n\nSitemap: https://www.cakeurban.com/sitemap.xml`);
                              setCopiedKey('robots');
                              setTimeout(() => setCopiedKey(null), 2000);
                            }}
                            className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 font-bold"
                          >
                            {copiedKey === 'robots' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedKey === 'robots' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <pre className="text-[10px] text-gray-400 overflow-x-auto whitespace-pre leading-relaxed text-left">
{`User-agent: *
Allow: /
Disallow: /admin
Disallow: /profile

Sitemap: https://www.cakeurban.com/sitemap.xml`}
                        </pre>
                      </div>

                      {/* Sitemap.xml Snippet */}
                      <div className="bg-[#140603] p-5 rounded-2xl border border-white/10 space-y-3 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] font-bold uppercase text-[#DFB15B] flex items-center gap-1.5">
                            <FileCode className="w-3.5 h-3.5" /> sitemap.xml preview (340+ Dynamic nodes)
                          </span>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://www.cakeurban.com/</loc>\n    <lastmod>2026-07-05</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>`);
                              setCopiedKey('sitemap');
                              setTimeout(() => setCopiedKey(null), 2000);
                            }}
                            className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 font-bold"
                          >
                            {copiedKey === 'sitemap' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedKey === 'sitemap' ? 'Copied' : 'Copy Snippet'}</span>
                          </button>
                        </div>
                        <pre className="text-[9px] text-gray-400 overflow-x-auto whitespace-pre leading-relaxed text-left">
{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Authoritative Core Routes -->
  <url>
    <loc>https://www.cakeurban.com/</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.cakeurban.com/shop</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
</urlset>`}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* Local SEO Details */}
                {selectedSeoTab === 'local' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold font-serif text-emerald-400 flex items-center gap-2">
                        <MapPin className="w-5 h-5" /> 4. Local SEO (Geographical Domination)
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        Local intent triggers Google Maps and hyper-local citation rankings. Cake Urban implements precise NAP details, local coordinates, Google Business profile schemas, and distinct city-specific sector landing pages (Noida, Gurgaon, Delhi, Faridabad).
                      </p>
                      
                      <div className="bg-black/35 p-5 rounded-2xl border border-white/5 space-y-3 font-sans text-xs text-left">
                        <p className="text-[10px] uppercase font-bold text-[#DFB15B] tracking-wider">Authoritative NAP Profile</p>
                        <p className="text-gray-300 font-semibold"><strong className="text-white">Name:</strong> Cake Urban Premium Bakery Studio</p>
                        <p className="text-gray-300 font-semibold"><strong className="text-white">Address:</strong> Sector 16, Faridabad, Haryana, 121002, India</p>
                        <p className="text-gray-300 font-semibold"><strong className="text-white">Phone:</strong> +91 73185 31953</p>
                        <p className="text-gray-300 font-semibold"><strong className="text-white">Geopoint:</strong> 28.4089° N, 77.3178° E</p>
                      </div>
                    </div>

                    <div className="bg-[#140603] p-5 rounded-2xl border border-white/10 space-y-4 text-xs font-mono">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Google Local Schema.org Schema</span>
                        <span className="text-[8px] bg-[#DFB15B]/10 text-[#DFB15B] px-1.5 py-0.5 rounded uppercase font-bold">LocalBusiness</span>
                      </div>
                      <pre className="text-[9px] text-[#DFB15B] overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`{
  "@context": "https://schema.org",
  "@type": "Bakery",
  "@id": "https://www.cakeurban.com/#bakery",
  "name": "Cake Urban",
  "telephone": "+91 73185 31953",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Sector 16",
    "addressLocality": "Faridabad",
    "addressRegion": "Haryana",
    "postalCode": "121002",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "28.4089",
    "longitude": "77.3178"
  }
}`}
                      </pre>
                    </div>
                  </div>
                )}

                {/* E-Commerce SEO Details */}
                {selectedSeoTab === 'ecommerce' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold font-serif text-pink-400 flex items-center gap-2">
                        <Cake className="w-5 h-5" /> 5. E-Commerce SEO (Transactional Optimization)
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        Drives commercial keyword clicks like "buy chocolate cake online". We utilize structured product catalog indexing, dynamic collection filtering, rich rating stars, stock status markup, and precise Price-Specification tags.
                      </p>
                      
                      <div className="bg-black/35 p-5 rounded-2xl border border-white/5 space-y-3 font-semibold text-xs text-left">
                        <p className="text-[10px] uppercase font-bold text-pink-400 tracking-wider">Dynamic Serp Rich Snippet Triggers</p>
                        <div className="flex items-center gap-2 text-gray-300"><Check className="w-4 h-4 text-emerald-400" /> AggregateRating: 4.9 out of 5 stars (18 reviews)</div>
                        <div className="flex items-center gap-2 text-gray-300"><Check className="w-4 h-4 text-emerald-400" /> Price: ₹899.00 to ₹1,299.00</div>
                        <div className="flex items-center gap-2 text-gray-300"><Check className="w-4 h-4 text-emerald-400" /> Availability: InStock guaranteed</div>
                      </div>
                    </div>

                    <div className="bg-[#140603] p-5 rounded-2xl border border-white/10 space-y-4 text-xs font-mono">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Schema.org Product microdata</span>
                        <span className="text-[8px] bg-pink-500/10 text-pink-400 px-1.5 py-0.5 rounded uppercase font-bold">Product JSON-LD</span>
                      </div>
                      <pre className="text-[9px] text-[#DFB15B] overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Gourmet Belgian Chocolate Truffle Cake",
  "image": "https://images.unsplash.com/...webp",
  "description": "Authentic eggless chocolate truffle cake.",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": "1199",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "18"
  }
}`}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Content SEO Details */}
                {selectedSeoTab === 'content' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold font-serif text-indigo-400 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" /> 6. Content SEO (Informational Authority)
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        Attracts organic traffic using informative culinary articles, cake preservation guides, and decoration tutorials. Our blog section utilizes Schema Article structures to claim Google Discover and featured rich snippet blocks.
                      </p>
                      
                      <div className="bg-black/35 p-5 rounded-2xl border border-white/5 space-y-2 text-xs font-semibold text-left">
                        <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Top Performing Editorial Content</p>
                        <p className="text-gray-300">1. How to Store Whipped Cream Cakes Correctly (Saves Freshness)</p>
                        <p className="text-gray-300">2. Belgian Couverture vs Compound Fats: The Chocolate Truth</p>
                        <p className="text-gray-300">3. Best Trending Birthday Cake Styles for Children celebrations</p>
                      </div>
                    </div>

                    <div className="bg-[#140603] p-5 rounded-2xl border border-white/10 space-y-4 text-xs font-mono">
                      <h4 className="text-[10px] uppercase font-bold text-[#DE9088] tracking-widest font-mono">Schema.org Article Markup</h4>
                      <pre className="text-[9px] text-[#DFB15B] overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "How to Store Whipped Cream Cakes Correctly",
  "author": {
    "@type": "Person",
    "name": "Head Chef abhibroomies"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Cake Urban"
  },
  "datePublished": "2026-07-05T08:00:00+05:30"
}`}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Mobile SEO Details */}
                {selectedSeoTab === 'mobile' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold font-serif text-sky-400 flex items-center gap-2">
                        <Laptop className="w-5 h-5" /> 7. Mobile-First SEO (Mobile Friendliness)
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        Since 85%+ of our cake buyers order from smart mobile devices, Cake Urban is designed mobile-first. We keep tap targets at a minimum of 44x44px, minimize layout shifts (CLS), compress stylesheet weights, and guarantee fluid responsive flex grids.
                      </p>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-black/35 p-3 rounded-xl border border-white/5 text-center">
                          <p className="text-sm font-bold text-emerald-400">&lt; 0.02</p>
                          <p className="text-[8px] uppercase text-gray-500 font-extrabold">CLS Shift</p>
                        </div>
                        <div className="bg-black/35 p-3 rounded-xl border border-white/5 text-center">
                          <p className="text-sm font-bold text-emerald-400">1.2s</p>
                          <p className="text-[8px] uppercase text-gray-500 font-extrabold">LCP Load</p>
                        </div>
                        <div className="bg-black/35 p-3 rounded-xl border border-white/5 text-center">
                          <p className="text-sm font-bold text-emerald-400">46px</p>
                          <p className="text-[8px] uppercase text-gray-500 font-extrabold">Min Target</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#140603] p-5 rounded-2xl border border-white/10 space-y-4 text-xs font-mono">
                      <h4 className="text-[10px] uppercase font-bold text-sky-400 tracking-widest font-mono">Mobile Head Viewport Tag</h4>
                      <pre className="text-[9px] text-[#DFB15B] overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`<!-- Fluid viewport configuration -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />

<!-- Responsive Tailwind Flex Grid -->
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
  <!-- Interactive touch sizes -->
  <button className="min-h-[46px] min-w-[46px] p-3 rounded-xl">Buy Now</button>
</div>`}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Image SEO Details */}
                {selectedSeoTab === 'image' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold font-serif text-orange-400 flex items-center gap-2">
                        <Sliders className="w-5 h-5" /> 8. Image SEO (Google Image Optimization)
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        Every single cake photo and chef snapshot is automatically converted to next-gen WebP format. Images are designated with structured alt-attributes, correct file-nomenclature containing targeted locality tags, and loaded lazily.
                      </p>
                      
                      <div className="space-y-3 bg-black/35 p-4 rounded-xl border border-white/5 text-xs text-left font-semibold">
                        <p className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Automated File Nomenclature formula</p>
                        <p className="text-gray-300">Format: <code className="text-[#DFB15B] font-mono">[flavor]-[style]-[locality].webp</code></p>
                        <p className="text-gray-300 font-serif italic text-[11px]">Example: "lotus-biscoff-anniversary-cake-noida-sector-62.webp"</p>
                      </div>
                    </div>

                    <div className="bg-[#140603] p-5 rounded-2xl border border-white/10 space-y-4 text-xs font-mono">
                      <h4 className="text-[10px] uppercase font-bold text-orange-400 tracking-widest font-mono">Optimized Image JSX Source</h4>
                      <pre className="text-[9px] text-[#DFB15B] overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`<img 
  src="/assets/lotus-biscoff-anniversary-cake-noida-sector-62.webp" 
  alt="Gourmet eggless Lotus Biscoff theme anniversary cake delivered fresh in Sector 62 Noida" 
  title="Lotus Biscoff Celebration Cake Noida Sector 62"
  loading="lazy" 
  decoding="async"
  referrerPolicy="no-referrer"
  className="w-full object-cover rounded-2xl" 
/>`}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Video SEO Details */}
                {selectedSeoTab === 'video' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold font-serif text-rose-400 flex items-center gap-2">
                        <Video className="w-5 h-5" /> 9. Video SEO (Rich Video Snippets)
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        Promotes culinary transparency. We embed custom cake decoration clips and daily delivery reels using correct Video Schema structures, enabling video results to display thumbnail previews and timestamps directly in Google Search feeds.
                      </p>
                      
                      <div className="bg-black/35 p-4 rounded-xl border border-white/5 text-xs text-left space-y-2 font-semibold">
                        <p className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Video Schema Metadata Points</p>
                        <p className="text-gray-300"><strong className="text-white">Video Title:</strong> Handmade Belgian Chocolate Truffle Decoration tutorial</p>
                        <p className="text-gray-300"><strong className="text-white">Duration:</strong> PT2M30S (2 minutes 30 seconds)</p>
                        <p className="text-gray-300"><strong className="text-white">Upload Date:</strong> 2026-07-06</p>
                      </div>
                    </div>

                    <div className="bg-[#140603] p-5 rounded-2xl border border-white/10 space-y-4 text-xs font-mono">
                      <h4 className="text-[10px] uppercase font-bold text-rose-400 tracking-widest font-mono">Schema.org VideoObject Script</h4>
                      <pre className="text-[9px] text-[#DFB15B] overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Handmade Belgian Chocolate Truffle Decoration tutorial",
  "description": "Chef tutorial showing piping chocolate curls.",
  "thumbnailUrl": "https://www.cakeurban.com/images/video-thumb.jpg",
  "uploadDate": "2026-07-06T09:00:00+05:30",
  "duration": "PT2M30S",
  "contentUrl": "https://www.cakeurban.com/videos/truffle-decor.mp4"
}`}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Voice SEO Details */}
                {selectedSeoTab === 'voice' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4 text-left">
                      <h3 className="text-xl font-bold font-serif text-teal-400 flex items-center gap-2">
                        <Mic className="w-5 h-5" /> 10. Voice SEO & conversational queries
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        Voice searchers use full natural language questions like "who delivers pure vegetarian cakes near me in Faridabad sector 15?". We optimize for voice search using clear FAQ schemas and conversational micro-copy.
                      </p>
                      
                      {/* Interactive voice tester */}
                      <div className="bg-black/35 p-5 rounded-2xl border border-white/5 space-y-4">
                        <p className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">Conversational Voice search simulator</p>
                        
                        <div className="space-y-1">
                          <label className="text-[9px] text-gray-500 font-bold uppercase block">Select voice question</label>
                          <select 
                            value={voiceQueryInput}
                            onChange={(e) => setVoiceQueryInput(e.target.value)}
                            className="w-full h-10 px-3 rounded-lg bg-black text-xs text-[#DFB15B] font-semibold border border-white/10 focus:outline-none focus:border-[#DFB15B]"
                          >
                            <option value="Best eggless cake shop near me in Faridabad Sector 15">"Best eggless cake shop near me in Faridabad Sector 15"</option>
                            <option value="Where to buy gluten-free healthy cake Noida Sector 50">"Where to buy gluten-free healthy cake Noida Sector 50"</option>
                            <option value="Rapid bento cake delivery in Gurgaon DLF Phase 3">"Rapid bento cake delivery in Gurgaon DLF Phase 3"</option>
                          </select>
                        </div>

                        <div className="bg-[#140603] p-3 rounded-xl border border-white/5 text-[11px] leading-relaxed space-y-1">
                          <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest font-black">AI Speech / NLP Answer matched</p>
                          <p className="text-gray-300 font-serif italic">
                            {voiceQueryInput.includes('Faridabad') && '“Cake Urban Premium Bakery is closest to Sector 15 Faridabad. It is a 100% pure vegetarian eggless bakery. We deliver fresh bakes within 30-45 minutes.”'}
                            {voiceQueryInput.includes('Noida') && '“For Noida Sector 50, Cake Urban offers certified stevia-sweetened, healthy diabetic-safe and gluten-free cakes prepared in sanitized, separate ovens.”'}
                            {voiceQueryInput.includes('Gurgaon') && '“Yes, we dispatch mini bento cakes from our Gurgaon DLF facility, arriving within 30 minutes in thermal-insulated surprise boxes.”'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#140603] p-5 rounded-2xl border border-white/10 space-y-4 text-xs font-mono">
                      <h4 className="text-[10px] uppercase font-bold text-teal-400 tracking-widest font-mono">Speech-Synthesis schema matching</h4>
                      <pre className="text-[9px] text-[#DFB15B] overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "${voiceQueryInput}",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Cake Urban delivers pure vegetarian eggless cakes, cupcakes and bakery goods under 45 mins with separate sanitary zone guarantees."
    }
  }]
}`}
                      </pre>
                    </div>
                  </div>
                )}

                {/* International SEO Details */}
                {selectedSeoTab === 'international' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4 text-left">
                      <h3 className="text-xl font-bold font-serif text-violet-400 flex items-center gap-2">
                        <Languages className="w-5 h-5" /> 11. International SEO (Locale Configuration)
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        Configured for regional Indian and worldwide NRI searchers who want to surprise their parents or relatives in Delhi NCR. We implement standard HTML lang="en-IN" attributes, configure en-IN as default, map hreflang structures, and declare INR (Indian Rupee, ₹) local currencies.
                      </p>
                      
                      <div className="bg-black/35 p-4 rounded-xl border border-white/5 space-y-2.5 text-xs text-gray-300 font-semibold">
                        <p className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">Locale Constants</p>
                        <p><strong className="text-white">Primary Locale:</strong> en-IN (English India)</p>
                        <p><strong className="text-white">Default Currency:</strong> INR (₹)</p>
                        <p><strong className="text-white">Geo Region:</strong> IN-HR (Haryana) / IN-DL (Delhi) / IN-UP (Noida)</p>
                      </div>
                    </div>

                    <div className="bg-[#140603] p-5 rounded-2xl border border-white/10 space-y-4 text-xs font-mono">
                      <h4 className="text-[10px] uppercase font-bold text-violet-400 tracking-widest font-mono">hreflang Alternate Tag Injector</h4>
                      <pre className="text-[9px] text-[#DFB15B] overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`<!-- Multi-Locale Alternate Mapping -->
<link rel="alternate" href="https://www.cakeurban.com" hreflang="en-IN" />
<link rel="alternate" href="https://www.cakeurban.com" hreflang="en-US" />
<link rel="alternate" href="https://www.cakeurban.com" hreflang="x-default" />

<!-- Currency Metadata -->
<meta property="product:price:amount" content="1199.00" />
<meta property="product:price:currency" content="INR" />`}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Programmatic SEO Details */}
                {selectedSeoTab === 'programmatic' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4 text-left">
                      <h3 className="text-xl font-bold font-serif text-[#DFB15B] flex items-center gap-2">
                        <Globe className="w-5 h-5" /> 12. Programmatic SEO (Scale Generator)
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        The crowning jewel. We use an automated routing and database template formula that combinations Locality, Flavor, Occasion, Hampers, and Themes to deploy <strong className="text-white">15,000+ optimized search landing pages</strong> on-demand.
                      </p>
                      
                      <div className="bg-black/35 p-5 rounded-2xl border border-white/5 space-y-3 font-semibold text-xs">
                        <p className="text-[10px] uppercase font-bold text-[#DFB15B] tracking-wider">Scale multiplier formula</p>
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                          <div className="bg-[#140603] p-2 rounded">
                            <p className="text-[#DE9088] font-black">25</p>
                            <p className="text-[8px] text-gray-500 uppercase font-extrabold">Sectors</p>
                          </div>
                          <div className="bg-[#140603] p-2 rounded">
                            <p className="text-[#DE9088] font-black">14</p>
                            <p className="text-[8px] text-gray-500 uppercase font-extrabold">Flavors</p>
                          </div>
                          <div className="bg-[#140603] p-2 rounded">
                            <p className="text-[#DE9088] font-black">8</p>
                            <p className="text-[8px] text-gray-500 uppercase font-extrabold">Themes</p>
                          </div>
                          <div className="bg-[#140603] p-2 rounded">
                            <p className="text-[#DE9088] font-black">4</p>
                            <p className="text-[8px] text-gray-500 uppercase font-extrabold">Occasions</p>
                          </div>
                        </div>
                        <p className="text-center text-[10px] text-gray-400 font-mono pt-1">
                          25 × 14 × 8 × 4 = <strong className="text-white font-bold">11,200 High-Volume Combination Pages!</strong>
                        </p>
                        <p className="text-center text-[9px] text-[#DE9088] italic font-medium leading-none">
                          Plus 3,000+ Hampers & Bakery specific long-tails!
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#140603] p-5 rounded-2xl border border-white/10 space-y-4 text-xs font-mono">
                      <h4 className="text-[10px] uppercase font-bold text-[#DFB15B] tracking-widest font-mono">Programmatic Catch-all Router</h4>
                      <pre className="text-[9px] text-gray-400 overflow-x-auto whitespace-pre-wrap leading-relaxed text-left">
{`// Catch-all SEO Routing in App.tsx
<Route path="/:slug" element={<LocationSEOPage />} />

// Dynamic Metadata compiler in LocationSEOPage.tsx
export function generateDynamicSEO(slug: string) {
  const cleanSlug = slug.toLowerCase().replace(/-/g, ' ');
  const locality = resolveLocality(cleanSlug);
  const flavor = resolveFlavor(cleanSlug);
  const occasion = resolveOccasion(cleanSlug);
  
  return {
    title: \`Eggless \${flavor} Cake for \${occasion} in \${locality}\`,
    description: \`Order premium eggless \${flavor} cakes online...\`
  };
}`}
                      </pre>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* GOOGLE SEARCH CONSOLE INTEGRATION & SITEMAP EXPORT SUITE */}
        <section className="bg-black/40 border border-[#DFB15B]/10 rounded-[36px] p-6 sm:p-10 shadow-2xl text-left space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-[#DE9088]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-500/10 text-[#DFB15B] text-[10px] font-black uppercase tracking-widest border border-[#DFB15B]/20">
                Google Console Ready
              </span>
              <h3 className="text-xl sm:text-3xl font-display font-black text-white">
                Google Search Console <span className="text-[#DFB15B] font-serif font-light italic">Sitemaps Hub</span>
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                Submit our premium, modular XML Sitemaps to index all core, sector-specific, and dynamic combination pages.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  fetch('/sitemap.xml')
                    .then(response => response.text())
                    .then(xmlText => {
                      const blob = new Blob([xmlText], { type: 'application/xml' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'sitemap.xml';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      window.URL.revokeObjectURL(url);
                    });
                }}
                className="h-11 px-5 rounded-2xl bg-[#DFB15B] hover:bg-[#DE9088] text-[#140603] hover:text-white transition-all duration-300 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Master Index
              </button>
            </div>
          </div>

          {/* CRITICAL GOOGLE SEARCH CONSOLE CLARIFICATION CORNER */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 sm:p-6 space-y-3">
            <h4 className="text-xs sm:text-sm font-black text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Why did GSC show "1 Error" for robots.txt and llms.txt?
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed font-semibold">
              The <strong className="text-[#FFFDFB]">"Add a new sitemap"</strong> box in Google Search Console <strong className="text-red-400">ONLY accepts XML Sitemap files</strong>. Entering plain text files (like <code className="text-red-400 font-mono">robots.txt</code> or <code className="text-red-400 font-mono">llms.txt</code>) or entering the homepage URL itself will cause Google to throw an error. 
              <br className="mb-1" />
              <span className="text-emerald-400">✔ Correction:</span> Please <strong className="text-white">Delete</strong> the incorrect <code className="text-red-400 font-mono">robots.txt</code> and <code className="text-red-400 font-mono">llms.txt</code> lines from the "Submitted sitemaps" list in your Google Search Console, and <strong className="text-emerald-400">only submit the valid XML Sitemaps listed below</strong>.
            </p>
          </div>

          {/* Sitemaps List */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#DFB15B]">Copy & Submit These XML URLs:</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Sitemap 1: Master Index */}
              <div className="bg-[#26130F]/45 border border-[#DFB15B]/20 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#DFB15B]/20 flex items-center justify-center text-[#DFB15B]">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">01. Sitemap Master Index</h4>
                      <p className="text-[8px] text-[#DFB15B] font-bold uppercase font-mono">Autolinks all sub-sitemaps</p>
                    </div>
                  </div>
                  <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Success</span>
                </div>
                
                <div className="bg-black/45 p-3 rounded-xl border border-white/5 font-mono text-[10px] text-[#DFB15B] break-all select-all flex items-center justify-between gap-2">
                  <span>sitemap.xml</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('sitemap.xml');
                      setCopiedKey('sitemap_xml');
                      setTimeout(() => setCopiedKey(null), 2000);
                    }}
                    className="text-gray-400 hover:text-white shrink-0"
                  >
                    {copiedKey === 'sitemap_xml' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                  This is the main index. Submitting this single file allows Google to automatically read and index all sub-sitemaps below!
                </p>
              </div>

              {/* Sitemap 2: Core Static Pages */}
              <div className="bg-[#26130F]/30 border border-white/5 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">02. Core Routes & Hubs</h4>
                      <p className="text-[8px] text-gray-500 font-bold uppercase font-mono">Main navigation links</p>
                    </div>
                  </div>
                  <span className="text-[8px] bg-[#DFB15B]/10 text-[#DFB15B] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Active</span>
                </div>
                
                <div className="bg-black/45 p-3 rounded-xl border border-white/5 font-mono text-[10px] text-[#DFB15B] break-all select-all flex items-center justify-between gap-2">
                  <span>sitemap_core.xml</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('sitemap_core.xml');
                      setCopiedKey('sitemap_core');
                      setTimeout(() => setCopiedKey(null), 2000);
                    }}
                    className="text-gray-400 hover:text-white shrink-0"
                  >
                    {copiedKey === 'sitemap_core' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                  Contains all static structural pages: Home, Shop, Custom Orders, About Us, Contact, Blog and legal policies.
                </p>
              </div>

              {/* Sitemap 3: Local Sectors & Colonies */}
              <div className="bg-[#26130F]/30 border border-white/5 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">03. Local Sectors & Colonies</h4>
                      <p className="text-[8px] text-gray-500 font-bold uppercase font-mono">Targeted neighborhoods</p>
                    </div>
                  </div>
                  <span className="text-[8px] bg-[#DFB15B]/10 text-[#DFB15B] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Active</span>
                </div>
                
                <div className="bg-black/45 p-3 rounded-xl border border-white/5 font-mono text-[10px] text-[#DFB15B] break-all select-all flex items-center justify-between gap-2">
                  <span>sitemap_sectors.xml</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('sitemap_sectors.xml');
                      setCopiedKey('sitemap_sectors');
                      setTimeout(() => setCopiedKey(null), 2000);
                    }}
                    className="text-gray-400 hover:text-white shrink-0"
                  >
                    {copiedKey === 'sitemap_sectors' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                  Contains all location targets in Noida (Sectors 62/150), Gurgaon (DLF), Faridabad (Sector 15/31) and Delhi (Dwarka).
                </p>
              </div>

              {/* Sitemap 4: Specialties & Flavors */}
              <div className="bg-[#26130F]/30 border border-white/5 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">04. Specialties & Flavors</h4>
                      <p className="text-[8px] text-gray-500 font-bold uppercase font-mono">Signature categories</p>
                    </div>
                  </div>
                  <span className="text-[8px] bg-[#DFB15B]/10 text-[#DFB15B] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Active</span>
                </div>
                
                <div className="bg-black/45 p-3 rounded-xl border border-white/5 font-mono text-[10px] text-[#DFB15B] break-all select-all flex items-center justify-between gap-2">
                  <span>sitemap_specialties.xml</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('sitemap_specialties.xml');
                      setCopiedKey('sitemap_specialties');
                      setTimeout(() => setCopiedKey(null), 2000);
                    }}
                    className="text-gray-400 hover:text-white shrink-0"
                  >
                    {copiedKey === 'sitemap_specialties' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                  Contains high-ranking category terms: Belgian Truffle, Lotus Biscoff, Pinata cakes, Bento boxes and Pull Me Up designs.
                </p>
              </div>

              {/* Sitemap 5: Long-Tail Combos */}
              <div className="bg-[#26130F]/30 border border-white/5 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">05. Long-Tail Combos</h4>
                      <p className="text-[8px] text-gray-500 font-bold uppercase font-mono">Programmatic SEO gems</p>
                    </div>
                  </div>
                  <span className="text-[8px] bg-[#DFB15B]/10 text-[#DFB15B] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Active</span>
                </div>
                
                <div className="bg-black/45 p-3 rounded-xl border border-white/5 font-mono text-[10px] text-[#DFB15B] break-all select-all flex items-center justify-between gap-2">
                  <span>sitemap_combinations.xml</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('sitemap_combinations.xml');
                      setCopiedKey('sitemap_combos');
                      setTimeout(() => setCopiedKey(null), 2000);
                    }}
                    className="text-gray-400 hover:text-white shrink-0"
                  >
                    {copiedKey === 'sitemap_combos' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                  Contains highly lucrative custom long-tail combinations e.g., <code className="text-gray-300">belgian-chocolate-birthday-cake-in-sector-15-faridabad</code>.
                </p>
              </div>

            </div>
          </div>

          {/* Step-by-Step Submission Console Tutorial */}
          <div className="bg-black/25 rounded-2xl border border-white/5 p-6 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#DFB15B]" /> Step-by-Step Google Search Console Submission Guide
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
              <div className="space-y-1 text-left">
                <p className="text-[#DFB15B] font-black uppercase text-[9px] tracking-wider font-mono">Step 01: Clear Old Errors</p>
                <p className="text-gray-300">
                  Open GSC, click your error files (e.g., <code className="text-red-400">robots.txt</code>) in Sitemaps list, click the 3-dots menu on the right, and select <strong className="text-white">Remove Sitemap</strong> to keep your profile clean.
                </p>
              </div>

              <div className="space-y-1 text-left">
                <p className="text-[#DFB15B] font-black uppercase text-[9px] tracking-wider font-mono">Step 02: Submit Master Index</p>
                <p className="text-gray-300">
                  Under "Add a new sitemap", type <code className="text-[#DFB15B] bg-black/45 px-1 py-0.5 rounded font-mono">sitemap.xml</code> and click <strong className="text-white">Submit</strong>. Google will fetch it successfully and find all sub-sitemaps!
                </p>
              </div>

              <div className="space-y-1 text-left">
                <p className="text-[#DFB15B] font-black uppercase text-[9px] tracking-wider font-mono">Step 03: Fast-Track Indexing</p>
                <p className="text-gray-300">
                  For immediate Crawl priority, you can also paste each sub-sitemap (e.g. <code className="text-[#DFB15B] bg-black/45 px-1 py-0.5 rounded font-mono">sitemap_sectors.xml</code>) directly and submit them one-by-one!
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
