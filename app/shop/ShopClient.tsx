'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Импортируем роутер для плавного перехода
import Link from 'next/link';
import Image from 'next/image';
import CommonLayout from '@/components/CommonLayout';
import { useLang } from '@/components/LangContext';

export default function ShopClient({ initialProducts, initialCategories }: { initialProducts: any[], initialCategories: any[] }) {
  const { lang } = useLang(); 
  const router = useRouter(); // Инициализируем роутер
  const [activeCategory, setActiveCategory] = useState('all');
  const [isMounted, setIsMounted] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false); // Состояние плавного затухания перед уходом
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Микрозадержка в 50мс заставляет браузер зафиксировать opacity-0, делая появление 진짜 плавным
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Функция перехвата клика для анимации затухания (Fade-out)
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault(); // Останавливаем мгновенный переход Next.js
    setIsLeaving(true);  // Включаем затухание (opacity-0)
    setTimeout(() => {
      router.push(href); // Переходим на страницу только после окончания анимации
    }, 600); // Эту цифру (время ожидания) меняй вместе с duration-600 в верстке ниже
  };

  // УМНАЯ СОРТИРОВКА: Товары с позицией 1, 2, 3 идут в начало, а нули (0) отправляются в конец!
  const sortedProducts = [...initialProducts].sort((a, b) => {
    const posA = Number(a.position ?? 0);
    const posB = Number(b.position ?? 0);
    
    // Если у одного товара позиция задана (больше 0), а у другого 0 -> заданный идет первым!
    if (posA > 0 && posB === 0) return -1;
    if (posA === 0 && posB > 0) return 1;
    
    // В остальных случаях сортируем по порядку (от 1 и далее, либо нули между собой)
    return posA - posB;
  });

  const currentLang = (lang === 'UA' ? 'UA' : 'EN') as 'EN' | 'UA';
  
  const uiText = {
    EN: { soldout: 'SOLD OUT', comingSoon: 'COMING SOON', all: 'ALL' },
    UA: { soldout: 'РОЗПРОДАНО', comingSoon: 'СКОРО', all: 'ВСІ' }
  };

  const filteredProducts = activeCategory === 'all' 
    ? sortedProducts 
    : sortedProducts.filter(p => p.category === activeCategory);

  return (
    <CommonLayout>
      {/* ЗДЕСЬ НАСТРОЙКА АНИМАЦИИ СТРАНИЦЫ КАТАЛОГА:
        duration-600 — это скорость появления и затухания всей страницы (600мс). 
        Ты можешь менять её, например, на duration-1000 (1 секунда) или duration-300 (очень быстро).
        Если меняешь эту цифру, меняй и задержку в функции handleNavigation выше!
      */}
      <div className={`w-full flex flex-col md:flex-row flex-grow mt-6 md:mt-10 gap-8 items-start mb-32 px-4 relative transition-opacity duration-600 ease-in-out ${
        isMounted && !isLeaving ? 'opacity-100' : 'opacity-0'
      }`}>
        
        <nav className="w-full md:w-48 flex flex-row md:flex-col flex-wrap gap-x-4 gap-y-1 text-[11px] uppercase tracking-wider text-left border-b md:border-b-0 pb-4 md:pb-0 border-gray-200 md:fixed md:top-[180px] z-10">
          <button 
            onClick={() => setActiveCategory('all')} 
            className={`block py-0.5 transition-colors text-left font-bold ${activeCategory === 'all' ? 'text-black underline' : 'text-gray-400 hover:text-black'}`}
          >
            {uiText[currentLang].all}
          </button>

          {initialCategories.map((cat) => (
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
              const images = Array.isArray(product.images) 
                ? product.images 
                : (typeof product.images === 'string' ? product.images.split(',').map((s: string) => s.trim()) : []);

              return (
                <Link 
                  key={product.id} 
                  href={`/shop/${product.id}`} 
                  onClick={(e) => handleNavigation(e, `/shop/${product.id}`)} // Перехватываем клик для плавного исчезновения
                  className="flex flex-col space-y-2 group cursor-pointer"
                >
                  
                  <div className="aspect-square bg-transparent flex items-center justify-center relative overflow-hidden border border-transparent group-hover:border-gray-200 transition-all duration-300">
                    {images.length > 0 && (
                      <Image
                        src={images[0]}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        draggable={false}
                        onLoad={() => setLoadedImages(prev => ({ ...prev, [product.id]: true }))}
                        /* duration-700 — скорость, с которой сами картинки мягко «выплывают» при первой загрузке сайта */
                        className={`object-cover brightness-100 transition-opacity duration-700 ease-in-out ${
                          loadedImages[product.id] ? 'opacity-100' : 'opacity-0'
                        } ${images.length > 1 ? 'group-hover:opacity-0' : ''}`}
                      />
                    )}

                    {images.length > 1 && (
                      <Image
                        src={images[1]}
                        alt={`${product.title} back`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        draggable={false}
                        className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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