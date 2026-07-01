import AboutClient from './AboutClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ABOUT', // Next.js автоматически подставит это в шаблон "%s | STIROL" из твоего root-layout
};

export default function AboutPage() {
  return <AboutClient />;
}