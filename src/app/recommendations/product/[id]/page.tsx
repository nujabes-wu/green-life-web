'use client';

import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Leaf, BarChart3, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

// 商品数据
const products = [
  { 
    id: '1',
    title: "节能 LED 灯泡", 
    desc: "比传统白炽灯节能 80%，使用寿命长达 15,000 小时。", 
    icon: "💡", 
    price: "¥29.9", 
    tag: "节能",
    details: {
      brand: "GreenTech",
      model: "LED-100W",
      power: "12W",
      equivalent: "100W",
      lifespan: "15,000 小时",
      color: "暖白色 (2700K)",
      features: [
        "节能 80% 以上",
        "无频闪技术",
        "瞬间启动",
        "环保无汞",
        "通过 CE 和 RoHS 认证"
      ],
      benefits: [
        "降低 electricity 账单",
        "减少碳足迹",
        "减少更换频率",
        "提供舒适的照明环境"
      ]
    }
  },
  { 
    id: '2',
    title: "竹纤维纸巾", 
    desc: "100% 竹浆制造，生长周期短，更环保的可持续选择。", 
    icon: "🎋", 
    price: "¥19.9", 
    tag: "可再生",
    details: {
      brand: "BambooCare",
      model: "BC-100",
      material: "100% 竹浆",
      quantity: "3 层 x 100 抽 x 6 包",
      certification: "FSC 认证",
      features: [
        "100% 可再生资源",
        "无氯漂白",
        "强韧吸水",
        "柔软亲肤",
        "可堆肥降解"
      ],
      benefits: [
        "保护森林资源",
        "减少水污染",
        "支持可持续发展",
        "使用更安心"
      ]
    }
  },
  { 
    id: '3',
    title: "可降解垃圾袋", 
    desc: "玉米淀粉基材，在自然环境中可完全降解，减少白色污染。", 
    icon: "♻️", 
    price: "¥15.0", 
    tag: "可降解",
    details: {
      brand: "EcoBag",
      model: "EB-30",
      material: "玉米淀粉 + PLA",
      size: "45 x 55 cm",
      thickness: "0.02mm",
      quantity: "30 只/卷",
      features: [
        "100% 可降解",
        "3-6 个月完全分解",
        "承重能力强",
        "无异味",
        "适合家庭使用"
      ],
      benefits: [
        "减少白色污染",
        "降低塑料依赖",
        "保护土壤和水源",
        "符合环保理念"
      ]
    }
  },
  { 
    id: '4',
    title: "太阳能充电宝", 
    desc: "利用太阳能充电，户外旅行必备，清洁能源随身带。", 
    icon: "☀️", 
    price: "¥199.0", 
    tag: "清洁能源",
    details: {
      brand: "SunPower",
      model: "SP-10000",
      capacity: "10,000 mAh",
      solar_panel: "5V 1A",
      input: "5V 2A",
      output: "5V 2.1A",
      features: [
        "高效太阳能板",
        "双 USB 输出",
        "LED 指示灯",
        "防水防尘",
        "智能保护电路"
      ],
      benefits: [
        "使用清洁能源",
        "应急户外充电",
        "减少电网依赖",
        "便携实用"
      ]
    }
  }
];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="container py-12 px-4 md:px-6 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">商品不存在</h1>
          <p className="text-muted-foreground mb-8">您访问的商品可能已下架或链接有误</p>
          <Link href="/recommendations">
            <Button variant="default">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回消费建议
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 px-4 md:px-6 max-w-5xl mx-auto">
      {/* 返回按钮 */}
      <div className="mb-8">
        <Link href="/recommendations">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回消费建议
          </Button>
        </Link>
      </div>

      {/* 商品详情 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：商品信息 */}
        <div>
          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary mb-4">
                    {product.tag}
                  </Badge>
                  <CardTitle className="text-2xl font-bold mb-2">{product.title}</CardTitle>
                  <CardDescription className="text-muted-foreground mb-4">
                    {product.desc}
                  </CardDescription>
                  <div className="text-3xl font-bold text-primary mb-4">
                    {product.price}
                  </div>
                </div>
                <div className="h-20 w-20 rounded-2xl bg-muted/50 flex items-center justify-center text-6xl">
                  {product.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 商品详情 */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  商品规格
                </h3>
                <div className="space-y-2">
                  {Object.entries(product.details).map(([key, value]) => {
                    if (key !== 'features' && key !== 'benefits') {
                      return (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-muted/30">
                          <span className="text-muted-foreground capitalize">
                            {key.replace('_', ' ')}
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              {/* 产品特点 */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  产品特点
                </h3>
                <ul className="space-y-2">
                  {product.details.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 环保效益 */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-primary" />
                  环保效益
                </h3>
                <ul className="space-y-2">
                  {product.details.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Leaf className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：相关推荐 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">相关推荐</h3>
          <div className="space-y-4">
            {products
              .filter(p => p.id !== productId)
              .map(relatedProduct => (
                <Card key={relatedProduct.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary mb-2">
                          {relatedProduct.tag}
                        </Badge>
                        <CardTitle className="text-lg">{relatedProduct.title}</CardTitle>
                      </div>
                      <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center text-3xl">
                        {relatedProduct.icon}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">{relatedProduct.desc}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center py-2">
                    <span className="font-bold text-primary">{relatedProduct.price}</span>
                    <Link href={`/recommendations/product/${relatedProduct.id}`}>
                      <Button variant="ghost" size="sm">
                        查看详情
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
