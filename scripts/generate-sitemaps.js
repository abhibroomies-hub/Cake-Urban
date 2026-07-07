import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Emulate __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, "..", "public");

// Ensure public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Data structures matching server.ts exactly
const CITIES = ["Delhi", "Noida", "Gurgaon", "Faridabad", "Ghaziabad"];

const LOCALITIES = [
  // Faridabad
  { name: "Sector 31", city: "Faridabad", slug: "sector-31" },
  { name: "Sector 15", city: "Faridabad", slug: "sector-15" },
  { name: "Sector 14", city: "Faridabad", slug: "sector-14" },
  { name: "Sector 21", city: "Faridabad", slug: "sector-21" },
  { name: "Greenfield Colony", city: "Faridabad", slug: "greenfield" },
  { name: "NIT Faridabad", city: "Faridabad", slug: "nit" },
  { name: "Sector 16", city: "Faridabad", slug: "sector-16" },
  { name: "Sector 17", city: "Faridabad", slug: "sector-17" },
  { name: "Sector 19", city: "Faridabad", slug: "sector-19" },
  { name: "Sector 28", city: "Faridabad", slug: "sector-28" },
  { name: "Sector 29", city: "Faridabad", slug: "sector-29" },
  { name: "Sector 35", city: "Faridabad", slug: "sector-35" },
  { name: "Sector 37", city: "Faridabad", slug: "sector-37" },
  { name: "Sector 46", city: "Faridabad", slug: "sector-46" },
  { name: "Sector 85", city: "Faridabad", slug: "sector-85" },
  { name: "Sector 86", city: "Faridabad", slug: "sector-86" },
  { name: "Sector 89", city: "Faridabad", slug: "sector-89" },
  { name: "Neharpar", city: "Faridabad", slug: "neharpar" },
  { name: "Ashoka Enclave", city: "Faridabad", slug: "ashoka-enclave" },
  { name: "Sarai Khawaja", city: "Faridabad", slug: "sarai" },
  { name: "Surajkund", city: "Faridabad", slug: "surajkund" },
  { name: "Charmwood", city: "Faridabad", slug: "charmwood" },

  // Noida
  { name: "Sector 62", city: "Noida", slug: "sector-62" },
  { name: "Sector 15", city: "Noida", slug: "sector-15-noida" },
  { name: "Sector 18", city: "Noida", slug: "sector-18" },
  { name: "Sector 50", city: "Noida", slug: "sector-50" },
  { name: "Sector 137", city: "Noida", slug: "sector-137" },
  { name: "Sector 150", city: "Noida", slug: "sector-150" },
  { name: "Sector 63", city: "Noida", slug: "sector-63" },
  { name: "Sector 75", city: "Noida", slug: "sector-75" },
  { name: "Sector 76", city: "Noida", slug: "sector-76" },
  { name: "Sector 78", city: "Noida", slug: "sector-78" },
  { name: "Noida Extension", city: "Noida", slug: "noida-extension" },
  { name: "Greater Noida", city: "Noida", slug: "greater-noida" },
  { name: "Gaur City", city: "Noida", slug: "gaur-city" },

  // Gurgaon
  { name: "DLF Phase 1-5", city: "Gurgaon", slug: "dlf-phase" },
  { name: "Golf Course Road", city: "Gurgaon", slug: "golf-course-road" },
  { name: "Sohna Road", city: "Gurgaon", slug: "sohna-road" },
  { name: "Cyber City", city: "Gurgaon", slug: "cyber-city" },
  { name: "Golf Course Ext", city: "Gurgaon", slug: "golf-course-ext" },
  { name: "MG Road", city: "Gurgaon", slug: "mg-road" },
  { name: "Sushant Lok", city: "Gurgaon", slug: "sushant-lok" },
  { name: "Sector 56", city: "Gurgaon", slug: "sector-56-gurgaon" },
  { name: "Sector 82", city: "Gurgaon", slug: "sector-82-gurgaon" },
  { name: "Sector 45", city: "Gurgaon", slug: "sector-45-gurgaon" },

  // Delhi
  { name: "Dwarka", city: "Delhi", slug: "dwarka" },
  { name: "South Delhi", city: "Delhi", slug: "south-delhi" },
  { name: "West Delhi", city: "Delhi", slug: "west-delhi" },
  { name: "Punjabi Bagh", city: "Delhi", slug: "punjabi-bagh" },
  { name: "Rohini", city: "Delhi", slug: "rohini" },
  { name: "Janakpuri", city: "Delhi", slug: "janakpuri" },
  { name: "Saket", city: "Delhi", slug: "saket" },
  { name: "Pitampura", city: "Delhi", slug: "pitampura" },
  { name: "Karol Bagh", city: "Delhi", slug: "karol-bagh" },
  { name: "Connaught Place", city: "Delhi", slug: "connaught-place" },
  { name: "Greater Kailash", city: "Delhi", slug: "greater-kailash" },
  { name: "Vasant Kunj", city: "Delhi", slug: "vasant-kunj" },
  { name: "Hauz Khas", city: "Delhi", slug: "hauz-khas" },
  { name: "Malviya Nagar", city: "Delhi", slug: "malviya-nagar" },
  { name: "Rajouri Garden", city: "Delhi", slug: "rajouri-garden" },
  { name: "Model Town", city: "Delhi", slug: "model-town" },
  { name: "Civil Lines", city: "Delhi", slug: "civil-lines" },
  { name: "Mayur Vihar", city: "Delhi", slug: "mayur-vihar" },
  { name: "Preet Vihar", city: "Delhi", slug: "preet-vihar" },
  { name: "Laxmi Nagar", city: "Delhi", slug: "laxmi-nagar" },

  // Ghaziabad
  { name: "Indirapuram", city: "Ghaziabad", slug: "indirapuram" },
  { name: "Vaishali", city: "Ghaziabad", slug: "vaishali" },
  { name: "Vasundhara", city: "Ghaziabad", slug: "vasundhara" },
  { name: "Kaushambi", city: "Ghaziabad", slug: "kaushambi" },
  { name: "Raj Nagar Ext", city: "Ghaziabad", slug: "raj-nagar" },
  { name: "Crossing Republik", city: "Ghaziabad", slug: "crossing-republik" }
];

