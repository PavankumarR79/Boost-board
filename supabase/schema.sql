create table bids(
 id uuid primary key default gen_random_uuid(),
 season int not null, cat text not null, name text not null, url text not null, key text not null,
 amount int not null check (amount between 10 and 100000),
 status text not null default 'pending' check (status in ('pending','live','hidden')),
 order_id text unique, payment_id text, created_at timestamptz default now());
create index on bids(season,cat,status);
-- Row Level Security ON with NO policies = browser/anon keys can read or write nothing.
-- Only the server (service role key) touches this table.
alter table bids enable row level security;
