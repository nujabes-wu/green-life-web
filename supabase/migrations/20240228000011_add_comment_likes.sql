-- Add likes column to community_comments table
alter table community_comments add column if not exists likes integer default 0;
