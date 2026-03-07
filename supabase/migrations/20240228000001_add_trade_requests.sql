-- Trade Requests table to manage trade process
create table if not exists trade_requests (
  id uuid default gen_random_uuid() primary key,
  buyer_id uuid references profiles(id) not null,
  seller_id uuid references profiles(id) not null,
  item_id uuid references marketplace_items(id) not null,
  item_title text not null,
  price numeric not null,
  status text default 'pending', -- pending, accepted, rejected, completed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table trade_requests enable row level security;
create policy "Buyers can view their trade requests" on trade_requests for select using (auth.uid() = buyer_id);
create policy "Sellers can view trade requests for their items" on trade_requests for select using (auth.uid() = seller_id);
create policy "Buyers can create trade requests" on trade_requests for insert with check (auth.uid() = buyer_id);
create policy "Sellers can update trade requests" on trade_requests for update using (auth.uid() = seller_id);

-- Set up Realtime
alter publication supabase_realtime add table trade_requests;