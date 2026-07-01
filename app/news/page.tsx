import NewsClient from './NewsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NEWS',
};

export default function NewsPage() {
  return <NewsClient />;
}