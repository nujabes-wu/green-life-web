'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2, Trash2, Paperclip, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEcoAdvice } from "@/lib/ai/chat";
import { analyzeImage } from "@/lib/ai/image";

// 定义消息类型
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

export default function EcoAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是你的AI环保顾问。请问有什么环保相关的问题需要咨询？我可以帮你了解环保知识、提供减排建议、解答回收问题等。',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim() && !imageUrl) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
      imageUrl: imageUrl,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setImageUrl(null);
    setIsTyping(true);

    try {
      let response: string;
      if (imageUrl) {
        // 如果有图片，使用图像分析
        response = await analyzeImage(
          imageUrl,
          `这张图片与环保相关，请分析图片内容并提供相关的环保建议。用户的问题是：${inputValue.trim() || '请分析这张图片并提供环保建议'}`
        );
      } else {
        // 否则使用文本对话
        response = await getEcoAdvice(inputValue.trim());
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting eco advice:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，我暂时无法回答你的问题。请稍后再试。',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 清除图片
  const clearImage = () => {
    setImageUrl(null);
  };

  // 清除所有消息
  const clearMessages = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: '你好！我是你的AI环保顾问。请问有什么环保相关的问题需要咨询？我可以帮你了解环保知识、提供减排建议、解答回收问题等。',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="container py-12 px-4 md:px-6 max-w-4xl mx-auto">
      <div className="text-center mb-10 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">AI 环保顾问</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          你的智能环保助手，为你提供专业的环保知识和个性化的绿色生活建议。
        </p>
      </div>

      <Card className="shadow-lg border-primary/20 bg-gradient-to-br from-white to-green-50/50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarImage src="/globe.svg" alt="Eco Advisor" />
                <AvatarFallback className="bg-primary text-white">EA</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">绿色生活顾问</CardTitle>
                <CardDescription>在线，随时为你提供环保建议</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearMessages}>
              <Trash2 className="h-4 w-4 mr-2" /> 清除对话
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[500px] border-t border-b border-muted/30">
            <ScrollArea className="h-full p-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
                >
                  <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3 max-w-[80%]`}>
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      {message.role === 'user' ? (
                        <>
                          <AvatarFallback className="bg-primary text-white">U</AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="/globe.svg" alt="Eco Advisor" />
                          <AvatarFallback className="bg-primary text-white">EA</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div>
                      <div className={`rounded-lg p-4 ${message.role === 'user' ? 'bg-primary text-white' : 'bg-muted/60 dark:bg-muted/80'}`}>
                        {message.imageUrl && (
                          <div className="mb-3 rounded-lg overflow-hidden border border-muted/30">
                            <img 
                              src={message.imageUrl} 
                              alt="User uploaded" 
                              className="w-full max-h-48 object-contain"
                            />
                          </div>
                        )}
                        <p className="whitespace-pre-line">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 ml-2 text-right">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start mb-6"
                >
                  <div className="flex flex-row gap-3 max-w-[80%]">
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      <AvatarImage src="/globe.svg" alt="Eco Advisor" />
                      <AvatarFallback className="bg-primary text-white">EA</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted/60 dark:bg-muted/80 rounded-lg p-4">
                      <div className="flex items-center gap-1">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>正在思考...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>
          </div>
          
          {imageUrl && (
            <div className="p-4 border-b border-muted/30 bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">已选择图片</span>
                </div>
                <Button variant="ghost" size="sm" onClick={clearImage}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 rounded-lg overflow-hidden border border-muted/30 max-w-xs">
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="w-full max-h-32 object-contain"
                />
              </div>
            </div>
          )}
          
          <div className="p-4">
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="输入你的环保问题..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button
                onClick={sendMessage}
                disabled={isTyping || (!inputValue.trim() && !imageUrl)}
                loading={isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              你可以询问关于垃圾分类、节能减排、绿色消费等环保问题，也可以上传图片获取相关建议。
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-dashed border-2 border-muted/30 bg-muted/5 hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">常见问题</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="cursor-pointer hover:text-primary flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>如何正确分类垃圾？</span>
              </li>
              <li className="cursor-pointer hover:text-primary flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>家庭节能减排有哪些方法？</span>
              </li>
              <li className="cursor-pointer hover:text-primary flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>如何选择环保产品？</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-dashed border-2 border-muted/30 bg-muted/5 hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">热门话题</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="cursor-pointer hover:text-primary flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <span>碳中和是什么意思？</span>
              </li>
              <li className="cursor-pointer hover:text-primary flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <span>电动汽车的环保效益</span>
              </li>
              <li className="cursor-pointer hover:text-primary flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <span>可持续饮食的重要性</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-dashed border-2 border-muted/30 bg-muted/5 hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">环保小贴士</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>使用可重复使用的购物袋</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>减少待机能耗，拔掉不用的电器插头</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>选择当地季节性食材，减少运输碳排放</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 缺少的组件
function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
