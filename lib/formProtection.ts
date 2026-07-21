type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, RateLimitEntry>();

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  return request.headers.get('x-real-ip') || 'unknown';
}

/** Best-effort limiter for public forms. It is intentionally dependency-free. */
export function isRateLimited(request: Request, route: string, options: RateLimitOptions): boolean {
  const now = Date.now();
  const key = `${route}:${getClientIp(request)}`;
  const current = attempts.get(key);

  if (!current || now >= current.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + options.windowMs });
    return false;
  }

  if (current.count >= options.limit) return true;

  current.count += 1;
  return false;
}

/** Makes user input safe to insert into an HTML email. */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
