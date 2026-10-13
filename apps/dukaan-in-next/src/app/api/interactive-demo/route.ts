import { NextResponse } from 'next/server';
import { interactiveAIDemo } from '@/ai/flows/interactive-ai-demo';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { query?: string };
    const query = body?.query?.trim();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const result = await interactiveAIDemo({ query });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Interactive demo API error:', error);
    return NextResponse.json(
      { error: 'Failed to process interactive demo request' },
      { status: 500 }
    );
  }
}
