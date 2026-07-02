'use client'; // Добавляем директиву, чтобы использовать useEffect
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; 
import { LangProvider } from '@/components/LangContext';
import { CartProvider } from '@/components/CartContext';

// ... импорты шрифтов остаются прежними ...
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Маленький компонент для сброса скролла
function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
      <body className="font-sans min-h-[100dvh] flex flex-col">
        <CartProvider>
          <LangProvider>
            <ScrollToTop /> {/* Вставляем сюда */}
            <main className="flex-grow w-full">
              {children}
            </main>
          </LangProvider>
        </CartProvider>
      </body>
    </html>
  );
}