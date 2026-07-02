import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; 
import { LangProvider } from '@/components/LangContext';
import { CartProvider } from '@/components/CartContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "STIROL",
    template: "%s - STIROL",
  },
  description: "Official STIROL website",
  // Добавим viewport, чтобы мобильные браузеры корректно считывали размеры
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
      {/* min-h-[100dvh] — задает высоту по динамическому вьюпорту (лучшее решение для мобильных)
        flex flex-col — выстраивает структуру так, что контент не накладывается, а футер всегда будет внизу
      */}
      <body className="font-sans min-h-[100dvh] flex flex-col">
        <CartProvider>
          <LangProvider>
            {/* flex-grow или flex-1 заставляет контент занимать всё место, 
               но не сжимает футер, если контента мало.
            */}
            <main className="flex-grow">
              {children}
            </main>
          </LangProvider>
        </CartProvider>
      </body>
    </html>
  );
}