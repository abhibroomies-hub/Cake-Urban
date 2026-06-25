import { Product } from '../types';

export const FALLBACK_PRODUCTS: Product[] = [
  // ==========================================
  // 1. STANDARD CELEBRATION CAKES (15 Products)
  // ==========================================
  {
    id: "belgian-chocolate-truffle",
    name: "Belgian Chocolate Truffle",
    description: "Rich Belgian chocolate ganache layered between moist cocoa sponge. Our absolute bestseller in Delhi NCR.",
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
    id: "red-velvet-romance",
    name: "Red Velvet Cheese Frosting",
    description: "Traditional vibrant red velvet layers with rich whipped cream cheese. Super silky, certified eggless texture.",
    price: 950,
    categories: ["Cakes"],
    occasions: ["Wedding", "Anniversary"],
    flavors: ["Red Velvet"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true,
    weights: [0.5, 1, 2]
  },
  {
    id: "premium-butterscotch",
    name: "Premium Butterscotch Crunch",
    description: "Classic golden honey sponge layered with butterscotch cream and crunchy caramelized praline cashews.",
    price: 750,
    categories: ["Cakes"],
    occasions: ["Birthday"],
    flavors: ["Butterscotch"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: false,
    weights: [0.5, 1, 1.5]
  },
  {
    id: "strawberry-fields",
    name: "Starlight Strawberry Fields",
    description: "Fresh orchard-picked strawberries with smooth vanilla bean cream on fluffy sponge layers.",
    price: 800,
    categories: ["Cakes"],
    occasions: ["Festival", "Birthday"],
    flavors: ["Strawberry"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true,
    weights: [0.5, 1, 2]
  },
  {
    id: "pineapple-paradise",
    name: "Pineapple Paradise Cake",
    description: "Sweet, tangy caramelized pineapple chunks folded within chilled premium dairy cream and juicy sponge.",
    price: 699,
    categories: ["Cakes"],
    occasions: ["Birthday", "Festival"],
    flavors: ["Vanilla"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: false,
    weights: [0.5, 1]
  },
  {
    id: "blueberry-bliss",
    name: "Blueberry Bliss Cake",
    description: "Imported wild blueberry compote layered beautifully with rich mascarpone and soft vanilla cream.",
    price: 899,
    categories: ["Cakes"],
    occasions: ["Anniversary", "Birthday"],
    flavors: ["Blueberry"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: false,
    weights: [0.5, 1, 1.5]
  },
  {
    id: "black-forest-traditional",
    name: "Black Forest Traditional",
    description: "Rich dark chocolate shaving flakes, sweet glazed cherries, and fresh double-whipped vanilla dairy cream.",
    price: 799,
    categories: ["Cakes"],
    occasions: ["Birthday"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: false,
    weights: [0.5, 1, 2]
  },
  {
    id: "chocolate-hazelnut",
    name: "Chocolate Hazelnut Premium",
    description: "Roasted hazelnuts mixed into a dense Nutella cream paste layered with luxury French cocoa sponge.",
    price: 1100,
    categories: ["Cakes"],
    occasions: ["Anniversary", "Birthday"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true,
    weights: [0.5, 1, 1.5, 2]
  },
  {
    id: "mango-cream",
    name: "Majestic Mango Cream",
    description: "Seasonal sweet Alphonso pulp whipped into light yellow dairy cream frosting. A pure premium delight.",
    price: 850,
    categories: ["Cakes"],
    occasions: ["Birthday", "Festival"],
    flavors: ["Mixed"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: false,
    weights: [0.5, 1]
  },
  {
    id: "bento-mini-choco",
    name: "Bento Chocolate Mini",
    description: "The viral Korean lunchbox cake. Sized for 1-2 people, packaged in a biodegradable container with a candle.",
    price: 499,
    categories: ["Cakes"],
    occasions: ["Birthday", "Kids Special"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1508737804141-4c3b688e25ba?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true,
    isNew: true,
    weights: [0.25]
  },
  {
    id: "fresh-fruit-gateau",
    name: "Orchard Fresh Fruit Gateau",
    description: "Moist vanilla layers covered with rich custard cream and crowned with freshly cut kiwi, apple, grapes and orange.",
    price: 899,
    categories: ["Cakes"],
    occasions: ["Birthday", "Festival"],
    flavors: ["Mixed"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true,
    weights: [0.5, 1, 2]
  },
  {
    id: "white-chocolate-raspberry",
    name: "White Chocolate Raspberry Royale",
    description: "Velvety white chocolate mousse with wild pink raspberry compote layers and delicate white chocolate curls.",
    price: 1050,
    categories: ["Cakes"],
    occasions: ["Anniversary", "Wedding"],
    flavors: ["Strawberry"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1557925923-33b251dc3296?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: false,
    weights: [0.5, 1, 1.5]
  },
  {
    id: "caramel-macchiato-cake",
    name: "Gourmet Caramel Macchiato Cake",
    description: "Infused with organic espresso syrup, layered with smooth caramel milk mousse and salted butter drizzle.",
    price: 900,
    categories: ["Cakes"],
    occasions: ["Birthday", "Anniversary"],
    flavors: ["Vanilla"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isNew: true,
    weights: [0.5, 1, 1.5]
  },
  {
    id: "oreo-cookies-cream",
    name: "Ultimate Oreo Cookies & Cream",
    description: "Crunchy Oreo biscuit crumbles folded into double cream vanilla frosting piled on chocolate chiffon layers.",
    price: 850,
    categories: ["Cakes"],
    occasions: ["Kids Special", "Birthday"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: false,
    weights: [0.5, 1, 2]
  },
  {
    id: "pistachio-saffron-kundan",
    name: "Royal Pistachio Saffron Rose Cake",
    description: "Gourmet cardamom-infused sponge soaked in rich Saffron badam milk, finished with roasted Iranian pistachios.",
    price: 1250,
    categories: ["Cakes"],
    occasions: ["Festival", "Wedding"],
    flavors: ["Vanilla"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true,
    weights: [1, 2]
  },

  // ==========================================
  // 2. DESIGNER & CUSTOM THEME CAKES (15 Products)
  // ==========================================
  {
    id: "wedding-tier-lux",
    name: "Luxurious Wedding Tier",
    description: "Bespoke multi-tiered wedding centerpiece finished with 24K edible gold foil and sugar roses.",
    price: 4500,
    categories: ["Custom Cakes"],
    occasions: ["Wedding", "Anniversary"],
    flavors: ["Vanilla", "Strawberry"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true,
    weights: [3, 5]
  },
  {
    id: "cosmos-galaxy",
    name: "Cosmos Galaxy Star Cake",
    description: "Deep celestial hand-painted purple & navy buttercream cake topped with chocolate asteroid dust.",
    price: 2800,
    categories: ["Custom Cakes"],
    occasions: ["Birthday", "Kids Special"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: false,
    weights: [1, 2, 3]
  },
  {
    id: "unicorn-pastel",
    name: "Unicorn Pastel Smash",
    description: "Cute dreamy unicorn containing a colorful chocolate interior and exquisite hand-piped pastel rainbow hair swirls.",
    price: 2200,
    categories: ["Custom Cakes"],
    occasions: ["Birthday", "Kids Special"],
    flavors: ["Strawberry", "Vanilla"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true,
    weights: [1.5, 2]
  },
  {
    id: "under-sea-mermaid",
    name: "Under The Sea Mermaid",
    description: "Finished with custom edible chocolate mermaid tails, pastel shells, sea corals, and teal frosting ocean waves.",
    price: 3200,
    categories: ["Custom Cakes"],
    occasions: ["Birthday", "Kids Special"],
    flavors: ["Blueberry", "Vanilla"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: false,
    weights: [1.5, 2, 3]
  },
  {
    id: "royal-gold-leaf",
    name: "Royal Gold Leaf Crown",
    description: "Ultra-luxury design featuring a rich charcoal black buttercream backdrop, chocolate crown and 24K gold foil.",
    price: 3500,
    categories: ["Custom Cakes"],
    occasions: ["Birthday", "Anniversary"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true,
    weights: [2, 3]
  },
  {
    id: "rose-bouquet-bespoke",
    name: "Bespoke Rose Bouquet",
    description: "Detailed handcrafted individual buttercream cream roses hand-piped gracefully on vanilla velvet cake.",
    price: 2900,
    categories: ["Custom Cakes"],
    occasions: ["Anniversary", "Wedding"],
    flavors: ["Red Velvet", "Vanilla"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: false,
    weights: [1.5, 2]
  },
  {
    id: "superhero-avengers",
    name: "Superhero Avengers Theme Cake",
    description: "Double tier kids special containing hand-molded edible sugar crests of Iron Man, Captain America, and Thor.",
    price: 3600,
    categories: ["Custom Cakes"],
    occasions: ["Birthday", "Kids Special"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: true,
    isNew: true,
    weights: [2, 3]
  },
  {
    id: "retro-comic-pop",
    name: "Retro Comic Book Pop Cake",
    description: "Stunning cartoon 2D comic strip stenciled cake with dramatic hand-drawn black outlines. Perfect for gen-z.",
    price: 2700,
    categories: ["Custom Cakes"],
    occasions: ["Birthday"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: true,
    weights: [1, 2]
  },
  {
    id: "little-princess-tiara",
    name: "Royal Princess Tiara Cake",
    description: "Blush pink fondant base wrapped in elegant white pearls and topped with a glistening, edible golden tiara crown.",
    price: 3100,
    categories: ["Custom Cakes"],
    occasions: ["Birthday", "Kids Special"],
    flavors: ["Vanilla", "Strawberry"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: true,
    weights: [1.5, 2]
  },
  {
    id: "soccer-field-goal",
    name: "Champ Soccer Field Match",
    description: "Green velvet textured football pitch with edible chocolate players, dual custom goal nets and soccer ball topper.",
    price: 2800,
    categories: ["Custom Cakes"],
    occasions: ["Birthday", "Kids Special"],
    flavors: ["Vanilla"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    weights: [1.5, 2]
  },
  {
    id: "makeup-glamour-box",
    name: "Glow Makeup Glamour Box",
    description: "Exquisite cosmetics customized theme cake featuring hand-drawn sugar lipsticks, eye shadow pallets, and hair brushes.",
    price: 3400,
    categories: ["Custom Cakes"],
    occasions: ["Birthday", "Anniversary"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1549462980-6a03f721ff03?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: true,
    weights: [1.5, 2]
  },
  {
    id: "jungle-safari-child",
    name: "Wild Jungle Safari Birthday",
    description: "Friendly hand-crafted sugar lions, monkeys, and giraffes nestled within cute giant green leaves and pastel logs.",
    price: 3500,
    categories: ["Custom Cakes"],
    occasions: ["Birthday", "Kids Special"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true,
    weights: [2, 3]
  },
  {
    id: "gym-dumbbell-lift",
    name: "Heavyweight Gym Dumbbell Cake",
    description: "Realistic look-alike sports gym themed black dumbbell cake with barbell weights, protein shake replica.",
    price: 2900,
    categories: ["Custom Cakes"],
    occasions: ["Birthday"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    weights: [1.5, 2]
  },
  {
    id: "racing-sports-car",
    name: "Monaco Red Racing Car",
    description: "Fully 3D sculpted edible sports car cake with glistening sugar windshield, rubber chocolate wheels and racing numbers.",
    price: 3900,
    categories: ["Custom Cakes"],
    occasions: ["Birthday", "Kids Special"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: true,
    weights: [2, 3]
  },
  {
    id: "pastel-anniversary-slate",
    name: "Aesthetic Pastel Anniversary Ring",
    description: "Chic modern heart design cake decorated with dynamic pastel colors, gold-lined edges and customizable direct calligraphy.",
    price: 2400,
    categories: ["Custom Cakes"],
    occasions: ["Anniversary", "Wedding"],
    flavors: ["Red Velvet"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    weights: [1, 1.5, 2]
  },

  // ==========================================
  // 3. SPECIALTY PASTRIES & SLICES (12 Products)
  // ==========================================
  {
    id: "blueberry-cheesecake-slice",
    name: "Blueberry Cheesecake Slice",
    description: "Decadent cream cheese bakedニューヨーク style layered with fresh sweet blueberry preservation glaze.",
    price: 199,
    categories: ["Pastries"],
    occasions: ["Birthday"],
    flavors: ["Blueberry"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: false,
    isBestseller: true
  },
  {
    id: "pastry-box-mini",
    name: "Mini Pastry Box (6 Pcs)",
    description: "A luxury curation of our single slices: Chocolate Truffle, Velvet Rose, and Vanilla Cream Fruits.",
    price: 599,
    categories: ["Pastries"],
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
    id: "midnight-truffle-slice",
    name: "Midnight Chocolate Truffle Slice",
    description: "Deep premium dark chocolate fudge pastry layered with high cocoa-butter solids and ganache glaze.",
    price: 140,
    categories: ["Pastries"],
    occasions: ["Birthday"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: false
  },
  {
    id: "mango-custard-velvet-slice",
    name: "Mango Custard Velvet Slice",
    description: "Delicate sponge slice topped with light diplomat mango cream and glazed Alphonso mango slices.",
    price: 160,
    categories: ["Pastries"],
    occasions: ["Festival"],
    flavors: ["Mixed"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: false,
    isNew: true
  },
  {
    id: "espresso-tiramisu-slice",
    name: "Classic Espresso Tiramisu Slice",
    description: "Traditional Italian treat layered with espresso-soaked ladyfinger cookies, smooth whipped mascarpone & dark cocoa.",
    price: 220,
    categories: ["Pastries"],
    occasions: ["Anniversary"],
    flavors: ["Vanilla"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: false,
    isBestseller: true
  },
  {
    id: "red-velvet-cheese-slice",
    name: "Crimson Red Velvet Cheese Slice",
    description: "Individually sliced cocoa vanilla buttermilk pastry with real dairy cream cheese cloud piping.",
    price: 180,
    categories: ["Pastries"],
    occasions: ["Birthday"],
    flavors: ["Red Velvet"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: false
  },
  {
    id: "lemon-meringue-slice",
    name: "Zesty Lemon Meringue Tartlet",
    description: "Shortbread crust loaded with rich organic lemon curd and finished with lightly roasted egg-free sweet meringue peaks.",
    price: 150,
    categories: ["Pastries"],
    occasions: ["Festival"],
    flavors: ["Vanilla"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false
  },
  {
    id: "premium-hazelnut-slice",
    name: "Gourmet Hazelnut Crunch Slice",
    description: "French opera styling with dense layers of hazelnut wafer paste, dark chocolate, and cocoa biscuit.",
    price: 199,
    categories: ["Pastries"],
    occasions: ["Anniversary"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: false,
    isBestseller: true
  },
  {
    id: "belgian-choco-eclair",
    name: "Belgian Chocolate Éclair",
    description: "Golden choux pastry stuffed with chilled rich vanilla bean custard and dipped in warm Belgian dark ganache.",
    price: 140,
    categories: ["Pastries"],
    occasions: ["Kids Special"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false
  },
  {
    id: "strawberry-pistachio-tartlet",
    name: "Strawberry Pistachio Custard Tart",
    description: "Crispy sweet pastry cup filled with rich vanilla bean cream, topped with fresh strawberry halves and crushed pistachio.",
    price: 175,
    categories: ["Pastries"],
    occasions: ["Festival"],
    flavors: ["Strawberry"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: false,
    isNew: true
  },
  {
    id: "opera-coffee-pastry-classic",
    name: "Classic Parisian Opera Pastry",
    description: "Six elegant layers of almond sponge cake soaked in coffee syrup, layered with dark chocolate ganache and espresso cream.",
    price: 240,
    categories: ["Pastries"],
    occasions: ["Anniversary"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false
  },
  {
    id: "rose-milk-tres-leches",
    name: "Pistachio Rose Tres Leches",
    description: "Soft vanilla cake soaked completely in sweet milk cream infused with edible rose syrup and crushed almonds.",
    price: 210,
    categories: ["Pastries"],
    occasions: ["Festival"],
    flavors: ["Mixed"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: false
  },

  // ==========================================
  // 4. CUPCAKES, BROWNIES & DESSERTS (10 Products)
  // ==========================================
  {
    id: "classic-brownie-fudgy",
    name: "Classic Fudgy Brownie",
    description: "Densely baked Belgian melted chocolate brownie containing toasted walnuts and glossy chocolate fudge.",
    price: 120,
    categories: ["Brownies", "Desserts"],
    occasions: ["Birthday"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false,
    isBestseller: true
  },
  {
    id: "gold-rocher-cupcake",
    name: "Gold Rocher Cupcake",
    description: "Chocochip cupcake topped with silky Nutella buttercream and a luxury Ferrero chocolate crown.",
    price: 150,
    categories: ["Cupcakes", "Desserts"],
    occasions: ["Birthday", "Kids Special"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false,
    isBestseller: false
  },
  {
    id: "warm-nutella-lava",
    name: "Warm Nutella Lava Cake",
    description: "Decadently moist cocoa pod featuring warm running hazelnut center. Microwave 15 seconds before eating.",
    price: 180,
    categories: ["Desserts"],
    occasions: ["Anniversary"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1508737804141-4c3b688e25ba?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: false,
    isNew: true
  },
  {
    id: "velvet-cream-cupcakes",
    name: "Velvet Cream Cupcake Pack (4 Pcs)",
    description: "A gorgeous set of 4 cupcakes topped with cream cheese piping and colorful sprinkles.",
    price: 299,
    categories: ["Cupcakes", "Desserts"],
    occasions: ["Birthday", "Festival"],
    flavors: ["Red Velvet", "Vanilla"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: false,
    isBestseller: true
  },
  {
    id: "walnut-choco-muffin",
    name: "Rich Walnut Chocochip Muffin",
    description: "Soft, golden baked vanilla muffin topped with organic walnuts, dark chocochips, and sweet honey drizzle.",
    price: 95,
    categories: ["Cupcakes"],
    occasions: ["All"],
    flavors: ["Mixed"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false
  },
  {
    id: "speculoos-jar-cake-lux",
    name: "Caramelized Speculoos Jar Cake",
    description: "Compact reusable glass jar containing rich lotus biscuit spread, whipped white mousse, and cookie cookies.",
    price: 199,
    categories: ["Desserts"],
    occasions: ["Birthday", "Festival"],
    flavors: ["Butterscotch"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: false,
    isNew: true
  },
  {
    id: "overloaded-choco-jar",
    name: "Overloaded Chocolate Jar Cake",
    description: "Double layers of moist chocolate truffle sponge and warm running fudge syrup, layered inside a pretty jar.",
    price: 185,
    categories: ["Desserts"],
    occasions: ["Birthday", "Kids Special"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1508737804141-4c3b688e25ba?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: false
  },
  {
    id: "red-velvet-dream-jar",
    name: "Red Velvet Dream Jar Cake",
    description: "Cream cheese mouse layers interspaced with soft scarlet crumbs and vanilla syrup inside our custom glass jar.",
    price: 195,
    categories: ["Desserts"],
    occasions: ["Anniversary", "Birthday"],
    flavors: ["Red Velvet"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: false
  },
  {
    id: "assorted-macarons-12",
    name: "Assorted French Macarons (12 Pcs)",
    description: "Premium French treat box containing crisp almond flour cookies filled with strawberry, chocolate, lemon, and pistachio ganache.",
    price: 699,
    categories: ["Desserts"],
    occasions: ["Festival", "Anniversary"],
    flavors: ["Mixed"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false,
    isBestseller: true
  },
  {
    id: "fudge-smores-brownie",
    name: "Hot Fudge S'mores Brownie",
    description: "Warm fudgy chocolate base baked with fire-toasted sweet vegetarian marshmallows and graham cracker crumble.",
    price: 160,
    categories: ["Brownies", "Desserts"],
    occasions: ["Kids Special"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: false
  },

  // ==========================================
  // 5. GIFTING & FESTIVE HAMPERS (7 Products)
  // ==========================================
  {
    id: "premium-luxury-hamper",
    name: "Premium Luxury Gift Hamper",
    description: "Extravagant premium wicker hamper loaded with handmade praline chocolates, cookies, and a red velvet jar.",
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
    id: "bakers-special-box",
    name: "Bakers special Breakfast Box",
    description: "Gourmet box containing 2 chocolate croissants, 2 seed buns and our signature sourdough loaf.",
    price: 899,
    categories: ["Hampers"],
    occasions: ["Festival"],
    flavors: ["Mixed"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1549462980-6a03f721ff03?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false,
    isNew: true
  },
  {
    id: "gold-truffle-basket",
    name: "Gold Truffle Festive Basket",
    description: "Elegantly wrapped gold basket featuring 12 customized truffles, cookies, and floral sprigs.",
    price: 1899,
    categories: ["Hampers"],
    occasions: ["Festival"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false,
    isBestseller: false
  },
  {
    id: "birthday-surprise-casket",
    name: "Bespoke Birthday Surprise Casket",
    description: "An elegant black box holding a custom Bento mini cake, 2 customized chocolate popcakes and beautiful fairy lights.",
    price: 3200,
    categories: ["Hampers"],
    occasions: ["Birthday", "Anniversary"],
    flavors: ["Mixed"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1549462980-6a03f721ff03?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: true,
    isBestseller: true
  },
  {
    id: "high-tea-scone-basket",
    name: "High-Tea Scone & Cookie Basket",
    description: "Elegantly packaged wooden gift basket containing 4 sweet English scones, fresh strawberry jam jar, and 6 assorted almond cookies.",
    price: 1150,
    categories: ["Hampers"],
    occasions: ["Festival", "Anniversary"],
    flavors: ["Vanilla"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1549462980-6a03f721ff03?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false
  },
  {
    id: "sweet-celebration-assorted-box",
    name: "Sweet Celebration Assorted Cookie Tray",
    description: "A gorgeous luxury gift box wrapped with gold ribbon containing 18 handmade double-chocolate & white almond cookies.",
    price: 799,
    categories: ["Hampers"],
    occasions: ["Festival", "Birthday"],
    flavors: ["Chocolate", "Vanilla"],
    dietary: ["Eggless"],

    images: ["https://images.unsplash.com/photo-1549462980-6a03f721ff03?auto=format&fit=crop&q=80&w=800"],

    stockStatus: "in-stock",
    isCustomizable: false,
    isBestseller: true
  },
  {
    id: "chocolate-lovers-grand-hamper",
    name: "Chocolate Lover's Grand Hamper",
    description: "The ultimate cocoa dream containing gourmet dark chocolate cookies, 2 chocolate jar cakes, 6 truffle squares, and hot cocoa spoon.",
    price: 1999,
    categories: ["Hampers"],
    occasions: ["Festival", "Anniversary"],
    flavors: ["Chocolate"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1549462980-6a03f721ff03?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false
  },

  // ==========================================
  // 6. ARTISANAL FRESH BREADS (6 Products)
  // ==========================================
  {
    id: "sourdough-boule-classic",
    name: "Sourdough Boule Classic",
    description: "Slow-fermented classic French sourdough boule with thick crunchy crust and airy center.",
    price: 220,
    categories: ["Breads"],
    occasions: ["All"],
    flavors: ["Mixed"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false
  },
  {
    id: "multiseed-loaf",
    name: "Buttery Multi-seed Loaf",
    description: "Slightly sweet premium loaf enriched with sunflower, pumpkin, and brown sesame seeds.",
    price: 180,
    categories: ["Breads"],
    occasions: ["All"],
    flavors: ["Vanilla"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1589415490074-9f7626d30e7f?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false
  },
  {
    id: "french-baguette-crisp",
    name: "Traditional French Baguette Pair",
    description: "Crispy long crust baguette rolls prepared with real active sourdough cultures, ideal for custom garlic toasts.",
    price: 160,
    categories: ["Breads"],
    occasions: ["All"],
    flavors: ["Vanilla"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false,
    isNew: true
  },
  {
    id: "herbed-garlic-butter-bread",
    name: "Gourmet Garlic Butter Herbed Loaf",
    description: "Pull-apart buttery bread loaded inside and out with baked minced garlic, organic rosemary and fresh garden herbs.",
    price: 199,
    categories: ["Breads"],
    occasions: ["All"],
    flavors: ["Mixed"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false,
    isBestseller: true
  },
  {
    id: "olive-focaccia-slice",
    name: "Italian Black Olive Focaccia",
    description: "Thick oil-rich yeast bread decorated with salty kalamata olives, rosemary springs, and crystal sea salt granules.",
    price: 210,
    categories: ["Breads"],
    occasions: ["All"],
    flavors: ["Mixed"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false
  },
  {
    id: "brioche-burger-buns",
    name: "Buttery Brioche Buns (4 Pcs)",
    description: "Rich, golden buns baked with pure pasture butter and sugar cane extract, glazed and sprinkled with sesame seeds.",
    price: 140,
    categories: ["Breads"],
    occasions: ["All"],
    flavors: ["Vanilla"],
    dietary: ["Eggless"],
    images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"],
    stockStatus: "in-stock",
    isCustomizable: false
  }
];
