'use client';
import { use, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PRODUCTS } from '@/app/data/products';
import { useLang } from '@/components/LangContext';
import { useCart } from '@/components/CartContext';
import CommonLayout from '@/components/CommonLayout';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang } = useLang();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false); // Состояние для анимации кнопки
  
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return notFound();

  const currentIndex = PRODUCTS.findIndex(p => p.id === id);
  const nextProduct = PRODUCTS[currentIndex + 1] || PRODUCTS[0];
  const currentLang = lang as 'EN' | 'UA';

  const labels = {
    EN: { back: '← BACK', next: 'NEXT →', buy: 'ADD TO CART', added: 'ADDED', sold: 'SOLD OUT', select: 'SIZE' },
    UA: { back: '← НАЗАД', next: 'ДАЛІ →', buy: 'ДОДАТИ', added: 'ДОДАНО', sold: 'РОЗПРОДАНО', select: 'РОЗМІР' }
  };

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) return;
    addToCart({ id: product.id, title: product.title, size: selectedSize || 'OS', price: product.price });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000); // Кнопка вернется в исходное состояние через 2 сек
  };

  return (
    <CommonLayout>
      <div className="max-w-6xl mx-auto mt-20 px-4 mb-20">
        <div className="flex justify-between items-center mb-8 uppercase text-[10px] tracking-widest font-bold">
          <Link href="/shop" className="hover:text-gray-500">{labels[currentLang].back}</Link>
          <Link href={`/shop/${nextProduct.id}`} className="hover:text-gray-500">{labels[currentLang].next}</Link>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2 aspect-square bg-gray-100 flex items-center justify-center border" />
          <div className="w-full md:w-1/2 flex flex-col">
            <h1 className="text-3xl font-bold uppercase">{product.title}</h1>
            <p className="text-xl mt-4 font-bold">{product.price}</p>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm uppercase text-gray-700">{product.description}</p>
              {product.sizes.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-[10px] font-bold uppercase text-gray-400">{labels[currentLang].select}</h3>
                  <div className="flex gap-2 mt-2">
                    {product.sizes.map(size => (
                      <button key={size} onClick={() => setSelectedSize(size)} 
                        className={`border px-4 py-2 text-xs font-bold uppercase ${selectedSize === size ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button 
                onClick={handleAddToCart}
                className={`mt-10 px-12 py-4 uppercase font-bold text-sm tracking-widest transition-all 
                  ${isAdded ? 'bg-red-600 text-white' : 'bg-black text-white'}
                  ${product.status === 'soldout' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                disabled={product.status === 'soldout' || isAdded}
              >
                {product.status === 'soldout' ? labels[currentLang].sold : (isAdded ? labels[currentLang].added : labels[currentLang].buy)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}