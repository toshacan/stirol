import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { NewsletterTemplate } from '@/emails/newsletter-template';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Теперь принимаем не просто массив email, а массив объектов: [{ email: '...', lang: 'EN' }, ...]
    const { subscribers, headerText, imageUrl, description, linkUrl } = await req.json();

    // Группируем подписчиков по языку, чтобы сделать всего 2 отправки (для EN и UA)
    const groups = subscribers.reduce((acc: any, sub: any) => {
      const lang = (sub.lang || 'EN').toUpperCase();
      if (!acc[lang]) acc[lang] = [];
      acc[lang].push(sub.email);
      return acc;
    }, {});

    const promises = Object.entries(groups).map(async ([lang, emails]) => {
      const html = await render(
        NewsletterTemplate({ 
          lang: lang as 'EN' | 'UA', 
          headerText, 
          imageUrl, 
          description, 
          linkUrl 
        })
      );

      return resend.emails.send({
        from: 'Stirol <news@stirol.xyz>',
        to: emails as string[],
        subject: headerText,
        html: html,
      });
    });

    await Promise.all(promises);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}