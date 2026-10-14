# Quick Start Guide

## Prerequisites

Before you begin, ensure you have:

1. **Node.js 18+** installed
2. **PostgreSQL** running locally or remotely
3. **Redis** running (for event queues)
4. **WhatsApp Business API** credentials (optional for initial testing)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and update:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dukaanmitra"

# Redis
REDIS_URL="redis://localhost:6379"

# Server
PORT=3000

# WhatsApp (can be dummy values for local testing)
WHATSAPP_API_URL="https://graph.facebook.com/v18.0"
WHATSAPP_ACCESS_TOKEN="your_token"
WHATSAPP_PHONE_NUMBER_ID="your_phone_id"
WHATSAPP_VERIFY_TOKEN="my_verify_token"
```

## Step 3: Setup Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

This creates all necessary tables:
- Event
- Customer
- Sale
- WhatsAppMessage

## Step 4: Start the Server

```bash
npm run dev
```

You should see:
```
🚀 DukaanMitra server running on port 3000
📱 WhatsApp webhook: http://localhost:3000/whatsapp/webhook
🔌 API endpoint: http://localhost:3000/api
```

## Step 5: Test the System

### Test 1: Health Check

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-23T12:00:00.000Z"
}
```

### Test 2: Add a Sale via App API

```bash
curl -X POST http://localhost:3000/api/sales \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 450,
    "mode": "CASH",
    "phone": "919876543210"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Sale recorded successfully"
}
```

**What happens internally**:
1. `SALE_ADD` event created
2. Event stored in database
3. Event routed to `customer_intelligence` queue
4. Customer record created/updated
5. Sale record created
6. Analytics computed

### Test 3: Simulate WhatsApp Message

```bash
curl -X POST http://localhost:3000/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "changes": [{
        "field": "messages",
        "value": {
          "messages": [{
            "id": "msg_123",
            "from": "919876543210",
            "type": "text",
            "text": {
              "body": "Today I got ₹450 cash payment"
            }
          }]
        }
      }]
    }]
  }'
```

**What happens internally**:
1. `WHATSAPP_MESSAGE_RECEIVED` event created
2. Routed to `bill_parser` agent
3. Bill parser extracts: amount=450, mode=CASH, confidence=0.85
4. `BILL_PARSED` event created
5. Routed to `customer_intelligence` agent
6. Customer and sale records updated
7. `CUSTOMER_UPDATED` event created
8. Routed to `reply_generator` agent
9. Reply message generated with confidence level
10. `OUTBOUND_MESSAGE_READY` event created
11. Routed to `whatsapp_sender` agent
12. (Would send via WhatsApp API if configured)

### Test 4: Check Event Log

Query the database to see all events:

```sql
SELECT id, type, source, created_at 
FROM "Event" 
ORDER BY created_at DESC 
LIMIT 10;
```

### Test 5: Check Customer Data

```sql
SELECT phone, "totalSales", "totalOrders", "averageOrderValue"
FROM "Customer"
WHERE phone = '919876543210';
```

## Understanding the Flow

### App Flow (High Confidence)

```
User clicks "Add Sale" in app
  ↓
POST /api/sales
  ↓
SALE_ADD event (confidence: 1.0)
  ↓
Customer Intelligence Agent
  ↓
Customer & Sale records updated
  ↓
Done (no reply needed for app)
```

### WhatsApp Flow (AI-Parsed)

```
User sends WhatsApp message
  ↓
POST /whatsapp/webhook
  ↓
WHATSAPP_MESSAGE_RECEIVED event
  ↓
Bill Parser Agent (extracts data)
  ↓
BILL_PARSED event (confidence: 0.7-0.95)
  ↓
Customer Intelligence Agent
  ↓
CUSTOMER_UPDATED event
  ↓
Reply Generator Agent (creates response)
  ↓
OUTBOUND_MESSAGE_READY event
  ↓
WhatsApp Sender Agent (delivers message)
```

## Common Issues & Solutions

### Issue 1: Database Connection Failed

**Error**: `Can't reach database server`

