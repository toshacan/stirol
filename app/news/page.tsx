'use client';
import { useState, useEffect } from 'react';
import CommonLayout from '@/components/CommonLayout';
import { useLang } from '@/components/LangContext';
import { MAGAZINE_POSTS } from '@/app/data/news';


const ITEMS_PER_PAGE = 3;

export default function NewsPage() {
  const { lang } = useLang();
  const [activeIdx, setActiveIdx] = useState(0);
  const [innerPageIdx, setInnerPageIdx] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // Сбрасываем страницу контента при смене статьи
  useEffect(() => { setInnerPageIdx(0); }, [activeIdx]);

  const currentLang = lang as 'EN' | 'UA';
  const currentPost = MAGAZINE_POSTS[activeIdx];
  const currentPageData = currentPost.pages[innerPageIdx] || currentPost.pages[0];

  const totalPages = Math.ceil(MAGAZINE_POSTS.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const visibleArchivePosts = MAGAZINE_POSTS.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  const handleNextPage = () => setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));

  const uiText = {
    EN: { page: 'PAGE' },
    UA: { page: 'СТОРІНКА' }
  };

  return (
    <CommonLayout>
      <div className="w-full flex-grow flex items-center justify-between relative px-2 my-auto overflow-hidden">
        <button onClick={() => setInnerPageIdx((p) => (p > 0 ? p - 1 : currentPost.pages.length - 1))} className="absolute left-0 z-20 w-10 h-24 bg-transparent text-black hover:text-gray-400 text-3xl font-black flex items-center justify-center transition-colors">←</button>

        <main className="w-full flex flex-col md:flex-row gap-12 items-center justify-center overflow-hidden px-12">
          <div className="w-full md:w-[50%] flex justify-center items-center overflow-hidden">
            <div className="w-full aspect-[4/3] block overflow-hidden relative bg-transparent">
              <img src={currentPageData.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-black text-white text-[8px] font-bold px-2 py-0.5 tracking-widest">{currentPost.tag}</div>
              <div className="absolute bottom-3 left-3 bg-black/90 text-white text-[8px] font-bold px-2 py-0.5 tracking-widest uppercase">
                {uiText[currentLang].page} {innerPageIdx + 1} / {currentPost.pages.length}
              </div>
            </div>
          </div>
          <div className="w-full md:w-[50%] h-full flex flex-col justify-center overflow-hidden">
            <div className="space-y-4 pr-6">
              <h2 className="text-[13px] font-black tracking-wide leading-tight text-black uppercase">{currentPost.title[currentLang]}</h2>
              <p className="text-[10px] text-gray-500 leading-relaxed tracking-tight uppercase font-sans overflow-y-auto max-h-[160px] pr-2 custom-scrollbar">
                {currentPageData.text[currentLang]}
              </p>
            </div>
          </div>
        </main>

        <button onClick={() => setInnerPageIdx((p) => (p < currentPost.pages.length - 1 ? p + 1 : 0))} className="absolute right-0 z-20 w-10 h-24 bg-transparent text-black hover:text-gray-400 text-3xl font-black flex items-center justify-center transition-colors">→</button>
      </div>

      <div className="w-full flex flex-col items-center space-y-2 pb-2 flex-shrink-0">
        <div className="flex justify-center items-center space-x-3">
          {visibleArchivePosts.map((post) => {
            const globalIdx = MAGAZINE_POSTS.findIndex((p) => p.id === post.id);
            return (
              <div key={post.id} onClick={() => setActiveIdx(globalIdx)} className={`w-16 h-11 overflow-hidden cursor-pointer transition-all border flex-shrink-0 ${activeIdx === globalIdx ? 'border-black scale-105' : 'border-transparent hover:opacity-80'}`}>
                <img src={post.pages[0].image} alt="" className="w-full h-full object-cover" />
              </div>
            );
          })}
        </div>
        <div className="flex items-center space-x-4 text-[9px] font-bold text-gray-400">
          <button onClick={handlePrevPage} className="hover:text-black transition-colors">←</button>
          <span className="font-mono text-[8px] tracking-widest">{currentPage + 1} / {totalPages}</span>
          <button onClick={handleNextPage} className="hover:text-black transition-colors">→</button>
        </div>
      </div>
    </CommonLayout>
  );
}