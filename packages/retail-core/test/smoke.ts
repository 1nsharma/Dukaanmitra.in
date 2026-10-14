import assert from 'assert';
import { BUSINESS_TEMPLATES, getTemplate, listTemplates } from '../src/core/templates/business-templates';
import { EventType, EventSource, EventStatus, BaseEventSchema } from '../src/core/events/types';

console.log('🧪 Starting DukaanMitra Verification Suite...');

// 1. Template Verification
console.log(`✓ Loaded ${BUSINESS_TEMPLATES.length} pre-configured business templates:`);
for (const t of BUSINESS_TEMPLATES) {
  assert(t.key, 'Template must have a key');
  assert(t.name, 'Template must have a name');
  assert(t.skus.length > 0, `Template ${t.key} must provide starter inventory`);
  assert(t.onboarding.length > 0, `Template ${t.key} must provide onboarding flow`);
  console.log(`   - [${t.key}] ${t.name} (${t.category}): ${t.skus.length} default SKUs/services`);
}

// 2. Specific key retrieval
const kirana = getTemplate('kirana');
assert(kirana && kirana.name.includes('Kirana'), 'Kirana template must be resolvable');

const salon = getTemplate('salon');
assert(salon && salon.skus.some(s => s.isService), 'Salon must contain service items');

const pharmacy = getTemplate('pharmacy');
assert(pharmacy && pharmacy.skus.some(s => s.category === 'OTC'), 'Pharmacy must contain OTC items');

// 3. Summary list
const summaries = listTemplates();
assert.strictEqual(summaries.length, BUSINESS_TEMPLATES.length, 'Summary list must match template count');
console.log(`✓ Template summary API list verified (${summaries.length} items)`);

// 4. Event Schema Verification
const testEvent = {
  type: EventType.VOICE_TRANSCRIBED,
  source: EventSource.VOICE,
  payload: {
    phone: '+919999999999',
    transcript: '5 packet doodh add karo',
  },
};
const parsed = BaseEventSchema.parse(testEvent);
assert.strictEqual(parsed.status, EventStatus.PENDING, 'Default event status must be PENDING');
console.log('✓ Event schema validation and default status confirmed');

console.log('🎉 All core business management checks PASSED!');
