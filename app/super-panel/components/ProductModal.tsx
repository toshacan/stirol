'use client';
import { useState } from 'react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: any | null;
  productForm: any;
  setProductForm: React.Dispatch<React.SetStateAction<any>>;
  newColorVariant: { name: string; hex: string; id: string };
  setNewColorVariant: React.Dispatch<React.SetStateAction<{ name: string; hex: string; id: string }>>;
  saveProduct: () => void;
  productSaving: boolean;
}

export function ProductModal({
  isOpen,
  onClose,
  editingProduct,
  productForm,
  setProductForm,
  newColorVariant,
  setNewColorVariant,
  saveProduct,
  productSaving,
}: ProductModalProps) {
  const [tempSize, setTempSize] = useState('');
  const [tempStock, setTempStock] = useState('0');

  if (!isOpen) return null;

  const variants = productForm.variants || [];
  const colorVariants = productForm.colorVariants || [];

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 md:p-8 z-50 overflow-y-auto">
      <div
        className="bg-[#111] border border-[#333] p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-6 uppercase tracking-wider">
          {editingProduct ? `Edit: ${editingProduct.title}` : 'NEW PRODUCT'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-[10px] text-[#555] uppercase block mb-1 font-bold">Product ID (Slug)</label>
            <input
              disabled={!!editingProduct}
              value={productForm.id}
              onChange={(e) => setProductForm({ ...productForm, id: e.target.value })}
              className="w-full bg-[#222] p-2 text-xs outline-none border border-transparent focus:border-white disabled:opacity-50 font-mono text-white"
              placeholder="e.g. fuck-the-roc-tee"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#555] uppercase block mb-1 font-bold">Category</label>
            <select
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              className="w-full bg-[#222] p-2 text-xs uppercase outline-none border border-transparent focus:border-white text-white"
            >
              <option value="tshirts">tshirts</option>
              <option value="hoodies">hoodies</option>
              <option value="shoppers">shoppers</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-[#555] uppercase block mb-1 font-bold">Sort Position</label>
            <input
              type="number"
              value={productForm.position || 0}
              onChange={(e) => setProductForm({ ...productForm, position: parseInt(e.target.value) || 0 })}
              className="w-full bg-[#222] p-2 text-xs outline-none border border-transparent focus:border-white text-white font-mono"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-[10px] text-[#555] uppercase block mb-1 font-bold">Title</label>
            <input
              value={productForm.title}
              onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
              className="w-full bg-[#222] p-2 text-xs outline-none border border-transparent focus:border-white text-white"
              placeholder='e.g. "FUCK THE ROC" T-SHIRT'
            />
          </div>
          <div>
            <label className="text-[10px] text-[#555] uppercase block mb-1 font-bold">Price</label>
            <input
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              className="w-full bg-[#222] p-2 text-xs outline-none border border-transparent focus:border-white font-mono text-white"
              placeholder="e.g. 45"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[10px] text-[#555] uppercase block mb-1 font-bold">Status</label>
          <select
            value={productForm.status}
            onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
            className="w-full bg-[#222] p-2 text-xs uppercase outline-none border border-transparent focus:border-white text-white"
          >
            <option value="">Available (No badge)</option>
            <option value="soldout">SOLD OUT</option>
            <option value="comingSoon">COMING SOON</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="text-[10px] text-[#555] uppercase block mb-1 font-bold">Description (EN / Default)</label>
          <textarea
            value={productForm.description}
            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
            className="w-full bg-[#222] p-2 text-xs outline-none border border-transparent focus:border-white h-20 resize-none text-white"
            placeholder="Product details in English..."
          />
        </div>

        <div className="mb-4">
          <label className="text-[10px] text-[#888] uppercase block mb-1 font-bold">Description (UA)</label>
          <textarea
            value={productForm.description_ua || ''}
            onChange={(e) => setProductForm({ ...productForm, description_ua: e.target.value })}
            className="w-full bg-[#222] p-2 text-xs outline-none border border-transparent focus:border-white h-20 resize-none text-gray-200"
            placeholder="Опис товару українською мовою..."
          />
        </div>

        <div className="mb-6">
          <label className="text-[10px] text-[#555] uppercase block mb-1 font-bold">Image URLs (Comma separated)</label>
          <input
            value={productForm.imagesStr}
            onChange={(e) => setProductForm({ ...productForm, imagesStr: e.target.value })}
            className="w-full bg-[#222] p-2 text-xs outline-none border border-transparent focus:border-white text-white font-mono"
            placeholder="/shop/img1.png, /shop/img2.png"
          />
        </div>

        <div className="border-t border-[#222] pt-4 mb-6">
          <label className="text-[10px] text-[#888] uppercase block mb-2 font-bold">Size Variants & Stock Control</label>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {variants.map((v: any, idx: number) => (
              <div key={idx} className="bg-[#222] border border-[#333] px-3 py-1.5 flex items-center gap-3 text-xs font-mono">
                <span className="font-black text-white uppercase">{v.size}</span>
                <span className="text-gray-600">|</span>
                <span>STOCK: <span className={v.stock > 0 ? 'text-emerald-400 font-bold' : 'text-red-500 font-bold'}>{v.stock}</span></span>
                <button
                  type="button"
                  onClick={() =>
                    setProductForm({
                      ...productForm,
                      variants: variants.filter((_: any, i: number) => i !== idx),
                    })
                  }
                  className="text-red-500 hover:text-red-400 ml-1 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <input
              placeholder="Size (S, M, L)"
              value={tempSize}
              onChange={(e) => setTempSize(e.target.value)}
              className="bg-[#222] p-2 text-xs outline-none flex-1 border border-transparent focus:border-white uppercase font-mono text-white"
            />
            <input
              type="number"
              placeholder="Stock"
              value={tempStock}
              onChange={(e) => setTempStock(e.target.value)}
              className="bg-[#222] p-2 text-xs outline-none w-24 border border-transparent focus:border-white font-mono text-white"
              min="0"
            />
            <button
              type="button"
              onClick={() => {
                if (tempSize.trim()) {
                  setProductForm({
                    ...productForm,
                    variants: [
                      ...variants,
                      { size: tempSize.trim().toUpperCase(), stock: parseInt(tempStock) || 0 }
                    ],
                  });
                  setTempSize('');
                  setTempStock('0');
                }
              }}
              className="bg-[#333] hover:bg-white hover:text-black px-4 py-2 text-xs uppercase transition-colors font-bold text-white"
            >
              + Add Size
            </button>
          </div>
        </div>

        <div className="border-t border-[#222] pt-4 mb-6">
          <label className="text-[10px] text-[#888] uppercase block mb-2 font-bold">Color Variants (Optional)</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {colorVariants.map((cv: any, idx: number) => (
              <div key={idx} className="bg-[#222] border border-[#333] px-3 py-1.5 flex items-center gap-2 text-xs text-white">
                <span className="w-3 h-3 rounded-full inline-block border border-gray-500" style={{ backgroundColor: cv.hex }} />
                <span>
                  {cv.name} ({cv.id})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setProductForm({
                      ...productForm,
                      colorVariants: colorVariants.filter((_: any, i: number) => i !== idx),
                    })
                  }
                  className="text-red-500 hover:text-red-400 ml-1 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <input
              placeholder="Color Name (BLACK)"
              value={newColorVariant.name}
              onChange={(e) => setNewColorVariant({ ...newColorVariant, name: e.target.value })}
              className="bg-[#222] p-2 text-xs outline-none flex-1 border border-transparent focus:border-white text-white"
            />
            <input
              type="color"
              value={newColorVariant.hex}
              onChange={(e) => setNewColorVariant({ ...newColorVariant, hex: e.target.value })}
              className="bg-[#222] p-1 h-8 w-12 cursor-pointer border-0"
            />
            <input
              placeholder="Target Product ID"
              value={newColorVariant.id}
              onChange={(e) => setNewColorVariant({ ...newColorVariant, id: e.target.value })}
              className="bg-[#222] p-2 text-xs outline-none flex-1 border border-transparent focus:border-white text-white font-mono"
            />
            <button
              type="button"
              onClick={() => {
                if (newColorVariant.name.trim() && newColorVariant.id.trim()) {
                  setProductForm({
                    ...productForm,
                    colorVariants: [
                      ...colorVariants, 
                      { 
                        name: newColorVariant.name.trim(), 
                        hex: newColorVariant.hex.trim(), 
                        id: newColorVariant.id.trim() 
                      }
                    ],
                  });
                  setNewColorVariant({ name: '', hex: '#000000', id: '' });
                }
              }}
              className="bg-[#333] hover:bg-white hover:text-black px-4 py-2 text-xs uppercase transition-colors text-white font-bold"
            >
              + Add Color
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={saveProduct}
            disabled={productSaving}
            className="flex-1 bg-white text-black p-3 font-bold uppercase text-xs tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {productSaving ? 'SAVING...' : 'SAVE PRODUCT'}
          </button>
          <button
            onClick={onClose}
            className="border border-[#444] p-3 text-xs uppercase text-white hover:border-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}