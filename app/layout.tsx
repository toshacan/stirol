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
  title: "STIROL",
  description: "Official STIROL website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {/* Убрали min-h-full и flex flex-col, чтобы контент не сжимался */}
      <body className="font-sans">
        <CartProvider>
          <LangProvider>
            {children}
          </LangProvider>
        </CartProvider>
      </body>
    </html>
  );
}