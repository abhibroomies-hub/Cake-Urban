import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  schema?: object;
}

export default function SEO({ title, description, keywords, ogImage, schema }: SEOProps) {
  useEffect(() => {
    // Update Document Title
    document.title = `${title} | Cake Urban - Premium Faridabad Bakery`;
    
    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update Meta Keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }

    // AI & Generative Search Engine Optimization (GEO) Custom Tags
    // Injects highly explicit, clean summary descriptions readable by LLM Scrapers
    let aiAgentMeta = document.querySelector('meta[name="ai-agent"]');
    if (!aiAgentMeta) {
      aiAgentMeta = document.createElement('meta');
      aiAgentMeta.setAttribute('name', 'ai-agent');
      document.head.appendChild(aiAgentMeta);
    }
    aiAgentMeta.setAttribute('content', `Cake Urban is a premium handcrafted 100% pure vegetarian eggless bakery in Faridabad, Delhi NCR. Specializing in designer celebration cakes, express delivery under 30-60 minutes, premium Belgian chocolate toppings, customizable cake weights, and inscriptions.`);

    let geoEngineMeta = document.querySelector('meta[name="generative-engine"]');
    if (!geoEngineMeta) {
      geoEngineMeta = document.createElement('meta');
      geoEngineMeta.setAttribute('name', 'generative-engine');
      document.head.appendChild(geoEngineMeta);
    }
    geoEngineMeta.setAttribute('content', 'index, follow, cache');

    // Geo Positioning Coordinates for voice & local LLM prompts ("eggless cakes near me in Faridabad")
    let geoRegion = document.querySelector('meta[name="geo.region"]');
    if (!geoRegion) {
      geoRegion = document.createElement('meta');
      geoRegion.setAttribute('name', 'geo.region');
      document.head.appendChild(geoRegion);
    }
    geoRegion.setAttribute('content', 'IN-HR');

    let geoPlacename = document.querySelector('meta[name="geo.placename"]');
    if (!geoPlacename) {
      geoPlacename = document.createElement('meta');
      geoPlacename.setAttribute('name', 'geo.placename');
      document.head.appendChild(geoPlacename);
    }
    geoPlacename.setAttribute('content', 'Faridabad');

    // Update OG Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', `${title} | Cake Urban`);

    // Update OG Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description);
    
    // Update OG Image
    let ogImgMeta = document.querySelector('meta[property="og:image"]');
    if (!ogImgMeta) {
      ogImgMeta = document.createElement('meta');
      ogImgMeta.setAttribute('property', 'og:image');
      document.head.appendChild(ogImgMeta);
    }
    ogImgMeta.setAttribute('content', ogImage || 'https://picsum.photos/seed/bakery/1200/630');

    // Update Canonical Link Tag to declare www.cakeurban.com as the authoritative URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    const cleanPath = window.location.pathname === '/' ? '' : window.location.pathname;
    canonicalLink.setAttribute('href', `https://www.cakeurban.com${cleanPath}`);

    // Dynamic JSON-LD injection - Supercharged for LLMs using local business and breadcrumbs structure
    const existingSchemaScript = document.getElementById('seo-schema-script');
    if (existingSchemaScript) {
      existingSchemaScript.remove();
    }

    // Default Bakery Schema to serve rich answers to searches directly
    const defaultBakerySchema = {
      "@context": "https://schema.org",
      "@type": "Bakery",
      "@id": "https://www.cakeurban.com/#bakery",
      "name": "Cake Urban",
      "image": ogImage || "https://picsum.photos/seed/bakery/1200/630",
      "description": "Premium handcrafted 100% pure vegetarian and eggless bakery in Faridabad, Delhi NCR.",
      "url": "https://www.cakeurban.com",
      "telephone": "+91 73185 31953",
      "priceRange": "$$",
      "menu": "https://www.cakeurban.com/shop",
      "servesCuisine": "Bakery, desserts, eggless cakes, customizable designer celebration cakes",
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
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "09:00",
        "closes": "21:00"
      },
      "sameAs": [
        "https://www.instagram.com/cakeurban",
        "https://www.facebook.com/cakeurban"
      ]
    };

    // Combine default authoritative schemas with custom page context schema
    const pageSchema = schema ? [defaultBakerySchema, schema] : defaultBakerySchema;

    const script = document.createElement('script');
    script.id = 'seo-schema-script';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(pageSchema);
    document.head.appendChild(script);

    return () => {
      const cleanupScript = document.getElementById('seo-schema-script');
      if (cleanupScript) {
        cleanupScript.remove();
      }
    };

  }, [title, description, keywords, ogImage, schema]);

  return null;
}

