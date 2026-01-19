import React from 'react';
import { GlassCard, Badge, Button, Input } from '../components/ui';
import { ParkingSession, SessionStatus, VehicleType } from '../types';
import { Search, Filter, Download } from 'lucide-react';

const mockSessions: ParkingSession[] = [
  { id: 'S-1001', plate: '59T1-123.45', entryTime: '2023-10-27 08:30', lane: 'Làn Vào 01', status: SessionStatus.ACTIVE, imageUrl: '', vehicleType: VehicleType.CAR },
  { id: 'S-1002', plate: '29A-999.99', entryTime: '2023-10-27 09:15', exitTime: '2023-10-27 11:30', lane: 'Làn Vào 02', status: SessionStatus.COMPLETED, fee: 25000, imageUrl: '', vehicleType: VehicleType.CAR },
  { id: 'S-1003', plate: '51C-444.22', entryTime: '2023-10-27 10:00', lane: 'Làn Vào 01', status: SessionStatus.ISSUE, imageUrl: '', vehicleType: VehicleType.TRUCK },
  { id: 'S-1004', plate: '30E-111.11', entryTime: '2023-10-27 10:15', lane: 'Làn Vào 01', status: SessionStatus.ACTIVE, imageUrl: '', vehicleType: VehicleType.MOTORBIKE },
  { id: 'S-1005', plate: '60A-567.89', entryTime: '2023-10-27 11:00', exitTime: '2023-10-27 12:45', lane: 'Làn Vào 02', status: SessionStatus.COMPLETED, fee: 15000, imageUrl: '', vehicleType: VehicleType.CAR },
];

export const Sessions: React.FC = () => {
  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lượt gửi xe</h2>
           <p className="text-gray-500 dark:text-gray-400 text-sm">Xem và quản lý lịch sử xe vào/ra.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary"><Download size={16} /> Xuất dữ liệu</Button>
          <Button><Filter size={16} /> Bộ lọc</Button>
        </div>
      </div>

      <GlassCard className="p-4">
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 max-w-sm">
            <Input icon={<Search size={16}/>} placeholder="Tìm biển số, ID phiên..." />
          </div>
          <select className="bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#84CC16] text-sm">
            <option>Tất cả trạng thái</option>
            <option>Đang gửi</option>
            <option>Hoàn thành</option>
            <option>Sự cố</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">ID Phiên</th>
                <th className="p-4 font-semibold">Biển số</th>
                <th className="p-4 font-semibold">Loại xe</th>
                <th className="p-4 font-semibold">Giờ vào</th>
                <th className="p-4 font-semibold">Giờ ra</th>
                <th className="p-4 font-semibold text-right">Phí</th>
                <th className="p-4 font-semibold text-center">Trạng thái</th>
                <th className="p-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {mockSessions.map((session) => (
                <tr key={session.id} className="border-b border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="p-4 font-mono text-gray-700 dark:text-gray-300">{session.id}</td>
                  <td className="p-4 font-mono font-bold text-gray-900 dark:text-white">{session.plate}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">{session.vehicleType}</td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{session.entryTime}</td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{session.exitTime || '--'}</td>
                  <td className="p-4 text-right font-mono text-[#84CC16]">
                    {session.fee ? `${(session.fee).toLocaleString()}đ` : '-'}
                  </td>
                  <td className="p-4 text-center">
                    <Badge status={session.status} />
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-white/5">
           <span className="text-xs text-gray-500">Hiển thị 1-5 trong 1,240 lượt</span>
           <div className="flex gap-2">
             <Button variant="secondary" className="px-3 py-1 h-8 text-xs">Trước</Button>
             <Button variant="secondary" className="px-3 py-1 h-8 text-xs">Sau</Button>
           </div>
        </div>
      </GlassCard>
    </div>
  );
};