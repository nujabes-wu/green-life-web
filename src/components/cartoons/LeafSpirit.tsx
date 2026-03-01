'use client';

import React from 'react';
import { motion } from 'framer-motion';

const LeafSpirit: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={{ scale: 1, rotate: 0 }}
      animate={{ 
        scale: [1, 1.1, 1],
        rotate: [0, 10, -10, 0]
      }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* 叶子身体 */}
        <motion.path 
          d="M100 40 Q150 100 100 160 Q50 100 100 40" 
          fill="#81C784" 
          stroke="#2E7D32" 
          strokeWidth="3"
        />
        
        {/* 叶脉 */}
        <path d="M100 40 L100 160 M100 60 L130 90 M100 80 L70 110 M100 100 L130 130 M100 120 L70 150" stroke="white" strokeWidth="2" opacity="0.6" />
        
        {/* 眼睛 */}
        <circle cx="85" cy="90" r="5" fill="#333" />
        <circle cx="115" cy="90" r="5" fill="#333" />
        
        {/* 嘴巴 */}
        <circle cx="100" cy="105" r="4" fill="#FFCDD2" />
        
        {/* 手 */}
        <motion.path 
          d="M70 100 Q50 90 40 110" 
          fill="none" 
          stroke="#2E7D32" 
          strokeWidth="3" 
          strokeLinecap="round"
          animate={{ rotate: [0, -20, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.path 
          d="M130 100 Q150 90 160 110" 
          fill="none" 
          stroke="#2E7D32" 
          strokeWidth="3" 
          strokeLinecap="round"
          animate={{ rotate: [0, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
};

export default LeafSpirit;
