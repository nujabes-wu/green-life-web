import Link from 'next/link';
import { Leaf, Github, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t bg-slate-900 text-slate-200 py-12">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link className="flex items-center gap-2 font-bold text-xl mb-4 text-white" href="/">
              <Leaf className="h-6 w-6 text-primary" />
              <span>绿色生活</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              致力于通过科技手段帮助每个人减少碳足迹，推动可持续发展的未来。
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">功能</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/calculator" className="hover:text-primary transition-colors">碳足迹计算器</Link></li>
              <li><Link href="/recommendations" className="hover:text-primary transition-colors">绿色消费建议</Link></li>
              <li><Link href="/ai-recycle" className="hover:text-primary transition-colors">AI 智能回收</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">资源</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">环保知识库</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">API 文档</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">隐私政策</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">关于我们</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">关注我们</h3>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-primary transition-colors"><Github className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center text-sm text-slate-500">
            &copy; 2026 绿色生活 Green Life. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <span>科技助力环保</span>
            <span>为地球减负</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
