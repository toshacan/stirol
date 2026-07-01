import ShopClient from './ShopClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SHOP',
};

export default function ShopPage() {
  return <ShopClient />;
}