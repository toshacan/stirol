import { NextResponse } from 'next/server';

// --- ПРОСТОЙ RATE-LIMIT В ПАМЯТИ ---
// Ограничение: 5 попыток на IP за 15 минут.
// ВАЖНО: это работает в рамках одного серверного инстанса. На Vercel (serverless)
// это не 100% защита (при холодном старте счётчик может сброситься), но резко
// усложняет автоматический брутфорс — атакующему нужно будет попадать в тот же
// "тёплый" инстанс, а не просто долбить пароль скриптом без всяких ограничений.
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 минут

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'unknown';
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const now = Date.now();

  const record = attempts.get(ip);

  // Если окно истекло — сбрасываем счётчик
  if (record && now > record.resetAt) {
    attempts.delete(ip);
  }

  const current = attempts.get(ip);
  if (current && current.count >= MAX_ATTEMPTS) {
    const secondsLeft = Math.ceil((current.resetAt - now) / 1000);
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${Math.ceil(secondsLeft / 60)} min.` },
      { status: 429 }
    );
  }

  try {
    const { password } = await request.json();
    const secret = process.env.ADMIN_SECRET;

    if (!secret) {
      console.error("❌ ADMIN_SECRET не найден в переменных окружения!");
      return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }

    if (password === secret) {
      // Успешный вход — сбрасываем счётчик попыток для этого IP
      attempts.delete(ip);

      const response = NextResponse.json({ success: true });
      response.cookies.set('admin-auth', password, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 дней
        path: '/',
      });
      return response;
    }

    // Неудачная попытка — увеличиваем счётчик
    const updated = attempts.get(ip);
    attempts.set(ip, {
      count: (updated?.count ?? 0) + 1,
      resetAt: updated && now < updated.resetAt ? updated.resetAt : now + WINDOW_MS,
    });

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}