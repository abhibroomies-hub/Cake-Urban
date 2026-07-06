import { FALLBACK_PRODUCTS } from './src/lib/fallbackProducts';
import firebaseConfig from './firebase-applet-config.json';

const PROJECT_ID = firebaseConfig.projectId;
const API_KEY = firebaseConfig.apiKey;
const DATABASE_ID = firebaseConfig.firestoreDatabaseId || '(default)';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents`;

// Helper to convert plain JSON to Firestore REST API format
function toFirestoreValue(val: any): any {
  if (val === null || val === undefined) {
    return { nullValue: null };
  }
  if (typeof val === 'string') {
    return { stringValue: val };
  }
  if (typeof val === 'number') {
    if (Number.isInteger(val)) {
      return { integerValue: val.toString() };
    }
    return { doubleValue: val };
  }
  if (typeof val === 'boolean') {
    return { booleanValue: val };
  }
  if (Array.isArray(val)) {
    return {
      arrayValue: {
        values: val.map(v => toFirestoreValue(v))
      }
    };
  }
  if (typeof val === 'object') {
    const fields: any = {};
    for (const k of Object.keys(val)) {
      fields[k] = toFirestoreValue(val[k]);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: val.toString() };
}

async function run() {
  console.log(`Starting direct REST seeding for project: ${PROJECT_ID}`);
  
  // 1. Get existing products to see if they are already populated
  try {
    const listUrl = `${BASE_URL}/products?key=${API_KEY}`;
    const getRes = await fetch(listUrl);
    
    if (getRes.status === 200) {
      const data = await getRes.json();
      if (data.documents && data.documents.length > 0) {
        console.log(`Database already has ${data.documents.length} products. Seeding skipped to preserve existing data.`);
        process.exit(0);
      }
    } else {
      const errText = await getRes.text();
      console.warn("Could not query existing products, or collection is empty. Status:", getRes.status, errText);
    }
    
    console.log(`Seeding ${FALLBACK_PRODUCTS.length} products via Firestore REST API...`);
    let count = 0;
    
    for (const p of FALLBACK_PRODUCTS) {
      const { id, ...prodData } = p;
      const restFields: any = {};
      
      for (const key of Object.keys(prodData)) {
        restFields[key] = toFirestoreValue((prodData as any)[key]);
      }
      
      restFields['createdAt'] = { timestampValue: new Date().toISOString() };
      
      const payload = {
        fields: restFields
      };
      
      // Use the specified ID in the query parameter currentDocumentId to persist precise original keys!
      const postUrl = `${BASE_URL}/products?documentId=${p.id}&key=${API_KEY}`;
      const postRes = await fetch(postUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (postRes.status !== 200 && postRes.status !== 201) {
        const postErr = await postRes.text();
        console.error(`Failed to add product: ${p.name}. Status: ${postRes.status}`, postErr);
      } else {
        count++;
        if (count % 10 === 0 || count === FALLBACK_PRODUCTS.length) {
          console.log(`Seeded ${count}/${FALLBACK_PRODUCTS.length} products successfully.`);
        }
      }
    }
    
    console.log("Database successfully seeded via REST API!");
    process.exit(0);
  } catch (err) {
    console.error("Direct REST seed failed:", err);
    process.exit(1);
  }
}

run();
