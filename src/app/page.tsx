'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calculator, ShoppingBag, Recycle, ArrowRight, Leaf, Globe, Users, Brain } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-24 md:pt-24 md:pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-white to-primary-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30 -z-20" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-ocean/10 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3" />

        <div className="container px-4 md:px-6 relative z-10 mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ y: -5 }}
            className="relative"
          >
            {/* Cartoon Decorative Elements */}
            <motion.img 
              src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20smiling%20sun%20sticker%2C%20hand-drawn%20style%2C%20bright%20yellow%2C%20soft%20edges%2C%20white%20background&image_size=square"
              alt="sun"
              className="absolute -top-12 -right-8 w-24 h-24 z-20 drop-shadow-lg hidden md:block"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.img 
              src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20green%20sprout%20sticker%2C%20hand-drawn%20style%2C%20organic%20lines%2C%20white%20background&image_size=square"
              alt="sprout"
              className="absolute -bottom-8 -left-8 w-20 h-20 z-20 drop-shadow-lg hidden md:block"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Main Content Card */}
            <Card className="border-0 shadow-2xl rounded-[3rem] overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-8 md:p-16 flex flex-col items-center text-center space-y-10 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent-ocean/5 -z-10" />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center rounded-full border border-primary/20 bg-white/80 backdrop-blur-md px-4 py-1.5 text-sm font-medium text-primary shadow-sm hover:shadow-md transition-shadow cursor-default"
              >
                <Leaf className="mr-2 h-4 w-4 text-primary" />
                <span className="tracking-wide">绿色生活，从今天开始</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-slate-800 dark:text-slate-100"
              >
                计算环境影响 <br className="hidden sm:inline" />
                开启<span className="text-gradient-brand decoration-wavy underline decoration-primary/30 underline-offset-8">绿色未来</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed"
              >
                每一点改变，都让地球更美好。通过我们的智能工具，追踪您的碳足迹，获取个性化减排建议，参与全球环保行动。
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="flex flex-col sm:flex-row gap-4 min-w-[200px]"
              >
                <Link href="/calculator">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                    开始计算 <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with ImpactCounter */}
      <section className="w-full py-12 relative overflow-hidden bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl border-y border-primary/10">
        {/* Decorative background blur */}
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-accent-warm/5 rounded-full blur-3xl -z-10 -translate-y-1/2" />
        
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex flex-row flex-wrap md:flex-nowrap items-center justify-center md:justify-between gap-y-8 text-center">
            <ImpactCounter 
              icon={Users} 
              value="10,000+" 
              label="活跃环保卫士" 
              color="text-orange-500"
              gradient="from-orange-500/10 to-orange-500/5"
              delay={0}
            />
            <div className="hidden md:block h-16 w-px bg-gradient-to-b from-transparent via-border to-transparent mx-4" />
            <ImpactCounter 
              icon={Globe} 
              value="500 t" 
              label="累计减少碳排放" 
              color="text-teal-500" 
              gradient="from-teal-500/10 to-teal-500/5"
              delay={0.1}
            />
            <div className="hidden md:block h-16 w-px bg-gradient-to-b from-transparent via-border to-transparent mx-4" />
            <ImpactCounter 
              icon={Leaf} 
              value="2,000+" 
              label="相当于种植树木" 
              color="text-green-500" 
              gradient="from-green-500/10 to-green-500/5"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-24 md:py-32 bg-secondary/20">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-gradient-brand">
              全方位环保工具箱
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              我们提供一系列智能工具，帮助您轻松践行低碳生活方式。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={Calculator}
              title="碳足迹计算"
              description="输入您的交通、能源和饮食数据，快速获取年度碳排放报告。"
              href="/calculator"
              cta="去计算"
              gradient="from-orange-100 to-orange-50 dark:from-orange-950/20 dark:to-orange-900/10"
              iconColor="text-orange-500"
              btnColor="bg-orange-400"
              illustration="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20earth%20character%20holding%20a%20calculator%2C%20smiling%20face%2C%20eco-friendly%20style%2C%20soft%203d%20render%2C%20white%20background&image_size=square"
              delay={0}
            />
            <FeatureCard 
              icon={ShoppingBag}
              title="绿色消费"
              description="基于您的生活习惯，为您精选节能、可再生、可降解的环保好物。"
              href="/recommendations"
              cta="看推荐"
              gradient="from-teal-100 to-teal-50 dark:from-teal-950/20 dark:to-teal-900/10"
              iconColor="text-teal-500"
              btnColor="bg-teal-400"
              illustration="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20animal%20squirrel%20holding%20a%20green%20shopping%20bag%2C%20smiling%20face%2C%20sustainable%20shopping%2C%20soft%203d%20render%2C%20white%20background&image_size=square"
              delay={0.1}
            />
            <FeatureCard 
              icon={Recycle}
              title="AI 回收助手"
              description="不确定怎么扔？拍张照片，AI 助手立刻告诉您正确的分类方式。"
              href="/ai-recycle"
              cta="试一试"
              gradient="from-emerald-100 to-emerald-50 dark:from-emerald-950/20 dark:to-emerald-900/10"
              iconColor="text-emerald-500"
              btnColor="bg-emerald-400"
              illustration="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20trash%20bin%20with%20a%20big%20smile%2C%20recycle%20symbol%20on%20it%2C%20soft%203d%20render%2C%20white%20background&image_size=square"
              delay={0.2}
            />
            <FeatureCard 
              icon={Brain}
              title="AI 环保顾问"
              description="有任何环保问题？AI 顾问随时为您提供专业建议，助力绿色生活。"
              href="/eco-advisor"
              cta="咨询顾问"
              gradient="from-green-100 to-green-50 dark:from-green-950/20 dark:to-green-900/10"
              iconColor="text-green-500"
              btnColor="bg-green-400"
              illustration="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20smiling%20tree%20character%20with%20glasses%2C%20acting%20as%20an%20advisor%2C%20sustainable%20wisdom%2C%20soft%203d%20render%2C%20white%20background&image_size=square"
              delay={0.3}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ImpactCounter({ icon: Icon, value, label, color, gradient, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center justify-center p-2 group cursor-default min-w-[160px]"
    >
      <div className={`p-4 rounded-[1.5rem] bg-gradient-to-br ${gradient} shadow-sm mb-4 transition-all duration-300 group-hover:shadow-lg group-hover:rotate-6`}>
        <Icon className={`h-8 w-8 ${color}`} strokeWidth={2.5} />
      </div>
      <div className="text-4xl font-extrabold text-foreground tracking-tight mb-1 font-sans tabular-nums">{value}</div>
      <div className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">{label}</div>
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title, description, href, cta, gradient, iconColor, btnColor, illustration, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10 }}
      className="h-full"
    >
      <Card className={`group h-full flex flex-col items-center text-center p-8 border-0 shadow-xl rounded-[2.5rem] bg-gradient-to-b ${gradient} transition-all duration-300 hover:shadow-2xl overflow-hidden relative`}>
        {/* Cartoon Illustration */}
        <div className="relative w-32 h-32 mb-6 group-hover:scale-110 transition-transform duration-500">
          <div className="absolute inset-0 bg-white/40 rounded-full blur-xl animate-pulse" />
          <img 
            src={illustration} 
            alt={title}
            className="w-full h-full object-contain relative z-10 drop-shadow-md"
          />
        </div>

        <CardHeader className="p-0 mb-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Icon className={`h-5 w-5 ${iconColor}`} />
            <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground text-base leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-auto p-0 pt-6 w-full">
          <Link href={href} className="block w-full">
            <Button className={`w-full h-12 rounded-2xl font-bold text-base shadow-lg transition-all duration-300 ${btnColor} hover:brightness-110 active:scale-95 text-white`}>
              {cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
        
        {/* Decorative Elements */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors" />
      </Card>
    </motion.div>
  );
}
