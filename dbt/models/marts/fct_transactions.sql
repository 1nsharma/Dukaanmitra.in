-- Marts model for Transactions (Gold Layer)
{{ config(materialized='table') }}

with events as (
    select * from {{ ref('stg_ingestion_events') }}
    where event_type = 'transaction_recorded'
    and processed_status = 'success'
),

extracted as (
    select
        event_id,
        shop_id,
        event_timestamp,
        (payload->>'amount')::numeric as amount,
        payload->>'type' as transaction_type,
        payload->>'item' as item_name,
        payload->>'customerName' as customer_name,
        payload->>'customerPhone' as customer_phone
    from events
)

select
    *,
    case 
        when amount > 1000 then 'high_value'
        when amount > 100 then 'medium_value'
        else 'low_value'
    end as transaction_category
from extracted
