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
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
  }, [isDrawerOpen]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      setDateStr(now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }));
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
    size: lang === 'EN' ? 'SIZE' : 'РОЗМІР',
    remove: lang === 'EN' ? 'REMOVE' : 'ВИДАЛИТИ'
  };

  return (
    <>
      <header className="w-full flex justify-between items-start text-[10px] tracking-widest uppercase text-gray-400 p-4">
        <div className="flex-1">
            <Link href="/" className="hover:text-black transition-colors font-bold text-black pt-1 block">{t.back}</Link>
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
            <button onClick={() => setIsDrawerOpen(true)} className="text-white font-extrabold text-[10px] bg-black border border-black px-3 py-1 mt-1 active:scale-95 duration-200">
              {t.cart} ({totalItemsCount})
            </button>
          )}
        </div>
      </header>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-[99999]">
          <div className="absolute inset-0 bg-black/10" onClick={() => setIsDrawerOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-full max-w-xs bg-white border-l border-black p-6 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-8 font-bold text-black uppercase tracking-widest text-[10px]">
              <span>{t.cart}</span>
              <button onClick={() => setIsDrawerOpen(false)}>{t.close} ✕</button>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-6">
              {cart.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-start border-b pb-4 text-[10px] tracking-widest uppercase">
                  <div className="flex flex-col space-y-1">
                    <Link href={`/shop/${item.id}`} onClick={() => setIsDrawerOpen(false)} className="font-bold text-black">{item.title}</Link>
                    <span className="text-gray-500">{t.size}: {item.size}</span>
                    <div className="flex items-center space-x-3 pt-2 text-black font-bold">
                      <div className="flex items-center space-x-2.5">
                        <button onClick={() => updateQuantity(idx, 'decrement')} className="hover:text-red-500">-</button>
                        <span className="bg-neutral-100 px-2 rounded font-mono text-[9px]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(idx, 'increment')} className="hover:text-green-500">+</button>
                      </div>
                      <span className="text-gray-300">|</span>
                      <button 
                        onClick={() => removeFromCart(idx)} 
                        className="text-gray-400 hover:text-black hover:bg-red-50 hover:border-red-200 border border-transparent rounded px-2 py-0.5 transition-all text-[10px] font-bold"
                      >
                        {t.remove}
                      </button>
                    </div>
                  </div>
                  <span className="font-bold text-black font-mono">{((parseFloat(item.price) || 0) * item.quantity)}€</span>
                </div>
              ))}
            </div>
            <Link href="/checkout" className="mt-6 w-full bg-black text-white py-4 text-center font-bold uppercase tracking-widest text-[10px]" onClick={() => setIsDrawerOpen(false)}>{t.checkout}</Link>
          </div>
        </div>
      )}
    </>
  );
}