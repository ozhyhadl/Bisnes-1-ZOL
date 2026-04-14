alter table public.orders
	add column if not exists fulfillment_access_token text,
	add column if not exists support_reference text;

update public.orders
set
	fulfillment_access_token = coalesce(
		fulfillment_access_token,
		concat(
			'fac_',
			substr(md5(random()::text || ':' || clock_timestamp()::text || ':' || coalesce(transaction_id, '')), 1, 24),
			substr(md5(coalesce(created_at::text, '') || ':' || random()::text || ':' || clock_timestamp()::text), 1, 24)
		)
	),
	support_reference = coalesce(
		support_reference,
		concat(
			'ACB-',
			upper(substr(md5(coalesce(transaction_id, '') || ':' || coalesce(created_at::text, '') || ':' || random()::text), 1, 10))
		)
	)
where fulfillment_access_token is null
	or support_reference is null;

create unique index if not exists idx_orders_fulfillment_access_token
	on public.orders (fulfillment_access_token)
	where fulfillment_access_token is not null;

create unique index if not exists idx_orders_support_reference
	on public.orders (support_reference)
	where support_reference is not null;

comment on column public.orders.fulfillment_access_token is
	'Opaque bearer-style access token used for customer download access. Separate from Paddle transaction_id.';

comment on column public.orders.support_reference is
	'Safe customer-facing support reference for order lookups. Does not grant fulfillment access.';