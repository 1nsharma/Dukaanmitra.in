# Database Administration Implementation Playbook

This playbook outlines the standards and procedures for database administration at Dukaanmitra.in, following modern cloud-native and reliability engineering principles.

## 1. Schema Management & Versioning
- All schema changes MUST be implemented via migration files in `supabase/migrations/`.
- Use descriptive names: `YYYYMMDD_feature_name.sql`.
- Always include `IF NOT EXISTS` for table/index creation.
- Every table MUST have:
    - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
    - `created_at TIMESTAMPTZ DEFAULT NOW()`
    - `updated_at TIMESTAMPTZ DEFAULT NOW()`

## 2. Security & Compliance
- **Row Level Security (RLS)**: Must be enabled for all public tables.
- **Service Accounts**: Use least-privilege principles.
- **Audit Logging**: Sensitive tables (e.g., `daily_shop_metrics`) must have change tracking.

## 3. Performance & Observability
- **Indexing Strategy**: Index foreign keys and columns used in `WHERE` clauses.
- **Slow Query Monitoring**: Regularly check `pg_stat_statements` (if available) or custom monitor views.
- **Vacuuming**: Automated maintenance should run weekly or after large batch inserts.

## 4. Disaster Recovery
- **Backups**: Daily logical backups are automated via Supabase.
- **RTO/RPO**: Our goal is RPO < 1 hour and RTO < 4 hours for critical services.

## 5. Maintenance Procedures
- **Cleaning Bronze Data**: Raw events older than 90 days should be archived or deleted.
- **Re-indexing**: Run `REINDEX` on tables with high bloat.
