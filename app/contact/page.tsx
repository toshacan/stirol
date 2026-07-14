import ContactClient from './ContactClient';
import { Metadata } from 'next';

export const metadata = {
  title: 'CONTACT', // ← поменяй на нужное слово (NEWS / LOOKBOOK / ABOUT / CONTACT)
  description: 'Get in touch. Collaborations, questions, or just to say hi. We’re here.',
  openGraph: {
    title: 'CONTACT', // ← то же слово
    description: 'Get in touch. Collaborations, questions, or just to say hi. We’re here.',
    images: [{ url: '/1logo-heavy.png', width: 1200, height: 630, alt: 'STIROL' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CONTACT', // ← то же слово
    description: 'Get in touch. Collaborations, questions, or just to say hi. We’re here.',
    images: ['/1logo-heavy.png'],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}