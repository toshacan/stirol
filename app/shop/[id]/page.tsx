import { PRODUCTS } from '@/app/data/products';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

// Серверная генерация динамического тайтла
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return { title: 'NOT FOUND' };
  }

  return {
    title: `${product.title.toUpperCase()} - STIROL`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return notFound();

  const currentIndex = PRODUCTS.findIndex(p => p.id === id);
  const nextProduct = PRODUCTS[currentIndex + 1] || PRODUCTS[0];

  return <ProductClient product={product} nextProduct={nextProduct} id={id} />;
}