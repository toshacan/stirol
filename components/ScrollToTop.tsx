'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Сбрасывает скролл наверх при смене страницы
export default function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}