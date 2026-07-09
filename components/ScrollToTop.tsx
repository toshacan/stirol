'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      const mainElement = document.querySelector('main');
      if (mainElement) mainElement.scrollTop = 0;

      const appContainer = document.querySelector('.min-h-screen');
      if (appContainer) appContainer.scrollTop = 0;
    };

    // Двойной requestAnimationFrame: ждём, пока браузер реально отрисует
    // новую страницу, прежде чем сбрасывать скролл. На мобильных (особенно iOS)
    // scrollTo, вызванный слишком рано, может быть "переигран" самим браузером.
    requestAnimationFrame(() => {
      requestAnimationFrame(resetScroll);
    });
  }, [pathname]);

  return null;
}