'use client';
import CommonLayout from '@/components/CommonLayout';
import { useLang } from '@/components/LangContext';

// Создаем описание структуры данных, чтобы TS понимал, что к чему
interface ContentBlock {
  title: string;
  p1: string;
  p2: string;
}

export default function AboutPage() {
  const { lang } = useLang();

  // Явно указываем тип данных для manifest
  const manifest: Record<'EN' | 'UA', ContentBlock> = {
    EN: {
      title: 'ABOUT',
      p1: 'STIROL IS AN INDEPENDENT CLOTHING IMPRINT FOUNDED IN 2012 BY SKATEBOARDERS WITHIN THE INDUSTRIAL LANDSCAPES OF THE UKRAINIAN DONBAS (Horlivka). THE PROJECT MERGES THE RAW ESTHETICS OF HEAVY INDUSTRY WITH UNDERGROUND SUBSTREET CULTURES.',
      p2: 'OUR DNA WAS FORMED AT THE INTERSECTION OF RAW BLACK METAL, THE UNCOMPROMISING SPIRIT OF DIY PUNK ROCK, AND HARDCORE STREET SKATEBOARDING FILMED ON OLD VIDEO CAMERAS. WE DON’T FOLLOW TRENDS; WE RECORD THE ESTHETICS OF THE CONCRETE AGE.'
    },
    UA: {
      title: 'ПРО БРЕНД',
      p1: 'STIROL — ЦЕ НЕЗАЛЕЖНИЙ БРЕНД ОДЯГУ, ЗАСНОВАНИЙ У 2012 РОЦІ СКЕЙТБОРДИСТАМИ СЕРЕД ІНДУСТРІАЛЬНИХ ЛАНДШАФТІВ УКРАЇНСЬКОГО ДОНБАСУ (ГОРЛІВКА). ПРОЄКТ ОБ’ЄДНУЄ СИРУ ЕСТЕТИКУ ВАЖКОЇ ПРОМИСЛОВОСТІ ТА АНДЕГРАУНДНИХ ВУЛИЧНИХ КУЛЬТУР.',
      p2: 'НАШЕ ДНК СФОРМУВАЛОСЯ НА ПЕРЕТИНІ СИРОГО БЛЕК-МЕТАЛУ, БЕЗКОМПРОМІСНОГО ДУХУ DIY ПАНК-РОКУ ТА ЖОРСТКОГО СТРІТ-СКЕЙТБОРДИНГУ, ЗНЯТОГО НА СТАРІ ВІДЕОКАМЕРИ. МИ НЕ СЛІДУЄМО ТРЕНДАМ — МИ ДОКУМЕНТУЄМО ЕСТЕТИКУ БЕТОННОЇ ЕПОХИ.'
    }
  };

  // Теперь TypeScript знает, что currentData будет объектом с полями title, p1, p2
  const currentData = manifest[lang as 'EN' | 'UA'];

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