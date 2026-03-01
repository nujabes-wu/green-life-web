-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text,
  preferences jsonb,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for carbon footprint records
create table carbon_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  total_emission numeric not null,
  breakdown jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for carbon_records
alter table carbon_records enable row level security;

create policy "Users can view their own records." on carbon_records
  for select using (auth.uid() = user_id);

create policy "Users can insert their own records." on carbon_records
  for insert with check (auth.uid() = user_id);

-- Set up Realtime for carbon_records
alter publication supabase_realtime add table carbon_records;
