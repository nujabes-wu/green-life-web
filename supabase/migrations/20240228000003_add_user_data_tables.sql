-- User-specific data tables

-- Shopping cart items
create table if not exists user_cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  product_id uuid not null,
  product_type text not null, -- 'mall' or 'marketplace'
  title text not null,
  price numeric not null,
  image_url text,
  quantity integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User orders
create table if not exists user_orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  total_amount numeric not null,
  status text default 'completed', -- pending, completed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order items
create table if not exists order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references user_orders(id) not null,
  product_id uuid not null,
  title text not null,
  price numeric not null,
  quantity integer default 1
);

-- User addresses
create table if not exists user_addresses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  name text not null,
  phone text not null,
  address text not null,
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table user_cart_items enable row level security;
create policy "Users can view their own cart items" on user_cart_items for select using (auth.uid() = user_id);
create policy "Users can insert their own cart items" on user_cart_items for insert with check (auth.uid() = user_id);
create policy "Users can update their own cart items" on user_cart_items for update using (auth.uid() = user_id);
create policy "Users can delete their own cart items" on user_cart_items for delete using (auth.uid() = user_id);

alter table user_orders enable row level security;
create policy "Users can view their own orders" on user_orders for select using (auth.uid() = user_id);
create policy "Users can insert their own orders" on user_orders for insert with check (auth.uid() = user_id);

alter table order_items enable row level security;
create policy "Users can view order items for their orders" on order_items for select using (
  exists (
    select 1 from user_orders where user_orders.id = order_items.order_id and user_orders.user_id = auth.uid()
  )
);

alter table user_addresses enable row level security;
create policy "Users can view their own addresses" on user_addresses for select using (auth.uid() = user_id);
create policy "Users can insert their own addresses" on user_addresses for insert with check (auth.uid() = user_id);
create policy "Users can update their own addresses" on user_addresses for update using (auth.uid() = user_id);
create policy "Users can delete their own addresses" on user_addresses for delete using (auth.uid() = user_id);

-- Set up Realtime
alter publication supabase_realtime add table user_cart_items;
alter publication supabase_realtime add table user_orders;
alter publication supabase_realtime add table user_addresses;