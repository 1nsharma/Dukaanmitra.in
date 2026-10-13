import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { insertSupabaseRow } from '@/lib/supabase';

const IngestionSchema = z.object({
  eventType: z.string().min(1),
  shopId: z.string().min(1).optional(),
  source: z.string().min(1).default('vercel'),
  payload: z.record(z.any()).default({}),
  createdAt: z.string().datetime().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = IngestionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid payload', errors: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const row = {
      event_type: parsed.data.eventType,
      shop_id: parsed.data.shopId ?? null,
      source: parsed.data.source,
      payload: parsed.data.payload,
      created_at: parsed.data.createdAt ?? new Date().toISOString(),
    };

    await insertSupabaseRow('ingestion_events', row);

    return NextResponse.json({ message: 'Data injected to Supabase successfully.' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
