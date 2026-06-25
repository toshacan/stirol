// data/products.ts

export type Product = {
  id: string;
  category: 'tshirts' | 'hoodies' | 'shoppers';
  title: string;
  price: string;
  status: 'limited' | 'soldout' | 'comingSoon';
  description: string;
  sizes: string[];
  images: string[];
};

export const PRODUCTS: Product[] = [
  {
    id: 'fuck-the-roc-tee',
    category: 'tshirts',
    title: '"FUCK THE ROC" T-SHIRT',
    price: '1200 UAH / 30$',
    status: 'limited',
    description: 'Heavyweight military-grade cotton. Screen printed in Kyiv. Limited edition FW26.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/products/tee1.jpg', '/products/tee1_back.jpg']
  },
  {
    id: 'shopper-bag-org',
    category: 'shoppers',
    title: 'Orange Shopper Bag',
    price: 'SOLD OUT',
    status: 'soldout',
    description: 'Durable canvas texture, reinforced stitching for urban environments.',
    sizes: ['One Size'],
    images: ['/products/bag1.jpg']
  },
  {
    id: 'core-logo-hoodie',
    category: 'hoodies',
    title: 'CORE LOGO HOODIE',
    price: 'SOLD OUT',
    status: 'soldout',
    description: 'Oversized fit, heavy fleece lining.',
    sizes: ['M', 'L', 'XL'],
    images: ['/products/hoodie1.jpg']
  },
  {
    id: 'stirol-sticker-pack',
    category: 'tshirts',
    title: 'STIROL STICKER PACK',
    price: '-- UAH',
    status: 'comingSoon',
    description: 'High-quality vinyl stickers pack.',
    sizes: [],
    images: ['/products/stickers.jpg']
  }
];