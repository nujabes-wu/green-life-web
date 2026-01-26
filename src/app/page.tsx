'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calculator, ShoppingBag, Recycle, ArrowRight, Leaf, Globe, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-[#C8E6C9] dark:from-slate-900 dark:to-emerald-950 -z-20" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-dopamine-orange/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

        <div className="container px-4 md:px-6 flex flex-col items-center justify-center text-center space-y-8 relative z-10 mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-primary/20 bg-white/50 backdrop-blur-sm px-3 py-1 text-sm font-medium text-primary shadow-sm"
          >
            <Leaf className="mr-2 h-4 w-4 text-dopamine-orange" />
            绿色生活，从今天开始
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-dopamine-blue"
          >
            计算环境影响 <br className="hidden sm:inline" />
            开启<span className="text-primary">绿色未来</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed"
          >
            每一点改变，都让地球更美好。通过我们的智能工具，追踪您的碳足迹，获取个性化减排建议，参与全球环保行动。
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 min-w-[200px]"
          >
            <Link href="/calculator">
              <Button size="lg" className="w-full sm:w-auto font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                开始计算 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/recommendations">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-background/50 backdrop-blur-sm">
                浏览建议
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 border-y bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container px-4 md:px-6 mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <Users className="h-8 w-8 mx-auto text-dopamine-orange mb-2" />
              <div className="text-3xl font-bold text-foreground">10,000+</div>
              <div className="text-sm text-muted-foreground">活跃环保卫士</div>
            </div>
            <div className="space-y-2">
              <Globe className="h-8 w-8 mx-auto text-dopamine-blue mb-2" />
              <div className="text-3xl font-bold text-foreground">500 t</div>
              <div className="text-sm text-muted-foreground">累计减少碳排放</div>
            </div>
            <div className="space-y-2">
              <Leaf className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-3xl font-bold text-foreground">2,000+</div>
              <div className="text-sm text-muted-foreground">相当于种植树木</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-20 md:py-32">
        <div className="container px-4 md:px-6 mx-auto max-w-5xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              全方位环保工具箱
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
              我们提供一系列智能工具，帮助您轻松践行低碳生活方式。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="group hover:shadow-xl transition-all duration-300 border-primary/10 hover:border-dopamine-orange/50">
              <CardHeader>
                <div className="p-3 w-fit rounded-xl bg-dopamine-orange/10 text-dopamine-orange mb-4 group-hover:scale-110 transition-transform">
                  <Calculator className="h-8 w-8" />
                </div>
                <CardTitle>碳足迹计算</CardTitle>
                <CardDescription>
                  量化日常活动碳排放
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  输入您的交通、能源和饮食数据，快速获取年度碳排放报告。
                </p>
                <Link href="/calculator" className="text-primary font-medium inline-flex items-center hover:underline underline-offset-4 group-hover:translate-x-1 transition-transform">
                  去计算 <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-primary/10 hover:border-dopamine-blue/50">
              <CardHeader>
                <div className="p-3 w-fit rounded-xl bg-dopamine-blue/10 text-dopamine-blue mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <CardTitle>绿色消费</CardTitle>
                <CardDescription>
                  智能环保产品推荐
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  基于您的生活习惯，为您精选节能、可再生、可降解的环保好物。
                </p>
                <Link href="/recommendations" className="text-primary font-medium inline-flex items-center hover:underline underline-offset-4 group-hover:translate-x-1 transition-transform">
                  看推荐 <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-primary/10 hover:border-dopamine-purple/50">
              <CardHeader>
                <div className="p-3 w-fit rounded-xl bg-dopamine-purple/10 text-dopamine-purple mb-4 group-hover:scale-110 transition-transform">
                  <Recycle className="h-8 w-8" />
                </div>
                <CardTitle>AI 回收助手</CardTitle>
                <CardDescription>
                  拍照识别垃圾分类
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  不确定怎么扔？拍张照片，AI 助手立刻告诉您正确的分类方式。
                </p>
                <Link href="/ai-recycle" className="text-primary font-medium inline-flex items-center hover:underline underline-offset-4 group-hover:translate-x-1 transition-transform">
                  试一试 <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
