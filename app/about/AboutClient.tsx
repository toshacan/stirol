'use client';
import CommonLayout from '@/components/CommonLayout';
import { useLang } from '@/components/LangContext';

interface ContentBlock {
  title: string;
  p1: string;
  p2: string;
}

export default function AboutClient() {
  const { lang } = useLang();
  const currentLang = (lang === 'UA' ? 'UA' : 'EN') as 'EN' | 'UA';

  const manifest: Record<'EN' | 'UA', ContentBlock> = {
    EN: {
      title: 'ABOUT',
      p1: 'STIROL — INDEPENDENT CLOTHING IMPRINT, STARTED IN 2012 BY SKATEBOARDERS IN HORLIVKA, DONBAS. INDUSTRIAL LANDSCAPES, BROKEN CONCRETE, UNDERGROUND STREET CULTURE — THATS WHERE THIS COMES FROM.',
      p2: 'RAW BLACK METAL. PUNK THAT DOESNT ASK PERMISSION. OLD SCHOOL HIP-HOP. STREET SKATING SHOT ON DYING VHS CAMERAS. NO TRENDS. JUST THE CONCRETE AGE, RECORDED AS IT IS.'
    },
    UA: {
      title: 'ПРО БРЕНД',
      p1: 'STIROL — НЕЗАЛЕЖНИЙ ОДЯГОВИЙ ІМПРИНТ, ЗАПОЧАТКОВАНИЙ У 2012 РОЦІ СКЕЙТБОРДИСТАМИ В ГОРЛІВЦІ, ДОНБАС. ІНДУСТРІАЛЬНІ ЛАНДШАФТИ, РОЗБИТИЙ БЕТОН, АНДЕГРАУНДНА ВУЛИЧНА КУЛЬТУРА — ОСЬ ЗВІДКИ ЦЕ ВСЕ ПІШЛО.',
      p2: 'СИРИЙ BLACK METAL. ПАНК, ЯКИЙ НЕ ПИТАЄ ДОЗВОЛУ. OLD SCHOOL HIP-HOP. ВУЛИЧНИЙ СКЕЙТИНГ, ЗНЯТИЙ НА ВМИРАЮЧІ VHS-КАМЕРИ. ЖОДНИХ ТРЕНДІВ. ТІЛЬКИ ЕПОХА БЕТОНУ, ЗАФІКСОВАНА ТАКОЮ, ЯКОЮ ВОНА Є.'
    }
  };

  const currentData = manifest[currentLang];

  return (
    <CommonLayout>
      <main className="max-w-xl mx-auto my-auto py-16 text-center px-4">
        <h1 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-8">
          {currentData.title}
        </h1>
        
        <div className="space-y-6 text-xs leading-relaxed uppercase tracking-wider text-[#121212] font-medium">
          <p>{currentData.p1}</p>
          <p>{currentData.p2}</p>
        </div>
      </main>
    </CommonLayout>
  );
}