'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import CommonLayout from '@/components/CommonLayout';
import { useLang } from '@/components/LangContext';
import { MAGAZINE_POSTS } from '@/app/data/news';

export default function NewsClient() {
  const { lang } = useLang();
  const [activeIdx, setActiveIdx] = useState(0);
  const [innerPageIdx, setInnerPageIdx] = useState(0);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);

  const currentLang = lang as 'EN' | 'UA';

  const uiText = {
    EN: { share: 'SHARE', copied: 'COPIED', all: 'ALL NEWS', close: 'CLOSE', archive: 'ARCHIVE' },
    UA: { share: 'ПОДІЛИТИСЯ', copied: 'СКОПІЙОВАНО', all: 'ВСІ НОВИНИ', close: 'ЗАКРИТИ', archive: 'АРХІВ' }
  };

  const filteredPosts = activeTagFilter 
    ? MAGAZINE_POSTS.filter(post => post.tag.toUpperCase() === activeTagFilter.toUpperCase())
    : MAGAZINE_POSTS;

  const currentPost = filteredPosts[activeIdx] || filteredPosts[0] || MAGAZINE_POSTS[0];
  const currentPageData = currentPost?.pages[innerPageIdx] || currentPost?.pages[0];

  useEffect(() => { setInnerPageIdx(0); }, [activeIdx]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    if (postId) {
      const idx = MAGAZINE_POSTS.findIndex(p => p.id === postId);
      if (idx !== -1) setActiveIdx(idx);
    }
  }, []);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/news?id=${currentPost.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const hasMultiplePages = currentPost?.pages.length > 1;

  // РЕНДЕР АРХИВА
  if (isArchiveOpen) {
    return (
      <div className="w-full min-h-screen bg-white text-black p-6 md:p-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h3 className="font-bold tracking-widest uppercase text-[10px]">
                {activeTagFilter ? `#${activeTagFilter}` : uiText[currentLang].archive}
            </h3>
            <button 
                onClick={() => setIsArchiveOpen(false)} 
                className="text-[14px] md:text-[16px] font-bold uppercase hover:text-gray-400 transition-colors"
            >
                {uiText[currentLang].close}
            </button>
          </div>
          
          {/* УМНАЯ СЕТКА: от 2 колонок на мобильном до 6 на десктопе */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12 pb-24">
            {filteredPosts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => { 
                    setActiveIdx(MAGAZINE_POSTS.findIndex(p => p.id === post.id)); 
                    setIsArchiveOpen(false); 
                }}
                className="cursor-pointer group flex flex-col"
              >
                <div className="overflow-hidden mb-3 w-full bg-gray-100">
                  {post.pages[0]?.image && (
                    <Image 
                      src={post.pages[0].image} 
                      alt="" 
                      width={400} 
                      height={533} 
                      className="w-full h-auto object-cover aspect-[3/4] transition-transform duration-700 group-hover:scale-105" 
                    />
                  )}
                </div>
                <div className="text-[9px] uppercase font-bold tracking-widest leading-snug">{post.title[currentLang]}</div>
                <div className="text-[8px] uppercase text-gray-400 mt-1">#{post.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ОСНОВНОЙ РЕНДЕР СТАТЬИ
  return (
    <CommonLayout>
      <div className="w-full flex-grow flex items-center justify-between relative px-2 my-auto overflow-hidden">
        
        {hasMultiplePages && (
            <>
                <div className="absolute inset-y-0 left-0 w-20 z-10 cursor-pointer md:hidden" onClick={() => setInnerPageIdx(p => (p > 0 ? p - 1 : currentPost.pages.length - 1))} />
                <div className="absolute inset-y-0 right-0 w-20 z-10 cursor-pointer md:hidden" onClick={() => setInnerPageIdx(p => (p < currentPost.pages.length - 1 ? p + 1 : 0))} />
            </>
        )}

        <main className="w-full flex flex-col md:flex-row gap-12 items-start justify-center px-6 md:px-12 py-6">
          <div className="w-full md:w-[50%] relative aspect-[4/3]">
             {currentPageData?.image && (
               <Image src={currentPageData.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" draggable={false} className="object-contain select-none" />
             )}
          </div>
          
          <div className="w-full md:w-[50%] flex flex-col justify-start items-start">
            <div className="space-y-4 w-full">
              <div className="text-[9px] font-mono tracking-widest text-gray-400 uppercase flex items-center space-x-3">
                <span>{currentPost?.date}</span>
                <span className="text-gray-300">|</span>
                <button 
                  onClick={() => { setActiveTagFilter(currentPost.tag); setIsArchiveOpen(true); }}
                  className="hover:text-black transition-colors underline underline-offset-2"
                >
                  #{currentPost?.tag}
                </button>
                <span className="text-gray-300">|</span>
                
                <button 
                  onClick={handleShare} 
                  className={`px-1.5 py-0.5 text-[8px] uppercase border transition-all duration-300 ${isCopied ? 'bg-pink-400 border-pink-400 text-white' : 'bg-transparent text-black border-black hover:bg-black hover:text-white'}`}
                >
                  {isCopied ? uiText[currentLang].copied : uiText[currentLang].share}
                </button>
              </div>

              <h2 className="text-[18px] font-black tracking-wide leading-tight text-black uppercase">
                {currentPost?.title[currentLang]}
              </h2>

              <p className="text-[11px] text-gray-800 leading-[1.9] tracking-normal uppercase font-sans max-h-[220px] overflow-y-auto pr-2">
                {currentPageData?.text[currentLang]}
              </p>
            </div>
          </div>
        </main>
      </div>

      <div className="w-full flex justify-center pb-8 pt-4">
        <button 
          onClick={() => { setActiveTagFilter(null); setIsArchiveOpen(true); }}
          className="text-[9px] font-bold tracking-[0.2em] uppercase hover:underline cursor-pointer"
        >
          {uiText[currentLang].all}
        </button>
      </div>
    </CommonLayout>
  );
}