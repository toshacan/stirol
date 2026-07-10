'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/components/LangContext';
import { useCart } from '@/components/CartContext';
import CommonLayout from '@/components/CommonLayout';
import { formatPrice } from '@/lib/formatPrice';

interface ProductClientProps {
  product: any; 
  nextProduct: any;
  id: string;
}

export default function ProductClient({ product, nextProduct, id }: ProductClientProps) {
  const { lang } = useLang();
  const { addToCart } = useCart();
  const router = useRouter(); 
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false); 
  
  const currentLang = (lang === 'UA' ? 'UA' : 'EN') as 'EN' | 'UA';

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsLeaving(true);
    setTimeout(() => {
      router.push(href);
    }, 600); 
  };

  // Жесткий сброс индексов и триггеров при смене ID (цвета товара)
  useEffect(() => {
    setCurrentImageIndex(0);
    setSelectedSize(null);
    setIsLeaving(false); 
  }, [id]);

  const images = Array.isArray(product.images) 
    ? product.images 
    : (typeof product.images === 'string' ? product.images.split(',').map((s: string) => s.trim()) : []);

  const labels = {
    EN: { back: '← BACK', next: 'NEXT ITEM →', buy: 'ADD TO CART', added: 'ADDED', sold: 'SOLD OUT', selectSize: 'SIZE', selectColor: 'COLOR' },
    UA: { back: '← НАЗАД', next: 'НАСТУПНА РІЧ →', buy: 'ДОДАТИ', added: 'ДОДАНО', sold: 'РОЗПРОДАНО', selectSize: 'РОЗМІР', selectColor: 'КОЛІР' }
  };

  const displayTitle = product.title;
  const displayDescription = currentLang === 'UA' ? (product.description_ua || product.description) : product.description;

  const allVariants = product.product_variants || product.variants || [];
  const colors = product.color_variants || product.colorVariants || [];

  const availableVariants = allVariants.filter((v: any) => Number(v.stock) > 0);

  const isTotalSoldOut = 
    product.status === 'soldout' || 
    (allVariants.length > 0 && availableVariants.length === 0) ||
    (allVariants.length === 0 && Number(product.stock ?? 0) <= 0);

  const isSizeRequiredButMissing = allVariants.length > 0 && !selectedSize;

  const handleAddToCart = () => {
    if (isTotalSoldOut || isSizeRequiredButMissing) return;

    const currentVariant = allVariants.find((v: any) => v.size === selectedSize);
    const stock = currentVariant ? Number(currentVariant.stock) : Number(product.stock ?? 99);

    addToCart({ 
      id: product.id, 
      title: displayTitle, 
      size: selectedSize || 'OS', 
      price: product.price,
      stock: stock
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const activeButtonStyles = 'bg-white text-black border-black scale-[1.01]'; 
  const defaultButtonStyles = 'bg-black text-white hover:bg-neutral-900 border-transparent';

  return (
    <CommonLayout>
      <div className={`transition-opacity duration-600 ease-in-out ${
        isMounted && !isLeaving ? 'opacity-100' : 'opacity-0'
      }`}>
        <main className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 h-auto">
          {/* Навигация */}
          <nav className="flex justify-between items-center mb-8 uppercase text-[10px] tracking-widest font-bold">
            <Link 
              href="/shop" 
              onClick={(e) => handleNavigation(e, '/shop')} 
              className="hover:opacity-50"
            >
              {labels[currentLang].back}
            </Link>
            
            {nextProduct && nextProduct.id ? (
              <Link 
                href={`/shop/${nextProduct.id}`} 
                onClick={(e) => handleNavigation(e, `/shop/${nextProduct.id}`)} 
                className="hover:opacity-50"
              >
                {labels[currentLang].next}
              </Link>
            ) : (
              <span className="text-gray-300 cursor-default select-none">{labels[currentLang].next}</span> 
            )}
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Фото-блок */}
            <div className="w-full aspect-square overflow-hidden bg-transparent relative">
              {images.length > 0 && (
                <Image
                  // Уникальный ключ гарантирует, что Next.js мгновенно подменит дескриптор картинки
                  key={`${id}-${currentImageIndex}`} 
                  src={images[currentImageIndex]}
                  alt={displayTitle}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  draggable={false}
                  // МЫ ПОЛНОСТЬЮ УБРАЛИ КОВАРНЫЙ OPACITY-0. Картинка теперь железно видима всегда.
                  className="object-cover"
                />
              )}
            </div>

            {/* Инфо-блок */}
            <div className="flex flex-col w-full">
              <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter leading-none">{displayTitle}</h1>
              <p className="text-lg mt-3 font-bold">{formatPrice(product.price)}</p>
              
              {/* Описание */}
              <div className="mt-6">
                <p className="text-[11px] uppercase text-gray-700 leading-normal">{displayDescription}</p>
              </div>

              {/* Миниатюры */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-6">
                  {images.map((img: string, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-12 h-12 flex-shrink-0 border transition-all relative ${currentImageIndex === idx ? 'border-black' : 'border-gray-200 hover:border-gray-400'}`}
                    >
                      <Image src={img} alt="" fill sizes="48px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Цвета */}
              {colors.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-[9px] font-bold uppercase text-gray-400 mb-2.5">{labels[currentLang].selectColor}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {colors.map((variant: any) => {
                      const cleanId = variant.id ? variant.id.trim() : '';
                      const currentCleanId = id ? id.trim() : '';
                      const isActive = cleanId === currentCleanId;

                      return (
                        <Link
                          key={variant.id}
                          href={`/shop/${cleanId}`}
                          onClick={(e) => {
                            if (!isActive) handleNavigation(e, `/shop/${cleanId}`);
                          }}
                          title={variant.name}
                          aria-label={variant.name}
                          style={{ display: 'inline-block', padding: isActive ? '3px' : '0px' }}
                        >
                          <span
                            style={{
                              display: 'block',
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: variant.hex || '#cccccc',
                              border: isActive ? '2px solid #000' : '1px solid rgba(0,0,0,0.2)',
                              boxSizing: 'border-box',
                              transition: 'border-color 0.15s, transform 0.15s',
                            }}
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Размеры */}
              {allVariants.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-[9px] font-bold uppercase text-gray-400 mb-2.5">{labels[currentLang].selectSize}</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {allVariants.map((v: any, index: number) => {
                      const isOutOfStock = Number(v.stock) <= 0;
                      return (
                        <button 
                          key={`${v.size}-${index}`} 
                          disabled={isOutOfStock} 
                          onClick={() => setSelectedSize(v.size)} 
                          className={`border py-3 text-[10px] font-bold uppercase transition-all
                            ${isOutOfStock 
                              ? 'border-neutral-200 bg-neutral-50 text-neutral-400 line-through opacity-30 cursor-not-allowed' 
                              : selectedSize === v.size 
                                ? 'bg-black text-white border-black' 
                                : 'border-gray-200 text-black hover:border-black bg-white'
                            }
                          `}
                        >
                          {v.size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Кнопка купить */}
              <button 
                onClick={handleAddToCart} 
                className={`mt-10 w-full py-4 uppercase font-bold text-[10px] tracking-widest transition-all duration-300 border transform active:scale-[0.99]
                  ${isTotalSoldOut ? 'bg-neutral-200 text-neutral-400 border-transparent cursor-not-allowed' : ''}
                  ${isSizeRequiredButMissing ? 'bg-neutral-100 text-neutral-500 border-neutral-300' : (isAdded ? activeButtonStyles : defaultButtonStyles)}
                `} 
                disabled={isTotalSoldOut || isAdded}
              >
                {isTotalSoldOut 
                  ? labels[currentLang].sold 
                  : isAdded 
                    ? `✓ ${labels[currentLang].added}` 
                    : isSizeRequiredButMissing 
                      ? (currentLang === 'UA' ? 'ОБЕРІТЬ РОЗМІР' : 'SELECT SIZE') 
                      : labels[currentLang].buy
                }
              </button>
            </div>
          </div>
        </main>
      </div>
    </CommonLayout>
  );
}