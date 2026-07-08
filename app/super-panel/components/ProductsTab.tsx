'use client';
import Image from 'next/image';

interface ProductsTabProps {
  products: any[];
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

export function ProductsTab({ products, onEdit, onDelete, onStatusChange }: ProductsTabProps) {
  return (
    <div className="grid gap-4">
      {products.map((p) => {
        // Безопасно вытягиваем структуры данных
        const variants = p.product_variants || p.variants || [];
        const colors = p.color_variants || p.colorVariants || [];
        const imgUrl = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.images || '';

        return (
          <div
            key={p.id}
            className="border border-[#222] bg-[#111] p-6 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center"
          >
            <div className="flex gap-4 items-start md:items-center w-full md:w-auto">
              {imgUrl && (
                <div className="w-16 h-16 bg-[#222] border border-[#333] overflow-hidden flex-shrink-0 relative">
                  <Image src={imgUrl} alt={p.title} fill sizes="64px" className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] bg-[#222] text-[#888] px-2 py-0.5 uppercase tracking-wider">{p.category}</span>
                  <h3 className="font-bold text-base truncate">{p.title}</h3>
                  
                  {/* ИНДИКАТОР НАЛИЧИЯ УКРАИНСКОГО ПЕРЕВОДА */}
                  {p.description_ua ? (
                    <span className="text-[9px] bg-emerald-950/40 text-emerald-400 border border-emerald-900/50 px-1.5 py-0.5 uppercase font-bold tracking-wider">
                      UA OK
                    </span>
                  ) : (
                    <span className="text-[9px] bg-amber-950/30 text-amber-500/70 border border-amber-900/30 px-1.5 py-0.5 uppercase font-bold tracking-wider">
                      No UA Translation
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-[#666] mt-1 font-mono">
                  ID: <span className="text-white">{p.id}</span> | Price: <span className="text-white font-bold">{p.price}€</span>
                </p>

                {/* ОТОБРАЖЕНИЕ РАЗМЕРОВ И ОСТАТКОВ */}
                <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[9px] text-[#555] uppercase font-bold mr-1">Stock:</span>
                  {variants.length > 0 ? (
                    variants.map((v: any, idx: number) => {
                      const isOut = Number(v.stock) <= 0;
                      return (
                        <span 
                          key={idx} 
                          className={`text-[10px] font-mono px-2 py-0.5 border uppercase tracking-tight
                            ${isOut 
                              ? 'border-red-950/40 bg-red-950/10 text-red-400/70 line-through' 
                              : 'border-[#222] bg-[#161616] text-gray-300 font-bold'
                            }`}
                        >
                          {v.size} ({v.stock})
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-[10px] text-amber-500/70 uppercase tracking-tighter">⚠️ No sizes added</span>
                  )}
                </div>

                {/* ОТОБРАЖЕНИЕ СВЯЗАННЫХ ЦВЕТОВ */}
                {colors.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[9px] text-[#555] uppercase font-bold">Colors Linked:</span>
                    <div className="flex gap-1.5 items-center">
                      {colors.map((c: any, idx: number) => (
                        <div 
                          key={idx} 
                          title={`${c.name} ➔ Target ID: ${c.id}`}
                          className={`w-3 h-3 rounded-full border ${c.id?.trim() === p.id?.trim() ? 'border-white scale-110' : 'border-[#333]'}`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-[#222]">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-[#555] uppercase">Status on site:</span>
                <select
                  value={p.status || 'DEFAULT'}
                  onChange={(e) => onStatusChange(p.id, e.target.value)}
                  className="bg-[#222] text-xs p-2 uppercase outline-none cursor-pointer border border-[#333] tracking-wider font-bold"
                >
                  <option value="DEFAULT">Available (Active)</option>
                  <option value="soldout">SOLD OUT</option>
                  <option value="comingSoon">COMING SOON</option>
                </select>
              </div>

              <div className="flex gap-2 self-end md:self-center">
                <button
                  onClick={() => onEdit(p)}
                  className="border border-[#444] px-4 py-2 text-xs uppercase hover:border-white transition-colors font-bold"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="border border-red-900/40 text-red-500 px-3 py-2 text-xs uppercase hover:bg-red-900/20 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}