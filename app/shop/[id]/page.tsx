import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';
import { Metadata } from 'next';
import { sortVariants } from '@/lib/sortVariants';

// Без этой строки Next.js мог закэшировать страницу товара НАВСЕГДА
// (до следующего деплоя), потому что тут нет cookies()/headers(), которые
// заставили бы роут стать динамическим автоматически. 60 секунд — разумный
// баланс, плюс update-product сбрасывает кэш немедленно через revalidatePath.
export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

// ЭТА ФУНКЦИЯ ОТВЕЧАЕТ ЗА SEO И ПРЕВЬЮ ПРИ ШЕРИНГЕ (title, описание, картинка товара)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const { data: product } = await supabase
    .from('products')
    .select('title, description, images')
    .eq('id', id)
    .single();

  if (!product) {
    return { title: 'Product not found' };
  }

  const description = product.description
    ? product.description.slice(0, 160)
    : `Buy ${product.title} at Stirol`;

  const firstImage = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : '/logo-heavy.png';

  return {
    title: product.title,
    description,
    openGraph: {
      title: product.title,
      description,
      images: [{ url: firstImage, width: 1200, height: 1200, alt: product.title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description,
      images: [firstImage],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  // 1. Ищем текущий товар
  const { data: product, error: productError } = await supabase
    .from('products')
    .select(`
      *,
      product_variants (
        id,
        size,
        stock,
        price_modifier
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (productError || !product) {
    return notFound();
  }

  // Сортируем размеры в правильном порядке (S, M, L, XL...) — Postgres не
  // гарантирует порядок строк без явной сортировки, особенно после UPDATE
  // (как при возврате стока после отмены заказа), поэтому сортируем на сервере
  if (Array.isArray(product.product_variants)) {
    product.product_variants = sortVariants(product.product_variants);
  }

  // 2. Ищем список для кнопки "NEXT ITEM"
  const { data: allProducts } = await supabase
    .from('products')
    .select('id')
    .order('created_at', { ascending: false });

  let nextProduct = null;
  if (allProducts && allProducts.length > 1) {
    const currentIndex = allProducts.findIndex((p) => p.id === id);
    const nextIndex = currentIndex !== -1 && currentIndex < allProducts.length - 1
      ? currentIndex + 1
      : 0;
    nextProduct = allProducts[nextIndex];
  }

  return <ProductClient product={product} nextProduct={nextProduct} id={id} />;
}