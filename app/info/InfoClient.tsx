'use client';

import { useState } from 'react';
import CommonLayout from '@/components/CommonLayout';
import { useLang } from '@/components/LangContext';

type SectionId = 'shipping' | 'returns' | 'terms' | 'privacy';

interface ContentData {
  title: string;
  content: React.ReactNode;
}

export default function InfoClient() {
  const { lang } = useLang();
  const currentLang = (lang as 'EN' | 'UA') || 'EN';
  const [openSection, setOpenSection] = useState<SectionId | null>(null);

  const toggleSection = (id: SectionId) => {
    setOpenSection(openSection === id ? null : id);
  };

  const infoData: Record<SectionId, { EN: ContentData; UA: ContentData }> = {
    shipping: {
      EN: {
        title: 'SHIPPING & DELIVERY',
        content: (
          <div className="space-y-4 text-left">
            <p><strong>ORDER PROCESSING</strong><br/>
            Orders are packed and shipped within 2-4 business days after you receive your order confirmation. During drops or high-volume periods this can take a bit longer — we'll keep you posted via email.</p>

            <p><strong>UKRAINE</strong><br/>
            Domestic orders ship via Nova Poshta, usually arriving within 1-3 business days after dispatch.</p>

            <p><strong>INTERNATIONAL</strong><br/>
            We ship worldwide via Ukrposhta / EMS and international couriers. Delivery typically takes 7-21 business days depending on your country. You'll get a tracking number once your order leaves us.</p>

            <p><strong>CUSTOMS & DUTIES</strong><br/>
            Any customs fees or import taxes charged in your country are your responsibility, not ours — we have no way to predict or cover these. If a parcel gets returned to us because customs fees weren't paid, the original shipping cost won't be refunded.</p>
          </div>
        ),
      },
      UA: {
        title: 'ДОСТАВКА',
        content: (
          <div className="space-y-4 text-left">
            <p><strong>ОБРОБКА ЗАМОВЛЕННЯ</strong><br/>
            Замовлення пакуються і відправляються протягом 2-4 робочих днів після підтвердження замовлення. Під час дропів чи великого напливу замовлень це може зайняти трохи більше часу — повідомимо на email, якщо так станеться.</p>

            <p><strong>УКРАЇНА</strong><br/>
            Замовлення по Україні відправляються Новою Поштою, зазвичай доходять за 1-3 робочі дні після відправки.</p>

            <p><strong>МІЖНАРОДНА ДОСТАВКА</strong><br/>
            Відправляємо по всьому світу через Укрпошту / EMS та міжнародні кур'єрські служби. Доставка зазвичай займає 7-21 робочий день залежно від країни. Трек-номер надішлемо, щойно замовлення поїде.</p>

            <p><strong>МИТО ТА ПОДАТКИ</strong><br/>
            Будь-які митні збори чи податки у вашій країні — це ваша відповідальність, не наша, ми не можемо їх передбачити чи покрити. Якщо посилку повернуть нам через несплачене мито, вартість початкової доставки не повертається.</p>
          </div>
        ),
      },
    },
    returns: {
      EN: {
        title: 'RETURNS & EXCHANGES',
        content: (
          <div className="space-y-4 text-left">
            <p><strong>RETURN WINDOW</strong><br/>
            You can return an item within 14 days of receiving it. It needs to be unworn, unwashed, with tags still on, in the same condition it arrived in.</p>

            <p><strong>FINAL SALE</strong><br/>
            Limited drop pieces are final sale — no returns or exchanges, unless the item arrived defective. This is stated on the product page before you buy, so check sizing carefully.</p>

            <p><strong>HOW IT WORKS</strong><br/>
            Message us with your order number to start a return. We'll confirm and tell you where to send it. Return shipping is on you, and it's not refunded — only the item price is.</p>

            <p><strong>REFUNDS</strong><br/>
            Since payment is made directly by bank transfer or crypto (we don't use a card processor), refunds go back the same way — to the same card/wallet you paid from, once we've received and checked the returned item. This is manual on our end, so give it a few days.</p>

            <p><strong>DEFECTIVE OR WRONG ITEM</strong><br/>
            Got something damaged or wrong? Message us with photos right away. We'll sort it out and cover the return shipping ourselves.</p>
          </div>
        ),
      },
      UA: {
        title: 'ПОВЕРНЕННЯ ТА ОБМІН',
        content: (
          <div className="space-y-4 text-left">
            <p><strong>СТРОК ПОВЕРНЕННЯ</strong><br/>
            Товар можна повернути протягом 14 днів з моменту отримання. Він має бути неношеним, непраним, з бірками, у тому ж стані, в якому прийшов.</p>

            <p><strong>ФІНАЛЬНИЙ ПРОДАЖ</strong><br/>
            Речі з лімітованих дропів повернути чи обміняти не можна — окрім випадків браку. Це вказано на сторінці товару ще до покупки, тож уважно перевіряй розмір.</p>

            <p><strong>ЯК ЦЕ ПРАЦЮЄ</strong><br/>
            Напиши нам номер замовлення, щоб почати повернення. Ми підтвердимо і скажемо, куди відправляти. Зворотну доставку оплачуєш ти, і вона не повертається — лише вартість самого товару.</p>

            <p><strong>ПОВЕРНЕННЯ КОШТІВ</strong><br/>
            Оскільки оплата йде напряму банківським переказом або криптою (без платіжного процесора), кошти повертаються тим самим шляхом — на ту саму карту/гаманець, з якого була оплата, після того як ми отримаємо і перевіримо товар. Це робиться вручну з нашого боку, тож дай нам кілька днів.</p>

            <p><strong>БРАК АБО НЕ ТОЙ ТОВАР</strong><br/>
            Прийшло щось пошкоджене чи не те? Напиши нам одразу з фото. Розберемось і самі покриємо зворотну доставку.</p>
          </div>
        ),
      },
    },
    terms: {
      EN: {
        title: 'TERMS OF SERVICE',
        content: (
          <div className="space-y-4 text-left">
            <p><strong>USING THIS SITE</strong><br/>
            By using stirol.xyz, you agree to these terms. We can refuse service to anyone, for any reason. Don't use this site or our products for anything illegal.</p>

            <p><strong>OUR CONTENT</strong><br/>
            Photos, videos, designs, graphics, and everything else on this site belongs to STIROL. Don't reproduce, resell, or repost it without asking us first.</p>

            <p><strong>PRICES & PRODUCTS</strong><br/>
            Prices can change without notice, and we can discontinue a product anytime. We try to show colors and details as accurately as possible, but your screen might display them slightly differently than in person.</p>

            <p><strong>LIABILITY</strong><br/>
            We're a small independent brand, not a corporation with a legal department. We do our best to get every order right, but we're not liable for indirect damages or losses connected to using this site or our products.</p>
          </div>
        ),
      },
      UA: {
        title: 'УМОВИ ВИКОРИСТАННЯ',
        content: (
          <div className="space-y-4 text-left">
            <p><strong>ВИКОРИСТАННЯ САЙТУ</strong><br/>
            Користуючись stirol.xyz, ти погоджуєшся з цими умовами. Ми можемо відмовити в обслуговуванні будь-кому і з будь-якої причини. Не використовуй сайт чи наші товари для нічого незаконного.</p>

            <p><strong>НАШ КОНТЕНТ</strong><br/>
            Фото, відео, дизайни, графіка і все інше на цьому сайті належить STIROL. Не копіюй, не перепродавай і не викладай це без нашого дозволу.</p>

            <p><strong>ЦІНИ ТА ТОВАРИ</strong><br/>
            Ціни можуть змінюватись без попередження, товар може бути знятий з продажу в будь-який момент. Ми намагаємось показувати кольори і деталі максимально точно, але екран твого пристрою може передавати їх трохи інакше, ніж наживо.</p>

            <p><strong>ВІДПОВІДАЛЬНІСТЬ</strong><br/>
            Ми маленький незалежний бренд, а не корпорація з юридичним відділом. Робимо все можливе, щоб кожне замовлення було правильним, але не несемо відповідальності за непрямі збитки, пов'язані з використанням сайту чи наших товарів.</p>
          </div>
        ),
      },
    },
    privacy: {
      EN: {
        title: 'PRIVACY POLICY',
        content: (
          <div className="space-y-4 text-left">
            <p><strong>WHAT WE COLLECT</strong><br/>
            When you order, we collect your name, email, phone, and delivery address — that's what's needed to actually get your package to you. If you subscribe to drop alerts, we collect your email for that.</p>

            <p><strong>PAYMENT DATA</strong><br/>
            We don't use a payment processor — you pay us directly by bank transfer or crypto, referencing your order number. That means we never see, collect, or store your card details at all; that information never touches this site.</p>

            <p><strong>WHERE IT'S STORED</strong><br/>
            Order and account data is stored with Supabase (our database provider). Order confirmation emails are sent through Resend. We don't sell, rent, or hand off your data to marketers — the only third parties involved are the ones that help us run the store and ship your order.</p>

            <p><strong>YOUR CONTROL</strong><br/>
            Want your data deleted, or want off the mailing list? Just message us — we'll handle it directly, no automated runaround.</p>
          </div>
        ),
      },
      UA: {
        title: 'КОНФІДЕНЦІЙНІСТЬ',
        content: (
          <div className="space-y-4 text-left">
            <p><strong>ЩО МИ ЗБИРАЄМО</strong><br/>
            При замовленні ми збираємо твоє ім'я, email, телефон і адресу доставки — це те, що реально потрібно, щоб посилка до тебе дійшла. Якщо підписуєшся на дропи, збираємо email для цього.</p>

            <p><strong>ДАНІ ОПЛАТИ</strong><br/>
            Ми не використовуємо платіжний процесор — ти платиш нам напряму банківським переказом або криптою, вказуючи номер замовлення. Це означає, що ми взагалі не бачимо, не збираємо і не зберігаємо дані твоєї карти — ця інформація ніколи не потрапляє на цей сайт.</p>

            <p><strong>ДЕ ЗБЕРІГАЄТЬСЯ</strong><br/>
            Дані замовлень зберігаються в Supabase (наш провайдер бази даних). Листи з підтвердженням замовлення надсилаються через Resend. Ми не продаємо і не передаємо твої дані маркетологам — єдині треті сторони тут ті, що допомагають нам вести магазин і відправляти замовлення.</p>

            <p><strong>ТВІЙ КОНТРОЛЬ</strong><br/>
            Хочеш видалити свої дані або відписатись від розсилки? Просто напиши нам — зробимо це вручну, без автоматичної тяганини.</p>
          </div>
        ),
      },
    },
  };

  const sections: SectionId[] = ['shipping', 'returns', 'terms', 'privacy'];

  return (
    <CommonLayout>
      <div className="w-full max-w-3xl mx-auto px-4 my-20 md:my-32 min-h-[50vh]">
        
        <div className="mb-16 text-center">
          <h1 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">
            {currentLang === 'UA' ? 'ІНФОРМАЦІЯ' : 'INFORMATION'}
          </h1>
        </div>

        <div className="w-full flex flex-col gap-y-6">
          {sections.map((id) => {
            const item = infoData[id][currentLang];
            const isOpen = openSection === id;

            return (
              <div key={id} className="flex flex-col">
                <button
                  onClick={() => toggleSection(id)}
                  className="w-full flex items-center justify-between py-4 text-left group cursor-pointer"
                >
                  <span
                    className={`text-sm md:text-base uppercase tracking-[0.15em] font-bold transition-all duration-300 ${
                      isOpen ? 'text-black' : 'text-gray-400 group-hover:text-black'
                    }`}
                  >
                    {item.title}
                  </span>
                  
                  <div className="relative w-4 h-4 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                    <span className="absolute w-full h-[1.5px] bg-current"></span>
                    <span 
                      className={`absolute w-full h-[1.5px] bg-current transition-transform duration-300 ease-out ${
                        isOpen ? 'rotate-0' : 'rotate-90'
                      }`}
                    ></span>
                  </div>
                </button>

                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-[2000px] opacity-100 pt-6 pb-12' : 'max-h-0 opacity-0 pt-0 pb-0'
                  }`}
                >
                  <div className="text-xs md:text-sm leading-relaxed text-[#121212] tracking-wide font-medium pr-4 md:pr-12">
                    {item.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CommonLayout>
  );
}