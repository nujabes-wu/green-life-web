-- Add parent_id column to community_comments table to support comment replies
alter table community_comments add column if not exists parent_id uuid references community_comments(id);
