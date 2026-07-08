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
    id: 'ugliness',
    category: 'skate',
    title: '"UGLINESS"',
    meta: 'SKATE ARCHIVE / 00:59',
    // Теперь указываем прямую универсальную ссылку Wistia
    cover: 'https://fast.wistia.com/embed/medias/v5gqmtkqb8/swatch',
    isComingSoon: false,
    wistiaId: 'v5gqmtkqb8', 
    hasCustomMargin: false,
    titleText: {
      EN: '"UGLINESS"',
      UA: '"UGLINESS"'
    },
    metaText: {
      EN: 'CONCEPT & ANIMATION BY STIROL',
      UA: 'ІДЕЯ ТА АНІМАЦІЯ ВІД STIROL'
    },
    specs: {
      EN: '',
      UA: ''
    },
    description: {
      EN: 'A raw, unfiltered testament to movement in a static world. Shot entirely on the streets of occupied Horlivka, Ugliness blends crisp digital reality with gritty VHS aesthetics to capture the restless pulse of the underground. This isnt just a skate tape; its a visual excision of the ordinary. Navigating brutalist architecture, empty public transport, and decaying concrete, the video highlights the harsh contrast between a city frozen in time and the relentless energy of youth pushing forward. Find freedom in the grey. Make noise in the silence.',
      UA: 'Сирий, нефільтрований доказ руху в статичному світі. Знятий на вулицях окупованої Горлівки, Ugliness поєднує чітку цифрову реальність із брудною VHS-естетикою, щоб передати неспокійний пульс андеграунду. Це не просто скейт-відео; це візуальне висічення буденності. Рухаючись крізь бруталістську архітектуру, порожній громадський транспорт та побитий бетон.'
    }
  },
  {
    id: 'sscrew',
    category: 'skate',
    title: '"Stirol Skateboarding"',
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
  {
    id: 'rustam-riding',
    category: 'bmx-mtb',
    title: '"RUSTAM IS RIDING"',
    meta: 'BMX ARCHIVE / 01:23',
    cover: 'https://img.youtube.com/vi/NAIl6qK-tkw/hqdefault.jpg',
    isComingSoon: false,
    youtubeId: 'NAIl6qK-tkw',
    hasCustomMargin: false,
    titleText: {
        EN: '"RUSTAM IS RIDING"',
        UA: '"РУСТАМ КАТАЄТЬСЯ"'
    },
    metaText: {
      EN: 'OLD BMX STIROL BMX ARCHOVE',
      UA: 'BMX АРХІВ STIROL'
    },
    specs: {
      EN: '',
      UA: ''
    },
    description: {
      EN: 'A classic street edit. Fisheye, heavy bails, fast punk rock, and local spots. It’s not about perfect conditions; it’s about pushing through the pain to get the clip.',
      UA: 'Класичний стріт-едіт. Фішай, жорсткі падіння, швидкий панк-рок і локальні споти. Жодних ідеальних умов — лише біль, спроби та врешті-решт взятий трюк.'
    }
  },
  {
    id: 'rustam-classic',
    category: 'bmx-mtb',
    title: '"CLASSIC PART"',
    meta: 'BMX ARCHIVE / 01:23',
    cover: 'https://img.youtube.com/vi/m2JVF6ztF14/hqdefault.jpg',
    isComingSoon: false,
    youtubeId: 'm2JVF6ztF14',
    hasCustomMargin: false,
    titleText: {
        EN: '"CLASSIC PART"',
        UA: '"CLASSIC PART"'
    },
    metaText: {
      EN: 'OLDSCHOOL BMX PART',
      UA: 'OLDSCHOOL BMX PART'
    },
    specs: {
      EN: '',
      UA: ''
    },
    description: {
      EN: 'A tribute to the golden era of street riding. Shot entirely through a classic fisheye lens, this edit captures the pure, unfiltered momentum of BMX and MTB in a concrete playground.',
      UA: 'Данина поваги золотій ері вуличного катання. Знятий повністю через класичний обєктив fisheye, цей едіт передає чисту, нефільтровану інерцію BMX та MTB у бетонних джунглях.'
    }
  },
  
];