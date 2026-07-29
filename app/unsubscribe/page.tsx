'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CommonLayout from '@/components/CommonLayout';
import { useLang } from '@/components/LangContext';

function UnsubscribeContent() {
  const { lang } = useLang();
  const currentLang = (lang === 'UA' ? 'UA' : 'EN') as 'EN' | 'UA';
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const t = {
    EN: {
      title: 'UNSUBSCRIBE',
      confirm: `Unsubscribe ${email} from STIROL emails?`,
      button: 'CONFIRM UNSUBSCRIBE',
      loading: 'PROCESSING...',
      done: "YOU'VE BEEN UNSUBSCRIBED",
      doneSub: "You won't receive any more emails from us. You can resubscribe anytime.",
      error: 'SOMETHING WENT WRONG. TRY AGAIN OR MESSAGE US.',
      noEmail: 'NO EMAIL FOUND IN THIS LINK.',
      back: '← BACK TO MAIN',
    },
    UA: {
      title: 'ВІДПИСКА',
      confirm: `Відписати ${email} від листів STIROL?`,
      button: 'ПІДТВЕРДИТИ ВІДПИСКУ',
      loading: 'ОБРОБКА...',
      done: 'ВАС ВІДПИСАНО',
      doneSub: 'Більше листів від нас не буде. Підписатись знову можна в будь-який момент.',
      error: 'ЩОСЬ ПІШЛО НЕ ТАК. СПРОБУЙТЕ ЩЕ РАЗ АБО НАПИШІТЬ НАМ.',
      noEmail: 'У ЦЬОМУ ПОСИЛАННІ НЕМАЄ EMAIL.',
      back: '← НАЗАД НА ГОЛОВНУ',
    },
  };

  const text = t[currentLang];

  const handleUnsubscribe = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setStatus(data.success ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <CommonLayout>
      <div className="max-w-md mx-auto my-auto py-24 px-4 text-center">
        <h1 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-8">
          {text.title}
        </h1>

        {!email ? (
          <p className="text-[12px] text-gray-600">{text.noEmail}</p>
        ) : status === 'done' ? (
          <div className="space-y-3">
            <p className="text-sm font-bold uppercase tracking-wide text-black">{text.done}</p>
            <p className="text-[12px] text-gray-600 leading-relaxed">{text.doneSub}</p>
          </div>
        ) : status === 'error' ? (
          <p className="text-[12px] text-red-600">{text.error}</p>
        ) : (
          <div className="space-y-6">
            <p className="text-[13px] text-gray-700 leading-relaxed">{text.confirm}</p>
            <button
              onClick={handleUnsubscribe}
              disabled={status === 'loading'}
              className="border border-black px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all disabled:opacity-50"
            >
              {status === 'loading' ? text.loading : text.button}
            </button>
          </div>
        )}

        <div className="mt-12">
          <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
            {text.back}
          </Link>
        </div>
      </div>
    </CommonLayout>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={null}>
      <UnsubscribeContent />
    </Suspense>
  );
}