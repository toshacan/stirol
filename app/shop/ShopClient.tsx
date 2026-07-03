'use client';
import { useState } from 'react';
import Link from 'next/link'; 
import CommonLayout from '@/components/CommonLayout';
import { useLang } from '@/components/LangContext';

export default function ShopClient({ initialProducts, initialCategories }: { initialProducts: any[], initialCategories: any[] }) {
  const { lang } = useLang(); 
  const [activeCategory, setActiveCategory] = useState('all');
  
  const [products] = useState(initialProducts);
  const [categories] = useState(initialCategories);

  const currentLang = lang as 'EN' | 'UA';
  
  const uiText = {
    EN: { soldout: 'SOLD OUT', comingSoon: 'COMING SOON', all: 'all' },
    UA: { soldout: 'РОЗПРОДАНО', comingSoon: 'СКОРО', all: 'все' }
  };

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <CommonLayout>
      <div className="w-full flex flex-col md:flex-row flex-grow mt-6 md:mt-10 gap-8 items-start mb-32 px-4 relative">
        
        <nav className="w-full md:w-48 flex flex-row md:flex-col flex-wrap gap-x-4 gap-y-1 text-[11px] uppercase tracking-wider text-left border-b md:border-b-0 pb-4 md:pb-0 border-gray-200 md:fixed md:top-[180px] z-10">
          <button 
            onClick={() => setActiveCategory('all')} 
            className={`block py-0.5 transition-colors text-left font-bold ${activeCategory === 'all' ? 'text-black underline' : 'text-gray-400 hover:text-black'}`}
          >
            {uiText[currentLang].all}
          </button>

          {categories.map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat.id)} 
              className={`block py-0.5 transition-colors text-left font-bold ${activeCategory === cat.id ? 'text-black underline' : 'text-gray-400 hover:text-black'}`}
            >
              {currentLang === 'UA' ? cat.label_ua : cat.label_en}
            </button>
          ))}
        </nav>
        
        <div className="flex-grow w-full md:pl-56">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {filteredProducts.map((product) => {
              // Умная обработка: превращаем images в массив, если это вдруг строка
              const images = Array.isArray(product.images) 
                ? product.images 
                : (typeof product.images === 'string' ? product.images.split(',').map((s: string) => s.trim()) : []);

              return (
                <Link key={product.id} href={`/shop/${product.id}`} className="flex flex-col space-y-2 group cursor-pointer">
                  
                  <div className="aspect-square bg-transparent flex items-center justify-center relative overflow-hidden border border-transparent group-hover:border-gray-200 transition-all duration-300">
                    {images.length > 0 && (
                      <img 
                        src={images[0]} 
                        alt={product.title} 
                        draggable="false" 
                        className={`w-full h-full object-cover brightness-100 transition-opacity duration-300 ${
                          images.length > 1 ? 'group-hover:opacity-0' : ''
                        }`} 
                      />
                    )}

                    {images.length > 1 && (
                      <img 
                        src={images[1]} 
                        alt={`${product.title} back`} 
                        draggable="false" 
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                      />
                    )}
                    
                    {product.status && (product.status === 'soldout' || product.status === 'comingSoon') && (
                      <span className="absolute top-2 left-2 text-[9px] px-2 py-1 uppercase tracking-widest font-extrabold bg-blue-200 text-pink z-10">
                        {uiText[currentLang][product.status as 'soldout' | 'comingSoon']}
                      </span>
                    )}
                  </div>

                  <div className={`flex flex-col text-[10px] uppercase tracking-widest space-y-0.5 ${product.status === 'soldout' ? 'opacity-50' : ''}`}>
                    <span className="text-black font-bold tracking-wide group-hover:underline">{product.title}</span>
                    <span className="text-pink-500 font-sans font-bold tracking-widest">{product.price}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}