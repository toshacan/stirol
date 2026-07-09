import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { id, label_en, label_ua, order } = await req.json();

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const { data, error } = await supabase
      .from('categories')
      .update({ label_en, label_ua, order: order || 0 })
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    revalidatePath('/api/get-categories');
    revalidatePath('/shop');

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}