import React, { useEffect } from 'react';

export default function SEO({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
  schema
}) {
  useEffect(() => {
    // 1. Set Title
    const formattedTitle = title
      ? `${title} | 7 Horse Ventures`
      : '7 Horse Ventures — Connect. Build. Grow. Scale.';
    document.title = formattedTitle;

    // 2. Set Meta Description
    const defaultDesc =
      '7 Horse Ventures is building a connected ecosystem for founders, entrepreneurs, investors, professionals, and businesses to connect, build, grow, and scale.';
    const finalDesc = description || defaultDesc;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = finalDesc;

    // 3. Set Canonical Link
    const fullUrl = `https://7horseventures.com${canonicalUrl || window.location.pathname}`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = fullUrl;

    // 4. OpenGraph Tags
    const ogTags = [
      { property: 'og:title', content: formattedTitle },
      { property: 'og:description', content: finalDesc },
      { property: 'og:url', content: fullUrl },
      { property: 'og:type', content: ogType },
      { property: 'og:image', content: ogImage },
      { property: 'og:site_name', content: '7 Horse Ventures' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: formattedTitle },
      { name: 'twitter:description', content: finalDesc },
      { name: 'twitter:image', content: ogImage }
    ];

    ogTags.forEach((tag) => {
      const attr = tag.property ? `property="${tag.property}"` : `name="${tag.name}"`;
      let element = document.head.querySelector(`meta[${attr}]`);
      if (!element) {
        element = document.createElement('meta');
        if (tag.property) element.setAttribute('property', tag.property);
        if (tag.name) element.setAttribute('name', tag.name);
        document.head.appendChild(element);
      }
      element.content = tag.content;
    });

    // 5. Schema.org JSON-LD structured data
    const existingScript = document.getElementById('jsonld-structured-data');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'jsonld-structured-data';
    script.type = 'application/ld+json';

    const defaultSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://7horseventures.com/#organization',
          name: '7 Horse Ventures',
          url: 'https://7horseventures.com',
          logo: 'https://7horseventures.com/logo.svg',
          slogan: 'Connect. Build. Grow. Scale.',
          description:
            'A connected ecosystem for founders, entrepreneurs, investors, professionals, and businesses to meet, collaborate, and grow.',
          areaServed: ['India', 'Global'],
          sameAs: []
        },
        {
          '@type': 'WebSite',
          '@id': 'https://7horseventures.com/#website',
          url: 'https://7horseventures.com',
          name: '7 Horse Ventures',
          publisher: {
            '@id': 'https://7horseventures.com/#organization'
          }
        }
      ]
    };

    if (schema) {
      defaultSchema['@graph'].push(schema);
    }

    script.textContent = JSON.stringify(defaultSchema);
    document.head.appendChild(script);

    return () => {
      // cleanup structured data if needed
    };
  }, [title, description, canonicalUrl, ogType, ogImage, schema]);

  return null;
}
