import React from 'react';
import { GlassCard, Button } from '../components/ui';
import { Stats, Alert } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Car, DollarSign, AlertTriangle, Activity } from 'lucide-react';

const mockData = [
  { time: '06:00', in: 12, out: 5 },
  { time: '08:00', in: 45, out: 12 },
  { time: '10:00', in: 80, out: 30 },
  { time: '12:00', in: 55, out: 65 },
  { time: '14:00', in: 60, out: 40 },
  { time: '16:00', in: 30, out: 70 },
  { time: '18:00', in: 20, out: 95 },
  { time: '20:00', in: 10, out: 40 },
];

const StatCard: React.FC<{ label: string; value: string; sub: string; icon: React.ReactNode; color: string }> = ({ label, value, sub, icon, color }) => (
  <GlassCard className="p-6 relative overflow-hidden group">
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-110 ${color}`}></div>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white ring-1 ring-gray-200 dark:ring-white/10`}>
        {icon}
      </div>
    </div>
    <p className="text-xs text-gray-500 font-mono">{sub}</p>
  </GlassCard>
);

export const Dashboard: React.FC = () => {
  const stats: Stats = {
    totalSpaces: 500,
    occupied: 342,
    revenueToday: 12450.00,
    alerts: 3
  };

  const alerts: Alert[] = [
    { id: '1', type: 'Security', message: 'Cố gắng truy cập trái phép tại Làn 1', timestamp: '10:42 AM', severity: 'high' },
    { id: '2', type: 'System', message: 'Camera L2 tín hiệu không ổn định', timestamp: '09:15 AM', severity: 'medium' },
    { id: '3', type: 'Revenue', message: 'Độ trễ cổng thanh toán cao', timestamp: '08:30 AM', severity: 'low' },
  ];

  return (
    <div className="space-y-6 animate-fade-in text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bảng Điều Khiển</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Giám sát thời gian thực Bãi xe Khu A</p>
        </div>
        <div className="flex gap-2">
           <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-500 border border-primary-500/20 text-xs font-mono">
             <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
             HỆ THỐNG ONLINE
           </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Tỷ lệ lấp đầy" 
          value={`${stats.occupied}/${stats.totalSpaces}`} 
          sub="+12% so với hôm qua"
          icon={<Car size={24} />}
          color="bg-blue-500"
        />
        <StatCard 
          label="Doanh thu hôm nay" 
          value={`$${stats.revenueToday.toLocaleString()}`} 
          sub="320 giao dịch"
          icon={<DollarSign size={24} />}
          color="bg-primary-500"
        />
        <StatCard 
          label="Cảnh báo tích cực" 
          value={stats.alerts.toString()} 
          sub="Cần chú ý"
          icon={<AlertTriangle size={24} />}
          color="bg-red-500"
        />
        <StatCard 
          label="Sức khỏe hệ thống" 
          value="98.5%" 
          sub="Dịch vụ hoạt động tốt"
          icon={<Activity size={24} />}
          color="bg-purple-500"
        />
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="col-span-2 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Lưu lượng xe (Vào/Ra)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#374151', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="in" stroke="rgb(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorIn)" />
                <Area type="monotone" dataKey="out" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorOut)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Alerts List */}
        <GlassCard className="col-span-1 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Cảnh báo gần đây</h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    alert.severity === 'high' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 
                    alert.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  }`}>
                    {alert.type}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">{alert.timestamp}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-tight">{alert.message}</p>
              </div>
            ))}
          </div>
          <Button variant="secondary" className="mt-4 w-full text-xs">Xem tất cả</Button>
        </GlassCard>
      </div>
    </div>
  );
};