import React, { useState, useEffect, useRef } from 'react';
import { GlassCard, Button, Input } from '../components/ui';
import { Settings, LayoutTemplate, Palette, Cpu, Eye, Zap, AlertTriangle, Terminal, Play, Pause, RotateCcw, Download, Shield, Database, Sun, Moon, Monitor, Server, Save } from 'lucide-react';
import { useTheme, BrandColor, FontFamily } from '../context/ThemeContext';

interface LogEntry {
  id: number;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  source: string;
}

export const System: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'interface' | 'ai' | 'database' | 'logs'>('general');
  const { theme, setTheme, brandColor, setBrandColor, fontFamily, setFontFamily } = useTheme();
  
  // Logs State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLogPaused, setIsLogPaused] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'general', label: 'Thông tin chung', icon: Settings },
    { id: 'ai', label: 'AI & Phân tích', icon: Cpu },
    { id: 'database', label: 'Cơ sở dữ liệu', icon: Database },
    { id: 'logs', label: 'Nhật ký hệ thống', icon: Terminal },
    { id: 'interface', label: 'Giao diện', icon: LayoutTemplate },
  ];

  const colors: { id: BrandColor; bg: string; label: string }[] = [
     { id: 'lime', bg: 'bg-lime-500', label: 'Lime' },
     { id: 'blue', bg: 'bg-blue-500', label: 'Blue' },
     { id: 'purple', bg: 'bg-purple-500', label: 'Purple' },
     { id: 'orange', bg: 'bg-orange-500', label: 'Orange' },
     { id: 'cyan', bg: 'bg-cyan-500', label: 'Cyan' },
  ];

  const fonts: { id: FontFamily; label: string; fontClass: string }[] = [
    { id: 'jakarta', label: 'Plus Jakarta', fontClass: 'font-sans' },
    { id: 'inter', label: 'Inter', fontClass: 'font-[Inter]' },
    { id: 'roboto', label: 'Roboto', fontClass: 'font-[Roboto]' },
  ];

  // Mock Log Generator
  useEffect(() => {
    if (activeTab !== 'logs' || isLogPaused) return;

    const interval = setInterval(() => {
      const levels: LogEntry['level'][] = ['INFO', 'INFO', 'INFO', 'WARN', 'DEBUG'];
      const sources = ['System', 'Camera-01', 'Database', 'Auth', 'LPR-Engine'];
      const messages = [
        'Kiểm tra kết nối thành công',
        'Đang xử lý khung hình 10244...',
        'Phiên làm việc admin được làm mới',
        'Đồng bộ dữ liệu lên cloud...',
        'Kiểm tra độ trễ: 12ms',
        'Phát hiện xe trong vùng ROI'
      ];

      const newLog: LogEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        level: levels[Math.floor(Math.random() * levels.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        message: messages[Math.floor(Math.random() * messages.length)]
      };

      setLogs(prev => [...prev.slice(-100), newLog]);
    }, 1500);

    return () => clearInterval(interval);
  }, [activeTab, isLogPaused]);

  // Auto scroll logs
  useEffect(() => {
    if (!isLogPaused) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isLogPaused]);

  return (
    <div className="space-y-6 animate-fade-in text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cài đặt Hệ thống</h2>
           <p className="text-gray-500 dark:text-gray-400 text-sm">Cấu hình tham số bãi xe, giao diện và phần cứng.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Tabs */}
        <GlassCard className="lg:w-64 p-2 h-fit flex flex-row lg:flex-col gap-1 overflow-x-auto shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20 font-bold' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </GlassCard>

        {/* Content Area */}
        <div className="flex-1 min-w-0">

           {/* GENERAL TAB */}
           {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Settings size={20}/> Thông tin Bãi xe</h3>
                <div className="space-y-4">
                  <Input label="Tên Bãi Xe" defaultValue="THU A" />
                  <Input label="Địa chỉ" defaultValue="123 Tech Avenue, Innovation District" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Tổng chỗ Ô tô" defaultValue="200" type="number"/>
                    <Input label="Tổng chỗ Xe máy" defaultValue="800" type="number"/>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-black/40 text-primary-500 focus:ring-primary-500" defaultChecked />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Bật sao lưu tự động</span>
                  </div>
                  <Button className="w-full mt-4"><Save size={16}/> Cập nhật thông tin</Button>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Shield size={20}/> Bảo mật & Chính sách</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Hết hạn đăng nhập</span>
                      <select className="bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded px-2 py-1 text-sm"><option>12 Giờ</option><option>24 Giờ</option></select>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Xoay vòng mật khẩu</span>
                      <select className="bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded px-2 py-1 text-sm"><option>90 Ngày</option><option>Không bao giờ</option></select>
                   </div>
                   <div className="pt-4 border-t border-gray-200 dark:border-white/10 mt-4">
                      <Button variant="danger" className="w-full">Khởi động lại dịch vụ</Button>
                   </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* DATABASE TAB */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <GlassCard className="p-6">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                   <Database size={20} className="text-primary-500"/> Kết nối Cơ sở dữ liệu
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <Input label="Host" defaultValue="localhost" />
                       <Input label="Port" defaultValue="5432" />
                       <Input label="Tên Database" defaultValue="weihu_parking_db" />
                    </div>
                    <div className="space-y-4">
                       <Input label="Username" defaultValue="admin_pg" />
                       <Input label="Mật khẩu" type="password" defaultValue="********" />
                       <div className="pt-6">
                          <Button variant="secondary" className="w-full">Kiểm tra kết nối</Button>
                       </div>
                    </div>
                 </div>
              </GlassCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <GlassCard className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Đồng bộ Cloud</h3>
                    <p className="text-sm text-gray-500 mb-4">Tự động đồng bộ dữ liệu giao dịch lên Weihu Cloud để báo cáo tập trung.</p>
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                       <span className="text-sm font-bold text-green-600 dark:text-green-400">Đang đồng bộ (Cuối: 2 phút trước)</span>
                    </div>
                    <Button className="w-full">Cấu hình Cloud API</Button>
                 </GlassCard>

                 <GlassCard className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Sao lưu & Khôi phục</h3>
                    <div className="space-y-3">
                       <Button variant="secondary" className="w-full justify-between">
                          <span>Tạo bản sao lưu cục bộ</span>
                          <Download size={16}/>
                       </Button>
                       <Button variant="secondary" className="w-full justify-between">
                          <span>Khôi phục từ tệp</span>
                          <RotateCcw size={16}/>
                       </Button>
                    </div>
                 </GlassCard>
              </div>
            </div>
          )}

          {/* LOGS TAB */}
          {activeTab === 'logs' && (
            <GlassCard className="p-0 flex flex-col h-[600px] overflow-hidden bg-[#0d1117] dark:bg-black border-gray-800">
               <div className="flex items-center justify-between p-3 bg-gray-900 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                     <Terminal size={16} className="text-gray-400"/>
                     <span className="text-sm font-mono font-bold text-gray-300">System Console</span>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => setLogs([])} className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-white"><RotateCcw size={14}/></button>
                     <button onClick={() => setIsLogPaused(!isLogPaused)} className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-white">
                        {isLogPaused ? <Play size={14}/> : <Pause size={14}/>}
                     </button>
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1">
                  {logs.length === 0 && <div className="text-gray-600 italic">Đang chờ log...</div>}
                  {logs.map((log) => (
                     <div key={log.id} className="flex gap-3 hover:bg-white/5 p-0.5 rounded">
                        <span className="text-gray-500 shrink-0">{log.timestamp.split('T')[1].slice(0, 12)}</span>
                        <span className={`shrink-0 w-12 font-bold ${
                           log.level === 'INFO' ? 'text-green-500' :
                           log.level === 'WARN' ? 'text-yellow-500' :
                           log.level === 'ERROR' ? 'text-red-500' : 'text-blue-500'
                        }`}>{log.level}</span>
                        <span className="text-purple-400 shrink-0 w-24">[{log.source}]</span>
                        <span className="text-gray-300">{log.message}</span>
                     </div>
                  ))}
                  <div ref={logsEndRef}></div>
               </div>
            </GlassCard>
          )}

          {/* AI TAB */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Cpu size={20} className="text-primary-500"/> Cấu hình AI Engine
                </h3>
                
                <div className="space-y-8">
                  {/* LPR Threshold */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Ngưỡng tin cậy LPR</label>
                      <span className="text-primary-500 font-mono font-bold">85%</span>
                    </div>
                    <input type="range" className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500" min="50" max="99" defaultValue="85"/>
                    <p className="text-xs text-gray-500 mt-2">Biển số có điểm tin cậy thấp hơn mức này sẽ yêu cầu xác nhận thủ công.</p>
                  </div>

                  <div className="h-px bg-gray-200 dark:bg-white/10"></div>

                  {/* Toggles */}
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-800 dark:text-gray-200">So khớp mờ (Fuzzy Matching)</p>
                          <p className="text-xs text-gray-500">Cho phép sai khác 1 ký tự đối với xe đăng ký tháng.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                        </label>
                     </div>

                     <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-800 dark:text-gray-200">Nhận diện Hãng/Dòng xe</p>
                          <p className="text-xs text-gray-500">Xác định hãng xe (Toyota, Honda) và loại xe.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                        </label>
                     </div>
                  </div>
                </div>
              </GlassCard>

              {/* ROI Setting Mock */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <GlassCard className="p-6">
                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 flex items-center gap-2"><Eye size={16}/> Vùng quan tâm (ROI)</h3>
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 group cursor-crosshair">
                       <img src="https://picsum.photos/seed/traffic/600/350" alt="ROI Config" className="w-full opacity-60" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="border-2 border-primary-500 bg-primary-500/10 w-2/3 h-1/2 relative">
                             <div className="absolute -top-3 -left-3 w-4 h-4 bg-primary-500 rounded-full"></div>
                             <div className="absolute -top-3 -right-3 w-4 h-4 bg-primary-500 rounded-full"></div>
                             <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-primary-500 rounded-full"></div>
                             <div className="absolute -bottom-3 -right-3 w-4 h-4 bg-primary-500 rounded-full"></div>
                             <span className="absolute bottom-2 right-2 text-xs bg-black/70 text-white px-2 py-0.5 rounded">Làn Vào</span>
                          </div>
                       </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                       <Button variant="secondary" className="text-xs">Đặt lại ROI</Button>
                    </div>
                 </GlassCard>

                 <GlassCard className="p-6">
                   <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 flex items-center gap-2"><Zap size={16}/> Chế độ hiệu năng</h3>
                   <div className="flex gap-4 mb-6">
                      <div className="flex-1 p-3 border-2 border-primary-500 bg-primary-500/5 rounded-xl cursor-pointer">
                         <div className="font-bold text-primary-500 text-sm mb-1">Cân bằng</div>
                         <p className="text-xs text-gray-500">Tối ưu cho phần cứng chuẩn. Phân tích 15-20 FPS.</p>
                      </div>
                      <div className="flex-1 p-3 border border-gray-200 dark:border-white/10 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5">
                         <div className="font-bold text-gray-700 dark:text-gray-300 text-sm mb-1">Độ chính xác cao</div>
                         <p className="text-xs text-gray-500">Yêu cầu GPU. Phân tích sâu các góc khó.</p>
                      </div>
                   </div>
                   <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3">
                      <AlertTriangle className="text-yellow-600 dark:text-yellow-500 shrink-0" size={20} />
                      <p className="text-xs text-yellow-700 dark:text-yellow-500/80">Thay đổi mô hình nhận diện yêu cầu khởi động lại hệ thống. Dịch vụ có thể gián đoạn trong 30 giây.</p>
                   </div>
                 </GlassCard>
              </div>
            </div>
          )}

          {/* INTERFACE TAB */}
          {activeTab === 'interface' && (
             <GlassCard className="p-6">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                 <LayoutTemplate size={20} className="text-primary-500"/> Cài đặt Giao diện
               </h3>

               <div className="space-y-8">
                 <div>
                   <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-white/10 pb-2 mb-4">Giao diện màu</h4>
                   <div className="grid grid-cols-3 gap-4">
                     
                     <button 
                        onClick={() => setTheme('light')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${
                          theme === 'light' 
                          ? 'bg-primary-500/10 border-primary-500 text-primary-500 ring-2 ring-primary-500/20' 
                          : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 hover:border-gray-300 dark:hover:border-white/20'
                        }`}
                     >
                        <Sun size={32} />
                        <span className="font-bold text-sm">Sáng</span>
                     </button>

                     <button 
                        onClick={() => setTheme('dark')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${
                          theme === 'dark' 
                          ? 'bg-primary-500/10 border-primary-500 text-primary-500 ring-2 ring-primary-500/20' 
                          : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 hover:border-gray-300 dark:hover:border-white/20'
                        }`}
                     >
                        <Moon size={32} />
                        <span className="font-bold text-sm">Tối</span>
                     </button>

                     <button 
                        onClick={() => setTheme('system')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${
                          theme === 'system' 
                          ? 'bg-primary-500/10 border-primary-500 text-primary-500 ring-2 ring-primary-500/20' 
                          : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 hover:border-gray-300 dark:hover:border-white/20'
                        }`}
                     >
                        <Monitor size={32} />
                        <span className="font-bold text-sm">Hệ thống</span>
                     </button>

                   </div>
                 </div>

                 {/* BRAND COLOR */}
                 <div>
                    <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-white/10 pb-2 mb-4">Màu chủ đạo</h4>
                    <div className="flex flex-wrap gap-4">
                       {colors.map((color) => (
                         <button
                           key={color.id}
                           onClick={() => setBrandColor(color.id)}
                           className={`group relative w-14 h-14 rounded-full flex items-center justify-center transition-all ${brandColor === color.id ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white scale-110' : 'hover:scale-105'}`}
                         >
                           <div className={`w-full h-full rounded-full ${color.bg} shadow-lg`}></div>
                           {brandColor === color.id && (
                             <div className="absolute inset-0 flex items-center justify-center text-white">
                               <Palette size={20} />
                             </div>
                           )}
                           <span className="absolute -bottom-6 text-xs font-medium text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{color.label}</span>
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* FONT FAMILY */}
                 <div>
                    <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-white/10 pb-2 mb-4">Kiểu chữ (Font)</h4>
                    <div className="grid grid-cols-3 gap-4">
                       {fonts.map((font) => (
                         <button
                           key={font.id}
                           onClick={() => setFontFamily(font.id)}
                           className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                             fontFamily === font.id
                             ? 'bg-primary-500/10 border-primary-500 text-primary-500 ring-2 ring-primary-500/20' 
                             : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 hover:border-gray-300 dark:hover:border-white/20'
                           }`}
                         >
                           <div className="text-2xl font-bold mb-1">Ag</div>
                           <span className={`text-sm ${font.fontClass}`}>{font.label}</span>
                         </button>
                       ))}
                    </div>
                 </div>
               </div>
             </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};