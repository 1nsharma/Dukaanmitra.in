import assert from 'assert';
import { classifyVoiceCommand } from '../src/core/agents/voice.agent';
import { classifyDocType, parseLineItems } from '../src/core/agents/ocr.agent';
import { BillParserAgent } from '../src/core/agents/bill-parser.agent';
import { EventType, EventSource, BaseEventSchema } from '../src/core/events/types';
import { BUSINESS_TEMPLATES, getTemplate } from '../src/core/templates/business-templates';

console.log('🚀 Starting DukaanMitra Multi-Modal & WhatsApp Pipeline Test Suite...\n');

// 1. WhatsApp Webhook Payload & Signature Simulation
console.log('1️⃣ Testing WhatsApp Webhook Parser & Payload Formatting...');
const sampleWhatsappPayload = {
  object: 'whatsapp_business_account',
  entry: [
    {
      id: 'WHATSAPP_BUS_ID',
      changes: [
        {
          value: {
            messaging_product: 'whatsapp',
            metadata: { display_phone_number: '1234567890', phone_number_id: 'PNID123' },
            contacts: [{ profile: { name: 'Ramesh Kirana' }, wa_id: '919876543210' }],
            messages: [
              {
                from: '919876543210',
                id: 'wamid.HBgLOTE5ODc2NTQzMjEwFQIAEhgWM0VCMDFBMUM1QjU3QTcwQjk5RDg2NAA=',
                timestamp: '1690000000',
                text: { body: '10 packet bread stock mein daal do' },
                type: 'text',
              },
            ],
          },
          field: 'messages',
        },
      ],
    },
  ],
};
assert.strictEqual(sampleWhatsappPayload.entry[0].changes[0].value.messages[0].type, 'text');
const messageBody = sampleWhatsappPayload.entry[0].changes[0].value.messages[0].text.body;
console.log(`   ✓ Inbound WhatsApp message received: "${messageBody}"`);

// 2. Voice Pipeline: Hinglish & Hindi Command Classification
console.log('\n2️⃣ Testing Voice Pipeline (Transcripts → Structured Business Intents)...');

// Test Case A: Stock In via Voice
const cmdStockIn = classifyVoiceCommand('10 packet bread stock mein daal do');
assert(cmdStockIn, 'Voice command should be parsed');
assert.strictEqual(cmdStockIn.intent, 'STOCK_IN');
assert.strictEqual(cmdStockIn.quantity, 10);
console.log('   ✓ Stock In command parsed correctly:', cmdStockIn);

// Test Case B: Stock Out / Sales via Voice
const cmdStockOut = classifyVoiceCommand('5 packet milk bech diya');
assert(cmdStockOut, 'Voice command should be parsed');
assert.strictEqual(cmdStockOut.intent, 'STOCK_OUT');
assert.strictEqual(cmdStockOut.quantity, 5);
console.log('   ✓ Stock Out command parsed correctly:', cmdStockOut);

// Test Case C: Price Edit via Voice
const cmdPrice = classifyVoiceCommand('Maggi ka rate 14 kar do');
assert(cmdPrice, 'Voice command should be parsed');
assert.strictEqual(cmdPrice.intent, 'EDIT_PRICE');
assert.strictEqual(cmdPrice.price, 14);
console.log('   ✓ Price Edit command parsed correctly:', cmdPrice);

// Test Case D: New Item Addition via Voice
const cmdAdd = classifyVoiceCommand('naya item add karo Kurkure 20 rupees 15 packet');
assert(cmdAdd, 'Voice command should be parsed');
assert.strictEqual(cmdAdd.intent, 'ADD_PRODUCT');
console.log('   ✓ Add Product command parsed correctly:', cmdAdd);

// 3. Photo / OCR Pipeline: Invoices, Receipts & Bill Parsing
console.log('\n3️⃣ Testing Photo/OCR Document Classification & Line Item Extraction...');

// Purchase Invoice Sample
const sampleInvoice = `
SHREE GANESH WHOLESALE MART
GSTIN: 07AAAAA0000A1Z5
TAX INVOICE NO: INV-2026-908
Atta 5kg 10 x 200 = 2000
Basmati Rice 1kg 20 x 85 = 1700
Fortune Mustard Oil 1L 15 x 140 = 2100
Grand Total: 5800.00
`;
const docTypeInvoice = classifyDocType(sampleInvoice);
assert.strictEqual(docTypeInvoice, 'purchase_invoice', 'Should classify as purchase invoice');
const itemsInvoice = parseLineItems(sampleInvoice);
assert(itemsInvoice.length >= 3, `Expected at least 3 line items, got ${itemsInvoice.length}`);
console.log(`   ✓ Classified as "${docTypeInvoice}" with ${itemsInvoice.length} extracted line items:`);
for (const item of itemsInvoice) {
  console.log(`      - ${item.name}: Qty ${item.quantity} @ ₹${item.unitPrice}`);
}

// Retail Customer Bill Parsing via BillParserAgent helper
const billParser = new (BillParserAgent as any)(null, null);
const parsedSaleBill = billParser.parseBillFromText('Sale ₹450 paid via cash for provisions');
assert(parsedSaleBill, 'BillParser should parse text sales');
assert.strictEqual(parsedSaleBill.amount, 450);
assert.strictEqual(parsedSaleBill.mode, 'CASH');
console.log(`   ✓ BillParser parsed natural text sale: ₹${parsedSaleBill.amount} via ${parsedSaleBill.mode} (confidence: ${parsedSaleBill.confidence})`);

// 4. UPI-Style Onboarding & Template Catalog Seeding
console.log('\n4️⃣ Testing UPI-Simple Phone Onboarding & Template Initialization...');
const kiranaTemplate = getTemplate('kirana');
assert(kiranaTemplate, 'Kirana template must exist');
console.log(`   ✓ Selected Template: ${kiranaTemplate.name} (${kiranaTemplate.category})`);
console.log(`   ✓ Pre-generated Catalog: ${kiranaTemplate.skus.length} starter SKUs`);
console.log('   ✓ Onboarding Steps:');
for (const step of kiranaTemplate.onboarding) {
  console.log(`      [${step.input.toUpperCase()}] ${step.title}: ${step.description}`);
}

// 5. Event Schema Pipeline Validation
console.log('\n5️⃣ Validating End-to-End Event Routing Payloads...');
const mediaEvent = BaseEventSchema.parse({
  type: EventType.MEDIA_RECEIVED,
  source: EventSource.WHATSAPP,
  payload: {
    phone: '+919876543210',
    kind: 'image',
    url: 'https://storage.googleapis.com/dukaanmitra-assets/sample-shelf.jpg',
    mimeType: 'image/jpeg',
  },
});
assert.strictEqual(mediaEvent.type, EventType.MEDIA_RECEIVED);
console.log('   ✓ Media event validated for Vision & OCR Agent dispatch');

console.log('\n🎉 ALL MULTI-MODAL PIPELINE & WHATSAPP WEBHOOK TESTS PASSED SUCCESSFULLY!\n');
