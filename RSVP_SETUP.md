# RSVP Setup (Database + Dashboard + Email)

## 1) Configure environment variables
Create `.env` with:

```bash
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## 2) Create the database table and policies
In Supabase SQL Editor, run:

- `supabase/schema.sql`

This creates `public.rsvps` and sets RLS so:
- Anyone can insert RSVP rows
- Only authenticated users can read rows (for dashboard)

If your table already exists from an older setup, run:

```sql
alter table public.rsvps add column if not exists kids_food_required boolean null;
alter table public.rsvps add column if not exists bringing_children boolean null;
alter table public.rsvps add column if not exists children_count int null check (children_count is null or children_count > 0);
```

## 3) Deploy email notification function
From project root:

```bash
supabase functions deploy rsvp-notify
```

Then set function secrets:

```bash
supabase secrets set RESEND_API_KEY=YOUR_RESEND_API_KEY
supabase secrets set RSVP_NOTIFY_TO=you@example.com
supabase secrets set RSVP_NOTIFY_FROM="RSVP Bot <onboarding@resend.dev>"
```

## 4) Create your dashboard admin user
In Supabase Auth:
- Create an email/password user for yourself
- Use that account on `/dashboard`

## 5) Use it
- Guests submit RSVP on `/`
- Data is stored in Supabase table `rsvps`
- You get email notification for each new RSVP
- You review responses at `/dashboard`
