'use client';
import Header from './Header';
import Footer from './Footer';

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col bg-[#fcfcfc] text-[#121212] font-mono select-none">
      <Header />
      
      <main className="flex-grow flex flex-col w-full overflow-hidden">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}