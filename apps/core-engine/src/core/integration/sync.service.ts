import { PrismaClient } from '@prisma/client';
import { BaazarSyncClient } from './baazarsync.client';

export class SyncService {
  constructor(private readonly prisma: PrismaClient, private readonly baazarSync: BaazarSyncClient) {}

  async syncRecentData(limit = 100) {
    const errors: string[] = [];
    let customers = 0, sales = 0, events = 0;
    const [customerRows, saleRows, eventRows] = await Promise.all([
      this.prisma.customer.findMany({ orderBy: { updatedAt: 'desc' }, take: limit }),
      this.prisma.sale.findMany({ orderBy: { createdAt: 'desc' }, take: limit }),
      this.prisma.event.findMany({ orderBy: { createdAt: 'desc' }, take: limit }),
    ]);

    for (const c of customerRows) {
      try {
        await this.baazarSync.syncCustomer({
          id: c.id, phone: c.phone, name: c.name, totalSales: c.totalSales, totalOrders: c.totalOrders,
          lastOrderAt: c.lastOrderAt?.toISOString() ?? null, preferredMode: c.preferredMode,
          averageOrderValue: c.averageOrderValue,
        });
        customers++;
      } catch (e) {
        errors.push(`customer:${c.id}: ${e instanceof Error ? e.message : 'unknown'}`);
      }
    }

    for (const s of saleRows) {
      try {
        await this.baazarSync.syncSale({
          id: s.id, customerId: s.customerId, amount: s.amount, mode: s.mode, source: s.source,
          confidence: s.confidence, eventId: s.eventId, createdAt: s.createdAt.toISOString(),
        });
        sales++;
      } catch (e) {
        errors.push(`sale:${s.id}: ${e instanceof Error ? e.message : 'unknown'}`);
      }
    }

    for (const e of eventRows) {
      try {
        await this.baazarSync.publishEvent({
          id: e.id, type: e.type, source: e.source,
          payload: e.payload as Record<string, unknown>,
          metadata: (e.metadata as Record<string, unknown> | null) ?? undefined,
        });
        events++;
      } catch (err) {
        errors.push(`event:${e.id}: ${err instanceof Error ? err.message : 'unknown'}`);
      }
    }

    return { customers, sales, events, errors };
  }
}
