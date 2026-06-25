'use client';
import { useState } from 'react';
import { useCart } from '@/components/CartContext';
import { useLang } from '@/components/LangContext';
import CommonLayout from '@/components/CommonLayout';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart } = useCart();
  const { lang } = useLang();
  
  const t = {
    title: lang === 'EN' ? 'CHECKOUT' : 'ОФОРМЛЕННЯ ЗАМОВЛЕННЯ',
    name: lang === 'EN' ? 'Full Name' : 'Повне ім’я',
    address: lang === 'EN' ? 'Address' : 'Адреса',
    city: lang === 'EN' ? 'City' : 'Місто',
    zip: lang === 'EN' ? 'Zip Code' : 'Поштовий індекс',
    country: lang === 'EN' ? 'Select Country' : 'Оберіть країну',
    phone: lang === 'EN' ? 'Phone' : 'Телефон',
    email: 'Email',
    payment: lang === 'EN' ? 'Payment Method' : 'Метод оплати',
    order: lang === 'EN' ? 'PLACE ORDER' : 'ПІДТВЕРДИТИ',
    cancel: lang === 'EN' ? 'CANCEL' : 'СКАСУВАТИ',
    empty: lang === 'EN' ? 'Cart is empty' : 'Кошик порожній'
  };

  const countries = ["Netherlands", "Ukraine", "Germany", "France", "Poland", "USA"];

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
          <form className="w-full md:w-1/2 space-y-4">
            <input type="text" placeholder={t.name} className="w-full border-b border-black py-2 uppercase text-[10px] focus:outline-none" required />
            <input type="email" placeholder="Email" className="w-full border-b border-black py-2 uppercase text-[10px] focus:outline-none" required />
            <input type="tel" placeholder={t.phone} className="w-full border-b border-black py-2 uppercase text-[10px] focus:outline-none" required />
            <input type="text" placeholder={t.address} className="w-full border-b border-black py-2 uppercase text-[10px] focus:outline-none" required />
            <div className="flex gap-4">
                <input type="text" placeholder={t.city} className="w-full border-b border-black py-2 uppercase text-[10px] focus:outline-none" required />
                <input type="text" placeholder={t.zip} className="w-full border-b border-black py-2 uppercase text-[10px] focus:outline-none" required />
            </div>
            
            {/* Выпадающий список стран */}
            <select className="w-full border-b border-black py-2 uppercase text-[10px] focus:outline-none bg-transparent cursor-pointer" required>
                <option value="">{t.country}</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div className="pt-6">
                <label className="text-[9px] text-gray-400 uppercase">{t.payment}</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {['PayPal', 'Apple Pay', 'iDEAL', 'Mono'].map(m => (
                        <button key={m} type="button" className="border border-gray-200 py-2 text-[9px] uppercase hover:border-black transition-all">{m}</button>
                    ))}
                </div>
            </div>

            <div className="flex gap-4 pt-8">
                <button type="submit" className="flex-1 bg-black text-white py-4 font-bold text-[10px] tracking-widest hover:bg-gray-800 transition-colors">{t.order}</button>
                <Link href="/shop" className="flex-1 border border-black py-4 text-center font-bold text-[10px] tracking-widest uppercase hover:bg-gray-100 transition-colors">{t.cancel}</Link>
            </div>
          </form>

          {/* ИТОГ */}
          <div className="w-full md:w-1/2 border-l pl-0 md:pl-16">
             {cart.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between border-b pb-4 mb-4 text-[10px]">
                  <span>{item.title} — {item.size}</span>
                  <span className="font-bold">{item.price}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-sm">
                <span>TOTAL</span>
                <span>{cart.reduce((acc: any, item: any) => acc + parseFloat(item.price.replace('€', '')), 0)}€</span>
              </div>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}