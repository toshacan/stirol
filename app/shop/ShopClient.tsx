'use client';
import { useState } from 'react';
import Link from 'next/link'; 
import CommonLayout from '@/components/CommonLayout';
import { useLang } from '@/components/LangContext';
import { PRODUCTS } from '@/app/data/products';

export default function ShopClient() {
  const { lang } = useLang(); 
  const [activeCategory, setActiveCategory] = useState('all');
  const currentLang = lang as 'EN' | 'UA';
  
  const uiText = {
    EN: { soldout: 'SOLD OUT', comingSoon: 'COMING SOON' },
    UA: { soldout: 'РОЗПРОДАНО', comingSoon: 'СКОРО' }
  };

  const categories = {
    EN: [{ id: 'all', label: 'all' }, { id: 'tshirts', label: 't-shirts' }, { id: 'hoodies', label: 'hoodies' }, { id: 'shoppers', label: 'shoppers' }],
    UA: [{ id: 'all', label: 'все' }, { id: 'tshirts', label: 'футболки' }, { id: 'hoodies', label: 'худі' }, { id: 'shoppers', label: 'шопери' }]
  };

  const filteredProducts = activeCategory === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <CommonLayout>
      <div className="w-full flex flex-col md:flex-row flex-grow mt-6 md:mt-10 gap-8 items-start mb-32 px-4 relative">
        
        {/* Боковое меню зафиксировано на десктопе через md:fixed */}
        <nav className="w-full md:w-48 flex flex-row md:flex-col flex-wrap gap-x-4 gap-y-1 text-[11px] uppercase tracking-wider text-left border-b md:border-b-0 pb-4 md:pb-0 border-gray-200 md:fixed md:top-[180px] z-10">
          {categories[currentLang].map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat.id)} 
              className={`block py-0.5 transition-colors text-left font-bold ${activeCategory === cat.id ? 'text-black underline' : 'text-gray-400 hover:text-black'}`}
            >
              {cat.label}
            </button>
          ))}
        </nav>
        
        {/* Сетка товаров со смещением вправо для компенсации fixed меню */}
        <div className="flex-grow w-full md:pl-56">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/shop/${product.id}`} className="flex flex-col space-y-2 group cursor-pointer">
                
                {/* Контейнер картинки */}
                <div className="aspect-square bg-transparent flex items-center justify-center relative overflow-hidden border border-transparent group-hover:border-gray-200 transition-all duration-300">
                  
                  {/* ПЕРВАЯ КАРТИНКА (Лицо) */}
                  {product.images.length > 0 && (
                    <img 
                      src={product.images[0]} 
                      alt={product.title} 
                      draggable="false" 
                      className={`w-full h-full object-cover brightness-100 transition-opacity duration-300 ${
                        product.images.length > 1 ? 'group-hover:opacity-0' : ''
                      }`} 
                    />
                  )}

                  {/* ВТОРАЯ КАРТИНКА (Спина) */}
                  {product.images.length > 1 && (
                    <img 
                      src={product.images[1]} 
                      alt={`${product.title} back`} 
                      draggable="false" 
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                    />
                  )}
                  
                  {/* Статус плашка */}
                  {product.status && (product.status === 'soldout' || product.status === 'comingSoon') && (
                    <span className="absolute top-2 left-2 text-[9px] px-2 py-1 uppercase tracking-widest font-extrabold bg-blue-200 text-pink z-10">
                      {uiText[currentLang][product.status as keyof typeof uiText.EN]}
                    </span>
                  )}
                </div>

                {/* Инфо товара */}
                <div className={`flex flex-col text-[10px] uppercase tracking-widest space-y-0.5 ${product.status === 'soldout' ? 'opacity-50' : ''}`}>
                  <span className="text-black font-bold tracking-wide group-hover:underline">{product.title}</span>
                  {product.price && <span className="text-pink-500 font-sans font-bold tracking-widest">{product.price}</span>}
                </div>
                
              </Link>
            ))}
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}