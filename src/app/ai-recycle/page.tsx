'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  X,
  RefreshCw,
  Recycle,
  Leaf,
  Brain,
  Trash2,
  HelpCircle,
  Loader2
} from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
// 核心助手机器人组件
import SmartTrashBot from '@/components/cartoons/SmartTrashBot';
import RecycleElf from '@/components/cartoons/RecycleElf';
import LeafSpirit from '@/components/cartoons/LeafSpirit';
import { analyzeRecyclingItem } from '@/lib/ai/image';

// 定义回收分类接口
interface RecycleCategory {
  name: string;
  type: string;
  color: string;
  advice: string;
  icon: ReactNode;
  probability?: number;
  detailedAnalysis?: string;
}

// 定义回收分类映射
const RECYCLE_MAP: Record<string, RecycleCategory> = {
  'water bottle': { name: '塑料瓶', type: '可回收物', color: 'bg-blue-100 text-blue-700 border-blue-200', advice: '请倒空瓶内液体，压扁后投入蓝色回收桶。', icon: <CheckCircle2 className="h-6 w-6 text-blue-600" /> },
  'carton': { name: '纸箱', type: '可回收物', color: 'bg-blue-100 text-blue-700 border-blue-200', advice: '请拆开压平，保持干燥，投入纸类回收箱。', icon: <CheckCircle2 className="h-6 w-6 text-blue-600" /> },
  'banana': { name: '香蕉皮', type: '厨余垃圾', color: 'bg-green-100 text-green-700 border-green-200', advice: '属于易腐垃圾，请沥干水分投入绿色垃圾桶。', icon: <Trash2 className="h-6 w-6 text-green-600" /> },
  'orange': { name: '橘子皮', type: '厨余垃圾', color: 'bg-green-100 text-green-700 border-green-200', advice: '属于易腐垃圾，请沥干水分投入绿色垃圾桶。', icon: <Trash2 className="h-6 w-6 text-green-600" /> },
  'apple': { name: '苹果核', type: '厨余垃圾', color: 'bg-green-100 text-green-700 border-green-200', advice: '属于易腐垃圾，请沥干水分投入绿色垃圾桶。', icon: <Trash2 className="h-6 w-6 text-green-600" /> },
  'battery': { name: '废旧电池', type: '有害垃圾', color: 'bg-red-100 text-red-700 border-red-200', advice: '含有重金属，请务必投入红色有害垃圾收集容器。', icon: <AlertCircle className="h-6 w-6 text-red-600" /> },
  'paper towel': { name: '废纸巾', type: '其他垃圾', color: 'bg-gray-100 text-gray-700 border-gray-200', advice: '受污染纸张无法回收，请投入灰色其他垃圾桶。', icon: <HelpCircle className="h-6 w-6 text-gray-600" /> },
  'coffee cup': { name: '咖啡杯', type: '其他垃圾', color: 'bg-gray-100 text-gray-700 border-gray-200', advice: '一次性纸杯通常含有塑料淋膜，难以回收，建议投入其他垃圾桶。', icon: <HelpCircle className="h-6 w-6 text-gray-600" /> },
  'plastic bag': { name: '塑料袋', type: '其他垃圾', color: 'bg-gray-100 text-gray-700 border-gray-200', advice: '污损的塑料袋难以回收，建议投入其他垃圾桶。', icon: <HelpCircle className="h-6 w-6 text-gray-600" /> },
};

// 默认未知分类
const UNKNOWN_CATEGORY: RecycleCategory = { name: '未知物品', type: '需人工判断', color: 'bg-gray-100 text-gray-700 border-gray-200', advice: 'AI 暂时无法识别此物品，请参考当地分类指南。', icon: <HelpCircle className="h-6 w-6 text-gray-600" /> };

// 卡片悬停动画
const cardHoverAnimation = {
  scale: 1.02,
  transition: { duration: 0.2, ease: "easeOut" }
};

