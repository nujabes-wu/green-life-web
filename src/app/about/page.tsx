'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Users, MapPin, Mail, Phone, Heart, Globe, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const teamMembers = [
    {
      name: '吴恒宇',
      role: '开发人员',
      expertise: '专注 AI 集成和前端技术',
      initials: '吴',
      color: 'from-green-400 to-emerald-500'
    },
    {
      name: '邓芸蔓',
      role: '开发人员',
      expertise: '专注碳足迹计算和平台产品设计',
      initials: '邓',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      name: '龙莉娟',
      role: '开发人员',
      expertise: '专注用户需求分析和环保政策研究',
      initials: '龙',
      color: 'from-purple-400 to-pink-500'
    }
  ];

  const teamContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const teamItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30 -z-20" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100/30 dark:bg-green-900/10 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3" />

      <div className="container py-12 px-4 md:px-12 max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm mb-4">
            <Leaf className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-800 dark:text-slate-100">关于我们</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            我们是一支致力于环保科技的团队，通过创新技术帮助人们减少碳足迹，推动可持续发展。
          </p>
        </motion.div>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <Card className="overflow-hidden border-none shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[3rem] relative group">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5 -z-10" />
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-green-200/20 rounded-full blur-3xl group-hover:bg-green-300/30 transition-all duration-700" />
            
            <div className="grid md:grid-cols-5 gap-8 items-center p-8 md:p-12">
              <div className="md:col-span-3 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-black uppercase tracking-widest shadow-sm">
                  <Globe className="h-4 w-4" />
                  <span>我们的使命</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-slate-100 leading-tight">
                  用科技力量<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">重塑绿色生活</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xl font-medium">
                  我们的使命是通过科技手段，让环保行为变得简单易行。无论是通过 AI 识别垃圾分类，还是计算个人碳足迹，我们都致力于帮助每个人理解并减少自己的环境影响，共同创造一个更加可持续的未来。
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-bold text-slate-700 dark:text-slate-200">AI 智能识别</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-bold text-slate-700 dark:text-slate-200">精准碳计算</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-bold text-slate-700 dark:text-slate-200">社区化环保</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-[2.5rem] shadow-xl shadow-green-500/20 transform -rotate-2 hover:rotate-0 transition-all duration-500 flex flex-col items-center justify-center text-white text-center">
                   <Sparkles className="h-10 w-10 mb-4 opacity-80" />
                   <div className="text-4xl font-black mb-1">95%</div>
                   <div className="text-xs font-bold uppercase tracking-widest opacity-80">识别准确率</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 transform rotate-3 hover:rotate-0 transition-all duration-500 flex flex-col items-center justify-center text-center">
                   <Users className="h-10 w-10 mb-4 text-blue-500" />
                   <div className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-1">10k+</div>
                   <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">活跃用户</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 transform rotate-1 hover:rotate-0 transition-all duration-500 flex flex-col items-center justify-center text-center col-span-2">
                   <Globe className="h-10 w-10 mb-4 text-emerald-500" />
                   <div className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-1">全球覆盖</div>
                   <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">致力于全球可持续发展</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.section>

        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center mb-10 gap-3"
          >
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">团队成员</h2>
          </motion.div>
          <motion.div 
            variants={teamContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={teamItemVariants as any}
              >
                <Card className="overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:border-green-200/50 dark:hover:border-green-800/50 transition-all duration-700 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2.5rem] group h-full flex flex-col relative">
                  {/* Glowing background blob */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700 -z-10`} />
                  
                  <div className="h-48 flex items-center justify-center relative overflow-hidden pt-8">
                    <div className="absolute top-0 left-0 w-full h-full">
                       <motion.div 
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className={`absolute top-4 left-4 w-16 h-16 rounded-full border border-slate-200/10 dark:border-slate-700/10 bg-gradient-to-br ${member.color} opacity-5`} 
                       />
                       <motion.div 
                        animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className={`absolute bottom-8 right-8 w-24 h-24 rounded-full border border-slate-200/10 dark:border-slate-700/10 bg-gradient-to-tr ${member.color} opacity-5`} 
                       />
                    </div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      className={`h-28 w-28 rounded-full bg-gradient-to-br ${member.color} p-[2px] shadow-2xl shadow-slate-200/40 dark:shadow-none z-20 relative`}
                    >
                      {/* Inner Glow */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${member.color} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 -z-10`} />
                      
                      <div className="h-full w-full rounded-full bg-white dark:bg-slate-950 flex items-center justify-center overflow-hidden">
                        <span className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br ${member.color} drop-shadow-sm`}>
                          {member.initials}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                  
                  <CardHeader className="text-center pt-4 pb-1">
                    <CardTitle className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{member.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pb-8 flex-1 flex flex-col">
                    <div className="mb-3">
                      <span className={`inline-block px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-transparent bg-clip-text bg-gradient-to-r ${member.color}`}>
                        {member.role}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed px-6 font-medium italic opacity-80">
                      "{member.expertise}"
                    </p>
                    
                    {/* Social Link Pills */}
                    <div className="mt-auto pt-6 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0">
                       <motion.div 
                        whileHover={{ y: -3, scale: 1.1 }}
                        className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all cursor-pointer border border-slate-100 dark:border-slate-800 shadow-sm"
                       >
                          <Mail className="h-5 w-5" />
                       </motion.div>
                       <motion.div 
                        whileHover={{ y: -3, scale: 1.1 }}
                        className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all cursor-pointer border border-slate-100 dark:border-slate-800 shadow-sm"
                       >
                          <Globe className="h-5 w-5" />
                       </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center mb-10 gap-3"
          >
            <Heart className="h-6 w-6 text-red-500" />
            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">我们的价值观</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -10 }} className="h-full">
              <Card className="h-full border-none shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[2rem] p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-2xl flex items-center justify-center mb-6 text-green-600 dark:text-green-400 shadow-inner">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-black mb-3 text-slate-800 dark:text-slate-100">创新驱动</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-base font-medium">
                  不断探索新的技术和方法，利用 AI 和大数据为环保问题提供创新解决方案。
                </p>
              </Card>
            </motion.div>
            <motion.div whileHover={{ y: -10 }} className="h-full">
              <Card className="h-full border-none shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[2rem] p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/50 dark:to-sky-900/50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 shadow-inner">
                  <Leaf className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-black mb-3 text-slate-800 dark:text-slate-100">可持续性</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-base font-medium">
                  我们的产品和服务本身也遵循可持续发展原则，致力于最小化对环境的影响。
                </p>
              </Card>
            </motion.div>
            <motion.div whileHover={{ y: -10 }} className="h-full">
              <Card className="h-full border-none shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[2rem] p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-2xl flex items-center justify-center mb-6 text-amber-600 dark:text-amber-400 shadow-inner">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-black mb-3 text-slate-800 dark:text-slate-100">开放协作</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-base font-medium">
                  与用户、合作伙伴和环保组织紧密合作，共同构建开放、共享的绿色生态。
                </p>
              </Card>
            </motion.div>
          </div>
        </section>

        <section>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-xl text-center"
          >
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
              <MapPin className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            </div>
            <h2 className="text-3xl font-black mb-8 text-slate-800 dark:text-slate-100">联系我们</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-500 mb-2">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">地址</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">四川省成都市都江堰市青城山市</p>
              </div>
              
              <div className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500 mb-2">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">邮箱</h3>
                <a href="mailto:2060432613@qq.com" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors font-medium">2060432613@qq.com</a>
              </div>
              
              <div className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 mb-2">
                  <Phone className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">电话</h3>
                <a href="tel:13219082202" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors font-medium">13219082202</a>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
