export interface VideoItem {
  id: string;
  category: string;
  title: string;
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
    // Теперь указываем прямую универсальную ссылку Wistia
    cover: 'https://embed-ssl.wistia.com/deliveries/271977ad35a858ca38f142ff9a840338.jpg',
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
    
    // Теперь указываем прямую универсальную ссылку Wistia
    cover: 'https://embed-ssl.wistia.com/deliveries/3cb09e99b704c226f924e9bf74a9f49024911c0f.jpg',
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
      EN: '',
      UA: ''
    },
    description: {
      EN: 'An uncompromising post-industrial manifestation of order destruction. Merging low-fi documentary aesthetics, dark metal artwork, and high-intensity motion graphics.',
      UA: 'Безкомпромісний постіндустріальний маніфест руйнування порядку. Злиття лоу-фай документальної естетики, темної метал-графіки та інтенсивного моушн-дизайну.'
    }
  },

{
    id: 'we-back-home',
    category: 'promo',
    title: '"WE BACK HOME"',
    
    // Теперь указываем прямую универсальную ссылку Wistia
    cover: 'https://embed-ssl.wistia.com/deliveries/c8955e1f79f1f0c6f9262cb2de4e0424.jpg',
    isComingSoon: false,
    wistiaId: 'zma5ui2qdw', 
    hasCustomMargin: false,
    titleText: {
      EN: '"WE BACK HOME" - PROMO',
      UA: '"WE BACK HOME" - PROMO'
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
      EN: 'Another attempt to return home, another attempt to make something with my own hands, and another realization that home is no longer a place.',
      UA: 'Чергова спроба повернутися додому, чергова спроба створити щось власноруч — та чергове усвідомлення того, що дім — це більше не місце.'
    }
  },

{
    id: 'shopper-promo',
    category: 'promo',
    title: '"Stirol Shopper Bag Promo"',
    
    // Теперь указываем прямую универсальную ссылку Wistia
     cover: 'https://embed-ssl.wistia.com/deliveries/590e1618e87c52b04e7256ec3c79a89e.jpg',
    isComingSoon: false,
    wistiaId: 's2h1satpl8', 
    hasCustomMargin: false,
    titleText: {
      EN: '"Stirol Shopper Bag Promo"',
      UA: '"Stirol Shopper Bag Promo"'
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
      EN: 'Heavy beats, raw slums, and a deserted industrial zone. The first hands-on attempt to build something beautiful where everything else is standing still.',
      UA: 'Важкі біти, сирі трущоби й покинута індустріальна зона. Перша наочна спроба збудувати щось прекрасне там, де все інше зупинилося.'
    }
  },

{
    id: 'bad-timtes-promo',
    category: 'promo',
    title: '"Bad times, good friends"',
    
    // Теперь указываем прямую универсальную ссылку Wistia
    cover: 'https://embed-ssl.wistia.com/deliveries/ce1c7c70566e3284f045928d0539ee9e.jpg', 
    isComingSoon: false,
    wistiaId: 'azp3fz7bz1', 
    hasCustomMargin: false,
    titleText: {
      EN: '"Bad times, good friends"',
      UA: '"Bad times, good friends"'
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
      EN: '',
      UA: ''
    }
  },
  {
    id: 'fast-life-promo',
    category: 'promo',
    title: '"FAST LIFE"',
   
    // Теперь указываем прямую универсальную ссылку Wistia
  cover: 'https://embed-ssl.wistia.com/deliveries/d25a63870cbab1051247cf6104308d53.jpg', 
    isComingSoon: false,
    wistiaId: 'd26ss7r8xj', 
    hasCustomMargin: false,
    titleText: {
      EN: '"FAST LIFE" - STIROL"',
      UA: '"FAST LIFE" - STIROL"'
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
      EN: 'Late 2010s Kyiv. A record of pure existence and a collective drift into the unknown. Moving fast, because nobody knew what was coming next.',
      UA: 'Київ кінця 2010-х. Хроніка чистого буття та колективного дрейфу в невідомість. Стрімкий рух, адже ніхто не знав, що чекає попереду.'
    }
  },
  {
    id: 'rustam-riding',
    category: 'bmx-mtb',
    title: '"RUSTAM IS RIDING"',
    
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
  {
    id: 'zzozh',
    category: 'roots',
    title: '"ZZOЖ FULL MOVIE"',
   
    cover: 'https://img.youtube.com/vi/oRmxLTS8D1A/hqdefault.jpg',
    isComingSoon: false,
    youtubeId: 'oRmxLTS8D1A',
    hasCustomMargin: false,
    titleText: {
        EN: '"ZZOЖ FULL MOVIE"',
        UA: '"ZZOЖ FULL MOVIE"'
    },
    metaText: {
      EN: 'BMX AND SKATEBOARDING',
      UA: 'BMX ТА СКЕЙТБОРДИНГ'
    },
    specs: {
      EN: '',
      UA: ''
    },
    description: {
      EN: 'A film by the ZZOЖ crew, featuring skateboarders and BMX riders from Horlivka. Filmed between 2011 and 2012 in Horlivka and Donetsk, this video captured the final chapter for many of them before they walked away from riding. They did it their own way, making the best of what they had—with not a single skate shop or skatepark in their hometown. Just tricks, music, and the raw style of the early 2010s.',
      UA: 'Фільм від ZZOЖ crew за участю скейтбордистів та BMX-райдерів із Горлівки. Зняте між 2011 та 2012 роками в Горлівці та Донецьку, це відео зафіксувало заключну главу для багатьох із них перед тим, як вони залишили катання. Вони робили це по-своєму, витискаючи максимум із того, що мали — без жодного скейтшопу чи скейтпарку в рідному місті. Тільки трюки, музика та сирий стиль ранніх 2010-х.'
    }
  },
  {
    id: 'zzozh-teaser',
    category: 'roots',
    title: '"ZZOЖ TEASER"',
   
    cover: 'https://img.youtube.com/vi/29QpL1qXNJo/hqdefault.jpg',
    isComingSoon: false,
    youtubeId: '29QpL1qXNJo',
    hasCustomMargin: false,
    titleText: {
        EN: '"ZZOЖ TEASER"',
        UA: '"ZZOЖ TEASER"'
    },
    metaText: {
      EN: 'BMX AND SKATEBOARDING',
      UA: 'BMX ТА СКЕЙТБОРДИНГ'
    },
    specs: {
      EN: '',
      UA: ''
    },
    description: {
      EN: '',
      UA: ''
    }
  },

];