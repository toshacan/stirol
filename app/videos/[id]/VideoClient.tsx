'use client';
import CommonLayout from '@/components/CommonLayout';
import { useLang } from '@/components/LangContext';
import Link from 'next/link';
import { VideoItem } from '@/app/data/videos';

interface VideoClientProps {
  video: VideoItem;
}

export default function VideoClient({ video }: VideoClientProps) {
  const { lang } = useLang();
  const currentLang = (lang === 'UA' ? 'UA' : 'EN') as 'EN' | 'UA';

  const labels = {
    EN: { back: '← BACK TO ARCHIVE' },
    UA: { back: '← НАЗАД ДО АРХІВУ' }
  };

  return (
    <CommonLayout>
      <div className="px-4 mt-8">
        <Link href="/videos" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
          {labels[currentLang].back}
        </Link>
      </div>

      <div className={`w-full flex flex-col lg:flex-row gap-8 items-start px-4 mt-4 pb-16 md:pb-24 
        ${video.hasCustomMargin ? 'mb-12 md:mb-16' : 'my-auto'}`}
      >
        
        {/* ЛЕВАЯ СТОРОНА: УМНЫЙ ПЛЕЕР */}
        <div className="w-full lg:w-[70%] aspect-video bg-black border border-gray-200 overflow-hidden shadow-sm relative">
          {video.wistiaId ? (
            <iframe 
              src={`https://fast.wistia.net/embed/iframe/${video.wistiaId}?autoplay=false`}
              title={video.title}
              allow="autoplay; fullscreen"
              allowFullScreen
              className="w-full h-full border-0 absolute top-0 left-0 object-contain"
            />
          ) : video.youtubeId ? (
            <iframe 
              className="w-full h-full border-0"
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&mute=0`} 
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] uppercase text-gray-400 tracking-widest">
              Video Unavailable
            </div>
          )}
        </div>

        {/* ПРАВАЯ СТОРОНА: ОПИСАНИЕ */}
        <div className="w-full lg:w-[30%] flex flex-col space-y-6 text-left max-w-sm">
          <div className="space-y-1">
            <h1 className="text-xs font-bold uppercase tracking-wider text-black">
              {video.titleText[currentLang]}
            </h1>
            {video.metaText[currentLang] && (
              <p className="text-[9px] text-gray-400 uppercase tracking-widest">
                {video.metaText[currentLang]}
              </p>
            )}
          </div>

          {video.specs[currentLang] && (
            <div className="text-[9px] text-gray-500 uppercase tracking-wider leading-relaxed whitespace-pre-line border-t border-b border-gray-100 py-3 font-sans">
              {video.specs[currentLang]}
            </div>
          )}

          {video.description[currentLang] && (
            <p className="text-[10px] text-gray-600 leading-relaxed uppercase tracking-tight font-sans">
              {video.description[currentLang]}
            </p>
          )}
        </div>

      </div>
    </CommonLayout>
  );
}