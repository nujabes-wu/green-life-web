import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Instagram, ArrowUpRight, Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full relative bg-slate-900 text-slate-200 pt-20 pb-12 mt-20">
      {/* Organic Wave Divider */}


      <div className="container px-4 md:px-6 mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1 space-y-4">
            <Link className="flex items-center gap-2 font-bold text-2xl group text-white hover:text-primary transition-colors" href="/">
              <div className="relative h-12 w-12 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors overflow-hidden flex items-center justify-center">
                <Image 
                  src="/logo.svg" 
                  alt="绿色生活 Logo" 
                  fill 
                  className="object-contain scale-125 transition-transform duration-500 group-hover:scale-150"
                />
              </div>
              <span>绿色生活</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              科技赋能环保，让每一次选择都充满善意。加入我们要创造一个更可持续的未来。
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-6 text-lg">核心功能</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/calculator" className="flex items-center hover:text-primary transition-colors group"><span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-opacity"/>碳足迹计算器</Link></li>
              <li><Link href="/recommendations" className="flex items-center hover:text-primary transition-colors group"><span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-opacity"/>绿色消费建议</Link></li>
              <li><Link href="/ai-recycle" className="flex items-center hover:text-primary transition-colors group"><span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-opacity"/>AI 智能回收</Link></li>
              <li><Link href="/eco-advisor" className="flex items-center hover:text-primary transition-colors group"><span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-opacity"/>AI 环保顾问</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-6 text-lg">资源中心</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/knowledge-base" className="flex items-center hover:text-primary transition-colors group"><span className="w-1.5 h-1.5 rounded-full bg-accent-ocean-dark mr-2 opacity-0 group-hover:opacity-100 transition-opacity"/>环保知识库</Link></li>
              <li><Link href="/privacy-policy" className="flex items-center hover:text-primary transition-colors group"><span className="w-1.5 h-1.5 rounded-full bg-accent-ocean-dark mr-2 opacity-0 group-hover:opacity-100 transition-opacity"/>隐私政策</Link></li>
              <li><Link href="/about" className="flex items-center hover:text-primary transition-colors group"><span className="w-1.5 h-1.5 rounded-full bg-accent-ocean-dark mr-2 opacity-0 group-hover:opacity-100 transition-opacity"/>关于我们</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-6 text-lg">加入社区</h3>
            <p className="text-slate-400 text-sm mb-4">关注我们的开源动态与最新进展。</p>
            <div className="flex gap-4">
              <Link href="https://github.com/nujabes-wu" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-lg hover:bg-primary hover:text-white transition-all group">
                <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center text-sm text-slate-500">
            &copy; 2026 绿色生活 Green Life. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <span className="flex items-center hover:text-primary cursor-default transition-colors"><Leaf className="h-3 w-3 mr-1" /> 科技助力环保</span>
            <span className="flex items-center hover:text-accent-warm cursor-default transition-colors"><ArrowUpRight className="h-3 w-3 mr-1" /> 为地球减负</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
