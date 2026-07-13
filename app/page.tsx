'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const Icons = {
  instagram: () => <svg className="w-4 h-4 fill-current hover:text-white transition-colors" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  youtube: () => <svg className="w-4 h-4 fill-current hover:text-white transition-colors" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.503 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.387.508 9.387.508s7.517 0 9.387-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  telegram: () => <svg className="w-4 h-4 fill-current hover:text-white transition-colors" viewBox="0 0 24 24"><path d="M23.89 2.42a1.14 1.14 0 00-1.14-.15L1.13 9.47a1.15 1.15 0 00-.08 2.11l5.24 1.63a1.14 1.14 0 001.03-.23l11.45-7.72c.07-.05.15.04.09.1L9.61 14.51a1.14 1.14 0 00-.33.79v4.92a1.14 1.14 0 001.97.77l2.84-2.73a1.14 1.14 0 001.21-.08l4.9 3.61a1.14 1.14 0 001.78-.62l3.65-17.2a1.14 1.14 0 00-1.74-1.15z"/></svg>,
  facebook: () => <svg className="w-4 h-4 fill-current hover:text-white transition-colors" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
};

export default function Home() {
  const [time, setTime] = useState('00:00:00');
  const [activeHover, setActiveHover] = useState('');
  const [lang, setLang] = useState<'EN' | 'UA'>('EN');
  
  useEffect(() => {
    const savedLang = localStorage.getItem('stirol_lang') as 'EN' | 'UA';
    if (savedLang) setLang(savedLang);
    const interval = setInterval(() => {
      setTime(new Date().toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = {
    EN: [{ id: 'news', label: 'MAGAZINE', path: '/news' }, { id: 'lookbook', label: 'lookbook 2026', path: '/lookbook' }, { id: 'shop', label: 'shop', path: '/shop' }, { id: 'about', label: 'about', path: '/about' }, { id: 'videos', label: 'videos', path: '/videos' }, { id: 'contact', label: 'contact', path: '/contact' }],
    UA: [{ id: 'news', label: 'ЗІН', path: '/news' }, { id: 'lookbook', label: 'лукбук 2026', path: '/lookbook' }, { id: 'shop', label: 'магазин', path: '/shop' }, { id: 'about', label: 'про бренд', path: '/about' }, { id: 'videos', label: 'відео', path: '/videos' }, { id: 'contact', label: 'контакти', path: '/contact' }]
  };

  const bgImages: { [key: string]: string } = { news: '/menuimg/stirol.png', lookbook: '/menuimg/lookbook.jpeg', shop: '/menuimg/shop.jpg', about: '/menuimg/about.jpg', videos: '/menuimg/video.jpg', contact: '/menuimg/contact.jpeg' };

  return (
    // УБРАЛИ h-screen, теперь высота зависит от контента
    <div className="bg-[#121212] text-[#f0f0f0] font-mono antialiased flex flex-col p-4 md:p-6 relative overflow-hidden min-h-screen select-none">
      
      {activeHover && bgImages[activeHover] && (
        <div className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-screen pointer-events-none transition-all duration-300 z-0" style={{ backgroundImage: `url(${bgImages[activeHover]})` }} />
      )}

      <header className="w-full flex justify-between items-center text-[10px] md:text-[11px] tracking-widest uppercase z-10 text-gray-500">
        <div className="flex items-center space-x-2 text-[#f0f0f0]"><span className="text-red-600 font-bold animate-pulse">●</span><span>REC</span></div>
        <div className="flex space-x-2 text-[12px] md:text-[13px] tracking-normal font-bold">
            <button onClick={() => { setLang('EN'); localStorage.setItem('stirol_lang', 'EN'); }} className={`hover:text-white ${lang === 'EN' ? 'text-white underline' : 'text-gray-600'}`}>EN</button>
            <span className="text-gray-700">/</span>
            <button onClick={() => { setLang('UA'); localStorage.setItem('stirol_lang', 'UA'); }} className={`hover:text-white ${lang === 'UA' ? 'text-white underline' : 'text-gray-600'}`}>UA</button>
        </div>
        <div className="text-[#f0f0f0]">{time}</div>
      </header>

      {/* Теперь main и footer идут потоком, footer будет сразу за ними */}
      <main className="flex-grow flex flex-col items-center justify-center text-center space-y-6 md:space-y-10 z-10 w-full py-10">
        <a href="/" onClick={(e) => { e.preventDefault(); window.location.reload(); }} className="cursor-pointer hover:opacity-80 transition-opacity duration-200 block w-full max-w-[240px] md:max-w-[320px]">
          <div className="relative w-full h-20 md:h-24 flex items-center justify-center">
            <Image src="/logo-heavy.png" alt="STIROL" fill className="object-contain" />
          </div>
        </a>

        <nav className="flex flex-col space-y-2 md:space-y-3 text-[11px] md:text-xs tracking-[0.25em] uppercase font-sans font-bold">
          {menuItems[lang].map((item) => (
            <a key={item.id} href={item.path} onMouseEnter={() => setActiveHover(item.id)} onMouseLeave={() => setActiveHover('')} className="text-gray-500 hover:text-white transition-colors duration-150 block py-0.5">
              {item.label}
            </a>
          ))}
        </nav>
      </main>

      <footer className="w-full flex flex-col items-center z-10 pb-6 space-y-2 md:space-y-4">
        <div className="flex items-center space-x-5 md:space-x-6 text-gray-500">
          <a href="https://www.instagram.com/_stirol/" target="_blank" rel="noreferrer"><Icons.instagram /></a>
          <a href="https://www.facebook.com/profile.php?id=100079812641807" target="_blank" rel="noreferrer"><Icons.facebook /></a>
        </div>
        <div className="text-gray-600 font-sans text-[9px] md:text-[10px] tracking-[0.3em]">EST. 2012</div>
      </footer>
    </div>
  );
}