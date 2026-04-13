alter table public.orders
	add column if not exists email_sent_at timestamptz,
	add column if not exists email_claimed_at timestamptz,
	add column if not exists email_attempts integer,
	add column if not exists email_error text,
	add column if not exists attachments_sent jsonb;

update public.orders
set
	email_attempts = coalesce(email_attempts, 0),
	attachments_sent = coalesce(attachments_sent, '[]'::jsonb);

alter table public.orders
	alter column email_attempts set default 0,
	alter column email_attempts set not null,
	alter column attachments_sent set default '[]'::jsonb,
	alter column attachments_sent set not null;

alter table public.orders
	drop constraint if exists orders_email_status_check;

alter table public.orders
	add constraint orders_email_status_check
	check (email_status in ('pending', 'sending', 'sent', 'failed', 'not_applicable'));

create index if not exists idx_orders_email_status
	on public.orders (email_status);

create index if not exists idx_orders_email_sent_at
	on public.orders (email_sent_at desc)
	where email_sent_at is not null;

comment on column public.orders.email_status is
	'Transactional email state for Resend delivery. pending -> sending -> sent or failed; not_applicable when no buyer email is available.';

comment on column public.orders.email_attempts is
	'Number of claimed transactional email send attempts for the order.';

comment on column public.orders.email_claimed_at is
	'Timestamp when a worker claimed the order for a single transactional email send attempt.';

comment on column public.orders.email_sent_at is
	'Timestamp when Resend accepted the transactional email send.';

comment on column public.orders.email_error is
	'Last transactional email delivery error captured during send.';

comment on column public.orders.attachments_sent is
	'JSON array of delivered file keys attached to the transactional email.';
