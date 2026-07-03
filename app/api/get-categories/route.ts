import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Принудительная инвалидация кэша для каждой операции
export const revalidate = 0; 
export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}