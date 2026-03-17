-- 删除社区表的策略

-- 删除 community_posts 表的策略
DROP POLICY IF EXISTS "Community posts viewable by everyone" ON community_posts;
DROP POLICY IF EXISTS "Users can insert their own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON community_posts;

-- 删除 community_comments 表的策略
DROP POLICY IF EXISTS "Comments viewable by everyone" ON community_comments;
DROP POLICY IF EXISTS "Users can insert their own comments" ON community_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON community_comments;

-- 禁用行级安全
ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments DISABLE ROW LEVEL SECURITY;