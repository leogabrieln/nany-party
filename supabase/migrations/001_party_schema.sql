-- Nany's Birthday — esquema inicial para conteúdo público da festa.
-- Execute no SQL Editor do projeto Supabase depois de revisar os dados do evento.

create extension if not exists pgcrypto;

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null check (char_length(trim(guest_name)) between 1 and 60),
  created_at timestamptz not null default now()
);

create table if not exists public.memory_posts (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null check (char_length(trim(guest_name)) between 1 and 35),
  message text not null check (char_length(trim(message)) between 1 and 240),
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.playlist_suggestions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 120),
  artist text not null default 'Artista não informado' check (char_length(artist) <= 120),
  created_at timestamptz not null default now()
);

create table if not exists public.playlist_votes (
  id uuid primary key default gen_random_uuid(),
  suggestion_id uuid not null references public.playlist_suggestions(id) on delete cascade,
  voter_key uuid not null,
  created_at timestamptz not null default now(),
  constraint one_vote_per_song_per_device unique (suggestion_id, voter_key)
);

create table if not exists public.quiz_scores (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null check (char_length(trim(guest_name)) between 1 and 35),
  score integer not null check (score >= 0),
  total integer not null check (total > 0 and score <= total),
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;
alter table public.memory_posts enable row level security;
alter table public.playlist_suggestions enable row level security;
alter table public.playlist_votes enable row level security;
alter table public.quiz_scores enable row level security;

grant usage on schema public to anon;
grant insert on public.rsvps to anon;
grant select, insert on public.memory_posts to anon;
grant select, insert on public.playlist_suggestions to anon;
revoke all on public.playlist_votes from anon;
grant select (suggestion_id), insert (suggestion_id, voter_key) on public.playlist_votes to anon;
grant insert on public.quiz_scores to anon;

-- Acesso público mínimo para o site sem login. Não há permissões públicas de UPDATE/DELETE.
drop policy if exists "Public can submit RSVPs" on public.rsvps;
create policy "Public can submit RSVPs" on public.rsvps for insert to anon with check (char_length(trim(guest_name)) between 1 and 60);

drop policy if exists "Public can read memory posts" on public.memory_posts;
create policy "Public can read memory posts" on public.memory_posts for select to anon using (true);
drop policy if exists "Public can publish memory posts" on public.memory_posts;
create policy "Public can publish memory posts" on public.memory_posts for insert to anon with check (char_length(trim(guest_name)) between 1 and 35 and char_length(trim(message)) between 1 and 240);

drop policy if exists "Public can read playlist suggestions" on public.playlist_suggestions;
create policy "Public can read playlist suggestions" on public.playlist_suggestions for select to anon using (true);
drop policy if exists "Public can suggest songs" on public.playlist_suggestions;
create policy "Public can suggest songs" on public.playlist_suggestions for insert to anon with check (char_length(trim(title)) between 1 and 120);

drop policy if exists "Public can read playlist votes" on public.playlist_votes;
create policy "Public can read playlist votes" on public.playlist_votes for select to anon using (true);
drop policy if exists "Public can vote for songs" on public.playlist_votes;
create policy "Public can vote for songs" on public.playlist_votes for insert to anon with check (true);

drop policy if exists "Public can submit quiz scores" on public.quiz_scores;
create policy "Public can submit quiz scores" on public.quiz_scores for insert to anon with check (char_length(trim(guest_name)) between 1 and 35 and score >= 0 and total > 0 and score <= total);

-- Bucket público para exibir fotos do mural. O upload anônimo é limitado a imagens de até 5 MB.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('memory-photos', 'memory-photos', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can upload memory photos" on storage.objects;
create policy "Public can upload memory photos" on storage.objects for insert to anon
with check (bucket_id = 'memory-photos' and (storage.extension(name) = 'jpg' or storage.extension(name) = 'jpeg' or storage.extension(name) = 'png' or storage.extension(name) = 'webp'));

drop policy if exists "Public can view memory photos" on storage.objects;
create policy "Public can view memory photos" on storage.objects for select to anon using (bucket_id = 'memory-photos');
