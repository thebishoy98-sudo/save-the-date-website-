create extension if not exists "pgcrypto";

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text null,
  language text not null check (language in ('en', 'es')),
  attending boolean not null,
  guest_count int not null default 1 check (guest_count > 0),
  phone text null,
  arrival_airport text null,
  hotel text null,
  allergies_notes text null,
  transport_needed boolean null,
  kids_food_required boolean null
);

alter table public.rsvps enable row level security;

drop policy if exists "Allow anonymous RSVP inserts" on public.rsvps;
create policy "Allow anonymous RSVP inserts"
on public.rsvps
for insert
to anon, authenticated
with check (true);

drop policy if exists "Allow authenticated RSVP reads" on public.rsvps;
create policy "Allow authenticated RSVP reads"
on public.rsvps
for select
to authenticated
using (true);
