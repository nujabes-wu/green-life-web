'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ShoppingBag, Recycle, Coins, Bike, Bus, Leaf, ArrowUpRight, Brain, BarChart3, TrendingUp, Search, Trash2, Sparkles, Gift, Zap, Info, Loader2 } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { MallItem, MarketItem } from "@/types";
import { MallItemCard } from "@/components/recommendations/MallItemCard";
import { MarketItemCard } from "@/components/recommendations/MarketItemCard";
import { getChatResponse } from "@/lib/ai/chat";
import { evaluateMarketItem } from "@/lib/ai/image";
import { motion, AnimatePresence } from 'framer-motion';

export default function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState('mall');
  const [credits, setCredits] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const [mallItems, setMallItems] = useState<MallItem[]>([]);
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state for new market item
  const [isPosting, setIsPosting] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    price_cny: '',
    contact_info: '',
    image_url: ''
  });

  // AI features state
  const [creditAnalysis, setCreditAnalysis] = useState<string | null>(null);
  const [itemEvaluation, setItemEvaluation] = useState<string | null>(null);
  const [productRecommendations, setProductRecommendations] = useState<string | null>(null);
  const [isAnalyzingCredits, setIsAnalyzingCredits] = useState(false);
  const [isEvaluatingItem, setIsEvaluatingItem] = useState(false);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);
  const fileInputElement = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchCredits = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
    
    if (data) {
      setCredits(data.credits || 0);
    }
  };

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      fetchCredits(session.user.id);
    }
  };

  const fetchMallItems = async () => {
    const { data } = await supabase.from('mall_items').select('*').gt('stock', 0);
    if (data) setMallItems(data);
  };

  const fetchMarketItems = async () => {
    const { data } = await supabase.from('marketplace_items').select('*').eq('status', 'active').order('created_at', { ascending: false });
    if (data) setMarketItems(data);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await checkUser();
      // Fetch items in parallel
      await Promise.all([fetchMallItems(), fetchMarketItems()]);
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEarnCredits = async (amount: number, description: string) => {
    if (!user) {
      toast.error('请先登录以获取积分');
      return;
    }

    // Update local state optimistically
    setCredits(prev => prev + amount);

    // Use RPC to securely add credits
    const { error } = await supabase.rpc('add_credits', {
      amount: amount,
      description: description
    });
    
    if (!error) {
      toast.success(`恭喜！${description}，获得 ${amount} 积分`);
    } else {
      console.error('Add credits error:', error);
      setCredits(prev => prev - amount); // Rollback
      toast.error('积分更新失败: ' + error.message);
    }
  };

  const handleRedeem = async (item: MallItem) => {
    if (!user) {
      toast.error('请先登录');
      return;
    }

    // Double check credits from server before redeeming
    const { data: profileData } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    const currentServerCredits = profileData?.credits || 0;

    if (currentServerCredits < item.points_cost) {
      toast.error(`积分不足 (服务器: ${currentServerCredits}, 需要: ${item.points_cost})`);
      // Sync local state
      setCredits(currentServerCredits);
      return;
    }

    const { error } = await supabase.rpc('redeem_item', { item_id: item.id, user_id: user.id });

    if (error) {
      toast.error('兑换失败: ' + error.message);
      // Re-fetch credits on error to ensure sync
      fetchCredits(user.id);
    } else {
      toast.success(`成功兑换 ${item.title}！`);
      setCredits(prev => prev - item.points_cost);
      fetchCredits(user.id);
      fetchMallItems(); // Refresh stock
    }
  };

  const handlePostItem = async () => {
    if (!user) return toast.error('请先登录');
    if (!newItem.title || !newItem.price_cny || !newItem.contact_info) return toast.error('请填写必要信息');

    const { error } = await supabase.from('marketplace_items').insert({
      seller_id: user.id,
      title: newItem.title,
      description: newItem.description,
      price_cny: Number(newItem.price_cny),
      contact_info: newItem.contact_info,
      image_url: newItem.image_url || 'https://images.unsplash.com/photo-1532635241-17e820acc59f?w=500&q=80'
    });

    if (error) {
      toast.error('发布失败');
    } else {
      toast.success('发布成功！');
      setIsPosting(false);
      setNewItem({ title: '', description: '', price_cny: '', contact_info: '', image_url: '' });
      fetchMarketItems();
    }
  };

  // AI功能函数
  const analyzeCredits = async () => {
    if (!user) return toast.error('请先登录');

    setIsAnalyzingCredits(true);
    
    try {
      const response = await getChatResponse([
        {
          role: 'system',
          content: '你是一个智能积分管理助手，专注于帮助用户优化积分使用和增长。请基于用户的积分情况，提供专业的分析和建议。',
        },
        {
          role: 'user',
          content: `我的当前积分余额是 ${credits} 分。请分析我的积分状况，提供以下内容：1. 积分使用建议，包括最佳兑换时机和商品推荐 2. 积分增长策略，如何更高效地获取积分 3. 积分使用计划，基于当前积分水平的短期和长期规划。`,
        },
      ]);
      
      setCreditAnalysis(response);
    } catch (error) {
      console.error('Failed to analyze credits:', error);
      toast.error('积分分析失败，请重试');
    } finally {
      setIsAnalyzingCredits(false);
    }
  };

  const handleEvaluateMarketItem = async () => {
    if (!selectedImage || !newItem.title) return toast.error('请上传图片并填写物品名称');

    setIsEvaluatingItem(true);
    
    try {
      const evaluation = await evaluateMarketItem(selectedImage, newItem.title);
      setItemEvaluation(evaluation ? String(evaluation) : null);
    } catch (error) {
      console.error('Failed to evaluate market item:', error);
      toast.error('物品评估失败，请重试');
    } finally {
      setIsEvaluatingItem(false);
    }
  };

  const generateProductRecommendations = async () => {
    setIsGeneratingRecommendations(true);
    
    try {
      const response = await getChatResponse([
        {
          role: 'system',
          content: '你是一个绿色消费顾问，专注于推荐环保、可持续的产品。请根据用户的需求，提供个性化的绿色产品建议。',
        },
        {
          role: 'user',
          content: '请为我推荐一些适合日常使用的环保产品，包括但不限于家居用品、个人护理、办公用品等。每个推荐请包括产品名称、环保特性、价格范围和推荐理由。',
        },
      ]);
      
      setProductRecommendations(response);
    } catch (error) {
      console.error('Failed to generate product recommendations:', error);
      toast.error('产品推荐生成失败，请重试');
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setItemEvaluation(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 py-12 px-4 md:px-6">
      <div className="container max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-primary/10 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-green-200/20 blur-[100px] rounded-full" />
          
          <div className="relative z-10 flex-1 text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              <span>让环保更有价值</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              绿色生活<span className="text-primary">中心</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl text-lg font-medium leading-relaxed">
              积分兑换好礼、闲置循环流转。每一份微小的绿色行动，都值得被奖励和延续。
            </p>
          </div>

          <div className="relative z-10">
            {user ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-primary/5 dark:bg-primary/10 p-1 rounded-3xl border border-primary/20 backdrop-blur-sm"
              >
                <div className="bg-white dark:bg-slate-800 p-6 rounded-[1.25rem] flex flex-col items-center gap-2 min-w-[180px] shadow-sm">
                  <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                    <Coins className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">当前积分余额</p>
                    <p className="text-4xl font-black text-primary tracking-tight">{credits}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-100 dark:bg-slate-800/50 px-6 py-4 rounded-2xl text-sm font-medium text-slate-500 border border-slate-200 dark:border-slate-700">
                登录后查看积分余额
              </div>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="h-14 p-1.5 bg-slate-200/50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
              {[
                { value: 'mall', label: '积分商城', icon: ShoppingBag, color: 'text-primary' },
                { value: 'market', label: '二手市集', icon: Recycle, color: 'text-blue-500' },
                { value: 'earn', label: '获取积分', icon: Zap, color: 'text-orange-500' },
                { value: 'guide', label: '消费建议', icon: Leaf, color: 'text-purple-500' }
              ].map((t) => (
                <TabsTrigger 
                  key={t.value}
                  value={t.value} 
                  className="px-6 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-bold gap-2"
                >
                  <t.icon className={`h-4 w-4 ${t.color}`} />
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* 1. 积分商城 */}
              {activeTab === 'mall' && (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-black flex items-center gap-2">
                        <Gift className="h-6 w-6 text-primary" />
                        积分商城
                      </h2>
                      <p className="text-slate-500 text-sm font-medium">使用你的绿色积分兑换精选环保好礼</p>
                    </div>
                    {user && (
                      <Button 
                        onClick={analyzeCredits} 
                        variant="outline"
                        disabled={isAnalyzingCredits}
                        className="rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-all font-bold"
                      >
                        {isAnalyzingCredits ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Brain className="h-4 w-4 mr-2" />}
                        智能积分分析
                      </Button>
                    )}
                  </div>
                  
                  {creditAnalysis && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Card className="border-none shadow-2xl shadow-primary/5 bg-gradient-to-br from-primary/5 via-white to-green-50/50 dark:from-primary/10 dark:via-slate-900 dark:to-slate-900 overflow-hidden rounded-3xl">
                        <div className="absolute top-0 right-0 p-4">
                          <TrendingUp className="h-24 w-24 text-primary/5 -rotate-12" />
                        </div>
                        <CardHeader className="relative z-10">
                          <CardTitle className="flex items-center gap-3 text-xl font-black">
                            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                              <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            积分分析与建议
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                          <div className="prose prose-slate dark:prose-invert max-w-none">
                            <div className="whitespace-pre-line text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                              {creditAnalysis}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {mallItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <MallItemCard 
                          item={item} 
                          user={user} 
                          onRedeem={handleRedeem} 
                        />
                      </motion.div>
                    ))}
                    {mallItems.length === 0 && !loading && (
                      <div className="col-span-full flex flex-col items-center justify-center py-24 text-slate-400 space-y-4 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                        <ShoppingBag className="h-12 w-12 opacity-20" />
                        <p className="font-bold">暂无商品上架</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. 二手市集 */}
              {activeTab === 'market' && (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-black flex items-center gap-2">
                        <Recycle className="h-6 w-6 text-blue-500" />
                        闲置物品交换
                      </h2>
                      <p className="text-slate-500 text-sm font-medium">让闲置物品流转起来，减少资源浪费</p>
                    </div>
                    <Button 
                      onClick={() => setIsPosting(!isPosting)} 
                      variant={isPosting ? "secondary" : "default"}
                      className="rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                      {isPosting ? '取消发布' : '发布闲置'}
                    </Button>
                  </div>

                  {isPosting && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Card className="border-2 border-dashed border-primary/20 bg-primary/5 rounded-[2rem] overflow-hidden">
                        <CardHeader>
                          <CardTitle className="text-xl font-black">发布新物品</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">物品名称</Label>
                              <Input 
                                value={newItem.title} 
                                onChange={e => setNewItem({...newItem, title: e.target.value})} 
                                placeholder="例如：9成新山地车" 
                                className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-primary/20 py-6"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">价格 (元)</Label>
                              <Input 
                                type="number" 
                                value={newItem.price_cny} 
                                onChange={e => setNewItem({...newItem, price_cny: e.target.value})} 
                                placeholder="0 表示免费赠送" 
                                className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-primary/20 py-6"
                              />
                            </div>
                            <div className="col-span-full space-y-2">
                              <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">描述</Label>
                              <Input 
                                value={newItem.description} 
                                onChange={e => setNewItem({...newItem, description: e.target.value})} 
                                placeholder="描述物品状况、新旧程度..." 
                                className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-primary/20 py-6"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">联系方式</Label>
                              <Input 
                                value={newItem.contact_info} 
                                onChange={e => setNewItem({...newItem, contact_info: e.target.value})} 
                                placeholder="微信号 / 手机号" 
                                className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-primary/20 py-6"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">图片链接 (可选)</Label>
                              <Input 
                                value={newItem.image_url} 
                                onChange={e => setNewItem({...newItem, image_url: e.target.value})} 
                                placeholder="https://..." 
                                className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-primary/20 py-6"
                              />
                            </div>
                            <div className="col-span-full space-y-3">
                              <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">上传图片评估 (可选)</Label>
                              <div className="flex flex-wrap items-center gap-4">
                                <input
                                  type="file"
                                  ref={fileInputElement}
                                  onChange={handleImageUpload}
                                  accept="image/*"
                                  className="hidden"
                                />
                                <Button 
                                  variant="outline" 
                                  onClick={() => fileInputElement.current?.click()}
                                  className="rounded-xl border-slate-200 dark:border-slate-800 hover:bg-white transition-all px-6 font-bold"
                                >
                                  <Search className="h-4 w-4 mr-2" /> 选择图片
                                </Button>
                                {selectedImage && (
                                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <img src={selectedImage} alt="Preview" className="h-10 w-10 object-cover rounded-lg" />
                                    <Button variant="ghost" size="icon" onClick={clearSelectedImage} className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                                {selectedImage && (
                                  <Button 
                                    onClick={handleEvaluateMarketItem} 
                                    variant="default"
                                    disabled={isEvaluatingItem}
                                    className="rounded-xl bg-blue-600 hover:bg-blue-700 font-bold px-6 shadow-lg shadow-blue-600/20"
                                  >
                                    {isEvaluatingItem ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Brain className="h-4 w-4 mr-2" />}
                                    智能评估
                                  </Button>
                                )}
                              </div>
                              {itemEvaluation && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-4 p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-sm"
                                >
                                  <h4 className="font-black text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    物品评估结果
                                  </h4>
                                  <div className="whitespace-pre-line text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                    {itemEvaluation}
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>
                          <Button onClick={handlePostItem} className="w-full py-8 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 active:scale-[0.98] transition-all mt-4">
                            确认发布物品
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {marketItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <MarketItemCard item={item} />
                      </motion.div>
                    ))}
                    {marketItems.length === 0 && !loading && (
                      <div className="col-span-full flex flex-col items-center justify-center py-24 text-slate-400 space-y-4 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                        <Recycle className="h-12 w-12 opacity-20" />
                        <p className="font-bold">暂无闲置物品</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. 获取积分 */}
              {activeTab === 'earn' && (
                <div className="space-y-10">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black flex items-center gap-2">
                      <Zap className="h-6 w-6 text-orange-500" />
                      获取积分
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">通过日常环保行动，赚取绿色积分奖励</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { 
                        title: '绿色出行', 
                        desc: '骑行或步行代替开车', 
                        reward: '每公里 10 积分', 
                        limit: '每日上限 100', 
                        icon: Bike, 
                        color: 'green',
                        action: () => handleEarnCredits(10, '骑行 1 公里')
                      },
                      { 
                        title: '公共交通', 
                        desc: '乘坐地铁或公交', 
                        reward: '每次 20 积分', 
                        limit: '不设上限', 
                        icon: Bus, 
                        color: 'blue',
                        action: () => handleEarnCredits(20, '乘坐公共交通')
                      },
                      { 
                        title: '垃圾回收', 
                        desc: '正确分类并投放垃圾', 
                        reward: '每公斤 50 积分', 
                        limit: '根据重量计算', 
                        icon: Recycle, 
                        color: 'orange',
                        action: () => handleEarnCredits(50, '回收物品')
                      }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card className={`group relative overflow-hidden border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-gradient-to-br from-${item.color}-50 to-white dark:from-${item.color}-950/20 dark:to-slate-900 rounded-[2rem]`}>
                          <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500`}>
                            <item.icon className="h-24 w-24" />
                          </div>
                          <CardHeader className="relative z-10 pb-2">
                            <div className={`h-14 w-14 rounded-2xl bg-${item.color}-100 dark:bg-${item.color}-900/30 text-${item.color}-600 dark:text-${item.color}-400 flex items-center justify-center mb-4 shadow-inner`}>
                              <item.icon className="h-7 w-7" />
                            </div>
                            <CardTitle className="text-xl font-black">{item.title}</CardTitle>
                            <CardDescription className="font-medium">{item.desc}</CardDescription>
                          </CardHeader>
                          <CardContent className="relative z-10 space-y-4">
                            <div className="flex flex-col gap-1">
                              <span className={`text-2xl font-black text-${item.color}-600 dark:text-${item.color}-400`}>{item.reward}</span>
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.limit}</span>
                            </div>
                            <Button 
                              onClick={item.action} 
                              className={`w-full py-6 rounded-xl bg-${item.color}-600 hover:bg-${item.color}-700 text-white font-black shadow-lg shadow-${item.color}-600/20 active:scale-[0.98] transition-all`}
                            >
                              立即打卡奖励
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-primary/10 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                    <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Info className="h-10 w-10 text-primary" />
                    </div>
                    <div className="space-y-2 text-center md:text-left">
                      <h3 className="text-xl font-black">如何获取更多积分？</h3>
                      <p className="text-slate-500 font-medium">除了上述行动，参与社区环保活动、分享环保心得、邀请好友加入绿色生活中心，都能获得丰厚的积分奖励。积分可用于兑换商城好礼或在二手市集中作为抵扣使用。</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. 消费建议 */}
              {activeTab === 'guide' && (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-black flex items-center gap-2">
                        <Leaf className="h-6 w-6 text-purple-500" />
                        绿色消费建议
                      </h2>
                      <p className="text-slate-500 text-sm font-medium">由 AI 为你定制的个性化环保产品推荐</p>
                    </div>
                    <Button 
                      onClick={generateProductRecommendations} 
                      variant="outline"
                      disabled={isGeneratingRecommendations}
                      className="rounded-xl border-purple-200 dark:border-purple-900/30 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:text-purple-600 transition-all font-bold px-6"
                    >
                      {isGeneratingRecommendations ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Brain className="h-4 w-4 mr-2" />}
                      生成个性化推荐
                    </Button>
                  </div>
                  
                  {productRecommendations && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Card className="border-none shadow-2xl shadow-purple-500/5 bg-gradient-to-br from-purple-50/50 via-white to-white dark:from-purple-900/10 dark:via-slate-900 dark:to-slate-900 overflow-hidden rounded-[2.5rem]">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3 text-xl font-black">
                            <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                              <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            AI 定制推荐方案
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-purple dark:prose-invert max-w-none">
                            <div className="whitespace-pre-line text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                              {productRecommendations}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                       { id: '1', title: "节能 LED 灯泡", desc: "比传统白炽灯节能 80%，使用寿命长达 15,000 小时。", icon: "💡", price: "¥29.9", tag: "节能", color: "yellow" },
                       { id: '2', title: "竹纤维纸巾", desc: "100% 竹浆制造，生长周期短，更环保的可持续选择。", icon: "🎋", price: "¥19.9", tag: "可再生", color: "green" },
                       { id: '3', title: "可降解垃圾袋", desc: "玉米淀粉基材，在自然环境中可完全降解，减少污染。", icon: "♻️", price: "¥15.0", tag: "可降解", color: "orange" },
                       { id: '4', title: "太阳能充电宝", desc: "利用太阳能充电，户外旅行必备，清洁能源随身带。", icon: "☀️", price: "¥199.0", tag: "清洁能源", color: "blue" },
                    ].map((item, i) => (
                       <motion.div
                         key={i}
                         whileHover={{ y: -5 }}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: i * 0.1 }}
                       >
                         <Card className="group flex flex-col h-full border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-300">
                            <div className={`h-48 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-7xl transition-transform duration-500 group-hover:scale-110`}>
                               {item.icon}
                            </div>
                            <CardHeader className="relative pb-2 space-y-3">
                               <div className="flex justify-between items-start">
                                  <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 border-none font-bold rounded-lg px-3">
                                    {item.tag}
                                  </Badge>
                               </div>
                               <CardTitle className="text-xl font-black group-hover:text-primary transition-colors">{item.title}</CardTitle>
                               <CardDescription className="text-sm font-medium leading-relaxed line-clamp-2">{item.desc}</CardDescription>
                            </CardHeader>
                            <div className="mt-auto p-6 pt-0">
                               <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                                  <span className="font-black text-xl text-slate-900 dark:text-white">{item.price}</span>
                                  <Link href={`/recommendations/product/${item.id}`}>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="rounded-xl hover:bg-white dark:hover:bg-slate-800 font-bold group/btn"
                                    >
                                       详情 <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"/>
                                    </Button>
                                  </Link>
                               </div>
                            </div>
                         </Card>
                       </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
