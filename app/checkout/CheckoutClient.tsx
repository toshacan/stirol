'use client';
import { useState } from 'react';
import { useCart } from '@/components/CartContext';
import { useLang } from '@/components/LangContext';
import CommonLayout from '@/components/CommonLayout';
import Link from 'next/link';
import { formatPrice, parsePrice } from '@/lib/formatPrice';

// Массив стран: Украина первая, Нидерланды вторые, далее по алфавиту.
// Включает ЕС + Швейцарию, Ирландию, Исландию, Норвегию, США, Канаду.
const countries = [
  { code: 'UA', nameEN: 'Ukraine', nameUA: 'Україна' },
  { code: 'NL', nameEN: 'Netherlands', nameUA: 'Нідерланди' },
  { code: 'AT', nameEN: 'Austria', nameUA: 'Австрія' },
  { code: 'BE', nameEN: 'Belgium', nameUA: 'Бельгія' },
  { code: 'BG', nameEN: 'Bulgaria', nameUA: 'Болгарія' },
  { code: 'CA', nameEN: 'Canada', nameUA: 'Канада' },
  { code: 'HR', nameEN: 'Croatia', nameUA: 'Хорватія' },
  { code: 'CY', nameEN: 'Cyprus', nameUA: 'Кіпр' },
  { code: 'CZ', nameEN: 'Czech Republic', nameUA: 'Чехія' },
  { code: 'DK', nameEN: 'Denmark', nameUA: 'Данія' },
  { code: 'EE', nameEN: 'Estonia', nameUA: 'Естонія' },
  { code: 'FI', nameEN: 'Finland', nameUA: 'Фінляндія' },
  { code: 'FR', nameEN: 'France', nameUA: 'Франція' },
  { code: 'DE', nameEN: 'Germany', nameUA: 'Німеччина' },
  { code: 'GR', nameEN: 'Greece', nameUA: 'Греція' },
  { code: 'HU', nameEN: 'Hungary', nameUA: 'Угорщина' },
  { code: 'IS', nameEN: 'Iceland', nameUA: 'Ісландія' },
  { code: 'IE', nameEN: 'Ireland', nameUA: 'Ірландія' },
  { code: 'IT', nameEN: 'Italy', nameUA: 'Італія' },
  { code: 'LV', nameEN: 'Latvia', nameUA: 'Латвія' },
  { code: 'LT', nameEN: 'Lithuania', nameUA: 'Литва' },
  { code: 'LU', nameEN: 'Luxembourg', nameUA: 'Люксембург' },
  { code: 'MT', nameEN: 'Malta', nameUA: 'Мальта' },
  { code: 'NO', nameEN: 'Norway', nameUA: 'Норвегія' },
  { code: 'PL', nameEN: 'Poland', nameUA: 'Польща' },
  { code: 'PT', nameEN: 'Portugal', nameUA: 'Португалія' },
  { code: 'RO', nameEN: 'Romania', nameUA: 'Румунія' },
  { code: 'SK', nameEN: 'Slovakia', nameUA: 'Словаччина' },
  { code: 'SI', nameEN: 'Slovenia', nameUA: 'Словенія' },
  { code: 'ES', nameEN: 'Spain', nameUA: 'Іспанія' },
  { code: 'SE', nameEN: 'Sweden', nameUA: 'Швеція' },
  { code: 'CH', nameEN: 'Switzerland', nameUA: 'Швейцарія' },
  { code: 'US', nameEN: 'USA', nameUA: 'США' }
];