**Solution**:
1. Check PostgreSQL is running: `pg_isready`
2. Verify DATABASE_URL in `.env`
3. Ensure database exists: `createdb dukaanmitra`

### Issue 2: Redis Connection Failed

**Error**: `Error connecting to Redis`

**Solution**:
1. Check Redis is running: `redis-cli ping`
2. Verify REDIS_URL in `.env`
3. Start Redis: `redis-server`

### Issue 3: Prisma Client Not Generated

**Error**: `Cannot find module '@prisma/client'`

**Solution**:
```bash
npm run prisma:generate
```

### Issue 4: Events Not Processing

**Check**:
1. Is Redis running?
2. Are queue workers started? (They start with the main server)
3. Check logs for errors

**Debug**:
```bash
# Check queue status
redis-cli
> KEYS bull:*
> LLEN bull:bill_parser:wait
```

## Next Steps

### 1. Setup WhatsApp Business API

Follow: https://developers.facebook.com/docs/whatsapp/business-platform

1. Create Meta Business account
2. Create WhatsApp Business app
3. Get phone number ID and access token
4. Update `.env` with real credentials
5. Setup webhook URL (use ngrok for local testing)

### 2. Test End-to-End WhatsApp Flow

```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 3000

# Use ngrok URL for webhook
# Example: https://abc123.ngrok.io/whatsapp/webhook
```

### 3. Add Custom Parsing Logic

Edit `src/core/agents/bill-parser.agent.ts`:

```typescript
private parseBillFromText(text: string) {
  // Add your custom parsing logic
  // Support more formats
  // Add image OCR
  // etc.
}
```

### 4. Customize Reply Messages

Edit `src/core/agents/reply-generator.agent.ts`:

```typescript
private generateReply(...) {
  // Customize message tone
  // Add brand voice
  // Support multiple languages
  // etc.
}
```

### 5. Add More Event Types

Example: Add `ORDER_CANCELLED` event

1. Add to `EventType` enum in `types.ts`
2. Create schema
3. Update router
4. Create/update agent
5. Add API endpoint

## Monitoring

### Check Queue Health

```bash
# Redis CLI
redis-cli

# Check waiting jobs
LLEN bull:bill_parser:wait
LLEN bull:customer_intelligence:wait
LLEN bull:reply_generator:wait

# Check active jobs
LLEN bull:bill_parser:active

# Check failed jobs
LLEN bull:bill_parser:failed
```

### Check Event Processing

```sql
-- Events by status
SELECT status, COUNT(*) 
FROM "Event" 
GROUP BY status;

-- Recent failures
SELECT id, type, status, payload
FROM "Event"
WHERE status = 'FAILED'
ORDER BY created_at DESC
LIMIT 10;

-- Processing time
SELECT type, 
       AVG(EXTRACT(EPOCH FROM ("updatedAt" - "createdAt"))) as avg_seconds
FROM "Event"
WHERE status = 'COMPLETED'
GROUP BY type;
```

## Production Checklist

Before deploying to production:

- [ ] Use strong DATABASE_URL with password
- [ ] Use managed Redis (AWS ElastiCache, etc)
- [ ] Setup proper WhatsApp Business credentials
- [ ] Add monitoring and alerts
- [ ] Setup error tracking (Sentry, etc)
- [ ] Configure rate limiting
- [ ] Add request authentication
- [ ] Setup proper logging
- [ ] Configure HTTPS/SSL
- [ ] Add health check endpoints
- [ ] Setup database backups
- [ ] Configure queue job limits
- [ ] Add dead letter queue monitoring

## Resources

- **Architecture**: See `ARCHITECTURE.md`
- **Vibecode Spec**: See `vibecode.json`
- **API Docs**: (Coming soon)
- **WhatsApp Docs**: https://developers.facebook.com/docs/whatsapp

## Getting Help

If you encounter issues:

1. Check logs for error messages
2. Verify all services are running (PostgreSQL, Redis)
3. Check environment variables
4. Review `ARCHITECTURE.md` for understanding
5. Check event status in database
6. Inspect queue status in Redis
