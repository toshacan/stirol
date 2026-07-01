'use client';
import Header from './Header';

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-white flex flex-col isolation-auto">
      {/* isolation-auto гарантирует, что z-index'ы внутри не вылезут наружу */}
      <Header />
      
      <main className="flex-grow w-full z-10">
        {children}
      </main>

      {/* Футер вернется на место */}
      <footer className="p-4 text-[10px] text-gray-400 tracking-widest uppercase">
        © 2026 STIROL. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}