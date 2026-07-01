import LookbookClient from './LookbookClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LOOKBOOK',
};

export default function LookbookPage() {
  return <LookbookClient />;
}