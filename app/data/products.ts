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
    price: '',
    status: 'soldout',
    description: 'Heavyweight cotton. Limited edition FW23.',
    sizes: ['Sold Out'],
    images: ['/shop/fuck.jpg', '/shop/fuckw.jpg']
  },
  {
    id: 'shopper-bag-org',
    category: 'shoppers',
    title: 'Orange Shopper Bag',
    price: '',
    status: 'soldout',
    description: 'Durable canvas texture, reinforced stitching for urban environments.',
    sizes: ['One Size'],
    images: ['/shop/orshopper.jpg']
  },
  
  {
    id: 'hoodiev1',
    category: 'hoodies',
    title: 'Stirol Hoodie',
    price: '',
    status: 'soldout',
    description: 'Regular fit, heavy cotton.',
    sizes: ['M', 'L', 'XL'],
    images: ['/shop/hoodie.jpg']
  },
  {
    id: 'whshopper',
    category: 'shoppers',
    title: 'White Shopper Bag',
    price: '',
    status: 'soldout',
    description: 'High-quality Shopper Bag.',
    sizes: ['One Size'],
    images: ['/shop/whshopper.jpg']
  }
];