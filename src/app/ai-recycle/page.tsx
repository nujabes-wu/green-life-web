'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Loader2, CheckCircle2, AlertTriangle, Trash2, HelpCircle, Image as ImageIcon, Brain, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { analyzeRecyclingItem } from "@/lib/ai/image";
import { getEcoAdvice } from "@/lib/ai/chat";

// 定义回收分类接口
interface RecycleCategory {
  name: string;
  type: string;
  color: string;
  advice: string;
  icon: ReactNode;
  probability?: number;
  material?: string;
  environmentalImpact?: string;
  recyclingLocations?: string[];
  detailedAnalysis?: string;
}

// 定义回收分类映射
const RECYCLE_MAP: Record<string, RecycleCategory> = {
  'water bottle': { name: '塑料瓶', type: '可回收物', color: 'bg-blue-100 text-blue-700 border-blue-200', advice: '请倒空瓶内液体，压扁后投入蓝色回收桶。', icon: <CheckCircle2 className="h-6 w-6 text-blue-600" /> },
  'carton': { name: '纸箱', type: '可回收物', color: 'bg-blue-100 text-blue-700 border-blue-200', advice: '请拆开压平，保持干燥，投入纸类回收箱。', icon: <CheckCircle2 className="h-6 w-6 text-blue-600" /> },
  'banana': { name: '香蕉皮', type: '厨余垃圾', color: 'bg-green-100 text-green-700 border-green-200', advice: '属于易腐垃圾，请沥干水分投入绿色垃圾桶。', icon: <Trash2 className="h-6 w-6 text-green-600" /> },
  'orange': { name: '橘子皮', type: '厨余垃圾', color: 'bg-green-100 text-green-700 border-green-200', advice: '属于易腐垃圾，请沥干水分投入绿色垃圾桶。', icon: <Trash2 className="h-6 w-6 text-green-600" /> },
  'apple': { name: '苹果核', type: '厨余垃圾', color: 'bg-green-100 text-green-700 border-green-200', advice: '属于易腐垃圾，请沥干水分投入绿色垃圾桶。', icon: <Trash2 className="h-6 w-6 text-green-600" /> },
  'battery': { name: '废旧电池', type: '有害垃圾', color: 'bg-red-100 text-red-700 border-red-200', advice: '含有重金属，请务必投入红色有害垃圾收集容器。', icon: <AlertTriangle className="h-6 w-6 text-red-600" /> },
  'paper towel': { name: '废纸巾', type: '其他垃圾', color: 'bg-gray-100 text-gray-700 border-gray-200', advice: '受污染纸张无法回收，请投入灰色其他垃圾桶。', icon: <HelpCircle className="h-6 w-6 text-gray-600" /> },
  'coffee cup': { name: '咖啡杯', type: '其他垃圾', color: 'bg-gray-100 text-gray-700 border-gray-200', advice: '一次性纸杯通常含有塑料淋膜，难以回收，建议投入其他垃圾桶。', icon: <HelpCircle className="h-6 w-6 text-gray-600" /> },
  'plastic bag': { name: '塑料袋', type: '其他垃圾', color: 'bg-gray-100 text-gray-700 border-gray-200', advice: '污损的塑料袋难以回收，建议投入其他垃圾桶。', icon: <HelpCircle className="h-6 w-6 text-gray-600" /> },
};

// 默认未知分类
const UNKNOWN_CATEGORY: RecycleCategory = { name: '未知物品', type: '需人工判断', color: 'bg-gray-100 text-gray-700 border-gray-200', advice: 'AI 暂时无法识别此物品，请参考当地分类指南。', icon: <HelpCircle className="h-6 w-6 text-gray-600" /> };

