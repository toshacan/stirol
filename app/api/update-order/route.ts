import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  const { id, updates } = await request.json();
  const supabaseAdmin = getSupabaseAdmin();
  
  const { error } = await supabaseAdmin
    .from('orders')
    .update(updates)
    .eq('id', id);

  return NextResponse.json({ success: !error });
}