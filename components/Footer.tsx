'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/components/LangContext';

export default function Footer() {
  const pathname = usePathname();
  const { lang } = useLang();

  // Состояния для модалки и отправки
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const translations: Record<string, Record<string, string>> = {
    '/news': { EN: 'NEWS', UA: 'НОВИНИ' },
    '/lookbook': { EN: 'LOOKBOOK 2026', UA: 'ЛУКБУК 2026' },
    '/shop': { EN: 'SHOP', UA: 'МАГАЗИН' },
    '/contact': { EN: 'CONTACT', UA: 'КОНТАКТИ' },
    '/videos': { EN: 'VIDEOS', UA: 'ВІДЕО' },
    '/about': { EN: 'ABOUT', UA: 'ПРО БРЕНД' },
    'drop_alerts': { EN: 'DROP ALERTS', UA: 'ДРОПИ' }
  };

  const formTranslations = {
    placeholder: { EN: 'ENTER YOUR EMAIL', UA: 'ВВЕДІТЬ ВАШ EMAIL' },
    button: { EN: 'SUBSCRIBE', UA: 'ПІДПИСАТИСЬ' },
    loading: { EN: 'SENDING...', UA: 'ВІДПРАВКА...' },
    success: { EN: 'SUCCESS', UA: 'УСПІШНО' },
    error: { EN: 'ERROR', UA: 'ПОМИЛКА' },
  };

  const links = [
    { path: '/news' },
    { path: '/lookbook' },
    { path: '/shop' },
    { path: '/contact' },
    { path: '/videos' },
    { path: '/about' },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setTimeout(() => {
          setIsOpen(false);
          setStatus('idle');
        }, 1500);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 2000);
      }
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  // Функция закрытия при клике на серое пространство вокруг окошка
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
      setStatus('idle');
    }
  };

  return (
    <footer className="w-full pb-8 flex flex-col items-center gap-5">
      
      {/* 1. НАВИГАЦИОННЫЕ ССЫЛКИ */}
      <div className="flex gap-6 text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 items-center flex-wrap justify-center">
        {links.map((link) => {
          if (pathname === link.path) return null;
          const label = translations[link.path][lang] || translations[link.path]['EN'];

          return (
            <Link key={link.path} href={link.path} className="hover:text-black transition-colors">
              {label}
            </Link>
          );
        })}
      </div>

      {/* 2. СТИЛИЗОВАННАЯ КНОПКА ПОД ССЫЛКАМИ */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="border border-black px-5 py-1.5 text-[9px] uppercase tracking-[0.2em] font-bold text-black hover:bg-black hover:text-white transition-all duration-200"
      >
        {translations['drop_alerts'][lang] || translations['drop_alerts']['EN']}
      </button>

      {/* ВСПЛЫВАЮЩЕЕ ОКНО (МОДАЛКА) */}
      {isOpen && (
        <div 
          onClick={handleOverlayClick} // Вешаем закрытие на весь фон
          className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          {/* Само окно (отменяем cursor-pointer родителя через cursor-default) */}
          <div className="w-full max-w-[300px] bg-white border border-black p-6 relative cursor-default">
            
            {/* КРЕСТИК ЗАКРЫТИЯ */}
            <button 
              onClick={() => { setIsOpen(false); setStatus('idle'); }} 
              className="absolute top-2 right-3 text-[10px] font-mono hover:text-gray-500"
            >
              ✕
            </button>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-4 mt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={formTranslations.placeholder[lang] || formTranslations.placeholder['EN']}
                disabled={status === 'loading' || status === 'success'}
                className="w-full bg-transparent border-b border-black pb-1 text-[9px] uppercase tracking-[0.1em] font-medium placeholder-gray-400 focus:outline-none disabled:opacity-50"
                required
                autoFocus
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full bg-black text-white text-[9px] font-bold tracking-[0.2em] py-2 hover:bg-neutral-800 transition-colors disabled:bg-gray-400 uppercase"
              >
                {status === 'loading' && (formTranslations.loading[lang] || formTranslations.loading['EN'])}
                {status === 'success' && (formTranslations.success[lang] || formTranslations.success['EN'])}
                {status === 'error' && (formTranslations.error[lang] || formTranslations.error['EN'])}
                {status === 'idle' && (formTranslations.button[lang] || formTranslations.button['EN'])}
              </button>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}