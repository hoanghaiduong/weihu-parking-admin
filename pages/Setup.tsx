import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Input, Checkbox } from '../components/ui';
import { Database, User, CheckCircle2, Server, ArrowRight, Loader2, HardDrive, FastForward } from 'lucide-react';

interface SetupProps {
  onComplete: () => void;
}

export const Setup: React.FC<SetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Terminal Logs for simulation
  const [logs, setLogs] = useState<string[]>([]);

  // DEV MODE SKIP
  // In a real app, check process.env.NODE_ENV === 'development'
  const isDevMode = true; 
  
  const handleNext = () => {
    setLoading(true);
    // Simulate check
    setTimeout(() => {
      setLoading(false);
      setStep(prev => prev + 1);
    }, 800);
  };

  const handleInstall = () => {
    setLoading(true);
    const installationSteps = [
      "Khởi tạo kết nối cơ sở dữ liệu...",
      "Tạo schema 'public'...",
      "Khởi tạo dữ liệu mẫu (Vai trò, Quyền)...",
      "Tạo khóa RSA cho xác thực...",
      "Cấu hình AI LPR Engine...",
      "Cài đặt hoàn tất."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i >= installationSteps.length) {
        clearInterval(interval);
        setTimeout(() => {
            setLoading(false);
            onComplete();
        }, 1000);
        return;
      }
      setLogs(prev => [...prev, installationSteps[i]]);
      i++;
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden text-gray-900 dark:text-gray-100">
      {/* Mesh Background */}
      <div className="mesh-bg" />

      {/* DEV SKIP BUTTON */}
      {isDevMode && (
        <button 
          onClick={onComplete}
          className="fixed top-4 right-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg font-mono text-xs font-bold border border-white/20 hover:bg-primary-500 transition-colors flex items-center gap-2 shadow-xl"
        >
          <FastForward size={14} /> [DEV] SKIP SETUP
        </button>
      )}

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left: Progress Sidebar */}
        <GlassCard className="p-6 md:col-span-1 h-fit">
          <div className="mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 mb-3">
               <Server className="text-white" size={20} />
            </div>
            <h2 className="font-bold text-xl">Cài đặt Hệ thống</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Cấu hình ban đầu</p>
          </div>

          <div className="space-y-6 relative">
            {/* Connecting Line */}
            <div className="absolute left-3.5 top-2 bottom-2 w-px bg-gray-200 dark:bg-white/10 -z-10"></div>
            
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`flex items-center gap-4 ${step === s ? 'opacity-100' : step > s ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                  ${step === s 
                    ? 'border-primary-500 text-primary-500 bg-white dark:bg-black' 
                    : step > s 
                    ? 'bg-primary-500 border-primary-500 text-white' 
                    : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  {step > s ? <CheckCircle2 size={16} /> : s}
                </div>
                <div className="font-medium text-sm">
                  {s === 1 && "Chào mừng"}
                  {s === 2 && "Cơ sở dữ liệu"}
                  {s === 3 && "Tài khoản Admin"}
                  {s === 4 && "Cài đặt"}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Right: Content */}
        <GlassCard className="p-8 md:col-span-2 min-h-[400px] flex flex-col justify-between">
          
          {/* STEP 1: Welcome */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-bold mb-4">Chào mừng đến với Weihu Parking</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Cảm ơn bạn đã lựa chọn Hệ thống Quản lý Bãi xe Weihu. Trình hướng dẫn này sẽ giúp bạn cấu hình máy chủ, kết nối cơ sở dữ liệu và tạo tài khoản quản trị viên.
              </p>
              <div className="bg-primary-500/5 border border-primary-500/10 p-4 rounded-xl mb-6">
                <h4 className="font-bold text-primary-600 dark:text-primary-500 mb-2 text-sm uppercase">Yêu cầu tiên quyết</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>PostgreSQL Database (v14+)</li>
                  <li>Redis Server (cho Caching)</li>
                  <li>Quyền ghi vào thư mục <code>/etc/weihu/</code></li>
                </ul>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleNext}>Bắt đầu Cấu hình <ArrowRight size={16}/></Button>
              </div>
            </div>
          )}

          {/* STEP 2: Database */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Database size={20}/> Cấu hình Database</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input label="Host" defaultValue="localhost" />
                <Input label="Port" defaultValue="5432" />
              </div>
              <Input label="Tên Database" defaultValue="weihu_parking_db" className="mb-4" />
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Input label="Username" defaultValue="postgres" />
                <Input label="Mật khẩu" type="password" defaultValue="password" />
              </div>
              
              <div className="flex justify-between mt-auto">
                <Button variant="secondary" onClick={() => setStep(1)}>Quay lại</Button>
                <Button onClick={handleNext} isLoading={loading}>Tiếp theo</Button>
              </div>
            </div>
          )}

          {/* STEP 3: Admin Account */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><User size={20}/> Tạo Superadmin</h3>
              <div className="space-y-4 mb-6">
                <Input label="Họ tên" defaultValue="Quản trị viên Hệ thống" />
                <Input label="Email" defaultValue="admin@weihu.com" type="email" />
                <Input label="Mật khẩu" type="password" defaultValue="Secret123!" />
                <Checkbox label="Tôi đồng ý với Thỏa thuận cấp phép người dùng cuối" checked={true} />
              </div>
              
              <div className="flex justify-between mt-auto">
                <Button variant="secondary" onClick={() => setStep(2)}>Quay lại</Button>
                <Button onClick={handleNext} isLoading={loading}>Tạo Tài khoản</Button>
              </div>
            </div>
          )}

          {/* STEP 4: Installation */}
          {step === 4 && (
            <div className="animate-fade-in h-full flex flex-col">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><HardDrive size={20}/> Đang cài đặt hệ thống</h3>
              
              {/* Terminal */}
              <div className="flex-1 bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-y-auto mb-6 shadow-inner border border-gray-800">
                <p className="text-gray-500 mb-2"># Initializing setup wizard v2.4.0...</p>
                {logs.map((log, idx) => (
                  <p key={idx} className="mb-1">
                    <span className="text-blue-400">➜</span> {log}
                  </p>
                ))}
                {loading && <span className="animate-pulse">_</span>}
              </div>

              <div className="flex justify-end">
                {logs.length === 0 ? (
                   <Button onClick={handleInstall} className="w-full">Chạy Cài đặt</Button>
                ) : (
                   <Button disabled={loading} onClick={onComplete} className="w-full" variant={loading ? 'secondary' : 'primary'}>
                      {loading ? 'Đang cài đặt...' : 'Đến trang Đăng nhập'}
                   </Button>
                )}
              </div>
            </div>
          )}

        </GlassCard>
      </div>
    </div>
  );
};