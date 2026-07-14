'use client';
import CommonLayout from '@/components/CommonLayout';
import { useLang } from '@/components/LangContext';

interface ContentBlock {
  title: string;
  p1: string;
  p2: string;
  p3: string;
}

export default function AboutClient() {
  const { lang } = useLang();
  const currentLang = (lang === 'UA' ? 'UA' : 'EN') as 'EN' | 'UA';

  const manifest: Record<'EN' | 'UA', ContentBlock> = {
    EN: {
      title: 'ABOUT',
      p1: 'STIROL started in 2012 in Horlivka — a group of skaters filming each other on dying VHS cameras because there was nothing else to do in an industrial town like this.',
      p2: 'The crew became one person. The footage became an archive. At some point, the archive needed something to wear — so the clothes came out of the same place the videos did. Now it\'s all here: the footage, the pieces, the record of what this place actually looks like.',
      p3: 'Raw black metal. Punk that doesn\'t ask permission. Old school hip-hop. No trends. Just the concrete age, recorded as it is.'
    },
    UA: {
      title: 'ПРО БРЕНД',
      p1: 'STIROL зародився у 2012 році в Горлівці — тусовка скейтерів знімала одне одного на вмираючі VHS-камери просто тому, що в такому індустріальному місті більше не було чим зайнятися.',
      p2: 'З часом команда перетворилася на одну людину. Кадри стали архівом. У якийсь момент архіву знадобилося щось носити — тому одяг вийшов звідти ж, звідки й відео. Тепер усе тут: плівка, речі та хроніка того, як це місце виглядає насправді.',
      p3: 'Сирий блек-метал. Панк, що не питає дозволу. Олдскульний хіп-хоп. Жодних трендів. Лише епоха бетону, зафіксована такою, якою вона є.'
    }
  };

  const currentData = manifest[currentLang];

  return (
    <CommonLayout>
      <main className="max-w-xl mx-auto my-auto py-16 text-center px-4">
        {/* Заголовок залишається великими літерами з широким трекінгом */}
        <h1 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-8">
          {currentData.title}
        </h1>
        
        {/* Прибрано uppercase та tracking-wider для звичайного регістру, розмір змінено на text-sm для читабельності */}
        <div className="space-y-6 text-sm leading-relaxed text-[#121212] font-medium text-left sm:text-center">
          <p>{currentData.p1}</p>
          <p>{currentData.p2}</p>
          <p>{currentData.p3}</p>
        </div>
      </main>
    </CommonLayout>
  );
}