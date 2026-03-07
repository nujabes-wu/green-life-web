'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calculator, ShoppingBag, Recycle, ArrowRight, Leaf, Globe, Users, Brain, MessageSquare, Sparkles, Wind, Sun, ChevronRight, ChevronLeft, User } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const slides = [
  {
    id: 0,
    tag: "AI 驱动的绿色生活助手",
    title: (
      <>
        让环保 <br />
        成为一种<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 decoration-wavy underline decoration-green-400/40 underline-offset-8">习惯</span>
      </>
    ),
    description: "探索碳足迹，发现绿色好物，通过 AI 助手解决回收难题。加入我们，为地球的未来贡献一份力量。",
    ctaPrimary: { text: "开始探索", href: "/calculator" },
    ctaSecondary: { text: "加入社区", href: "/community" },
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20earth%20planet%20character%20with%20happy%20face%2C%20holding%20a%20green%20leaf%2C%203d%20style%2C%20soft%20lighting%2C%20white%20background&image_size=square",
    floatingElements: [
      { img: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20recycle%20symbol%203d%20icon%2C%20green%20glossy%2C%20white%20background&image_size=square", className: "top-10 left-10 w-24 h-24", delay: 0 },
      { img: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20solar%20panel%203d%20icon%2C%20glossy%2C%20white%20background&image_size=square", className: "bottom-10 right-10 w-28 h-28", delay: 1.5 },
      { img: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20wind%20turbine%203d%20icon%2C%20white%20and%20green%2C%20white%20background&image_size=square", className: "top-20 right-0 w-20 h-20", delay: 0.8 }
    ],
    theme: "green"
  },
  {
    id: 1,
    tag: "智能科技助力零废弃",
    title: (
      <>
        智能回收 <br />
        科技<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 decoration-wavy underline decoration-sky-300/40 underline-offset-8">改变生活</span>
      </>
    ),
    description: "AI 识别垃圾分类，智能分析可回收价值。让每一次回收都变得简单有趣，共同构建零废弃未来。",
    ctaPrimary: { text: "体验 AI 回收", href: "/ai-recycle" },
    ctaSecondary: { text: "了解更多", href: "/knowledge-base" },
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20futuristic%20robot%20sorting%20recycling%2C%203d%20style%2C%20blue%20and%20white%20theme%2C%20clean%20background&image_size=square",
    floatingElements: [
      { img: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20battery%203d%20icon%2C%20blue%20glossy%2C%20white%20background&image_size=square", className: "top-10 left-0 w-20 h-20", delay: 0.5 },
      { img: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20plastic%20bottle%203d%20icon%2C%20cyan%20glossy%2C%20white%20background&image_size=square", className: "bottom-2 right-10 w-24 h-24", delay: 1.2 },
      { img: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20microchip%203d%20icon%2C%20tech%20style%2C%20white%20background&image_size=square", className: "top-5 right-10 w-16 h-16", delay: 0.2 }
    ],
    theme: "blue"
  }
];

export default function Home() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="flex flex-col items-center overflow-x-hidden" ref={targetRef}>
      {/* Hero Section */}
      <section className="relative w-full min-h-[80vh] flex items-center pt-4 pb-16 md:pt-8 md:pb-24 lg:pt-12 lg:pb-32 overflow-hidden">
        {/* Dynamic Background */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={`absolute inset-0 -z-20 bg-gradient-to-br ${currentSlide === 0 ? 'from-emerald-50/50 via-white to-lime-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30' : 'from-sky-50/40 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30'}`} 
          />
        </AnimatePresence>
        
        {/* Floating Blobs */}
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[100px] -z-10 transition-colors duration-1000 ${currentSlide === 0 ? 'bg-emerald-200/20' : 'bg-sky-100/20'}`} 
        />
        <motion.div 
          animate={{ 
            x: [0, -50, 0],
            y: [0, 100, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={`absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] -z-10 transition-colors duration-1000 ${currentSlide === 0 ? 'bg-lime-200/20' : 'bg-blue-100/20'}`} 
        />

        <div className="container px-4 md:px-6 relative z-10 mx-auto max-w-7xl h-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center h-full">
            {/* Left Content */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentSlide}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
                style={{ y: heroY }} // Keep parallax effect but separate from enter/exit
                className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8"
              >
                <div 
                  className={`inline-flex items-center rounded-full border px-6 py-2 text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-default backdrop-blur-md ${currentSlide === 0 ? 'border-emerald-200 bg-emerald-50/80 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400' : 'border-sky-200 bg-sky-50/80 text-sky-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400'}`}
                >
                  <Sparkles className={`mr-2 h-4 w-4 animate-pulse ${currentSlide === 0 ? 'text-emerald-500' : 'text-sky-500'}`} />
                  <span className="tracking-wide">{slides[currentSlide].tag}</span>
                </div>
                
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-slate-800 dark:text-slate-100 leading-[1.1]">
                  {slides[currentSlide].title}
                </h1>
                
                <p className="max-w-[600px] text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed">
                  {slides[currentSlide].description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Link href={slides[currentSlide].ctaPrimary.href} className="w-full sm:w-auto">
                    <Button size="lg" className={`h-12 px-8 text-base rounded-full w-full sm:w-auto font-bold bg-gradient-to-r shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 ${currentSlide === 0 ? 'from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-emerald-500/30 hover:shadow-emerald-500/50' : 'from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 shadow-sky-500/30 hover:shadow-sky-500/50'}`}>
                      {slides[currentSlide].ctaPrimary.text} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href={slides[currentSlide].ctaSecondary.href} className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className={`h-12 px-8 text-base rounded-full w-full sm:w-auto font-bold border-2 transition-all duration-300 ${currentSlide === 0 ? 'border-emerald-100 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:border-slate-700 dark:hover:bg-slate-800' : 'border-sky-100 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 dark:border-slate-700 dark:hover:bg-slate-800'}`}>
                      {slides[currentSlide].ctaSecondary.text}
                    </Button>
                  </Link>
                </div>

                {/* Stats Preview - Keeping it consistent across slides but animating entry */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="pt-8 flex items-center gap-8 text-slate-400 dark:text-slate-500 text-sm font-medium"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white dark:border-slate-900" />
                      ))}
                    </div>
                    <span>10k+ 用户已加入</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>覆盖 50+ 城市</span>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Right Visual */}
            <div className="relative hidden lg:block h-[600px] w-full">
              <div className={`absolute inset-0 bg-gradient-to-tr rounded-full blur-[120px] animate-pulse transition-colors duration-1000 ${currentSlide === 0 ? 'from-emerald-200/30 to-lime-200/30' : 'from-sky-200/30 to-indigo-200/30'}`} />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <motion.img 
                    src={slides[currentSlide].image}
                    alt="Hero Visual"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] object-contain drop-shadow-2xl z-10"
                    animate={{ y: [-20, 20, -20] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  {/* Floating Elements */}
                  {slides[currentSlide].floatingElements.map((el, index) => (
                    <FloatingElement 
                      key={index}
                      img={el.img}
                      className={el.className}
                      delay={el.delay}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Slide Indicators & Controls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={prevSlide} className="rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-8 bg-slate-800 dark:bg-slate-100' : 'w-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <Button variant="ghost" size="icon" onClick={nextSlide} className="rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all">
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-20 relative overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-y border-slate-100 dark:border-slate-800">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
            <ImpactCounter 
              icon={Users} 
              value="10,000+" 
              label="活跃环保卫士" 
              color="text-orange-500"
              bg="bg-orange-50 dark:bg-orange-900/10"
              delay={0}
            />
            <ImpactCounter 
              icon={Globe} 
              value="500 t" 
              label="累计减少碳排放" 
              color="text-emerald-500" 
              bg="bg-emerald-50 dark:bg-emerald-900/10"
              delay={0.2}
            />
            <ImpactCounter 
              icon={Leaf} 
              value="2,000+" 
              label="相当于种植树木" 
              color="text-lime-500" 
              bg="bg-lime-50 dark:bg-lime-900/10"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 md:py-32 bg-slate-50/30 dark:bg-slate-950/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent opacity-50" />
        
        <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-20 space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl text-slate-800 dark:text-slate-100"
            >
              全方位环保工具箱
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mx-auto max-w-[700px] text-slate-400 dark:text-slate-500 md:text-xl"
            >
              我们提供一系列智能工具，帮助您轻松践行低碳生活方式。
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Calculator}
              title="碳足迹计算"
              description="输入您的交通、能源和饮食数据，快速获取年度碳排放报告。"
              href="/calculator"
              cta="去计算"
              color="orange"
              illustration="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20calculator%20character%20with%20arms%20and%20legs%2C%203d%20style%2C%20orange%20theme%2C%20white%20background&image_size=square"
              delay={0}
            />
            <FeatureCard 
              icon={ShoppingBag}
              title="绿色消费"
              description="基于您的生活习惯，为您精选节能、可再生、可降解的环保好物。"
              href="/recommendations"
              cta="看推荐"
              color="teal"
              illustration="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20shopping%20bag%20full%20of%20green%20leaves%2C%203d%20style%2C%20teal%20theme%2C%20white%20background&image_size=square"
              delay={0.1}
            />
            <FeatureCard 
              icon={Recycle}
              title="AI 回收助手"
              description="不确定怎么扔？拍张照片，AI 助手立刻告诉您正确的分类方式。"
              href="/ai-recycle"
              cta="试一试"
              color="emerald"
              illustration="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20recycle%20bin%20robot%20character%2C%203d%20style%2C%20emerald%20green%20theme%2C%20white%20background&image_size=square"
              delay={0.2}
            />
            <FeatureCard 
              icon={Brain}
              title="AI 环保顾问"
              description="有任何环保问题？AI 顾问随时为您提供专业建议，助力绿色生活。"
              href="/eco-advisor"
              cta="咨询顾问"
              color="green"
              illustration="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20owl%20wearing%20glasses%20reading%20a%20book%2C%203d%20style%2C%20green%20theme%2C%20white%20background&image_size=square"
              delay={0.3}
            />
            <FeatureCard 
              icon={MessageSquare}
              title="环保社区"
              description="分享环保心得，参与社区活动，与志同道合的朋友一起为地球贡献力量。"
              href="/community"
              cta="加入社区"
              color="blue"
              illustration="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20animals%20holding%20hands%20around%20earth%2C%203d%20style%2C%20blue%20theme%2C%20white%20background&image_size=square"
              delay={0.4}
            />
            <FeatureCard 
              icon={User}
              title="个人中心"
              description="管理您的个人资料、查看碳积分记录以及勋章成就。"
              href="/profile"
              cta="去管理"
              color="purple"
              illustration="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cute%20cartoon%20person%20character%20with%20happy%20face%2C%203d%20style%2C%20purple%20theme%2C%20white%20background&image_size=square"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 relative overflow-hidden">
        {/* Lighter Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 dark:from-emerald-950/20 dark:via-teal-900/20 dark:to-green-950/20 -z-20" />
        
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent opacity-50" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl -z-10" />

        <div className="container px-4 md:px-6 mx-auto max-w-4xl text-center space-y-8">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl text-slate-800 dark:text-slate-100"
          >
            准备好改变世界了吗？
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            从今天开始记录您的每一个绿色足迹，积少成多，共同守护我们美丽的地球家园。
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/profile">
              <Button size="lg" className="h-14 px-10 text-lg rounded-full font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 hover:scale-105 transition-all shadow-xl shadow-emerald-500/20">
                立即加入 <Sparkles className="ml-2 h-5 w-5 text-yellow-300" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FloatingElement({ img, className, delay }: any) {
  return (
    <motion.div
      className={`absolute ${className} z-20`}
      animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <img src={img} alt="floating" className="w-full h-full object-contain drop-shadow-lg opacity-90" />
    </motion.div>
  )
}

function ImpactCounter({ icon: Icon, value, label, color, bg, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="flex flex-col items-center justify-center p-6 group cursor-default"
    >
      <div className={`p-4 rounded-[1.5rem] ${bg} mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-sm`}>
        <Icon className={`h-8 w-8 ${color}`} strokeWidth={2.5} />
      </div>
      <div className="text-4xl font-black text-slate-800 dark:text-slate-100 mb-2">{value}</div>
      <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{label}</div>
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title, description, href, cta, color, illustration, delay }: any) {
  const colorMap: any = {
    orange: "from-orange-500 to-amber-500 shadow-orange-500/20",
    teal: "from-teal-500 to-cyan-500 shadow-teal-500/20",
    emerald: "from-emerald-500 to-green-500 shadow-emerald-500/20",
    green: "from-green-500 to-lime-500 shadow-green-500/20",
    blue: "from-blue-500 to-indigo-500 shadow-blue-500/20",
    yellow: "from-yellow-400 to-orange-400 shadow-yellow-500/20",
    purple: "from-purple-500 to-violet-500 shadow-purple-500/20"
  };

  const bgMap: any = {
    orange: "bg-orange-50 dark:bg-orange-900/10 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/20",
    teal: "bg-teal-50 dark:bg-teal-900/10 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/20",
    emerald: "bg-emerald-50 dark:bg-emerald-900/10 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/20",
    green: "bg-green-50 dark:bg-green-900/10 group-hover:bg-green-100 dark:group-hover:bg-green-900/20",
    blue: "bg-blue-50 dark:bg-blue-900/10 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20",
    yellow: "bg-yellow-50 dark:bg-yellow-900/10 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/20",
    purple: "bg-purple-50 dark:bg-purple-900/10 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/20",
  }

  const textMap: any = {
    orange: "text-orange-600 dark:text-orange-400",
    teal: "text-teal-600 dark:text-teal-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    green: "text-green-600 dark:text-green-400",
    blue: "text-blue-600 dark:text-blue-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
    purple: "text-purple-600 dark:text-purple-400",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10 }}
      className="h-full"
    >
      <Card className={`group h-full flex flex-col border-0 shadow-xl rounded-[2.5rem] overflow-hidden transition-all duration-300 ${bgMap[color]}`}>
        {illustration && (
          <div className="p-8 pb-0 flex justify-center relative">
            <div className={`absolute inset-0 bg-gradient-to-b ${colorMap[color].split(' ')[0]} ${colorMap[color].split(' ')[1]} opacity-5`} />
            <motion.img 
              src={illustration} 
              alt={title}
              className="w-40 h-40 object-contain drop-shadow-md z-10 transform group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        )}

        <CardContent className={`p-8 flex flex-col flex-1 text-center relative z-10 ${!illustration ? 'pt-12' : 'pt-4'}`}>
          <div className={`inline-flex items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm mx-auto mb-4 ${textMap[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-black mb-3 text-slate-800 dark:text-slate-100">{title}</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed flex-1">
            {description}
          </CardDescription>
          
          <Link href={href} className="block w-full mt-auto">
            <Button className={`w-full h-12 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r ${colorMap[color]} hover:brightness-110 transition-all active:scale-95`}>
              {cta}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}