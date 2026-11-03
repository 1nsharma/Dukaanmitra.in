-- ==============================================================================
-- DukaanMitra AI Engineering Sandbox - Database Schema v1.0
-- Multi-Tenant PostgreSQL Schema with Row-Level Security (RLS) & Audit Trails
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tenants (Individual Kirana / Retail Shops)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(64) DEFAULT 'kirana',
    city VARCHAR(128) NOT NULL DEFAULT 'Lucknow',
    state VARCHAR(128) NOT NULL DEFAULT 'Uttar Pradesh',
    currency VARCHAR(8) DEFAULT 'INR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Memberships (Users and RBAC inside Tenants)
CREATE TABLE IF NOT EXISTS memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id VARCHAR(128) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('owner', 'manager', 'staff', 'viewer', 'auditor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tenant_id, user_id)
);

-- 3. Products Catalogue
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    sku VARCHAR(64),
    barcode VARCHAR(64),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(128) DEFAULT 'Grocery',
    unit VARCHAR(32) DEFAULT 'pcs',
    mrp NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    selling_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    quantity_on_hand NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    reorder_threshold NUMERIC(12, 2) NOT NULL DEFAULT 5.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Inventory Snapshots (Daily / Event-driven Historical Stock Records)
CREATE TABLE IF NOT EXISTS inventory_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
    opening_stock NUMERIC(12, 2) NOT NULL,
    closing_stock NUMERIC(12, 2) NOT NULL,
    units_sold NUMERIC(12, 2) NOT NULL DEFAULT 0,
    units_received NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Audit Events (Immutable AI & Security Decision Logs)
CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    actor_id VARCHAR(128) NOT NULL,
    actor_type VARCHAR(32) NOT NULL CHECK (actor_type IN ('human', 'ai_agent', 'system', 'webhook')),
    event_type VARCHAR(64) NOT NULL,
    action VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL CHECK (status IN ('SUCCESS', 'APPROVAL_REQUIRED', 'REJECTED', 'FAILED')),
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    reasoning JSONB DEFAULT '[]'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Knowledge Documents (Vector RAG Source Texts)
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Agent Execution Runs
CREATE TABLE IF NOT EXISTS agent_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    agent_name VARCHAR(64) NOT NULL,
    query_input TEXT NOT NULL,
    recommendation_output TEXT NOT NULL,
    action_type VARCHAR(64) NOT NULL,
    confidence_score NUMERIC(5, 4) NOT NULL DEFAULT 0.95,
    policy_evaluation JSONB NOT NULL DEFAULT '{}'::jsonb,
    execution_time_ms INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Approvals (Human-in-the-Loop Maker-Checker Records)
CREATE TABLE IF NOT EXISTS approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    run_id UUID REFERENCES agent_runs(id),
    requested_by_agent VARCHAR(64) NOT NULL,
    action_proposed VARCHAR(128) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED')),
    approved_by_user VARCHAR(128),
    decision_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ
);

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES FOR STRICT TENANT ISOLATION
-- ==============================================================================

-- Enable RLS on business tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;

-- Enforce tenant isolation via session setting 'app.tenant_id'
CREATE POLICY products_tenant_isolation ON products
    FOR ALL
    USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE POLICY inventory_snapshots_tenant_isolation ON inventory_snapshots
    FOR ALL
    USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE POLICY audit_events_tenant_isolation ON audit_events
    FOR ALL
    USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE POLICY knowledge_tenant_isolation ON knowledge_documents
    FOR ALL
    USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE POLICY agent_runs_tenant_isolation ON agent_runs
    FOR ALL
    USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE POLICY approvals_tenant_isolation ON approvals
    FOR ALL
    USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
