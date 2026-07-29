import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { NewsletterTemplate } from '@/emails/newsletter-template';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // subscribers: [{ email: '...', lang: 'EN' }, ...]
    const { subscribers, headerText, imageUrl, description, linkUrl } = await req.json();

    // Отправляем по одному письму на подписчика — это нужно, чтобы у каждого
    // была своя персональная ссылка отписки (email в теле письма отличается,
    // поэтому один общий HTML на всех больше не подходит).
    const results = await Promise.allSettled(
      subscribers.map(async (sub: any) => {
        const lang = (sub.lang || 'EN').toUpperCase() as 'EN' | 'UA';

        const html = await render(
          NewsletterTemplate({
            lang,
            headerText,
            imageUrl,
            description,
            linkUrl,
            subscriberEmail: sub.email,
          })
        );

        return resend.emails.send({
          from: 'Stirol <news@stirol.xyz>',
          to: sub.email,
          subject: headerText,
          html: html,
        });
      })
    );

    const failed = results.filter((r) => r.status === 'rejected').length;
    const sent = results.length - failed;

    return NextResponse.json({ success: true, sent, failed });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}