'use client';
import Link from 'next/link';
import { useLang } from './LangContext';

export default function Header() {
  const { lang, changeLang } = useLang();
  
  const time = new Date().toLocaleTimeString('en-GB', { 
    hour: '2-digit', minute: '2-digit', second: '2-digit' 
  });

  return (
    <header className="w-full flex justify-between items-start text-[10px] tracking-widest uppercase text-gray-400 z-10 p-4">
      
      {/* ЛЕВАЯ ЧАСТЬ: Занимает 1/3 ширины (flex-1) */}
      <div className="flex-1">
        <Link href="/" className="hover:text-black transition-colors font-bold text-black pt-1 block">
          {lang === 'EN' ? '← BACK TO MAIN' : '← НА ГОЛОВНУ'}
        </Link>
      </div>
      
      {/* ЦЕНТР: Логотип всегда строго по центру */}
      <div className="flex flex-col items-center space-y-1 w-32 flex-shrink-0">
        <Link href="/" className="block w-32 h-10 relative hover:opacity-80 transition-opacity">
          <img src="/logo-heavy.png" alt="STIROL" className="w-full h-full object-contain invert" />
        </Link>
        
        <div className="flex space-x-1 text-[8px] tracking-normal font-bold pt-1">
          <button 
            onClick={() => changeLang('EN')} 
            className={`hover:text-black ${lang === 'EN' ? 'text-black underline' : 'text-gray-400'}`}
          >
            EN
          </button>
          <span className="text-gray-300">/</span>
          <button 
            onClick={() => changeLang('UA')} 
            className={`hover:text-black ${lang === 'UA' ? 'text-black underline' : 'text-gray-400'}`}
          >
            UA
          </button>
        </div>
      </div>

      {/* ПРАВАЯ ЧАСТЬ: Занимает 1/3 ширины (flex-1), текст выровнен по правому краю */}
      <div className="flex-1 flex justify-end">
        <div className="text-right text-gray-400 flex flex-col space-y-0.5 font-bold">
          <span className="text-black font-sans font-medium">24/06/2026</span>
          <span className="text-[9px] text-gray-500 font-mono tracking-normal">{time}</span>
        </div>
      </div>
      
    </header>
  );
}