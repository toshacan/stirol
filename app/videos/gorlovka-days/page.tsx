'use client';
import CommonLayout from '@/components/CommonLayout';
import { useLang } from '@/components/LangContext';
import Link from 'next/link';

export default function VideoPlayerPage() {
  const { lang } = useLang();
  const currentLang = lang as 'EN' | 'UA';

  const content = {
    EN: {
      back: '← BACK TO ARCHIVE',
      title: 'STIROL SKATEBOARDING — "GORLOVKA DAYS"',
      meta: 'FILMED IN 2012-2014 / DONBAS ARCHIVES',
      specs: 'CAMERA: SONY DCR-VX1000 (PAL) + CENTURY MK1 FISHEYE\nFORMAT: 4:3 MINI-DV\nEDIT: ANTON SICAK',
      description: 'Authentic skate video from the streets of Gorlovka, captured on the legendary VX1000 setup before the war. Raw street skating, local spots, and the genuine energy of industrial youth culture in early 2010s.'
    },
    UA: {
      back: '← НАЗАД ДО АРХІВУ',
      title: 'STIROL SKATEBOARDING — "GORLOVKA DAYS"',
      meta: 'ЗНЯТО У 2012-2014 / АРХІВИ ДОНБАСУ',
      specs: 'КАМЕРА: SONY DCR-VX1000 (PAL) + CENTURY MK1 FISHEYE\nФОРМАТ: 4:3 MINI-DV\nМОНТАЖ: АНТОН СІЦАК',
      description: 'Автентичне скейт-відео з вулиць Горлівки, зняте на легендарну VX1000 ще до початку війни. Сирої стріт-скейтинг, локальні споти та справжня енергія індустріальної молодіжної культури початку 2010-х років.'
    }
  };

  return (
    <CommonLayout>
      {/* КНОПКА СРАЗУ ПОД ХЕДЕРОМ */}
      <div className="px-4 mt-8">
        <Link href="/videos" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
          {content[currentLang].back}
        </Link>
      </div>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <div className="w-full flex flex-col lg:flex-row gap-8 items-start my-auto px-4 mt-4">
        
        {/* ЛЕВАЯ СТОРОНА: ПЛЕЕР */}
        <div className="w-full lg:w-[70%] aspect-video bg-black border border-gray-200 overflow-hidden shadow-sm">
          <iframe 
            className="w-full h-full"
            src="https://www.youtube.com/embed/p67mBwbgjyg?autoplay=1&mute=0" 
            title="GORLOVKA DAYS"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          />
        </div>

        {/* ПРАВАЯ СТОРОНА: ОПИСАНИЕ */}
        <div className="w-full lg:w-[30%] flex flex-col space-y-6 text-left max-w-sm">
          <div className="space-y-1">
            <h1 className="text-xs font-bold uppercase tracking-wider text-black">
              {content[currentLang].title}
            </h1>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest">
              {content[currentLang].meta}
            </p>
          </div>

          <div className="text-[9px] text-gray-500 uppercase tracking-wider leading-relaxed whitespace-pre-line border-t border-b border-gray-100 py-3 font-sans">
            {content[currentLang].specs}
          </div>

          <p className="text-[10px] text-gray-600 leading-relaxed uppercase tracking-tight font-sans">
            {content[currentLang].description}
          </p>
        </div>

      </div>
    </CommonLayout>
  );
}