-- STIROL manual-payment workflow
-- Run this file in Supabase Dashboard → SQL Editor, in the order shown below.

-- 1. Data required by the 24-hour payment window.
alter table public.orders
  add column if not exists payment_due_at timestamptz;

create index if not exists orders_payment_deadline_idx
  on public.orders (payment_due_at)
  where status = 'AWAITING_PAYMENT';

-- 2. In Supabase Dashboard → Integrations → Cron, enable Supabase Cron.
--    Also enable the pg_net extension in Database → Extensions.
--
-- 3. In Vercel → Settings → Environment Variables add CRON_SECRET.
--    Use a random string with at least 16 characters, then deploy the site.
--
-- 4. Replace both placeholders below and run each statement once.
--    The secret must be exactly the same as Vercel's CRON_SECRET.
--
-- select vault.create_secret(
--   'https://stirol.xyz/api/expire-orders',
--   'stirol_expire_orders_url'
-- );
--
-- select vault.create_secret(
--   'REPLACE_WITH_THE_SAME_CRON_SECRET_AS_VERCEL',
--   'stirol_expire_orders_secret'
-- );
--
-- 5. Schedule the check every 30 minutes. It calls the protected site endpoint,
--    which cancels expired orders, restores stock, and sends the email.
--
-- select cron.schedule(
--   'stirol-expire-unpaid-orders',
--   '*/30 * * * *',
--   $$
--     select net.http_get(
--       url := (select decrypted_secret from vault.decrypted_secrets where name = 'stirol_expire_orders_url'),
--       headers := jsonb_build_object(
--         'Authorization',
--         'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'stirol_expire_orders_secret')
--       ),
--       timeout_milliseconds := 10000
--     );
--   $$
-- );
--
-- To inspect it later: select * from cron.job;
-- To remove it: select cron.unschedule('stirol-expire-unpaid-orders');
