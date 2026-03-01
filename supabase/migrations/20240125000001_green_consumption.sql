-- Add credits to profiles
alter table profiles add column if not exists credits integer default 0;

-- Credit Transactions Log
create table if not exists credit_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  amount integer not null,
  type text not null, -- 'earn', 'redeem'
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Mall Items (Redeemable)
create table if not exists mall_items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text,
  points_cost integer not null,
  category text,
  stock integer default 100,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Second-hand Marketplace Items
create table if not exists marketplace_items (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references profiles(id) not null,
  title text not null,
  description text,
  image_url text,
  price_cny numeric, -- Price in CNY, 0 means free/exchange
  contact_info text,
  status text default 'active', -- active, sold
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies

-- Profiles: credits viewable by owner (already covered by existing policy? need to check)
-- Actually existing policy is "Public profiles are viewable by everyone." which is fine for reading, 
-- but we might want to restrict credits visibility if it was private, but for now public is ok or we assume the frontend filters it.
-- Let's ensure updates to credits are secure (usually backend only, but for MVP we might allow RLS update or use RPC).
-- For this MVP, we will allow users to update their own profile (credits) via RLS for simplicity, 
-- BUT ideally this should be a stored procedure to prevent cheating. 
-- Let's create a stored procedure for redeeming points to be safe.

create or replace function redeem_item(item_id uuid, user_id uuid)
returns void as $$
declare
  item_cost integer;
  current_credits integer;
begin
  -- Get item cost
  select points_cost into item_cost from mall_items where id = item_id;
  
  -- Get user credits
  select credits into current_credits from profiles where id = user_id;
  
  if current_credits >= item_cost then
    -- Deduct credits
    update profiles set credits = credits - item_cost where id = user_id;
    
    -- Record transaction
    insert into credit_transactions (user_id, amount, type, description)
    values (user_id, -item_cost, 'redeem', 'Redeemed item ' || item_id);
    
    -- Decrement stock (optional)
    update mall_items set stock = stock - 1 where id = item_id;
  else
    raise exception 'Insufficient credits';
  end if;
end;
$$ language plpgsql security definer;

-- RLS for new tables
alter table credit_transactions enable row level security;
create policy "Users can view own transactions" on credit_transactions for select using (auth.uid() = user_id);

alter table mall_items enable row level security;
create policy "Mall items viewable by everyone" on mall_items for select using (true);

alter table marketplace_items enable row level security;
create policy "Marketplace items viewable by everyone" on marketplace_items for select using (true);
create policy "Users can insert own items" on marketplace_items for insert with check (auth.uid() = seller_id);
create policy "Users can update own items" on marketplace_items for update using (auth.uid() = seller_id);

-- Insert some initial data for Mall
insert into mall_items (title, description, points_cost, category, image_url) values
('环保竹纤维水杯', '可降解材质，耐高温，无异味。', 500, '生活用品', 'https://fafncxwbckmnsrbfumuz.supabase.co/storage/v1/object/public/Points%20Mall%20images/bamboo_fiber_cup.jpg'),
('有机棉帆布袋', '时尚百搭，结实耐用，替代塑料袋。', 300, '生活用品', 'https://fafncxwbckmnsrbfumuz.supabase.co/storage/v1/object/public/Points%20Mall%20images/canvas_bag.jpg'),
('太阳能充电宝', '户外旅行必备，清洁能源随身带。', 2000, '数码科技', 'https://fafncxwbckmnsrbfumuz.supabase.co/storage/v1/object/public/Points%20Mall%20images/solar_power_bank.jpg'),
('再生纸笔记本', '100%再生纸制造，书写顺滑。', 200, '办公文具', 'https://fafncxwbckmnsrbfumuz.supabase.co/storage/v1/object/public/Points%20Mall%20images/Recycled%20notebook.jpg');

