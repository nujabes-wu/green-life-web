'use client';

import { Shield, Lock, User, MessageSquare, Trash2, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-green-950/30 -z-20" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[100px] -z-10 -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-100/30 dark:bg-green-900/10 rounded-full blur-[100px] -z-10 translate-x-1/3 translate-y-1/3" />

      <div className="container py-12 px-4 md:px-6 max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100 sm:text-4xl mb-4">隐私政策</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            我们致力于保护您的个人信息和隐私安全。本政策说明了我们如何收集、使用、存储和保护您的信息。
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-none shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 md:p-10 space-y-8">
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <User className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">信息收集</h2>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 space-y-2 text-base leading-relaxed pl-14">
                    <p>
                      我们可能收集以下类型的信息：
                    </p>
                    <ul className="grid gap-2 mt-2">
                      {[
                        "个人身份信息：如姓名、邮箱地址等",
                        "使用信息：如您访问的页面、使用的功能、停留时间等",
                        "设备信息：如设备类型、浏览器类型、IP地址等",
                        "碳足迹数据：如您输入的活动数据、计算结果等"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">信息使用</h2>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 space-y-2 text-base leading-relaxed pl-14">
                    <p>
                      我们收集的信息将用于以下目的：
                    </p>
                    <ul className="grid gap-2 mt-2">
                      {[
                        "提供和改进我们的服务",
                        "计算和分析碳足迹",
                        "发送重要通知和更新",
                        "个性化您的用户体验",
                        "进行数据分析和研究，以改善我们的服务"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">信息保护</h2>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 space-y-2 text-base leading-relaxed pl-14">
                    <p>
                      我们采取以下措施保护您的信息：
                    </p>
                    <ul className="grid gap-2 mt-2 mb-4">
                      {[
                        "使用加密技术保护数据传输",
                        "限制对个人信息的访问权限",
                        "定期进行安全评估和更新",
                        "遵守相关数据保护法规"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Shield className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      请注意，尽管我们采取了安全措施，但任何通过互联网传输的信息都不能完全保证安全。
                    </p>
                  </div>
                </section>

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                      <Trash2 className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">信息存储与删除</h2>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 space-y-2 text-base leading-relaxed pl-14">
                    <p>
                      我们将在必要的时间内存储您的信息，以实现本政策所述的目的。当信息不再需要时，我们将采取合理措施安全删除或匿名化处理这些信息。
                    </p>
                    <p>
                      您可以随时联系我们，要求访问、更正或删除您的个人信息。
                    </p>
                  </div>
                </section>

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <Shield className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">第三方服务</h2>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 space-y-2 text-base leading-relaxed pl-14">
                    <p>
                      我们可能使用第三方服务来帮助提供我们的服务，如：
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 mb-3">
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                        <span className="font-bold block mb-1">Supabase</span>
                        <span className="text-sm">用于用户认证和数据存储</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                        <span className="font-bold block mb-1">硅基流动</span>
                        <span className="text-sm">用于AI模型服务</span>
                      </div>
                    </div>
                    <p>
                      这些第三方服务可能会收集和处理您的信息，但其使用应遵守各自的隐私政策。我们建议您查阅这些服务的隐私政策，了解它们如何处理您的信息。
                    </p>
                  </div>
                </section>

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">政策更新</h2>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 space-y-2 text-base leading-relaxed pl-14">
                    <p>
                      我们可能会不时更新本隐私政策，以反映我们的服务变化或法律法规的要求。更新后的政策将在网站上发布，并注明更新日期。
                    </p>
                    <p>
                      继续使用我们的服务，即表示您同意遵守更新后的隐私政策。
                    </p>
                  </div>
                </section>

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                      <User className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">联系我们</h2>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 space-y-2 text-base leading-relaxed pl-14">
                    <p>
                      如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：
                    </p>
                    <div className="bg-teal-50 dark:bg-teal-900/10 p-6 rounded-2xl mt-4 border border-teal-100 dark:border-teal-900/30">
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <span className="font-bold w-12">邮箱：</span>
                          <a href="mailto:2060432613@qq.com" className="text-teal-600 hover:underline">2060432613@qq.com</a>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="font-bold w-12">电话：</span>
                          <a href="tel:13219082202" className="text-teal-600 hover:underline">13219082202</a>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="font-bold w-12">地址：</span>
                          <span>四川省成都市都江堰市青城山市</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-full px-6 py-2 text-sm text-slate-500 border border-slate-200 dark:border-slate-800">
            本隐私政策自 2026年2月16日 起生效
          </div>
        </motion.div>
      </div>
    </div>
  );
}
