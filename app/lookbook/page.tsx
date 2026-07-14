import LookbookClient from './LookbookClient';
import { Metadata } from 'next';

export const metadata = {
  title: 'LOOKBOOK', // ← поменяй на нужное слово (NEWS / LOOKBOOK / ABOUT / CONTACT)
  description: 'Current collection. Everything in detail.',
  openGraph: {
    title: 'LOOKBOOK', // ← то же слово
    description: 'Current collection. Everything in detail.',
    images: [{ url: '/1logo-heavy.png', width: 1200, height: 630, alt: 'STIROL' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LOOKBOOK', // ← то же слово
    description: 'Current collection. Everything in detail.',
    images: ['/1logo-heavy.png'],
  },
};

export default function LookbookPage() {
  return <LookbookClient />;
}