const fs = require('fs');

let code = fs.readFileSync('src/lib/fallbackProducts.ts', 'utf8');

// The user is asking to update "A to z sare product ki images"
// Let's create dictionaries mapping specific strings in the product name to highly relevant, extremely high quality, non-AI Unsplash images

const specificMappings = [
  // CAKES
  { keywords: ['Belgian', 'Dark Chocolate'], img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800' }, // Classic chocolate
  { keywords: ['Truffle'], img: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=800' }, // Truffle/Chocolate slice
  { keywords: ['Vanilla', 'White'], img: 'https://images.unsplash.com/photo-1557925923-33b251dc3296?auto=format&fit=crop&q=80&w=800' }, // White cake
  { keywords: ['Red Velvet'], img: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=800' }, // Red velvet slice/cake
  { keywords: ['Fruit', 'Strawberry', 'Mango'], img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800' }, // Fruit cake
  { keywords: ['Pineapple'], img: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800' }, // Yellowish/fruit cake
  { keywords: ['Black Forest'], img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800' }, // Dark cherry cake
  { keywords: ['Butterscotch', 'Caramel', 'Biscoff'], img: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=800' }, // Caramel/brown cake

  // CUSTOM CAKES (Thematic)
  { keywords: ['Wedding', 'Tier', 'Ring'], img: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=800' }, // Fancy wedding cake
  { keywords: ['Cosmos', 'Galaxy', 'Star'], img: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800' }, // Dark/blue aesthetic cake
  { keywords: ['Unicorn', 'Pastel'], img: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800' }, // Cute/pastel cake
  { keywords: ['Mermaid', 'Sea'], img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800' }, // Blue/aqua cake
  { keywords: ['Gold', 'Crown', 'Tiara', 'Princess'], img: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800' }, // Fancy/Gold cake
  { keywords: ['Rose', 'Bouquet', 'Floral'], img: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&q=80&w=800' }, // Floral cake
  { keywords: ['Superhero', 'Comic', 'Pop', 'Champ', 'Match', 'Racing', 'Gym', 'Jungle'], img: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800' }, // Dark/cool structure cake

  // PASTRIES / DESSERTS
  { keywords: ['Cheesecake', 'Tart'], img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800' },
  { keywords: ['Pastry', 'Slice', 'Opera'], img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800' },
  { keywords: ['Macaron'], img: 'https://images.unsplash.com/photo-1559622214-f8a98509db7b?auto=format&fit=crop&q=80&w=800' },
  { keywords: ['Brownie'], img: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=800' },
  { keywords: ['Cupcake', 'Muffin'], img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800' },
  { keywords: ['Jar', 'Lava', 'Éclair'], img: 'https://images.unsplash.com/photo-1508737804141-4c3b688e25ba?auto=format&fit=crop&q=80&w=800' },

  // HAMPERS
  { keywords: ['Hamper', 'Gift', 'Basket', 'Casket', 'Box'], img: 'https://images.unsplash.com/photo-1549462980-6a03f721ff03?auto=format&fit=crop&q=80&w=800' },
  { keywords: ['Tray', 'Breakfast'], img: 'https://images.unsplash.com/photo-1513220556108-8e6d3f2ef1d7?auto=format&fit=crop&q=80&w=800' },

  // BREADS
  { keywords: ['Sourdough', 'Boule', 'Loaf'], img: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=800' },
  { keywords: ['Baguette'], img: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&q=80&w=800' },
  { keywords: ['Garlic', 'Focaccia', 'Bun'], img: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&q=80&w=800' },
];

const fallbackCake = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800';

let objStrMatches = [];
let regex = /{[\s\S]*?id:\s*"[^"]+"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?images:\s*\["([^"]+)"\][\s\S]*?}/g;

let newCode = code;

let match;
while ((match = regex.exec(code)) !== null) {
  const fullObj = match[0];
  const name = match[1];
  const oldImg = match[2];

  let selectedImg = fallbackCake;
  for (let mapping of specificMappings) {
    if (mapping.keywords.some(kw => name.toLowerCase().includes(kw.toLowerCase()))) {
      selectedImg = mapping.img;
      break;
    }
  }

  const updatedObj = fullObj.replace(oldImg, selectedImg);
  newCode = newCode.replace(fullObj, updatedObj);
}

fs.writeFileSync('src/lib/fallbackProducts.ts', newCode, 'utf8');
console.log('Successfully patched all fallback images intelligently based on item name.');
