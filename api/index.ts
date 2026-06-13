import express from "express";
import cors from "cors";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// API: Image SEO Optimizer
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
    `;

    const prompt = `
      Analyze this cake image in meticulous detail. Identify its styling, design theme, icing type, colors, and flavor profile.
      Generate the complete SEO bundle containing: Name, seo Title, lowercase search slug, descriptive Alt text, google Meta description, search keywords, schema.org JSON-LD, and Instagram caption.
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
            structuredSchema: { type: Type.STRING },
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
    console.error("AI SEO Serverless Error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to analyze image" });
  }
});

// AI-powered text specs builder to auto-populate forms serverless
app.post("/api/seo/generate-specs", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required to generate specs" });
  }

  try {
    const model = "gemini-3.5-flash";
    const systemInstruction = `
      You are an expert AI master pâtissier and visual curator for "Cake Urban", an elite custom online bakery in Delhi NCR (operating in Faridabad, South Delhi, Noida, Gurgaon, Ghaziabad).
      Your task is to take a short input description of a cake concept and generate a complete ready-to-publish digital profile with standard INR premium pricing (e.g. ₹1199, ₹1499).
    `;

    const instructionPrompt = `
      Draft a comprehensive boutique product configuration profile based on this short description: "${prompt}".
      Include: productName, suggested price (number), premium description copy, category list (comma-separated), flavor list (comma-separated), occasions, seo title, search slug, visual alt text, short metaDescription, tags, schema, social media caption, pinterest pin details.
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
            structuredSchema: { type: Type.STRING },
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

    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    console.error("AI Spec Serverless Gen Error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to generate specs" });
  }
});

// API: AI Search
app.post("/api/search", async (req, res) => {
  const { query, products } = req.body;
  try {
    const model = "gemini-3.5-flash";
    const systemInstruction = `
      You are an AI search assistant for "CakeUrban", a premium cake shop.
      Output ONLY a JSON array of matching product IDs. If no match, return [].
    `;
    
    const response = await genAI.models.generateContent({
      model,
      contents: `Query: ${query}\nProducts: ${JSON.stringify(products)}`,
      config: { systemInstruction, responseMimeType: "application/json" }
    });

    res.json(JSON.parse(response.text || "[]"));
  } catch (error) {
    console.error("AI Vercel Search Error:", error);
    res.status(500).json({ error: "Failed to perform AI search" });
  }
});

// API: Payments Verify
app.post("/api/payments/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id } = req.body;
  if (razorpay_order_id && razorpay_payment_id) {
     res.json({ status: "ok" });
  } else {
     res.status(400).json({ status: "failed" });
  }
});

export default app;
