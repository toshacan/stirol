'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/components/LangContext';

type LangType = 'EN' | 'UA';

export default function Footer() {
  const pathname = usePathname();
  const { lang } = useLang();
  const currentLang: LangType = (lang === 'UA' || lang === 'EN') ? lang : 'EN';
  const [isOpen, setIsOpen] = useState(false);

  // Остальная логика handleSubscribe остается прежней...
  // (я опустил её для краткости, просто замени содержимое этого файла полностью)

  const translations: Record<string, Record<LangType, string>> = {
    '/news': { EN: 'NEWS', UA: 'НОВИНИ' },
    '/lookbook': { EN: 'LOOKBOOK 2026', UA: 'ЛУКБУК 2026' },
    '/shop': { EN: 'SHOP', UA: 'МАГАЗИН' },
    '/contact': { EN: 'CONTACT', UA: 'КОНТАКТИ' },
    '/videos': { EN: 'VIDEOS', UA: 'ВІДЕО' },
    '/about': { EN: 'ABOUT', UA: 'ПРО БРЕНД' },
    'drop_alerts': { EN: 'DROP ALERTS', UA: 'ДРОПИ' }
  };

  const links = ['/news', '/lookbook', '/shop', '/contact', '/videos', '/about'];

  return (
    <footer className="w-full pb-8 flex flex-col items-center gap-5 relative z-10 will-change-transform">
      <div className="flex gap-6 text-[9px] uppercase tracking-[0.2em] font-bold items-center flex-wrap justify-center">
        {links.map((path) => {
          const isActive = pathname === path;
          return (
            <Link 
              key={path} 
              href={path} 
              className={`transition-colors duration-200 ${
                isActive 
                  ? 'text-black font-black underline decoration-1 underline-offset-4' 
                  : 'text-gray-800 hover:text-black font-bold'
              }`}
            >
              {translations[path]?.[currentLang]}
            </Link>
          );
        })}
      </div>

      <button 
        onClick={() => setIsOpen(true)} 
        className="border border-black px-5 py-1.5 text-[9px] uppercase tracking-[0.2em] font-bold text-black hover:bg-black hover:text-white transition-all duration-200"
      >
        {translations['drop_alerts']?.[currentLang]}
      </button>

      {/* Модалка остается прежней (isOpen && ...) */}
    </footer>
  );
}