import { NextRequest, NextResponse } from 'next/server';
import { executeAction } from '@/lib/services/action-engine';

export async function POST(request: NextRequest) {
  try {
    const { action, actor } = await request.json();
    if (
      !action ||
      typeof action !== 'object' ||
      typeof action.type !== 'string' ||
      !action.payload ||
      typeof action.payload !== 'object' ||
      !actor ||
      typeof actor !== 'object' ||
      typeof actor.id !== 'string' ||
      typeof actor.role !== 'string'
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid action payload.' },
        { status: 400 }
      );
    }

    const result = await executeAction(action, actor);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to execute action.' },
      { status: 500 }
    );
  }
}
