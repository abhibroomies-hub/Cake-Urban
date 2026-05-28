import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  // GEMINI AI Search Logic
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  // AI Image SEO Optimizer Endpoint
  app.post("/api/seo/optimize-image", async (req, res) => {
    const { imageBase64, mimeType } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: "Missing required image data" });
    }

    try {
      let base64Data = imageBase64;
      if (base64Data.includes(";base64,")) {
        base64Data = base64Data.split(";base64,").pop() || "";
      }

      const model = "gemini-3.5-flash";
      const systemInstruction = `
        You are an expert AI SEO and Visual Marketing specialist for "Cake Urban", an elite custom online bakery operating in the Delhi National Capital Region (Faridabad, South Delhi, Noida, Gurgaon, Ghaziabad).
        Your task is to analyze the uploaded cake image and generate a professional, high-performance SEO Optimization Package.
        This package provides search tags, rich schemas, and highly persuasive social media referral content to rank the image at the top of Google Image Search and drive massive organic traffic to the Cake Urban website.
      `;

      const prompt = `
        Analyze this cake image in meticulous detail. Identify its styling, design theme (e.g. minimalist floral, gold foil, kid's cartoon character, metallic textures, multi-tiered wedding), icing type, colors, and potential flavor profile.
        
        Generate the complete SEO bundle containing:
        1. Brand Name: "Cake Urban"
        2. Alluring product name for website.
        3. A high-intent SEO metadata title (max 60 chars) targeting major search keywords and location tags (e.g., South Delhi, Faridabad, Noida, Gurgaon).
        4. Lowercase search slug.
        5. Descriptive, keyword-rich Alt Text explaining the physical composition, colors, and style (outstanding for search visual indices and accessibility).
        6. A 150-160 character Google Meta Description incorporating a powerful Call-To-Action (CTA) to maximize search clicks.
        7. A list of 10-15 high-value search keywords/tags.
        8. A string representation of schema.org Product structured data (JSON-LD) with simulated premium ratings (e.g., 4.9 out of 5 stars) and standard INR pricing (e.g., ₹1199).
        9. An Instagram caption with food-oriented local hashtags (such as #FaridabadBakeries, #DelhiNCRFoodie).
        10. Pinterest pin outline (catchy title and rich description).
      `;

      const imagePart = {
        inlineData: {
          mimeType: mimeType || "image/jpeg",
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
              seoTitle: { type: Type.STRING },
              slug: { type: Type.STRING },
              suggestedFilename: { type: Type.STRING },
              altText: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              keywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              structuredSchema: { type: Type.STRING, description: "Raw stringified JSON-LD Product schema containing context and properties." },
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
              "productName", "seoTitle", "slug", "suggestedFilename", 
              "altText", "metaDescription", "keywords", "structuredSchema", 
              "instagramCaption", "pinterestPin"
            ]
          }
        }
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("No response received from Gemini engine");
      }

      res.json(JSON.parse(resultText));
    } catch (error) {
      console.error("AI SEO Generation Error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to analyze and optimize image for SEO" });
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
