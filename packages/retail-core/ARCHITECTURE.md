# DukaanMitra Architecture

## Core Philosophy

**WhatsApp is NOT a feature - it is an input channel**

This system treats WhatsApp the same way you would treat a keyboard or a touch screen - as an alternate way to provide input to the same core system. This prevents:

- Duplicate logic between channels
- Feature drift between app and WhatsApp
- Complexity explosion
- Testing nightmares

## Event-Driven Architecture

### Why Events?

Events provide:
1. **Single Source of Truth**: All state changes are recorded
2. **Audit Trail**: Complete history of what happened
3. **Replay Capability**: Can reconstruct state from events
4. **Decoupling**: Components don't need to know about each other
5. **Scalability**: Easy to add new event consumers
6. **Retry Safety**: Failed operations can be retried

### Event Flow

```
Input Channel → Event Store → Event Router → Agent Queue → Agent Process → New Event
```

Every component:
- Receives events
- Processes them
- Emits new events
- Never directly calls other components

## Components Deep Dive

### 1. Event Store (`src/core/events/event-store.ts`)

**Responsibility**: Persist all events immutably

```typescript
await eventStore.save({
  type: EventType.WHATSAPP_MESSAGE_RECEIVED,
  source: EventSource.WHATSAPP,
  payload: { phone, message, message_id }
});
```

**Features**:
- Immutable event log
- Query by type, status, time
- Event replay capability

### 2. Event Router (`src/core/events/event-router.ts`)

**Responsibility**: Route events to appropriate agents

The router knows:
- Which events exist
- Which agents handle which events
- How to queue jobs safely

**Routing Rules**:
```typescript
WHATSAPP_MESSAGE_RECEIVED → bill_parser queue
BILL_PARSED → customer_intelligence queue
CUSTOMER_UPDATED → reply_generator queue
OUTBOUND_MESSAGE_READY → whatsapp_sender queue
```

**Benefits**:
- Automatic retry with exponential backoff
- Job deduplication
- Parallel processing
- Observable queue metrics

### 3. Bill Parser Agent (`src/core/agents/bill-parser.agent.ts`)

**Input**: `WHATSAPP_MESSAGE_RECEIVED`  
**Output**: `BILL_PARSED`

**Responsibility**: Extract structured bill data from unstructured text

**Current Implementation**:
- Regex-based amount extraction
- Payment mode detection (cash/UPI/card)
- Confidence scoring

**Future Enhancements**:
- Image OCR support
- ML-based parsing
- Multi-item bills
- Tax calculation

**Example**:
```
Input: "Aaj 450 rupees cash mila"
Output: {
  amount: 450,
  mode: "CASH",
  confidence: 0.85
}
```

### 4. Customer Intelligence Agent (`src/core/agents/customer-intelligence.agent.ts`)

**Input**: `BILL_PARSED`, `SALE_ADD`  
**Output**: `CUSTOMER_UPDATED`

**Responsibility**: Update customer records and compute analytics

**What it tracks**:
- Total sales per customer
- Total orders
- Last order date
- Preferred payment mode
- Average order value

**Smart Features**:
- Auto-create customers on first sale
- Real-time analytics computation
- Cross-channel customer unification (same phone = same customer)

### 5. Reply Generator Agent (`src/core/agents/reply-generator.agent.ts`)

**Input**: `CUSTOMER_UPDATED`  
**Output**: `OUTBOUND_MESSAGE_READY`

**Responsibility**: Generate context-aware, confidence-appropriate replies

**Reply Strategy**:

| Confidence | Message Style | Example |
|------------|---------------|---------|
| < 0.8 | Soft, tentative | "Mujhe lag raha hai ₹450 ka bill hai. Agar galat ho to bata dena 🙏" |
| ≥ 0.8 | Confident | "✅ ₹450 ka bill save kar liya (CASH)" |

**Personalization**:
- First order: Welcome message
- Repeat customer: Show total stats
- High-value customer: Extra gratitude

### 6. WhatsApp Sender (`src/channels/whatsapp/sender.ts`)

**Input**: `OUTBOUND_MESSAGE_READY`  
**Output**: WhatsApp API call

**Responsibility**: Deliver messages via WhatsApp Business API

**Features**:
- API call handling
- Message status tracking
- Error handling and retry
- Message deduplication

## Channel Implementation

### WhatsApp Channel (`src/channels/whatsapp/`)

**Rules**:
1. ❌ No direct DB writes
2. ❌ No business logic
3. ✅ Only emit events

**webhook.handler.ts**:
- Receives webhooks from WhatsApp
- Validates and deduplicates messages
- Emits `WHATSAPP_MESSAGE_RECEIVED` event
- Returns 200 immediately (no blocking)

**sender.ts**:
- Only called via `OUTBOUND_MESSAGE_READY` event
- Makes WhatsApp API call
- Tracks delivery status

### App Channel (`src/api/routes/app.routes.ts`)

**Same principles**:
- No direct DB writes
- Emit events only
- Let agents handle business logic

**Example - Add Sale**:
```typescript
POST /api/sales
{
  "amount": 450,
  "mode": "CASH",
  "phone": "919876543210"
}

→ Emits SALE_ADD event
→ Same customer intelligence agent processes it
→ Same analytics computation happens
```

## Data Models

