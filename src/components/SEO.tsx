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

    // Dynamic JSON-LD injection
    const existingSchemaScript = document.getElementById('seo-schema-script');
    if (existingSchemaScript) {
      existingSchemaScript.remove();
    }

    if (schema) {
      const script = document.createElement('script');
      script.id = 'seo-schema-script';
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const cleanupScript = document.getElementById('seo-schema-script');
      if (cleanupScript) {
        cleanupScript.remove();
      }
    };

  }, [title, description, keywords, ogImage, schema]);

  return null;
}
