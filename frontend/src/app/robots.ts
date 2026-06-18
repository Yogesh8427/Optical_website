import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:3000';
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/admin/'] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
