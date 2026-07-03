'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/components/LangContext';
import { useCart } from '@/components/CartContext';
import CommonLayout from '@/components/CommonLayout';

interface ProductClientProps {
  product: any; 
  nextProduct: any;
  id: string;
}

export default function ProductClient({ product, nextProduct, id }: ProductClientProps) {
  const { lang } = useLang();
  const { addToCart } = useCart();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  
  const currentLang = (lang === 'UA' ? 'UA' : 'EN') as 'EN' | 'UA';

  const labels = {
    EN: { back: '← BACK', next: 'NEXT ITEM →', buy: 'ADD TO CART', added: 'ADDED', sold: 'SOLD OUT', selectSize: 'SIZE', selectColor: 'COLOR', prev: 'PREV', nextImg: 'NEXT' },
    UA: { back: '← НАЗАД', next: 'НАСТУПНА РІЧ →', buy: 'ДОДАТИ', added: 'ДОДАНО', sold: 'РОЗПРОДАНО', selectSize: 'РОЗМІР', selectColor: 'КОЛІР', prev: 'НАЗАД', nextImg: 'ДАЛІ' }
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

  const changeImage = (direction: 'prev' | 'next') => {
    if (!product.images || product.images.length === 0) return;
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const handleAddToCart = () => {
    if (isTotalSoldOut || isSizeRequiredButMissing) return;

    // ВАЖНО: находим остаток для конкретного размера
    const currentVariant = allVariants.find((v: any) => v.size === selectedSize);
    const stock = currentVariant ? Number(currentVariant.stock) : Number(product.stock ?? 99);

    addToCart({ 
      id: product.id, 
      title: displayTitle, 
      size: selectedSize || 'OS', 
      price: product.price,
      stock: stock // Передаем лимит в корзину
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const activeButtonStyles = 'bg-white text-black border-black scale-[1.01]'; 
  const defaultButtonStyles = 'bg-black text-white hover:bg-neutral-900 border-transparent';

  return (
    <CommonLayout>
      <main className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 h-auto">
        <nav className="flex justify-between items-center mb-8 uppercase text-[10px] tracking-widest font-bold">
          <Link href="/shop" className="hover:opacity-50">
            {labels[currentLang].back}
          </Link>
          {nextProduct && nextProduct.id ? (
            <Link href={`/shop/${nextProduct.id}`} className="hover:opacity-50">
              {labels[currentLang].next}
            </Link>
          ) : (
            <span className="text-neutral-500 opacity-20">{labels[currentLang].next}</span> 
          )}
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="flex flex-col gap-3">
            <div className="w-full aspect-square overflow-hidden bg-transparent">
               {product.images?.length > 0 && (
                 <img 
                   src={product.images[currentImageIndex]} 
                   alt={displayTitle} 
                   draggable="false" 
                   className="w-full h-full object-cover transition-opacity duration-300" 
                 />
               )}
            </div>

            {product.images?.length > 1 && (
              <div className="flex justify-between items-center text-[9px] uppercase tracking-widest font-bold text-gray-500">
                <button onClick={() => changeImage('prev')} className="hover:text-black">← {labels[currentLang].prev}</button>
                <span>{currentImageIndex + 1} / {product.images.length}</span>
                <button onClick={() => changeImage('next')} className="hover:text-black">{labels[currentLang].nextImg} →</button>
              </div>
            )}
          </div>

          <div className="flex flex-col w-full">
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter leading-none">{displayTitle}</h1>
            <p className="text-lg mt-3 font-bold">{product.price}</p>
            
            <div className="mt-6 py-4 border-t border-b border-gray-200">
              <p className="text-[11px] uppercase text-gray-700 leading-normal">{displayDescription}</p>
            </div>

            {colors.length > 0 && (
              <div className="mt-6">
                <h3 className="text-[9px] font-bold uppercase text-gray-400 mb-3">{labels[currentLang].selectColor}</h3>
                <div className="flex gap-3">
                  {colors.map((variant: any) => {
                    const cleanId = variant.id ? variant.id.trim() : '';
                    const currentCleanId = id ? id.trim() : '';
                    return (
                      <Link 
                        key={variant.id} 
                        href={`/shop/${cleanId}`}
                        title={variant.name}
                        className={`w-6 h-6 rounded-full border transition-all ${cleanId === currentCleanId ? 'border-black scale-110 ring-1 ring-black' : 'border-gray-300 hover:scale-105'}`}
                        style={{ backgroundColor: variant.hex }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {allVariants.length > 0 && !isTotalSoldOut && (
              <div className="mt-6">
                <h3 className="text-[9px] font-bold uppercase text-gray-400 mb-3">{labels[currentLang].selectSize}</h3>
                <div className="grid grid-cols-4 gap-2">
                  {allVariants.map((v: any) => {
                    const isOutOfStock = Number(v.stock) <= 0;
                    return (
                      <button 
                        key={v.size} 
                        disabled={isOutOfStock} 
                        onClick={() => setSelectedSize(v.size)} 
                        className={`border py-3 text-[10px] font-bold uppercase transition-all
                          ${isOutOfStock 
                            ? 'border-neutral-200 bg-neutral-50 text-neutral-400 line-through opacity-40 cursor-not-allowed' 
                            : selectedSize === v.size 
                              ? 'bg-black text-white border-black' 
                              : 'border-gray-200 text-black hover:border-black'
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
    </CommonLayout>
  );
}