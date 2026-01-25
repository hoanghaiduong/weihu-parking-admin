import React, { useState, useEffect } from 'react';
import { GlassCard, Badge, Button, Input } from '../components/ui';
import { ParkingSession, SessionStatus, VehicleType } from '../types';
import { Search, Filter, Download, Trash2, AlertTriangle } from 'lucide-react';

// Default mock data to seed if localStorage is empty
const SEED_SESSIONS: ParkingSession[] = [
  { id: 'S-1001', plate: '59T1-123.45', entryTime: '2023-10-27 08:30', lane: 'Làn Vào 01', status: SessionStatus.ACTIVE, imageUrl: '', vehicleType: VehicleType.CAR, engineDisplacement: '2.0L' },
  { id: 'S-1002', plate: '29A-999.99', entryTime: '2023-10-27 09:15', exitTime: '2023-10-27 11:30', lane: 'Làn Vào 02', status: SessionStatus.COMPLETED, fee: 25000, imageUrl: '', vehicleType: VehicleType.CAR, engineDisplacement: '1.5L' },
  { id: 'S-1003', plate: '51C-444.22', entryTime: '2023-10-27 10:00', lane: 'Làn Vào 01', status: SessionStatus.ISSUE, imageUrl: '', vehicleType: VehicleType.TRUCK, engineDisplacement: '3.0L' },
  { id: 'S-1004', plate: '30E-111.11', entryTime: '2023-10-27 10:15', lane: 'Làn Vào 01', status: SessionStatus.ACTIVE, imageUrl: '', vehicleType: VehicleType.MOTORBIKE, engineDisplacement: '125cc' },
  { id: 'S-1005', plate: '60A-567.89', entryTime: '2023-10-27 11:00', exitTime: '2023-10-27 12:45', lane: 'Làn Vào 02', status: SessionStatus.COMPLETED, fee: 15000, imageUrl: '', vehicleType: VehicleType.CAR, engineDisplacement: '2.0L' },
];

export const Sessions: React.FC = () => {
  const [sessions, setSessions] = useState<ParkingSession[]>([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Load from LocalStorage or Seed
  useEffect(() => {
    const stored = localStorage.getItem('weihu_sessions');
    if (stored) {
      try {
        setSessions(JSON.parse(stored));
      } catch (e) {
        setSessions(SEED_SESSIONS);
      }
    } else {
      // Seed initial data
      localStorage.setItem('weihu_sessions', JSON.stringify(SEED_SESSIONS));
      setSessions(SEED_SESSIONS);
    }
  }, []);

  const clearHistory = () => {
    if(confirm('Bạn có chắc muốn xóa toàn bộ lịch sử? Dữ liệu không thể khôi phục.')) {
        localStorage.removeItem('weihu_sessions');
        setSessions([]);
    }
  }

  const filteredSessions = sessions.filter(s => {
      const matchesSearch = s.plate.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'All' ? true : 
                            filter === 'Violation' ? s.status === SessionStatus.VIOLATION :
                            s.status === filter;
      return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lượt gửi xe</h2>
           <p className="text-gray-500 dark:text-gray-400 text-sm">Quản lý và theo dõi lịch sử ra vào từ Local Storage.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="danger" onClick={clearHistory} className="bg-red-500/10 text-red-600 border-red-500/20"><Trash2 size={16} /> Xóa lịch sử</Button>
          <Button variant="secondary"><Download size={16} /> Xuất dữ liệu</Button>
        </div>
      </div>

      <GlassCard className="p-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 max-w-sm">
            <Input 
                icon={<Search size={16}/>} 
                placeholder="Tìm biển số, ID phiên..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#84CC16] text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Active">Đang gửi (Active)</option>
            <option value="Completed">Hoàn thành</option>
            <option value="Violation">Vi phạm (Violation)</option>
            <option value="Issue">Sự cố (Issue)</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">ID Phiên</th>
                <th className="p-4 font-semibold">Biển số</th>
                <th className="p-4 font-semibold">Chi tiết xe</th>
                <th className="p-4 font-semibold">Giờ vào</th>
                <th className="p-4 font-semibold">Làn</th>
                <th className="p-4 font-semibold text-center">Trạng thái</th>
                <th className="p-4 font-semibold text-right">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredSessions.length === 0 && (
                  <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">Chưa có dữ liệu lượt xe.</td>
                  </tr>
              )}
              {filteredSessions.map((session) => (
                <tr key={session.id} className="border-b border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="p-4 font-mono text-gray-700 dark:text-gray-300">{session.id}</td>
                  <td className="p-4 font-mono font-bold text-gray-900 dark:text-white">{session.plate}</td>
                  <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-gray-900 dark:text-gray-200 font-medium">{session.vehicleType}</span>
                        <span className="text-[10px] text-gray-500">Động cơ: {session.engineDisplacement || 'N/A'}</span>
                      </div>
                  </td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{session.entryTime}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">{session.lane}</td>
                  <td className="p-4 text-center">
                    <Badge status={session.status} />
                  </td>
                  <td className="p-4 text-right">
                    {session.status === SessionStatus.VIOLATION ? (
                        <div className="flex items-center justify-end gap-1 text-red-500 text-xs font-bold">
                            <AlertTriangle size={12}/> {session.violationReason || 'Vi phạm'}
                        </div>
                    ) : (
                        <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-white/5">
           <span className="text-xs text-gray-500">Hiển thị {filteredSessions.length} kết quả mới nhất</span>
           <div className="flex gap-2">
             <Button variant="secondary" className="px-3 py-1 h-8 text-xs">Trước</Button>
             <Button variant="secondary" className="px-3 py-1 h-8 text-xs">Sau</Button>
           </div>
        </div>
      </GlassCard>
    </div>
  );
};