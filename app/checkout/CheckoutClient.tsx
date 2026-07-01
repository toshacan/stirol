'use client';
import { useState } from 'react';
import { useCart } from '@/components/CartContext';
import { useLang } from '@/components/LangContext';
import CommonLayout from '@/components/CommonLayout';
import Link from 'next/link';

export default function CheckoutClient() {
  const { cart, clearCart } = useCart();
  const { lang } = useLang();

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', zip: '', country: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [orderId, setOrderId] = useState<string | number>('');

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
    empty: lang === 'EN' ? 'Cart is empty' : 'Кошик порожній',
    success: lang === 'EN' ? 'ORDER PLACED SUCCESSFULLY!' : 'ЗАМОВЛЕННЯ УСПІШНО ОФОРМЛЕНО!',
    orderLabel: lang === 'EN' ? 'ORDER ID:' : 'НОМЕР ЗАМОВЛЕННЯ:',
    subSuccess: lang === 'EN' ? 'We will contact you shortly.' : 'Ми зв’яжемося з вами найближчим часом.',
    backShop: lang === 'EN' ? 'BACK TO SHOP' : 'НАЗАД ДО МАГАЗИНУ',
    totalLabel: lang === 'EN' ? 'TOTAL' : 'РАЗОМ'
  };

  const countries = ["Netherlands", "Ukraine", "Germany", "France", "Poland", "USA"];
  
  const total = cart.reduce((acc: number, item: any) => {
    const priceStr = typeof item.price === 'string' ? item.price : String(item.price || '0');
    const parsed = parseFloat(priceStr.replace('€', '').trim());
    return acc + (isNaN(parsed) ? 0 : parsed);
  }, 0);

  const handleSubmit = async () => {
    if (cart.length === 0 || status === 'loading') return;

    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.country) {
      alert(lang === 'EN' ? 'Please fill in all required fields.' : 'Будь ласка, заповніть усі обов’язкові поля.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      alert(lang === 'EN' ? 'Please enter a valid email address.' : 'Будь ласка, введіть коректний email.');
      return;
    }

    const phoneDigitsCount = formData.phone.replace(/\D/g, '').length;
    if (phoneDigitsCount < 7) {
      alert(lang === 'EN' ? 'Please enter a valid phone number.' : 'Будь ласка, введіть коректний номер телефону.');
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
        alert(lang === 'EN' ? 'Error placing order.' : 'Помилка при оформлении замовлення.');
        setStatus('idle');
      }
    } catch (err) {
      alert(lang === 'EN' ? 'Network error. Please try again.' : 'Помилка мережі. Спробуйте ще раз.');
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
            
            {/* ПОЛЕ EMAIL С ЖЕСТКИМ ОТКЛЮЧЕНИЕМ АВТОИСПРАВЛЕНИЙ И ВЫЗОВОМ КЛАВИАТУРЫ @ */}
            <input 
              type="email" 
              placeholder="Email" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              autoComplete="email"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              inputMode="email"
              className="w-full border-b border-black py-2 text-[10px] focus:outline-none bg-transparent" 
            />
            
            <input 
              type="tel" 
              placeholder={t.phone} 
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
              autoComplete="tel"
              inputMode="tel"
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
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div className="flex gap-4 pt-8">
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

          <div className="w-full md:w-1/2 border-l pl-0 md:pl-16">
             {cart.map((item: any, idx: number) => (
                <Link 
                  key={idx} 
                  href={"/shop/" + item.id} 
                  className="flex justify-between border-b pb-4 mb-4 text-[10px] block hover:opacity-70 transition-opacity"
                >
                  <span>{item.title} — {item.size}</span>
                  <span className="font-bold">{item.price}</span>
                </Link>
              ))}
              <div className="flex justify-between font-bold text-sm">
                <span>{t.totalLabel}</span>
                <span>{total}€</span>
              </div>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}