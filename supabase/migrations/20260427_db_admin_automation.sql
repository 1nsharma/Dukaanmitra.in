-- Database Administration: Automation & Scheduling
-- Date: 2026-04-27

-- 1. Enable pg_cron extension if not already enabled
-- Note: This requires superuser or specific cloud permissions, 
-- but it's the standard way in Supabase/Postgres.
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Schedule Weekly Database Maintenance
-- Runs at 02:00 every Sunday
SELECT cron.schedule(
    'weekly-db-maintenance',
    '0 2 * * 0',
    'SELECT public.run_db_maintenance()'
);

-- 3. Schedule Daily Metrics Aggregation
-- Runs at 00:05 every day for the previous day
SELECT cron.schedule(
    'daily-metrics-aggregation',
    '5 0 * * *',
    'SELECT public.aggregate_daily_metrics((NOW() - INTERVAL ''1 day'')::DATE)'
);

-- 4. Additional Performance Indexing
-- Adding indexes for the audit log to prevent it from slowing down over time
CREATE INDEX IF NOT EXISTS idx_db_audit_logs_table_name ON public.db_audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_db_audit_logs_changed_at ON public.db_audit_logs(changed_at);

-- 5. Connection Management Monitor View
-- Helps in tracking active connections and potentially identifying leaks
CREATE OR REPLACE VIEW public.db_connection_monitor AS
SELECT
    datname,
    usename,
    client_addr,
    application_name,
    state,
    backend_start,
    query_start,
    wait_event_type,
    wait_event,
    query
FROM pg_stat_activity
WHERE state IS NOT NULL;
