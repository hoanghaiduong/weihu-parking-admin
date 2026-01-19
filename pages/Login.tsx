import React, { useState } from 'react';
import { GlassCard, Button, Input, Checkbox } from '../components/ui';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Global Mesh Background */}
      <div className="mesh-bg" />

      {/* Background Blob Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>

      <GlassCard className="w-full max-w-md p-8 relative z-10 border-gray-200 dark:border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary-500/20 mb-4">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Chào mừng trở lại</h1>
          <p className="text-gray-500 dark:text-gray-400">Đăng nhập hệ thống quản trị Weihu Parking</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Tên đăng nhập" 
            placeholder="admin@weihu.com" 
            type="email"
            required
            defaultValue="admin@weihu.com" // Mock Data
            className="focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-black/30"
          />
          <Input 
            label="Mật khẩu" 
            placeholder="••••••••" 
            type="password"
            required
            defaultValue="password123" // Mock Data
            className="focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-black/30"
          />
          
          <div className="flex items-center justify-between text-sm">
            <Checkbox 
              label="Ghi nhớ đăng nhập" 
              checked={rememberMe} 
              onChange={setRememberMe} 
            />
            <a href="#" className="text-primary-500 hover:underline font-medium">Quên mật khẩu?</a>
          </div>

          <Button type="submit" className="w-full h-12 text-base shadow-primary-500/25" isLoading={loading}>
            Truy cập hệ thống <ArrowRight size={18} />
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">Phiên bản v2.4.0 • Bảo mật bởi Weihu Access</p>
        </div>
      </GlassCard>
    </div>
  );
};