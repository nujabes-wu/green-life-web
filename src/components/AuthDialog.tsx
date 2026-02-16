'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    
    let error: any = null;
    
    if (isSignUp) {
      // 注册新用户
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      error = signUpError;
    } else {
      // 登录现有用户
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      error = signInError;
    }

    if (error) {
      toast.error('操作失败: ' + error.message);
    } else {
      const message = isSignUp ? '注册成功！' : '登录成功！';
      toast.success(message, {
        duration: 3000,
      });
      onOpenChange(false);
      setEmail('');
      setPassword('');
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isSignUp ? '注册账号' : '登录账号'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">邮箱地址</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入您的邮箱"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入您的密码"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? '处理中...' : isSignUp ? '注册' : '登录'}
            </Button>
          </DialogFooter>
          <p className="text-sm text-gray-500 text-center">
            {isSignUp ? '已有账号？' : '还没有账号？'}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline ml-1"
            >
              {isSignUp ? '去登录' : '去注册'}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
