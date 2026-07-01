export interface VideoItem {
  id: string;
  category: string;
  title: string;
  meta: string;
  cover?: string;
  isComingSoon: boolean;
  youtubeId?: string;
  wistiaId?: string;
  hasCustomMargin?: boolean;
  titleText: { EN: string; UA: string; };
  metaText: { EN: string; UA: string; };
  specs: { EN: string; UA: string; };
  description: { EN: string; UA: string; };
}

export const VIDEOS: VideoItem[] = [
  {
    id: 'gorlovka-days',
    category: 'skate',
    title: '"GORLOVKA DAYS"',
    meta: 'SKATE ARCHIVE / 04:15',
    cover: 'https://img.youtube.com/vi/p67mBwbgjyg/maxresdefault.jpg',
    isComingSoon: false,
    youtubeId: 'p67mBwbgjyg',
    hasCustomMargin: true,
    titleText: {
      EN: 'STIROL SKATEBOARDING',
      UA: 'STIROL SKATEBOARDING'
    },
    metaText: {
      EN: '',
      UA: ''
    },
    specs: {
      EN: 'OLD DIGITAL OLYMPUS CAMERA',
      UA: 'СТАРА ЦИФРОВА КАМЕРА '
    },
    description: {
      EN: 'A dialogue between the dynamics of modern skateboarding and monumental shots from Fellinis "8 1/2," Vertigo, and Hitchcocks "Psycho."',
      UA: 'Діалог між динамікою сучасного скейтбордингу та монументальними кадрами з фільмів Фелліні «8 1/2», «Запаморочення» та «Психо» Гічкока.'
    }
  },
  {
    id: 'midwinter',
    category: 'skate',
    title: '"MIDWINTER"',
    meta: 'SKATE ARCHIVE / 01:21',
    cover: 'https://img.youtube.com/vi/Vh5Rm_21pcs/hqdefault.jpg',
    isComingSoon: false,
    youtubeId: 'Vh5Rm_21pcs',
    hasCustomMargin: false,
    titleText: {
      EN: 'STIROL SKATEBOARDING — "MIDWINTER"',
      UA: 'STIROL SKATEBOARDING — "MIDWINTER"'
    },
    metaText: {
      EN: 'FILMED IN 2014 BEFORE THE OCCUPATION OF DONBAS',
      UA: 'ЗНЯТО У 2014 ПЕРЕД ОКУПАЦІЄЮ ДОНБАСУ'
    },
    specs: {
      EN: 'OLD DIGITAL OLYMPUS CAMERA',
      UA: 'OLD DIGITAL OLYMPUS CAMERA'
    },
    description: {
      EN: 'Raw winter street skate clip from the archives. Cold concrete, heavy vibes, and the unyielding spirit of local skateboarding.',
      UA: 'Сирий зимовий стріт-скейт кліп з архівів. Холодний бетон, важкий вайб та непохитний дух локального скейтбордингу.'
    }
  },
  {
    id: 'fuck-the-roc',
    category: 'promo',
    title: '"FUCK THE ROC"',
    meta: 'PROMO / 00:59',
    // Теперь указываем прямую универсальную ссылку Wistia
    cover: 'https://fast.wistia.com/embed/medias/n4t76b56ad/swatch',
    isComingSoon: false,
    isComingSoon: false,
    wistiaId: 'n4t76b56ad', 
    hasCustomMargin: false,
    titleText: {
      EN: 'STIROL — "FUCK THE ROC" DROP',
      UA: 'STIROL — "FUCK THE ROC" ДРОП'
    },
    metaText: {
      EN: 'CONCEPT & ANIMATION BY STIROL',
      UA: 'ІДЕЯ ТА АНІМАЦІЯ ВІД STIROL'
    },
    specs: {
      EN: 'ANIMATION / RECONSTRUCTED ARCHIVES',
      UA: 'АНІМАЦІЯ / РЕКОНСТРУЙОВАНІ АРХІВИ'
    },
    description: {
      EN: 'An uncompromising post-industrial manifestation of order destruction. Merging low-fi documentary aesthetics, dark metal artwork, and high-intensity motion graphics.',
      UA: 'Безкомпромісний постіндустріальний маніфест руйнування порядку. Злиття лоу-фай документальної естетики, темної метал-графіки та інтенсивного моушн-дизайну.'
    }
  },

{
    id: 'we-back-home',
    category: 'promo',
    title: '"WE BACK HOME - PROMO"',
    meta: 'PROMO / 00:52',
    // Теперь указываем прямую универсальную ссылку Wistia
    cover: 'https://fast.wistia.com/embed/medias/zma5ui2qdw/swatch',
    isComingSoon: false,
    isComingSoon: false,
    wistiaId: 'zma5ui2qdw', 
    hasCustomMargin: false,
    titleText: {
      EN: 'WE BACK HOME - PROMO',
      UA: 'WE BACK HOME - PROMO'
    },
    metaText: {
      EN: 'CONCEPT & ANIMATION BY STIROL',
      UA: 'ІДЕЯ ТА АНІМАЦІЯ ВІД STIROL'
    },
    specs: {
      EN: 'DIY ANIMATION / RECONSTRUCTED ARCHIVES',
      UA: 'DIY АНІМАЦІЯ / РЕКОНСТРУЙОВАНІ АРХІВИ'
    },
    description: {
      EN: 'An uncompromising post-industrial manifestation of order destruction. Merging low-fi documentary aesthetics, dark metal artwork, and high-intensity motion graphics.',
      UA: 'Безкомпромісний постіндустріальний маніфест руйнування порядку. Злиття лоу-фай документальної естетики, темної метал-графіки та інтенсивного моушн-дизайну.'
    }
  },

{
    id: 'shopper-promo',
    category: 'promo',
    title: '"Stirol Shopper Bag Promo"',
    meta: 'PROMO / 00:28',
    // Теперь указываем прямую универсальную ссылку Wistia
     cover: 'https://fast.wistia.com/embed/medias/s2h1satpl8/swatch',
    isComingSoon: false,
    isComingSoon: false,
    wistiaId: 's2h1satpl8', 
    hasCustomMargin: false,
    titleText: {
      EN: 'STIROL — "FUCK THE ROC" DROP',
      UA: 'STIROL — "FUCK THE ROC" ДРОП'
    },
    metaText: {
      EN: 'CONCEPT & ANIMATION BY STIROL',
      UA: 'ІДЕЯ ТА АНІМАЦІЯ ВІД STIROL'
    },
    specs: {
      EN: 'DIY ANIMATION / RECONSTRUCTED ARCHIVES',
      UA: 'DIY АНІМАЦІЯ / РЕКОНСТРУЙОВАНІ АРХІВИ'
    },
    description: {
      EN: 'An uncompromising post-industrial manifestation of order destruction. Merging low-fi documentary aesthetics, dark metal artwork, and high-intensity motion graphics.',
      UA: 'Безкомпромісний постіндустріальний маніфест руйнування порядку. Злиття лоу-фай документальної естетики, темної метал-графіки та інтенсивного моушн-дизайну.'
    }
  },

{
    id: 'bad-timtes-promo',
    category: 'promo',
    title: '"Bad times, good friends"',
    meta: 'PROMO / 00:59',
    // Теперь указываем прямую универсальную ссылку Wistia
    cover: 'https://fast.wistia.com/embed/medias/azp3fz7bz1/swatch', 
    isComingSoon: false,
    isComingSoon: false,
    wistiaId: 'azp3fz7bz1', 
    hasCustomMargin: false,
    titleText: {
      EN: 'STIROL — "FUCK THE ROC" DROP',
      UA: 'STIROL — "FUCK THE ROC" ДРОП'
    },
    metaText: {
      EN: 'CONCEPT & ANIMATION BY STIROL',
      UA: 'ІДЕЯ ТА АНІМАЦІЯ ВІД STIROL'
    },
    specs: {
      EN: 'DIY ANIMATION / RECONSTRUCTED ARCHIVES',
      UA: 'DIY АНІМАЦІЯ / РЕКОНСТРУЙОВАНІ АРХІВИ'
    },
    description: {
      EN: 'An uncompromising post-industrial manifestation of order destruction. Merging low-fi documentary aesthetics, dark metal artwork, and high-intensity motion graphics.',
      UA: 'Безкомпромісний постіндустріальний маніфест руйнування порядку. Злиття лоу-фай документальної естетики, темної метал-графіки та інтенсивного моушн-дизайну.'
    }
  },
  {
    id: 'fast-life-promo',
    category: 'promo',
    title: '"FAST LIFE"',
    meta: 'PROMO / 00:59',
    // Теперь указываем прямую универсальную ссылку Wistia
  cover: 'https://fast.wistia.com/embed/medias/d26ss7r8xj/swatch', 
    isComingSoon: false,
    isComingSoon: false,
    wistiaId: 'd26ss7r8xj', 
    hasCustomMargin: false,
    titleText: {
      EN: 'STIROL — "FUCK THE ROC" DROP',
      UA: 'STIROL — "FUCK THE ROC" ДРОП'
    },
    metaText: {
      EN: 'CONCEPT & ANIMATION BY STIROL',
      UA: 'ІДЕЯ ТА АНІМАЦІЯ ВІД STIROL'
    },
    specs: {
      EN: 'DIY ANIMATION / RECONSTRUCTED ARCHIVES',
      UA: 'DIY АНІМАЦІЯ / РЕКОНСТРУЙОВАНІ АРХІВИ'
    },
    description: {
      EN: 'An uncompromising post-industrial manifestation of order destruction. Merging low-fi documentary aesthetics, dark metal artwork, and high-intensity motion graphics.',
      UA: 'Безкомпромісний постіндустріальний маніфест руйнування порядку. Злиття лоу-фай документальної естетики, темної метал-графіки та інтенсивного моушн-дизайну.'
    }
  },
  
];