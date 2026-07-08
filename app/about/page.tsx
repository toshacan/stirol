import AboutClient from './AboutClient';
import { Metadata } from 'next';

export const metadata = {
  title: 'ABOUT', // ← поменяй на нужное слово (NEWS / LOOKBOOK / ABOUT / CONTACT)
  description: 'STIROL. Independent clothing imprint, started in 2012 by skaters in Horlivka.',
  openGraph: {
    title: 'AB08T', // ← то же слово
    description: 'STIROL. Independent clothing imprint, started in 2012 by skaters in Horlivka.',
    images: [{ url: '/logo-heavy.png', width: 1200, height: 630, alt: 'STIROL' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AB0UT', // ← то же слово
    description: 'STIROL. Independent clothing imprint, started in 2012 by skaters in Horlivka.',
    images: ['/logo-heavy.png'],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}