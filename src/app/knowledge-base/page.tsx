'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, BookOpen, Lightbulb, Recycle, Wind, Droplets } from 'lucide-react';

export default function KnowledgeBasePage() {
  const knowledgeCategories = [
    {
      id: 'carbon-footprint',
      title: '碳足迹知识',
      icon: <Leaf className="h-6 w-6 text-green-500" />,
      content: '碳足迹是指个人、组织或产品在生命周期中直接或间接产生的温室气体排放总量。了解碳足迹有助于我们识别主要排放源，采取针对性措施减少碳排放。日常生活中，衣食住行各个方面都会产生碳排放，如使用交通工具、消费商品、能源消耗等。通过计算和分析碳足迹，我们可以制定个性化的减排方案，为应对气候变化贡献力量。'
    },
    {
      id: 'recycling',
      title: '垃圾分类指南',
      icon: <Recycle className="h-6 w-6 text-blue-500" />,
      content: '垃圾分类是实现资源循环利用的重要环节。正确的垃圾分类可以减少环境污染，提高资源回收利用率。常见的垃圾分类包括：可回收物（纸张、塑料、玻璃、金属等）、厨余垃圾（剩菜剩饭、果皮蔬菜等）、有害垃圾（电池、灯管、药品等）和其他垃圾（砖瓦陶瓷、渣土等）。不同地区的分类标准可能略有差异，应按照当地规定进行分类投放。'
    },
    {
      id: 'renewable-energy',
      title: '可再生能源',
      icon: <Wind className="h-6 w-6 text-yellow-500" />,
      content: '可再生能源是指那些能够持续再生、不会枯竭的能源，如太阳能、风能、水能、生物质能等。与传统化石能源相比，可再生能源具有清洁、低碳、可持续的特点。大力发展可再生能源是应对气候变化、实现能源转型的重要途径。个人可以通过使用太阳能产品、选择绿色能源供应商、减少能源消耗等方式支持可再生能源的发展。'
    },
    {
      id: 'water-conservation',
      title: '水资源保护',
      icon: <Droplets className="h-6 w-6 text-cyan-500" />,
      content: '水资源是人类生存和发展的重要基础。全球水资源短缺问题日益严重，节约用水、保护水资源已成为当务之急。日常生活中，我们可以通过关闭不必要的水龙头、修复漏水设施、使用节水器具、收集雨水等方式减少水资源浪费。同时，应避免向水体排放污染物，保护水环境质量。'
    },
    {
      id: 'sustainable-living',
      title: '可持续生活方式',
      icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
      content: '可持续生活方式是指那些能够满足当前需求而不损害未来世代满足其需求能力的生活方式。具体包括：减少消费，选择耐用、可修复的产品；优先购买本地、有机、环保认证的商品；减少食物浪费，选择植物性饮食；采用绿色出行方式，如步行、骑行、公共交通等；节约能源，提高能源利用效率；参与环保活动，传播环保理念。'
    }
  ];

  return (
    <div className="container py-12 px-4 md:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">环保知识库</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          探索环保知识，了解可持续发展理念，为地球的未来贡献自己的力量。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {knowledgeCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                {category.icon}
                <CardTitle>{category.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              {category.content}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-muted/30 rounded-lg p-6 border border-muted">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          环保小贴士
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>使用可重复使用的购物袋，减少塑料袋的使用</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>选择当季、本地的食材，减少食物运输的碳排放</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>使用节能电器，离开房间时关灯</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>减少一次性用品的使用，如餐具、水杯、纸巾等</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>参与社区环保活动，如垃圾分类宣传、植树造林等</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
