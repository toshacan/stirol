'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLang } from './LangContext';
import { useCart } from './CartContext';

export default function Header() {
  const { lang, changeLang } = useLang();
  const { cart, removeFromCart, updateQuantity, totalItemsCount } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };

      setTimeStr(now.toLocaleTimeString('en-GB', timeOptions));
      setDateStr(now.toLocaleDateString('en-GB', dateOptions));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  
  const t = {
    back: lang === 'EN' ? '← BACK TO MAIN' : '← НАЗАД НА ГОЛОВНУ',
    cart: lang === 'EN' ? 'CART' : 'КОШИК',
    close: lang === 'EN' ? 'CLOSE' : 'ЗАКРИТИ',
    checkout: lang === 'EN' ? 'CHECKOUT' : 'ОФОРМИТИ',
    size: lang === 'EN' ? 'SIZE' : 'РОЗМІР'
  };

  const getItemSubtotal = (item: any) => {
    const priceStr = typeof item.price === 'string' ? item.price : String(item.price || '0');
    const parsed = parseFloat(priceStr.replace('€', '').trim());
    return (isNaN(parsed) ? 0 : parsed) * (item.quantity || 1);
  };

  return (
    <header className="w-full flex justify-between items-start text-[10px] tracking-widest uppercase text-gray-400 z-10 p-4">
      <div className="flex-1">
        <Link href="/" className="hover:text-black transition-colors font-bold text-black pt-1 block">
          {t.back}
        </Link>
      </div>
      
      <div className="flex flex-col items-center space-y-1 w-32 flex-shrink-0">
        <Link href="/" className="block w-32 h-10 relative">
          <img src="/logo-heavy.png" alt="STIROL" className="w-full h-full object-contain invert" />
        </Link>
        <div className="flex space-x-1 text-[12px] font-bold pt-1">
          <button onClick={() => changeLang('EN')} className={lang === 'EN' ? 'text-black underline' : ''}>EN</button>
          <span className="text-gray-300">/</span>
          <button onClick={() => changeLang('UA')} className={lang === 'UA' ? 'text-black underline' : ''}>UA</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-end gap-1.5 text-right">
        <div className="flex flex-col text-[10px] font-bold text-black tracking-widest leading-tight">
          <span>{dateStr || '01/07/2026'}</span>
          <span className="font-mono text-gray-500 text-[9px]">{timeStr || '12:00:00'}</span>
        </div>
        
        {totalItemsCount > 0 && (
          <button 
            key={totalItemsCount} 
            onClick={() => setIsDrawerOpen(true)}
            className="text-white font-extrabold text-[10px] bg-black border border-black px-3 py-1 transition-all w-min whitespace-nowrap mt-1 active:scale-95 duration-200 animate-[pulse_0.3s_ease-in-out]"
          >
            {t.cart} ({totalItemsCount})
          </button>
        )}
      </div>

      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/10 z-[9998]" onClick={() => setIsDrawerOpen(false)} />
          
          <div className="fixed top-0 right-0 h-full w-full max-w-xs bg-white border-l border-black z-[9999] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8 font-bold text-black">
              <span>{t.cart}</span>
              <button onClick={() => setIsDrawerOpen(false)}>{t.close} ✕</button>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-6">
              {cart.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-start border-b pb-4 text-[10px]">
                  <div className="flex flex-col space-y-1">
                    <Link 
                      href={`/shop/${item.id}`} 
                      onClick={() => setIsDrawerOpen(false)}
                      className="font-bold text-black hover:underline cursor-pointer"
                    >
                      {item.title}
                    </Link>
                    <span className="text-gray-500">{t.size}: {item.size}</span>
                    
                    {/* ОБЪЕДИНЕННЫЙ БЛОК УПРАВЛЕНИЯ */}
                    <div className="flex items-center space-x-3 pt-2 text-black select-none font-bold">
                      <div className="flex items-center space-x-2.5">
                        <button 
                          onClick={() => updateQuantity(idx, 'decrement')} 
                          className="hover:text-red-500 font-mono text-xs px-1"
                        >
                          -
                        </button>
                        <span className="bg-neutral-100 px-2 py-0.5 rounded font-mono text-[9px]">
                          {item.quantity || 1}
                        </span>
                        <button 
                          onClick={() => updateQuantity(idx, 'increment')} 
                          className="hover:text-green-500 font-mono text-xs px-1"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-gray-300">|</span>

                      {/* КНОПКА УДАЛЕНИЯ РЯДОМ */}
                      <button 
                        onClick={() => removeFromCart(idx)} 
                        className="text-gray-400 hover:text-red-600 font-sans text-[11px] font-bold px-1 transition-colors"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  
                  <span className="font-bold text-black whitespace-nowrap">
                    {getItemSubtotal(item)}€
                  </span>
                </div>
              ))}
            </div>
            
            <Link 
              href="/checkout" 
              className="mt-6 w-full bg-black text-white py-4 text-center font-bold text-[10px] tracking-widest"
              onClick={() => setIsDrawerOpen(false)}
            >
              {t.checkout}
            </Link>
          </div>
        </>
      )}
    </header>
  );
}