const OCCASIONS = [
  { name: "Birthday", slug: "birthday" },
  { name: "Anniversary", slug: "anniversary" },
  { name: "Wedding", slug: "wedding" },
  { name: "Engagement", slug: "engagement" },
  { name: "Baby Shower", slug: "baby-shower" },
  { name: "Retirement", slug: "retirement" },
  { name: "Farewell", slug: "farewell" },
  { name: "Graduation", slug: "graduation" },
  { name: "Corporate Events", slug: "corporate" }
];

const FLAVORS = [
  { name: "Belgian Chocolate Truffle", slug: "belgian-chocolate" },
  { name: "Chocolate Hazelnut", slug: "chocolate-hazelnut" },
  { name: "Classic Chocolate Truffle", slug: "truffle" },
  { name: "Ferrero Rocher", slug: "ferrero-rocher" },
  { name: "Lotus Biscoff", slug: "lotus-biscoff" },
  { name: "Indian Rasmalai", slug: "rasmalai" },
  { name: "Red Velvet Deluxe", slug: "red-velvet" },
  { name: "Classic Black Forest", slug: "black-forest" },
  { name: "Crunchy Butterscotch", slug: "butterscotch" },
  { name: "Sunshine Pineapple", slug: "pineapple" },
  { name: "Alphonso Mango", slug: "mango" },
  { name: "Sweet Strawberry", slug: "strawberry" },
  { name: "Orchard Fresh Fruit", slug: "fruit" },
  { name: "Madagascar Vanilla", slug: "vanilla" }
];

