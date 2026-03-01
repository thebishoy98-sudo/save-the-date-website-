# RSVP Setup (Database + Dashboard + Email + SMS Tracking)

## 1) Configure environment variables
Create `.env` with:

```bash
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_SITE_URL=https://yourdomain.com
```

`VITE_SITE_URL` is used to generate each guest's unique invite URL.

## 2) Create database tables and policies
In Supabase SQL Editor, run:

- `supabase/schema.sql`

This creates:
- `public.rsvps` (RSVP responses)
- `public.sms_invites` (unique invite links + status tracking)

Status flow for `sms_invites`:
- `draft` → `sent` → `opened` → `started` → `accepted` or `declined`

Security improvement included:
- guests update invite tracking through `track_sms_invite_event(...)` RPC only (no broad anonymous table updates)

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

## 5) SMS provider options (cheap/free)
- **Best starter (simple): Twilio** — easy API, reliable, paid usage.
- **Budget alternative:** MessageBird / Vonage depending on your destination country pricing.
- **Mostly free testing:** Twilio trial credits (good for MVP/testing, not for production blasts).
- **Ultra-low cost DIY:** send manually from your phone with exported CSV + unique URLs (no API cost, more manual).

## 6) Use it
- Add invite contacts from dashboard **SMS Invite Tracking** section or from `SMS_Invite_Template.csv`
- Each row has a unique URL like `/?invite=<token>`
- Share that URL by SMS
- Dashboard shows:
  - who opened the link
  - who started filling data but did not finish
  - who accepted/declined
  - who is still pending

## 7) Send SMS directly from dashboard (Twilio)
Deploy function:

```bash
supabase functions deploy send-sms-invite
```

Set Twilio secrets:

```bash
supabase secrets set TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
supabase secrets set TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
supabase secrets set TWILIO_MESSAGING_SERVICE_SID=YOUR_TWILIO_MESSAGING_SERVICE_SID
```

Or use a direct sender number instead of a Messaging Service:

```bash
supabase secrets set TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
supabase secrets set TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
supabase secrets set TWILIO_FROM_NUMBER=+17323343287
```

After deploy + secrets, use **Send SMS** in `/dashboard`.
