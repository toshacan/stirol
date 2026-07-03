'use client';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop'; // Импортируем компонент

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc] text-[#121212] font-mono select-none isolation-auto">
      <ScrollToTop /> {/* Вставлен сюда */}
      
      <Header />
      <main className="flex-grow flex flex-col w-full z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}