-- Update RLS policy for user_orders to allow sellers to create orders for buyers

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Users can insert their own orders" ON user_orders;

-- Create a new insert policy that allows both:
-- 1. Users to create orders for themselves
-- 2. Sellers to create orders for buyers when accepting trade requests
CREATE POLICY "Users can insert orders for themselves or as sellers" ON user_orders
  FOR INSERT
  WITH CHECK (
    -- Allow users to create orders for themselves
    auth.uid() = user_id OR
    -- Allow sellers to create orders for buyers when accepting trade requests
    EXISTS (
      SELECT 1 FROM trade_requests
      WHERE trade_requests.seller_id = auth.uid()
      AND trade_requests.buyer_id = user_orders.user_id
    )
  );

-- Keep the select policy unchanged
CREATE POLICY IF NOT EXISTS "Users can view their own orders" ON user_orders
  FOR SELECT
  USING (auth.uid() = user_id);
