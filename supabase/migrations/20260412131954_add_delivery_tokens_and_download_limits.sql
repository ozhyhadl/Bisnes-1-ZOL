-- ============================================================
-- delivery tokens and controlled download limits
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
	new.updated_at = now();
	return new;
end;
$$ language plpgsql;

alter table public.orders
	add column if not exists successful_downloads integer,
	add column if not exists delivery_status text,
	add column if not exists manual_resend_required boolean;

update public.orders
set
	successful_downloads = coalesce(successful_downloads, 0),
	delivery_status = coalesce(
		delivery_status,
		case
			when fulfillment_status = 'error' then 'error'
			when download_links_generated then 'ready'
			else 'pending'
		end
	),
	manual_resend_required = coalesce(manual_resend_required, false);

alter table public.orders
	alter column successful_downloads set default 0,
	alter column successful_downloads set not null,
	alter column delivery_status set default 'pending',
	alter column delivery_status set not null,
	alter column manual_resend_required set default false,
	alter column manual_resend_required set not null;

do $$
begin
	if not exists (
		select 1
		from pg_constraint
		where conname = 'orders_successful_downloads_non_negative'
			and conrelid = 'public.orders'::regclass
	) then
		alter table public.orders
			add constraint orders_successful_downloads_non_negative
			check (successful_downloads >= 0);
	end if;

	if not exists (
		select 1
		from pg_constraint
		where conname = 'orders_delivery_status_check'
			and conrelid = 'public.orders'::regclass
	) then
		alter table public.orders
			add constraint orders_delivery_status_check
			check (
				delivery_status in (
					'pending',
					'ready',
					'limit_exceeded',
					'manual_resend_required',
					'error'
				)
			);
	end if;
end
$$;

create table if not exists public.delivery_tokens (
	id bigint generated always as identity primary key,
	order_id bigint not null references public.orders(id) on delete cascade,
	transaction_id text not null,
	file_key text not null,
	label text not null,
	bucket text not null,
	storage_path text not null,
	filename text not null,
	delivery_token text not null,
	download_attempts integer not null default 0,
	successful_downloads integer not null default 0,
	max_successful_downloads integer not null default 2,
	last_download_at timestamptz,
	used_by_ip text,
	user_agent text,
	delivery_status text not null default 'active',
	manual_resend_required boolean not null default false,
	attempt_log jsonb not null default '[]'::jsonb,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),

	constraint delivery_tokens_transaction_file_unique unique (transaction_id, file_key),
	constraint delivery_tokens_token_unique unique (delivery_token),
	constraint delivery_tokens_download_attempts_non_negative check (download_attempts >= 0),
	constraint delivery_tokens_successful_downloads_non_negative check (successful_downloads >= 0),
	constraint delivery_tokens_max_successful_downloads_positive check (max_successful_downloads > 0),
	constraint delivery_tokens_successful_not_above_max check (successful_downloads <= max_successful_downloads),
	constraint delivery_tokens_status_check check (
		delivery_status in (
			'active',
			'limit_exceeded',
			'manual_resend_required',
			'error'
		)
	)
);

do $$
begin
	if not exists (
		select 1
		from pg_trigger
		where tgname = 'on_delivery_tokens_updated'
			and tgrelid = 'public.delivery_tokens'::regclass
			and not tgisinternal
	) then
		create trigger on_delivery_tokens_updated
			before update on public.delivery_tokens
			for each row
			execute function public.handle_updated_at();
	end if;
end
$$;

create index if not exists idx_delivery_tokens_order_id
	on public.delivery_tokens (order_id);

create index if not exists idx_delivery_tokens_transaction_id
	on public.delivery_tokens (transaction_id);

create index if not exists idx_delivery_tokens_status
	on public.delivery_tokens (delivery_status);

alter table public.delivery_tokens enable row level security;

comment on table public.delivery_tokens is
	'Controlled one-file delivery tokens for AI Cloud Base. Tracks download limits, IP/user agent, and manual resend escalation.';
