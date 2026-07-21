'use client';
import { useState } from 'react';
import CommonLayout from '@/components/CommonLayout';
import { useLang } from '@/components/LangContext';

export default function ContactClient() {
  const { lang } = useLang();
  const currentLang = (lang === 'UA' ? 'UA' : 'EN') as 'EN' | 'UA';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    order: '',
    theme: '',
    message: '',
    website: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const ui = {
    EN: {
      title: 'CONTACT',
      name: 'NAME',
      email: 'EMAIL',
      order: 'ORDER # (OPTIONAL)',
      themeLabel: 'SELECT THEME',
      themes: ['ORDER INFO', 'RETURN', 'GENERAL', 'PRESS', 'COLLABORATION'],
      msg: 'MESSAGE',
      send: 'SEND',
      sending: 'SENDING...',
      success: 'SENT SUCCESS',
      error: 'TRY AGAIN'
    },
    UA: {
      title: 'КОНТАКТИ',
      name: 'ІМ\'Я',
      email: 'ПОШТА',
      order: 'НОМЕР ЗАМОВЛЕННЯ (ОПЦІОНАЛЬНО)',
      themeLabel: 'ОБЕРІТЬ ТЕМУ',
      themes: ['ІНФОРМАЦІЯ ПО ЗАМОВЛЕННЮ', 'ПОВЕРНЕННЯ', 'ЗАГАЛЬНІ ЗАПИТИ', 'ПРЕСА', 'СПІВПРАЦЯ'],
      msg: 'ПОВІДОМЛЕННЯ',
      send: 'НАДІСЛАТИ',
      sending: 'НАДСИЛАННЯ...',
      success: 'УСПІШНО ВІДПРАВЛЕНО',
      error: 'ПОМИЛКА, СКУШУЙ ЩЕ'
    }
  };

  const currentUi = ui[currentLang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', order: '', theme: '', message: '', website: '' });
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <CommonLayout>
      <div className="flex-grow w-full flex items-center justify-center px-4 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 text-left">
          <h2 className="text-[10px] font-black tracking-[0.3em] uppercase mb-8">{currentUi.title}</h2>
          
          <input 
            type="text" 
            placeholder={currentUi.name} 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border-b border-gray-300 bg-transparent py-2 outline-none focus:border-black text-[10px] uppercase" 
            required 
          />
          
          <input 
            type="email" 
            placeholder={currentUi.email} 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border-b border-gray-300 bg-transparent py-2 outline-none focus:border-black text-[10px]" 
            required 
          />
          
          <input 
            type="text" 
            placeholder={currentUi.order} 
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
            className="w-full border-b border-gray-300 bg-transparent py-2 outline-none focus:border-black text-[10px] uppercase" 
          />
          
          <select 
            value={formData.theme}
            onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
            className="w-full border-b border-gray-300 bg-transparent py-2 outline-none focus:border-black text-[10px] uppercase rounded-none"
          >
            <option value="">{currentUi.themeLabel}</option>
            {currentUi.themes.map((t, i) => <option key={i} value={t}>{t}</option>)}
          </select>
          
          <textarea 
            placeholder={currentUi.msg} 
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full border border-gray-300 bg-transparent p-2 h-32 outline-none focus:border-black text-[10px] uppercase resize-none" 
            required 
          />

          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="absolute -left-[9999px]"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className={`w-full py-3 text-[10px] font-bold tracking-widest uppercase transition-colors
              ${status === 'success' ? 'bg-emerald-600 text-white' : ''}
              ${status === 'error' ? 'bg-pink-600 text-white' : ''}
              ${status === 'idle' ? 'bg-black text-white hover:bg-gray-800' : ''}
              ${status === 'loading' ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : ''}
            `}
          >
            {status === 'idle' && currentUi.send}
            {status === 'loading' && currentUi.sending}
            {status === 'success' && currentUi.success}
            {status === 'error' && currentUi.error}
          </button>
        </form>
      </div>
    </CommonLayout>
  );
}
