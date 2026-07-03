'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // При каждом изменении пути (pathname) скроллим в начало страницы
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}