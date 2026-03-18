-- Add image_url column to order_items table
alter table order_items add column if not exists image_url text;