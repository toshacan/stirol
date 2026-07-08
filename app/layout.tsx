import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LangProvider } from '@/components/LangContext';
import { CartProvider } from '@/components/CartContext';
import ScrollToTop from '@/components/ScrollToTop';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://stirol.xyz'),
  title: {
    default: 'STIROL',
    template: '%s — STIROL',
  },
  description: 'STIROL — official website.',
  openGraph: {
    title: 'STIROL',
    description: 'STIROL — official website.',
    url: 'https://stirol.xyz',
    siteName: 'STIROL',
    images: [
      {
        url: '/logo-heavy.png',
        width: 1200,
        height: 630,
        alt: 'STIROL',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STIROL',
    description: 'STIROL — official website.',
    images: ['/logo-heavy.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
      <body className="font-sans min-h-[100dvh] flex flex-col">
        <CartProvider>
          <LangProvider>
            <ScrollToTop />
            <main className="flex-grow w-full">
              {children}
            </main>
          </LangProvider>
        </CartProvider>
      </body>
    </html>
  );
}