-- Add update policy for mall_items table
-- Since redeem_item is a security definer function, it should have permission to update stock

-- First, let's check if the policy already exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'mall_items' 
    AND policyname = 'Mall items can be updated by security definer functions'
  ) THEN
    CREATE POLICY "Mall items can be updated by security definer functions" ON mall_items
    FOR UPDATE USING (true);
  END IF;
END $$;
