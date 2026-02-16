'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AuthButton } from './AuthButton';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/calculator', label: '碳足迹' },
  { href: '/recommendations', label: '消费建议' },
  { href: '/ai-recycle', label: 'AI回收' },
  { href: '/eco-advisor', label: 'AI顾问' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-primary via-[#388E3C] to-[#43A047] text-primary-foreground shadow-md backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto max-w-6xl">
        <Link className="flex items-center gap-2 font-bold text-xl group" href="/">
          <div className="bg-white text-primary p-1.5 rounded-full group-hover:bg-dopamine-orange group-hover:text-white transition-colors duration-300 shadow-sm">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="tracking-tight">绿色生活</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                pathname === item.href
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
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
            className="md:hidden border-t border-white/10 bg-primary-dark overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-white/10">
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
