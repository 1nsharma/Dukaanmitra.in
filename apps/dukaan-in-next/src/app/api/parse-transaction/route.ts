import { NextResponse } from 'next/server';
import { parseTransaction } from '@/ai/flows/transaction-parser-flow';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { query?: string };
    const query = body?.query?.trim();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const result = await parseTransaction({ query });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Parse transaction API error:', error);
    return NextResponse.json(
      { error: 'Failed to parse transaction' },
      { status: 500 }
    );
  }
}
