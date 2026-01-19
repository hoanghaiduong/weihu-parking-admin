import React from 'react';
import { GlassCard, Button } from '../components/ui';
import { Server, Wifi, WifiOff, HardDrive, Plus, RefreshCw } from 'lucide-react';

export const Devices: React.FC = () => {
  const devices = [
    { id: 'CAM-01', name: 'Camera Làn Vào 1', type: 'Camera LPR', status: 'Online', ip: '192.168.1.101' },
    { id: 'CAM-02', name: 'Camera Làn Ra 2', type: 'Camera LPR', status: 'Online', ip: '192.168.1.102' },
    { id: 'BAR-01', name: 'Barrier Vào', type: 'Bộ điều khiển', status: 'Online', ip: '192.168.1.105' },
    { id: 'BAR-02', name: 'Barrier Ra', type: 'Bộ điều khiển', status: 'Offline', ip: '192.168.1.106' },
    { id: 'LED-01', name: 'Bảng LED Vào', type: 'Màn hình hiển thị', status: 'Online', ip: '192.168.1.110' },
  ];

  return (
    <div className="space-y-6 animate-fade-in text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Thiết bị</h2>
           <p className="text-gray-500 dark:text-gray-400 text-sm">Giám sát và cấu hình phần cứng bãi xe.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary"><RefreshCw size={16}/> Làm mới</Button>
           <Button><Plus size={16}/> Thêm thiết bị</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <GlassCard className="p-4 flex items-center justify-between border-green-500/30 bg-green-500/5">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-green-500/20 rounded-lg text-green-600 dark:text-green-400"><Wifi size={20}/></div>
               <div>
                 <p className="font-bold text-gray-900 dark:text-white">Trạng thái Mạng</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400">Ổn định • Độ trễ 15ms</p>
               </div>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
         </GlassCard>
         <GlassCard className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400"><HardDrive size={20}/></div>
               <div>
                 <p className="font-bold text-gray-900 dark:text-white">Dung lượng ổ cứng</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400">1.2TB / 4TB (30% used)</p>
               </div>
            </div>
            <span className="text-xs font-mono text-gray-500 dark:text-gray-300">OK</span>
         </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
         <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white">Thiết bị đã kết nối</div>
         <div className="overflow-x-auto">
           <table className="w-full text-left text-sm">
             <thead className="text-gray-500 uppercase text-xs bg-gray-100 dark:bg-black/20">
               <tr>
                 <th className="p-4">Tên thiết bị</th>
                 <th className="p-4">Loại</th>
                 <th className="p-4">IP Address</th>
                 <th className="p-4">Trạng thái</th>
                 <th className="p-4 text-right">Hành động</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-200 dark:divide-white/5">
               {devices.map((dev) => (
                 <tr key={dev.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                   <td className="p-4 font-bold text-gray-800 dark:text-gray-200">{dev.name}</td>
                   <td className="p-4 text-gray-500 dark:text-gray-400">{dev.type}</td>
                   <td className="p-4 font-mono text-gray-600 dark:text-gray-500">{dev.ip}</td>
                   <td className="p-4">
                     {dev.status === 'Online' ? (
                       <span className="flex items-center gap-2 text-primary-500 text-xs font-bold"><Wifi size={14}/> Online</span>
                     ) : (
                       <span className="flex items-center gap-2 text-red-500 text-xs font-bold"><WifiOff size={14}/> Offline</span>
                     )}
                   </td>
                   <td className="p-4 text-right">
                     <Button variant="secondary" className="px-3 py-1 text-xs h-8">Ping</Button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </GlassCard>
    </div>
  );
};