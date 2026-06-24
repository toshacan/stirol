'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const LangContext = createContext<any>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<'EN' | 'UA'>('EN');
  const [isLoaded, setIsLoaded] = useState(false); // Флаг загрузки

  useEffect(() => {
    const saved = localStorage.getItem('stirol_lang') as 'EN' | 'UA';
    if (saved) setLang(saved);
    setIsLoaded(true);
  }, []);

  const changeLang = (l: 'EN' | 'UA') => {
    setLang(l);
    localStorage.setItem('stirol_lang', l);
  };

  if (!isLoaded) return null; // Ждем загрузку из localStorage

  return (
    <LangContext.Provider value={{ lang, changeLang }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);