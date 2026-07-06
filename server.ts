import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  // GEMINI AI Search Logic
  const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // ==========================================
  // ROBUST JSON REPAIR & FALLBACK UTILITIES
  // ==========================================
  function repairTruncatedJSON(json: string): string {
    let clean = json.trim();
    
    // Track open quotes, brackets, and braces
    let inString = false;
    let escape = false;
    const stack: string[] = [];
    
    let i = 0;
    for (; i < clean.length; i++) {
      const char = clean[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (char === '\\') {
        escape = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (char === '{') {
          stack.push('{');
        } else if (char === '}') {
          if (stack[stack.length - 1] === '{') {
            stack.pop();
          }
        } else if (char === '[') {
          stack.push('[');
        } else if (char === ']') {
          if (stack[stack.length - 1] === '[') {
            stack.pop();
          }
        }
      }
    }

    // If we ended inside a string, we need to close the string first
    let repaired = clean;
    if (inString) {
      if (repaired.endsWith('\\')) {
        repaired = repaired.slice(0, -1);
      }
      repaired += '"';
    }

    // Now close any remaining open structures in reverse order
    while (stack.length > 0) {
      const open = stack.pop();
      if (open === '{') {
        repaired += '}';
      } else if (open === '[') {
        repaired += ']';
      }
    }

    return repaired;
  }

  function safeParseCakeJSON(responseText: string, fallbackObj: any = {}): any {
    let cleaned = responseText.trim();
    // Strip markdown block markers if present
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }

    try {
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn("[JSON PARSE WARNING] Initial parse failed, attempting truncation repair...", e);
      try {
        const repaired = repairTruncatedJSON(cleaned);
        return JSON.parse(repaired);
      } catch (repairErr) {
        console.error("[JSON REPAIR CRITICAL ERROR] Repair also failed, extracting via regex...", repairErr);
        // Extract values using regex as a robust fallback
        const result: any = { ...fallbackObj };
        
        const extractString = (key: string) => {
          const regex = new RegExp(`"${key}"\\s*:\\s*"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"`, 'i');
          const match = cleaned.match(regex);
          return match ? match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\') : null;
        };

        const extractNumber = (key: string) => {
          const regex = new RegExp(`"${key}"\\s*:\\s*(\\d+)`, 'i');
          const match = cleaned.match(regex);
          return match ? parseInt(match[1], 10) : null;
        };

        const extractArray = (key: string) => {
          const regex = new RegExp(`"${key}"\\s*:\\s*\\[([^\\]]*)\\]`, 'i');
          const match = cleaned.match(regex);
          if (match) {
            return match[1].split(',').map(s => s.trim().replace(/^"/, '').replace(/"$/, ''));
          }
          return null;
        };

        // Fill extracted properties if found
        const name = extractString("productName") || extractString("name");
        if (name) result.productName = name;
        
        const price = extractNumber("price");
        if (price) result.price = price;

        const desc = extractString("description");
        if (desc) result.description = desc;

        const cats = extractString("categories");
        if (cats) result.categories = cats;

        const flavors = extractString("flavors");
        if (flavors) result.flavors = flavors;

        const occasions = extractString("occasions");
        if (occasions) result.occasions = occasions;

        const seoTitle = extractString("seoTitle");
        if (seoTitle) result.seoTitle = seoTitle;

        const slug = extractString("slug");
        if (slug) result.slug = slug;

        const altText = extractString("altText");
        if (altText) result.altText = altText;

        const metaDesc = extractString("metaDescription");
        if (metaDesc) result.metaDescription = metaDesc;

        const keywords = extractArray("keywords");
        if (keywords) result.keywords = keywords;

        const structuredSchema = extractString("structuredSchema");
        if (structuredSchema) result.structuredSchema = structuredSchema;

        const instagramCaption = extractString("instagramCaption");
        if (instagramCaption) result.instagramCaption = instagramCaption;

        return result;
      }
    }
  }

  function safeParseChatJSON(responseText: string): any {
    let cleaned = responseText.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }

    try {
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn("[CHAT JSON PARSE WARNING] Initial parse failed, trying truncation repair...", e);
      try {
        const repaired = repairTruncatedJSON(cleaned);
        return JSON.parse(repaired);
      } catch (repairErr) {
        console.error("[CHAT JSON REPAIR CRITICAL ERROR] Repair failed, extracting text/prompt via regex...", repairErr);
        
        const result: any = {
          text: "Mafi chahta hoon! Gemini engine is facing some heavy traffic. But aapka design details secure hain.",
          generatedImages: []
        };

        const extractString = (key: string) => {
          const regex = new RegExp(`"${key}"\\s*:\\s*"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"`, 'i');
          const match = cleaned.match(regex);
          return match ? match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\') : null;
        };

        const textVal = extractString("text");
        if (textVal) result.text = textVal;

        const imgPromptVal = extractString("imagePrompt");
        if (imgPromptVal) result.imagePrompt = imgPromptVal;

        if (cleaned.includes("finalizedCake")) {
          result.finalizedCake = {
            productName: extractString("productName") || "Gourmet Concept",
            price: 1499,
            description: extractString("description") || "Bespoke custom creation.",
            categories: extractString("categories") || "Cakes, Custom Cakes",
            flavors: extractString("flavors") || "Belgian Chocolate",
            occasions: extractString("occasions") || "Celebration"
          };
        }

        return result;
      }
    }
  }

  const imageFallbackObj = {
    productName: "Gourmet Custom Creation",
    price: 1499,
    description: "A luxury custom cake baked with premium ingredients, exquisite layering, and stunning artisanal decorations.",
    categories: "Cakes, Custom Cakes",
    flavors: "Belgian Chocolate",
    occasions: "Celebration, Birthday, Anniversary",
    seoTitle: "Custom Gourmet Cake Delivery | Cake Urban",
    slug: "custom-gourmet-cake",
    altText: "Artisanal custom gourmet cake",
    metaDescription: "Order premium custom gourmet cakes from Cake Urban. Handcrafted luxury cakes for birthdays and anniversaries with delivery in Delhi NCR.",
    keywords: ["custom cake", "gourmet cake", "cake delivery", "birthday cake", "anniversary cake"],
    structuredSchema: "",
    instagramCaption: "Indulge in pure luxury. ✨🍰 #CakeUrban #CustomCakes",
    pinterestPin: {
      title: "Luxury Custom Cake Creation",
      description: "Elegant bespoke cake handcrafted for your special moments."
    }
  };

  const specsFallbackObj = {
    productName: "Premium Spec Creation",
    price: 1499,
    description: "Bespoke custom creation prepared by elite pâtissiers with exquisite premium layers.",
    categories: "Cakes, Custom Cakes",
    flavors: "Belgian Chocolate",
    occasions: "Celebration, Birthday, Anniversary",
    seoTitle: "Gourmet Customized Cake | Cake Urban",
    slug: "gourmet-customized-cake",
    altText: "Gourmet customized cake creation",
    metaDescription: "Treat yourself to a luxury bespoke cake handcrafted by Cake Urban. Perfect for birthdays, anniversaries, and special events.",
    keywords: ["gourmet cake", "bespoke cake", "custom cake delhi", "premium cake shop"],
    structuredSchema: "",
    instagramCaption: "Crafted to perfection. 🍰✨ #CakeUrban #BespokeLuxury",
    pinterestPin: {
      title: "Artisanal Custom Cake Design",
      description: "Bespoke designer cake handcrafted by Cake Urban."
    }
  };

  // AI Image SEO Optimizer Endpoint
  app.post("/api/seo/optimize-image", async (req, res) => {
    const { imageBase64, mimeType, productName } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: "Missing required image data" });
    }

    try {
      let base64Data = imageBase64;
      let finalMimeType = mimeType || "image/jpeg";

      // If it's a remote URL, download and convert to base64
      if (typeof base64Data === "string" && base64Data.startsWith("http")) {
        try {
          console.log(`[AI IMAGE AUTO-FILL] Downloading remote image: ${base64Data}`);
          const imgResponse = await fetch(base64Data);
          if (imgResponse.ok) {
            const arrayBuffer = await imgResponse.arrayBuffer();
            base64Data = Buffer.from(arrayBuffer).toString("base64");
            finalMimeType = imgResponse.headers.get("content-type") || "image/jpeg";
          } else {
            console.error(`Failed to download image from URL. Status: ${imgResponse.status}`);
          }
        } catch (fetchError) {
          console.error("Failed to fetch image from URL:", fetchError);
        }
      } else if (typeof base64Data === "string" && base64Data.includes(";base64,")) {
        base64Data = base64Data.split(";base64,").pop() || "";
      }

      const model = "gemini-3.5-flash";
      const systemInstruction = `
        You are an expert AI master pâtissier and Visual SEO curator for "Cake Urban", an elite custom online bakery operating in the Delhi National Capital Region (Faridabad, South Delhi, Noida, Gurgaon, Ghaziabad).
        Your task is to analyze the uploaded cake image along with any optionally provided product name, and generate a complete, premium digital catalog profile.
        This includes highly persuasive copywriter product description, luxury Indian pricing (INR ₹899 to ₹4999), extra categories, matching flavor tags, ideal occasions, and a top-tier SEO/social metadata package.

        CRITICAL LENGTH CONSTRAINTS:
        Keep all text properties, descriptions, and captions highly elegant but VERY CONCISE.
        Limit 'structuredSchema' to a simple single-line string of under 300 characters.
        Never repeat content or generate massive outputs. This prevents output truncation.
      `;

      const prompt = `
        Analyze this cake image in meticulous detail. 
        ${productName ? `The user typed the product name as: "${productName}". Match the visual details with this name or enrich it if needed.` : ''}
        Identify its design theme (e.g. minimalist, floral, gold foil, cartoon character, multi-tiered wedding), icing type, colors, and potential flavor profile.
        
        Generate the complete product and SEO bundle containing:
        1. Alluring productName (refined and elegant).
        2. Suggested premium price in INR (number, e.g. 1199, 1499, 1999) depending on complexity/design.
        3. A rich, high-end descriptive product description (2-3 sentences) detailing the layers, frosting, taste notes, and decoration.
        4. Comma-separated categories (e.g. "Cakes, Custom Cakes, Celebration Cakes").
        5. Comma-separated flavor tags (e.g. "Belgian Dark Chocolate, Truffle fudge").
        6. Comma-separated ideal occasions (e.g. "Birthday, Anniversary, Celebration").
        7. A high-intent SEO metadata title (max 60 chars) targeting major search keywords and location tags (e.g., South Delhi, Faridabad, Noida, Gurgaon).
        8. Lowercase search slug.
        9. Descriptive, keyword-rich Alt Text explaining physical elements (colors, layers, design).
        10. A 150-160 character Google Meta Description incorporating a powerful luxury Call-To-Action (CTA).
        11. A list of 10-15 high-value search keywords/tags.
        12. Raw Product structured LD-JSON schema details (STRICTLY single-line, minimal, under 300 characters).
        13. An irresistible boutique Instagram caption with hashtags.
        14. Pinterest pin title and rich description.
      `;

      const imagePart = {
        inlineData: {
          mimeType: finalMimeType,
          data: base64Data
        }
      };

      const response = await genAI.models.generateContent({
        model,
        contents: [imagePart, { text: prompt }],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              productName: { type: Type.STRING },
              price: { type: Type.NUMBER },
              description: { type: Type.STRING },
              categories: { type: Type.STRING },
              flavors: { type: Type.STRING },
              occasions: { type: Type.STRING },
              seoTitle: { type: Type.STRING },
              slug: { type: Type.STRING },
              suggestedFilename: { type: Type.STRING },
              altText: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              keywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              structuredSchema: { type: Type.STRING, description: "Minimal single-line stringified JSON-LD Product schema under 300 characters." },
              instagramCaption: { type: Type.STRING },
              pinterestPin: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            required: [
              "productName", "price", "description", "categories", "flavors", "occasions",
              "seoTitle", "slug", "suggestedFilename", "altText", "metaDescription", 
              "keywords", "structuredSchema", "instagramCaption", "pinterestPin"
            ]
          }
        }
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("No response received from Gemini engine");
      }

      res.json(safeParseCakeJSON(resultText, imageFallbackObj));
    } catch (error) {
      console.error("AI SEO Generation Error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to analyze and optimize image for SEO" });
    }
  });

  // AI-powered text specs builder to auto-populate add cake forms instantly
  app.post("/api/seo/generate-specs", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required to generate specs" });
    }

    try {
      const model = "gemini-3.5-flash";
      const systemInstruction = `
        You are an expert AI master pâtissier and visual curator for "Cake Urban", an elite custom online bakery in Delhi NCR (operating in Faridabad, South Delhi, Noida, Gurgaon, Ghaziabad).
        Your task is to take a short input description of a cake concept, like "chocolate truffle birthday cake" or "2 tier elegant gold wedding fondant sponge", and generate a complete, rich, ready-to-publish digital catalog profile.
        All generated details must capture the highest premium boutique tone and suggest realistic luxurious Indian pricing in Rupees (A general range of ₹899 to ₹2999 depending on the tier/complexity).

        CRITICAL LENGTH CONSTRAINTS:
        Keep all text properties, descriptions, and captions highly elegant but VERY CONCISE.
        Limit 'structuredSchema' to a simple single-line string of under 300 characters.
        Never repeat content or generate massive outputs. This prevents output truncation.
      `;

      const instructionPrompt = `
        Draft a comprehensive boutique product configuration profile based on this short description: "${prompt}".
        
        Provide:
        1. A sophisticated productName
        2. A realistic luxury price in INR (e.g. 1199, 1499, 1999) depending on tiers described
        3. A premium descriptive copywriter-style product description detailing taste profile, layers, frosting textures, and styling details.
        4. Matching categories (comma-separated, e.g. "Cakes, Premium Cakes, Birthday Cakes")
        5. Matching flavors (comma-separated, e.g. "Belgian Dark Chocolate, Truffle fudge")
        6. Ideal occasions (comma-separated, e.g. "Birthday, Anniversary, Celebration")
        7. A highly optimized Google SEO Title tag
        8. A clean URL slug
        9. Alt text describing its physical visuals for image accessibility.
        10. A compelling Google meta description (max 160 characters) with a luxury CTA.
        11. An array of 10-15 high volume search keywords.
        12. Raw Product structured LD-JSON schema details (STRICTLY single-line, minimal, under 300 characters).
        13. An irresistible boutique Instagram caption with hashtags.
        14. Pinterest pin title and rich description.
      `;

      const response = await genAI.models.generateContent({
        model,
        contents: instructionPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              productName: { type: Type.STRING },
              price: { type: Type.NUMBER },
              description: { type: Type.STRING },
              categories: { type: Type.STRING },
              flavors: { type: Type.STRING },
              occasions: { type: Type.STRING },
              seoTitle: { type: Type.STRING },
              slug: { type: Type.STRING },
              altText: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              keywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              structuredSchema: { type: Type.STRING, description: "Minimal single-line stringified JSON-LD Product schema under 300 characters." },
              instagramCaption: { type: Type.STRING },
              pinterestPin: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            required: [
              "productName", "price", "description", "categories", "flavors", 
              "occasions", "seoTitle", "slug", "altText", "metaDescription", 
              "keywords", "structuredSchema", "instagramCaption", "pinterestPin"
            ]
          }
        }
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("No response received from Gemini engine");
      }

      res.json(safeParseCakeJSON(resultText, specsFallbackObj));
    } catch (error) {
      console.error("AI Spec Generation Error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to generate spec sheet" });
    }
  });

  app.post("/api/search", async (req, res) => {
    const { query, products } = req.body;
    try {
      const model = "gemini-3.5-flash";
      const systemInstruction = `
        You are an AI search assistant for "CakeUrban", a premium cake shop.
        Given a user query (which might have typos or be vague) and a list of products,
        return the best matching product IDs in ranked order.
        Output ONLY a JSON array of IDs. If no match, return [].
      `;
      
      const response = await genAI.models.generateContent({
        model,
        contents: `Query: ${query}\nProducts: ${JSON.stringify(products)}`,
        config: { systemInstruction, responseMimeType: "application/json" }
      });

      res.json(JSON.parse(response.text || "[]"));
    } catch (error) {
      console.error("AI Search Error:", error);
      res.status(500).json({ error: "Failed to perform AI search" });
    }
  });

  // GEMINI INTERACTIVE CAKE CHAT ARCHITECT ENDPOINT
  app.post("/api/chat/discuss-cake", async (req, res) => {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required for the chat history." });
    }

    try {
      const model = "gemini-3.5-flash";
      const systemInstruction = `
        You are "Cake Urban's" elite AI Confection Architect and Chef Chatbot. Your goal is to help the shop administrator design, discuss, refine, and instantly publish luxury cake creations.
        Your tone is warm, professional, highly creative, and pastry-expert. Speak in a friendly blend of Hindi and English (Hinglish) as typical in Delhi NCR, or English, depending on user preference.
        
        Roles & Functions:
        1. Discuss ideas: Suggest exquisite layer combinations, luxury frosting styles (e.g., velvet mist, glass mirror, gold brushstrokes), premium ingredients, and appropriate categories (e.g. Cakes, Premium Cakes, Anniversary Cakes).
        2. Refine specifications: Recommend realistic luxury pricing in INR (usually ₹899 to ₹4999 depending on weights and design detail).
        3. Image Generation: If the user requests an image, wants to see what the cake looks like, or if you both agree on a gorgeous concept, generate a stunning visual description in the 'imagePrompt' field. This prompt will automatically be sent to our Imagen engine.
        4. Structured Specs: Whenever a cake concept is finalized, or the user says to add it, or you describe a complete cake, provide the 'finalizedCake' parameter populated with all product fields. 
        
        Important branding rule for 'imagePrompt':
        The image prompt MUST describe the cake resting on a circular white or gold cardboard cake board, with the brand name "Cake Urban" elegantly written on the cardboard surface. Keep details clean, professional food commercial style, 8k resolution, with warm shallow depth of field.
      `;

      // Map incoming simplified messages array into the expected content structure
      const formattedContents = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const response = await genAI.models.generateContent({
        model,
        contents: formattedContents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { 
                type: Type.STRING, 
                description: "Your friendly, helpful conversational reply to the administrator in warm Hinglish." 
              },
              finalizedCake: {
                type: Type.OBJECT,
                description: "Populate this ONLY when a cake idea has been discussed, specified, or when the user wants to finalize/add it to the store.",
                properties: {
                  productName: { type: Type.STRING, description: "Descriptive premium name of the cake." },
                  price: { type: Type.NUMBER, description: "Gourmet selling price in INR (e.g. 1499)." },
                  description: { type: Type.STRING, description: "Irresistible, luxury copywriter description of the layers, flavors, and frosting." },
                  categories: { type: Type.STRING, description: "Comma-separated list of collection categories, e.g. 'Cakes, Custom Cakes, Birthday Cakes'" },
                  flavors: { type: Type.STRING, description: "Comma-separated list of delicious flavor tags, e.g. 'Belgian Truffle, Dark Chocolate'" },
                  occasions: { type: Type.STRING, description: "Comma-separated list of suitable occasions, e.g. 'Birthday, Anniversary, Party'" },
                  seoTitle: { type: Type.STRING, description: "Optimized Google SEO search title tag (max 60 chars)." },
                  slug: { type: Type.STRING, description: "URL slug, lowercase, hyphen-separated." },
                  metaDescription: { type: Type.STRING, description: "Compelling Google meta search description snippet (max 160 chars) with a strong CTA." },
                  keywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Array of 10-15 high volume search terms."
                  },
                  instagramCaption: { type: Type.STRING, description: "Irresistible Instagram caption with hashtags for boutique social publishing." },
                  pinterestPin: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING }
                    }
                  }
                },
                required: ["productName", "price", "description", "categories", "flavors", "occasions"]
              },
              imagePrompt: { 
                type: Type.STRING, 
                description: "Exquisite visual description for Imagen-3 to render this cake design. Include cardboard base with 'Cake Urban' written on it. Populate this if user asks to see/generate the cake." 
              }
            },
            required: ["text"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response text emitted from Gemini chat model.");
      }

      res.json(safeParseChatJSON(responseText));
    } catch (error) {
      console.error("AI Discuss Cake Chat Error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to generate chat response" });
    }
  });

  // Mock Payment Verification (Don't expose secrets)
  app.post("/api/payments/verify", (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    // In a real app, verify signature with crypto and RAZORPAY_KEY_SECRET
    // For demo/prototype, we'll return success if IDs are present
    if (razorpay_order_id && razorpay_payment_id) {
       res.json({ status: "ok" });
    } else {
       res.status(400).json({ status: "failed" });
    }
  });

  // ==========================================
  // GEMINI NANO BANANA IMAGE GENERATION SECURE PROXY
  // ==========================================
  app.post("/api/grok/generate-images", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required relative to the specified cake style." });
    }

    // Enhance prompt to satisfy user's strict styling, branding, and copyright rules:
    // 1. Pristine cake cardboard base board with elegant "Cake Urban" brand name written on it.
    // 2. Clear food commercial style, premium lighting, no watermarks / copy of logos.
    const brandEnrichment = "The cake MUST be resting on a pristine, thick, circular cake cardboard base board. Elegantly, clearly, and visibly written/engraved on the surface of this cardboard base board is the brand name 'Cake Urban' in elegant luxury typography (no spelling mistakes, exactly 'Cake Urban'). Studio commercial catalog setting, professional high-end DSLR food photography, 8k resolution, ultra detailed frosting texture, warm depth-of-field lighting. Free from any copyright watermarks, signature texts, or stock photography overlays.";
    const enhancedPrompt = `${prompt}. ${brandEnrichment}`;

    try {
      console.log(`[GEMINI NANO BANANA ENGINE] Request received. Generating 3 candidates using 'gemini-3.1-flash-lite-image' for: "${prompt}"`);

      // We will perform 3 parallel calls to generate 3 unique image candidates
      const imagePromises = Array.from({ length: 3 }).map(async (_, index) => {
        try {
          const response = await genAI.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents: {
              parts: [
                {
                  text: enhancedPrompt,
                },
              ],
            },
            config: {
              imageConfig: {
                aspectRatio: "1:1",
              },
            },
          });

          if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
              }
            }
          }
          return null;
        } catch (singleErr) {
          console.warn(`[GEMINI LITE IMAGE ERR] Candidate ${index + 1} failed. Trying gemini-3.1-flash-image fallback...`, singleErr);
          try {
            // Secondary fallback to gemini-3.1-flash-image
            const fallbackResponse = await genAI.models.generateContent({
              model: 'gemini-3.1-flash-image',
              contents: {
                parts: [
                  {
                    text: enhancedPrompt,
                  },
                ],
              },
              config: {
                imageConfig: {
                  aspectRatio: "1:1",
                },
              },
            });
            if (fallbackResponse.candidates?.[0]?.content?.parts) {
              for (const part of fallbackResponse.candidates[0].content.parts) {
                if (part.inlineData) {
                  return `data:image/png;base64,${part.inlineData.data}`;
                }
              }
            }
          } catch (doubleErr) {
            console.error(`[GEMINI PRO IMAGE ERR] Candidate ${index + 1} also failed:`, doubleErr);
          }
          return null;
        }
      });

      const results = await Promise.all(imagePromises);
      const imageUrls = results.filter((url): url is string => url !== null);

      console.log(`[GEMINI NANO BANANA ENGINE] Successfully generated ${imageUrls.length} live images.`);

      // If for some reason we got fewer than 3 images, pad with highly realistic unsplash bakery fallbacks to keep the 3 Card candidates fully populated
      while (imageUrls.length < 3) {
        console.log(`[GEMINI NANO BANANA ENGINE] Padding missing slot ${imageUrls.length + 1} of 3 with premium curation placeholder.`);
        const fallbacks = [
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1559622214-f8a98509db7b?auto=format&fit=crop&q=80&w=800"
        ];
        imageUrls.push(fallbacks[imageUrls.length]);
      }

      res.json({ success: true, images: imageUrls, enhancedPrompt });
    } catch (err: any) {
      console.error("[GEMINI IMAGE CRITICAL ERROR]:", err);
      // Fallback response with beautiful curation placeholders so testing and play remains completely pristine if the credit or API rate limits on user key happens!
      console.log("[GEMINI NANO BANANA ENGINE] Emitting highly realistic fallback simulation for testing continuity.");
      const mockImages = [
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1559622214-f8a98509db7b?auto=format&fit=crop&q=80&w=800"
      ];
      res.json({
        success: true,
        images: mockImages,
        simulated: true,
        enhancedPrompt,
        warning: err.message
      });
    }
  });

  // ==========================================
  // GODADDY / CUSTOM SMTP EMAIL TRANSMISSION HUB
  // ==========================================

  let mailTransporter: any = null;

  function getMailTransporter() {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const host = process.env.SMTP_HOST || "smtpout.secureserver.net";
    const port = parseInt(process.env.SMTP_PORT || "465", 10);

    if (!user || !pass) {
      console.warn("⚠️ SMTP credentials not set in environment. Email notifications will be mock-simulated on server console.");
      return null;
    }

    if (!mailTransporter) {
      try {
        mailTransporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
          tls: {
            rejectUnauthorized: false // Helps bypass strict SSL cert issues on GoDaddy SMTP out
          }
        });
      } catch (err) {
        console.error("❌ Failed to initiate GoDaddy SMTP connection:", err);
        return null;
      }
    }
    return mailTransporter;
  }

  async function sendTransactionalMail(to: string, subject: string, htmlContent: string) {
    const transporter = getMailTransporter();
    const fromName = process.env.SMTP_FROM_NAME || "Cake Urban";
    const fromUser = process.env.SMTP_USER || "noreply@cakeurban.com";

    if (!transporter) {
      console.log(`\n========================================`);
      console.log(`[SIMULATED EMAIL LOG]`);
      console.log(`To:      ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body Fragment:\n${htmlContent.slice(0, 800)}...`);
      console.log(`========================================\n`);
      return { simulated: true };
    }

    try {
      const info = await transporter.sendMail({
        from: `"${fromName}" <${fromUser}>`,
        to,
        subject,
        html: htmlContent,
      });
      console.log(`Email dispatched successfully to ${to}. MessageId: ${info.messageId}`);
      return { messageId: info.messageId };
    } catch (err) {
      console.error(`❌ SMTP delivery failed to ${to}:`, err);
      throw err;
    }
  }

  // Signup OTP verification memory store
  const signupOtps = new Map<string, { code: string; expiresAt: number }>();

  // Send Registration Verification Code OTP
  app.post("/api/email/send-signup-otp", async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Missing email address field" });
    }

    try {
      const cleanEmail = email.trim().toLowerCase();
      // Generate secure 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

      signupOtps.set(cleanEmail, { code: otpCode, expiresAt });

      const emailHtml = `
        <div style="font-family: 'Inter', system-ui, sans-serif; background-color: #FFFDFB; padding: 40px; border-radius: 20px; border: 1px solid #E8DDD7; max-width: 600px; margin: 0 auto; color: #3B1F17;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3D140B; font-family: 'Times New Roman', serif; font-size: 32px; letter-spacing: -0.02em; margin: 0;">CAKE URBAN</h1>
            <p style="text-transform: uppercase; font-size: 10px; font-weight: 900; letter-spacing: 0.3em; color: #DFB15B; margin: 5px 0 0 0;">Elite Custom Confections</p>
          </div>
          
          <div style="background-color: #140603; padding: 40px; border-radius: 16px; color: #FFFDFB; text-align: center;">
            <p style="font-size: 9px; text-transform: uppercase; font-weight: 900; letter-spacing: 0.25em; color: #DFB15B; margin-bottom: 10px;">Security Verification</p>
            <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 20px 0;">Membership Confirmation Code</h2>
            
            <div style="background-color: #3D140B; border: 1px solid #DFB15B; padding: 25px; border-radius: 12px; margin: 25px 0; font-size: 32px; font-weight: 900; letter-spacing: 0.4em; font-family: monospace; color: #DFB15B; display: inline-block;">
              ${otpCode}
            </div>
            
            <p style="font-size: 11px; opacity: 0.6; margin: 0; line-height: 1.6;">
              Please enter this security verification phrase to instantly validate your email address and activate your Cake House account. This code is valid for the next 10 minutes.
            </p>
          </div>

          <p style="font-size: 11px; opacity: 0.5; text-align: center; margin-top: 35px; line-height: 1.6;">
            If you did not initiate this request, you can safely ignore this email. Your registry remains secure.<br>
            &copy; 2026 Cake Urban. Operating in Faridabad and across Delhi NCR.
          </p>
        </div>
      `;

      await sendTransactionalMail(
        cleanEmail,
        `Cake Urban Registration Code: ${otpCode} [CONFIDENTIAL]`,
        emailHtml
      );

      res.json({ success: true, message: "Verification code sent successfully", simulated: !process.env.SMTP_USER, code: !process.env.SMTP_USER ? otpCode : undefined });
    } catch (error) {
      console.error("OTP send failure:", error);
      res.status(500).json({ error: "Failed to dispatch verification code via SMTP" });
    }
  });

  // Verify Registration Code OTP
  app.post("/api/email/verify-signup-otp", (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: "Missing email address or verification code" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const stored = signupOtps.get(cleanEmail);

    if (!stored) {
      return res.status(400).json({ error: "No verification code exists for this email address" });
    }

    if (Date.now() > stored.expiresAt) {
      signupOtps.delete(cleanEmail);
      return res.status(400).json({ error: "Verification code has expired. Please request a new one." });
    }

    if (stored.code !== code.trim()) {
      return res.status(400).json({ error: "Invalid verification code. Please check and try again." });
    }

    // Success - consume code
    signupOtps.delete(cleanEmail);
    res.json({ success: true });
  });

  // Automated Send transactional email replies (Welcome, Custom Inquiries, Checkout Orders)
  app.post("/api/email/send-auto-reply", async (req, res) => {
    const { email, type, details } = req.body;
    if (!email || !type) {
      return res.status(400).json({ error: "Missing email address or trigger type" });
    }

    try {
      const cleanEmail = email.trim().toLowerCase();
      let subject = "Transaction Received - Cake Urban";
      let emailHtml = "";

      if (type === "welcome") {
        subject = "Welcome to the Elite Collector Circle - Cake Urban";
        emailHtml = `
          <div style="font-family: 'Inter', system-ui, sans-serif; background-color: #FFFDFB; padding: 40px; border-radius: 20px; border: 1px solid #E8DDD7; max-width: 600px; margin: 0 auto; color: #3B1F17;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3D140B; font-family: 'Times New Roman', serif; font-size: 32px; letter-spacing: -0.02em; margin: 0;">CAKE URBAN</h1>
              <p style="text-transform: uppercase; font-size: 10px; font-weight: 900; letter-spacing: 0.3em; color: #DFB15B; margin: 5px 0 0 0;">Elite Custom Confections</p>
            </div>
            
            <div style="background-color: #3D140B; padding: 40px; border-radius: 16px; color: #FFFDFB; text-align: left;">
              <h2 style="font-family: 'Times New Roman', serif; font-size: 24px; color: #DFB15B; margin: 0 0 15px 0; font-weight: normal;">Greeting, ${details.name || "Artisan Member"}</h2>
              <p style="font-size: 13px; line-height: 1.7; margin: 0 0 20px 0; font-weight: 400; opacity: 0.9;">
                Welcome to Cake Urban's digital atelier! We verify and celebrate your enrollment inside our exclusive boutique circle.
              </p>
              <p style="font-size: 13px; line-height: 1.7; margin: 0; font-weight: 400; opacity: 0.9;">
                Your account is now activated. You gain instant access to bespoke customized creations, direct tracking, same-day delivery scheduling, and private chef consultation suites.
              </p>
            </div>

            <div style="margin-top: 30px; border-top: 1px solid #E8DDD7; padding-top: 25px; text-align: left;">
               <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #3D140B; margin: 0 0 10px 0;">Membership Credentials:</h3>
               <p style="font-size: 12px; margin: 5px 0; font-family: monospace;">Email ID: ${cleanEmail}</p>
               <p style="font-size: 12px; margin: 5px 0; font-family: monospace;">Phone: +91 ${details.phone || "Verified"}</p>
            </div>

            <p style="font-size: 11px; opacity: 0.5; text-align: center; margin-top: 35px; line-height: 1.6;">
              If you have any queries about our same-day logistics in Faridabad or Delhi NCR, contact our lead baker desk directly.<br>
              &copy; 2026 Cake Urban. All Rights Reserved.
            </p>
          </div>
        `;
      } else if (type === "custom_inquiry") {
        subject = "We've Received Your Majestic Cake Design Inquiry! ✦";
        emailHtml = `
          <div style="font-family: 'Inter', system-ui, sans-serif; background-color: #FFFDFB; padding: 40px; border-radius: 20px; border: 1px solid #E8DDD7; max-width: 600px; margin: 0 auto; color: #3B1F17;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3D140B; font-family: 'Times New Roman', serif; font-size: 32px; letter-spacing: -0.02em; margin: 0;">CAKE URBAN</h1>
              <p style="text-transform: uppercase; font-size: 10px; font-weight: 900; letter-spacing: 0.3em; color: #DFB15B; margin: 5px 0 0 0;">Elite Custom Confections</p>
            </div>
            
            <div style="background-color: #140603; padding: 40px; border-radius: 16px; color: #FFFDFB; text-align: left; border-left: 4px solid #DFB15B;">
              <p style="font-size: 9px; text-transform: uppercase; font-weight: 900; letter-spacing: 0.25em; color: #DFB15B; margin-bottom: 10px;">Atelier Ingestion Confirmation</p>
              <h2 style="font-family: 'Times New Roman', serif; font-size: 24px; font-weight: normal; margin: 0 0 15px 0;">Design Vision Under Review</h2>
              <p style="font-size: 12.5px; opacity: 0.85; line-height: 1.7; margin: 0;">
                Hello ${details.name || "Collector"}, we have successfully registered your custom cake architectural configuration. Our lead baking artisan and culinary decorators are reviewing the geometric constraints, icing tone properties, and reference images.
              </p>
            </div>

            <div style="margin-top: 30px; background-color: #FFFDFB; border: 1px solid #E8DDD7; border-radius: 12px; padding: 25px;">
              <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #3D140B; margin: 0 0 15px 0; border-bottom: 1px solid #E8DDD7; padding-bottom: 10px;">Architectural Blueprint Specs:</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px; line-height: 1.8;">
                <tr><td style="font-weight: bold; width: 40%; color: #3B1F17/70;">Artisan Flavor:</td><td style="color: #3D140B; font-weight: bold;">${details.flavor || "Belgian Dark"}</td></tr>
                <tr><td style="font-weight: bold; color: #3B1F17/70;">Shape Geometry:</td><td>${details.shape || "Classic Round"}</td></tr>
                <tr><td style="font-weight: bold; color: #3B1F17/70;">Custom Message:</td><td style="font-style: italic;">${details.message ? `"${details.message}"` : "None"}</td></tr>
                <tr><td style="font-weight: bold; color: #3B1F17/70;">Event Celebration:</td><td>${details.date || "Urgent Delivery"}</td></tr>
              </table>
            </div>

            <p style="font-size: 13px; line-height: 1.7; margin-top: 25px; color: #3B1F17;">
              Our concierge team will reach out to you via <strong>WhatsApp (+91 phone)</strong> or via <strong>phone call</strong> shortly to confirm shipping parameters and finalize delivery pricing estimates.
            </p>

            <p style="font-size: 11px; opacity: 0.5; text-align: center; margin-top: 35px; line-height: 1.6;">
              This mailbox is integrated. Reply directly if you wish to upload or replace reference image attachments.<br>
              &copy; 2026 Cake Urban. Faridabad and Delhi NCR Luxury Confectioners.
            </p>
          </div>
        `;
      } else if (type === "order_completion") {
        subject = "Order Confirmed! Your Gourmet Creation is Scheduled 🧁 - Cake Urban";
        emailHtml = `
          <div style="font-family: 'Inter', system-ui, sans-serif; background-color: #FFFDFB; padding: 40px; border-radius: 20px; border: 1px solid #E8DDD7; max-width: 600px; margin: 0 auto; color: #3B1F17;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3D140B; font-family: 'Times New Roman', serif; font-size: 32px; letter-spacing: -0.02em; margin: 0;">CAKE URBAN</h1>
              <p style="text-transform: uppercase; font-size: 10px; font-weight: 900; letter-spacing: 0.3em; color: #DFB15B; margin: 5px 0 0 0;">Elite Custom Confections</p>
            </div>
            
            <div style="background-color: #3D140B; padding: 40px; border-radius: 16px; color: #FFFDFB; text-align: center;">
              <span style="font-size: 30px; display: block; margin-bottom: 10px;">✓</span>
              <h2 style="font-family: 'Times New Roman', serif; font-size: 24px; margin: 0 0 10px 0; font-weight: normal; color: #DFB15B;">Gourmet Confection Booked!</h2>
              <p style="font-size: 12px; opacity: 0.8; margin: 0; text-transform: uppercase; letter-spacing: 0.1em;">Order Total: ₹${details.total}</p>
            </div>

            <div style="margin-top: 30px; background-color: #FFFDFB; border: 1px solid #E8DDD7; border-radius: 12px; padding: 25px;">
              <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #3D140B; margin: 0 0 15px 0; border-bottom: 1px solid #E8DDD7; padding-bottom: 10px;">Order Shipment Parameters:</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px; line-height: 1.8;">
                <tr><td style="font-weight: bold; width: 45%; color: #3B1F17/70;">Artisanal Items:</td><td style="font-weight: bold;">${details.items}</td></tr>
                <tr><td style="font-weight: bold; color: #3B1F17/70;">Delivery Date Target:</td><td>${details.deliveryDate}</td></tr>
                <tr><td style="font-weight: bold; color: #3B1F17/70;">Requested Slot:</td><td>${details.deliverySlot}</td></tr>
                <tr><td style="font-weight: bold; color: #3B1F17/70;">Baker Instructions:</td><td style="font-style: italic;">${details.instructions || "None"}</td></tr>
              </table>
            </div>

            <p style="font-size: 12.5px; opacity: 0.9; line-height: 1.7; margin-top: 25px;">
              Our dedicated temperature-controlled routing riders will coordinate direct handoff drop-off when approaching your destination pin. Active phone validation response is required on arrival.
            </p>

            <p style="font-size: 11px; opacity: 0.5; text-align: center; margin-top: 35px; line-height: 1.6;">
              Please reach out on our support WhatsApp or phone desk for route coordination or adjustments.<br>
              &copy; 2026 Cake Urban. Gourmet Frosting Laboratories.
            </p>
          </div>
        `;
      }

      await sendTransactionalMail(cleanEmail, subject, emailHtml);
      res.json({ success: true, message: "Transactional auto-reply dispatched successfully", simulated: !process.env.SMTP_USER });
    } catch (error) {
      console.error("Auto-reply trigger error:", error);
      res.status(500).json({ error: "Failed to dispatch auto-reply transactional email" });
    }
  });


  // Data structures for programmatic sitemaps generation
  const CITIES = ['Delhi', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad'];

  const LOCALITIES = [
    { name: 'Sector 31', city: 'Faridabad', slug: 'sector-31' },
    { name: 'Sector 15', city: 'Faridabad', slug: 'sector-15' },
    { name: 'Sector 14', city: 'Faridabad', slug: 'sector-14' },
    { name: 'Sector 21', city: 'Faridabad', slug: 'sector-21' },
    { name: 'Greenfield Colony', city: 'Faridabad', slug: 'greenfield' },
    { name: 'NIT Faridabad', city: 'Faridabad', slug: 'nit' },
    { name: 'Sector 62', city: 'Noida', slug: 'sector-62' },
    { name: 'Sector 15', city: 'Noida', slug: 'sector-15-noida' },
    { name: 'Sector 18', city: 'Noida', slug: 'sector-18' },
    { name: 'Sector 50', city: 'Noida', slug: 'sector-50' },
    { name: 'Sector 137', city: 'Noida', slug: 'sector-137' },
    { name: 'Sector 150', city: 'Noida', slug: 'sector-150' },
    { name: 'DLF Phase 1-5', city: 'Gurgaon', slug: 'dlf-phase' },
    { name: 'Golf Course Road', city: 'Gurgaon', slug: 'golf-course-road' },
    { name: 'Sohna Road', city: 'Gurgaon', slug: 'sohna-road' },
    { name: 'Cyber City', city: 'Gurgaon', slug: 'cyber-city' },
    { name: 'Dwarka', city: 'Delhi', slug: 'dwarka' },
    { name: 'South Delhi', city: 'Delhi', slug: 'south-delhi' },
    { name: 'West Delhi', city: 'Delhi', slug: 'west-delhi' },
    { name: 'Punjabi Bagh', city: 'Delhi', slug: 'punjabi-bagh' },
    { name: 'Rohini', city: 'Delhi', slug: 'rohini' },
    { name: 'Janakpuri', city: 'Delhi', slug: 'janakpuri' },
    { name: 'Indirapuram', city: 'Ghaziabad', slug: 'indirapuram' },
    { name: 'Vaishali', city: 'Ghaziabad', slug: 'vaishali' },
    { name: 'Vasundhara', city: 'Ghaziabad', slug: 'vasundhara' }
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

  // Dynamically serve programmatic XML sitemaps
  app.get("/sitemap_core.xml", (req, res) => {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
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
    res.send(xml);
  });

  app.get("/sitemap_sectors.xml", (req, res) => {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
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

    xml += `</urlset>`;
    res.send(xml);
  });

  app.get("/sitemap_specialties.xml", (req, res) => {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
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
    res.send(xml);
  });

  app.get("/sitemap_combinations.xml", (req, res) => {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
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
    res.send(xml);
  });

  // Explicitly serve sitemap XML files and crawler directives to prevent SPA HTML fallback
  app.get([
    "/sitemap.xml",
    "/robots.txt",
    "/llms.txt"
  ], (req, res) => {
    const filename = path.basename(req.path);
    const distFilePath = path.join(process.cwd(), "dist", filename);
    const publicFilePath = path.join(process.cwd(), "public", filename);

    // Set correct MIME type to be ultra-safe
    if (filename.endsWith(".xml")) {
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
    } else {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
    }

    res.sendFile(distFilePath, (err) => {
      if (err) {
        res.sendFile(publicFilePath, (err2) => {
          if (err2) {
            res.status(404).send("File not found");
          }
        });
      }
    });
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
