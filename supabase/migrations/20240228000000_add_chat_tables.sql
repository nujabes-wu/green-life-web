-- Chat Tables

-- Chats table to store chat sessions
create table if not exists chats (
  id uuid default gen_random_uuid() primary key,
  buyer_id uuid references profiles(id) not null,
  seller_id uuid references profiles(id) not null,
  item_id uuid references marketplace_items(id) not null,
  item_title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages table to store individual messages
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  chat_id uuid references chats(id) not null,
  sender_id uuid references profiles(id) not null,
  sender_type text not null, -- 'buyer' or 'seller'
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User status table to track online status
create table if not exists user_status (
  user_id uuid references profiles(id) not null primary key,
  is_online boolean default false,
  last_seen timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies

alter table chats enable row level security;
create policy "Users can view their own chats" on chats for select using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "Buyers can create chats" on chats for insert with check (auth.uid() = buyer_id);

alter table messages enable row level security;
create policy "Users can view messages in their chats" on messages for select using (
  exists (
    select 1 from chats where chats.id = messages.chat_id and (chats.buyer_id = auth.uid() or chats.seller_id = auth.uid())
  )
);
create policy "Users can send messages in their chats" on messages for insert with check (
  exists (
    select 1 from chats where chats.id = messages.chat_id and chats.buyer_id = auth.uid()
  ) or exists (
    select 1 from chats where chats.id = messages.chat_id and chats.seller_id = auth.uid()
  )
);

alter table user_status enable row level security;
create policy "Users can view own status" on user_status for select using (auth.uid() = user_id);
create policy "Users can update own status" on user_status for update using (auth.uid() = user_id);
create policy "Users can insert own status" on user_status for insert with check (auth.uid() = user_id);

-- Set up Realtime
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table user_status;