'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2, Trash2, Paperclip, Image as ImageIcon, Sparkles, Lightbulb, Zap, Leaf, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEcoAdvice } from "@/lib/ai/chat";
import { analyzeImage } from "@/lib/ai/image";
import SmartTrashBot from "@/components/cartoons/SmartTrashBot";

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
  const [botEmotion, setBotEmotion] = useState<'happy' | 'thinking' | 'surprise' | 'sleep'>('happy');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // 发送消息
  const sendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText && !imageUrl) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
      imageUrl: imageUrl || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setImageUrl(null);
    setIsTyping(true);
    setBotEmotion('thinking');

    try {
      let response: string;
      if (imageUrl) {
        // 如果有图片，使用图像分析
        response = await analyzeImage(
          imageUrl,
          `这张图片与环保相关，请分析图片内容并提供相关的环保建议。用户的问题是：${messageText || '请分析这张图片并提供环保建议'}`
        );
      } else {
        // 否则使用文本对话
        response = await getEcoAdvice(messageText);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setBotEmotion('happy');
    } catch (error) {
      console.error('Error getting eco advice:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，我暂时无法回答你的问题。请稍后再试。',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setBotEmotion('surprise');
    } finally {
      setIsTyping(false);
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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 py-12 px-4 md:px-6">
      <div className="container max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left Column: Mascot and Header */}
          <div className="w-full md:w-1/3 space-y-6 md:sticky md:top-24">
            <div className="text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-2">
                <Sparkles className="h-4 w-4" />
                <span>AI 驱动的环保咨询</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                AI <span className="text-primary">环保顾问</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                你的智能绿色生活助手，提供专业的环保知识、垃圾分类指导和减排建议。
              </p>
            </div>

            <div className="relative flex justify-center md:justify-start">
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full -z-10" />
              <SmartTrashBot emotion={botEmotion} className="w-48 h-48 drop-shadow-2xl" />
            </div>

            <div className="hidden md:block space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                今日环保贴士
              </h3>
              <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-primary/10">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground italic">
                    "减少待机能耗，拔掉不用的电器插头。这不仅能节省电费，还能每年减少数十公斤的碳排放。"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column: Chat Interface */}
          <div className="w-full md:w-2/3">
            <Card className="shadow-2xl border-primary/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex flex-col h-[700px] overflow-hidden">
              <CardHeader className="border-b border-muted/30 bg-muted/5 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src="/globe.svg" alt="Eco Advisor" />
                        <AvatarFallback className="bg-primary text-white">EA</AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">绿色生活顾问</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        {isTyping ? (
                          <span className="flex items-center gap-1 text-primary animate-pulse">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            正在输入...
                          </span>
                        ) : (
                          "在线，随时为你提供环保建议"
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={clearMessages} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                <ScrollArea className="flex-1 p-4 md:p-6">
                  <div className="space-y-6">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3 max-w-[85%]`}>
                          <div className={`flex-shrink-0 mt-1`}>
                            {message.role === 'user' ? (
                              <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                                <AvatarFallback className="bg-primary text-white text-xs">U</AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center ring-2 ring-green-500/10">
                                <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                            )}
                          </div>
                          <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div 
                              className={`rounded-2xl px-4 py-3 shadow-sm ${
                                message.role === 'user' 
                                  ? 'bg-primary text-white rounded-tr-none' 
                                  : 'bg-muted/40 dark:bg-muted/20 border border-muted/30 rounded-tl-none'
                              }`}
                            >
                              {message.imageUrl && (
                                <div className="mb-3 rounded-lg overflow-hidden border border-white/20 shadow-md">
                                  <img 
                                    src={message.imageUrl} 
                                    alt="User uploaded" 
                                    className="w-full max-h-60 object-contain hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              )}
                              <p className="text-sm md:text-base leading-relaxed whitespace-pre-line font-medium">
                                {message.content}
                              </p>
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-1 px-1">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    <AnimatePresence>
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex justify-start"
                        >
                          <div className="flex flex-row gap-3">
                            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center ring-2 ring-green-500/10">
                              <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="bg-muted/40 dark:bg-muted/20 border border-muted/30 rounded-2xl rounded-tl-none px-4 py-3">
                              <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-muted/30 bg-muted/5">
                  <AnimatePresence>
                    {imageUrl && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 relative group"
                      >
                        <div className="relative inline-block">
                          <img 
                            src={imageUrl} 
                            alt="Preview" 
                            className="h-20 w-20 object-cover rounded-lg border-2 border-primary shadow-lg"
                          />
                          <button 
                            onClick={clearImage}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:scale-110 transition-transform"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-2 items-end">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="shrink-0 rounded-full hover:bg-primary/10 hover:text-primary transition-colors border-muted/50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="询问环保问题或上传图片..."
                        className="pr-12 py-6 rounded-2xl border-muted focus-visible:ring-primary/20 bg-white dark:bg-slate-900"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                      <Button
                        onClick={() => sendMessage()}
                        disabled={isTyping || (!inputValue.trim() && !imageUrl)}
                        className="absolute right-1.5 top-1.5 bottom-1.5 rounded-xl px-3"
                        size="sm"
                      >
                        {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <p className="text-[10px] text-muted-foreground w-full mb-1 ml-1 font-medium flex items-center gap-1">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      快速提问：
                    </p>
                    {[
                      "如何正确分类垃圾？",
                      "节能减排小妙招",
                      "碳中和是什么？",
                      "环保购物建议"
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="text-[11px] px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-muted hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all shadow-sm"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "智能垃圾分类",
              desc: "不确定垃圾该往哪扔？拍照或描述，我来告诉你！",
              icon: <Bot className="h-6 w-6 text-blue-500" />,
              color: "blue"
            },
            {
              title: "减碳行动计划",
              desc: "获取个性化的生活减排方案，为地球降温。",
              icon: <Zap className="h-6 w-6 text-yellow-500" />,
              color: "yellow"
            },
            {
              title: "绿色消费指南",
              desc: "了解如何辨别环保标志，选择真正的可持续产品。",
              icon: <Leaf className="h-6 w-6 text-green-500" />,
              color: "green"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full border-none bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 rounded-2xl bg-${feature.color}-100 dark:bg-${feature.color}-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
