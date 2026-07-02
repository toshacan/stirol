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
      {/* HEADER */}
      <header className="w-full flex items-center justify-between px-4 py-3 bg-neutral-100 md:bg-transparent transition-colors duration-300">
        
        {/* LEFT: Back Button */}
        <div className="flex-1">
          <Link href="/" className="text-[10px] tracking-widest uppercase font-bold text-black hover:opacity-60 transition-opacity">
            <span className="hidden md:inline">{t.back}</span>
            <span className="md:hidden text-lg leading-none">←</span>
          </Link>
        </div>
        
        {/* CENTER: Logo (Inverted) */}
        <div className="flex-shrink-0 mx-4">
          <Link href="/shop" className="block w-23 md:w-32 h-8 relative hover:opacity-80 transition-opacity">
            <img src="/logo-heavy.png" alt="STIROL" className="w-full h-full object-contain invert" />
          </Link>
        </div>

        {/* RIGHT: Meta Info & Cart */}
        <div className="flex-1 flex justify-end items-center gap-4">
          
          {/* Desktop Only: Date/Time + Lang */}
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-[9px] font-mono text-gray-500">{dateStr} {timeStr}</span>
            <div className="flex space-x-1 text-[9px] font-bold mt-0.5">
              <button onClick={() => changeLang('EN')} className={lang === 'EN' ? 'text-black underline' : 'text-gray-400'}>EN</button>
              <span>/</span>
              <button onClick={() => changeLang('UA')} className={lang === 'UA' ? 'text-black underline' : 'text-gray-400'}>UA</button>
            </div>
          </div>

          {/* Mobile Right: Lang + Cart (if items > 0) */}
          <div className="md:hidden flex items-center gap-3">
             <div className="flex gap-1 text-[9px] font-bold">
                <button onClick={() => changeLang('EN')} className={lang === 'EN' ? 'text-black' : 'text-gray-400'}>EN</button>
                <span className="text-gray-300">/</span>
                <button onClick={() => changeLang('UA')} className={lang === 'UA' ? 'text-black' : 'text-gray-400'}>UA</button>
             </div>
             
             {totalItemsCount > 0 && (
               <button 
                onClick={() => setIsDrawerOpen(true)} 
                className="text-[10px] font-bold uppercase tracking-widest text-black border border-black px-2 py-1 bg-white hover:bg-black hover:text-white transition-all active:scale-95"
              >
                {t.cart} ({totalItemsCount})
              </button>
             )}
          </div>

          {/* Desktop Cart Button */}
          {totalItemsCount > 0 && (
            <button 
              onClick={() => setIsDrawerOpen(true)} 
              className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-black border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-all active:scale-95"
            >
              {t.cart} ({totalItemsCount})
            </button>
          )}
        </div>
      </header>

      {/* DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[99999]">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-white border-l border-black p-6 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-8 font-bold text-black uppercase tracking-widest text-[11px]">
              <span>{t.cart}</span>
              <button onClick={() => setIsDrawerOpen(false)} className="hover:opacity-50">{t.close} ✕</button>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-6">
              {cart.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-start border-b border-neutral-100 pb-4 text-[10px] tracking-widest uppercase">
                  <div className="flex flex-col space-y-1">
                    <Link href={`/shop/${item.id}`} onClick={() => setIsDrawerOpen(false)} className="font-bold text-black">{item.title}</Link>
                    <span className="text-gray-500">{t.size}: {item.size}</span>
                    <div className="flex items-center space-x-3 pt-2">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => updateQuantity(idx, 'decrement')} className="p-1 hover:text-red-500">-</button>
                        <span className="font-mono text-[10px] px-1">{item.quantity}</span>
                        <button onClick={() => updateQuantity(idx, 'increment')} className="p-1 hover:text-green-500">+</button>
                      </div>
                      <button onClick={() => removeFromCart(idx)} className="text-gray-300 hover:text-black hover:underline px-2 transition-all">{t.remove}</button>
                    </div>
                  </div>
                  <span className="font-bold text-black font-mono">{((parseFloat(item.price) || 0) * item.quantity)}€</span>
                </div>
              ))}
            </div>
            <Link href="/checkout" className="mt-6 w-full bg-black text-white py-4 text-center font-bold uppercase tracking-widest text-[11px] hover:bg-neutral-800 transition-colors" onClick={() => setIsDrawerOpen(false)}>{t.checkout}</Link>
          </div>
        </div>
      )}
    </>
  );
}