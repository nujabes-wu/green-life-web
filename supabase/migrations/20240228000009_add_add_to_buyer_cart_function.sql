-- Add function to add item to buyer's cart
create or replace function add_to_buyer_cart(
  buyer_id uuid,
  product_id uuid,
  product_type text,
  title text,
  price numeric,
  image_url text,
  quantity integer
) returns void as $$
begin
  -- 直接插入购物车商品，绕过RLS策略
  insert into user_cart_items (
    user_id,
    product_id,
    product_type,
    title,
    price,
    image_url,
    quantity
  ) values (
    buyer_id,
    product_id,
    product_type,
    title,
    price,
    image_url,
    quantity
  );
end;
$$ language plpgsql security definer;
