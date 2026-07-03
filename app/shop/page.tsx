import ShopClient from './ShopClient';
import { createClient } from '@supabase/supabase-js';

// ВОТ ОНИ — ДВЕ СТРОЧКИ, КОТОРЫЕ УБИВАЮТ КЭШ НА VERCEL:
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const metadata = { title: 'SHOP' };

export default async function ShopPage() {
  // Параллельно грузим товары и категории прямо на сервере
  const [productsRes, categoriesRes] = await Promise.all([
    supabase.from('products').select('*'),
    supabase.from('categories').select('*')
  ]);

  const products = productsRes.data || [];
  const categories = categoriesRes.data || [];

  // Сортируем сразу здесь, чтобы клиент получил уже готовые данные
  const sortedProducts = products.sort((a, b) => (a.position || 0) - (b.position || 0));
  const sortedCategories = categories.sort((a, b) => (a.order || 0) - (b.order || 0));

  return <ShopClient initialProducts={sortedProducts} initialCategories={sortedCategories} />;
}