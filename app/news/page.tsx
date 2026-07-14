import NewsClient from './NewsClient';
import { Metadata } from 'next';

export const metadata = {
  title: 'MAGAZINE', // ← поменяй на нужное слово (NEWS / LOOKBOOK / ABOUT / CONTACT)
  description: 'Street culture, archives, and  updates.',
  openGraph: {
    title: 'MAGAZINE', // ← то же слово
    description: 'Street culture, archives, and updates. ',
    images: [{ url: '/1logo-heavy.png', width: 1200, height: 630, alt: 'STIROL' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAGAZINE', // ← то же слово
    description: 'Street culture, archives, and team updates.',
    images: ['/1logo-heavy.png'],
  },
};

export default function NewsPage() {
  return <NewsClient />;
}