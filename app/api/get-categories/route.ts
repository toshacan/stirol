import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Кэшируем на 60 секунд — свежие правки из add/update/delete-category
// сбрасывают кэш немедленно через revalidatePath
export const revalidate = 60;

export async function GET() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}