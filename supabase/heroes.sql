create table heroes(
 id uuid primary key default gen_random_uuid(),
 name text not null unique,
 tier text not null check (tier in ('Tier 1','Tier 2','Tier 3','Young Heroes')),
 industry text not null default 'Telugu',
 active boolean not null default true);
create table hero_votes(
 id uuid primary key default gen_random_uuid(),
 hero_id uuid not null references heroes(id),
 season int not null,
 amount int not null check (amount between 10 and 5000),
 status text not null default 'pending' check (status in ('pending','live')),
 order_id text unique, payment_id text,
 adult_confirmed boolean not null, terms_version text not null,
 ip_hash text, created_at timestamptz default now());
create index on hero_votes(season,status);
alter table heroes enable row level security;
alter table hero_votes enable row level security; -- no policies: server-only access
