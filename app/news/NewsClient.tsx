'use client';
import { useState, useEffect } from 'react';
import CommonLayout from '@/components/CommonLayout';
import { useLang } from '@/components/LangContext';
import { MAGAZINE_POSTS } from '@/app/data/news';

const ITEMS_PER_PAGE = 3;

export default function NewsClient() {
  const { lang } = useLang();
  const [activeIdx, setActiveIdx] = useState(0);
  const [innerPageIdx, setInnerPageIdx] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [shareText, setShareText] = useState('SHARE');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);

  const currentLang = lang as 'EN' | 'UA';

  const textStyles = {
    dateAndTag: "text-[9px] font-mono tracking-widest text-gray-400 uppercase space-x-2",
    tagButton: "hover:text-black transition-colors cursor-pointer underline underline-offset-2",
    title: "text-[14px] font-black tracking-wide leading-tight text-black uppercase",
    description: "text-[11px] text-gray-600 leading-relaxed tracking-tight uppercase font-sans overflow-y-auto max-h-[220px] pr-2 custom-scrollbar",
    shareBtnNormal: "bg-black text-white border border-black hover:bg-transparent hover:text-black",
    shareBtnCopied: "bg-pink-500 text-white border border-emerald-600",
    shareBtnBase: "text-[9px] font-mono font-bold tracking-widest px-4 py-2 transition-colors duration-200 uppercase mt-4 self-start"
  };

  const filteredPosts = activeTagFilter 
    ? MAGAZINE_POSTS.filter(post => post.tag.toUpperCase() === activeTagFilter.toUpperCase())
    : MAGAZINE_POSTS;

  const currentPost = filteredPosts[activeIdx] || filteredPosts[0] || MAGAZINE_POSTS[0];
  const currentPageData = currentPost?.pages[innerPageIdx] || currentPost?.pages[0];

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const visibleArchivePosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => { 
    setInnerPageIdx(0); 
  }, [activeIdx]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    if (postId) {
      const idx = MAGAZINE_POSTS.findIndex(p => p.id === postId);
      if (idx !== -1) setActiveIdx(idx);
    }
  }, []);

  const handlePrevPage = () => setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  const handleNextPage = () => setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?id=${currentPost.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShareText('COPIED!');
      setTimeout(() => setShareText('SHARE'), 2000);
    }).catch(() => {
      setShareText('ERROR');
      setTimeout(() => setShareText('SHARE'), 2000);
    });
  };

  const uiText = {
    EN: { page: 'PAGE', all: 'ALL NEWS' },
    UA: { page: 'СТОРІНКА', all: 'ВСІ НОВИНИ' }
  };

  const hasMultiplePages = currentPost?.pages.length > 1;

  return (
    <CommonLayout>
      <div className="w-full flex-grow flex items-center justify-between relative px-2 my-auto overflow-hidden">
        
        {hasMultiplePages && (
          <button 
            onClick={() => setInnerPageIdx((p) => (p > 0 ? p - 1 : currentPost.pages.length - 1))} 
            className="absolute left-0 z-20 w-10 h-24 bg-transparent text-black hover:text-gray-400 text-3xl font-black flex items-center justify-center transition-colors"
          >
            ←
          </button>
        )}

        <main className="w-full flex flex-col md:flex-row gap-12 items-start justify-center overflow-hidden px-12 py-6">
          
          <div className="w-full md:w-[50%] flex justify-start items-start">
            <div className="w-full block relative bg-transparent h-auto">
              {currentPageData?.image && (
                <img 
                  src={currentPageData.image} 
                  alt="" 
                  draggable="false"
                  onDragStart={(e) => e.preventDefault()}
                  className="w-full h-auto object-contain select-none pointer-events-none" 
                />
              )}
              
              {hasMultiplePages && (
                <div className="absolute bottom-3 left-3 bg-black/90 text-white text-[8px] font-bold px-2 py-0.5 tracking-widest uppercase">
                  {uiText[currentLang].page} {innerPageIdx + 1} / {currentPost.pages.length}
                </div>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-[50%] flex flex-col justify-start items-start text-left">
            <div className="space-y-4 pr-6 w-full flex flex-col">
              
              <div className={textStyles.dateAndTag}>
                <span>{currentPost?.date || "25/06/2026"}</span>
                <span className="text-gray-300">|</span>
                <button 
                  onClick={() => setActiveTagFilter(activeTagFilter ? null : currentPost.tag)}
                  className={textStyles.tagButton}
                >
                  #{currentPost?.tag}
                </button>
                {activeTagFilter && (
                  <>
                    <span className="text-gray-300">|</span>
                    <button onClick={() => setActiveTagFilter(null)} className="text-red-500 hover:text-black transition-colors">
                      [{uiText[currentLang].all}]
                    </button>
                  </>
                )}
              </div>

              <h2 className={textStyles.title}>
                {currentPost?.title[currentLang]}
              </h2>

              <p className={textStyles.description}>
                {currentPageData?.text[currentLang]}
              </p>

              <button 
                onClick={handleShare} 
                className={`${textStyles.shareBtnBase} ${shareText === 'COPIED!' ? textStyles.shareBtnCopied : textStyles.shareBtnNormal}`}
              >
                {shareText}
              </button>

            </div>
          </div>

        </main>

        {hasMultiplePages && (
          <button 
            onClick={() => setInnerPageIdx((p) => (p < currentPost.pages.length - 1 ? p + 1 : 0))} 
            className="absolute right-0 z-20 w-10 h-24 bg-transparent text-black hover:text-gray-400 text-3xl font-black flex items-center justify-center transition-colors"
          >
            →
          </button>
        )}
      </div>

      <div className="w-full flex flex-col items-center space-y-2 pb-2 flex-shrink-0">
        <div className="flex justify-center items-center space-x-3">
          {visibleArchivePosts.map((post) => {
            const globalIdx = filteredPosts.findIndex((p) => p.id === post.id);
            return (
              <div 
                key={post.id} 
                onClick={() => setActiveIdx(globalIdx)} 
                className={`w-16 h-11 overflow-hidden cursor-pointer transition-all border flex-shrink-0 ${activeIdx === globalIdx ? 'border-black scale-105' : 'border-transparent hover:opacity-80'}`}
              >
                <img 
                  src={post.pages[0].image} 
                  alt="" 
                  draggable="false"
                  onDragStart={(e) => e.preventDefault()}
                  className="w-full h-full object-cover select-none" 
                />
              </div>
            );
          })}
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center space-x-4 text-[9px] font-bold text-gray-400">
            <button onClick={handlePrevPage} className="hover:text-black transition-colors">←</button>
            <span className="font-mono text-[8px] tracking-widest">{currentPage + 1} / {totalPages}</span>
            <button onClick={handleNextPage} className="hover:text-black transition-colors">→</button>
          </div>
        )}
      </div>
    </CommonLayout>
  );
}