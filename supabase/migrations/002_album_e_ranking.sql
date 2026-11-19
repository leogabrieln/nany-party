-- Nany's Birthday — migração 002: álbum de polaroids + ranking do quiz.
-- Execute no SQL Editor do Supabase DEPOIS da 001_party_schema.sql.

-- ── Ranking do quiz: tempo total (desempate) e leitura pública ──
alter table public.quiz_scores add column if not exists time_ms integer check (time_ms is null or time_ms >= 0);

grant select on public.quiz_scores to anon;
drop policy if exists "Public can read quiz scores" on public.quiz_scores;
create policy "Public can read quiz scores" on public.quiz_scores for select to anon using (true);

-- ── Álbum da festa: fotos tiradas na cabine ──
create table if not exists public.party_photos (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null check (char_length(trim(guest_name)) between 1 and 35),
  image_url text not null check (char_length(image_url) <= 600),
  effect text check (effect is null or char_length(effect) <= 40),
  created_at timestamptz not null default now()
);

alter table public.party_photos enable row level security;
grant select, insert on public.party_photos to anon;

drop policy if exists "Public can read party photos" on public.party_photos;
create policy "Public can read party photos" on public.party_photos for select to anon using (true);
drop policy if exists "Public can publish party photos" on public.party_photos;
create policy "Public can publish party photos" on public.party_photos for insert to anon
  with check (char_length(trim(guest_name)) between 1 and 35);

-- Bucket público para as polaroids (JPEG/PNG/WebP, até 5 MB).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('party-photos', 'party-photos', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can upload party photos" on storage.objects;
create policy "Public can upload party photos" on storage.objects for insert to anon
  with check (bucket_id = 'party-photos' and storage.extension(name) in ('jpg','jpeg','png','webp'));

drop policy if exists "Public can view party photos" on storage.objects;
create policy "Public can view party photos" on storage.objects for select to anon using (bucket_id = 'party-photos');