export default function AIRecyclePage() {
  const [assistantEmotion, setAssistantEmotion] = useState<'happy' | 'thinking' | 'surprise' | 'sleep'>('happy');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<RecycleCategory | null>(null);
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [modelLoading, setModelLoading] = useState(true);
  const [modelError, setModelError] = useState(false);
  const [useAdvancedAI, setUseAdvancedAI] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis');
  const [carbonOffset, setCarbonOffset] = useState(12.5);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // 检查 API Key
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_SILICONFLOW_API_KEY;
    if (!apiKey) {
      setApiKeyMissing(true);
      setUseAdvancedAI(false);
    } else {
      setUseAdvancedAI(true);
    }
  }, []);

  // 加载模型
  useEffect(() => {
    async function loadModel() {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
        setModelLoading(false);
      } catch (error) {
        console.error('Failed to load model:', error);
        try {
          await tf.setBackend('cpu');
          await tf.ready();
          const loadedModel = await mobilenet.load();
          setModel(loadedModel);
          setModelLoading(false);
        } catch (fallbackError) {
          console.error('Fallback failed:', fallbackError);
          setModelError(true);
          setModelLoading(false);
        }
      }
    }
    loadModel();
  }, []);

  // 模拟助手心情变化
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnalyzing && !selectedImage) {
        setAssistantEmotion(prev => prev === 'happy' ? 'sleep' : 'happy');
      }
    }, 10000);
    return () => clearInterval(timer);
  }, [isAnalyzing, selectedImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setAssistantEmotion('surprise');
        toast.success('图片上传成功！');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || (!model && !useAdvancedAI)) return;

    setIsAnalyzing(true);
    setAssistantEmotion('thinking');
    
    try {
      if (useAdvancedAI) {
        const analysisResult = await analyzeRecyclingItem(selectedImage);
        
        const itemNameMatch = analysisResult.match(/物品名称[:：]\s*([^\n]+)/);
        const recycleTypeMatch = analysisResult.match(/分类类型[:：]\s*([^\n]+)/);
        const adviceMatch = analysisResult.match(/【回收建议】[\s\S]*?预处理方法[:：]\s*([^\n]+)[\s\S]*?投放方式[:：]\s*([^\n]+)/);
        
        const itemName = itemNameMatch ? itemNameMatch[1].trim().replace(/[\[\]]/g, '') : '未知物品';
        const recycleType = recycleTypeMatch ? recycleTypeMatch[1].trim().replace(/[\[\]]/g, '') : '需人工判断';
        
        let advice = '请参考下方详细分析中的回收建议';
        if (adviceMatch) {
          advice = `预处理：${adviceMatch[1].trim().replace(/[\[\]]/g, '')}\n投放：${adviceMatch[2].trim().replace(/[\[\]]/g, '')}`;
        }
        
        let color = 'bg-gray-100 text-gray-700 border-gray-200';
        let icon = <HelpCircle className="h-6 w-6 text-gray-600" />;
        
        if (recycleType.includes('可回收')) {
          color = 'bg-blue-100 text-blue-700 border-blue-200';
          icon = <CheckCircle2 className="h-6 w-6 text-blue-600" />;
        } else if (recycleType.includes('厨余') || recycleType.includes('易腐')) {
          color = 'bg-green-100 text-green-700 border-green-200';
          icon = <Trash2 className="h-6 w-6 text-green-600" />;
        } else if (recycleType.includes('有害')) {
          color = 'bg-red-100 text-red-700 border-red-200';
          icon = <AlertCircle className="h-6 w-6 text-red-600" />;
        }
        
        const finalResult: RecycleCategory = {
          name: itemName,
          type: recycleType,
          color,
          advice,
          icon,
          detailedAnalysis: analysisResult,
        };
        setResult(finalResult);
        
        // 如果是可回收物，增加减碳数值
        if (finalResult.type.includes('可回收')) {
          const increment = Number((Math.random() * 0.2 + 0.1).toFixed(2));
          setCarbonOffset(prev => Number((prev + increment).toFixed(2)));
          toast.success(`识别成功！为您贡献了 ${increment}kg 减碳量 🌿`);
        } else {
          toast.success('AI 识别完成！');
        }
      } else {
        if (!model || !imageRef.current) return;
        const predictions = await model.classify(imageRef.current);

        if (predictions && predictions.length > 0) {
          let match = null;
          let detectedName = predictions[0].className;

          for (const pred of predictions) {
            const names = pred.className.toLowerCase().split(', ');
            for (const name of names) {
               for (const key in RECYCLE_MAP) {
                  if (name.includes(key)) {
                     match = RECYCLE_MAP[key];
                     detectedName = match.name;
                     break;
                  }
               }
               if (match) break;
            }
            if (match) break;
          }

          let finalResult: RecycleCategory;
          if (match) {
            finalResult = { ...match, probability: predictions[0].probability };
          } else {
             finalResult = {
                ...UNKNOWN_CATEGORY,
                name: `可能是: ${detectedName.split(',')[0]}`,
                probability: predictions[0].probability
             };
          }
          setResult(finalResult);

          // 如果是可回收物，增加减碳数值
          if (finalResult.type.includes('可回收')) {
            const increment = Number((Math.random() * 0.15 + 0.05).toFixed(2));
            setCarbonOffset(prev => Number((prev + increment).toFixed(2)));
            toast.success(`识别成功！为您贡献了 ${increment}kg 减碳量 🌿`);
          } else {
            toast.success('AI 识别完成！');
          }
        } else {
          setResult(UNKNOWN_CATEGORY);
        }
      }
      setAssistantEmotion('happy');
    } catch (error) {
      console.error('Analysis failed:', error);
      setAssistantEmotion('surprise');
      toast.error('识别失败，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
    setAssistantEmotion('happy');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 text-center md:text-left"
          >
            <div className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4">
              <Recycle className="mr-2 h-4 w-4" />
              <span>智能分类 科技环保</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">
              AI 智能回收助手
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
              不确定如何处理您的废弃物？拍张照片，让我来告诉您正确的分类方式和回收建议。
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-48 h-48 md:w-64 md:h-64 relative"
          >
            <SmartTrashBot emotion={assistantEmotion} className="w-full h-full" />
            <motion.div 
              className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-lg border border-emerald-100 dark:border-emerald-900/50"
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {assistantEmotion === 'happy' ? '你好！我是小绿' : 
                 assistantEmotion === 'thinking' ? '正在思考中...' :
                 assistantEmotion === 'surprise' ? '哇！新发现' : '呼呼...' }
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Recognition Card */}
          <Card className="lg:col-span-2 border-0 shadow-xl rounded-[2.5rem] overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-emerald-100/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-lg">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>智能识别</CardTitle>
                  <CardDescription>支持相机拍摄或上传图片进行 AI 分析</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {!selectedImage ? (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-emerald-200 dark:border-emerald-800 rounded-[2rem] p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors group h-[300px]"
                >
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">点击上传图片</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-center">
                    支持 JPG, PNG, WebP 格式
                  </p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-slate-100 dark:bg-slate-800 h-[400px]">
                    <img 
                      ref={imageRef}
                      src={selectedImage} 
                      alt="Selected item" 
                      className="w-full h-full object-contain" 
                      crossOrigin="anonymous"
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-4 right-4 rounded-full"
                      onClick={resetAnalysis}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Brain className={`h-5 w-5 ${apiKeyMissing ? 'text-slate-400' : 'text-purple-500'}`} />
                          <span className={`text-sm font-bold ${apiKeyMissing ? 'text-slate-400' : ''}`}>高级AI模式</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={useAdvancedAI} 
                          disabled={apiKeyMissing}
                          onChange={(e) => setUseAdvancedAI(e.target.checked)}
                          className={`w-10 h-5 rounded-full bg-slate-300 checked:bg-green-500 appearance-none transition-colors cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-transform checked:after:translate-x-5 ${apiKeyMissing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                      {apiKeyMissing && (
                        <p className="text-[10px] text-orange-500 font-medium">
                          未检测到 API Key，已自动切换到本地识别模式。
                        </p>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        className="flex-1 h-14 rounded-2xl text-lg font-bold shadow-lg shadow-emerald-500/20 bg-emerald-500 hover:bg-emerald-600 text-white"
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || (!useAdvancedAI && modelLoading) || (!useAdvancedAI && modelError)}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            正在识别...
                          </>
                        ) : modelError && !useAdvancedAI ? (
                          "本地模型加载失败"
                        ) : (
                          <>
                            <Brain className="mr-2 h-5 w-5" />
                            开始智能分析
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-14 w-14 rounded-2xl border-2"
                        onClick={resetAnalysis}
                        disabled={isAnalyzing}
                      >
                        <RefreshCw className="h-6 w-6" />
                      </Button>
                    </div>
                    {modelError && !useAdvancedAI && (
                      <p className="text-[10px] text-red-500 text-center font-medium">
                        本地 AI 模型加载失败，请检查网络连接或尝试开启“高级 AI 模式”。
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Analysis Result */}
              <AnimatePresence>
                {result && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-8 p-0 rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-800 shadow-xl"
                  >
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-t-[2.5rem]">
                        <TabsTrigger value="analysis" className="rounded-2xl font-bold py-3 data-[state=active]:bg-white data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700">识别分析</TabsTrigger>
                        <TabsTrigger value="details" className="rounded-2xl font-bold py-3 data-[state=active]:bg-white data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700">详细指南</TabsTrigger>
                      </TabsList>
                      
                      <div className="p-8">
                        <TabsContent value="analysis" className="mt-0">
                          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-24 h-24 flex-shrink-0 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg"
                            >
                              <div className="scale-150">{result.icon}</div>
                            </motion.div>
                            
                            <div className="flex-1 text-center md:text-left space-y-4">
                              <div>
                                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{result.name}</h3>
                                <div className={`inline-flex px-4 py-1.5 rounded-full text-sm font-bold border ${result.color} shadow-sm`}>
                                  {result.type}
                                </div>
                              </div>
                              
                              <div className="p-6 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
                                <p className="font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center justify-center md:justify-start">
                                  <CheckCircle2 className="h-5 w-5 mr-2" /> 
                                  投放建议
                                </p>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                  {result.advice}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="details" className="mt-0">
                          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700">
                            {result.detailedAnalysis ? (
                              <div className="whitespace-pre-line text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                {result.detailedAnalysis}
                              </div>
                            ) : (
                              <div className="text-center py-12">
                                <Info className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 font-bold">详细分析不可用</p>
                                <p className="text-sm text-slate-400 mt-2">请尝试开启高级AI分析以获得更详细的指导</p>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      </div>
                    </Tabs>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Quick Guide & Stats */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative group">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-8 relative z-10">
                <RecycleElf className="w-16 h-16 mb-4 opacity-80" />
                <h3 className="text-2xl font-bold mb-2">回收小贴士</h3>
                <p className="text-emerald-50 leading-relaxed mb-6">
                  清洗可回收容器可以显著提高其回收价值。在投放塑料瓶前，请尽量排空并冲洗干净。
                </p>
                <Button variant="secondary" className="w-full rounded-xl font-bold">
                  了解更多指南
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-[2.5rem] bg-white dark:bg-slate-900 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">减碳贡献</h3>
                    <p className="text-xs text-slate-500">累计回收成果</p>
                  </div>
                  <LeafSpirit className="w-12 h-12" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-end gap-2">
                    <motion.span 
                      key={carbonOffset}
                      initial={{ opacity: 0, y: 10, scale: 1.2 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="text-4xl font-extrabold text-emerald-500"
                    >
                      {carbonOffset}
                    </motion.span>
                    <span className="text-sm text-slate-500 font-bold mb-1.5">kg CO2</span>
                  </div>
                  
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed font-medium">
                      🌟 您已成功减少了相当于种植 <span className="text-sm font-bold mx-0.5">2</span> 棵树的碳排放！继续加油！
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
