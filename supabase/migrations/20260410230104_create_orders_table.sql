-- ============================================================
-- orders table — Paddle fulfillment journal
-- ============================================================

create table if not exists public.orders (
  id              bigint generated always as identity primary key,

  -- Paddle identifiers
  transaction_id  text not null,
  paddle_customer_id text,
  checkout_id     text,

  -- Buyer
  email           text,

  -- Environment
  environment     text not null default 'production'
                  check (environment in ('sandbox', 'production')),

  -- What was purchased
  items           jsonb not null default '[]'::jsonb,
  skills_purchased boolean not null default false,
  n8n_purchased    boolean not null default false,

  -- Statuses
  transaction_status   text,            -- raw Paddle status
  fulfillment_status   text not null default 'pending'
                       check (fulfillment_status in ('pending', 'fulfilled', 'error')),
  email_status         text not null default 'pending'
                       check (email_status in ('pending', 'sent', 'failed', 'not_applicable')),

  -- Fulfillment details
  download_links_generated boolean not null default false,
  download_attempts        integer not null default 0,
  fulfilled_at             timestamptz,
  error_message            text,

  -- Source / context
  source                   text not null default 'success_page',

  -- Raw Paddle payload for debugging
  raw_transaction_payload  jsonb,

  -- Timestamps
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Unique constraint on transaction_id — prevents duplicates, enables upsert
alter table public.orders
  add constraint orders_transaction_id_unique unique (transaction_id);

-- Index for email lookups
create index if not exists idx_orders_email on public.orders (email)
  where email is not null;

-- Index for fulfillment status filtering
create index if not exists idx_orders_fulfillment_status
  on public.orders (fulfillment_status);

-- Auto-update updated_at on row modification
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_orders_updated
  before update on public.orders
  for each row
  execute function public.handle_updated_at();

-- RLS: table is only accessed via service_role key from backend
-- Enable RLS but create no policies — only service_role bypasses RLS
alter table public.orders enable row level security;

comment on table public.orders is
  'Paddle transaction fulfillment journal. Written by api/fulfill.ts via service_role key.';
