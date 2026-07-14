'use client';
import { useState } from 'react';
import CommonLayout from '@/components/CommonLayout';
import { useLang } from '@/components/LangContext';
import Link from 'next/link';
import Image from 'next/image';
import { VIDEOS } from '@/app/data/videos';

export default function VideosClient() {
  const { lang } = useLang();
  const [activeFilter, setActiveFilter] = useState('all');
  const currentLang = lang as 'EN' | 'UA';

  const menuFilters = {
    EN: [
      { id: 'all', label: 'all' },
      { id: 'skate', label: 'skate' },
      { id: 'promo', label: 'promo' },
      { id: 'bmx-mtb', label: 'bmx/mtb' },
      { id: 'roots', label: 'roots' },
    ],
    UA: [
      { id: 'all', label: 'всі' },
      { id: 'skate', label: 'скейт' },
      { id: 'promo', label: 'промо' },
      { id: 'bmx-mtb', label: 'bmx/mtb' },
      { id: 'roots', label: 'коріння' },
    ],
  };

  const filteredVideos = VIDEOS.filter((v) => activeFilter === 'all' || v.category === activeFilter);

  return (
    <CommonLayout>
      <div className="w-full flex flex-col md:flex-row mt-12 md:mt-16 gap-8 items-start px-4 mb-32">
        {/* Навигация (меню фильтров) */}
        <nav className="w-full md:w-48 flex flex-row md:flex-col flex-wrap gap-x-4 gap-y-1 text-[11px] uppercase tracking-wider text-left border-b md:border-b-0 pb-4 md:pb-0 border-gray-200">
          {menuFilters[currentLang].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`block py-0.5 font-bold transition-colors ${
                activeFilter === filter.id ? 'text-black underline' : 'text-gray-400 hover:text-black'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </nav>

        {/* Сетка видео: компактные квадратные плитки, Ч/Б → цвет на ховере.
            Изображение внутри чуть увеличено (scale) — это обрезает по краям
            те самые чёрные полосы леттербоксинга, зашитые в горизонтальные превью,
            без необходимости менять форму самой плитки. */}
        <main className="flex-grow w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-10">
            {filteredVideos.map((video) =>
              video.isComingSoon ? (
                <div key={video.id} className="flex flex-col space-y-2 opacity-30">
                  <div className="aspect-square bg-white border border-gray-100 flex items-center justify-center p-4">
                    <div className="text-[9px] text-gray-400 uppercase tracking-widest">COMING SOON</div>
                  </div>
                  <div className="flex flex-col text-[10px] uppercase tracking-wider space-y-0.5">
                    <span className="text-gray-400 font-bold">{video.title}</span>
                    <span className="text-gray-400 font-sans"></span>
                  </div>
                </div>
              ) : (
                <Link
                  href={`/videos/${video.id}`}
                  key={video.id}
                  className="flex flex-col space-y-2 group cursor-pointer"
                >
                  <div className="aspect-square bg-black border border-gray-100 flex items-center justify-center overflow-hidden relative group-hover:border-gray-400 transition-all duration-300">
                    <Image
                      src={video.cover || '/logo-heavy.png'}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover scale-[1.35]  group-hover:scale-[1.42] transition-all duration-500 ease-out"
                    />
                    <div className="absolute bg-white/90 text-black text-[10px] tracking-widest font-bold px-2 py-1 uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      PLAY
                    </div>
                  </div>
                  <div className="flex flex-col text-[10px] uppercase tracking-wider space-y-0.5">
                    <span className="text-black font-bold group-hover:underline">{video.title}</span>
                    <span className="text-gray-400 font-sans font-bold"></span>
                  </div>
                </Link>
              )
            )}
          </div>
        </main>
      </div>
    </CommonLayout>
  );
}