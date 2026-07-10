'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLang } from '@/components/LangContext';

type LangType = 'EN' | 'UA';

export default function Footer() {
  const pathname = usePathname();
  const { lang } = useLang();
  const currentLang: LangType = (lang === 'UA' || lang === 'EN') ? lang : 'EN';

  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'exists'>('idle');

  // ЖЕСТКАЯ блокировка скролла
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    };
  }, [isOpen]);

  const translations: Record<string, Record<LangType, string>> = {
    '/news': { EN: 'MAGAZINE', UA: 'ЗІН' },
    '/lookbook': { EN: 'LOOKBOOK 2026', UA: 'ЛУКБУК 2026' },
    '/shop': { EN: 'SHOP', UA: 'МАГАЗИН' },
    '/contact': { EN: 'CONTACT', UA: 'КОНТАКТИ' },
    '/videos': { EN: 'VIDEOS', UA: 'ВІДЕО' },
    '/about': { EN: 'ABOUT', UA: 'ПРО БРЕНД' },
    'drop_alerts': { EN: 'DROP ALERTS', UA: 'ДРОПИ' }
  };

  const formTranslations: Record<string, Record<LangType, string>> = {
    placeholder: { EN: 'ENTER YOUR EMAIL', UA: 'ВВЕДІТЬ ВАШ EMAIL' },
    button: { EN: 'SUBSCRIBE', UA: 'ПІДПИСАТИСЬ' },
    loading: { EN: 'SENDING...', UA: 'ВІДПРАВКА...' },
    success: { EN: 'SUCCESS', UA: 'УСПІШНО' },
    error: { EN: 'ERROR', UA: 'ПОМИЛКА' },
    exists: { EN: 'ALREADY SUBSCRIBED', UA: 'ВИ ВЖЕ ПІДПИСАНІ' },
  };

  const links = [{ path: '/news' }, { path: '/lookbook' }, { path: '/shop' }, { path: '/contact' }, { path: '/videos' }, { path: '/about' }];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang: currentLang }),
      });
      const data = await response.json();
      if (data.result === 'success' || data.result === 'exists') {
        setStatus(data.result);
        setEmail('');
        setTimeout(() => { setIsOpen(false); setStatus('idle'); }, 1500);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 2000);
      }
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <footer className="w-full pb-8 flex flex-col items-center gap-5 relative z-10">
      {/* Список ссылок: на мобиле сетка 2 колонки, на десктопе строка.
          Используем обычные <a> (не next/link) — это настоящая навигация браузера,
          а не мягкий SPA-переход. На мобильных (особенно iOS) мягкий переход
          иногда оставлял страницу "недорисованной" после скролла вниз до футера —
          кнопки визуально на месте, но не реагируют на нажатия, пока не скроллнуть
          вручную. Полноценная перезагрузка страницы гарантированно решает эту
          проблему, поскольку браузер каждый раз строит страницу с нуля. */}
      <div className="grid grid-cols-2 md:flex gap-x-8 gap-y-3 md:gap-6 text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 items-center justify-center">
        {links.map((link) => {
          const isActive = pathname === link.path;
          return (
            <a
              key={link.path}
              href={link.path}
              onClick={(e) => {
                if (pathname === link.path) {
                  e.preventDefault();
                }
              }}
              className={`transition-colors pointer-events-auto ${isActive ? 'text-black font-black' : 'hover:text-black'}`}
            >
              {translations[link.path]?.[currentLang]}
            </a>
          );
        })}
      </div>

      <button 
        onClick={() => setIsOpen(true)} 
        className="border border-black px-5 py-1.5 text-[9px] uppercase tracking-[0.2em] font-bold text-black hover:bg-black hover:text-white transition-all duration-200 pointer-events-auto"
      >
        {translations['drop_alerts']?.[currentLang]}
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm pointer-events-auto"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <div className="w-full max-w-[300px] bg-white border border-black p-6 relative pointer-events-auto">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)} 
              className="absolute top-2 right-3 text-[10px] cursor-pointer"
            >
              ✕
            </button>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-4 mt-2">
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder={formTranslations.placeholder[currentLang]} 
                disabled={status !== 'idle'} 
                className="w-full bg-transparent border-b border-black pb-1 text-[9px] uppercase tracking-[0.1em] font-medium placeholder-gray-400 focus:outline-none disabled:opacity-50" 
                required 
              />
              <button 
                type="submit" 
                disabled={status !== 'idle'} 
                className={`w-full text-white text-[9px] font-bold tracking-[0.2em] py-2 uppercase transition-colors ${status === 'exists' || status === 'error' ? 'bg-red-600' : 'bg-black'}`}
              >
                {formTranslations[status === 'idle' ? 'button' : status]?.[currentLang]}
              </button>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}