export default function AIRecyclePage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [result, setResult] = useState<RecycleCategory | null>(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState<string | null>(null);
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [useAdvancedAI, setUseAdvancedAI] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // 加载模型
  useEffect(() => {
    async function loadModel() {
      try {
        console.log('Loading MobileNet model...');
        // 显式设置 backend
        await tf.setBackend('webgl');
        await tf.ready();
        
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
        setModelLoading(false);
        console.log('Model loaded successfully with backend:', tf.getBackend());
      } catch (error) {
        console.error('Failed to load model:', error);
        // 如果 webgl 失败，尝试 cpu
        try {
            console.log('Falling back to cpu backend...');
            await tf.setBackend('cpu');
            await tf.ready();
            const loadedModel = await mobilenet.load();
            setModel(loadedModel);
            setModelLoading(false);
        } catch (fallbackError) {
            console.error('Fallback failed:', fallbackError);
            setModelLoading(false);
        }
      }
    }
    loadModel();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const analyzeImage = async () => {
    if (!imagePreview || (!model && !useAdvancedAI)) return;

    setIsAnalyzing(true);
    setDetailedAnalysis(null);
    
    try {
      if (useAdvancedAI) {
        // 使用硅基流动大模型进行分析
        const analysisResult = await analyzeRecyclingItem(imagePreview);
        setDetailedAnalysis(analysisResult);
        
        // 打印分析结果到控制台，用于调试
        console.log('Raw analysis result:', analysisResult);
        
        // 解析结构化分析结果（更灵活的匹配）
        const itemNameMatch = analysisResult.match(/物品名称[:：]\s*([^\n]+)/);
        const recycleTypeMatch = analysisResult.match(/分类类型[:：]\s*([^\n]+)/);
        const recycleColorMatch = analysisResult.match(/分类颜色[:：]\s*([^\n]+)/);
        const adviceMatch = analysisResult.match(/【回收建议】[\s\S]*?预处理方法[:：]\s*([^\n]+)[\s\S]*?投放方式[:：]\s*([^\n]+)/);
        
        const itemName = itemNameMatch ? itemNameMatch[1].trim().replace(/[\[\]]/g, '') : '未知物品';
        const recycleType = recycleTypeMatch ? recycleTypeMatch[1].trim().replace(/[\[\]]/g, '') : '需人工判断';
        const recycleColor = recycleColorMatch ? recycleColorMatch[1].trim().replace(/[\[\]]/g, '') : '';
        
        // 生成回收建议
        let advice = '请参考下方详细分析中的回收建议';
        if (adviceMatch) {
          advice = `预处理：${adviceMatch[1].trim().replace(/[\[\]]/g, '')}\n投放：${adviceMatch[2].trim().replace(/[\[\]]/g, '')}`;
        }
        
        // 打印匹配结果到控制台
        console.log('Extracted info:', {
          itemName,
          recycleType,
          recycleColor,
          advice
        });
        
        // 根据回收类型设置颜色和图标
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
          icon = <AlertTriangle className="h-6 w-6 text-red-600" />;
        }
        
        setResult({
          name: itemName,
          type: recycleType,
          color,
          advice: advice,
          icon,
          detailedAnalysis: analysisResult
        });
      } else {
        // 使用本地模型进行分析
        if (!model || !imageRef.current) return;
        
        const predictions = await model.classify(imageRef.current);
        console.log('Predictions:', predictions);

        if (predictions && predictions.length > 0) {
          // 2. 匹配分类
          let match = null;
          let detectedName = predictions[0].className;

          // 遍历预测结果寻找匹配
          for (const pred of predictions) {
            const names = pred.className.toLowerCase().split(', ');
            for (const name of names) {
               // 简单的关键词匹配
               for (const key in RECYCLE_MAP) {
                  if (name.includes(key)) {
                     match = RECYCLE_MAP[key];
                     detectedName = match.name; // 使用中文名
                     break;
                  }
               }
               if (match) break;
            }
            if (match) break;
          }

          // 3. 设置结果
          if (match) {
            setResult({ ...match, probability: predictions[0].probability });
          } else {
             // 未匹配到预定义规则，显示原始识别结果但标记为未知
             setResult({
                ...UNKNOWN_CATEGORY,
                name: `可能是: ${detectedName.split(',')[0]}`,
                probability: predictions[0].probability
             });
          }
        } else {
          setResult(UNKNOWN_CATEGORY);
        }
      }

    } catch (error) {
      console.error('Analysis failed:', error);
      alert('识别过程出错，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container py-12 px-4 md:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-10 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">AI 智能回收助手</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          上传物品照片，人工智能将为您快速识别并提供分类建议。
        </p>
        {modelLoading && (
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              正在初始化 AI 模型...
           </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Upload Area */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" /> 物品识别
            </CardTitle>
            <CardDescription>支持 JPG, PNG 格式图片</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 h-[300px] flex flex-col items-center justify-center overflow-hidden
                ${imagePreview ? 'border-primary/50 bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-gray-50'}
              `}
              onClick={handleUploadClick}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              <AnimatePresence mode="wait">
                {imagePreview ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative w-full h-full"
                  >
                    {/* 添加 ref 用于 TensorFlow 读取 */}
                    <img 
                       ref={imageRef}
                       src={imagePreview} 
                       alt="Preview" 
                       className="w-full h-full object-contain rounded-lg shadow-sm" 
                       crossOrigin="anonymous" // 关键：允许跨域加载模型
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                      <p className="text-white font-medium">点击更换图片</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center space-y-4"
                  >
                    <div className="bg-primary/10 p-4 rounded-full">
                      <Upload className="h-10 w-10 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">点击或拖拽上传图片</p>
                      <p className="text-sm text-muted-foreground">AI 帮您分类</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={useAdvancedAI} 
                  onChange={(e) => setUseAdvancedAI(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Brain className="h-4 w-4" /> 使用高级AI分析
                </span>
              </label>
            </div>
            <Button 
              className="w-full mt-6" 
              size="lg"
              onClick={analyzeImage} 
              disabled={!imagePreview || isAnalyzing || (!useAdvancedAI && modelLoading)}
              loading={isAnalyzing}
            >
              {!useAdvancedAI && modelLoading ? "模型加载中..." : (isAnalyzing ? "正在智能分析..." : "开始识别")}
            </Button>
          </CardContent>
        </Card>

        {/* Result Area */}
        <div className="h-full">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="h-full border-primary/20 bg-gradient-to-br from-white to-green-50/50 dark:from-slate-900 dark:to-slate-800 shadow-lg">
                  <CardHeader>
                    <CardTitle>🔍 识别结果</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="analysis">分析结果</TabsTrigger>
                        <TabsTrigger value="details">详细分析</TabsTrigger>
                      </TabsList>
                      <TabsContent value="analysis" className="mt-4">
                        <div className="flex flex-col items-center text-center">
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-full shadow-md"
                          >
                            {result.icon}
                          </motion.div>
                          
                          <h3 className="text-3xl font-bold mb-3 text-foreground">{result.name}</h3>
                          
                          {result.probability && (
                             <p className="text-xs text-muted-foreground mb-4">
                                AI 置信度: {(result.probability * 100).toFixed(1)}%
                             </p>
                          )}
                          
                          <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-8 border ${result.color}`}>
                            {result.type}
                          </div>
                          
                          <div className="w-full bg-white/60 dark:bg-black/20 p-6 rounded-xl text-left border border-white/20 shadow-sm">
                            <p className="font-semibold mb-2 flex items-center text-foreground">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> 
                              投放建议：
                            </p>
                            <p className="text-muted-foreground leading-relaxed pl-6">{result.advice}</p>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="details" className="mt-4">
                        <div className="w-full bg-white/60 dark:bg-black/20 p-6 rounded-xl text-left border border-white/20 shadow-sm">
                          {result.detailedAnalysis ? (
                            <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                              {result.detailedAnalysis}
                            </div>
                          ) : (
                            <div className="text-center py-10 text-muted-foreground">
                              <p>详细分析不可用</p>
                              <p className="text-sm mt-2">请使用高级AI分析获取详细信息</p>
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <Card className="h-full min-h-[400px] flex items-center justify-center border-dashed bg-muted/30">
                  <div className="text-center text-muted-foreground p-8">
                    <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Loader2 className="h-8 w-8 text-muted-foreground/30 animate-spin-slow" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">等待分析结果</h3>
                    <p className="max-w-xs mx-auto">请先上传一张物品照片，点击&ldquo;开始识别&rdquo;按钮。</p>
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
