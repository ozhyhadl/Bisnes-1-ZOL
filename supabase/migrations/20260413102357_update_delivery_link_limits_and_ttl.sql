alter table public.delivery_tokens
	alter column max_successful_downloads set default 4;

update public.delivery_tokens
set
	max_successful_downloads = greatest(coalesce(max_successful_downloads, 0), 4),
	delivery_status = case
		when delivery_status = 'error' then 'error'
		when successful_downloads >= 4 then 'manual_resend_required'
		else 'active'
	end,
	manual_resend_required = successful_downloads >= 4;

with token_summary as (
	select
		transaction_id,
		sum(download_attempts) as download_attempts,
		sum(successful_downloads) as successful_downloads,
		max(last_download_at) as last_download_at,
		bool_or(delivery_status = 'error') as any_error,
		bool_or(
			manual_resend_required
			or delivery_status = 'manual_resend_required'
			or delivery_status = 'limit_exceeded'
			or successful_downloads >= max_successful_downloads
		) as any_blocked,
		bool_and(
			manual_resend_required
			or delivery_status = 'manual_resend_required'
			or delivery_status = 'limit_exceeded'
			or successful_downloads >= max_successful_downloads
		) as all_blocked
	from public.delivery_tokens
	group by transaction_id
)
update public.orders as orders
set
	download_attempts = token_summary.download_attempts,
	successful_downloads = token_summary.successful_downloads,
	last_download_at = token_summary.last_download_at,
	delivery_status = case
		when token_summary.all_blocked then 'manual_resend_required'
		when token_summary.any_blocked then 'limit_exceeded'
		when token_summary.any_error then 'error'
		else 'ready'
	end,
	manual_resend_required = token_summary.all_blocked,
	error_message = case
		when token_summary.all_blocked then 'The secure delivery limit for this order has been reached. Contact support for a manual resend.'
		when token_summary.any_error then 'A delivery error occurred. Please try again.'
		else null
	end
from token_summary
where orders.transaction_id = token_summary.transaction_id;
