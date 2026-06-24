'use client';
import { useState } from 'react';
import CommonLayout from '@/components/CommonLayout';
import { useLang } from '@/components/LangContext';

const LOOKBOOK_PRODUCTS = [
  {
    id: 'studio-session-01',
    title: { EN: 'ARCHIVE ESSENTIALS — VOLUME I', UA: 'АРХІВНІ ОСНОВИ — ЧАСТИНА I' },
    description: {
      EN: 'Collection 2026 core concepts. Focus on industrial textures and raw garment assembly.',
      UA: 'Ключові концепти колекції 2026. Фокус на індустріальних текстурах та сирому крої.'
    },
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'industrial-details',
    title: { EN: 'RAW MATERIALS & CANVAS', UA: 'СИРОВИНА ТА КАНВАС' },
    description: {
      EN: 'Heavyweight military-grade canvas textures. Built for durability in urban environments.',
      UA: 'Важкі текстури мілітарі канвасу. Створено для довговічності в міських умовах.'
    },
    images: [
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'generation-archive',
    title: { EN: 'STIROL OBJECTS — SECTOR B', UA: 'ОБ\'ЄКТИ STIROL — СЕКТОР B' },
    description: {
      EN: 'Limited reissue of oversized fits. Minimal branding, structured forms.',
      UA: 'Лімітоване перевидання оверсайз крою. Мінімалістичний брендинг, структуровані форми.'
    },
    images: [
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1445205170230-053b830c6038?w=1200&auto=format&fit=crop&q=80'
    ]
  }
];

export default function LookbookPage() {
  const { lang } = useLang();
  const [activeProductIdx, setActiveProductIdx] = useState(0);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  
  const currentProduct = LOOKBOOK_PRODUCTS[activeProductIdx];
  const currentLang = lang as 'EN' | 'UA';

  const uiText = {
    EN: { prevItem: 'PREV ITEM', nextItem: 'NEXT ITEM' },
    UA: { prevItem: 'ПОПЕР. РІЧ', nextItem: 'НАСТ. РІЧ' }
  };

  return (
    <CommonLayout>
      <main className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-4 mt-8">
        
        {/* ЛЕВАЯ ЧАСТЬ: ФОТО (сделали шире) */}
        <div className="w-full md:w-[68%] flex flex-col gap-4">
          <div className="w-full aspect-[4/3] relative group flex items-center justify-center overflow-hidden bg-gray-50">
            <img 
              src={currentProduct.images[activeImgIdx]} 
              alt={currentProduct.title[currentLang]} 
              className="w-full h-full object-cover"
            />
            {/* Стрелки переключения фото */}
            <button onClick={() => setActiveImgIdx((p) => (p - 1 + currentProduct.images.length) % currentProduct.images.length)} className="absolute left-0 top-0 bottom-0 w-1/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-start pl-4 text-white text-3xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">←</button>
            <button onClick={() => setActiveImgIdx((p) => (p + 1) % currentProduct.images.length)} className="absolute right-0 top-0 bottom-0 w-1/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end pr-4 text-white text-3xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">→</button>
            <div className="absolute bottom-3 right-3 bg-white/95 text-black font-mono text-[9px] px-2 py-0.5 tracking-wider font-bold">
              {activeImgIdx + 1} / {currentProduct.images.length}
            </div>
          </div>

          <div className="w-full flex justify-between items-start pt-1">
            <div className="space-y-1 text-left max-w-[60%]">
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-black">{currentProduct.title[currentLang]}</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-tight leading-relaxed font-sans">{currentProduct.description[currentLang]}</p>
            </div>
            {/* Вернули кнопки с полным текстом */}
            <div className="flex gap-2 text-[9px] font-bold">
              <button onClick={() => { setActiveImgIdx(0); setActiveProductIdx((p) => (p - 1 + LOOKBOOK_PRODUCTS.length) % LOOKBOOK_PRODUCTS.length); }} className="px-3 py-1.5 border border-black hover:bg-black hover:text-white transition-all uppercase tracking-widest">{uiText[currentLang].prevItem}</button>
              <button onClick={() => { setActiveImgIdx(0); setActiveProductIdx((p) => (p + 1) % LOOKBOOK_PRODUCTS.length); }} className="px-3 py-1.5 border border-black hover:bg-black hover:text-white transition-all uppercase tracking-widest">{uiText[currentLang].nextItem}</button>
            </div>
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: МИНИАТЮРЫ */}
        <div className="w-full md:w-[28%] flex flex-col justify-start">
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-black mb-4">LOOKBOOK FW26</div>
          <div className="grid grid-cols-4 gap-2 w-full">
            {LOOKBOOK_PRODUCTS.map((product, idx) => (
              <button key={product.id} onClick={() => { setActiveProductIdx(idx); setActiveImgIdx(0); }} className={`aspect-square bg-white border overflow-hidden p-0.5 transition-all ${activeProductIdx === idx ? 'border-black' : 'border-gray-200 hover:border-gray-400'}`}>
                <img src={product.images[0]} alt={product.title[currentLang]} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </main>
    </CommonLayout>
  );
}