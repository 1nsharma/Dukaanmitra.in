import { NextRequest, NextResponse } from 'next/server';
import { executeAction } from '@/lib/services/action-engine';

type ExecuteActionBody = {
  action?: {
    type?: string;
    payload?: {
      shopId?: string;
      customerPhone?: string;
      transaction?: {
        customer_name?: string;
        amount?: number;
        items?: string;
        type?: 'credit' | 'payment';
      };
    };
  };
  actor?: {
    id?: string;
    role?: string;
    shopId?: string;
  };
};

const MAX_STRING_LENGTH = 500;
const DANGEROUS_INPUT_PATTERN = /(<script|<\/script>|javascript:|onerror\s*=|onload\s*=|--|;\s*drop\s+table)/i;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function sanitizeText(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim().slice(0, MAX_STRING_LENGTH);
  if (!trimmed || DANGEROUS_INPUT_PATTERN.test(trimmed)) {
    return null;
  }
  return trimmed;
}

function validateAndNormalizeBody(body: unknown): { valid: true; data: ExecuteActionBody } | { valid: false; message: string } {
  if (!isPlainObject(body)) {
    return { valid: false, message: 'Payload must be a JSON object.' };
  }

  const parsed = body as ExecuteActionBody;
  if (!isPlainObject(parsed.action) || !isPlainObject(parsed.actor)) {
    return { valid: false, message: 'Missing action or actor object.' };
  }

  const actionType = sanitizeText(parsed.action.type);
  const actorId = sanitizeText(parsed.actor.id);
  const actorRole = sanitizeText(parsed.actor.role);
  const actorShopId = sanitizeText(parsed.actor.shopId);
  const payload = parsed.action.payload;

  if (!actionType || !actorId || !actorRole || !isPlainObject(payload)) {
    return { valid: false, message: 'Invalid required fields in action or actor.' };
  }

  const payloadShopId = sanitizeText(payload.shopId);
  const customerPhone = sanitizeText(payload.customerPhone);
  const transaction = payload.transaction;
  const transactionType = sanitizeText(transaction?.type);
  const customerName = sanitizeText(transaction?.customer_name);
  const items = sanitizeText(transaction?.items);
  const amount = transaction?.amount;

  if (
    !payloadShopId ||
    !customerPhone ||
    !transactionType ||
    (transactionType !== 'credit' && transactionType !== 'payment') ||
    typeof amount !== 'number' ||
    !Number.isFinite(amount)
  ) {
    return { valid: false, message: 'Invalid action payload fields.' };
  }

  return {
    valid: true,
    data: {
      action: {
        type: actionType,
        payload: {
          shopId: payloadShopId,
          customerPhone,
          transaction: {
            customer_name: customerName ?? undefined,
            amount,
            items: items ?? undefined,
            type: transactionType as 'credit' | 'payment',
          },
        },
      },
      actor: {
        id: actorId,
        role: actorRole,
        shopId: actorShopId ?? undefined,
      },
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const validated = validateAndNormalizeBody(body);
    if (!validated.valid) {
      console.error('[VALIDATION_ERROR] /api/execute-action', validated.message);
      return NextResponse.json(
        { success: false, message: validated.message },
        { status: 400 }
      );
    }

    const result = await executeAction(validated.data.action, validated.data.actor);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[API_ERROR] /api/execute-action', error);
    return NextResponse.json(
      { success: false, message: 'Failed to execute action.' },
      { status: 500 }
    );
  }
}
