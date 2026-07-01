import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data } = await supabaseAdmin.from('subscribers').select('*').order('created_at', { ascending: false });
  return NextResponse.json(data || []);
}