create extension if not exists "pgcrypto";

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text null,
  language text not null check (language in ('en', 'es')),
  attending boolean not null,
  guest_count int not null default 1 check (guest_count > 0),
  plus_one_name text null,
  phone text null,
  arrival_airport text null,
  hotel text null,
  allergies_notes text null,
  transport_needed boolean null,
  kids_food_required boolean null,
  bringing_children boolean null,
  children_count int null check (children_count is null or children_count > 0),
  invite_token text null
);

alter table public.rsvps
  add column if not exists invite_token text null;

alter table public.rsvps
  add column if not exists plus_one_name text null;

create table if not exists public.sms_invites (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  guest_name text not null,
  phone text not null,
  invite_language text not null default 'en' check (invite_language in ('en', 'es')),
  reserved_seats int not null default 1 check (reserved_seats > 0),
  invite_token text not null unique,
  invite_url text not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'opened', 'started', 'accepted', 'declined')),
  sent_at timestamptz null,
  opened_at timestamptz null,
  started_at timestamptz null,
  responded_at timestamptz null,
  notes text null
);

alter table public.sms_invites
  add column if not exists sent_at timestamptz null;

alter table public.sms_invites
  add column if not exists invite_language text;

alter table public.sms_invites
  add column if not exists reserved_seats int;

update public.sms_invites
set invite_language = 'en'
where invite_language is null;

update public.sms_invites
set reserved_seats = 1
where reserved_seats is null;

alter table public.sms_invites
  alter column invite_language set default 'en';

alter table public.sms_invites
  alter column reserved_seats set default 1;

create index if not exists sms_invites_status_idx on public.sms_invites(status);
create index if not exists rsvps_invite_token_idx on public.rsvps(invite_token);

alter table public.rsvps
  drop constraint if exists rsvps_invite_token_fkey;

alter table public.rsvps
  add constraint rsvps_invite_token_fkey
  foreign key (invite_token)
  references public.sms_invites(invite_token)
  on update cascade
  on delete set null;

create or replace function public.track_sms_invite_event(
  p_invite_token text,
  p_event text,
  p_attending boolean default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_event = 'opened' then
    update public.sms_invites
    set status = 'opened',
        opened_at = coalesce(opened_at, now())
    where invite_token = p_invite_token
      and status in ('draft', 'sent');
  elsif p_event = 'started' then
    update public.sms_invites
    set status = 'started',
        started_at = coalesce(started_at, now())
    where invite_token = p_invite_token
      and status in ('draft', 'sent', 'opened');
  elsif p_event = 'responded' then
    update public.sms_invites
    set status = case when p_attending then 'accepted' else 'declined' end,
        responded_at = now(),
        started_at = coalesce(started_at, now()),
        opened_at = coalesce(opened_at, now())
    where invite_token = p_invite_token;
  else
    raise exception 'Unsupported event: %', p_event;
  end if;
end;
$$;

grant execute on function public.track_sms_invite_event(text, text, boolean) to anon, authenticated;

alter table public.rsvps enable row level security;
alter table public.sms_invites enable row level security;

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

drop policy if exists "Allow RSVP linked invite updates" on public.sms_invites;
drop policy if exists "Allow authenticated invite updates" on public.sms_invites;
create policy "Allow authenticated invite updates"
on public.sms_invites
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Allow authenticated invite reads" on public.sms_invites;
create policy "Allow authenticated invite reads"
on public.sms_invites
for select
to authenticated
using (true);

drop policy if exists "Allow authenticated invite inserts" on public.sms_invites;
create policy "Allow authenticated invite inserts"
on public.sms_invites
for insert
to authenticated
with check (true);
