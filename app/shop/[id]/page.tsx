import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

// ЭТА ФУНКЦИЯ ОТВЕЧАЕТ ЗА SEO (ЗАГОЛОВОК ВКЛАДКИ)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  const { data: product } = await supabase
    .from('products')
    .select('title')
    .eq('id', id)
    .single();

  return {
    title: product ? `${product.title} | Stirol` : 'Stirol',
    description: product ? `Buy ${product.title} at Stirol` : 'Stirol store',
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