'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  // Отключаем встроенное восстановление скролла браузера — оно может
  // "переигрывать" наш ручной сброс на некоторых мобильных браузерах (Chrome iOS и т.п.)
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      const mainElement = document.querySelector('main');
      if (mainElement) mainElement.scrollTop = 0;

      const appContainer = document.querySelector('.min-h-screen');
      if (appContainer) appContainer.scrollTop = 0;
    };

    // Двойной requestAnimationFrame: ждём, пока браузер реально отрисует
    // новую страницу, прежде чем сбрасывать скролл.
    requestAnimationFrame(() => {
      requestAnimationFrame(resetScroll);
    });

    // Подстраховка: некоторым мобильным браузерам (особенно Chrome iOS)
    // двух кадров анимации недостаточно — досбрасываем ещё раз чуть позже
    const fallbackTimer = setTimeout(resetScroll, 150);

    return () => clearTimeout(fallbackTimer);
  }, [pathname]);

  return null;
}