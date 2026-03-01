
import { NextResponse } from 'next/server';
import { runSelfHealing } from '@/ai/flows/self-healing-flow';

export async function GET(request: Request) {
  // Simple check for internal execution (should be secured by Vercel Cron header or token in production)
  const authHeader = request.headers.get('authorization');
  
  try {
    const result = await runSelfHealing();
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
