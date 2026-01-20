import React, { useState, useEffect, useRef } from 'react';
import { GlassCard, Button, Input, Badge } from '../components/ui';
import { LprResult, VehicleType, ActivityLog } from '../types';
import { RefreshCw, AlertOctagon, CheckCircle2, MoreHorizontal, Settings, Mic, Activity, Clock, Camera, History, FileText, AlertTriangle, ScanLine, MonitorPlay, RotateCcw } from 'lucide-react';

const MOCK_PLATES = ['59T1-123.45', '30A-999.88', '51H-456.78', '60C-111.22', '29E-555.99'];

// Realistic Image Sources (Specific Unsplash IDs for reliability)
const CAR_IMAGES = [
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600', // White car rear
  'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=600', // Dark car parking
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=600', // Mustang
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=600', // Car front
];

// CCTV View: Parking entrance / Garage view
const CCTV_FEED_URL = 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=1200';

export const LiveLane: React.FC = () => {
  const [activeLane, setActiveLane] = useState<'Entry' | 'Exit'>('Entry');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lprData, setLprData] = useState<LprResult | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [recentSnapshots, setRecentSnapshots] = useState<{id: number, url: string, time: string}[]>([]);
  
  // Ref for auto-scrolling logs
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Clock Timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (message: string, type: ActivityLog['type'] = 'info') => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString(),
      message,
      type
    };
    setLogs(prev => [...prev.slice(-10), newLog]); // Keep last 10
  };

  const simulateArrival = () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    addLog(`Phát hiện chuyển động tại vòng từ ${activeLane}`, 'info');

    setTimeout(() => {
      const randomPlate = MOCK_PLATES[Math.floor(Math.random() * MOCK_PLATES.length)];
      const isCar = Math.random() > 0.3;
      const confidence = 0.85 + Math.random() * 0.14;
      // Select a random real car image
      const imageUrl = CAR_IMAGES[Math.floor(Math.random() * CAR_IMAGES.length)];
      
      const result: LprResult = {
        plate: randomPlate,
        confidence: confidence,
        vehicleType: isCar ? VehicleType.CAR : VehicleType.MOTORBIKE,
        capturedAt: new Date().toLocaleTimeString(),
        isWhitelist: Math.random() > 0.5,
        imageUrl: imageUrl
      };

      setLprData(result);
      setIsProcessing(false);
      addLog(`Nhận diện biển số: ${randomPlate} (${Math.round(confidence * 100)}%)`, result.isWhitelist ? 'success' : 'warning');
      
      // Add to recent snapshots
      setRecentSnapshots(prev => [
        { id: Date.now(), url: imageUrl, time: result.capturedAt },
        ...prev.slice(0, 3)
      ]);
    }, 1500);
  };

  useEffect(() => {
    // Initial simulation
    simulateArrival();
  }, []);

  const handleOpenBarrier = () => {
    addLog(`Lệnh mở Barrier từ vận hành viên`, 'success');
    addLog(`Trạng thái Barrier: MỞ`, 'success');
    setTimeout(() => {
       setLprData(null); // Clear after vehicle passes
       addLog(`Vòng từ trống. Chờ xe tiếp theo.`, 'info');
    }, 2000);
  };

  const handleReject = () => {
     addLog(`Từ chối vào cho xe ${lprData?.plate}`, 'error');
     setLprData(null);
  };

  const handleIncident = () => {
    addLog(`Tạo báo cáo sự cố tại ${activeLane}`, 'warning');
  };

  const handleRecapture = () => {
    addLog(`Yêu cầu chụp lại thủ công`, 'info');
    simulateArrival();
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4 animate-fade-in text-gray-900 dark:text-gray-100">
      {/* Header Controls */}
      <div className="flex justify-between items-center bg-white/60 dark:bg-gray-900/40 p-2 rounded-xl border border-gray-200 dark:border-white/5 backdrop-blur-sm shadow-sm dark:shadow-none transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 dark:bg-black/40 p-1 rounded-lg border border-gray-200 dark:border-white/5 transition-colors">
            <button 
              onClick={() => setActiveLane('Entry')}
              className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeLane === 'Entry' ? 'bg-primary-500 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              Làn Vào 01
            </button>
            <button 
              onClick={() => setActiveLane('Exit')}
              className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeLane === 'Exit' ? 'bg-primary-500 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              Làn Ra 02
            </button>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-black/30 rounded-lg border border-gray-200 dark:border-white/5 transition-colors">
             <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-primary-500'}`}></div>
             <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{isProcessing ? 'ĐANG XỬ LÝ AI...' : 'HỆ THỐNG SẴN SÀNG'}</span>
          </div>
        </div>
        <div className="flex gap-2">
           <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-black/20 rounded-lg border border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 text-xs font-mono transition-colors">
              <Clock size={14} /> {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
           </div>
           <Button variant="secondary" onClick={handleIncident} className="text-yellow-600 dark:text-yellow-500 border-yellow-200 dark:border-yellow-500/20 bg-yellow-50 dark:bg-transparent hover:bg-yellow-100 dark:hover:bg-yellow-500/10">
              <AlertTriangle size={18} /> <span className="hidden md:inline">Sự cố</span>
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Live Video Feed (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4 min-h-0">
          {/* Main Video Card */}
          <GlassCard className="flex-1 relative overflow-hidden bg-black flex items-center justify-center group border-white/10 shadow-2xl">
            {/* Live Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-red-600/90 backdrop-blur rounded-md text-white text-xs font-bold uppercase tracking-wider animate-pulse shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              TRỰC TIẾP
            </div>
            
            {/* Camera Overlay Info */}
            <div className="absolute top-4 right-4 z-10 text-right bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10">
              <p className="text-xs font-mono text-primary-500 font-bold mb-0.5">CAM-01 [1080p]</p>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400">
                 <MonitorPlay size={10} /> 30 FPS • 12mbps
              </div>
            </div>

            {/* Simulated Live Feed */}
            <div className="w-full h-full relative">
               <img 
                 src={CCTV_FEED_URL}
                 alt="Live Feed" 
                 className="w-full h-full object-cover opacity-80"
               />
               
               {/* Scanning Line Effect */}
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/10 to-transparent animate-[scan_3s_ease-in-out_infinite] pointer-events-none"></div>
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>
            
            {/* AI Reticle Overlay */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 
              ${isProcessing ? 'w-64 h-32 opacity-100 scale-100' : 'w-72 h-40 opacity-0 scale-110'}`}>
               
               {/* Corners */}
               <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary-500"></div>
               <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary-500"></div>
               <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary-500"></div>
               <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary-500"></div>

               {/* Center Crosshair */}
               <div className="w-full h-px bg-primary-500/30 absolute top-1/2 -translate-y-1/2"></div>
               <div className="h-full w-px bg-primary-500/30 absolute left-1/2 -translate-x-1/2"></div>
               
               <div className="absolute -top-8 left-0 text-primary-500 text-xs font-mono font-bold bg-black/80 px-2 py-1 rounded border border-primary-500/30 flex items-center gap-2">
                 <ScanLine size={12} className="animate-spin" /> ĐANG PHÂN TÍCH...
               </div>
            </div>

            {/* Recent Logs Overlay */}
            <div className="absolute bottom-4 left-4 z-10 w-96 max-h-48 flex flex-col-reverse pointer-events-none">
              <div className="bg-white/80 dark:bg-black/70 backdrop-blur-md rounded-xl p-4 border border-gray-200 dark:border-white/10 shadow-xl pointer-events-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3 border-b border-gray-200 dark:border-white/10 pb-2">
                   <Activity size={14} /> Nhật ký hoạt động
                </div>
                <div className="space-y-2 overflow-y-auto max-h-32 pr-2 custom-scrollbar">
                  {logs.map((log) => (
                    <div key={log.id} className="flex gap-3 text-xs font-mono animate-fade-in border-l-2 border-gray-200 dark:border-white/5 pl-2 py-0.5">
                       <span className="text-gray-500">{log.time}</span>
                       <span className={`${
                         log.type === 'success' ? 'text-primary-600 dark:text-primary-500' : 
                         log.type === 'error' ? 'text-red-500 dark:text-red-400' : 
                         log.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-300'
                       }`}>
                         {log.message}
                       </span>
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Recent Snapshots Strip */}
          <div className="h-28 grid grid-cols-5 gap-3">
             <div className="col-span-1 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 transition-colors">
                <span className="text-[10px] text-gray-500 font-bold uppercase text-center">Ảnh chụp<br/>Gần đây</span>
             </div>
             {recentSnapshots.map((snap) => (
               <GlassCard key={snap.id} className="relative overflow-hidden cursor-pointer hover:border-primary-500 transition-colors group border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
                 <img src={snap.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Snapshot" />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                 <div className="absolute bottom-0 left-0 w-full bg-white/80 dark:bg-black/70 backdrop-blur-[2px] p-1">
                   <p className="text-[9px] text-gray-900 dark:text-white font-mono text-center">{snap.time}</p>
                 </div>
               </GlassCard>
             ))}
             {[...Array(Math.max(0, 4 - recentSnapshots.length))].map((_, i) => (
                <div key={i} className="bg-gray-100 dark:bg-white/5 rounded-xl border border-dashed border-gray-300 dark:border-white/10 transition-colors"></div>
             ))}
          </div>
        </div>

        {/* Right Column: AI Results & Operations (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* AI Result Card */}
          <GlassCard className="p-0 flex flex-col relative overflow-hidden shadow-2xl border-gray-200 dark:border-white/20 bg-white dark:bg-gray-900/80">
             <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
               <h3 className="text-gray-900 dark:text-white font-bold text-sm flex items-center gap-2">
                 <Camera size={16} className="text-primary-500"/> Kết quả nhận diện
               </h3>
               {lprData && <Badge status={lprData.isWhitelist ? 'Monthly' : 'Active'} />}
             </div>

             <div className="p-4 flex flex-col gap-4">
               {/* Captured Image Area */}
               <div className="aspect-video bg-gray-200 dark:bg-black/50 rounded-lg border border-gray-200 dark:border-white/10 relative overflow-hidden group">
                 {lprData ? (
                   <>
                     <img src={lprData.imageUrl} className="w-full h-full object-cover" alt="Captured Plate" />
                     {/* Simulated Plate Crop Overlay */}
                     <div className="absolute bottom-2 right-2 w-24 h-8 bg-white/90 dark:bg-black/80 rounded border border-primary-500 overflow-hidden flex items-center justify-center shadow-lg">
                        <span className="text-gray-900 dark:text-white font-mono font-bold text-xs">{lprData.plate}</span>
                     </div>
                   </>
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 gap-2">
                     <ScanLine size={32} className={isProcessing ? "animate-spin text-primary-500" : ""} />
                     <span className="text-xs font-mono">{isProcessing ? "ĐANG PHÂN TÍCH KHUNG HÌNH..." : "CHỜ XE ĐẾN"}</span>
                   </div>
                 )}
               </div>

               {/* Plate Display */}
               <div className="bg-gray-100 dark:bg-black/40 rounded-xl p-4 border border-gray-200 dark:border-white/10 text-center relative overflow-hidden transition-colors">
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">BIỂN SỐ XE</p>
                 {lprData ? (
                   <h2 className="text-3xl font-mono font-bold text-gray-900 dark:text-white tracking-widest drop-shadow-[0_0_10px_rgb(var(--primary)/0.5)]">
                     {lprData.plate}
                   </h2>
                 ) : (
                   <h2 className="text-3xl font-mono font-bold text-gray-400 dark:text-gray-700 tracking-widest">---.---</h2>
                 )}
                 
                 {lprData && (
                   <div className="mt-3 flex justify-center gap-2">
                      <span className="text-[10px] font-mono bg-primary-500/10 text-primary-500 px-2 py-0.5 rounded border border-primary-500/20">
                        ĐỘ TIN CẬY: {Math.round(lprData.confidence * 100)}%
                      </span>
                   </div>
                 )}
               </div>

               {/* Manual Inputs */}
               <div className="space-y-3">
                 <Input label="Nhập biển số thủ công" placeholder="Nhập nếu AI thất bại..." defaultValue={lprData?.plate} />
                 <Input label="Mã thẻ / Vé" placeholder="Quét hoặc nhập..." icon={<CreditCardIcon size={14}/>} />
               </div>

               {/* Action Grid */}
               <div className="grid grid-cols-2 gap-3 mt-2">
                 <Button variant="danger" onClick={handleReject} disabled={!lprData} className="h-10 text-xs">
                   <AlertOctagon size={14} /> TỪ CHỐI
                 </Button>
                 <Button variant="secondary" onClick={handleRecapture} className="h-10 text-xs">
                   <RotateCcw size={14} /> THỬ LẠI
                 </Button>
                 <Button 
                    onClick={handleOpenBarrier}
                    disabled={!lprData}
                    className="col-span-2 bg-primary-500 hover:bg-primary-600 text-white h-12 shadow-[0_0_20px_rgb(var(--primary)/0.4)] border border-transparent"
                 >
                   MỞ BARRIER
                 </Button>
               </div>
             </div>
          </GlassCard>

          {/* Session Info / Pricing */}
          {activeLane === 'Exit' && lprData && (
            <GlassCard className="p-4 animate-fade-in-up">
               <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">Thanh toán phiên</h4>
               <div className="space-y-2 mb-4">
                 <InfoRow label="Giờ vào" value="08:30 AM" />
                 <InfoRow label="Thời gian gửi" value="4h 15m" />
                 <InfoRow label="Đơn giá" value="20.000đ / hr" />
               </div>
               <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                 <span className="text-sm font-bold text-gray-800 dark:text-white">Tổng phí</span>
                 <span className="text-2xl font-mono font-bold text-primary-500">85.000đ</span>
               </div>
            </GlassCard>
          )}

        </div>
      </div>
    </div>
  );
};

const CreditCardIcon = ({size}: {size: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
);

const InfoRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center text-xs">
    <span className="text-gray-500">{label}</span>
    <span className="font-mono text-gray-700 dark:text-gray-300">{value}</span>
  </div>
);