### Event Schema
```typescript
{
  id: string           // Unique event ID
  type: EventType      // WHATSAPP_MESSAGE_RECEIVED, BILL_PARSED, etc
  source: EventSource  // APP, WHATSAPP, POS, SYSTEM
  payload: JSON        // Event-specific data
  metadata: JSON       // Context (parent event, confidence, etc)
  status: EventStatus  // PENDING, PROCESSING, COMPLETED, FAILED
  createdAt: DateTime  // Timestamp
}
```

### Customer Schema
```typescript
{
  id: string
  phone: string              // Unique identifier
  name: string?
  totalSales: float          // Lifetime value
  totalOrders: int           // Order count
  lastOrderAt: DateTime?     // Last purchase
  preferredMode: string?     // CASH, UPI, CARD
  averageOrderValue: float   // totalSales / totalOrders
}
```

### Sale Schema
```typescript
{
  id: string
  customerId: string
  amount: float
  mode: string               // CASH, UPI, CARD, UNKNOWN
  source: EventSource        // Where it came from
  confidence: float?         // How sure we are (0-1)
  eventId: string?           // Source event
  createdAt: DateTime
}
```

## Confidence Scoring System

### Why Confidence Matters

Different input channels have different reliability:

| Source | Confidence | Reason |
|--------|------------|--------|
| App | 1.0 | User intentionally clicked |
| POS | 1.0 | Hardware-verified transaction |
| WhatsApp | 0.7-0.95 | AI-parsed, may have errors |

### Confidence Rules

1. **Display**: Always show confidence to user
2. **Language**: Use softer language for low confidence
3. **Actions**: Never auto-execute high-risk actions on low confidence
4. **Learning**: Track corrections to improve ML models

### Example Flow

```
User sends: "450 cash"
↓
Bill Parser: confidence = 0.85 (clear amount, clear mode)
↓
Reply: "✅ ₹450 ka bill save kar liya (CASH)"

vs

User sends: "Four fifty"
↓
Bill Parser: confidence = 0.65 (ambiguous amount)
↓
Reply: "Mujhe lag raha hai ₹450 ka bill hai. Confirm kar do 🙏"
```

## Scaling Strategy

### Horizontal Scaling

Each component can scale independently:

```
3x Bill Parser workers
5x Customer Intelligence workers
2x Reply Generator workers
1x WhatsApp Sender worker
```

Scale based on queue depth and processing time.

### Queue Configuration

```typescript
{
  attempts: 3,                    // Retry failed jobs 3 times
  backoff: {
    type: 'exponential',          // 2s, 4s, 8s
    delay: 2000
  },
  removeOnComplete: true,          // Clean up successful jobs
  removeOnFail: false             // Keep failed jobs for debugging
}
```

## Error Handling

### Retry Strategy

1. **Transient Errors**: Automatic retry (network issues, DB locks)
2. **Permanent Errors**: Log and alert (invalid data, missing config)
3. **Poison Messages**: After 3 retries, move to dead letter queue

### Dead Letter Queue

Failed jobs after all retries go here for manual inspection.

## Testing Strategy

### Unit Tests
- Test each agent in isolation
- Mock event router
- Verify event emission

### Integration Tests
- End-to-end event flow
- Real queue processing
- Database interactions

### Test Events
```typescript
const testEvent: WhatsAppMessageReceived = {
  type: EventType.WHATSAPP_MESSAGE_RECEIVED,
  source: EventSource.WHATSAPP,
  payload: {
    phone: "919876543210",
    message: "₹450 cash",
    message_id: "test_msg_123"
  }
};
```

## Monitoring & Observability

### Key Metrics

1. **Event Throughput**: Events/second by type
2. **Queue Depth**: How many jobs waiting
3. **Processing Time**: Time per agent
4. **Error Rate**: Failed jobs / total jobs
5. **Confidence Distribution**: How often low vs high confidence

### Alerts

- Queue depth > 1000
- Error rate > 5%
- Processing time > 30s
- Event store write failures

## Future Enhancements

### 1. Advanced Confidence Scoring
- ML model trained on historical data
- Context-aware scoring (time, customer history)
- Multi-modal confidence (text + image)

### 2. Abuse Prevention
- Rate limiting per phone number
- Fake bill detection (amount patterns)
- Spam filtering
- Data poisoning protection

### 3. Multi-Channel Support
- POS integration
- Voice calls (IVR)
- SMS fallback
- Email receipts

### 4. Advanced Analytics
- Customer segmentation
- Churn prediction
- Inventory tracking
- Revenue forecasting

## Development Guidelines

### Adding a New Event Type

1. Add to `EventType` enum in `types.ts`
2. Create Zod schema for validation
3. Update router routing rules
4. Create or update agent to handle it
5. Add tests

### Adding a New Agent

1. Create agent class in `src/core/agents/`
2. Implement `process(job)` method
3. Register queue processor in `index.ts`
4. Update routing rules
5. Add tests

### Adding a New Channel

1. Create channel directory in `src/channels/`
2. Implement event emitter (input)
3. Implement event consumer (output, if needed)
4. Follow "no direct writes" rule
5. Add routes in `src/api/routes/`

## Summary

This architecture ensures:
- ✅ Single source of truth (events)
- ✅ No duplicate logic
- ✅ Easy scaling
- ✅ Safe retries
- ✅ Complete audit trail
- ✅ Channel independence
- ✅ Confidence-based UX
- ✅ Future-proof extensibility
