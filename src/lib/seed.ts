import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

const DUMMY_PRODUCTS = [
  // 1. REGULAR CAKES (10 Products)
  {
    name: "Belgian Chocolate Truffle",
    description: "Rich Belgian chocolate ganache layered between moist cocoa sponge. Our absolute bestseller in Faridabad.",
    price: 850,
    categories: ["Cakes"],
    occasions: ["Birthday", "Anniversary"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true,
    weights: [0.5, 1, 1.5, 2]
  },
  {
    name: "Red Velvet Cheese Frosting",
    description: "Traditional vibrant red velvet layers with rich whipped cream cheese. Super silky texture.",
    price: 950,
    categories: ["Cakes"],
    occasions: ["Wedding", "Anniversary"],
    flavors: ["Red Velvet"],
    dietary: ["Eggless", "With Egg"],
    images: ["https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true,
    weights: [0.5, 1, 2]
  },
  {
    name: "Premium Butterscotch Crunch",
    description: "Classic golden honey sponge layered with butterscotch cream and crunchy caramelized praline cashews.",
    price: 750,
    categories: ["Cakes"],
    occasions: ["Birthday"],
    flavors: ["Butterscotch"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: false,
    weights: [0.5, 1, 1.5]
  },
  {
    name: "Starlight Strawberry Fields",
    description: "Fresh orchard picked strawberries with smooth vanilla bean cream on fluffy sponge layers.",
    price: 800,
    categories: ["Cakes"],
    occasions: ["Festival", "Birthday"],
    flavors: ["Strawberry"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true,
    weights: [0.5, 1, 2]
  },
  {
    name: "Pineapple Paradise Cake",
    description: "Sweet tangy pineapple chunks folded within chilled whipped cream and juicy sponge slices.",
    price: 699,
    categories: ["Cakes"],
    occasions: ["Birthday", "Festival"],
    flavors: ["Vanilla"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: false,
    weights: [0.5, 1]
  },
  {
    name: "Blueberry Bliss Cake",
    description: "Imported wild blueberry compote layered beautifully with rich mascarpone and soft vanilla cream.",
    price: 899,
    categories: ["Cakes"],
    occasions: ["Anniversary", "Birthday"],
    flavors: ["Blueberry"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1557925923-cd4648e21187?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: false,
    weights: [0.5, 1, 1.5]
  },
  {
    name: "Black Forest Traditional",
    description: "Rich chocolate shaving flakes, sour dark cherries, and fresh rum-spritzed vanilla whipped cream.",
    price: 799,
    categories: ["Cakes"],
    occasions: ["Birthday"],
    flavors: ["Chocolate"],
    dietary: ["With Egg"],
    images: ["https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: false,
    weights: [0.5, 1, 2]
  },
  {
    name: "Chocolate Hazelnut Premium",
    description: "Roasted hazelnuts mixed into a dense Nutella cream paste layered with luxury French cocoa sponge.",
    price: 1100,
    categories: ["Cakes"],
    occasions: ["Anniversary", "Birthday"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true,
    weights: [0.5, 1, 1.5, 2]
  },
  {
    name: "Majestic Mango Cream",
    description: "Seasonal sweet Alphonso pulp whipped into light yellow frosting. A pure premium delight.",
    price: 850,
    categories: ["Cakes"],
    occasions: ["Birthday", "Festival"],
    flavors: ["Mixed"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: false,
    weights: [0.5, 1]
  },
  {
    name: "Bento Chocolate Mini",
    description: "The viral Korean lunchbox cake. Highly cute, packaged inside a warm bio box with a pastel candle.",
    price: 499,
    categories: ["Cakes"],
    occasions: ["Birthday", "Kids Special"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true,
    isNew: true,
    weights: [0.25]
  },

  // 2. CUSTOM / THEME CAKES (6 Products)
  {
    name: "Luxurious Wedding Tier",
    description: "Majestic three-tiered wedding monument finished with exquisite white gold foil and edible luxury sugar flowers.",
    price: 4500,
    categories: ["Custom Cakes"],
    occasions: ["Wedding", "Anniversary"],
    flavors: ["Vanilla", "Strawberry"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true,
    weights: [3, 5]
  },
  {
    name: "Cosmos Galaxy Star Cake",
    description: "Deep galactic hand-painted blue & purple buttercream cake topped with edible glowing asteroid drops.",
    price: 2800,
    categories: ["Custom Cakes"],
    occasions: ["Birthday", "Kids Special"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: false,
    weights: [1, 2, 3]
  },
  {
    name: "Unicorn Pastel Smash",
    description: "Charming dream unicorn featuring handcrafted golden horn and matching colorful pastel hair swirls.",
    price: 2200,
    categories: ["Custom Cakes"],
    occasions: ["Birthday", "Kids Special"],
    flavors: ["Strawberry", "Vanilla"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1614707267537-b85acf00c4b8?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true,
    weights: [1.5, 2]
  },
  {
    name: "Under The Sea Mermaid",
    description: "Adorned with chocolate mermaid tails, sea shells, gold sprinkles and aqua teal gradient waves.",
    price: 3200,
    categories: ["Custom Cakes"],
    occasions: ["Birthday", "Kids Special"],
    flavors: ["Blueberry", "Vanilla"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1505935428862-770b6f24f629?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: false,
    weights: [1.5, 2, 3]
  },
  {
    name: "Royal Gold Leaf Crown",
    description: "An incredibly elegant design layered with regal deep black frosting, a chocolate crown and 24K gold foil.",
    price: 3500,
    categories: ["Custom Cakes"],
    occasions: ["Birthday", "Anniversary"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1518047601542-79f18c655718?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true,
    weights: [2, 3]
  },
  {
    name: "Bespoke Rose Bouquet",
    description: "Delicate and extremely detailed individual buttercream roses hand piped on our dense vanilla velvet cake.",
    price: 2900,
    categories: ["Custom Cakes"],
    occasions: ["Anniversary", "Wedding"],
    flavors: ["Red Velvet", "Vanilla"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1562266563-fa44c266111d?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: false,
    weights: [1.5, 2]
  },

  // 3. PASTRIES & INDIVIDUALS (5 Products)
  {
    name: "Blueberry Cheesecake Slice",
    description: "Tangy New York style baked cheesecake layer with fresh wild sweet blueberry compote.",
    price: 199,
    categories: ["Pastries", "Desserts"],
    occasions: ["Birthday"],
    flavors: ["Blueberry"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false,
    isBestseller: true
  },
  {
    name: "Mini Pastry Box (6 Pcs)",
    description: "A gorgeous luxury curation of our single slices - Chocolate Truffle, Velvet Rose, and Cream Fruits.",
    price: 599,
    categories: ["Pastries", "Desserts"],
    occasions: ["Festival", "Birthday"],
    flavors: ["Mixed"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false,
    isBestseller: true,
    isNew: true
  },
  {
    name: "Classic Fudgy Brownie",
    description: "Densely baked Belgian melted chocolate brownie containing toasted walnuts and glossy chocolate fudge.",
    price: 120,
    categories: ["Brownies", "Desserts"],
    occasions: ["Birthday"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false,
    isBestseller: true
  },
  {
    name: "Gold Rocher Cupcake",
    description: "Chocochip cupcake topped with silky Nutella buttercream and a luxury Ferrero chocolate crown.",
    price: 150,
    categories: ["Cupcakes", "Desserts"],
    occasions: ["Birthday", "Kids Special"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false,
    isBestseller: false
  },
  {
    name: "Warm Nutella Lava Cake",
    description: "Decadently moist cocoa pod featuring warm running hazelnut center. Microwave 15 seconds before eating.",
    price: 180,
    categories: ["Desserts"],
    occasions: ["Anniversary"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false,
    isNew: true
  },

  // 4. HAMPERS & Gifting (4 Products)
  {
    name: "Premium Luxury Gift Hamper",
    description: "Extravagant premium wicker hamper loaded with handmade praline chocolates, cookies, and red velvet jar.",
    price: 2499,
    categories: ["Hampers"],
    occasions: ["Festival", "Anniversary"],
    flavors: ["Mixed"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1549462980-6a03f721ff03?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false,
    isBestseller: true
  },
  {
    name: "Bakers special Breakfast Box",
    description: "Gourmet box containing 2 chocolate croissants, 2 seed buns and our signature sourdough loaf.",
    price: 899,
    categories: ["Hampers", "Breads"],
    occasions: ["Festival"],
    flavors: ["Mixed"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false,
    isNew: true
  },
  {
    name: "Gold Truffle Festive Basket",
    description: "Elegantly wrapped gold basket featuring 12 customized truffles, cookies, and floral sprigs.",
    price: 1899,
    categories: ["Hampers"],
    occasions: ["Festival"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1513220556108-8e6d3f2ef1d7?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false,
    isBestseller: false
  },
  {
    name: "Bespoke Birthday Surprise Casket",
    description: "An elegant black box holding a custom Bento mini cake, 2 customized chocolate popcakes and beautiful fairy lights.",
    price: 3200,
    categories: ["Hampers", "Custom Cakes"],
    occasions: ["Birthday", "Anniversary"],
    flavors: ["Mixed"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true
  }
];

export async function seedProducts() {
  const path = 'products';
  // 1. Instantly check localStorage to avoid any network call if already seeded in this browser
  if (localStorage.getItem('cakeurban_seeded_v1') === 'true') {
    return;
  }

  try {
    const prodCol = collection(db, path);
    const snap = await getDocs(prodCol);
    
    // 2. Only seed if the database has extremely few or 0 products.
    // This prevents wiping of products on every page load and stops permission/quota limits.
    if (snap.size >= 5) {
      console.log(`Database already has ${snap.size} products. Skipping seeding.`);
      localStorage.setItem('cakeurban_seeded_v1', 'true');
      return;
    }

    console.log("Seeding premium confections catalog...");
    // Clear the small or corrupted list first
    for (const docObj of snap.docs) {
      await deleteDoc(doc(db, path, docObj.id));
    }
    
    for (const p of DUMMY_PRODUCTS) {
      await addDoc(prodCol, {
        ...p,
        createdAt: serverTimestamp()
      });
    }
    console.log("Seeding complete! 25+ boutique products loaded successfully.");
    localStorage.setItem('cakeurban_seeded_v1', 'true');
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      console.warn("Seeding skipped: Missing permissions (guest or unauthenticated).");
      // Keep it as true so we don't retry on every single render in this session
      localStorage.setItem('cakeurban_seeded_v1', 'true');
    } else {
      console.error("Seeding failed:", error);
    }
  }
}
