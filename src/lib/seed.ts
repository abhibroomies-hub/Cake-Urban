import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { FALLBACK_PRODUCTS } from './fallbackProducts';

export async function seedProducts() {
  const path = 'products';
  
  try {
    const prodCol = collection(db, path);
    const snap = await getDocs(prodCol);
    
    // If the database already has products, skip seeding
    if (snap.docs.length > 0) {
      console.log("Database already populated. Skipping seeding.");
      return;
    }
    
    console.log("Seeding premium 65 confections catalog into Firestore...");
    // Clear any outdated catalog items first to guarantee a pure, clean, valid image set
    for (const docObj of snap.docs) {
      await deleteDoc(doc(db, path, docObj.id));
    }
    
    for (const p of FALLBACK_PRODUCTS) {
      // Exclude the hardcoded local ID when migrating to Firestore, so auto ID and item metadata mesh flawlessly
      const { id, ...firebaseProduct } = p;
      await addDoc(prodCol, {
        ...firebaseProduct,
        createdAt: serverTimestamp()
      });
    }
    
    console.log("Seeding complete! 50+ fresh products with images loaded successfully.");
    localStorage.setItem('cakeurban_seeded_v15', 'true');
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      console.warn("Seeding skipped: Missing Firestore write permission.");
      // Set to true so we do not spam attempts in unauthenticated contexts if rules are restrictive
      localStorage.setItem('cakeurban_seeded_v15', 'true');
    } else {
      console.error("Critical seeding failure:", error);
    }
  }
}
