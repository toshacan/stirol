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
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return notFound();

  const currentIndex = PRODUCTS.findIndex(p => p.id === id);
  const nextProduct = PRODUCTS[currentIndex + 1] || PRODUCTS[0];
  const currentLang = (lang === 'UA' ? 'UA' : 'EN') as 'EN' | 'UA';

  const labels = {
    EN: { back: '← BACK', next: 'NEXT →', buy: 'ADD TO CART', added: 'ADDED', sold: 'SOLD OUT', select: 'SIZE', prev: 'PREV', nextImg: 'NEXT' },
    UA: { back: '← НАЗАД', next: 'ДАЛІ →', buy: 'ДОДАТИ', added: 'ДОДАНО', sold: 'РОЗПРОДАНО', select: 'РОЗМІР', prev: 'НАЗАД', nextImg: 'ДАЛІ' }
  };

  const changeImage = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) return;
    addToCart({ id: product.id, title: product.title, size: selectedSize || 'OS', price: product.price });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <CommonLayout>
      <main className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 h-auto">
        <nav className="flex justify-between items-center mb-8 uppercase text-[10px] tracking-widest font-bold">
          <Link href="/shop" className="hover:opacity-50">{labels[currentLang].back}</Link>
          <Link href={`/shop/${nextProduct.id}`} className="hover:opacity-50">{labels[currentLang].next}</Link>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Блок с картинкой */}
          <div className="flex flex-col gap-3">
            <div className="w-full aspect-square overflow-hidden">
               {product.images.length > 0 && (
                 <img 
                   src={product.images[currentImageIndex]} 
                   alt={product.title} 
                   draggable="false" 
                   className="w-full h-full object-cover transition-opacity duration-300" 
                 />
               )}
            </div>

            {/* Блок навигации под фото */}
            {product.images.length > 1 && (
              <div className="flex justify-between items-center text-[9px] uppercase tracking-widest font-bold text-gray-500">
                <button onClick={() => changeImage('prev')} className="hover:text-black">← {labels[currentLang].prev}</button>
                <span>{currentImageIndex + 1} / {product.images.length}</span>
                <button onClick={() => changeImage('next')} className="hover:text-black">{labels[currentLang].nextImg} →</button>
              </div>
            )}
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
                    <button key={size} onClick={() => setSelectedSize(size)} className={`border py-3 text-[10px] font-bold uppercase ${selectedSize === size ? 'bg-black text-white' : 'border-gray-200'}`}>{size}</button>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleAddToCart} className={`mt-10 w-full py-4 uppercase font-bold text-[10px] ${isAdded ? 'bg-pink-400 text-white' : 'bg-black text-white'}`} disabled={product.status === 'soldout' || isAdded}>
              {product.status === 'soldout' ? labels[currentLang].sold : (isAdded ? labels[currentLang].added : labels[currentLang].buy)}
            </button>
          </div>
        </div>
      </main>
    </CommonLayout>
  );
}