-- 🥉 Bronze to 🥈 Silver Transformation Logic
-- This migration sets up the Silver and Gold layers for the Dukaanmitra Data Pipeline.

-- 🥈 SILVER LAYER: Normalized & Cleaned Events
CREATE TABLE IF NOT EXISTS public.events_silver (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raw_event_id BIGINT REFERENCES public.ingestion_events(id),
    event_type TEXT NOT NULL,
    shop_id TEXT,
    user_id TEXT,
    source TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for common queries
CREATE INDEX IF NOT EXISTS idx_events_silver_shop_id ON public.events_silver(shop_id);
CREATE INDEX IF NOT EXISTS idx_events_silver_event_type ON public.events_silver(event_type);
CREATE INDEX IF NOT EXISTS idx_events_silver_occurred_at ON public.events_silver(occurred_at);

-- 🥇 GOLD LAYER: Aggregated Business Metrics
-- Summary of daily transactions per shop
CREATE TABLE IF NOT EXISTS public.daily_shop_metrics (
    id SERIAL PRIMARY KEY,
    shop_id TEXT NOT NULL,
    date DATE NOT NULL,
    total_transactions INTEGER DEFAULT 0,
    total_sales_amount NUMERIC(12, 2) DEFAULT 0.00,
    total_credit_amount NUMERIC(12, 2) DEFAULT 0.00,
    new_customers INTEGER DEFAULT 0,
    UNIQUE(shop_id, date)
);

-- Trigger Function: Transform Bronze to Silver
-- In a real production setup, this might be a batch process (dbt), 
-- but for near real-time we can use a trigger.
CREATE OR REPLACE FUNCTION public.trg_bronze_to_silver()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.events_silver (
        raw_event_id,
        event_type,
        shop_id,
        source,
        payload,
        occurred_at
    )
    VALUES (
        NEW.id,
        NEW.event_type,
        NEW.shop_id,
        NEW.source,
        NEW.payload,
        NEW.created_at
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to ingestion_events
DROP TRIGGER IF EXISTS trg_after_ingest ON public.ingestion_events;
CREATE TRIGGER trg_after_ingest
AFTER INSERT ON public.ingestion_events
FOR EACH ROW
EXECUTE FUNCTION public.trg_bronze_to_silver();

-- 🥇 GOLD VIEW: Current Shop Pulse
CREATE OR REPLACE VIEW public.shop_pulse AS
SELECT 
    shop_id,
    COUNT(*) FILTER (WHERE event_type = 'transaction_recorded') as transactions_last_24h,
    COUNT(DISTINCT payload->>'customer_id') as active_customers_last_24h
FROM public.events_silver
WHERE occurred_at > NOW() - INTERVAL '24 hours'
GROUP BY shop_id;

-- RPC: Aggregate daily metrics for Gold layer
CREATE OR REPLACE FUNCTION public.aggregate_daily_metrics(target_date DATE)
RETURNS JSONB AS $$
DECLARE
    processed_count INTEGER;
BEGIN
    INSERT INTO public.daily_shop_metrics (shop_id, date, total_transactions, total_sales_amount, total_credit_amount)
    SELECT 
        shop_id,
        target_date,
        COUNT(*) as total_transactions,
        SUM((payload->>'amount')::NUMERIC) FILTER (WHERE payload->>'type' = 'payment') as total_sales_amount,
        SUM((payload->>'amount')::NUMERIC) FILTER (WHERE payload->>'type' = 'credit') as total_credit_amount
    FROM public.events_silver
    WHERE occurred_at::DATE = target_date
    GROUP BY shop_id
    ON CONFLICT (shop_id, date) DO UPDATE SET
        total_transactions = EXCLUDED.total_transactions,
        total_sales_amount = EXCLUDED.total_sales_amount,
        total_credit_amount = EXCLUDED.total_credit_amount;

    GET DIAGNOSTICS processed_count = ROW_COUNT;
    RETURN jsonb_build_object('status', 'success', 'count', processed_count);
END;
$$ LANGUAGE plpgsql;
