'use client';
import { useState } from 'react';
import Link from 'next/link'; 
import CommonLayout from '@/components/CommonLayout';
import { useLang } from '@/components/LangContext';
import { PRODUCTS } from '@/app/data/products';

export default function ShopPage() {
  const { lang } = useLang(); 
  const [activeCategory, setActiveCategory] = useState('all');
  const currentLang = lang as 'EN' | 'UA';

  const uiText = {
    EN: { limited: 'LIMITED', soldout: 'SOLD OUT', comingSoon: 'COMING SOON' },
    UA: { limited: 'ЛІМІТ', soldout: 'РОЗПРОДАНО', comingSoon: 'СКОРО' }
  };

  const categories = {
    EN: [{ id: 'all', label: 'all' }, { id: 'tshirts', label: 't-shirts' }, { id: 'hoodies', label: 'hoodies' }, { id: 'shoppers', label: 'shoppers' }],
    UA: [{ id: 'all', label: 'все' }, { id: 'tshirts', label: 'футболки' }, { id: 'hoodies', label: 'худі' }, { id: 'shoppers', label: 'шопери' }]
  };

  const filteredProducts = activeCategory === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <CommonLayout>
      <div className="w-full flex flex-col md:flex-row flex-grow mt-12 md:mt-16 gap-8 items-start mb-auto px-4">
        <nav className="w-full md:w-48 flex flex-row md:flex-col flex-wrap gap-x-4 gap-y-1 text-[11px] uppercase tracking-wider text-left border-b md:border-b-0 pb-4 md:pb-0 border-gray-200">
          {categories[currentLang].map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`block py-0.5 transition-colors text-left font-bold ${activeCategory === cat.id ? 'text-black underline' : 'text-gray-400 hover:text-black'}`}>
              {cat.label}
            </button>
          ))}
        </nav>
        
        <div className="flex-grow w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/shop/${product.id}`} className="flex flex-col space-y-2 group cursor-pointer">
                
                {/* Контейнер картинки: теперь всегда 100% яркость */}
                <div className="aspect-square bg-transparent flex items-center justify-center relative overflow-hidden">
                  {product.images.length > 0 && (
                    <img 
                      src={product.images[0]} 
                      alt={product.title} 
                      draggable="false" 
                      className="w-full h-full object-cover brightness-100" 
                    />
                  )}
                  {product.status !== 'comingSoon' && (
                    <span className={`absolute top-2 left-2 text-[8px] px-1 py-0.5 uppercase tracking-widest font-bold ${product.status === 'limited' ? 'bg-red-600 text-white' : 'border border-black text-black'}`}>
                      {uiText[currentLang][product.status as keyof typeof uiText.EN]}
                    </span>
                  )}
                </div>

                {/* Затемняем только текст, если товар продан */}
                <div className={`flex flex-col text-[10px] uppercase tracking-wider space-y-0.5 ${product.status === 'soldout' ? 'opacity-50' : ''}`}>
                  <span className="text-black font-bold">{product.title}</span>
                  <span className="text-gray-500 font-sans font-bold">{product.price}</span>
                </div>
                
              </Link>
            ))}
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}