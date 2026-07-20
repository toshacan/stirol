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
      p1: 'STIROL was founded in 2012 as a skate crew by skaters from Horlivka.',
      p2: 'We filmed videos. Not trying to copy anyone, just shooting the way we felt and the way we could, on cameras from our parents\' closets.',
      p3: 'Skateboarding came and went, but the idea stayed. DIY pieces, small drops, all of it was part of becoming something bigger than what we started as.'
    },
    UA: {
      title: 'ПРО НАС',
      p1: 'STIROL заснували у 2012 році як скейт-крю скейтери з Горлівки.',
      p2: 'Ми знімали відео. Не намагаючись комусь наслідувати, просто знімали так, як відчували і як вміли, на камери з батьківських шаф.',
      p3: 'Скейтбординг то йшов, то повертався, але ідея залишалась. DIY-речі, невеликі дропи, все це було частиною того, як ми ставали чимось більшим, ніж те, з чого починали.'
    }
  };

  const currentData = manifest[currentLang];

  return (
    <CommonLayout>
      <main className="w-full max-w-xl mx-auto my-auto py-16 px-4">
        <h1 className="text-xs font-bold uppercase tracking-widest text-black mb-6 text-center">
          {currentData.title}
        </h1>

        <div className="space-y-4 text-[12px] leading-[1.8] text-gray-700 max-w-lg">
          <p>{currentData.p1}</p>
          <p>{currentData.p2}</p>
          <p>{currentData.p3}</p>
        </div>
      </main>
    </CommonLayout>
  );
}