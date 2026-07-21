import { Resend } from 'resend';
import { escapeHtml } from '@/lib/formProtection';

type OrderEmail = {
  id: string | number;
  email: string;
  lang?: string | null;
  status?: string | null;
  tracking?: string | null;
};

const resend = new Resend(process.env.RESEND_API_KEY);

function receiptTemplate(heading: string, body: string) {
  return `
    <div style="max-width:600px;margin:0 auto;font-family:'Courier New',Courier,monospace;text-transform:uppercase;letter-spacing:.05em;color:#000;padding:28px 20px;background:#fff;border:2px solid #000;">
      <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:18px;margin-bottom:24px;">
        <h1 style="margin:0;font-size:26px;font-weight:900;letter-spacing:.2em;">STIROL</h1>
        <p style="margin:8px 0 0;font-size:11px;font-weight:bold;">${heading}</p>
      </div>
      <div style="font-size:13px;line-height:1.7;white-space:pre-wrap;">${body}</div>
      <div style="text-align:center;font-size:9px;color:#666;border-top:1px solid #000;padding-top:16px;margin-top:28px;">
        STIROL SYSTEM // CONTACT US FOR ANY QUESTIONS
      </div>
    </div>`;
}

export async function sendOrderStatusEmail(order: OrderEmail) {
  const isUkrainian = order.lang === 'UA';
  const isShipped = order.status === 'SHIPPED';
  const heading = isUkrainian
    ? (isShipped ? 'ЗАМОВЛЕННЯ ВІДПРАВЛЕНО' : 'ЗАМОВЛЕННЯ СКАСОВАНО')
    : (isShipped ? 'ORDER SHIPPED' : 'ORDER CANCELLED');
  const tracking = escapeHtml(order.tracking || 'PENDING');
  const body = isUkrainian
    ? (isShipped
      ? `Ми відправили ваше замовлення #${order.id}.\n\nТрек-номер: ${tracking}.`
      : `Ваше замовлення #${order.id} було скасовано.\n\nЯкщо це сталося помилково або вам потрібна допомога — напишіть нам.`)
    : (isShipped
      ? `Your order #${order.id} has been shipped.\n\nTracking number: ${tracking}.`
      : `Your order #${order.id} has been cancelled.\n\nIf this happened by mistake or you need help, please contact us.`);

  return resend.emails.send({
    from: 'STIROL <orders@stirol.xyz>',
    to: order.email,
    subject: `STIROL // ${heading} #${order.id}`,
    html: receiptTemplate(heading, body),
  });
}

export async function sendOrderMessageEmail(order: OrderEmail, subject: string, message: string) {
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  return resend.emails.send({
    from: 'STIROL <orders@stirol.xyz>',
    to: order.email,
    subject: `STIROL // ${subject.trim().slice(0, 100)} #${order.id}`,
    html: receiptTemplate(safeSubject, safeMessage),
  });
}