const THEMES = [
  { name: "Bento Mini", slug: "bento" },
  { name: "Interactive Pinata", slug: "pinata" },
  { name: "Cascading Pull Me Up", slug: "pull-me-up" },
  { name: "Edible Photo Print", slug: "photo" },
  { name: "Artisan Customized", slug: "customized" },
  { name: "Premium Designer", slug: "designer" },
  { name: "Kids Birthday Cartoon", slug: "kids" },
  { name: "Artisanal Cupcake Pack", slug: "cupcake" },
  { name: "Healthy Sugar-Free", slug: "sugar-free" },
  { name: "Bespoke 3D Sculpted", slug: "3d" },
  { name: "Hand-sculpted Fondant", slug: "fondant" },
  { name: "Magical Unicorn", slug: "unicorn" },
  { name: "Royal Princess Tier", slug: "princess" },
  { name: "Action Superhero", slug: "superhero" },
  { name: "Cricket pitch sports", slug: "cricket" },
  { name: "Football stadium sports", slug: "football" },
  { name: "Fitness Gym themed", slug: "gym" },
  { name: "Classic Sports Car", slug: "car" },
  { name: "Superbike sports", slug: "bike" },
  { name: "Paris Cosmetics Makeup Box", slug: "makeup" },
  { name: "Doctor & Medical special", slug: "doctor" },
  { name: "Engineers theme design", slug: "engineer" },
  { name: "Guru Teacher Special", slug: "teacher" }
];

const HAMPERS = [
  { name: "Gourmet Luxury Gift Hamper", slug: "premium-luxury-hamper" },
  { name: "Bespoke Birthday Surprise Casket", slug: "birthday-surprise-casket" },
  { name: "High-Tea Scone & Cookie Basket", slug: "high-tea-scone-basket" },
  { name: "Sweet Celebration Assorted Cookie Tray", slug: "sweet-celebration-cookie-tray" },
  { name: "Chocolate Lover's Grand Hamper", slug: "chocolate-lovers-gift-hamper" },
  { name: "Handmade Luxury Praline Box", slug: "handmade-praline-box" },
  { name: "Bakers Special Breakfast Basket", slug: "bakers-breakfast-basket" }
];

const BAKERY_ITEMS = [
  { name: "Artisanal Sourdough Boule", slug: "sourdough-boule" },
  { name: "Garlic Butter Herbed Loaf", slug: "garlic-butter-bread" },
  { name: "Italian Black Olive Focaccia", slug: "olive-focaccia" },
  { name: "Buttery Brioche Burger Buns", slug: "brioche-buns" },
  { name: "Traditional French Baguette", slug: "french-baguette" },
  { name: "Assorted French Macarons Pack", slug: "macarons-pack" },
  { name: "English Sweet Scones Box", slug: "sweet-scones" },
  { name: "Premium Butter Croissants Pair", slug: "butter-croissants" }
];

console.log("Starting sitemap build-time generation...");