export default function CheckoutClient() {
  const { cart, clearCart, updateQuantity, removeFromCart } = useCart();
  const { lang } = useLang();

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', zip: '', country: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [orderId, setOrderId] = useState<string | number>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const t = {
    title: lang === 'EN' ? 'CHECKOUT' : 'ОФОРМЛЕННЯ ЗАМОВЛЕННЯ',
    name: lang === 'EN' ? 'Full Name' : 'Повне ім’я',
    address: lang === 'EN' ? 'Address' : 'Адреса',
    city: lang === 'EN' ? 'City' : 'Місто',
    zip: lang === 'EN' ? 'Zip Code' : 'Поштовий індекс',
    country: lang === 'EN' ? 'Select Country' : 'Оберіть країну',
    phone: lang === 'EN' ? 'Phone' : 'Телефон',
    order: lang === 'EN' ? 'PLACE ORDER' : 'ПІДТВЕРДИТИ',
    cancel: lang === 'EN' ? 'CANCEL' : 'СКАСУВАТИ',
    empty: lang === 'EN' ? 'Cart is empty' : 'КОШИК ПОРОЖНІЙ',
    success: lang === 'EN' ? 'ORDER PLACED SUCCESSFULLY!' : 'ЗАМОВЛЕННЯ УСПІШНО ОФОРМЛЕНО!',
    orderLabel: lang === 'EN' ? 'ORDER ID:' : 'НОМЕР ЗАМОВЛЕННЯ:',
    subSuccess: lang === 'EN' ? 'We will contact you shortly.' : 'Ми зв’яжемося з вами найближчим часом.',
    backShop: lang === 'EN' ? 'BACK TO SHOP' : 'НАЗАД ДО МАГАЗИНУ',
    totalLabel: lang === 'EN' ? 'TOTAL' : 'РАЗОМ',
    
    errFields: lang === 'EN' ? 'PLEASE FILL IN ALL REQUIRED FIELDS.' : 'БУДЬ ЛАСКА, ЗАПОВНІТЬ УСІ ОБОВ’ЯЗКОВІ ПОЛЯ.',
    errEmail: lang === 'EN' ? 'PLEASE ENTER A VALID EMAIL ADDRESS.' : 'БУДЬ ЛАСКА, ВВЕДІТЬ КОРЕКТНИЙ EMAIL.',
    errPhone: lang === 'EN' ? 'PLEASE ENTER A VALID PHONE NUMBER.' : 'БУДЬ ЛАСКА, ВВЕДІТЬ КОРЕКТНИЙ НОМЕР ТЕЛЕФОНУ.',
    errServer: lang === 'EN' ? 'ERROR PLACING ORDER. PLEASE TRY AGAIN.' : 'ПОМИЛКА ПРИ ОФОРМЛЕННІ ЗАМОВЛЕННЯ. СПРОБУЙТЕ ЩЕ РАЗ.',
    errNetwork: lang === 'EN' ? 'NETWORK ERROR. PLEASE CHECK YOUR CONNECTION.' : 'ПОМИЛКА МЕРЕЖІ. ПЕРЕВІРТЕ З’ЄДНАННЯ.'
  };

  const total = cart.reduce((acc: number, item: any) => {
    return acc + parsePrice(item.price) * (item.quantity || 1);
  }, 0);

  const getItemSubtotal = (item: any) => {
    return parsePrice(item.price) * (item.quantity || 1);
  };

  const handleSubmit = async () => {
    if (cart.length === 0 || status === 'loading') return;
    setErrorMessage(null);

    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.country) {
      setErrorMessage(t.errFields);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage(t.errEmail);
      return;
    }

    const phoneDigitsCount = formData.phone.replace(/\D/g, '').length;
    if (phoneDigitsCount < 7) {
      setErrorMessage(t.errPhone);
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, cart, total, lang }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderId(data.orderId); 
        setStatus('success');
        if (clearCart) clearCart(); 
      } else {
        // Показываем реальную причину от сервера (например, "X just sold out"),
        // а не общую заглушку — так покупатель понимает, что реально пошло не так
        const data = await response.json().catch(() => null);
        setErrorMessage(data?.error || t.errServer);
        setStatus('idle');
      }
    } catch (err) {
      setErrorMessage(t.errNetwork);
      setStatus('idle');
    }
  };

  if (status === 'success') return (
    <CommonLayout>
      <div className="max-w-xl mx-auto mt-20 text-center uppercase tracking-widest text-[10px] space-y-4">
        <p className="font-bold text-black text-sm">{t.success}</p>
        
        <div className="text-black font-extrabold tracking-widest text-sm normal-case flex items-center justify-center gap-1.5 select-none">
          <span>{t.orderLabel}</span>
          <span className="select-all bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer font-mono font-bold text-black">
            {"#" + orderId}
          </span>
        </div>
        
        <p className="text-gray-400">{t.subSuccess}</p>
        <div className="pt-6">
          <Link href="/shop" className="border border-black px-6 py-2 hover:bg-black hover:text-white transition-colors">
            {t.backShop}
          </Link>
        </div>
      </div>
    </CommonLayout>
  );

  if (cart.length === 0) return (
    <CommonLayout>
      <div className="max-w-xl mx-auto mt-20 text-center uppercase tracking-widest text-[10px]">
        <p className="mb-6">{t.empty}</p>
        <Link href="/shop" className="border border-black px-6 py-2 hover:bg-black hover:text-white transition-colors">SHOP</Link>
      </div>
    </CommonLayout>
  );

  return (
    <CommonLayout>
      <div className="max-w-5xl mx-auto mt-16 px-4 mb-20">
        <h1 className="text-xl font-bold uppercase mb-12 tracking-widest">{t.title}</h1>
        
        <div className="flex flex-col md:flex-row gap-16">
          <div className="w-full md:w-1/2 space-y-4">
            <input 
              type="text" 
              placeholder={t.name} 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="w-full border-b border-black py-2 uppercase text-[10px] focus:outline-none bg-transparent" 
            />
            
            <input 
              type="email" 
              placeholder="Email" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              autoComplete="email" autoCorrect="off" autoCapitalize="none" spellCheck="false" inputMode="email"
              className="w-full border-b border-black py-2 text-[10px] focus:outline-none bg-transparent" 
            />
            
            <input 
              type="tel" 
              placeholder={t.phone} 
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
              autoComplete="tel" inputMode="tel"
              className="w-full border-b border-black py-2 uppercase text-[10px] focus:outline-none bg-transparent" 
            />
            
            <input 
              type="text" 
              placeholder={t.address} 
              value={formData.address} 
              onChange={e => setFormData({...formData, address: e.target.value})} 
              className="w-full border-b border-black py-2 uppercase text-[10px] focus:outline-none bg-transparent" 
            />
            
            <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder={t.city} 
                  value={formData.city} 
                  onChange={e => setFormData({...formData, city: e.target.value})} 
                  className="w-full border-b border-black py-2 uppercase text-[10px] focus:outline-none bg-transparent" 
                />
                <input 
                  type="text" 
                  placeholder={t.zip} 
                  value={formData.zip} 
                  onChange={e => setFormData({...formData, zip: e.target.value})} 
                  className="w-full border-b border-black py-2 uppercase text-[10px] focus:outline-none bg-transparent" 
                />
            </div>
            
            <select 
              className="w-full border-b border-black py-2 uppercase text-[10px] focus:outline-none bg-transparent cursor-pointer" 
              value={formData.country} 
              onChange={e => setFormData({...formData, country: e.target.value})}
            >
                <option value="">{t.country}</option>
                {countries.map(c => (
                  <option key={c.code} value={c.nameEN}>
                    {lang === 'EN' ? c.nameEN : c.nameUA}
                  </option>
                ))}
            </select>

            {errorMessage && (
              <div className="pt-4 text-red-500 text-[9px] font-bold tracking-widest uppercase transition-opacity duration-200">
                {errorMessage}
              </div>
            )}

            <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleSubmit}
                  disabled={status === 'loading'} 
                  className={
                    "flex-1 py-4 font-bold text-[10px] tracking-widest transition-colors uppercase " +
                    (status === 'loading' 
                      ? 'bg-neutral-800 text-gray-400 cursor-not-allowed' 
                      : 'bg-black text-white hover:bg-neutral-800')
                  }
                >
                  {status === 'loading' ? 'PROCESSING...' : t.order}
                </button>
                <Link href="/shop" className="flex-1 border border-black py-4 text-center font-bold text-[10px] tracking-widest uppercase hover:bg-gray-100 transition-colors">{t.cancel}</Link>
            </div>
          </div>

          <div className="w-full md:w-1/2 border-l pl-0 md:pl-16 space-y-4">
             {cart.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-start border-b pb-4 text-[10px]">
                  <div className="flex flex-col space-y-1">
                    <Link href={"/shop/" + item.id} className="font-bold text-black hover:opacity-70 transition-opacity">
                      {item.title} — {item.size}
                    </Link>
                    
                    <div className="flex items-center space-x-3 pt-1 text-black select-none font-bold">
                      <div className="flex items-center space-x-2.5">
                        <button 
                          onClick={() => updateQuantity(idx, 'decrement')} 
                          className="hover:text-red-500 font-mono text-xs px-1"
                        >
                          -
                        </button>
                        <span className="bg-neutral-100 px-2 py-0.5 rounded font-mono text-[9px]">
                          {item.quantity || 1}
                        </span>
                        <button 
                          onClick={() => updateQuantity(idx, 'increment')} 
                          className="hover:text-green-500 font-mono text-xs px-1"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-gray-300">|</span>

                      <button 
                        onClick={() => removeFromCart(idx)} 
                        className="text-gray-400 hover:text-red-600 font-sans text-[11px] font-bold px-1 transition-colors"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  
                  <span className="font-bold text-black whitespace-nowrap">
                    {formatPrice(getItemSubtotal(item))}
                  </span>
                </div>
              ))}
              
              <div className="flex justify-between font-bold text-sm pt-2">
                <span>{t.totalLabel}</span>
                <span>{formatPrice(total)}</span>
              </div>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}