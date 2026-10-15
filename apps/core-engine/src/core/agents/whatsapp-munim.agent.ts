import { PrismaClient } from '@prisma/client';
import { EventRouter } from '../events/event-router';
import { EventType, EventSource } from '../events/types';

export interface MunimLineItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface MunimParsedIntent {
  intent: 'UDHAAR_ENTRY' | 'JAMA_ENTRY' | 'INSTANT_SALE' | 'BALANCE_INQUIRY' | 'DAILY_SUMMARY' | 'UNKNOWN';
  customerName?: string;
  phone?: string;
  amount?: number;
  mode: 'CASH' | 'UPI' | 'UDHAAR' | 'ONLINE' | 'UNKNOWN';
  items?: MunimLineItem[];
  rawText: string;
  confidence: number;
  requiresConfirmation?: boolean;
}

export interface InvoiceSlipInput {
  invoiceNumber: string;
  storeName: string;
  storePhone?: string;
  customerName?: string;
  customerPhone?: string;
  items: MunimLineItem[];
  subtotal: number;
  gstRate?: number; // e.g. 5 for 5% GST
  gstAmount?: number;
  total: number;
  mode: string;
  upiVpa?: string;
  date?: string;
}

export interface ReminderSlipInput {
  storeName: string;
  customerName: string;
  balanceAmount: number;
  daysPending?: number;
  upiVpa?: string;
  storePhone?: string;
}

