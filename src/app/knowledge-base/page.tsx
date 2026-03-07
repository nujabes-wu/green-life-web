'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, BookOpen, Lightbulb, Recycle, Wind, Droplets, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function KnowledgeBasePage() {
  const knowledgeCategories = [
    {
      id: 'carbon-footprint',
      title: '碳足迹知识',
      icon: <Leaf className="h-6 w-6 text-green-500" />,
      color: 'green',
      content: '碳足迹是指个人、组织或产品在生命周期中直接或间接产生的温室气体排放总量。了解碳足迹有助于我们识别主要排放源，采取针对性措施减少碳排放。日常生活中，衣食住行各个方面都会产生碳排放，如使用交通工具、消费商品、能源消耗等。通过计算和分析碳足迹，我们可以制定个性化的减排方案，为应对气候变化贡献力量。'
    },
    {
      id: 'recycling',
      title: '垃圾分类指南',
      icon: <Recycle className="h-6 w-6 text-blue-500" />,
      color: 'blue',
      content: '垃圾分类是实现资源循环利用的重要环节。正确的垃圾分类可以减少环境污染，提高资源回收利用率。常见的垃圾分类包括：可回收物（纸张、塑料、玻璃、金属等）、厨余垃圾（剩菜剩饭、果皮蔬菜等）、有害垃圾（电池、灯管、药品等）和其他垃圾（砖瓦陶瓷、渣土等）。不同地区的分类标准可能略有差异，应按照当地规定进行分类投放。'
    },
    {
      id: 'renewable-energy',
      title: '可再生能源',
      icon: <Wind className="h-6 w-6 text-yellow-500" />,
      color: 'yellow',
      content: '可再生能源是指那些能够持续再生、不会枯竭的能源，如太阳能、风能、水能、生物质能等。与传统化石能源相比，可再生能源具有清洁、低碳、可持续的特点。大力发展可再生能源是应对气候变化、实现能源转型的重要途径。个人可以通过使用太阳能产品、选择绿色能源供应商、减少能源消耗等方式支持可再生能源的发展。'
    },
    {
      id: 'water-conservation',
      title: '水资源保护',
      icon: <Droplets className="h-6 w-6 text-cyan-500" />,
      color: 'cyan',
      content: '水资源是人类生存和发展的重要基础。全球水资源短缺问题日益严重，节约用水、保护水资源已成为当务之急。日常生活中，我们可以通过关闭不必要的水龙头、修复漏水设施、使用节水器具、收集雨水等方式减少水资源浪费。同时，应避免向水体排放污染物，保护水环境质量。'
    },
    {
      id: 'sustainable-living',
      title: '可持续生活方式',
      icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
      color: 'amber',
      content: '可持续生活方式是指那些能够满足当前需求而不损害未来世代满足其需求能力的生活方式。具体包括：减少消费，选择耐用、可修复的产品；优先购买本地、有机、环保认证的商品；减少食物浪费，选择植物性饮食；采用绿色出行方式，如步行、骑行、公共交通等；节约能源，提高能源利用效率；参与环保活动，传播环保理念。'
    }
  ];

  const getColorClass = (color: string) => {
    const map: Record<string, string> = {
      green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
      amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    };
    return map[color] || map.green;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30 -z-20" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100/30 dark:bg-green-900/10 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3" />

      <div className="container py-12 px-4 md:px-6 max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-800 dark:text-slate-100">环保知识库</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            探索环保知识，了解可持续发展理念，为地球的未来贡献自己的力量。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {knowledgeCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden group">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getColorClass(category.color)} group-hover:scale-110 transition-transform duration-300`}>
                      {category.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                    {category.content}
                  </p>
                  <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 font-bold hover:bg-transparent flex items-center gap-1 group-hover:gap-2 transition-all">
                    了解更多 <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-xl"
        >
          <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-800 dark:text-slate-100">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center text-yellow-600 dark:text-yellow-400">
              <Lightbulb className="h-6 w-6" />
            </div>
            每日环保小贴士
          </h2>
          <div className="grid gap-4">
            {[
              "使用可重复使用的购物袋，减少塑料袋的使用",
              "选择当季、本地的食材，减少食物运输的碳排放",
              "使用节能电器，离开房间时关灯",
              "减少一次性用品的使用，如餐具、水杯、纸巾等",
              "参与社区环保活动，如垃圾分类宣传、植树造林等"
            ].map((tip, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors border border-slate-100 dark:border-slate-700/50"
              >
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">{tip}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
