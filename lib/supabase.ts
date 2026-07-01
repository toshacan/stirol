import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !anonKey) {
  throw new Error("Missing Supabase URL or Anon Key");
}

export const supabase = createClient(url, anonKey);

// Экспортируем функцию
export const getSupabaseAdmin = () => {
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
  }
  return createClient(url, serviceKey);
};