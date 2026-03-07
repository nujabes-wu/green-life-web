'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AuthButton } from './AuthButton';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/calculator', label: '碳足迹' },
  { href: '/recommendations', label: '消费建议' },
  { href: '/community', label: '环保社区' },
  { href: '/ai-recycle', label: 'AI回收' },
  { href: '/eco-advisor', label: 'AI顾问' },
  { href: '/profile', label: '个人中心' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-brand text-primary-foreground shadow-md backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto max-w-6xl">
        <Link className="flex items-center gap-2 font-bold text-xl group text-white" href="/">
          <div className="relative h-10 w-10 bg-white rounded-full group-hover:bg-accent-warm transition-colors duration-300 shadow-sm overflow-hidden flex items-center justify-center">
            <Image 
              src="/logo.svg" 
              alt="绿色生活 Logo" 
              fill 
              className="object-contain scale-125 transition-transform duration-500 group-hover:scale-150"
            />
          </div>
          <span className="tracking-tight">绿色生活</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-1 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-colors text-white",
                pathname === item.href
                  ? "bg-white/20 font-bold shadow-sm"
                  : "hover:bg-white/10 hover:shadow-sm"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <AuthButton />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-primary overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium rounded-lg transition-colors text-white",
                    pathname === item.href
                      ? "bg-white/20"
                      : "hover:bg-white/10"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-2">
                 <div className="flex justify-center">
                    <AuthButton />
                 </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
