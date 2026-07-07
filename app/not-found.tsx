'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NotFound() {
  const [lang, setLang] = useState<'EN' | 'UA'>('EN');
  const [time, setTime] = useState('00:00:00');

  useEffect(() => {
    const savedLang = localStorage.getItem('stirol_lang') as 'EN' | 'UA';
    if (savedLang) setLang(savedLang);
    const interval = setInterval(() => {
      setTime(new Date().toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const t = {
    EN: {
      signal: 'NO SIGNAL',
      title: 'PAGE NOT FOUND',
      sub: 'THIS PAGE DOESN\'T EXIST OR WAS MOVED',
      backHome: 'BACK TO MAIN',
      toShop: 'GO TO SHOP',
    },
    UA: {
      signal: 'СИГНАЛ ВІДСУТНІЙ',
      title: 'СТОРІНКУ НЕ ЗНАЙДЕНО',
      sub: 'ЦІЄЇ СТОРІНКИ НЕ ІСНУЄ АБО ЇЇ ПЕРЕНЕСЛИ',
      backHome: 'НА ГОЛОВНУ',
      toShop: 'ДО МАГАЗИНУ',
    },
  }[lang];

  return (
    <div className="bg-[#121212] text-[#f0f0f0] font-mono antialiased min-h-screen flex flex-col p-4 md:p-6 relative overflow-hidden">
      {/* Шум/статика — тонкий "шипящий" оверлей */}
      <div className="noise-overlay pointer-events-none absolute inset-0 z-0" />

      {/* Сканлайн, ползущая вниз */}
      <div className="scanline pointer-events-none absolute inset-0 z-0" />

      {/* Угловые "видоискатель" скобки, как на камере */}
      <div className="absolute top-6 left-6 w-8 h-8 md:w-12 md:h-12 border-t border-l border-gray-600 z-10" />
      <div className="absolute top-6 right-6 w-8 h-8 md:w-12 md:h-12 border-t border-r border-gray-600 z-10" />
      <div className="absolute bottom-6 left-6 w-8 h-8 md:w-12 md:h-12 border-b border-l border-gray-600 z-10" />
      <div className="absolute bottom-6 right-6 w-8 h-8 md:w-12 md:h-12 border-b border-r border-gray-600 z-10" />

      {/* Верхняя строка: REC-стиль сигнал + время, как на главной */}
      <header className="w-full flex justify-between items-center text-[10px] md:text-[11px] tracking-widest uppercase z-10 text-gray-500 relative">
        <div className="flex items-center space-x-2 text-[#f0f0f0]">
          <span className="text-red-600 font-bold animate-pulse">●</span>
          <span>{t.signal}</span>
        </div>
        <div className="flex space-x-2 text-[12px] md:text-[13px] tracking-normal font-bold">
          <button onClick={() => { setLang('EN'); localStorage.setItem('stirol_lang', 'EN'); }} className={`hover:text-white ${lang === 'EN' ? 'text-white underline' : 'text-gray-600'}`}>EN</button>
          <span className="text-gray-700">/</span>
          <button onClick={() => { setLang('UA'); localStorage.setItem('stirol_lang', 'UA'); }} className={`hover:text-white ${lang === 'UA' ? 'text-white underline' : 'text-gray-600'}`}>UA</button>
        </div>
        <div className="text-[#f0f0f0]">{time}</div>
      </header>

      {/* Центр */}
      <main className="flex-grow flex flex-col items-center justify-center text-center space-y-6 z-10 w-full py-10 relative">
        <h1 className="glitch-text text-[72px] md:text-[140px] font-black tracking-tighter leading-none text-white select-none">
          404
        </h1>

        <div className="space-y-2">
          <p className="text-sm font-bold uppercase tracking-widest text-white">{t.title}</p>
          <p className="text-[10px] uppercase tracking-widest text-gray-500">{t.sub}</p>
        </div>

        <div className="flex items-center gap-6 pt-4">
          <Link
            href="/"
            className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white underline underline-offset-4 decoration-gray-700 hover:decoration-white transition-colors"
          >
            {t.backHome}
          </Link>
          <Link
            href="/shop"
            className="border border-gray-600 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black hover:border-white transition-all"
          >
            {t.toShop}
          </Link>
        </div>
      </main>

      <footer className="w-full flex flex-col items-center z-10 pb-2 relative">
        <div className="text-gray-600 font-sans text-[9px] tracking-[0.3em]">EST. 2012</div>
      </footer>

      <style jsx>{`
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
          opacity: 0.05;
          mix-blend-mode: overlay;
          animation: flicker 0.4s steps(2) infinite;
        }
        .scanline {
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(255, 255, 255, 0.03) 50%,
            transparent 100%
          );
          height: 40%;
          animation: scan 6s linear infinite;
        }
        .glitch-text {
          animation: textFlicker 4s infinite;
        }
        @keyframes flicker {
          0% { opacity: 0.04; }
          50% { opacity: 0.07; }
          100% { opacity: 0.04; }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(250%); }
        }
        @keyframes textFlicker {
          0%, 96%, 100% { opacity: 1; }
          97% { opacity: 0.7; }
          98% { opacity: 1; }
          99% { opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}