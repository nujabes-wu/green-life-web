'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import { LogOut } from 'lucide-react';
import { AuthDialog } from './AuthDialog';

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/80 hidden md:inline">{user.email}</span>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-white/20">
          <LogOut className="h-4 w-4 mr-2" />
          退出
        </Button>
      </div>
    );
  }

  return <AuthDialog />;
}
