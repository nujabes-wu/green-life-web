-- Community tables

-- Posts table for community content
create table if not exists community_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  title text not null,
  content text not null,
  type text not null, -- 'experience' or 'activity'
  image_url text,
  likes integer default 0,
  comments_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Comments table for post comments
create table if not exists community_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references community_posts(id) not null,
  user_id uuid references profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table community_posts enable row level security;
create policy "Community posts viewable by everyone" on community_posts for select using (true);
create policy "Users can insert their own posts" on community_posts for insert with check (auth.uid() = user_id);
create policy "Users can update their own posts" on community_posts for update using (auth.uid() = user_id);
create policy "Users can delete their own posts" on community_posts for delete using (auth.uid() = user_id);

alter table community_comments enable row level security;
create policy "Comments viewable by everyone" on community_comments for select using (true);
create policy "Users can insert their own comments" on community_comments for insert with check (auth.uid() = user_id);
create policy "Users can delete their own comments" on community_comments for delete using (auth.uid() = user_id);

-- Set up Realtime
alter publication supabase_realtime add table community_posts;
alter publication supabase_realtime add table community_comments;