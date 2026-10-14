import { Job } from 'bull';
import { PrismaClient } from '@prisma/client';
import { EventRouter } from '../events/event-router';
import { BaseEvent, EventType, EventSource } from '../events/types';

export class CustomerIntelligenceAgent {
  private prisma: PrismaClient;
  private eventRouter: EventRouter;

  constructor(prisma: PrismaClient, eventRouter: EventRouter) {
    this.prisma = prisma;
    this.eventRouter = eventRouter;
  }

  async process(job: Job<BaseEvent>): Promise<void> {
    const event = job.data;

    if (event.type === EventType.BILL_PARSED) {
      await this.handleBillParsed(event);
    } else if (event.type === EventType.SALE_ADD) {
      await this.handleSaleAdd(event);
    }
  }

  private async handleBillParsed(event: BaseEvent): Promise<void> {
    const { amount, mode, confidence, phone } = event.payload;

    let customer = await this.prisma.customer.findUnique({
      where: { phone },
    });

    if (!customer) {
      customer = await this.prisma.customer.create({
        data: {
          phone,
          totalSales: 0,
          totalOrders: 0,
        },
      });
    }

    const sale = await this.prisma.sale.create({
      data: {
        customerId: customer.id,
        amount,
        mode,
        source: EventSource.WHATSAPP,
        confidence,
        eventId: event.id,
      },
    });

    const updatedCustomer = await this.prisma.customer.update({
      where: { id: customer.id },
      data: {
        totalSales: { increment: amount },
        totalOrders: { increment: 1 },
        lastOrderAt: new Date(),
        preferredMode: mode !== 'UNKNOWN' ? mode : customer.preferredMode,
      },
    });

    const averageOrderValue = updatedCustomer.totalOrders > 0
      ? updatedCustomer.totalSales / updatedCustomer.totalOrders
      : 0;

    await this.prisma.customer.update({
      where: { id: customer.id },
      data: { averageOrderValue },
    });

    await this.eventRouter.route({
      type: EventType.CUSTOMER_UPDATED,
      source: EventSource.SYSTEM,
      payload: {
        customerId: updatedCustomer.id,
        phone: updatedCustomer.phone,
        totalSales: updatedCustomer.totalSales,
        totalOrders: updatedCustomer.totalOrders,
        lastOrderAt: updatedCustomer.lastOrderAt || new Date(),
      },
      metadata: {
        parentEventId: event.id,
        saleId: sale.id,
      },
    });
  }

  private async handleSaleAdd(event: BaseEvent): Promise<void> {
    const { amount, mode, phone } = event.payload;

    if (!phone) {
      console.log('Sale without phone number, skipping customer intelligence');
      return;
    }

    let customer = await this.prisma.customer.findUnique({
      where: { phone },
    });

    if (!customer) {
      customer = await this.prisma.customer.create({
        data: {
          phone,
          totalSales: 0,
          totalOrders: 0,
        },
      });
    }

    await this.prisma.sale.create({
      data: {
        customerId: customer.id,
        amount,
        mode,
        source: event.source,
        confidence: event.payload.confidence || 1.0,
        eventId: event.id,
      },
    });

    const updatedCustomer = await this.prisma.customer.update({
      where: { id: customer.id },
      data: {
        totalSales: { increment: amount },
        totalOrders: { increment: 1 },
        lastOrderAt: new Date(),
      },
    });

    const averageOrderValue = updatedCustomer.totalOrders > 0
      ? updatedCustomer.totalSales / updatedCustomer.totalOrders
      : 0;

    await this.prisma.customer.update({
      where: { id: customer.id },
      data: { averageOrderValue },
    });
  }
}
