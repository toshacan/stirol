import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ADMIN_PRODUCT_FIELDS } from '@/lib/storefrontProducts';

// Protected by middleware. Keeps admin product management separate from the
// intentionally limited public catalogue response.
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(ADMIN_PRODUCT_FIELDS)
      .order('position', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unable to fetch products.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
