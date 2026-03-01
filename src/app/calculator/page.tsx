'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, Car, Zap, Utensils, Share2, BarChart, Brain, FileText } from 'lucide-react';
import { calculateCarbonFootprint, CalculationInput, CarbonResult } from '@/lib/calculator/engine';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { TransportForm } from '@/components/calculator/TransportForm';
import { EnergyForm } from '@/components/calculator/EnergyForm';
import { ConsumptionForm } from '@/components/calculator/ConsumptionForm';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { generateReductionTips } from "@/lib/ai/chat";
import { generateEcoReport } from "@/lib/ai/text";

const COLORS = ['#2E7D32', '#FF9800', '#2196F3']; // Green, Orange, Blue

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState('transport');
  const [result, setResult] = useState<CarbonResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [reductionTips, setReductionTips] = useState<string | null>(null);
  const [ecoReport, setEcoReport] = useState<string | null>(null);
  const [isGeneratingTips, setIsGeneratingTips] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [resultTab, setResultTab] = useState('summary');

  // Initial State
  const initialFormState: CalculationInput = {
    transport: {
      privateCar: { type: 'gasoline', size: 'medium', distance: 0 },
      public: { subway: 0, bus: 0, taxi: 0 },
      flight: { short: 0, medium: 0, long: 0, class: 'economy' }
    },
    energy: {
      electricity: { amount: 0, region: 'nationalAvg' },
      gas: { naturalGas: 0 }
    },
    consumption: {
      diet: 'balanced'
    }
  };

  const [formData, setFormData] = useState<CalculationInput>(initialFormState);

  const handleInputChange = (category: keyof CalculationInput, subCategory: string, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: {
          ...(prev[category] as Record<string, unknown>)[subCategory] as Record<string, unknown>,
          [field]: value
        }
      }
    }));
  };

  const calculate = async () => {
    setIsCalculating(true);
    
    // Optimized: Reduced simulated delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const res = calculateCarbonFootprint(formData);
    setResult(res);

    // Save to Supabase
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { error } = await supabase.from('carbon_records').insert({
          user_id: session.user.id,
          total_emission: res.total,
          breakdown: res.breakdown
        });

        if (error) {
           if (error.code === '23503') { // foreign_key_violation
              await supabase.from('profiles').upsert({ id: session.user.id, updated_at: new Date().toISOString() });
              // Retry
              await supabase.from('carbon_records').insert({
                user_id: session.user.id,
                total_emission: res.total,
                breakdown: res.breakdown
              });
              toast.success('计算结果已保存');
           } else {
              console.error('Save error:', error);
              toast.error('保存失败: ' + error.message);
           }
        } else {
          toast.success('计算结果已保存至云端');
        }
      } else {
        toast.info('登录后可保存您的历史记录', {
           duration: 5000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('保存过程中发生错误');
    } finally {
      setIsCalculating(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setReductionTips(null);
    setEcoReport(null);
    setFormData(initialFormState);
    setActiveTab('transport');
    setResultTab('summary');
  };

  const generateTips = async () => {
    if (!result) return;

    setIsGeneratingTips(true);
    
    try {
      const tips = await generateReductionTips(result);
      setReductionTips(tips);
      setResultTab('tips');
    } catch (error) {
      console.error('Failed to generate reduction tips:', error);
      toast.error('生成减排建议失败，请重试');
    } finally {
      setIsGeneratingTips(false);
    }
  };

  const generateReport = async () => {
    if (!result) return;

    setIsGeneratingReport(true);
    
    try {
      const report = await generateEcoReport(result);
      setEcoReport(report);
      setResultTab('report');
    } catch (error) {
      console.error('Failed to generate eco report:', error);
      toast.error('生成环保报告失败，请重试');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const getComment = (val: number) => {
    if (val < 3000) return { text: "太棒了！您是环保先锋！🌿", color: "text-primary", bg: "bg-primary/10" };
    if (val < 6000) return { text: "表现不错，还有进步空间。🌱", color: "text-orange-500", bg: "bg-orange-50" };
    return { text: "您的碳排放较高，建议参考下方建议。⚠️", color: "text-destructive", bg: "bg-destructive/10" };
  };

  const chartData = result ? [
    { name: '交通出行', value: result.breakdown.transport },
    { name: '家庭能源', value: result.breakdown.energy },
    { name: '生活消费', value: result.breakdown.consumption },
  ] : [];

  return (
    <div className="flex flex-col items-center min-h-screen relative overflow-hidden selection:bg-primary/30">
      {/* Brand Background Elements - Synchronized with Homepage */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8FDF5] via-white to-[#E8F5E2] dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30 -z-20" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10 translate-x-1/4 -translate-y-1/4 opacity-60" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-ocean/15 rounded-full blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4 opacity-50" />
      
      {/* Dynamic Animated Blobs */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-1/2 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-[80px] -z-10"
      />

      <div className="container py-10 px-4 md:px-6 max-w-6xl mx-auto relative z-10 mt-4">
        {/* Cartoon Stickers - Strategic Positioning */}
        <motion.img 
          src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20wind%20turbine%20sticker%2C%20soft%203d%20render%2C%20eco-friendly%20style%2C%20white%20background&image_size=square"
          alt="wind turbine"
          aria-label="Cute wind turbine sticker"
          className="absolute top-4 left-4 w-16 h-16 md:w-24 md:h-24 z-20 hidden lg:block hover:scale-110 transition-transform duration-300 cursor-default"
          style={{ filter: "drop-shadow(2px 2px 0 #fff) drop-shadow(-2px -2px 0 #fff) drop-shadow(2px -2px 0 #fff) drop-shadow(-2px 2px 0 #fff) drop-shadow(0 15px 25px rgba(0,0,0,0.15))" }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img 
          src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20bicycle%20sticker%2C%20soft%203d%20render%2C%20green%20transport%2C%20white%20background&image_size=square"
          alt="bicycle"
          aria-label="Cute bicycle sticker"
          className="absolute bottom-4 right-4 w-14 h-14 md:w-20 md:h-20 z-20 hidden lg:block hover:scale-110 transition-transform duration-300 cursor-default"
          style={{ filter: "drop-shadow(2px 2px 0 #fff) drop-shadow(-2px -2px 0 #fff) drop-shadow(2px -2px 0 #fff) drop-shadow(-2px 2px 0 #fff) drop-shadow(0 15px 25px rgba(0,0,0,0.15))" }}
          animate={{ x: [0, 8, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="text-center mb-12 space-y-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-primary/20 bg-white/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-primary shadow-sm mb-2"
          >
            <BarChart className="mr-2 h-3.5 w-3.5" />
            <span className="tracking-wide">基于 IPCC 国际气候科学标准</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl text-slate-800 dark:text-slate-100"
          >
            专业版 <span className="text-gradient-brand decoration-wavy underline decoration-primary/20 underline-offset-[8px]">碳足迹计算器</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg font-medium leading-relaxed"
          >
            追踪您的生活碳足迹，通过精准评估开启属于您的绿色未来之旅。
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Form Card - High Fidelity */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-7"
          >
            <Card className="border-0 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-1 ring-1 ring-black/[0.03]">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="flex justify-between items-center text-2xl font-black tracking-tight">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2.5 rounded-[1.25rem] shadow-inner">
                      <BarChart className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-slate-800 dark:text-slate-100">📊 数据分析录入</span>
                  </div>
                  <Button 
                   variant="outline" 
                   size="sm" 
                   onClick={resetForm} 
                   disabled={isCalculating} 
                   className="rounded-full px-4 h-10 border-primary/20 hover:bg-primary/5 font-bold transition-all hover:scale-105 active:scale-95"
                  >
                     <RotateCcw className="h-4 w-4 mr-2" /> 重置
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-2">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-8 h-14 bg-slate-100/60 dark:bg-slate-800/60 rounded-[1.5rem] p-1.5 ring-1 ring-black/5">
                    <TabsTrigger value="transport" className="rounded-[1.25rem] flex items-center justify-center gap-2 data-[state=active]:text-primary data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-400 font-black text-sm"><Car className="h-4 w-4" /> 交通出行</TabsTrigger>
                    <TabsTrigger value="energy" className="rounded-[1.25rem] flex items-center justify-center gap-2 data-[state=active]:text-orange-500 data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-400 font-black text-sm"><Zap className="h-4 w-4" /> 家庭能源</TabsTrigger>
                    <TabsTrigger value="consumption" className="rounded-[1.25rem] flex items-center justify-center gap-2 data-[state=active]:text-blue-500 data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-400 font-black text-sm"><Utensils className="h-4 w-4" /> 生活消费</TabsTrigger>
                  </TabsList>

                  <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TabsContent value="transport" className="mt-0 outline-none">
                          <TransportForm 
                            data={formData.transport} 
                            onChange={handleInputChange} 
                            onNext={() => setActiveTab('energy')} 
                          />
                        </TabsContent>

                        <TabsContent value="energy" className="mt-0 outline-none">
                          <EnergyForm 
                            data={formData.energy} 
                            onChange={handleInputChange} 
                            onNext={() => setActiveTab('consumption')}
                            onPrev={() => setActiveTab('transport')}
                          />
                        </TabsContent>

                        <TabsContent value="consumption" className="mt-0 outline-none">
                          <ConsumptionForm 
                            data={formData.consumption}
                            onDietChange={(val) => setFormData(prev => ({...prev, consumption: { diet: val as "meatHeavy" | "balanced" | "vegetarian" }}))}
                            onPrev={() => setActiveTab('energy')}
                            onCalculate={calculate}
                            isCalculating={isCalculating}
                          />
                        </TabsContent>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Display Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-5 space-y-8"
          >
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.5, type: "spring", damping: 25 }}
              >
                <Card className="border-0 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] rounded-[2.5rem] overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-1 ring-1 ring-primary/20">
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="flex flex-col gap-4">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2.5 rounded-[1.25rem] shadow-inner">
                            <BarChart className="h-6 w-6 text-primary" />
                          </div>
                          <span className="text-xl font-black text-slate-800 dark:text-slate-100">📉 评估报告</span>
                        </div>
                        <div className="flex gap-2">
                           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-slate-100/50 hover:bg-slate-200 transition-colors">
                            <Share2 className="h-4 w-4 text-slate-600" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={generateTips}
                          disabled={isGeneratingTips || isGeneratingReport}
                          className="flex-1 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-black h-10 transition-all hover:scale-[1.02] active:scale-98 text-xs"
                        >
                          <Brain className="mr-1.5 h-4 w-4" /> 智能建议
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={generateReport}
                          disabled={isGeneratingReport || isGeneratingTips}
                          className="flex-1 rounded-xl bg-accent-ocean/15 hover:bg-accent-ocean/25 text-accent-ocean-dark font-black h-10 transition-all hover:scale-[1.02] active:scale-98 text-xs"
                        >
                          <FileText className="mr-1.5 h-4 w-4" /> 详尽报告
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-2">
                    <Tabs value={resultTab} onValueChange={setResultTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-3 h-12 bg-slate-100/60 dark:bg-slate-800/60 rounded-[1.25rem] p-1.5 mb-8 ring-1 ring-black/5">
                        <TabsTrigger value="summary" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md font-black transition-all text-xs">概览</TabsTrigger>
                        <TabsTrigger value="tips" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md font-black transition-all text-xs">建议</TabsTrigger>
                        <TabsTrigger value="report" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md font-black transition-all text-xs">详报</TabsTrigger>
                      </TabsList>
                      <TabsContent value="summary" className="mt-0 outline-none">
                        <div className="text-center">
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="relative inline-block mb-6"
                          >
                            <div className="text-5xl font-black text-primary mb-1 tracking-tighter tabular-nums drop-shadow-sm">
                              {result.total}
                            </div>
                            <div className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">kg CO₂e / 年度</div>
                            <div className="absolute -inset-6 bg-primary/10 rounded-full blur-2xl -z-10 animate-pulse" />
                          </motion.div>
                          
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className={`inline-flex items-center px-4 py-2 rounded-xl font-black text-sm mb-8 ${getComment(result.total).color} ${getComment(result.total).bg} shadow-sm border border-white/50 backdrop-blur-sm`}
                          >
                            {getComment(result.total).text}
                          </motion.div>

                          <div className="h-[300px] w-full relative mb-6">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={chartData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={85}
                                  outerRadius={110}
                                  fill="#8884d8"
                                  paddingAngle={10}
                                  dataKey="value"
                                  stroke="none"
                                >
                                  {chartData.map((entry, index) => (
                                    <Cell 
                                      key={`cell-${index}`} 
                                      fill={COLORS[index % COLORS.length]} 
                                      className="hover:opacity-80 transition-opacity cursor-pointer outline-none filter drop-shadow-md"
                                    />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px -12px rgba(0,0,0,0.15)', padding: '16px' }}
                                />
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-800 dark:fill-slate-100 font-black text-2xl tracking-tight">
                                   碳排分布
                                </text>
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-10">
                             <div className="flex flex-col items-center p-4 rounded-[1.5rem] bg-white/60 border border-slate-100 shadow-sm transition-all hover:shadow-md">
                               <div className="w-3 h-3 rounded-full bg-[#2E7D32] mb-3 shadow-[0_0_10px_rgba(46,125,50,0.3)]"></div>
                               <div className="text-xs font-black text-muted-foreground mb-1">交通</div>
                               <div className="text-lg font-black tabular-nums text-slate-800">{((result.breakdown.transport / result.total) * 100).toFixed(0)}%</div>
                             </div>
                             <div className="flex flex-col items-center p-4 rounded-[1.5rem] bg-white/60 border border-slate-100 shadow-sm transition-all hover:shadow-md">
                               <div className="w-3 h-3 rounded-full bg-[#FF9800] mb-3 shadow-[0_0_10px_rgba(255,152,0,0.3)]"></div>
                               <div className="text-xs font-black text-muted-foreground mb-1">能源</div>
                               <div className="text-lg font-black tabular-nums text-slate-800">{((result.breakdown.energy / result.total) * 100).toFixed(0)}%</div>
                             </div>
                             <div className="flex flex-col items-center p-4 rounded-[1.5rem] bg-white/60 border border-slate-100 shadow-sm transition-all hover:shadow-md">
                               <div className="w-3 h-3 rounded-full bg-[#2196F3] mb-3 shadow-[0_0_10px_rgba(33,150,243,0.3)]"></div>
                               <div className="text-xs font-black text-muted-foreground mb-1">消费</div>
                               <div className="text-lg font-black tabular-nums text-slate-800">{((result.breakdown.consumption / result.total) * 100).toFixed(0)}%</div>
                             </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="tips" className="mt-0 outline-none">
                        <div className="bg-white/50 dark:bg-black/20 p-8 rounded-[2.5rem] text-left border border-white/60 shadow-inner min-h-[350px] relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Brain className="w-32 h-32" />
                          </div>
                          {reductionTips ? (
                            <div className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed font-bold relative z-10 text-base">
                              {reductionTips}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground/60">
                              <Brain className="h-16 w-16 mb-6 animate-bounce-slight text-primary/40" />
                              <p className="font-black text-lg">点击「智能建议」按钮获取方案</p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      <TabsContent value="report" className="mt-0 outline-none">
                        <div className="bg-white/50 dark:bg-black/20 p-8 rounded-[2.5rem] text-left border border-white/60 shadow-inner min-h-[350px] relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-5">
                            <FileText className="w-32 h-32" />
                          </div>
                          {ecoReport ? (
                            <div className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed font-bold relative z-10 text-base">
                              {ecoReport}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground/60">
                              <FileText className="h-16 w-16 mb-6 animate-bounce-slight text-accent-ocean-dark/40" />
                              <p className="font-black text-lg">点击「详尽报告」按钮生成详情</p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <Card className="h-full min-h-[600px] flex items-center justify-center border-0 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[3rem] bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl relative overflow-hidden group ring-1 ring-black/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-ocean/10 -z-10 group-hover:scale-110 transition-transform duration-1000" />
                  <div className="text-center p-12 relative z-10">
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="bg-white shadow-2xl w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 group-hover:rotate-12 transition-transform duration-700 relative"
                    >
                      <BarChart className="h-16 w-16 text-primary" strokeWidth={2.5} />
                      <div className="absolute -top-2 -right-2 bg-accent-warm w-8 h-8 rounded-full border-4 border-white shadow-lg animate-bounce" />
                    </motion.div>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-6 tracking-tight">准备好开启绿色旅程了吗？</h3>
                    <p className="max-w-sm mx-auto text-muted-foreground font-bold text-lg leading-relaxed mb-10 opacity-80">
                      请在左侧填入您的生活习惯数据，我们将立即为您生成专属的年度碳排放分析报告。
                    </p>
                    <div className="flex justify-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse" />
                      <div className="w-3 h-3 rounded-full bg-primary/60 animate-pulse delay-150" />
                      <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse delay-300" />
                    </div>
                  </div>
                  
                  {/* Decorative illustration - Optimized Positioning */}
                  <motion.img 
                    src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20earth%20character%20meditating%2C%20peaceful%2C%20eco-friendly%20style%2C%20soft%203d%20render%2C%20white%20background&image_size=square"
                    className="absolute -bottom-15 -right-12 w-56 h-56 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000 group-hover:scale-110"
                    animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ filter: "drop-shadow(2px 2px 0 #fff) drop-shadow(-2px -2px 0 #fff) drop-shadow(0 20px 30px rgba(0,0,0,0.1))" }}
                  />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  </div>
  );
}
