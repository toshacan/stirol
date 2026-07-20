import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

const CONTENT = {
  UA: {
    subject: 'ВІТАЄМО У STIROL',
    title: 'WELCOME TO THE FAMILY',
    sub: 'SUBSCRIBER CONFIRMATION',
    text: 'Дякуємо за підписку. Ми не спамимо — тільки важливі новини, дропи та ексклюзивний контент.',
    btn: 'ПЕРЕЙТИ В МАГАЗИН'
  },
  EN: {
    subject: 'WELCOME TO STIROL',
    title: 'WELCOME TO THE FAMILY',
    sub: 'SUBSCRIBER CONFIRMATION',
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

    if (dbError) {
      if (dbError.code === '23505') {
        return NextResponse.json({ result: 'exists' });
      }
      throw dbError;
    }

    // 2. ОТПРАВЛЯЕМ ПРИВЕТСТВЕННОЕ ПИСЬМО — в стиле чека заказа (белый фон, рамка, моно)
    const { subject, title, sub, text, btn } = CONTENT[userLang];

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Courier New', Courier, monospace;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; background-color: #ffffff; border: 2px solid #000;">

                <!-- HEADER -->
                <tr>
                  <td align="center" style="padding: 40px 20px 24px; border-bottom: 2px solid #000;">
                    <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 0.2em; color: #000; text-transform: uppercase;">STIROL</h1>
                    <p style="margin: 8px 0 0 0; font-size: 11px; font-weight: bold; letter-spacing: 0.1em; color: #000; text-transform: uppercase;">${sub}</p>
                  </td>
                </tr>

                <!-- BODY -->
                <tr>
                  <td align="center" style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 16px 0; font-size: 15px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; color: #000;">${title}</h2>
                    <p style="margin: 0; font-size: 12px; line-height: 1.8; color: #444; text-transform: uppercase; letter-spacing: 0.03em; max-width: 360px; display: inline-block;">${text}</p>
                  </td>
                </tr>

                <!-- STAMP / EMAIL CONFIRMATION BLOCK -->
                <tr>
                  <td style="padding: 0 30px 30px;">
                    <table width="100%" style="border: 2px dashed #000; background-color: #fafafa;">
                      <tr>
                        <td align="center" style="padding: 16px;">
                          <p style="margin: 0; font-size: 9px; letter-spacing: 0.15em; color: #666; text-transform: uppercase;">
                            ${userLang === 'UA' ? 'ПІДПИСАНО' : 'SUBSCRIBED'}
                          </p>
                          <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: bold; letter-spacing: 0.05em; color: #000;">
                            ${email}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- BUTTON -->
                <tr>
                  <td align="center" style="padding: 0 20px 40px;">
                    <a href="https://stirol.xyz" style="background: #000; color: #fff; padding: 14px 32px; font-size: 10px; font-weight: bold; letter-spacing: 0.2em; text-decoration: none; text-transform: uppercase; display: inline-block;">${btn}</a>
                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td align="center" style="padding: 20px; border-top: 1px solid #000;">
                    <p style="margin: 0; font-size: 9px; color: #666; letter-spacing: 0.1em;">© ${new Date().getFullYear()} STIROL</p>
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