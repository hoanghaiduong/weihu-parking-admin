import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GlassCard, Button, Input, Checkbox, Badge } from '../components/ui';
import { Server, Plus, RefreshCw, Camera, Settings, Trash2, Save, MonitorPlay, Activity, List, LayoutGrid, Maximize2, Wifi, CheckCircle2, AlertTriangle, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Minus, Video, Aperture, MousePointer2 } from 'lucide-react';

// --- Types ---
interface CameraDevice {
  id: string;
  name: string;
  ip: string;
  port: string;
  username?: string;
  password?: string;
  rtspUrl: string;
  status: 'Online' | 'Offline' | 'Connecting';
  model: string;
  type: 'LPR' | 'Overview' | 'PTZ';
  image: string; // Simulation image
}

interface IoTDevice {
  id: string;
  name: string;
  type: string;
  status: 'Online' | 'Offline';
}

// --- Mock Data ---
const MOCK_CAMERAS: CameraDevice[] = [
  { id: 'CAM-01', name: 'Cổng Chính (LPR In)', ip: '192.168.1.101', port: '554', rtspUrl: 'rtsp://192.168.1.101/stream1', status: 'Online', model: 'Hikvision ANPR', type: 'LPR', image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800' },
  { id: 'CAM-02', name: 'Cổng Ra (LPR Out)', ip: '192.168.1.102', port: '554', rtspUrl: 'rtsp://192.168.1.102/stream1', status: 'Online', model: 'Dahua AI', type: 'LPR', image: 'https://images.unsplash.com/photo-1590674899505-245784c9cc57?auto=format&fit=crop&q=80&w=800' },
  { id: 'CAM-03', name: 'Toàn cảnh Hầm B1', ip: '192.168.1.103', port: '554', rtspUrl: 'rtsp://192.168.1.103/stream1', status: 'Online', model: 'KBVision PTZ', type: 'Overview', image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=800' },
  { id: 'CAM-04', name: 'Sảnh Chờ Thang Máy', ip: '192.168.1.104', port: '8000', rtspUrl: 'rtsp://192.168.1.104/live', status: 'Offline', model: 'Ezviz', type: 'Overview', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800' },
];

const MOCK_IOT: IoTDevice[] = [
  { id: 'BAR-01', name: 'Barrier Controller In', type: 'PLC', status: 'Online' },
  { id: 'LED-01', name: 'Matrix Display', type: 'LED', status: 'Online' },
];

// --- Expanded Camera View Component (Using Portal) ---
const ExpandedCameraView: React.FC<{
  camera: CameraDevice;
  onClose: () => void;
}> = ({ camera, onClose }) => {
  // Use Portal to render outside the main DOM hierarchy to avoid z-index/overflow issues with Sidebar
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity animate-fade-in" onClick={onClose} />
        
        {/* Modal Window */}
        <div className="relative w-full max-w-6xl h-[85vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-gray-200 dark:border-white/10 animate-fade-in-up transition-colors">
            
            {/* 1. Window Header (Theme Aware) */}
            <div className="h-16 px-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-white dark:bg-gray-900 shrink-0">
               <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${camera.status === 'Online' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                     <Video size={24} />
                  </div>
                  <div>
                     <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-none">{camera.name}</h2>
                     <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1 flex items-center gap-2">
                        {camera.ip}:{camera.port} 
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span> 
                        {camera.model}
                     </p>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-xs font-bold border ${camera.status === 'Online' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                     {camera.status.toUpperCase()}
                  </div>
               </div>
               
               <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors" title="Settings">
                     <Settings size={20} />
                  </button>
                  <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1"></div>
                  <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                     <X size={20} />
                  </button>
               </div>
            </div>

            {/* 2. Main Content Body */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* Left: Video Feed & Controls */}
                <div className="flex-1 flex flex-col min-w-0 bg-black relative group">
                    {/* Video Surface */}
                    <div className="flex-1 flex items-center justify-center overflow-hidden bg-black/90 relative">
                       <img src={camera.image} className="max-w-full max-h-full object-contain" alt={camera.name} />
                       
                       {/* Live Indicator overlay on video only */}
                       <div className="absolute top-4 left-4 px-2 py-1 bg-red-600 text-white text-[10px] font-bold uppercase rounded animate-pulse shadow-sm">
                          LIVE
                       </div>
                    </div>

                    {/* Bottom Control Bar (Theme Aware) */}
                    <div className="h-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10 flex items-center justify-center gap-8 shrink-0 relative z-10">
                        <ControlButton icon={<Aperture size={20} />} label="Snapshot" />
                        <ControlButton icon={<Video size={20} />} label="Record" active />
                        <ControlButton icon={<MousePointer2 size={20} />} label="Select" />
                        <div className="w-px h-8 bg-gray-200 dark:bg-white/10"></div>
                        <ControlButton icon={<MonitorPlay size={20} />} label="Playback" />
                    </div>
                </div>

                {/* Right: Sidebar (Theme Aware) */}
                <div className="w-80 bg-gray-50 dark:bg-gray-800/50 border-l border-gray-200 dark:border-white/10 flex flex-col shrink-0">
                    {/* PTZ Section */}
                    <div className="p-6 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900">
                        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Activity size={14}/> Điều khiển PTZ
                        </h3>
                        <div className="aspect-square bg-gray-100 dark:bg-black/20 rounded-full border border-gray-200 dark:border-white/10 relative mx-auto w-48 mb-6 shadow-inner">
                            <button className="absolute top-2 left-1/2 -translate-x-1/2 p-3 text-gray-400 hover:text-primary-500 active:text-primary-600 transition-colors active:scale-95"><ChevronUp size={28}/></button>
                            <button className="absolute bottom-2 left-1/2 -translate-x-1/2 p-3 text-gray-400 hover:text-primary-500 active:text-primary-600 transition-colors active:scale-95"><ChevronDown size={28}/></button>
                            <button className="absolute left-2 top-1/2 -translate-y-1/2 p-3 text-gray-400 hover:text-primary-500 active:text-primary-600 transition-colors active:scale-95"><ChevronLeft size={28}/></button>
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-gray-400 hover:text-primary-500 active:text-primary-600 transition-colors active:scale-95"><ChevronRight size={28}/></button>
                            
                            <div className="absolute inset-0 m-auto w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-white/10 shadow-sm">
                                <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 font-bold">AUTO</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-3 bg-gray-100 dark:bg-black/20 p-1.5 rounded-lg border border-gray-200 dark:border-white/5">
                            <button className="p-2 rounded hover:bg-white dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"><Minus size={16}/></button>
                            <span className="text-[10px] font-bold text-gray-500">ZOOM</span>
                            <button className="p-2 rounded hover:bg-white dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"><Plus size={16}/></button>
                        </div>
                    </div>

                    {/* Logs Section */}
                    <div className="flex-1 flex flex-col min-h-0 bg-gray-50 dark:bg-gray-900/50">
                        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                           <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nhật ký AI</h3>
                           <span className="px-1.5 py-0.5 rounded bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[10px] font-bold">Real-time</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                           {[1,2,3,4,5,6].map(i => (
                             <div key={i} className="flex gap-3 items-start group">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-primary-500 transition-colors shrink-0"></div>
                                <div>
                                   <div className="flex items-center gap-2 mb-0.5">
                                      <span className="text-[10px] font-mono text-gray-400">10:2{i}:45</span>
                                      <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-white/10 px-1 rounded border border-gray-200 dark:border-white/5">MOTION</span>
                                   </div>
                                   <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">Phát hiện chuyển động tại khu vực Zone A.</p>
                                </div>
                             </div>
                           ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>,
    document.body
  );
};

// Helper for Controls
const ControlButton: React.FC<{ icon: React.ReactNode, label: string, active?: boolean }> = ({ icon, label, active }) => (
   <button className={`flex flex-col items-center gap-1.5 group transition-all ${active ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-500'}`}>
      <div className={`p-3 rounded-xl transition-all ${active ? 'bg-red-500/10' : 'bg-gray-100 dark:bg-white/5 group-hover:bg-primary-500/10 group-hover:scale-110'}`}>
         {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
   </button>
);

// --- Modal Component (Edit/Create) ---
const CameraModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  camera?: CameraDevice;
  onSave: (cam: CameraDevice) => void;
}> = ({ isOpen, onClose, camera, onSave }) => {
  const [formData, setFormData] = useState<Partial<CameraDevice>>({
    name: '', ip: '', port: '554', username: 'admin', password: '', rtspUrl: '', model: '', type: 'Overview'
  });
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'failed'>('idle');

  useEffect(() => {
    if (camera) {
      setFormData(camera);
    } else {
      setFormData({ name: '', ip: '', port: '554', username: 'admin', password: '', rtspUrl: '', model: '', type: 'Overview', status: 'Offline', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800' });
    }
    setTestStatus('idle');
  }, [camera, isOpen]);

  const handleTest = () => {
    setIsTesting(true);
    setTestStatus('idle');
    // Simulate network delay
    setTimeout(() => {
      setIsTesting(false);
      // Mock success if IP is entered
      if (formData.ip) setTestStatus('success');
      else setTestStatus('failed');
    }, 1500);
  };

  const handleSubmit = () => {
    const newCam = {
      ...formData,
      id: camera?.id || `CAM-${Math.floor(Math.random() * 1000)}`,
      status: testStatus === 'success' ? 'Online' : 'Offline',
      image: camera?.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
    } as CameraDevice;
    onSave(newCam);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col max-h-[90vh] animate-fade-in-up">
        
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5 rounded-t-2xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Camera className="text-primary-500" /> 
            {camera ? 'Cấu hình Camera' : 'Thêm Camera Mới'}
          </h3>
          <button onClick={onClose}><X className="text-gray-400 hover:text-gray-900 dark:hover:text-white" /></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tên Camera" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Vd: Cổng Làn 1" />
            <div className="space-y-1.5">
               <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Loại Camera</label>
               <select 
                  className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary-500 text-sm"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as any})}
                >
                  <option value="Overview">Giám sát (Overview)</option>
                  <option value="LPR">Nhận diện biển số (LPR)</option>
                  <option value="PTZ">Điều khiển xoay (PTZ)</option>
               </select>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 space-y-4">
             <h4 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><Server size={14}/> Cấu hình Mạng & RTSP</h4>
             <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2"><Input label="IP Address" value={formData.ip} onChange={e => setFormData({...formData, ip: e.target.value})} placeholder="192.168.1.xxx" fontClass="font-mono" /></div>
                <Input label="Port" value={formData.port} onChange={e => setFormData({...formData, port: e.target.value})} placeholder="554" fontClass="font-mono" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <Input label="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="admin" />
                <Input label="Password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••" />
             </div>
             <Input label="RTSP URL" value={formData.rtspUrl} onChange={e => setFormData({...formData, rtspUrl: e.target.value})} placeholder="rtsp://admin:pass@ip:554/..." fontClass="font-mono text-xs" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-white/5">
             <div className="flex items-center gap-2">
                <Activity size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái kết nối:</span>
                {isTesting ? <span className="text-yellow-600 dark:text-yellow-500 text-sm font-bold flex items-center gap-1"><RefreshCw size={14} className="animate-spin"/> Đang kiểm tra...</span> :
                 testStatus === 'success' ? <span className="text-green-600 dark:text-green-500 text-sm font-bold flex items-center gap-1"><CheckCircle2 size={14}/> Thành công</span> :
                 testStatus === 'failed' ? <span className="text-red-600 dark:text-red-500 text-sm font-bold flex items-center gap-1"><AlertTriangle size={14}/> Thất bại</span> :
                 <span className="text-gray-400 text-sm">Chưa kiểm tra</span>
                }
             </div>
             <Button variant="secondary" onClick={handleTest} disabled={isTesting} className="h-8 text-xs">Test Connection</Button>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 bg-gray-50 dark:bg-white/5 rounded-b-2xl">
           <Button variant="secondary" onClick={onClose}>Hủy bỏ</Button>
           <Button onClick={handleSubmit} disabled={isTesting || !formData.name || !formData.ip}><Save size={16}/> Lưu Camera</Button>
        </div>
      </div>
    </div>
  );
};


// --- Main Page ---
export const Devices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cameras' | 'iot'>('cameras');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [gridSize, setGridSize] = useState<2 | 3 | 4>(2); // 2x2, 3x3, 4x4
  
  const [cameras, setCameras] = useState<CameraDevice[]>(MOCK_CAMERAS);
  const [editingCam, setEditingCam] = useState<CameraDevice | undefined>(undefined);
  const [expandedCam, setExpandedCam] = useState<CameraDevice | null>(null); // For fullscreen mode
  const [isModalOpen, setIsModalOpen] = useState(false);

  // CRUD Actions
  const handleAdd = () => {
    setEditingCam(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (cam: CameraDevice) => {
    setEditingCam(cam);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa thiết bị này?')) {
      setCameras(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleExpand = (cam: CameraDevice) => {
    setExpandedCam(cam);
  };

  const handleSaveCamera = (newCam: CameraDevice) => {
    setCameras(prev => {
      const exists = prev.find(c => c.id === newCam.id);
      if (exists) {
        return prev.map(c => c.id === newCam.id ? newCam : c);
      }
      return [...prev, newCam];
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6 animate-fade-in text-gray-900 dark:text-gray-100">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 shrink-0">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Thiết bị & Video Wall</h2>
           <p className="text-gray-500 dark:text-gray-400 text-sm">Giám sát tập trung và cấu hình phần cứng.</p>
        </div>
        
        <div className="flex items-center gap-3">
           {/* View Mode Toggle */}
           <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-xl flex border border-gray-200 dark:border-white/10">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 text-primary-500 shadow' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                title="Chế độ Danh sách"
              >
                <List size={20} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-800 text-primary-500 shadow' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                title="Chế độ Video Wall"
              >
                <LayoutGrid size={20} />
              </button>
           </div>

           {activeTab === 'cameras' && (
              <Button onClick={handleAdd} className="shadow-lg shadow-primary-500/20"><Plus size={16}/> Thêm Camera</Button>
           )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col">
        
        {/* Tabs (Only visible in List mode or if we want to switch device types) */}
        {viewMode === 'list' && (
          <div className="flex gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl w-fit mb-4">
            <button 
              onClick={() => setActiveTab('cameras')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'cameras' ? 'bg-white dark:bg-gray-800 text-primary-500 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Camera size={16} /> Camera ({cameras.length})
            </button>
            <button 
              onClick={() => setActiveTab('iot')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'iot' ? 'bg-white dark:bg-gray-800 text-primary-500 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Server size={16} /> IoT & Sensors
            </button>
          </div>
        )}

        {/* --- VIEW MODE: GRID (VIDEO WALL) --- */}
        {viewMode === 'grid' && activeTab === 'cameras' && (
           <div className="flex-1 flex flex-col min-h-0 gap-4">
              {/* Grid Toolbar - UPDATED to use Theme Context */}
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-2 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
                 <div className="flex items-center gap-2 px-2">
                    <MonitorPlay size={18} className="text-primary-500"/>
                    <span className="font-bold text-sm text-gray-900 dark:text-white">VIDEO WALL LIVE</span>
                    <span className="text-xs text-gray-400 border-l border-gray-300 dark:border-gray-700 pl-2 ml-2">
                       {cameras.filter(c => c.status === 'Online').length} Online / {cameras.length} Total
                    </span>
                 </div>
                 <div className="flex gap-2">
                    {[2, 3, 4].map(size => (
                       <button 
                         key={size}
                         onClick={() => setGridSize(size as any)}
                         className={`px-3 py-1 rounded text-xs font-bold border transition-all ${
                            gridSize === size 
                            ? 'bg-primary-500 border-primary-500 text-white' 
                            : 'bg-transparent border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                         }`}
                       >
                         {size}x{size}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Grid Container - UPDATED background for light mode support */}
              <div className="flex-1 min-h-0 bg-gray-50 dark:bg-black/40 rounded-2xl border border-gray-200 dark:border-white/5 p-2 overflow-y-auto custom-scrollbar shadow-inner">
                 <div className={`grid gap-2 h-full ${
                    gridSize === 2 ? 'grid-cols-2 grid-rows-2' : 
                    gridSize === 3 ? 'grid-cols-3 grid-rows-3' : 
                    'grid-cols-4 grid-rows-4'
                 }`}>
                    {/* Render Cameras */}
                    {cameras.map((cam) => (
                       <div key={cam.id} className="relative group bg-gray-200 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-800 hover:border-primary-500 transition-colors shadow-sm">
                          {/* Video/Image Feed */}
                          <img src={cam.image} alt={cam.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                          
                          {/* Overlay Info */}
                          <div className="absolute top-2 left-2 bg-white/80 dark:bg-black/60 backdrop-blur px-2 py-1 rounded flex items-center gap-2 shadow-sm z-10">
                             <div className={`w-2 h-2 rounded-full ${cam.status === 'Online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                             <span className="text-[10px] font-mono font-bold text-gray-900 dark:text-white truncate max-w-[100px]">{cam.name}</span>
                          </div>

                          {/* Quick Actions Overlay (On Hover) */}
                          <div className="absolute inset-0 bg-black/30 dark:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[1px]">
                             <button 
                                onClick={() => handleEdit(cam)}
                                className="h-10 w-10 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-white flex items-center justify-center hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 transition-all shadow-xl transform hover:scale-110"
                                title="Cấu hình"
                             >
                                <Settings size={18}/>
                             </button>
                             <button 
                                onClick={() => handleExpand(cam)}
                                className="h-10 w-10 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-white flex items-center justify-center hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 transition-all shadow-xl transform hover:scale-110"
                                title="Phóng to"
                             >
                                <Maximize2 size={18}/>
                             </button>
                          </div>

                          {/* Tech Overlay */}
                          <div className="absolute bottom-2 right-2 text-[9px] font-mono text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-black/80 px-1.5 py-0.5 rounded border border-gray-200 dark:border-white/10 z-10">
                             RTSP: {cam.port} • 1080P
                          </div>
                       </div>
                    ))}
                    
                    {/* Empty Slots */}
                    {Array.from({ length: Math.max(0, (gridSize * gridSize) - cameras.length) }).map((_, i) => (
                       <div key={`empty-${i}`} className="bg-gray-100 dark:bg-white/5 rounded-lg border border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center text-gray-400 dark:text-gray-600">
                          <span className="text-xs font-mono">NO SIGNAL</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW MODE: LIST (MANAGEMENT) --- */}
        {viewMode === 'list' && activeTab === 'cameras' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar">
             {cameras.map(cam => (
               <GlassCard key={cam.id} className="p-0 overflow-hidden flex flex-col group">
                 {/* Preview Header */}
                 <div className="h-32 bg-gray-200 dark:bg-gray-900 relative cursor-pointer" onClick={() => handleExpand(cam)}>
                    <img src={cam.image} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all" alt="Preview"/>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute top-2 right-2">
                       <Badge status={cam.status === 'Online' ? 'Active' : 'Issue'} />
                    </div>
                    {/* Play Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/20">
                            <Maximize2 size={16}/>
                        </div>
                    </div>
                 </div>
                 
                 {/* Body */}
                 <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold text-gray-900 dark:text-white truncate" title={cam.name}>{cam.name}</h4>
                       <span className="text-xs bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-gray-500">{cam.type}</span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400 font-mono mb-4">
                       <div className="flex items-center gap-2"><Server size={12}/> {cam.ip}:{cam.port}</div>
                       <div className="flex items-center gap-2"><Activity size={12}/> {cam.model}</div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                       <Button variant="secondary" className="flex-1 h-9 text-xs" onClick={() => handleEdit(cam)}><Settings size={14}/> Cấu hình</Button>
                       {/* Fixed Delete Button size/icon visibility */}
                       <Button variant="danger" className="h-9 px-3 flex items-center justify-center" onClick={() => handleDelete(cam.id)} title="Xóa thiết bị">
                          <Trash2 size={16}/>
                       </Button>
                    </div>
                 </div>
               </GlassCard>
             ))}
             
             {/* Add New Card Button */}
             <button 
                onClick={handleAdd}
                className="h-[250px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/10 flex flex-col items-center justify-center text-gray-400 hover:text-primary-500 hover:border-primary-500 hover:bg-primary-500/5 transition-all gap-2"
             >
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                   <Plus size={24}/>
                </div>
                <span className="font-bold text-sm">Thêm Camera Mới</span>
             </button>
          </div>
        )}

        {/* --- IOT DEVICES LIST --- */}
        {viewMode === 'list' && activeTab === 'iot' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {MOCK_IOT.map(dev => (
                <GlassCard key={dev.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400"><Server size={20}/></div>
                     <div>
                       <p className="font-bold text-gray-900 dark:text-white">{dev.name}</p>
                       <p className="text-xs text-gray-500 dark:text-gray-400">{dev.type} • {dev.id}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-600 text-xs font-bold">ONLINE</span>
                     <Button variant="secondary" className="h-8 w-8 p-0"><Settings size={14}/></Button>
                  </div>
                </GlassCard>
             ))}
           </div>
        )}

      </div>

      {/* Camera Edit/Add Modal */}
      <CameraModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         camera={editingCam} 
         onSave={handleSaveCamera}
      />

      {/* Expanded Camera View */}
      {expandedCam && (
        <ExpandedCameraView 
          camera={expandedCam} 
          onClose={() => setExpandedCam(null)} 
        />
      )}
    </div>
  );
};