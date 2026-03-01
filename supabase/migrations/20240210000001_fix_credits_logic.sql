-- 1. 修复加分逻辑 (确保能加进去)
create or replace function add_credits(amount integer, description text)
returns void as $$
declare
  user_id uuid;
begin
  user_id := auth.uid();
  if user_id is null then raise exception '未登录'; end if;
  if amount <= 0 then raise exception '积分必须大于0'; end if;

  -- 直接更新，无需担心 RLS，因为是 security definer
  update profiles 
  set credits = coalesce(credits, 0) + amount 
  where id = user_id;

  insert into credit_transactions (user_id, amount, type, description)
  values (user_id, amount, 'earn', description);
end;
$$ language plpgsql security definer;

-- 2. 修复兑换逻辑 (事务 + 行锁 + 原子性)
create or replace function redeem_item(item_id uuid, user_id uuid)
returns void as $$
declare
  item_cost integer;
  current_credits integer;
  item_stock integer;
begin
  -- 检查用户是否匹配 (防止替别人操作)
  if auth.uid() != user_id then raise exception '权限不足'; end if;

  -- 获取商品信息 (并锁定该行，防止超卖)
  select points_cost, stock into item_cost, item_stock 
  from mall_items 
  where id = item_id 
  for update; -- 行级锁

  if not found then raise exception '商品不存在'; end if;
  if item_stock <= 0 then raise exception '库存不足'; end if;

  -- 获取用户积分 (并锁定该行，防止并发扣分)
  select credits into current_credits 
  from profiles 
  where id = user_id 
  for update; -- 行级锁

  if current_credits < item_cost then 
    raise exception 'Insufficient credits'; -- 保持原错误码以便前端匹配
  end if;

  -- 执行扣减 (原子操作)
  update profiles set credits = credits - item_cost where id = user_id;
  update mall_items set stock = stock - 1 where id = item_id;

  -- 记录流水
  insert into credit_transactions (user_id, amount, type, description)
  values (user_id, -item_cost, 'redeem', 'Redeemed item ' || item_id);
end;
$$ language plpgsql security definer;
