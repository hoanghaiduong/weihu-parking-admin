import React from 'react';
import { GlassCard, Button, Input } from '../components/ui';
import { DollarSign, CreditCard, Wallet, Download, Calendar, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface Transaction {
  id: string;
  ref: string;
  amount: number;
  method: 'Cash' | 'Credit Card' | 'E-Wallet';
  time: string;
  type: 'Payment' | 'Refund';
  status: 'Success' | 'Failed' | 'Pending';
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TRX-8821', ref: 'S-1002', amount: 25000, method: 'Cash', time: '11:30 AM', type: 'Payment', status: 'Success' },
  { id: 'TRX-8822', ref: 'S-1005', amount: 15000, method: 'E-Wallet', time: '12:45 PM', type: 'Payment', status: 'Success' },
  { id: 'TRX-8823', ref: 'M-5510', amount: 1200000, method: 'Credit Card', time: '01:15 PM', type: 'Payment', status: 'Success' },
  { id: 'TRX-8824', ref: 'S-1008', amount: 30000, method: 'E-Wallet', time: '01:30 PM', type: 'Payment', status: 'Failed' },
  { id: 'TRX-8825', ref: 'REF-001', amount: 5000, method: 'Cash', time: '02:00 PM', type: 'Refund', status: 'Success' },
  { id: 'TRX-8826', ref: 'S-1010', amount: 45000, method: 'Cash', time: '02:15 PM', type: 'Payment', status: 'Success' },
];

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, trend?: string }> = ({ title, value, icon, trend }) => (
  <GlassCard className="p-5 flex items-center justify-between">
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-mono">{value}</h3>
      {trend && <p className="text-[#84CC16] text-xs mt-1 flex items-center gap-1"><ArrowUpRight size={12}/> {trend}</p>}
    </div>
    <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300">
      {icon}
    </div>
  </GlassCard>
);

export const Payments: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in text-gray-900 dark:text-gray-100">
       <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Doanh thu & Thanh toán</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Tổng quan tài chính Hôm nay, 27/10</p>
        </div>
        <Button variant="secondary" className="gap-2">
           <Download size={16} /> Xuất Báo cáo
        </Button>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Tổng doanh thu" value="12,450,000đ" icon={<DollarSign size={24} />} trend="+15% so với hôm qua" />
        <StatCard title="Tiền mặt" value="4,200,000đ" icon={<Wallet size={24} />} />
        <StatCard title="Thanh toán điện tử" value="8,250,000đ" icon={<CreditCard size={24} />} trend="66% tổng doanh thu" />
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex flex-col md:flex-row justify-between gap-4">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><div className="w-1 h-4 bg-[#84CC16] rounded-full"></div> Lịch sử Giao dịch</h3>
          <div className="flex gap-2">
            <Input icon={<Calendar size={14}/>} placeholder="Chọn ngày" className="w-40" />
            <select className="bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-[#84CC16] focus:outline-none">
              <option>Tất cả phương thức</option>
              <option>Tiền mặt</option>
              <option>Thẻ / QR</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-black/20 text-gray-500 dark:text-gray-400 text-xs uppercase">
              <tr>
                <th className="p-4 font-semibold">Mã GD</th>
                <th className="p-4 font-semibold">Tham chiếu</th>
                <th className="p-4 font-semibold">Thời gian</th>
                <th className="p-4 font-semibold">Phương thức</th>
                <th className="p-4 font-semibold text-right">Số tiền</th>
                <th className="p-4 font-semibold text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-200 dark:divide-white/5">
              {MOCK_TRANSACTIONS.map((trx) => (
                <tr key={trx.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-gray-700 dark:text-gray-300">{trx.id}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">{trx.ref}</td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{trx.time}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      {trx.method === 'Cash' ? <Wallet size={14} className="text-green-600 dark:text-green-400"/> : <CreditCard size={14} className="text-blue-600 dark:text-blue-400"/>}
                      <span>{trx.method}</span>
                    </div>
                  </td>
                  <td className={`p-4 text-right font-mono font-bold ${trx.type === 'Refund' ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                    {trx.type === 'Refund' ? '-' : '+'}{trx.amount.toLocaleString()}đ
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      trx.status === 'Success' ? 'bg-[#84CC16]/20 text-[#65A30D] dark:text-[#84CC16]' : 
                      trx.status === 'Failed' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {trx.status === 'Success' ? 'Thành công' : trx.status === 'Failed' ? 'Thất bại' : 'Chờ xử lý'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-white/10 text-center">
           <Button variant="ghost" className="text-xs w-full">Tải thêm giao dịch</Button>
        </div>
      </GlassCard>
    </div>
  );
};