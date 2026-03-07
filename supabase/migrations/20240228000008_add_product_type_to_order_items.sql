-- Add product_type column to order_items table
alter table order_items add column if not exists product_type text not null default 'marketplace';
