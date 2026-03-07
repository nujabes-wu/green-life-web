'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { MessageSquare, Pencil, Calendar, Heart, Send, Image as ImageIcon, Trash2, Sparkles, ChevronDown, Leaf, Users, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: string;
  image_url: string | null;
  comments_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    username: string;
    avatar_url: string;
  };
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  user?: {
    username: string;
    avatar_url: string;
  };
}

export default function CommunityPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'experience',
    image_url: null as string | null
  });
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [profile, setProfile] = useState<{username: string | null, avatar_url: string | null} | null>(null);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
    }
  };

  useEffect(() => {
    async function getProfile() {
      if (!user) {
        setProfile(null);
        return;
      }
      
      const { data } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();
        
      if (data) {
        setProfile(data);
      }
    }

    getProfile();
  }, [user]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('community_posts')
        .select('*, profiles(username, avatar_url)')
        .order('created_at', { ascending: false });

      if (activeTab !== 'all') {
        query = query.eq('type', activeTab);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching posts:', error);
        toast.error('获取帖子失败，请稍后重试');
        return;
      }

      setPosts(data || []);
    } catch (err) {
      console.error('Exception fetching posts:', err);
      toast.error('获取帖子时发生异常');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .select('*, profiles(username, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }

      // 组织评论为层次结构
      const commentsWithReplies = organizeComments(data || []);
      setComments(commentsWithReplies);
    } catch (err) {
      console.error('Exception fetching comments:', err);
    }
  };

  const organizeComments = (comments: any[]): Comment[] => {
    // 只返回根评论（没有parent_id的评论）
    return comments.filter(comment => !comment.parent_id).map(comment => ({
      ...comment
    }));
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  useEffect(() => {
    if (selectedPostId) {
      fetchComments(selectedPostId);
    }
  }, [selectedPostId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setSelectedImage(imageDataUrl);
        setNewPost({ ...newPost, image_url: imageDataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setNewPost({ ...newPost, image_url: null });
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast.error('请先登录');
      return;
    }

    if (!newPost.title || !newPost.content) {
      toast.error('请填写标题和内容');
      return;
    }

    try {
      // 创建帖子
      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          title: newPost.title,
          content: newPost.content,
          type: newPost.type,
          image_url: newPost.image_url
        })
        .select()
        .single();

      if (error) {
        toast.error('发布失败');
        console.error('Error creating post:', error);
        return;
      }

      // 奖励积分
      const { error: creditsError } = await supabase.rpc('add_credits', {
        amount: 20,
        description: '发布社区帖子'
      });

      if (!creditsError) {
        toast.success('发布成功！获得 20 积分奖励');
      } else {
        toast.success('发布成功');
        console.error('Error adding credits:', creditsError);
      }

      // 重置表单
      setNewPost({ title: '', content: '', type: 'experience', image_url: null });
      setSelectedImage(null);
      setIsCreatingPost(false);
      await fetchPosts();
    } catch (err) {
      console.error('Exception creating post:', err);
      toast.error('发布时发生异常');
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!user || !newComment.trim()) return;

    try {
      // 添加评论
      const { error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) {
        toast.error('评论失败');
        console.error('Error adding comment:', error);
        return;
      }

      setNewComment('');
      await fetchComments(postId);
      await fetchPosts();
    } catch (err) {
      console.error('Exception adding comment:', err);
      toast.error('评论时发生异常');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) {
        toast.error('删除失败');
        console.error('Error deleting post:', error);
        return;
      }

      toast.success('帖子已删除');
      await fetchPosts();
    } catch (err) {
      console.error('Exception deleting post:', err);
      toast.error('删除时发生异常');
    }
  };

  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('community_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) {
        toast.error('删除评论失败');
        console.error('Error deleting comment:', error);
        return;
      }

      await fetchComments(postId);
      await fetchPosts();
    } catch (err) {
      console.error('Exception deleting comment:', err);
      toast.error('删除评论时发生异常');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: zhCN });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
      {/* Background Decorative Elements - Matching Homepage Style */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30 -z-20" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100/30 dark:bg-green-900/10 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3" />

      <div className="container max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-green-500/10 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-green-500/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-emerald-200/20 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex-1 text-center md:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider">
                <Users className="h-3 w-3" />
                <span>环保社区</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                分享绿色生活 <br/>
                <span className="text-green-600 dark:text-green-500">共建美好家园</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl text-lg font-medium leading-relaxed">
                在这里，每一条经验分享都是一颗绿色的种子。参与讨论，组织活动，让环保成为一种生活方式。发布内容还可获得积分奖励！
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center md:justify-start">
                <Button 
                  onClick={() => {
                    setIsCreatingPost(true);
                    setTimeout(() => {
                      const formElement = document.getElementById('create-post-form');
                      formElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                  }}
                  size="lg"
                  className="rounded-xl font-bold shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 text-white border-none px-8 h-12 transition-all active:scale-95"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  发布内容
                </Button>
              </div>
            </div>

            <div className="relative z-10 hidden md:block">
              {user ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-green-500/5 dark:bg-green-500/10 p-1 rounded-3xl border border-green-500/20 backdrop-blur-sm"
                >
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-[1.25rem] flex flex-col items-center gap-4 min-w-[200px] shadow-sm">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          <span className="text-2xl font-black">{profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-1 rounded-full">
                        <div className="bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black text-slate-800 dark:text-white mb-1">{profile?.username || user.email?.split('@')[0]}</p>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">环保先锋</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-6 rounded-3xl text-sm font-medium text-slate-500 border border-slate-200 dark:border-slate-700 text-center">
                  <p className="mb-2 text-2xl">👋</p>
                  <p>登录参与讨论</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Create Post Form - Collapsible */}
        <AnimatePresence>
          {isCreatingPost && (
            <motion.div
              id="create-post-form"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="overflow-hidden"
            >
              <Card className="border-2 border-dashed border-green-500/20 bg-green-500/5 rounded-[2.5rem] overflow-hidden shadow-none">
                <CardHeader className="bg-transparent border-b border-green-500/10 p-8 pb-6">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-black flex items-center gap-3 text-slate-800 dark:text-white">
                      <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      发布新内容
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setIsCreatingPost(false)} className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                      取消
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">标题</Label>
                      <Input 
                        value={newPost.title} 
                        onChange={e => setNewPost({...newPost, title: e.target.value})} 
                        placeholder="给你的分享起个响亮的标题"
                        className="rounded-xl h-14 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-green-500/20 text-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">内容类型</Label>
                      <div className="flex gap-3 h-14 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <Button 
                          variant="ghost"
                          className={`flex-1 rounded-lg font-bold transition-all h-full ${newPost.type === 'experience' ? 'bg-white dark:bg-slate-700 text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                          onClick={() => setNewPost({ ...newPost, type: 'experience' })}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          环保心得
                        </Button>
                        <Button 
                          variant="ghost"
                          className={`flex-1 rounded-lg font-bold transition-all h-full ${newPost.type === 'activity' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                          onClick={() => setNewPost({ ...newPost, type: 'activity' })}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          环保活动
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">内容详情</Label>
                    <Textarea 
                      value={newPost.content} 
                      onChange={e => setNewPost({...newPost, content: e.target.value})} 
                      placeholder="分享你的环保故事、技巧或活动详情..."
                      className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-green-500/20 min-h-[200px] resize-none p-6 text-base leading-relaxed"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">配图 (可选)</Label>
                    <div className="flex flex-wrap items-center gap-4">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        className="h-28 w-28 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 flex flex-col items-center justify-center gap-2 transition-all group bg-white dark:bg-slate-900"
                      >
                        <ImageIcon className="h-8 w-8 text-slate-400 group-hover:text-green-500 transition-colors" />
                        <span className="text-xs font-bold text-slate-400 group-hover:text-green-500 transition-colors">上传图片</span>
                      </Button>
                      {selectedImage && (
                        <div className="relative group">
                          <img src={selectedImage} alt="Preview" className="h-28 w-28 object-cover rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm" />
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            onClick={clearSelectedImage} 
                            className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all scale-90 hover:scale-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleCreatePost} className="w-full py-8 rounded-2xl text-lg font-black shadow-xl shadow-green-500/20 bg-green-600 hover:bg-green-700 text-white active:scale-[0.98] transition-all">
                      发布内容
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Tabs & List */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="h-14 p-1.5 bg-slate-200/50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
              <TabsTrigger 
                value="all" 
                className="px-6 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-bold gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                全部
              </TabsTrigger>
              <TabsTrigger 
                value="experience" 
                className="px-6 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400 data-[state=active]:shadow-md transition-all duration-300 font-bold gap-2"
              >
                <Sparkles className="h-4 w-4" />
                环保心得
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                className="px-6 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-md transition-all duration-300 font-bold gap-2"
              >
                <Calendar className="h-4 w-4" />
                环保活动
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-[2rem] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-100 dark:border-slate-800 p-8 space-y-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2 pl-16">
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                </div>
              ))
            ) : posts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-6 bg-white/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-300 dark:border-slate-700"
              >
                <div className="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                  <MessageSquare className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xl font-bold text-slate-600 dark:text-slate-300">暂时还没有内容哦</p>
                  <p className="text-slate-500">快来发布第一条动态，成为社区的环保先锋吧！</p>
                </div>
                <Button onClick={() => setIsCreatingPost(true)} variant="outline" className="rounded-full border-2 border-dashed h-12 px-8 font-bold hover:border-green-400 hover:text-green-600 transition-colors">
                  立即发布
                </Button>
              </motion.div>
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="pb-4 pt-8 px-8">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                              {post.user?.avatar_url ? (
                                <img src={post.user.avatar_url} alt={post.user.username} className="h-full w-full object-cover" />
                              ) : (
                                <span className="text-xl font-black text-slate-400">
                                  {post.user?.username?.charAt(0).toUpperCase() || 'U'}
                                </span>
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-green-500 border-4 border-white dark:border-slate-900 w-5 h-5 rounded-full" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-black text-slate-800 dark:text-slate-100 mb-1">{post.title}</CardTitle>
                            <div className="flex items-center gap-3 text-sm font-medium">
                              <span className="text-slate-600 dark:text-slate-400">{post.user?.username || '匿名用户'}</span>
                              <span className="text-slate-300 dark:text-slate-700">•</span>
                              <span className="text-slate-400">{formatTimeAgo(post.created_at)}</span>
                              <Badge 
                                variant="secondary" 
                                className={`ml-1 border-none font-bold rounded-lg px-2.5 py-0.5 ${
                                  post.type === 'experience' 
                                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300' 
                                    : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                                }`}
                              >
                                {post.type === 'experience' ? '✨ 环保心得' : '📅 环保活动'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {user?.id === post.user_id && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeletePost(post.id)}
                            className="text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-6 px-8">
                      <div className="space-y-6 pl-[4.5rem]">
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base font-medium">
                          {post.content}
                        </p>
                        {post.image_url && (
                          <div className="rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-none max-w-sm">
                            <img 
                              src={post.image_url} 
                              alt={post.title} 
                              className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-700"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end items-center border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 py-4 px-8">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`rounded-xl gap-2 transition-all font-bold h-10 px-4 ${selectedPostId === post.id ? 'bg-white shadow-sm text-green-600 dark:bg-slate-800 dark:text-green-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white dark:hover:bg-slate-800'}`}
                        onClick={() => setSelectedPostId(selectedPostId === post.id ? null : post.id)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>{comments.filter(c => c.post_id === post.id).length > 0 ? `${comments.filter(c => c.post_id === post.id).length} 条评论` : '发表评论'}</span>
                      </Button>
                    </CardFooter>

                    {/* Comments Section */}
                    <AnimatePresence>
                      {selectedPostId === post.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-slate-100 dark:border-slate-800 p-8 bg-slate-50/50 dark:bg-slate-900/50 space-y-8">
                            <div className="space-y-6">
                              {comments.map((comment) => (
                                <div key={comment.id} className="flex gap-4 group">
                                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                                    {comment.user?.avatar_url ? (
                                      <img src={comment.user.avatar_url} className="w-full h-full object-cover"/>
                                    ) : (
                                      <span className="font-black text-slate-400">{comment.user?.username?.charAt(0).toUpperCase()}</span>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{comment.user?.username || '匿名用户'}</span>
                                      <span className="text-xs text-slate-400 font-medium">{formatTimeAgo(comment.created_at)}</span>
                                      {user?.id === comment.user_id && (
                                        <button 
                                          onClick={() => handleDeleteComment(comment.id, post.id)}
                                          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      )}
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                      {comment.content}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {user ? (
                              <div className="flex gap-4 items-end pl-14">
                                <div className="flex-1 relative">
                                  <Input
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                    placeholder="写下你的评论..."
                                    className="pr-14 rounded-2xl border-slate-200 dark:border-slate-700 focus-visible:ring-green-500/20 h-12 bg-white dark:bg-slate-800 shadow-sm"
                                  />
                                  <Button 
                                    size="sm" 
                                    className="absolute right-1 top-1 h-10 w-10 rounded-xl bg-green-600 hover:bg-green-700 p-0 shadow-md shadow-green-500/20"
                                    onClick={() => handleAddComment(post.id)}
                                    disabled={!newComment.trim()}
                                  >
                                    <Send className="h-4 w-4 text-white" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center p-6 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                <p className="text-sm font-bold text-slate-500">登录后参与讨论</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
