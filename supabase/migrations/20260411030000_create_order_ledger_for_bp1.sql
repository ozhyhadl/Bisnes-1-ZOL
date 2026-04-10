-- ============================================================
-- orders table — transaction, fulfillment and download ledger
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.orders (
  id bigint generated always as identity primary key,

  -- Transaction identifiers
  transaction_id text not null,
  paddle_customer_id text,
  checkout_id text,

  -- Buyer
  email text,

  -- Environment
  environment text not null default 'production'
    check (environment in ('sandbox', 'production')),

  -- Purchased items
  items jsonb not null default '[]'::jsonb,
  skills_purchased boolean not null default false,
  n8n_purchased boolean not null default false,

  -- Transaction pass / when / quantity / price / sum
  transaction_status text,
  transaction_passed boolean not null default false,
  transaction_passed_at timestamptz,
  currency_code text,
  quantity integer not null default 1,
  unit_price_amount numeric(12, 2),
  subtotal_amount numeric(12, 2),
  tax_amount numeric(12, 2),
  total_amount numeric(12, 2),

  -- Fulfillment lifecycle
  fulfillment_status text not null default 'pending'
    check (fulfillment_status in ('pending', 'fulfilled', 'error')),
  email_status text not null default 'pending'
    check (email_status in ('pending', 'sent', 'failed', 'not_applicable')),
  download_links_generated boolean not null default false,
  download_attempts integer not null default 0,
  last_download_at timestamptz,
  fulfilled_at timestamptz,
  error_message text,

  -- Context
  source text not null default 'success_page',
  raw_transaction_payload jsonb,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint orders_quantity_positive check (quantity > 0)
);

alter table public.orders
  add column if not exists paddle_customer_id text,
  add column if not exists checkout_id text,
  add column if not exists email text,
  add column if not exists environment text,
  add column if not exists items jsonb,
  add column if not exists skills_purchased boolean,
  add column if not exists n8n_purchased boolean,
  add column if not exists transaction_status text,
  add column if not exists transaction_passed boolean,
  add column if not exists transaction_passed_at timestamptz,
  add column if not exists currency_code text,
  add column if not exists quantity integer,
  add column if not exists unit_price_amount numeric(12, 2),
  add column if not exists subtotal_amount numeric(12, 2),
  add column if not exists tax_amount numeric(12, 2),
  add column if not exists total_amount numeric(12, 2),
  add column if not exists fulfillment_status text,
  add column if not exists email_status text,
  add column if not exists download_links_generated boolean,
  add column if not exists download_attempts integer,
  add column if not exists last_download_at timestamptz,
  add column if not exists fulfilled_at timestamptz,
  add column if not exists error_message text,
  add column if not exists source text,
  add column if not exists raw_transaction_payload jsonb,
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

update public.orders
set
  environment = coalesce(environment, 'production'),
  items = coalesce(items, '[]'::jsonb),
  skills_purchased = coalesce(skills_purchased, false),
  n8n_purchased = coalesce(n8n_purchased, false),
  transaction_passed = coalesce(transaction_passed, false),
  quantity = coalesce(quantity, 1),
  fulfillment_status = coalesce(fulfillment_status, 'pending'),
  email_status = coalesce(email_status, 'pending'),
  download_links_generated = coalesce(download_links_generated, false),
  download_attempts = coalesce(download_attempts, 0),
  source = coalesce(source, 'success_page'),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

alter table public.orders
  alter column environment set default 'production',
  alter column environment set not null,
  alter column items set default '[]'::jsonb,
  alter column items set not null,
  alter column skills_purchased set default false,
  alter column skills_purchased set not null,
  alter column n8n_purchased set default false,
  alter column n8n_purchased set not null,
  alter column transaction_passed set default false,
  alter column transaction_passed set not null,
  alter column quantity set default 1,
  alter column quantity set not null,
  alter column fulfillment_status set default 'pending',
  alter column fulfillment_status set not null,
  alter column email_status set default 'pending',
  alter column email_status set not null,
  alter column download_links_generated set default false,
  alter column download_links_generated set not null,
  alter column download_attempts set default 0,
  alter column download_attempts set not null,
  alter column source set default 'success_page',
  alter column source set not null,
  alter column created_at set default now(),
  alter column created_at set not null,
  alter column updated_at set default now(),
  alter column updated_at set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_transaction_id_unique'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint orders_transaction_id_unique unique (transaction_id);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_fulfillment_status_check'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint orders_fulfillment_status_check
      check (fulfillment_status in ('pending', 'fulfilled', 'error'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_email_status_check'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint orders_email_status_check
      check (email_status in ('pending', 'sent', 'failed', 'not_applicable'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_environment_check'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint orders_environment_check
      check (environment in ('sandbox', 'production'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_quantity_positive'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint orders_quantity_positive
      check (quantity > 0);
  end if;

  if not exists (
    select 1
    from pg_trigger
    where tgname = 'on_orders_updated'
      and tgrelid = 'public.orders'::regclass
      and not tgisinternal
  ) then
    create trigger on_orders_updated
      before update on public.orders
      for each row
      execute function public.handle_updated_at();
  end if;
end
$$;

create index if not exists idx_orders_email
  on public.orders (email)
  where email is not null;

create index if not exists idx_orders_fulfillment_status
  on public.orders (fulfillment_status);

create index if not exists idx_orders_transaction_passed_at
  on public.orders (transaction_passed_at desc)
  where transaction_passed_at is not null;

alter table public.orders enable row level security;

comment on table public.orders is
  'Order and fulfillment ledger for AI Cloud Base. Stores transaction pass, when it happened, quantity, unit price, totals, downloads, email status, and operational errors.';