# Lakay Production Movies on the Lawn

A responsive RSVP and movie voting site for **LAKAY PRODUCTION | MOVIES ON THE LAWN**. Built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase for database, auth, and poster storage.

## Features

- Flyer-inspired retro family movie-night design
- Mobile-first landing page with large RSVP calls to action
- Movie cards with artwork/poster, genre, runtime, rating, and vote buttons
- RSVP form with one movie vote per RSVP submission
- Confirmation page: “You’re on the list. Bring your chair, snacks, and good vibes.”
- Protected admin login with Supabase Auth
- Admin movie add/edit/delete and poster upload to Supabase Storage
- RSVP list, attendance status updates, vote counts, and CSV export
- Placeholder movies so the public page looks complete before real movies are added

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file:

```bash
cp .env.example .env.local
```

3. Add your Supabase project values to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase Setup

Create these tables in Supabase SQL Editor:

```sql
create extension if not exists "pgcrypto";

create table public.movies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  genre text not null,
  runtime text not null,
  rating text not null,
  poster_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  guest_count integer not null default 1,
  attendance_status text not null check (attendance_status in ('yes', 'no', 'maybe')),
  movie_id uuid references public.movies(id) on delete set null,
  message text,
  created_at timestamptz not null default now()
);

alter table public.movies enable row level security;
alter table public.rsvps enable row level security;

create policy "Public can view active movies"
on public.movies for select
using (is_active = true);

create policy "Authenticated admins can manage movies"
on public.movies for all
to authenticated
using (true)
with check (true);

create policy "Anyone can submit RSVPs"
on public.rsvps for insert
to anon, authenticated
with check (true);

create policy "Authenticated admins can view RSVPs"
on public.rsvps for select
to authenticated
using (true);

create policy "Authenticated admins can update RSVPs"
on public.rsvps for update
to authenticated
using (true)
with check (true);
```

Create a public storage bucket named `movie-posters`, then add storage policies:

```sql
insert into storage.buckets (id, name, public)
values ('movie-posters', 'movie-posters', true)
on conflict (id) do update set public = true;

create policy "Authenticated admins can upload posters"
on storage.objects for insert
to authenticated
with check (bucket_id = 'movie-posters');

create policy "Anyone can view posters"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'movie-posters');

create policy "Authenticated admins can update posters"
on storage.objects for update
to authenticated
using (bucket_id = 'movie-posters')
with check (bucket_id = 'movie-posters');

create policy "Authenticated admins can delete posters"
on storage.objects for delete
to authenticated
using (bucket_id = 'movie-posters');
```

## Admin Login

For local editing without Supabase, use:

- Email: `admin@lakay.local`
- Password: `movie-night`

Local admin changes are saved to `data/local-db.json`.

For Supabase production auth, go to **Authentication -> Users** and create the admin user. Use that email and password at `/admin/login`.

This app treats any authenticated Supabase user as an admin. For a family event this keeps setup simple. For a public production deployment with multiple auth users, add an `admin_users` table or custom claims and tighten the RLS policies.

## Seed Movies

Optional starter movies:

```sql
insert into public.movies (title, description, genre, runtime, rating, is_active)
values
  ('Backyard Adventure', 'A feel-good family quest under the stars with laughs, teamwork, and a little mystery.', 'Family Adventure', '1h 38m', 'PG', true),
  ('Lawn Laughs', 'A bright comedy pick for all ages, packed with goofy moments and big summer energy.', 'Comedy', '1h 31m', 'PG', true),
  ('Starry Night Heroes', 'Animated heroes save the neighborhood in a colorful story made for blanket seating.', 'Animation', '1h 45m', 'PG', true);
```

## Deployment

Deploy to Vercel and add the same environment variables in the Vercel project settings. After deployment, generate a QR code that points to the Vercel URL and place it on the flyer.