// 1. GENERATE sitemap_core.xml
{
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Core static pages
  const corePages = ["", "shop", "custom-order", "about", "contact", "blog", "legal"];
  corePages.forEach(p => {
    xml += `  <url>\n    <loc>https://www.cakeurban.com/${p}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  });

  // Regional hubs
  const hubs = ["bakery-in-delhi", "bakery-in-noida", "bakery-in-faridabad", "bakery-in-gurgaon", "bakery-in-ghaziabad"];
  hubs.forEach(h => {
    xml += `  <url>\n    <loc>https://www.cakeurban.com/${h}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.95</priority>\n  </url>\n`;
  });

  // Custom studios
  const studios = ["designer-cakes-in-noida", "custom-cakes-in-gurgaon", "photo-cakes-in-ghaziabad", "cake-delivery-in-faridabad"];
  studios.forEach(s => {
    xml += `  <url>\n    <loc>https://www.cakeurban.com/${s}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.90</priority>\n  </url>\n`;
  });

  // Pattern 2: [Flavor] [Occasion] Cake Shop in [City] (630 URLs)
  for (const city of CITIES) {
    for (const flav of FLAVORS) {
      for (const occ of OCCASIONS) {
        xml += `  <url>\n    <loc>https://www.cakeurban.com/${flav.slug}-${occ.slug}-cake-in-${city.toLowerCase()}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.80</priority>\n  </url>\n`;
      }
    }
  }

  // Pattern 8: [Hamper Type] Gifting in [City] (35 URLs)
  for (const city of CITIES) {
    for (const hamper of HAMPERS) {
      xml += `  <url>\n    <loc>https://www.cakeurban.com/${hamper.slug}-gifting-hamper-in-${city.toLowerCase()}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.80</priority>\n  </url>\n`;
    }
  }

  // Pattern 9: [Bakery Item] Shop in [City] (40 URLs)
  for (const city of CITIES) {
    for (const item of BAKERY_ITEMS) {
      xml += `  <url>\n    <loc>https://www.cakeurban.com/artisanal-${item.slug}-bakery-in-${city.toLowerCase()}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.80</priority>\n  </url>\n`;
    }
  }

  xml += `</urlset>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap_core.xml"), xml, "utf-8");
  console.log("Generated sitemap_core.xml");
}

// 2. GENERATE sitemap_sectors.xml
{
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static targeted sector pages
  const staticSectors = [
    "cake-delivery-faridabad-sector-31",
    "cake-delivery-faridabad-sector-15",
    "best-cake-in-greenfield-faridabad",
    "cake-delivery-faridabad-sector-14",
    "cake-delivery-faridabad-sector-16",
    "cake-delivery-faridabad-sector-21",
    "cake-delivery-faridabad-sector-37",
    "cake-delivery-faridabad-sector-85",
    "cake-delivery-faridabad-neharpar",
    "cake-delivery-noida-sector-62",
    "cake-delivery-noida-sector-18",
    "cake-delivery-noida-sector-15",
    "cake-delivery-noida-sector-50",
    "cake-delivery-noida-sector-137",
    "cake-delivery-noida-sector-150",
    "cake-delivery-noida-extension",
    "cake-delivery-gurgaon-dlf",
    "cake-delivery-gurgaon-golf-course-road",
    "cake-delivery-gurgaon-golf-course-ext",
    "cake-delivery-gurgaon-sohna-road",
    "cake-delivery-gurgaon-cyber-city",
    "cake-delivery-gurgaon-sushant-lok",
    "cake-delivery-delhi-dwarka",
    "cake-delivery-delhi-south-delhi",
    "cake-delivery-delhi-saket",
    "cake-delivery-delhi-greater-kailash",
    "cake-delivery-delhi-janakpuri",
    "cake-delivery-delhi-punjabi-bagh",
    "cake-delivery-delhi-rohini",
    "cake-delivery-delhi-pitampura"
  ];
  staticSectors.forEach(s => {
    xml += `  <url>\n    <loc>https://www.cakeurban.com/${s}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.90</priority>\n  </url>\n`;
  });

  // Pattern 3: [Theme] Cake Delivery in [Locality] (575 URLs)
  for (const loc of LOCALITIES) {
    for (const theme of THEMES) {
      xml += `  <url>\n    <loc>https://www.cakeurban.com/${theme.slug}-cake-delivery-in-${loc.slug}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
    }
  }

  // Pattern 5: [Occasion] Cake Delivery in [Locality] (225 URLs)
  for (const loc of LOCALITIES) {
    for (const occ of OCCASIONS) {
      xml += `  <url>\n    <loc>https://www.cakeurban.com/${occ.slug}-cake-delivery-in-${loc.slug}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
    }
  }

  // Pattern 6: [Hamper Type] [Occasion] Gift Delivery in [Locality] (700 URLs)
  for (const loc of LOCALITIES) {
    for (const hamper of HAMPERS) {
      for (const occ of OCCASIONS.slice(0, 4)) {
        xml += `  <url>\n    <loc>https://www.cakeurban.com/eggless-${hamper.slug}-${occ.slug}-gift-delivery-in-${loc.slug}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
      }
    }
  }

  // Pattern 7: Artisanal [Bakery Item] Shop in [Locality] (800 URLs)
  for (const loc of LOCALITIES) {
    for (const item of BAKERY_ITEMS) {
      for (const occ of OCCASIONS.slice(0, 4)) {
        xml += `  <url>\n    <loc>https://www.cakeurban.com/fresh-${item.slug}-${occ.slug}-delivery-in-${loc.slug}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
      }
    }
  }

  // Pattern 10: Short Keywords in [Locality] (150 URLs) (NEW)
  const shortKwTemplates = [
    "cake-shop-in-[loc]",
    "cake-delivery-in-[loc]",
    "eggless-cake-in-[loc]",
    "best-bakery-in-[loc]",
    "birthday-cake-in-[loc]",
    "pastry-shop-in-[loc]"
  ];

  for (const loc of LOCALITIES) {
    for (const temp of shortKwTemplates) {
      const slugPath = temp.replace("[loc]", loc.slug);
      xml += `  <url>\n    <loc>https://www.cakeurban.com/${slugPath}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.90</priority>\n  </url>\n`;
    }
  }

  // Pattern 11: Short Keywords in [City] (30 URLs) (NEW)
  for (const city of CITIES) {
    for (const temp of shortKwTemplates) {
      const slugPath = temp.replace("[loc]", city.toLowerCase());
      xml += `  <url>\n    <loc>https://www.cakeurban.com/${slugPath}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.90</priority>\n  </url>\n`;
    }
  }

  xml += `</urlset>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap_sectors.xml"), xml, "utf-8");
  console.log("Generated sitemap_sectors.xml");
}

// 3. GENERATE sitemap_specialties.xml
{
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static specialty pages
  const staticSpecialties = [
    "belgian-chocolate-truffle-cake",
    "lotus-biscoff-cake",
    "chocolate-hazelnut-cake",
    "eggless-red-velvet-cake",
    "pinata-cake-with-hammer",
    "bento-cake-delivery",
    "edible-photo-print-cake",
    "pull-me-up-cake",
    "sugar-free-healthy-cake",
    "rasmalai-cake-delivery",
    "customized-theme-cakes",
    "cupcake-pack-delivery",
    "premium-designer-cakes",
    "kids-birthday-cartoon-cake",
    "3d-sculpted-cakes",
    "fondant-art-cakes",
    "unicorn-theme-cake",
    "princess-crown-cake",
    "superhero-avengers-cake",
    "cricket-pitch-cake",
    "gym-fitness-cake",
    "makeup-box-cosmetics-cake"
  ];
  staticSpecialties.forEach(s => {
    xml += `  <url>\n    <loc>https://www.cakeurban.com/${s}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.90</priority>\n  </url>\n`;
  });

  // Pattern 4: [Flavor] Cake in [Locality] (350 URLs)
  for (const loc of LOCALITIES) {
    for (const flav of FLAVORS) {
      xml += `  <url>\n    <loc>https://www.cakeurban.com/${flav.slug}-cake-in-${loc.slug}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
    }
  }

  xml += `</urlset>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap_specialties.xml"), xml, "utf-8");
  console.log("Generated sitemap_specialties.xml");
}

// 4. GENERATE sitemap_combinations.xml
{
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static combinations
  const staticCombinations = [
    "belgian-chocolate-birthday-cake-in-sector-15-faridabad",
    "belgian-chocolate-birthday-cake-in-sector-31-faridabad",
    "belgian-chocolate-birthday-cake-in-noida-sector-62",
    "belgian-chocolate-birthday-cake-in-gurgaon-dlf",
    "belgian-chocolate-birthday-cake-in-delhi-dwarka",
    "lotus-biscoff-anniversary-cake-in-sector-62-noida",
    "lotus-biscoff-anniversary-cake-in-sector-15-faridabad",
    "lotus-biscoff-anniversary-cake-in-gurgaon-dlf",
    "lotus-biscoff-anniversary-cake-in-delhi-south-delhi",
    "chocolate-hazelnut-wedding-cake-in-dlf-gurgaon",
    "chocolate-hazelnut-wedding-cake-in-noida-extension",
    "chocolate-hazelnut-wedding-cake-in-greenfield-faridabad",
    "eggless-red-velvet-engagement-cake-in-dwarka-delhi",
    "eggless-red-velvet-engagement-cake-in-sector-15-faridabad",
    "eggless-red-velvet-engagement-cake-in-noida-sector-62",
    "rasmalai-corporate-event-cake-in-gurgaon-cyber-city",
    "rasmalai-corporate-event-cake-in-noida-sector-62",
    "rasmalai-corporate-event-cake-in-delhi-saket",
    "bento-mini-birthday-cake-in-south-delhi",
    "bento-mini-birthday-cake-in-sector-15-faridabad",
    "bento-mini-birthday-cake-in-noida-sector-137",
    "pinata-hammer-kids-cake-in-greenfield-faridabad",
    "pinata-hammer-kids-cake-in-noida-sector-150",
    "pinata-hammer-kids-cake-in-gurgaon-dlf",
    "edible-photo-anniversary-cake-in-indirapuram-ghaziabad",
    "edible-photo-anniversary-cake-in-dwarka-delhi",
    "edible-photo-anniversary-cake-in-sector-31-faridabad",
    "sugar-free-healthy-birthday-cake-in-sohna-road-gurgaon",
    "sugar-free-healthy-birthday-cake-in-south-delhi",
    "sugar-free-healthy-birthday-cake-in-sector-15-faridabad"
  ];
  staticCombinations.forEach(s => {
    xml += `  <url>\n    <loc>https://www.cakeurban.com/${s}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
  });

  // Pattern 1: [Flavor] [Theme] [Occasion] Cake Delivery in [Locality] (11,200 combinations)
  for (const loc of LOCALITIES) {
    for (let fIdx = 0; fIdx < FLAVORS.length; fIdx++) {
      const flav = FLAVORS[fIdx];
      for (let tShift = 0; tShift < 8; tShift++) {
        const theme = THEMES[(fIdx + tShift) % THEMES.length];
        for (let oShift = 0; oShift < 4; oShift++) {
          const occ = OCCASIONS[(fIdx + oShift) % OCCASIONS.length];
          xml += `  <url>\n    <loc>https://www.cakeurban.com/${flav.slug}-${theme.slug}-${occ.slug}-cake-delivery-in-${loc.slug}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.80</priority>\n  </url>\n`;
        }
      }
    }
  }

  xml += `</urlset>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap_combinations.xml"), xml, "utf-8");
  console.log("Generated sitemap_combinations.xml");
}

// 5. GENERATE sitemap.xml (Sitemap Index)
{
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.cakeurban.com/sitemap_core.xml</loc>
    <lastmod>2026-07-06</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.cakeurban.com/sitemap_sectors.xml</loc>
    <lastmod>2026-07-06</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.cakeurban.com/sitemap_specialties.xml</loc>
    <lastmod>2026-07-06</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.cakeurban.com/sitemap_combinations.xml</loc>
    <lastmod>2026-07-06</lastmod>
  </sitemap>
</sitemapindex>
`;
  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), xml, "utf-8");
  console.log("Generated sitemap.xml index");
}

console.log("All sitemaps successfully pre-generated for build phase!");
