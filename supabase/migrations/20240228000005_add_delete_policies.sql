-- Add RLS policies for delete operations

-- User orders delete policy
create policy "Users can delete their own orders" on user_orders for delete using (auth.uid() = user_id);

-- Order items delete policy
create policy "Users can delete order items for their orders" on order_items for delete using (
  exists (
    select 1 from user_orders where user_orders.id = order_items.order_id and user_orders.user_id = auth.uid()
  )
);
