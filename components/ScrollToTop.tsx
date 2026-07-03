'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Стандартный способ (для окна браузера)
    window.scrollTo(0, 0);

    // 2. Агрессивный способ: ищем основные контейнеры, 
    // которые могли перехватить скролл
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTop = 0;
    }
    
    // 3. На случай, если основной контейнер — это самый верхний div
    const appContainer = document.querySelector('.min-h-screen');
    if (appContainer) {
      appContainer.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}