-- Add function to add item to buyer's cart when trade is accepted
CREATE OR REPLACE FUNCTION add_to_buyer_cart(
  p_buyer_id UUID,
  p_product_id UUID,
  p_product_type TEXT,
  p_title TEXT,
  p_price NUMERIC,
  p_image_url TEXT
) RETURNS void AS $$
BEGIN
  INSERT INTO user_cart_items (
    user_id,
    product_id,
    product_type,
    title,
    price,
    image_url,
    quantity
  ) VALUES (
    p_buyer_id,
    p_product_id,
    p_product_type,
    p_title,
    p_price,
    p_image_url,
    1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;