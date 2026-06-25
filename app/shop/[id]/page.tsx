'use client';
import { use, useState } from 'react';
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
  const [isAdded, setIsAdded] = useState(false);
  
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
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <CommonLayout>
      {/* Главный контейнер с отступами для мобильных */}
      <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-20">
        
        {/* Навигация */}
        <div className="flex justify-between items-center mb-6 uppercase text-[10px] tracking-widest font-bold">
          <Link href="/shop" className="hover:text-gray-500">{labels[currentLang].back}</Link>
          <Link href={`/shop/${nextProduct.id}`} className="hover:text-gray-500">{labels[currentLang].next}</Link>
        </div>

        {/* Основной блок: изображение + контент */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Изображение */}
          <div className="w-full md:w-1/2">
            <div className="aspect-square bg-gray-100 flex items-center justify-center border w-full">
              <span className="text-gray-400 text-[10px]">IMAGE: {product.title}</span>
            </div>
          </div>

          {/* Контент: Название, цена, описание, размеры, кнопка */}
          <div className="w-full md:w-1/2 flex flex-col">
            <h1 className="text-2xl font-bold uppercase tracking-tight">{product.title}</h1>
            <p className="text-lg mt-2 font-bold">{product.price}</p>
            
            <div className="mt-6 py-6 border-t border-b border-gray-200">
              <p className="text-sm uppercase text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Размеры */}
            {product.sizes.length > 0 && (
              <div className="mt-6">
                <h3 className="text-[10px] font-bold uppercase text-gray-400 mb-2">{labels[currentLang].select}</h3>
                <div className="flex gap-2">
                  {product.sizes.map(size => (
                    <button 
                      key={size} 
                      onClick={() => setSelectedSize(size)}
                      className={`border px-6 py-3 text-xs font-bold uppercase transition-all 
                        ${selectedSize === size ? 'bg-black text-white' : 'hover:border-black'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Кнопка */}
            <button 
              onClick={handleAddToCart}
              className={`mt-8 w-full py-4 uppercase font-bold text-sm tracking-widest transition-all 
                ${isAdded ? 'bg-green-600 text-white' : 'bg-black text-white'}
                ${product.status === 'soldout' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-800'}`}
              disabled={product.status === 'soldout' || isAdded}
            >
              {product.status === 'soldout' ? labels[currentLang].sold : (isAdded ? labels[currentLang].added : labels[currentLang].buy)}
            </button>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}