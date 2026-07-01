import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

const CONTENT = {
  UA: { 
    subject: 'ВІТАЄМО У STIROL', 
    title: 'WELCOME TO THE FAMILY',
    text: 'Дякуємо за підписку. Ми не спамимо — тільки важливі новини, дропи та ексклюзивний контент.',
    btn: 'ПЕРЕЙТИ В МАГАЗИН'
  },
  EN: { 
    subject: 'WELCOME TO STIROL', 
    title: 'WELCOME TO THE FAMILY',
    text: 'Thanks for subscribing. We don\'t spam — only important news, drops, and exclusive content.',
    btn: 'VISIT STORE'
  }
};

export async function POST(request: Request) {
  try {
    const { email, lang } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const userLang = lang === 'UA' ? 'UA' : 'EN';

    // 1. ПИШЕМ В СУПЕЙС
    const { error: dbError } = await supabaseAdmin
      .from('subscribers')
      .insert([{ email, lang: userLang }]);

    // Проверка на дубликат (если email уже есть в базе)
    if (dbError) {
      if (dbError.code === '23505') { // Код ошибки уникальности PostgreSQL
        return NextResponse.json({ result: 'exists' });
      }
      throw dbError;
    }

    // 2. ОТПРАВЛЯЕМ ПРИВЕТСТВЕННОЕ ПИСЬМО
    const { subject, title, text, btn } = CONTENT[userLang];
    
    const html = `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; background-color: #050505; color: #ffffff; font-family: sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; border: 1px solid #333;">
                <tr>
                  <td align="center" style="padding: 50px 20px 40px; border-bottom: 1px solid #333;">
                    <img src="https://stirol.xyz/logo-heavy.png" alt="STIROL" width="120" style="display: block;" />
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 50px 30px;">
                    <h1 style="font-size: 14px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase;">${title}</h1>
                    <p style="font-size: 12px; line-height: 1.8; color: #a0a0a0; max-width: 350px;">${text}</p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 0 20px 50px;">
                    <a href="https://stirol.xyz" style="background: #fff; color: #000; padding: 14px 30px; font-size: 10px; font-weight: bold; letter-spacing: 0.2em; text-decoration: none; text-transform: uppercase;">${btn}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await resend.emails.send({
      from: 'STIROL <news@stirol.xyz>',
      to: email,
      subject: subject,
      html: html,
    });

    return NextResponse.json({ result: 'success' });
  } catch (error: any) {
    console.error("💥 Subscribe Error:", error);
    return NextResponse.json({ result: 'error' }, { status: 500 });
  }
}