// data/products.ts

export type ColorVariant = {
  name: string;
  hex: string;
  id: string;
};

export type Product = {
  id: string;
  category: 'tshirts' | 'hoodies' | 'shoppers';
  title: string;
  price: string;
  // Сделали статус необязательным (?) и убрали 'limited'. 
  // Если статуса нет — вещь просто доступна к покупке без плашек на фотке!
  status?: 'soldout' | 'comingSoon'; 
  description: string;
  sizes: string[];
  images: string[];
  colorVariants?: ColorVariant[]; 
};

export const PRODUCTS: Product[] = [
  {
    id: 'fuck-the-roc-tee-black',
    category: 'tshirts',
    title: '"FUCK THE ROC" T-SHIRT - BLACK',
    price: '45€', 
    status: 'soldout', // Эта раскуплена, кнопка будет заблокирована
    description: 'Heavyweight cotton. Limited edition FW23. Deep black wash.',
    sizes: ['M', 'L'], 
    images: ['/shop/fuck.png'], 
    colorVariants: [
      { name: 'BLACK', hex: '#000000', id: 'fuck-the-roc-tee-black' },
      { name: 'WHITE', hex: '#FFFFFF', id: 'fuck-the-roc-tee-white' }
    ]
  },
  {
    id: 'fuck-the-roc-tee-white',
    category: 'tshirts',
    title: '"FUCK THE ROC" T-SHIRT - WHITE',
    price: '45€', 
    // УБРАЛИ status: 'limited'. Вещь активна, доступна к покупке, но никаких лишних плашек сверху!
    description: 'Heavyweight cotton. Limited edition FW23. Raw white base.',
    sizes: ['S', 'M', 'L', 'XL'], 
    images: ['/shop/fuckw.png'], 
    colorVariants: [
      { name: 'BLACK', hex: '#000000', id: 'fuck-the-roc-tee-black' },
      { name: 'WHITE', hex: '#FFFFFF', id: 'fuck-the-roc-tee-white' }
    ]
  },
  {
    id: 'shopper-bag-org',
    category: 'shoppers',
    title: 'Orange Shopper Bag',
    price: '25€',
    status: 'soldout',
    description: 'Durable canvas texture, reinforced stitching for urban environments.',
    sizes: ['One Size'],
    images: ['/shop/orshopper.png']
  },
  {
    id: 'hoodiev1',
    category: 'hoodies',
    title: 'Stirol Hoodie',
    price: '65€',
    // УБРАЛИ status: 'limited'. Худи в продаже, карточка чистая и брутальная.
    description: 'Regular fit, heavy cotton.',
    sizes: ['M', 'L', 'XL'],
    images: ['/shop/hoodie.png']
  },
  {
    id: 'whshopper',
    category: 'shoppers',
    title: 'White Shopper Bag',
    price: '25€',
    status: 'soldout',
    description: 'High-quality Shopper Bag.',
    sizes: ['One Size'],
    images: ['/shop/whshopper.png']
  },
  {
    id: 'box-tshirt',
    category: 'tshirts', // Поменял на tshirts, раз это футболка
    title: 'Box Logo T-Shirt',
    price: '35€',
    status: 'soldout',
    description: 'Regular fit, heavy cotton.',
    sizes: ['S', 'M', 'L'],
    images: ['/shop/stirolnew.png']
  },
];