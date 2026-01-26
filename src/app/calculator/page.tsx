'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, Car, Zap, Utensils, Share2, BarChart } from 'lucide-react';
import { calculateCarbonFootprint, CalculationInput } from '@/lib/calculator/engine';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { TransportForm } from '@/components/calculator/TransportForm';
import { EnergyForm } from '@/components/calculator/EnergyForm';
import { ConsumptionForm } from '@/components/calculator/ConsumptionForm';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#2E7D32', '#FF9800', '#2196F3']; // Green, Orange, Blue

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState('transport');
  const [result, setResult] = useState<{ total: number, breakdown: any } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

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

  const handleInputChange = (category: keyof CalculationInput, subCategory: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: {
          ...(prev[category] as any)[subCategory],
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
    setFormData(initialFormState);
    setActiveTab('transport');
  };

  const getComment = (val: number) => {
    if (val < 3000) return { text: "太棒了！您是环保先锋！🌿", color: "text-primary" };
    if (val < 6000) return { text: "表现不错，还有进步空间。🌱", color: "text-accent" };
    return { text: "您的碳排放较高，建议参考下方建议。⚠️", color: "text-destructive" };
  };

  const chartData = result ? [
    { name: '交通出行', value: result.breakdown.transport },
    { name: '家庭能源', value: result.breakdown.energy },
    { name: '生活消费', value: result.breakdown.consumption },
  ] : [];

  return (
    <div className="container py-12 px-4 md:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-10 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">专业版碳足迹计算器</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          基于 IPCC 国际标准与国内电网数据，为您提供精准的碳排放评估。
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form */}
        <Card className="lg:col-span-7 shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
               <span>📊 数据录入</span>
               <Button variant="outline" size="sm" onClick={resetForm} disabled={isCalculating}>
                  <RotateCcw className="h-4 w-4 mr-2" /> 重置
               </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="transport" className="flex items-center gap-2 data-[state=active]:text-primary"><Car className="h-4 w-4" /> 交通出行</TabsTrigger>
                <TabsTrigger value="energy" className="flex items-center gap-2 data-[state=active]:text-dopamine-orange"><Zap className="h-4 w-4" /> 家庭能源</TabsTrigger>
                <TabsTrigger value="consumption" className="flex items-center gap-2 data-[state=active]:text-dopamine-blue"><Utensils className="h-4 w-4" /> 生活消费</TabsTrigger>
              </TabsList>

              <TabsContent value="transport">
                <TransportForm 
                  data={formData.transport} 
                  onChange={handleInputChange} 
                  onNext={() => setActiveTab('energy')} 
                />
              </TabsContent>

              <TabsContent value="energy">
                <EnergyForm 
                  data={formData.energy} 
                  onChange={handleInputChange} 
                  onNext={() => setActiveTab('consumption')}
                  onPrev={() => setActiveTab('transport')}
                />
              </TabsContent>

              <TabsContent value="consumption">
                <ConsumptionForm 
                  data={formData.consumption}
                  onDietChange={(val) => setFormData(prev => ({...prev, consumption: { diet: val }}))}
                  onPrev={() => setActiveTab('energy')}
                  onCalculate={calculate}
                  isCalculating={isCalculating}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Results Display */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-lg border-primary/20 bg-gradient-to-br from-white to-green-50 dark:from-slate-900 dark:to-slate-800">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>📉 年度碳排放分析</span>
                      <Button variant="ghost" size="sm">
                        <Share2 className="mr-2 h-4 w-4" /> 分享
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <motion.div 
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="text-5xl font-extrabold text-primary mb-2"
                      >
                        {result.total} <span className="text-xl font-normal text-muted-foreground">kg CO₂e</span>
                      </motion.div>
                      <p className={`font-medium mb-8 ${getComment(result.total).color}`}>
                        {getComment(result.total).text}
                      </p>

                      <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground font-bold">
                               构成
                            </text>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex justify-center gap-4 text-sm text-muted-foreground mt-4">
                         <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-[#2E7D32] mr-1"></div> 交通</div>
                         <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-[#FF9800] mr-1"></div> 能源</div>
                         <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-[#2196F3] mr-1"></div> 消费</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="h-full min-h-[400px] flex items-center justify-center border-dashed bg-muted/10">
                  <div className="text-center text-muted-foreground p-8">
                    <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">等待数据录入</h3>
                    <p className="max-w-xs mx-auto">请在左侧填写详细数据，以获取最精准的分析报告。</p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
