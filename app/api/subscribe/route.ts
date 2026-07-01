import { NextResponse } from 'next/server';
import { Resend } from 'resend';

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

    // 1. Google Sheets logic
    const googleResponse = await fetch(process.env.GOOGLE_SHEET_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, lang: lang || 'EN' }),
    });
    const result = await googleResponse.json();
    if (result.result === 'exists') return NextResponse.json({ result: 'exists' });

    const { subject, title, text, btn } = CONTENT[lang === 'UA' ? 'UA' : 'EN'];
    
    // 2. Премиальный Dark-дизайн (Табличная верстка)
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #050505; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              
              <!-- Main Container Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; width: 100%; border: 1px solid #333333;">
                
                <!-- Header / White Logo -->
                <tr>
                  <td align="center" style="padding: 50px 20px 40px 20px; border-bottom: 1px solid #333333;">
                    <img src="https://stirol.xyz/logo-heavy.png" alt="STIROL" width="120" style="display: block; max-width: 100%; height: auto;" />
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td align="center" style="padding: 50px 30px;">
                    <h1 style="margin: 0 0 20px 0; font-size: 14px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; color: #ffffff;">
                      ${title}
                    </h1>
                    <p style="margin: 0; font-size: 12px; line-height: 1.8; color: #a0a0a0; max-width: 350px; letter-spacing: 0.05em;">
                      ${text}
                    </p>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding: 0 20px 50px 20px;">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="background-color: #ffffff;">
                          <a href="https://stirol.xyz" target="_blank" style="display: inline-block; padding: 14px 30px; font-size: 10px; font-weight: bold; letter-spacing: 0.2em; color: #000000; text-decoration: none; text-transform: uppercase;">
                            ${btn}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>

              <!-- Footer -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; width: 100%;">
                <tr>
                  <td align="center" style="padding: 30px 20px;">
                    <p style="margin: 0; font-size: 10px; color: #666666; letter-spacing: 0.1em; text-transform: uppercase;">
                      STIROL © 2026
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // 3. Отправляем
    await resend.emails.send({
      from: 'STIROL <news@stirol.xyz>',
      to: email,
      subject: subject,
      html: html,
    });

    return NextResponse.json({ result: 'success' });
  } catch (error: any) {
    return NextResponse.json({ result: 'error' }, { status: 500 });
  }
}