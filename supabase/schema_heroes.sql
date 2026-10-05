create table heroes(id serial primary key, name text not null unique,
 tier text not null check (tier in ('Rising','Established','Legends')), lang text not null default 'Telugu', active boolean not null default true);
create table hero_bids(id uuid primary key default gen_random_uuid(), season int not null,
 hero_id int not null references heroes(id), amount int not null check (amount between 10 and 500),
 status text not null default 'pending' check (status in ('pending','live','hidden')),
 order_id text unique, payment_id text, consent_at timestamptz not null, created_at timestamptz default now());
create index on hero_bids(season,status);
alter table heroes enable row level security;      -- no policies: server-only access
alter table hero_bids enable row level security;
-- PLACEHOLDERS ONLY. Add real names after a lawyer reviews your list.
insert into heroes(name,tier) values ('Hero Name 1','Rising'),('Hero Name 2','Established'),('Hero Name 3','Legends');
