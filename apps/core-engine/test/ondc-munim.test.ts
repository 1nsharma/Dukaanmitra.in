import assert from 'assert';
import { WhatsAppMunimService } from '../src/core/agents/whatsapp-munim.agent';
import { BillParserAgent } from '../src/core/agents/bill-parser.agent';
import { OndcService } from '../src/core/integration/ondc.service';

async function runTestSuite() {
  console.log('🚀 Starting ONDC Integration & WhatsApp Munim Verification Suite...\n');

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. WhatsApp Munim Natural Language Billing Parser
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('1️⃣ Testing WhatsApp Munim Natural Language Intent Parsing...');
  const munimService = new WhatsAppMunimService();

  // A: Udhaar (Credit) Sale
  const udhaarIntent = munimService.parseMunimMessage('Ramesh ko 200 ka atta udhaar diya');
  assert.strictEqual(udhaarIntent.intent, 'UDHAAR_ENTRY');
  assert.strictEqual(udhaarIntent.amount, 200);
  assert.strictEqual(udhaarIntent.mode, 'UDHAAR');
  assert(udhaarIntent.customerName?.toLowerCase().includes('ramesh'), `Expected customer name Ramesh, got ${udhaarIntent.customerName}`);
  console.log('   ✓ Parsed Udhaar Entry:', udhaarIntent);

  // B: High-Value Udhaar triggering Maker-Checker
  const highUdhaar = munimService.parseMunimMessage('Sunil 1200 udhaar');
  assert.strictEqual(highUdhaar.intent, 'UDHAAR_ENTRY');
  assert.strictEqual(highUdhaar.amount, 1200);
  assert.strictEqual(highUdhaar.requiresConfirmation, true, 'High-value credit must require maker-checker confirmation');
  console.log('   ✓ High-Value Udhaar Maker-Checker Flag:', highUdhaar);

  // C: Jama (Payment settlement)
  const jamaIntent = munimService.parseMunimMessage('Suresh ne 500 jama kiya cash');
  assert.strictEqual(jamaIntent.intent, 'JAMA_ENTRY');
  assert.strictEqual(jamaIntent.amount, 500);
  assert.strictEqual(jamaIntent.mode, 'CASH');
  console.log('   ✓ Parsed Jama Entry:', jamaIntent);

  // D: Instant UPI Sale
  const upiIntent = munimService.parseMunimMessage('PhonePe se 350 online mila');
  assert.strictEqual(upiIntent.intent, 'INSTANT_SALE');
  assert.strictEqual(upiIntent.amount, 350);
  assert.strictEqual(upiIntent.mode, 'UPI');
  console.log('   ✓ Parsed Instant UPI Sale:', upiIntent);

  // E: Hisab-Kitab / Balance Inquiry
  const hisabIntent = munimService.parseMunimMessage('Ramesh ka hisab batao');
  assert.strictEqual(hisabIntent.intent, 'BALANCE_INQUIRY');
  console.log('   ✓ Parsed Khata Balance Inquiry:', hisabIntent);

  // F: Daily Summary
  const summaryIntent = munimService.parseMunimMessage('Aaj ka hisab dikhao');
  assert.strictEqual(summaryIntent.intent, 'DAILY_SUMMARY');
  console.log('   ✓ Parsed Daily Summary Query:', summaryIntent);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. WhatsApp Munim Slip Generators (Invoice, Reminder, Maker-Checker)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n2️⃣ Testing Digital Invoices & WhatsApp Reminder Slip Generators...');

  const sampleInvoiceSlip = munimService.generateInvoiceSlip({
    invoiceNumber: 'INV-2026-0042',
    storeName: 'Gupta General Store',
    storePhone: '+919876543210',
    customerName: 'Aakash Verma',
    items: [
      { name: 'Atta 5kg', quantity: 1, unitPrice: 220, total: 220 },
      { name: 'Mustard Oil 1L', quantity: 2, unitPrice: 140, total: 280 },
    ],
    subtotal: 500,
    gstRate: 5,
    gstAmount: 25,
    total: 525,
    mode: 'UPI',
    upiVpa: 'guptastore@upi',
  });
  assert(sampleInvoiceSlip.includes('DUKAANMITRA MUNIM BILL'), 'Invoice must have title header');
  assert(sampleInvoiceSlip.includes('GUPTA GENERAL STORE'), 'Invoice must have store name');
  assert(sampleInvoiceSlip.includes('₹525.00'), 'Invoice must have grand total');
  assert(sampleInvoiceSlip.includes('upi://pay?pa=guptastore%40upi'), 'Invoice must have UPI payment link');
  console.log('   ✓ Digital Invoice Slip Generated Successfully:\n', sampleInvoiceSlip);

  const sampleReminder = munimService.generateReminderSlip({
    storeName: 'Gupta General Store',
    customerName: 'Aakash ji',
    balanceAmount: 450,
    daysPending: 7,
    upiVpa: 'guptastore@upi',
  });
  assert(sampleReminder.includes('₹450.00'), 'Reminder must include balance');
  assert(sampleReminder.includes('upi://pay?pa=guptastore%40upi'), 'Reminder must include UPI link');
  console.log('\n   ✓ Respectful Udhaar Reminder Slip Generated:\n', sampleReminder);

  const sampleConfirm = munimService.generateConfirmationSlip('prop_test_123', udhaarIntent);
  assert(sampleConfirm.includes('PUSHTI KIJIYE'), 'Confirmation must have header');
  assert(sampleConfirm.includes('HAAN'), 'Confirmation must have approval option');
  console.log('\n   ✓ Maker-Checker Confirmation Slip Generated:\n', sampleConfirm);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. BillParserAgent Integration Verification
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n3️⃣ Testing BillParserAgent Integration with WhatsApp Munim...');
  const billParser = new BillParserAgent(null as any, null as any);
  const parsedSale = billParser.parseBillFromText('Sale ₹450 paid via cash');
  assert.strictEqual(parsedSale?.amount, 450);
  assert.strictEqual(parsedSale?.mode, 'CASH');

  const parsedMunimText = billParser.parseBillFromText('Ramesh ko 300 ka udhaar diya');
  assert.strictEqual(parsedMunimText?.amount, 300);
  assert.strictEqual(parsedMunimText?.mode, 'UDHAAR');
  console.log('   ✓ BillParserAgent correctly handles natural Hindi/Hinglish udhaar and cash sales.');

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. ONDC Beckn Protocol v1.2 Implementation Suite
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n4️⃣ Testing ONDC Protocol v1.2 Full Lifecycle (Search -> Select -> Init -> Confirm -> Status -> Cancel)...');
  const mockPrisma = {
    customer: {
      findUnique: async () => null,
      create: async (args: any) => ({ id: 'cust_ondc_test', ...args.data }),
      update: async (args: any) => ({ id: 'cust_ondc_test', ...args.data }),
    },
    sale: {
      create: async (args: any) => ({ id: 'sale_ondc_test', ...args.data }),
    },
  } as any;

  const ondcService = new OndcService(mockPrisma);

  const baseContext = {
    domain: 'nic2004:52110',
    country: 'IND',
    city: 'std:011',
    action: 'search' as const,
    core_version: '1.2.0',
    bap_id: 'buyerapp.ondc.org',
    bap_uri: 'https://buyerapp.ondc.org/protocol/v1',
    bpp_id: 'bpp.dukaanmitra.in',
    bpp_uri: 'https://api.dukaanmitra.in/ondc',
    transaction_id: 'txn_ondc_2026_001',
    message_id: 'msg_ondc_2026_001',
    timestamp: new Date().toISOString(),
  };

  // Step A: Search / Discovery
  const searchRes = await ondcService.handleSearch({
    context: baseContext,
    message: {
      intent: {
        item: { descriptor: { name: 'Atta' } },
      },
    },
  });
  assert.strictEqual(searchRes.context.action, 'on_search');
  const bppProviders = searchRes.message.catalog['bpp/providers'];
  assert(bppProviders.length > 0, 'Catalog must contain providers');
  assert(bppProviders[0].items.length > 0, 'Catalog must contain items');
  console.log(`   ✓ ONDC on_search returned ${bppProviders[0].items.length} items for intent "Atta"`);

  // Step B: Select / Quote
  const selectRes = ondcService.handleSelect({
    context: { ...baseContext, action: 'select' },
    message: {
      order: {
        provider: { id: 'dm_kirana_central_01' },
        items: [
          { id: 'sku_atta_5kg', quantity: { count: 1 } },
          { id: 'sku_oil_1l', quantity: { count: 2 } },
        ],
      },
    },
  });
  assert.strictEqual(selectRes.context.action, 'on_select');
  const quotePrice = parseFloat(selectRes.message.order.quote.price.value);
  assert(quotePrice > 500, `Quote should include items + taxes + delivery, got ₹${quotePrice}`);
  console.log(`   ✓ ONDC on_select calculated itemized quote: ₹${quotePrice} (with CGST, SGST & delivery fees)`);

  // Step C: Init / Address Setup
  const initRes = ondcService.handleInit({
    context: { ...baseContext, action: 'init' },
    message: {
      order: {
        provider: { id: 'dm_kirana_central_01' },
        items: [{ id: 'sku_atta_5kg', quantity: { count: 1 } }],
        billing: {
          name: 'Rahul Sharma',
          phone: '+919811122233',
          address: { door: 'Flat 402', street: 'MG Road', city: 'New Delhi', state: 'Delhi', area_code: '110001' },
        },
        fulfillments: [
          {
            id: 'ful_1',
            type: 'Delivery',
            end: {
              location: { gps: '28.6139,77.2090', address: { door: '402', street: 'MG Road', city: 'New Delhi', state: 'Delhi', area_code: '110001' } },
              contact: { phone: '+919811122233' },
            },
          },
        ],
      },
    },
  });
  assert.strictEqual(initRes.context.action, 'on_init');
  assert.strictEqual(initRes.message.order.billing.name, 'Rahul Sharma');
  console.log('   ✓ ONDC on_init accepted billing and fulfillment delivery endpoints');

  // Step D: Confirm / Order Creation
  const confirmRes = await ondcService.handleConfirm({
    context: { ...baseContext, action: 'confirm' },
    message: {
      order: {
        provider: { id: 'dm_kirana_central_01' },
        items: [{ id: 'sku_atta_5kg', quantity: { count: 1 } }],
        billing: {
          name: 'Rahul Sharma',
          phone: '+919811122233',
          address: { city: 'New Delhi', area_code: '110001' },
        },
        fulfillments: [
          { id: 'ful_1', type: 'Delivery', end: { location: { gps: '28.6139,77.2090' }, contact: { phone: '+919811122233' } } },
        ],
        payment: {
          type: 'ON-ORDER',
          status: 'PAID',
          params: { transaction_id: 'upi_tx_998877', amount: '276.75', currency: 'INR' },
        },
      },
    },
  });
  assert.strictEqual(confirmRes.context.action, 'on_confirm');
  assert.strictEqual(confirmRes.message.order.state, 'Accepted');
  const createdOrderId = confirmRes.message.order.id;
  assert(createdOrderId.startsWith('ONDC-ORD-'), 'Order ID must have ONDC-ORD prefix');
  console.log(`   ✓ ONDC on_confirm created order: ${createdOrderId} (State: Accepted)`);

  // Step E: Status / Tracking
  const statusRes = ondcService.handleStatus({ ...baseContext, action: 'status' }, createdOrderId);
  assert.strictEqual(statusRes.context.action, 'on_status');
  assert.strictEqual(statusRes.message.order.state, 'In-Transit');
  console.log(`   ✓ ONDC on_status live tracking: ${statusRes.message.order.state}`);

  // Step F: Cancel
  const cancelRes = ondcService.handleCancel({ ...baseContext, action: 'cancel' }, createdOrderId, '002');
  assert.strictEqual(cancelRes.context.action, 'on_cancel');
  assert.strictEqual(cancelRes.message.order.state, 'Cancelled');
  console.log('   ✓ ONDC on_cancel processed cancellation cleanly.');

  // Step G: Catalog Sync
  const syncRes = await ondcService.syncCatalog('store_kirana_01');
  assert.strictEqual(syncRes.success, true);
  console.log(`   ✓ ONDC Catalog synchronization verified (${syncRes.itemCount} SKUs synced to BPP registry).`);

  console.log('\n🎉 ALL ONDC INTEGRATION & WHATSAPP MUNIM BILLING TESTS PASSED 100% SUCCESSFULLY!\n');
}

runTestSuite().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
