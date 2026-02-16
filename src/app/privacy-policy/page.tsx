'use client';

import { Shield, Lock, User, MessageSquare, Trash2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-12 px-4 md:px-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">隐私政策</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          我们致力于保护您的个人信息和隐私安全。本政策说明了我们如何收集、使用、存储和保护您的信息。
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <User className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">信息收集</h2>
          </div>
          <div className="text-muted-foreground space-y-2 text-sm leading-relaxed">
            <p>
              我们可能收集以下类型的信息：
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>个人身份信息：如姓名、邮箱地址等</li>
              <li>使用信息：如您访问的页面、使用的功能、停留时间等</li>
              <li>设备信息：如设备类型、浏览器类型、IP地址等</li>
              <li>碳足迹数据：如您输入的活动数据、计算结果等</li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">信息使用</h2>
          </div>
          <div className="text-muted-foreground space-y-2 text-sm leading-relaxed">
            <p>
              我们收集的信息将用于以下目的：
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>提供和改进我们的服务</li>
              <li>计算和分析碳足迹</li>
              <li>发送重要通知和更新</li>
              <li>个性化您的用户体验</li>
              <li>进行数据分析和研究，以改善我们的服务</li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">信息保护</h2>
          </div>
          <div className="text-muted-foreground space-y-2 text-sm leading-relaxed">
            <p>
              我们采取以下措施保护您的信息：
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>使用加密技术保护数据传输</li>
              <li>限制对个人信息的访问权限</li>
              <li>定期进行安全评估和更新</li>
              <li>遵守相关数据保护法规</li>
            </ul>
            <p>
              请注意，尽管我们采取了安全措施，但任何通过互联网传输的信息都不能完全保证安全。
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">信息存储与删除</h2>
          </div>
          <div className="text-muted-foreground space-y-2 text-sm leading-relaxed">
            <p>
              我们将在必要的时间内存储您的信息，以实现本政策所述的目的。当信息不再需要时，我们将采取合理措施安全删除或匿名化处理这些信息。
            </p>
            <p>
              您可以随时联系我们，要求访问、更正或删除您的个人信息。
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">第三方服务</h2>
          </div>
          <div className="text-muted-foreground space-y-2 text-sm leading-relaxed">
            <p>
              我们可能使用第三方服务来帮助提供我们的服务，如：
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Supabase：用于用户认证和数据存储</li>
              <li>硅基流动：用于AI模型服务</li>
            </ul>
            <p>
              这些第三方服务可能会收集和处理您的信息，但其使用应遵守各自的隐私政策。我们建议您查阅这些服务的隐私政策，了解它们如何处理您的信息。
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">政策更新</h2>
          </div>
          <div className="text-muted-foreground space-y-2 text-sm leading-relaxed">
            <p>
              我们可能会不时更新本隐私政策，以反映我们的服务变化或法律法规的要求。更新后的政策将在网站上发布，并注明更新日期。
            </p>
            <p>
              继续使用我们的服务，即表示您同意遵守更新后的隐私政策。
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <User className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">联系我们</h2>
          </div>
          <div className="text-muted-foreground space-y-2 text-sm leading-relaxed">
            <p>
              如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>邮箱：2060432613@qq.com</li>
              <li>电话：13219082202</li>
              <li>地址：四川省成都市都江堰市青城山市</li>
            </ul>
          </div>
        </section>
      </div>

      <div className="mt-12 bg-muted/30 rounded-lg p-6 border border-muted">
        <p className="text-sm text-muted-foreground text-center">
          本隐私政策自2026年2月16日起生效
        </p>
      </div>
    </div>
  );
}
