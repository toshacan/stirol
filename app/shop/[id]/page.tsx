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

  const currentLang = (lang === 'UA' ? 'UA' : 'EN') as 'EN' | 'UA';

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
      {/* МЫ УБРАЛИ min-h-screen И flex-col, ЧТОБЫ СТРАНИЦА МОГЛА ТЯНУТЬСЯ ВНИЗ */}
      <main className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 h-auto">
        
        <nav className="flex justify-between items-center mb-8 uppercase text-[10px] tracking-widest font-bold">
          <Link href="/shop" className="hover:opacity-50">{labels[currentLang].back}</Link>
          <Link href={`/shop/${nextProduct.id}`} className="hover:opacity-50">{labels[currentLang].next}</Link>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          <div className="w-full">
            <div className="aspect-square bg-gray-100 flex items-center justify-center border w-full">
              <span className="text-[10px] text-gray-400 uppercase">IMAGE: {product.title}</span>
            </div>
          </div>

          <div className="flex flex-col w-full">
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter leading-none">{product.title}</h1>
            <p className="text-lg mt-3 font-bold">{product.price}</p>
            
            <div className="mt-6 py-4 border-t border-b border-gray-200">
              <p className="text-[11px] uppercase text-gray-700 leading-normal">{product.description}</p>
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-8">
                <h3 className="text-[9px] font-bold uppercase text-gray-400 mb-3">{labels[currentLang].select}</h3>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size: string) => (
                    <button 
                      key={size} 
                      onClick={() => setSelectedSize(size)}
                      className={`border py-3 text-[10px] font-bold uppercase transition-all 
                        ${selectedSize === size ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={handleAddToCart}
              className={`mt-10 w-full py-4 uppercase font-bold text-[10px] tracking-widest transition-all 
                ${isAdded ? 'bg-green-600 text-white' : 'bg-black text-white'}
                ${product.status === 'soldout' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-800'}`}
              disabled={product.status === 'soldout' || isAdded}
            >
              {product.status === 'soldout' ? labels[currentLang].sold : (isAdded ? labels[currentLang].added : labels[currentLang].buy)}
            </button>
          </div>
        </div>
      </main>
    </CommonLayout>
  );
}