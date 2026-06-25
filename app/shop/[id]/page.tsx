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

  const labels = {
    EN: { back: '← BACK', buy: 'ADD TO CART', added: 'ADDED', select: 'SIZE' },
    UA: { back: '← НАЗАД', buy: 'ДОДАТИ', added: 'ДОДАНО', select: 'РОЗМІР' }
  };

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) return;
    addToCart({ id: product.id, title: product.title, size: selectedSize || 'OS', price: product.price });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <CommonLayout>
      {/* Никаких min-h-screen, только естественный поток контента */}
      <div className="w-full px-4 pt-4 pb-20">
        
        {/* Картинка */}
        <div className="w-full aspect-square bg-gray-100 flex items-center justify-center border mb-6">
          <span className="text-[10px] text-gray-400">IMAGE: {product.title}</span>
        </div>

        {/* Текст */}
        <h1 className="text-xl font-bold uppercase">{product.title}</h1>
        <p className="text-md font-bold mb-4">{product.price}</p>
        <p className="text-[11px] text-gray-600 mb-6">{product.description}</p>

        {/* Размеры - простые кнопки в ряд */}
        {product.sizes.length > 0 && (
          <div className="mb-6">
            <p className="text-[9px] font-bold uppercase text-gray-400 mb-2">{labels[lang].select}</p>
            <div className="flex gap-2">
              {product.sizes.map(size => (
                <button 
                  key={size} 
                  onClick={() => setSelectedSize(size)}
                  className={`border px-6 py-3 text-[10px] font-bold uppercase ${selectedSize === size ? 'bg-black text-white' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Кнопка купить - самая важная часть */}
        <button 
          onClick={handleAddToCart}
          className={`w-full py-4 uppercase font-bold text-[10px] ${isAdded ? 'bg-green-600 text-white' : 'bg-black text-white'}`}
        >
          {isAdded ? labels[lang].added : labels[lang].buy}
        </button>
      </div>
    </CommonLayout>
  );
}