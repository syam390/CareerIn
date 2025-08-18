-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  avatar_url text,
  headline text,
  skills text[],
  created_at timestamptz default now()
);

-- Trigger to create profile row on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- Posts
create table if not exists public.posts (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  content text,
  created_at timestamptz default now()
);

-- Comments
create table if not exists public.comments (
  id bigserial primary key,
  post_id bigint references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  content text,
  created_at timestamptz default now()
);

-- Likes
create table if not exists public.likes (
  post_id bigint references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

-- Jobs
create table if not exists public.jobs (
  id bigserial primary key,
  employer_id uuid references public.profiles(id) on delete cascade,
  title text,
  company text,
  location text,
  employment_type text,
  description text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Applications
create table if not exists public.applications (
  id bigserial primary key,
  job_id bigint references public.jobs(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  cover_letter text,
  resume_url text,
  created_at timestamptz default now(),
  unique (job_id, user_id)
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;

-- Profiles policies
create policy "Read profiles" on public.profiles for select to authenticated using (true);
create policy "Update own profile" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "Insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);

-- Posts policies
create policy "Read posts" on public.posts for select to authenticated using (true);
create policy "Create post as self" on public.posts for insert to authenticated with check (auth.uid() = user_id);
create policy "Modify own post" on public.posts for update using (auth.uid() = user_id) to authenticated with check (auth.uid() = user_id);
create policy "Delete own post" on public.posts for delete to authenticated using (auth.uid() = user_id);

-- Comments policies
create policy "Read comments" on public.comments for select to authenticated using (true);
create policy "Comment as self" on public.comments for insert to authenticated with check (auth.uid() = user_id);
create policy "Edit own comment" on public.comments for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Delete own comment" on public.comments for delete to authenticated using (auth.uid() = user_id);

-- Likes policies
create policy "Read likes" on public.likes for select to authenticated using (true);
create policy "Like as self" on public.likes for insert to authenticated with check (auth.uid() = user_id);
create policy "Unlike as self" on public.likes for delete to authenticated using (auth.uid() = user_id);

-- Jobs policies
create policy "Read jobs" on public.jobs for select to authenticated using (true);
create policy "Post job as employer" on public.jobs for insert to authenticated with check (auth.uid() = employer_id);
create policy "Edit own job" on public.jobs for update to authenticated using (auth.uid() = employer_id) with check (auth.uid() = employer_id);
create policy "Delete own job" on public.jobs for delete to authenticated using (auth.uid() = employer_id);

-- Applications policies
create policy "Apply as self" on public.applications for insert to authenticated with check (auth.uid() = user_id);
create policy "Read own or employer apps" on public.applications for select to authenticated using (auth.uid() = user_id or exists (select 1 from public.jobs j where j.id = job_id and j.employer_id = auth.uid()));
create policy "Edit own app" on public.applications for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Delete own app" on public.applications for delete to authenticated using (auth.uid() = user_id);
