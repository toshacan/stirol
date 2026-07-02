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
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'exists'>('idle');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    }
  }, [isOpen]);

  const links = [{ path: '/news' }, { path: '/lookbook' }, { path: '/shop' }, { path: '/contact' }, { path: '/videos' }, { path: '/about' }];
  
  // ... ( translations и formTranslations остаются прежними ) ...
  const translations: any = { /* ... */ }; 
  const formTranslations: any = { /* ... */ };

  return (
    // Добавил will-change: transform в классы
    <footer className="w-full pb-8 flex flex-col items-center gap-5 relative z-10 will-change-transform">
      <div className="flex gap-6 text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 items-center flex-wrap justify-center">
        {links.map((link) => (
          pathname !== link.path && (
            <Link key={link.path} href={link.path} className="hover:text-black transition-colors pointer-events-auto">
              {link.path.replace('/', '').toUpperCase()}
            </Link>
          )
        ))}
      </div>

      <button 
        onClick={() => setIsOpen(true)} 
        className="border border-black px-5 py-1.5 text-[9px] uppercase tracking-[0.2em] font-bold text-black hover:bg-black hover:text-white transition-all duration-200 pointer-events-auto"
      >
        DROP ALERTS
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm pointer-events-auto"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <div className="w-full max-w-[300px] bg-white border border-black p-6 relative pointer-events-auto">
             {/* ... форма ... */}
          </div>
        </div>
      )}
    </footer>
  );
}