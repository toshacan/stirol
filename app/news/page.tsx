import NewsClient from './NewsClient';
import { Metadata } from 'next';

export const metadata = {
  title: 'MAGAZINE', // ← поменяй на нужное слово (NEWS / LOOKBOOK / ABOUT / CONTACT)
  description: 'Street culture, archives, and team updates. A look inside the STIROL movement.',
  openGraph: {
    title: 'MAGAZINE', // ← то же слово
    description: 'Street culture, archives, and team updates. A look inside the STIROL movement.',
    images: [{ url: '/logo-heavy.png', width: 1200, height: 630, alt: 'STIROL' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAGAZINE', // ← то же слово
    description: 'Street culture, archives, and team updates. A look inside the STIROL movement.',
    images: ['/logo-heavy.png'],
  },
};

export default function NewsPage() {
  return <NewsClient />;
}