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
  invite_token text null,
  duplicate_flag boolean not null default false,
  duplicate_reason text null,
  review_status text not null default 'approved' check (review_status in ('approved', 'pending_review', 'needs_edit'))
);

alter table public.rsvps
  add column if not exists invite_token text null;

alter table public.rsvps
  add column if not exists plus_one_name text null;

alter table public.rsvps
  add column if not exists duplicate_flag boolean not null default false;

alter table public.rsvps
  add column if not exists duplicate_reason text null;

alter table public.rsvps
  add column if not exists review_status text;

update public.rsvps
set review_status = 'approved'
where review_status is null;

alter table public.rsvps
  alter column review_status set default 'approved';

alter table public.rsvps
  drop constraint if exists rsvps_review_status_check;

alter table public.rsvps
  add constraint rsvps_review_status_check
  check (review_status in ('approved', 'pending_review', 'needs_edit'));

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

create or replace function public.flag_rsvp_duplicates()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  reasons text[] := array[]::text[];
  current_name text := lower(trim(coalesce(new.name, '')));
  has_duplicate boolean := false;
begin
  if current_name = '' then
    return new;
  end if;

  if exists (
    select 1
    from unnest(string_to_array(coalesce(new.plus_one_name, ''), ',')) as p(name_part)
    where lower(trim(name_part)) = current_name
  ) then
    reasons := array_append(reasons, 'Primary guest name also appears in plus-one list');
  end if;

  if exists (
    select 1
    from public.rsvps r
    where (new.id is null or r.id <> new.id)
      and lower(trim(r.name)) = current_name
  ) then
    reasons := array_append(reasons, 'Primary guest matches an existing RSVP primary guest');
  end if;

  if exists (
    select 1
    from public.rsvps r
    join unnest(string_to_array(coalesce(r.plus_one_name, ''), ',')) as p(name_part) on true
    where (new.id is null or r.id <> new.id)
      and lower(trim(p.name_part)) = current_name
  ) then
    reasons := array_append(reasons, 'Primary guest matches an existing plus-one name');
  end if;

  if exists (
    select 1
    from unnest(string_to_array(coalesce(new.plus_one_name, ''), ',')) as np(name_part)
    join public.rsvps r on (new.id is null or r.id <> new.id)
      and lower(trim(r.name)) = lower(trim(np.name_part))
  ) then
    reasons := array_append(reasons, 'A plus-one matches an existing RSVP primary guest');
  end if;

  if exists (
    select 1
    from unnest(string_to_array(coalesce(new.plus_one_name, ''), ',')) as np(name_part)
    join public.rsvps r on (new.id is null or r.id <> new.id)
    join unnest(string_to_array(coalesce(r.plus_one_name, ''), ',')) as ep(name_part) on true
    where lower(trim(np.name_part)) = lower(trim(ep.name_part))
  ) then
    reasons := array_append(reasons, 'A plus-one matches an existing plus-one name');
  end if;

  has_duplicate := coalesce(array_length(reasons, 1), 0) > 0;
  if has_duplicate then
    new.duplicate_flag := true;
    new.duplicate_reason := array_to_string(reasons, '; ');
    new.review_status := 'pending_review';
  else
    if new.review_status is null then
      new.review_status := 'approved';
    end if;
    new.duplicate_flag := coalesce(new.duplicate_flag, false);
    if not new.duplicate_flag then
      new.duplicate_reason := null;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_flag_rsvp_duplicates on public.rsvps;
create trigger trg_flag_rsvp_duplicates
before insert or update of name, plus_one_name on public.rsvps
for each row
execute function public.flag_rsvp_duplicates();

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

drop policy if exists "Allow authenticated RSVP updates" on public.rsvps;
create policy "Allow authenticated RSVP updates"
on public.rsvps
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Allow authenticated RSVP deletes" on public.rsvps;
create policy "Allow authenticated RSVP deletes"
on public.rsvps
for delete
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

drop policy if exists "Allow authenticated invite deletes" on public.sms_invites;
create policy "Allow authenticated invite deletes"
on public.sms_invites
for delete
to authenticated
using (true);

drop policy if exists "Allow authenticated invite inserts" on public.sms_invites;
create policy "Allow authenticated invite inserts"
on public.sms_invites
for insert
to authenticated
with check (true);
