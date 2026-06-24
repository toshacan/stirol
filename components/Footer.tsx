'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/components/LangContext'; // Импортируем твой контекст

export default function Footer() {
  const pathname = usePathname();
  const { lang } = useLang(); // Получаем текущий язык

  // Словарь переводов
  const translations: Record<string, Record<string, string>> = {
    '/news': { EN: 'NEWS', UA: 'НОВИНИ' },
    '/lookbook': { EN: 'LOOKBOOK 2026', UA: 'ЛУКБУК 2026' },
    '/shop': { EN: 'SHOP', UA: 'МАГАЗИН' },
    '/contact': { EN: 'CONTACT', UA: 'КОНТАКТИ' },
    '/videos': { EN: 'VIDEOS', UA: 'ВІДЕО' },
    '/about': { EN: 'ABOUT', UA: 'ПРО БРЕНД' },
  };

  const links = [
    { path: '/news' },
    { path: '/lookbook' },
    { path: '/shop' },
    { path: '/contact' },
    { path: '/videos' },
    { path: '/about' },
  ];

  return (
    <footer className="w-full pb-8 flex justify-center">
      <div className="flex gap-6 text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">
        {links.map((link) => {
          if (pathname === link.path) return null;
          
          // Берем перевод для текущего языка (или EN по умолчанию)
          const label = translations[link.path][lang] || translations[link.path]['EN'];

          return (
            <Link key={link.path} href={link.path} className="hover:text-black transition-colors">
              {label}
            </Link>
          );
        })}
      </div>
    </footer>
  );
}