-- Staging model for raw ingestion events
{{ config(materialized='view') }}

with source as (
    select * from {{ source('dukaanmitra', 'ingestion_events') }}
),

renamed as (
    select
        id as event_id,
        event_type,
        shop_id,
        source as event_source,
        payload,
        processed_status,
        created_at as event_timestamp
    from source
)

select * from renamed
