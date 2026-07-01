import ContactClient from './ContactClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CONTACT',
};

export default function ContactPage() {
  return <ContactClient />;
}