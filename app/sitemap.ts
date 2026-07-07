import type { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { VIDEOS } from '@/app/data/videos';

const BASE_URL = 'https://stirol.xyz';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // --- Статические страницы ---
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/shop`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/lookbook`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/news`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/videos`, changeFrequency: 'weekly', priority: 0.6 },
  ];

  // --- Товары из Supabase (динамически) ---
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('is_active', true);

    productRoutes = (products || []).map((p: any) => ({
      url: `${BASE_URL}/shop/${p.id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (err) {
    console.error('Sitemap: failed to fetch products', err);
  }

  // --- Видео (статические данные, кроме "coming soon") ---
  const videoRoutes: MetadataRoute.Sitemap = VIDEOS
    .filter((v) => !v.isComingSoon)
    .map((v) => ({
      url: `${BASE_URL}/videos/${v.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));

  return [...staticRoutes, ...productRoutes, ...videoRoutes];
}