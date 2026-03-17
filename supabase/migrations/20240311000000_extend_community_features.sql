-- 扩展社区功能

-- 为社区帖子添加活动相关字段
alter table community_posts add column if not exists activity_time timestamp with time zone;
alter table community_posts add column if not exists activity_location text;
alter table community_posts add column if not exists reward_credits integer default 0;
alter table community_posts add column if not exists participant_count integer default 0;

-- 创建活动参与者表
create table if not exists activity_participants (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references community_posts(id) not null,
  user_id uuid references profiles(id) not null,
  status text default 'registered', -- 'registered', 'attended', 'cancelled'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(post_id, user_id)
);

-- RLS Policies for activity_participants
alter table activity_participants enable row level security;
create policy "Activity participants viewable by everyone" on activity_participants for select using (true);
create policy "Users can insert their own participation" on activity_participants for insert with check (auth.uid() = user_id);
create policy "Users can update their own participation" on activity_participants for update using (auth.uid() = user_id);

-- Set up Realtime for activity_participants
alter publication supabase_realtime add table activity_participants;

-- 创建更新活动参与者数量的函数
create or replace function update_participant_count()
returns trigger as $$
begin
  update community_posts
  set participant_count = (
    select count(*) from activity_participants
    where post_id = new.post_id and status = 'registered'
  )
  where id = new.post_id;
  return new;
end;
$$ language plpgsql;

-- 创建触发器
create trigger update_participant_count_trigger
after insert or update or delete on activity_participants
for each row
execute function update_participant_count();
