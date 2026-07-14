import AboutClient from './AboutClient';
import { Metadata } from 'next';

export const metadata = {
  title: 'ABOUT', // ← поменяй на нужное слово (NEWS / LOOKBOOK / ABOUT / CONTACT)
  description: 'STIROL. BORN IN 2012.',
  openGraph: {
    title: 'AB08T', // ← то же слово
    description: 'STIROL. BORN IN 2012.',
    images: [{ url: '/1logo-heavy.png', width: 1200, height: 630, alt: 'STIROL' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AB0UT', // ← то же слово
    description: 'STIROL. BORN IN 2012.',
    images: ['/1logo-heavy.png'],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}