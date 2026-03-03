import { NextResponse } from 'next/server';
import { runSelfHealing } from '@/ai/flows/self-healing-flow';

export const dynamic = 'force-dynamic';

/**
 * Platform Self-Healing Cron
 * Expected to be triggered every hour.
 */
export async function GET() {
  try {
    const result = await runSelfHealing();
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('[Cron] Self-healing failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
