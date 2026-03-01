'use client';

import React from 'react';
import { motion } from 'framer-motion';

const RecycleElf: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={{ y: 0, rotate: 0 }}
      animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* 翅膀 */}
        <motion.path 
          d="M60 100 C20 80, 20 40, 60 60" 
          fill="#E8F5E9" 
          stroke="#81C784" 
          strokeWidth="2"
          animate={{ rotate: [-10, 10, -10] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        <motion.path 
          d="M140 100 C180 80, 180 40, 140 60" 
          fill="#E8F5E9" 
          stroke="#81C784" 
          strokeWidth="2"
          animate={{ rotate: [10, -10, 10] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        
        {/* 身体 */}
        <circle cx="100" cy="110" r="45" fill="#A5D6A7" stroke="#2E7D32" strokeWidth="3" />
        
        {/* 头部 */}
        <circle cx="100" cy="70" r="30" fill="#C8E6C9" stroke="#2E7D32" strokeWidth="2" />
        
        {/* 叶子耳朵 */}
        <path d="M80 50 Q70 20 100 45" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" />
        <path d="M120 50 Q130 20 100 45" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" />
        
        {/* 眼睛 */}
        <circle cx="90" cy="70" r="4" fill="#333" />
        <circle cx="110" cy="70" r="4" fill="#333" />
        
        {/* 嘴巴 */}
        <path d="M90 80 Q100 90 110 80" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        
        {/* 装饰叶子 */}
        <path d="M100 110 L100 140 M100 120 L80 130 M100 125 L120 135" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
};

export default RecycleElf;
