import type { MetadataRoute } from 'next';

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api').replace('/api', '');
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

async function fetchSlugs(endpoint: string): Promise<{ slug: string }[]> {
  try {
    const res = await fetch(`${API}${endpoint}`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) });
    const json = await res.json();
    return (json.data ?? []) as { slug: string }[];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [frames, categories] = await Promise.all([
    fetchSlugs('/frames?limit=500'),
    fetchSlugs('/categories'),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/products`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const frameRoutes: MetadataRoute.Sitemap = frames.map((f) => ({
    url: `${BASE}/product/${f.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE}/category/${c.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...frameRoutes, ...categoryRoutes];
}
