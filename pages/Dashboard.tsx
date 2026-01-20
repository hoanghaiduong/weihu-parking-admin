import React from 'react';
import { GlassCard, Button } from '../components/ui';
import { Stats, Alert } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { Car, DollarSign, AlertTriangle, Activity, PieChart as PieIcon, BarChart3 } from 'lucide-react';

const trafficData = [
  { time: '06:00', in: 12, out: 5 },
  { time: '08:00', in: 45, out: 12 },
  { time: '10:00', in: 80, out: 30 },
  { time: '12:00', in: 55, out: 65 },
  { time: '14:00', in: 60, out: 40 },
  { time: '16:00', in: 30, out: 70 },
  { time: '18:00', in: 20, out: 95 },
  { time: '20:00', in: 10, out: 40 },
];

const vehicleTypeData = [
  { name: 'Ô tô', value: 340 },
  { name: 'Xe máy', value: 850 },
  { name: 'Xe tải', value: 20 },
];

const revenueData = [
  { name: 'T2', cash: 4000, card: 2400 },
  { name: 'T3', cash: 3000, card: 1398 },
  { name: 'T4', cash: 2000, card: 9800 },
  { name: 'T5', cash: 2780, card: 3908 },
  { name: 'T6', cash: 1890, card: 4800 },
  { name: 'T7', cash: 2390, card: 3800 },
  { name: 'CN', cash: 3490, card: 4300 },
];

const COLORS = ['#84CC16', '#3b82f6', '#f97316'];

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
    totalSpaces: 1500,
    occupied: 1210,
    revenueToday: 12450000,
    alerts: 3
  };

  const alerts: Alert[] = [
    { id: '1', type: 'Security', message: 'Cố gắng truy cập trái phép tại Làn 1', timestamp: '10:42 AM', severity: 'high' },
    { id: '2', type: 'System', message: 'Camera L2 tín hiệu không ổn định', timestamp: '09:15 AM', severity: 'medium' },
    { id: '3', type: 'Revenue', message: 'Độ trễ cổng thanh toán cao', timestamp: '08:30 AM', severity: 'low' },
  ];

  return (
    <div className="space-y-6 animate-fade-in text-gray-900 dark:text-gray-100 pb-10">
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
          value={`${((stats.occupied/stats.totalSpaces)*100).toFixed(1)}%`} 
          sub={`${stats.occupied} / ${stats.totalSpaces} vị trí`}
          icon={<Car size={24} />}
          color="bg-blue-500"
        />
        <StatCard 
          label="Doanh thu hôm nay" 
          value={`${(stats.revenueToday/1000000).toFixed(1)}M`} 
          sub="320 giao dịch"
          icon={<DollarSign size={24} />}
          color="bg-primary-500"
        />
        <StatCard 
          label="Cảnh báo tích cực" 
          value={stats.alerts.toString()} 
          sub="Cần chú ý ngay"
          icon={<AlertTriangle size={24} />}
          color="bg-red-500"
        />
        <StatCard 
          label="Sức khỏe hệ thống" 
          value="98.5%" 
          sub="Dịch vụ ổn định"
          icon={<Activity size={24} />}
          color="bg-purple-500"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Traffic Area Chart */}
        <GlassCard className="lg:col-span-2 p-6 h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity size={20} className="text-primary-500"/> Lưu lượng xe (Vào/Ra)
             </h3>
             <select className="bg-gray-100 dark:bg-white/5 border-none rounded-lg text-xs px-2 py-1">
                <option>Hôm nay</option>
                <option>Tuần này</option>
             </select>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#84CC16" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#84CC16" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" vertical={false} />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" />
                <Area type="monotone" name="Xe Vào" dataKey="in" stroke="#84CC16" strokeWidth={3} fillOpacity={1} fill="url(#colorIn)" />
                <Area type="monotone" name="Xe Ra" dataKey="out" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorOut)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Alerts List */}
        <GlassCard className="lg:col-span-1 p-6 flex flex-col h-[400px]">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
             <AlertTriangle size={20} className="text-red-500"/> Cảnh báo gần đây
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    alert.severity === 'high' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' : 
                    alert.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                  }`}>
                    {alert.type}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono group-hover:text-gray-600 dark:group-hover:text-gray-300">{alert.timestamp}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-tight group-hover:text-primary-500 transition-colors">{alert.message}</p>
              </div>
            ))}
            {/* Mock more alerts */}
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 opacity-60">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20">SYSTEM</span>
                  <span className="text-[10px] text-gray-400 font-mono">Yesterday</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-tight">Backup dữ liệu tự động thành công.</p>
            </div>
          </div>
          <Button variant="secondary" className="mt-4 w-full text-xs">Xem tất cả Log</Button>
        </GlassCard>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* Vehicle Types Pie Chart */}
         <GlassCard className="p-6 h-[350px] flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
               <PieIcon size={20} className="text-purple-500"/> Phân loại xe
            </h3>
            <div className="flex-1 min-h-0 relative">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={vehicleTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                     >
                        {vehicleTypeData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                        ))}
                     </Pie>
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                     />
                     <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
               </ResponsiveContainer>
               {/* Center Text */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <span className="block text-2xl font-bold text-gray-900 dark:text-white">1,210</span>
                  <span className="text-xs text-gray-500">Tổng xe</span>
               </div>
            </div>
         </GlassCard>

         {/* Revenue Bar Chart */}
         <GlassCard className="lg:col-span-2 p-6 h-[350px] flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
               <BarChart3 size={20} className="text-green-500"/> Doanh thu tuần qua
            </h3>
            <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" vertical={false} />
                     <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                     <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                     <Tooltip 
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                     />
                     <Legend />
                     <Bar dataKey="cash" name="Tiền mặt" stackId="a" fill="#84CC16" radius={[0, 0, 4, 4]} barSize={40} />
                     <Bar dataKey="card" name="Thẻ/QR" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </GlassCard>
      </div>
    </div>
  );
};