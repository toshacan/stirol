'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const links = [
    { label: 'NEWS', path: '/news' },
    { label: 'LOOKBOOK 2026', path: '/lookbook' },
    { label: 'SHOP', path: '/shop' },
    { label: 'CONTACT', path: '/contact' },
    { label: 'VIDEOS', path: '/videos' },
    { label: 'ABOUT', path: '/about' },
  ];

  return (
    <footer className="w-full pb-8 flex justify-center">
      <div className="flex gap-6 text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">
        {links.map((link) => {
          if (pathname === link.path) return null;
          return (
            <Link key={link.path} href={link.path} className="hover:text-black transition-colors">
              {link.label}
            </Link>
          );
        })}
      </div>
    </footer>
  );
}