'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SmartTrashBotProps {
  emotion?: 'happy' | 'thinking' | 'surprise' | 'sleep';
  className?: string;
}

const SmartTrashBot: React.FC<SmartTrashBotProps> = ({ emotion = 'happy', className = "" }) => {
  const eyeVariants = {
    happy: { scaleY: 1, opacity: 1, y: 0, scaleX: 1 },
    thinking: { scaleY: 0.5, y: 2, opacity: 1, scaleX: 1 },
    surprise: { scaleY: 1.2, scaleX: 1.2, opacity: 1, y: 0 },
    sleep: { scaleY: 0.1, opacity: 0.6, y: 0, scaleX: 1 },
  };

  const initialEyeState = { scaleY: 1, opacity: 1, y: 0, scaleX: 1 };

  const bodyVariants = {
    happy: { rotate: [0, -2, 2, 0], transition: { repeat: Infinity, duration: 2 } },
    thinking: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 3 } },
    surprise: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 1 } },
    sleep: { scale: [1, 0.98, 1], transition: { repeat: Infinity, duration: 4 } },
  };

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      variants={bodyVariants}
      initial="happy"
      animate={emotion}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* 阴影 */}
        <ellipse cx="100" cy="180" rx="40" ry="10" fill="rgba(0,0,0,0.1)" />
        
        {/* 机器人身体 */}
        <motion.rect 
          x="60" y="70" width="80" height="100" rx="20" 
          fill="#4CAF50" 
          stroke="#2E7D32" 
          strokeWidth="4"
        />
        
        {/* 盖子 */}
        <rect x="55" y="60" width="90" height="15" rx="7" fill="#81C784" stroke="#2E7D32" strokeWidth="3" />
        
        {/* LED眼睛背景 */}
        <rect x="75" y="95" width="50" height="30" rx="10" fill="#1B5E20" />
        
        {/* LED眼睛 */}
        <motion.circle 
          cx="88" cy="110" r="6" 
          fill="#A5D6A7" 
          variants={eyeVariants}
          initial={initialEyeState}
          animate={emotion}
        />
        <motion.circle 
          cx="112" cy="110" r="6" 
          fill="#A5D6A7" 
          variants={eyeVariants}
          initial={initialEyeState}
          animate={emotion}
        />
        
        {/* 回收标志 */}
        <g transform="translate(100, 145) scale(0.6)">
          <path 
            d="M0 -20 L17 10 L-17 10 Z" 
            fill="none" 
            stroke="white" 
            strokeWidth="4" 
            strokeLinejoin="round"
          />
          <path d="M-5 0 L0 5 L5 0" fill="none" stroke="white" strokeWidth="2" />
        </g>

        {/* 腮红 - 仅在开心时显示 */}
        {emotion === 'happy' && (
          <>
            <circle cx="75" cy="120" r="4" fill="#FFCDD2" opacity="0.6" />
            <circle cx="125" cy="120" r="4" fill="#FFCDD2" opacity="0.6" />
          </>
        )}
      </svg>
    </motion.div>
  );
};

export default SmartTrashBot;
