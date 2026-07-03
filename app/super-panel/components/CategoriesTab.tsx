'use client';
import { useState } from 'react';

export function CategoriesTab({ categories, onRefresh }: { categories: any[], onRefresh: () => void }) {
  const [form, setForm] = useState({ id: '', label_en: '', label_ua: '', order: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const saveCategory = async () => {
    setSaving(true);
    const endpoint = isEditing ? '/api/update-category' : '/api/add-category';
    await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' }
    });
    setForm({ id: '', label_en: '', label_ua: '', order: 0 });
    setIsEditing(false);
    onRefresh();
    setSaving(false);
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch('/api/delete-category', {
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' }
    });
    onRefresh();
  };

  const startEdit = (cat: any) => {
    setForm(cat);
    setIsEditing(true);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Список категорий */}
      <div className="w-full md:w-1/2 space-y-2">
        <h3 className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-4">Current Categories</h3>
        {categories.map((c) => (
          <div key={c.id} className="flex justify-between items-center bg-[#111] border border-[#222] p-4 group">
            <div className="flex flex-col">
              <span className="text-sm font-bold">{c.label_en}</span>
              <span className="text-[10px] text-[#666] uppercase">{c.id} • Order: {c.order}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(c)} className="text-[10px] hover:text-white text-[#555] uppercase underline">Edit</button>
              <button onClick={() => deleteCategory(c.id)} className="text-[10px] text-red-900 hover:text-red-500 uppercase underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Форма */}
      <div className="w-full md:w-1/2 bg-[#111] border border-[#222] p-6 h-fit">
        <h3 className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-6">
          {isEditing ? 'Edit Category' : 'Add New Category'}
        </h3>
        
        <div className="space-y-4">
          <input
            disabled={isEditing}
            value={form.id}
            onChange={(e) => setForm({...form, id: e.target.value})}
            placeholder="Slug ID (e.g. tshirts)"
            className="w-full bg-[#222] p-2 text-xs border border-transparent focus:border-white outline-none font-mono"
          />
          <input
            value={form.label_en}
            onChange={(e) => setForm({...form, label_en: e.target.value})}
            placeholder="Label (EN)"
            className="w-full bg-[#222] p-2 text-xs border border-transparent focus:border-white outline-none"
          />
          <input
            value={form.label_ua}
            onChange={(e) => setForm({...form, label_ua: e.target.value})}
            placeholder="Label (UA)"
            className="w-full bg-[#222] p-2 text-xs border border-transparent focus:border-white outline-none"
          />
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({...form, order: parseInt(e.target.value) || 0})}
            placeholder="Sort Order"
            className="w-full bg-[#222] p-2 text-xs border border-transparent focus:border-white outline-none"
          />
          <button
            onClick={saveCategory}
            disabled={saving}
            className="w-full bg-white text-black text-xs font-bold py-3 uppercase hover:bg-gray-200"
          >
            {saving ? 'Saving...' : (isEditing ? 'Update Category' : 'Create Category')}
          </button>
          {isEditing && (
            <button onClick={() => { setIsEditing(false); setForm({ id: '', label_en: '', label_ua: '', order: 0 }) }} className="w-full text-xs text-[#555] hover:text-white py-2">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}