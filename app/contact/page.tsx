'use client';
import CommonLayout from '@/components/CommonLayout';
import { useLang } from '@/components/LangContext';

export default function ContactPage() {
  const { lang } = useLang();

  const ui = {
    EN: {
      title: 'CONTACT',
      name: 'NAME',
      email: 'EMAIL',
      order: 'ORDER # (OPTIONAL)',
      themeLabel: 'SELECT THEME',
      themes: ['ORDER INFO', 'RETURN', 'GENERAL', 'PRESS', 'COLLABORATION'],
      msg: 'MESSAGE',
      send: 'SEND'
    },
    UA: {
      title: 'КОНТАКТИ',
      name: 'ІМ\'Я',
      email: 'ПОШТА',
      order: 'НОМЕР ЗАМОВЛЕННЯ (ОПЦІОНАЛЬНО)',
      themeLabel: 'ОБЕРІТЬ ТЕМУ',
      themes: ['ІНФОРМАЦІЯ ПО ЗАМОВЛЕННЮ', 'ПОВЕРНЕННЯ', 'ЗАГАЛЬНІ ЗАПИТИ', 'ПРЕСА', 'СПІВПРАЦЯ'],
      msg: 'ПОВІДОМЛЕННЯ',
      send: 'НАДІСЛАТИ'
    }
  };

  // Используем приведение типа для безопасности TypeScript
  const currentUi = ui[lang as 'EN' | 'UA'];

  return (
    <CommonLayout>
      <div className="flex-grow w-full flex items-center justify-center px-4">
        <form className="w-full max-w-md space-y-6" action="https://formspree.io/f/ВАШ_ID" method="POST">
          <h2 className="text-[10px] font-black tracking-[0.3em] uppercase mb-8">{currentUi.title}</h2>
          
          <input type="text" name="name" placeholder={currentUi.name} className="w-full border-b border-gray-300 bg-transparent py-2 outline-none focus:border-black text-[10px]" required />
          <input type="email" name="email" placeholder={currentUi.email} className="w-full border-b border-gray-300 bg-transparent py-2 outline-none focus:border-black text-[10px]" required />
          <input type="text" name="order" placeholder={currentUi.order} className="w-full border-b border-gray-300 bg-transparent py-2 outline-none focus:border-black text-[10px]" />
          
          <select name="theme" className="w-full border-b border-gray-300 bg-transparent py-2 outline-none focus:border-black text-[10px] uppercase">
            <option value="">{currentUi.themeLabel}</option>
            {currentUi.themes.map((t, i) => <option key={i} value={t}>{t}</option>)}
          </select>
          
          <textarea name="message" placeholder={currentUi.msg} className="w-full border border-gray-300 bg-transparent p-2 h-32 outline-none focus:border-black text-[10px]" required />
          
          <button type="submit" className="w-full bg-black text-white py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors">
            {currentUi.send}
          </button>
        </form>
      </div>
    </CommonLayout>
  );
}