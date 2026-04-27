-- Database Administration: Security & Observability Enhancement
-- Date: 2026-04-27

-- 1. Ensure Ingestion Events table exists (Bronze Layer)
CREATE TABLE IF NOT EXISTS public.ingestion_events (
    id BIGSERIAL PRIMARY KEY,
    event_type TEXT NOT NULL,
    shop_id TEXT NOT NULL,
    source TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    processed_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ingestion_events_shop_id ON public.ingestion_events(shop_id);
CREATE INDEX IF NOT EXISTS idx_ingestion_events_created_at ON public.ingestion_events(created_at);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.events_silver ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_shop_metrics ENABLE ROW LEVEL SECURITY;

-- 3. Define Policies (Example: Shops can only see their own data)
-- Note: In a real Supabase setup, 'auth.uid()' would be used for shop_id mapping.
-- For now, we allow service role full access and restrict public access.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'events_silver' AND policyname = 'Shop access to events'
    ) THEN
        CREATE POLICY "Shop access to events" ON public.events_silver
        FOR SELECT
        USING (shop_id = (current_setting('app.current_shop_id', true)));
    END IF;
END
$$;

-- 4. Database Health & Performance Monitor View
CREATE OR REPLACE VIEW public.db_admin_monitor AS
SELECT
    current_database() as db_name,
    schemaname,
    relname as table_name,
    n_live_tup as row_count,
    n_dead_tup as dead_rows,
    last_vacuum,
    last_analyze,
    pg_size_pretty(pg_total_relation_size(relid)) as total_size
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC;

-- 5. Automated Maintenance Function
CREATE OR REPLACE FUNCTION public.run_db_maintenance()
RETURNS JSONB AS $$
DECLARE
    result_log JSONB;
BEGIN
    -- Vacuum and Analyze to reclaim space and update statistics
    VACUUM ANALYZE public.events_silver;
    VACUUM ANALYZE public.daily_shop_metrics;
    VACUUM ANALYZE public.ingestion_events;
    
    -- Cleanup: Delete Bronze events older than 90 days
    DELETE FROM public.ingestion_events
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    result_log = jsonb_build_object(
        'status', 'completed',
        'timestamp', NOW(),
        'actions', 'vacuum, analyze, cleanup_bronze'
    );
    
    RETURN result_log;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Audit Logging Table
CREATE TABLE IF NOT EXISTS public.db_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by TEXT,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for auditing metrics changes
CREATE OR REPLACE FUNCTION public.trg_audit_metrics()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.db_audit_logs (table_name, operation, old_data, new_data, changed_by)
        VALUES (TG_TABLE_NAME, TG_OP, to_jsonb(OLD), to_jsonb(NEW), current_user);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.db_audit_logs (table_name, operation, old_data, changed_by)
        VALUES (TG_TABLE_NAME, TG_OP, to_jsonb(OLD), current_user);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS audit_metrics_changes ON public.daily_shop_metrics;
CREATE TRIGGER audit_metrics_changes
AFTER UPDATE OR DELETE ON public.daily_shop_metrics
FOR EACH ROW EXECUTE FUNCTION public.trg_audit_metrics();
