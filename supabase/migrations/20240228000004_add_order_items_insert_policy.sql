-- Add RLS policy for insert operations on order_items table
create policy "Users can insert order items for their orders" on order_items for insert with check (
  exists (
    select 1 from user_orders where user_orders.id = order_items.order_id and user_orders.user_id = auth.uid()
  )
);
