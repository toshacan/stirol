'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLang } from './LangContext';
import { useCart } from './CartContext';

export default function Header() {
  const { lang, changeLang } = useLang();
  const { cart, removeFromCart } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Состояния для живого времени
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  // Обновление даты и времени каждую секунду
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      
      const dateOptions: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      };

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
    remove: lang === 'EN' ? 'REMOVE' : 'ВИДАЛИТИ',
    size: lang === 'EN' ? 'SIZE' : 'РОЗМІР'
  };

  return (
    <header className="w-full flex justify-between items-start text-[10px] tracking-widest uppercase text-gray-400 z-10 p-4">
      {/* ЛЕВАЯ ЧАСТЬ */}
      <div className="flex-1">
        <Link href="/" className="hover:text-black transition-colors font-bold text-black pt-1 block">
          {t.back}
        </Link>
      </div>
      
      {/* ЦЕНТР */}
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

      {/* ПРАВАЯ ЧАСТЬ */}
      <div className="flex-1 flex flex-col items-end gap-1.5 text-right">
        <div className="flex flex-col text-[10px] font-bold text-black tracking-widest leading-tight">
          <span>{dateStr || '01/07/2026'}</span>
          <span className="font-mono text-gray-500 text-[9px]">{timeStr || '12:00:00'}</span>
        </div>
        
        {cart.length > 0 && (
          <button 
            key={cart.length} // Запускает микро-импульс при добавлении товара
            onClick={() => setIsDrawerOpen(true)}
            className="text-white font-extrabold text-[10px] bg-black border border-black px-3 py-1 transition-all w-min whitespace-nowrap mt-1 active:scale-95 duration-200 animate-[pulse_0.3s_ease-in-out]"
          >
            {t.cart} ({cart.length})
          </button>
        )}
      </div>

      {/* КОРЗИНА (DRAWER) */}
      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/10 z-40" onClick={() => setIsDrawerOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-xs bg-white border-l border-black z-50 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8 font-bold text-black">
              <span>{t.cart}</span>
              <button onClick={() => setIsDrawerOpen(false)}>{t.close} ✕</button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-6">
              {cart.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-start border-b pb-2 text-[10px]">
                  <div className="flex flex-col">
                    {/* НАЗВАНИЕ КЛИКАБЕЛЬНО И ВЕДЕТ НА СТРАНИЦУ ТОВАРA */}
                    <Link 
                      href={`/shop/${item.id}`} 
                      onClick={() => setIsDrawerOpen(false)}
                      className="font-bold text-black hover:underline cursor-pointer"
                    >
                      {item.title}
                    </Link>
                    <span className="text-gray-500">{t.size}: {item.size}</span>
                    <button 
                      onClick={() => removeFromCart(idx)} 
                      className="text-gray-400 hover:text-red-600 mt-1 text-[8px] uppercase font-bold text-left"
                    >
                      {t.remove}
                    </button>
                  </div>
                  <span className="font-bold text-black">{item.price}</span>
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