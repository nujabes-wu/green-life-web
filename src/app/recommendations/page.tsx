'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ShoppingBag, Recycle, Coins, Bike, Bus, Leaf, ArrowUpRight } from 'lucide-react';
import { MallItem, MarketItem } from "@/types";
import { MallItemCard } from "@/components/recommendations/MallItemCard";
import { MarketItemCard } from "@/components/recommendations/MarketItemCard";

export default function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState('mall');
  const [credits, setCredits] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
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

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await checkUser();
      // Fetch items in parallel
      await Promise.all([fetchMallItems(), fetchMarketItems()]);
      setLoading(false);
    };
    init();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      fetchCredits(session.user.id);
    }
  };

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

  const fetchMallItems = async () => {
    const { data } = await supabase.from('mall_items').select('*').gt('stock', 0);
    if (data) setMallItems(data);
  };

  const fetchMarketItems = async () => {
    const { data } = await supabase.from('marketplace_items').select('*').eq('status', 'active').order('created_at', { ascending: false });
    if (data) setMarketItems(data);
  };

  const handleEarnCredits = async (amount: number, description: string) => {
    if (!user) {
      toast.error('请先登录以获取积分');
      return;
    }

    // Update local state optimistically
    setCredits(prev => prev + amount);

    const { error } = await supabase.from('profiles').update({ credits: credits + amount }).eq('id', user.id);
    
    if (!error) {
      await supabase.from('credit_transactions').insert({
        user_id: user.id,
        amount: amount,
        type: 'earn',
        description: description
      });
      toast.success(`恭喜！${description}，获得 ${amount} 积分`);
    } else {
      setCredits(prev => prev - amount); // Rollback
      toast.error('积分更新失败');
    }
  };

  const handleRedeem = async (item: MallItem) => {
    if (!user) {
      toast.error('请先登录');
      return;
    }
    if (credits < item.points_cost) {
      toast.error('积分不足');
      return;
    }

    const { error } = await supabase.rpc('redeem_item', { item_id: item.id, user_id: user.id });

    if (error) {
      toast.error('兑换失败: ' + error.message);
    } else {
      toast.success(`成功兑换 ${item.title}！`);
      setCredits(prev => prev - item.points_cost);
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

  return (
    <div className="container py-12 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="relative mb-12 text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">绿色生活中心</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          积分兑换、二手循环，让每一次环保行动都更有价值。
        </p>

        <div className="absolute top-0 right-0">
          {user ? (
             <Card className="bg-white/50 backdrop-blur-sm border-primary/20 shadow-sm shadow-primary/5">
               <CardContent className="p-2 px-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Coins className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider leading-none mb-0.5">积分</p>
                    <p className="text-lg font-black text-primary tracking-tight leading-none">{credits}</p>
                  </div>
               </CardContent>
             </Card>
          ) : (
            <div className="bg-muted/50 px-4 py-2 rounded-full text-xs text-muted-foreground border border-muted">
              登录后查看积分余额
            </div>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-muted/30 p-1 rounded-full">
            <TabsTrigger value="mall" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300">
              <ShoppingBag className="h-4 w-4 mr-2"/> 积分商城
            </TabsTrigger>
            <TabsTrigger value="market" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-dopamine-blue data-[state=active]:shadow-sm transition-all duration-300">
              <Recycle className="h-4 w-4 mr-2"/> 二手市集
            </TabsTrigger>
            <TabsTrigger value="earn" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-dopamine-orange data-[state=active]:shadow-sm transition-all duration-300">
              <Leaf className="h-4 w-4 mr-2"/> 获取积分
            </TabsTrigger>
            <TabsTrigger value="guide" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-dopamine-purple data-[state=active]:shadow-sm transition-all duration-300">
              <ArrowUpRight className="h-4 w-4 mr-2"/> 消费建议
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 1. 积分商城 */}
        <TabsContent value="mall">
           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {mallItems.map(item => (
               <MallItemCard 
                  key={item.id} 
                  item={item} 
                  user={user} 
                  onRedeem={handleRedeem} 
               />
             ))}
             {mallItems.length === 0 && !loading && (
               <div className="col-span-full text-center py-20 text-muted-foreground">
                 暂无商品上架
               </div>
             )}
           </div>
        </TabsContent>

        {/* 2. 二手市集 */}
        <TabsContent value="market">
           <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">闲置物品交换</h2>
              <Button onClick={() => setIsPosting(!isPosting)} variant={isPosting ? "secondary" : "default"}>
                 {isPosting ? '取消发布' : '发布闲置'}
              </Button>
           </div>

           {isPosting && (
             <Card className="mb-8 border-dashed border-2 bg-muted/30">
               <CardHeader><CardTitle>发布新物品</CardTitle></CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label>物品名称</Label>
                       <Input value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} placeholder="例如：9成新山地车" />
                    </div>
                    <div className="space-y-2">
                       <Label>价格 (元)</Label>
                       <Input type="number" value={newItem.price_cny} onChange={e => setNewItem({...newItem, price_cny: e.target.value})} placeholder="0 表示免费赠送" />
                    </div>
                    <div className="col-span-full space-y-2">
                       <Label>描述</Label>
                       <Input value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} placeholder="描述物品状况、新旧程度..." />
                    </div>
                    <div className="space-y-2">
                       <Label>联系方式</Label>
                       <Input value={newItem.contact_info} onChange={e => setNewItem({...newItem, contact_info: e.target.value})} placeholder="微信号 / 手机号" />
                    </div>
                    <div className="space-y-2">
                       <Label>图片链接 (可选)</Label>
                       <Input value={newItem.image_url} onChange={e => setNewItem({...newItem, image_url: e.target.value})} placeholder="https://..." />
                    </div>
                  </div>
                  <Button onClick={handlePostItem} className="w-full">确认发布</Button>
               </CardContent>
             </Card>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {marketItems.map(item => (
               <MarketItemCard key={item.id} item={item} />
             ))}
             {marketItems.length === 0 && !loading && (
               <div className="col-span-full text-center py-20 text-muted-foreground">
                 暂无闲置物品
               </div>
             )}
           </div>
        </TabsContent>

        {/* 3. 获取积分 */}
        <TabsContent value="earn">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="group hover:shadow-xl transition-all duration-300 border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-white dark:from-green-950/30 dark:to-slate-900">
                 <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Bike className="h-6 w-6"/>
                    </div>
                    <CardTitle className="flex items-center gap-2">绿色出行</CardTitle>
                    <CardDescription>骑行或步行代替开车</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <p className="text-sm text-muted-foreground mb-6">每公里可获得 10 积分，每日上限 100 积分。</p>
                    <Button onClick={() => handleEarnCredits(10, '骑行 1 公里')} className="w-full bg-green-600 hover:bg-green-700 font-bold shadow-lg shadow-green-600/20">
                       打卡 +10
                    </Button>
                 </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900">
                 <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                       <Bus className="h-6 w-6"/>
                    </div>
                    <CardTitle className="flex items-center gap-2">公共交通</CardTitle>
                    <CardDescription>乘坐地铁或公交</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <p className="text-sm text-muted-foreground mb-6">每次乘坐可获得 20 积分。</p>
                    <Button onClick={() => handleEarnCredits(20, '乘坐公共交通')} className="w-full bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-600/20">
                       打卡 +20
                    </Button>
                 </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-orange-200 dark:border-orange-900 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/30 dark:to-slate-900">
                 <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                       <Recycle className="h-6 w-6"/>
                    </div>
                    <CardTitle className="flex items-center gap-2">垃圾回收</CardTitle>
                    <CardDescription>正确分类并投放垃圾</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <p className="text-sm text-muted-foreground mb-6">每公斤可回收物获得 50 积分。</p>
                    <Button onClick={() => handleEarnCredits(50, '回收物品')} className="w-full bg-orange-600 hover:bg-orange-700 font-bold shadow-lg shadow-orange-600/20">
                       打卡 +50
                    </Button>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>

        {/* 4. 消费建议 (原内容) */}
        <TabsContent value="guide">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
                { title: "节能 LED 灯泡", desc: "比传统白炽灯节能 80%，使用寿命长达 15,000 小时。", icon: "💡", price: "¥29.9", tag: "节能" },
                { title: "竹纤维纸巾", desc: "100% 竹浆制造，生长周期短，更环保的可持续选择。", icon: "🎋", price: "¥19.9", tag: "可再生" },
                { title: "可降解垃圾袋", desc: "玉米淀粉基材，在自然环境中可完全降解，减少白色污染。", icon: "♻️", price: "¥15.0", tag: "可降解" },
                { title: "太阳能充电宝", desc: "利用太阳能充电，户外旅行必备，清洁能源随身带。", icon: "☀️", price: "¥199.0", tag: "清洁能源" },
             ].map((item, i) => (
                <Card key={i} className="group hover:shadow-xl transition-all duration-300 border-primary/10 overflow-hidden">
                   <CardHeader className="relative pb-0">
                      <div className="absolute top-4 right-4">
                         <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{item.tag}</Badge>
                      </div>
                      <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                         {item.icon}
                      </div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                   </CardHeader>
                   <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                   </CardContent>
                   <CardFooter className="flex justify-between items-center bg-muted/30 py-3 px-6 mt-4">
                      <span className="font-bold text-lg text-primary">{item.price}</span>
                      <Button variant="ghost" size="sm" className="hover:text-primary hover:bg-primary/10">
                         查看详情 <ArrowUpRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"/>
                      </Button>
                   </CardFooter>
                </Card>
             ))}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
