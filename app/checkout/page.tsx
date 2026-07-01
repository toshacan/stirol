import CheckoutClient from './CheckoutClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CHECKOUT',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}