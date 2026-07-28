import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STIROL',
    description: 'STIROL — official website.',
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
        <Analytics />
      </body>
    </html>
  );
}