export class WhatsAppMunimService {
  /**
   * Parses natural language Hindi, Hinglish, and English Kirana billing messages into structured Munim intents.
   */
  public parseMunimMessage(text: string): MunimParsedIntent {
    const raw = text.trim();
    const lower = raw.toLowerCase();

    // 1. Udhaar (Credit) Sale Pattern: e.g. "Ramesh ko 200 ka atta udhaar diya", "Sunil udhaar 500", "Credit 350 to Mohan"
    const udhaarRegex = /(?:([a-zA-Z\u0900-\u097F]+)\s*(?:ko|ka|ne|se)?\s*)?(?:₹|rs\.?|rupees?|inr)?\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)\s*(?:₹|rs\.?|rupees?|rupaye|ka|ki)?\s*(?:(?:ke|ka|ki)?\s*([a-zA-Z\u0900-\u097F\s]+))?\s*(?:udhaar|credit|baki|khata)\s*(?:diya|likho|chadhao|karo)?/i;
    const udhaarMatch = lower.match(udhaarRegex) || lower.match(/(?:udhaar|credit|baki)\s*(?:₹|rs\.?|rupees?)?\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)\s*(?:ko|to)?\s*([a-zA-Z\u0900-\u097F]+)/i);

    if (lower.includes('udhaar') || lower.includes('credit') || lower.includes('baki') || lower.includes('khate')) {
      const amtMatch = lower.match(/(?:₹|rs\.?|rupees?|inr)?\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)\s*(?:₹|rs\.?|rupees?|rupaye)?/);
      const amount = amtMatch ? parseFloat(amtMatch[1].replace(/,/g, '')) : undefined;

      // Extract customer name
      const words = raw.split(/\s+/);
      let customerName = 'Grahak';
      for (const w of words) {
        const clean = w.replace(/[^\w\u0900-\u097F]/g, '');
        if (clean && !['udhaar', 'credit', 'baki', 'khata', 'ko', 'ka', 'ki', 'diya', 'likho', 'rs', 'rupees', 'inr', 'sale', 'me', 'mein'].includes(clean.toLowerCase()) && isNaN(Number(clean))) {
          customerName = clean;
          break;
        }
      }

      if (amount && amount > 0) {
        return {
          intent: 'UDHAAR_ENTRY',
          customerName,
          amount,
          mode: 'UDHAAR',
          rawText: raw,
          confidence: 0.92,
          requiresConfirmation: amount >= 500, // Maker-checker for high-value credit
        };
      }
    }

    // 2. Jama (Settlement / Payment Received): e.g. "Ramesh ne 200 jama kiya", "Received 500 cash from Suresh"
    if (lower.includes('jama') || lower.includes('vasooli') || lower.includes('settle') || lower.includes('paid back') || lower.includes('received from')) {
      const amtMatch = lower.match(/(?:₹|rs\.?|rupees?|inr)?\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)/);
      const amount = amtMatch ? parseFloat(amtMatch[1].replace(/,/g, '')) : undefined;

      let mode: 'CASH' | 'UPI' = 'CASH';
      if (lower.includes('upi') || lower.includes('online') || lower.includes('phonepe') || lower.includes('paytm') || lower.includes('gpay')) {
        mode = 'UPI';
      }

      let customerName = 'Grahak';
      const words = raw.split(/\s+/);
      for (const w of words) {
        const clean = w.replace(/[^\w\u0900-\u097F]/g, '');
        if (clean && !['jama', 'vasooli', 'settle', 'received', 'from', 'ne', 'se', 'diya', 'kiya', 'cash', 'upi', 'rs', 'rupees'].includes(clean.toLowerCase()) && isNaN(Number(clean))) {
          customerName = clean;
          break;
        }
      }

      if (amount && amount > 0) {
        return {
          intent: 'JAMA_ENTRY',
          customerName,
          amount,
          mode,
          rawText: raw,
          confidence: 0.94,
        };
      }
    }

    // 3. Daily Summary: e.g. "Aaj ka hisab", "Today sales", "Bikri summary", "Aaj ki bikri"
    if (lower.includes('aaj ka') || lower.includes('aaj ki') || lower.includes('today') || lower.includes('summary') || lower.includes('din bhar ki bikri')) {
      return {
        intent: 'DAILY_SUMMARY',
        mode: 'UNKNOWN',
        rawText: raw,
        confidence: 0.95,
      };
    }

    // 4. Balance / Hisab Inquiry: e.g. "Ramesh ka hisab batao", "Kitna baki hai", "Khata check"
    if (lower.includes('hisab') || lower.includes('balance') || lower.includes('khata dikhao') || lower.includes('kitna baki')) {
      let customerName = 'All';
      const words = raw.split(/\s+/);
      for (const w of words) {
        const clean = w.replace(/[^\w\u0900-\u097F]/g, '');
        if (clean && !['hisab', 'balance', 'khata', 'dikhao', 'batao', 'ka', 'ki', 'kitna', 'baki', 'hai'].includes(clean.toLowerCase())) {
          customerName = clean;
          break;
        }
      }

      return {
        intent: 'BALANCE_INQUIRY',
        customerName,
        mode: 'UNKNOWN',
        rawText: raw,
        confidence: 0.88,
      };
    }

    // 5. Instant Sale (Cash, UPI, Online): e.g. "Cash sale Rs 450", "PhonePe se 350 online mila", "350 mila UPI", "Rs 600 bikri"
    if (
      lower.includes('sale') || lower.includes('bikri') || lower.includes('mila') ||
      lower.includes('aaya') || lower.includes('paid') || lower.includes('received') ||
      lower.includes('phonepe') || lower.includes('gpay') || lower.includes('paytm') ||
      lower.includes('upi') || lower.includes('cash') || /(?:₹|rs\.?|rupees?|inr)/.test(lower)
    ) {
      const amtMatch = lower.match(/(?:₹|rs\.?|rupees?|inr)?\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)/);
      if (amtMatch && amtMatch[1]) {
        const amount = parseFloat(amtMatch[1].replace(/,/g, ''));
        if (amount > 0) {
          let mode: 'CASH' | 'UPI' | 'ONLINE' = 'CASH';
          if (lower.includes('upi') || lower.includes('online') || lower.includes('phonepe') || lower.includes('paytm') || lower.includes('gpay')) {
            mode = 'UPI';
          }

          return {
            intent: 'INSTANT_SALE',
            amount,
            mode,
            rawText: raw,
            confidence: 0.90,
          };
        }
      }
    }

    return {
      intent: 'UNKNOWN',
      mode: 'UNKNOWN',
      rawText: raw,
      confidence: 0.3,
    };
  }

  /**
   * Generates a WhatsApp-native digital invoice slip with GST breakdown and UPI payment deep-link.
   */
  public generateInvoiceSlip(data: InvoiceSlipInput): string {
    const dateStr = data.date || new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const lines = [
      '🧾 *DUKAANMITRA MUNIM BILL*',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      `🏪 *${data.storeName.toUpperCase()}*`,
      data.storePhone ? `📞 Sampark: ${data.storePhone}` : '',
      `📄 Bill No: #${data.invoiceNumber}`,
      `📅 Dinank: ${dateStr}`,
      data.customerName ? `👤 Grahak: ${data.customerName}` : '',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      '*Madad / Items:*',
    ];

    if (data.items && data.items.length > 0) {
      for (const item of data.items) {
        lines.push(` • ${item.name} (Qty ${item.quantity} x ₹${item.unitPrice}) = *₹${item.total.toFixed(2)}*`);
      }
    } else {
      lines.push(` • Retail Bill Item: *₹${data.subtotal.toFixed(2)}*`);
    }

    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push(`💵 Subtotal: ₹${data.subtotal.toFixed(2)}`);

    if (data.gstAmount && data.gstAmount > 0) {
      const cgst = (data.gstAmount / 2).toFixed(2);
      const sgst = (data.gstAmount / 2).toFixed(2);
      lines.push(`🏷️ CGST (${(data.gstRate || 5) / 2}%): ₹${cgst}`);
      lines.push(`🏷️ SGST (${(data.gstRate || 5) / 2}%): ₹${sgst}`);
    }

    lines.push(`💰 *KUL RAKAM: ₹${data.total.toFixed(2)}*`);
    lines.push(`💳 Bhugtan Mode: *${data.mode.toUpperCase()}*`);
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━');

    if (data.upiVpa) {
      const upiUrl = `upi://pay?pa=${encodeURIComponent(data.upiVpa)}&pn=${encodeURIComponent(data.storeName)}&am=${data.total.toFixed(2)}&cu=INR&tn=Bill-${data.invoiceNumber}`;
      lines.push(`📲 *UPI se turant bhugtan karein:*`);
      lines.push(upiUrl);
      lines.push('━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    lines.push('🙏 *DukaanMitra Digital Munim dwara surakshit!*');
    lines.push('🌾 _Vocal for Local — Apni Dukaan, Digital Pehchaan_');

    return lines.filter(Boolean).join('\n');
  }

  /**
   * Generates a respectful, relationship-preserving WhatsApp Udhaar payment reminder slip.
   */
  public generateReminderSlip(data: ReminderSlipInput): string {
    const lines = [
      `🙏 *Namaste ${data.customerName} ji!*`,
      '',
      `Aapki apni dukaan *${data.storeName}* ki taraf se pranaam.`,
      `Aapke khate mein kul pichla udhaar: *₹${data.balanceAmount.toFixed(2)}* baaki hai.`,
    ];

    if (data.daysPending && data.daysPending > 0) {
      lines.push(`⏳ Pichle ${data.daysPending} dinon se baaki.`);
    }

    if (data.upiVpa) {
      const upiUrl = `upi://pay?pa=${encodeURIComponent(data.upiVpa)}&pn=${encodeURIComponent(data.storeName)}&am=${data.balanceAmount.toFixed(2)}&cu=INR&tn=Udhaar-Chukta`;
      lines.push('');
      lines.push('Aap neeche diye gaye link par tap karke GooglePay/PhonePe/Paytm se asani se bhugtan kar sakte hain:');
      lines.push(`👉 *${upiUrl}*`);
    }

    lines.push('');
    lines.push('Kisi bhi jaankari ke liye dukan par sampark karein.');
    lines.push('Aapka din shubh ho! 🌾');

    return lines.join('\n');
  }

  /**
   * Generates an interactive maker-checker safety confirmation slip for high-value WhatsApp transactions.
   */
  public generateConfirmationSlip(proposalId: string, intent: MunimParsedIntent): string {
    return [
      '⚠️ *PUSHTI KIJIYE (CONFIRM ENTRY)*',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      `👤 Grahak: *${intent.customerName || 'Customer'}*`,
      `💰 Rakam: *₹${(intent.amount || 0).toFixed(2)}*`,
      `📋 Kism: *${intent.intent === 'UDHAAR_ENTRY' ? 'Udhaar Khata (Credit)' : 'Jama (Settlement)'}*`,
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      'Kripya pushti ke liye reply karein:',
      '👉 *1* ya *HAAN* — Khate mein save karein',
      '👉 *2* ya *NAHI* — Cancel karein',
      `[Proposal ID: ${proposalId.slice(0, 8)}]`,
    ].join('\n');
  }
}

export class WhatsAppMunimAgent {
  private service: WhatsAppMunimService;

  constructor(
    private readonly prisma: PrismaClient,
    private readonly eventRouter: EventRouter
  ) {
    this.service = new WhatsAppMunimService();
  }

  public getService(): WhatsAppMunimService {
    return this.service;
  }

  async processIncomingMessage(phone: string, text: string, messageId: string): Promise<any> {
    const parsed = this.service.parseMunimMessage(text);

    if (parsed.intent === 'UDHAAR_ENTRY' || parsed.intent === 'INSTANT_SALE') {
      await this.eventRouter.route({
        type: EventType.BILL_PARSED,
        source: EventSource.WHATSAPP,
        payload: {
          amount: parsed.amount || 0,
          mode: parsed.mode,
          confidence: parsed.confidence,
          phone,
          customerName: parsed.customerName,
          originalMessageId: messageId,
        },
      });
    }

    return parsed;
  }
}
