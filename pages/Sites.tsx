import React, { useState } from 'react';
import { GlassCard, Button, Input, Checkbox } from '../components/ui';
import { MapPin, Plus, Server, Car, AlertCircle, ExternalLink, X, Save, Clock, Activity, PieChart as PieIcon, BarChart3, Users } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Site {
  id: string;
  name: string;
  address: string;
  capacityCar: number;
  capacityMoto: number;
  occupiedCar: number;
  occupiedMoto: number;
  status: 'Online' | 'Offline' | 'Maintenance';
  cameras: number;
  barriers: number;
  image: string;
}

const MOCK_SITES: Site[] = [
  { 
    id: 'SITE-01', 
    name: 'Weihu Main Plaza A', 
    address: '123 Tech Avenue, District 1', 
    capacityCar: 500,
    capacityMoto: 1200, 
    occupiedCar: 412,
    occupiedMoto: 850,
    status: 'Online',
    cameras: 12,
    barriers: 4,
    // Modern Building / Plaza
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'SITE-02', 
    name: 'Weihu Tower B (Hầm)', 
    address: '456 Innovation Rd, District 3', 
    capacityCar: 200,
    capacityMoto: 500, 
    occupiedCar: 45,
    occupiedMoto: 120,
    status: 'Online',
    cameras: 6,
    barriers: 2,
    // Underground Parking
    image: 'https://images.unsplash.com/photo-1590674899505-245784c9cc57?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 'SITE-03', 
    name: 'West Lake Campus (Ngoài trời)', 
    address: '789 Lake View, Tay Ho', 
    capacityCar: 800,
    capacityMoto: 2000, 
    occupiedCar: 0,
    occupiedMoto: 0,
    status: 'Offline',
    cameras: 24,
    barriers: 8,
    // Outdoor Parking
    image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=800' 
  },
];

const COLORS = ['#84CC16', '#3b82f6', '#f97316', '#e5e7eb'];

// --- Site Configuration Modal ---
const SiteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  site?: Site;
}> = ({ isOpen, onClose, site }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'stats'>('info');

  if (!isOpen) return null;

  // Mock Stats Data for Charts
  const capacityData = site ? [
    { name: 'Ô tô đã gửi', value: site.occupiedCar },
    { name: 'Xe máy đã gửi', value: site.occupiedMoto },
    { name: 'Trống', value: (site.capacityCar + site.capacityMoto) - (site.occupiedCar + site.occupiedMoto) }
  ] : [];

  const hourlyData = [
    { hour: '8h', in: 40, out: 10 },
    { hour: '10h', in: 60, out: 20 },
    { hour: '12h', in: 20, out: 50 },
    { hour: '14h', in: 30, out: 30 },
    { hour: '16h', in: 10, out: 60 },
    { hour: '18h', in: 5, out: 80 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col max-h-[90vh] animate-fade-in-up">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5 rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="text-primary-500" /> 
              {site ? site.name : 'Thêm Bãi xe mới'}
            </h3>
            <p className="text-sm text-gray-500">{site ? site.address : 'Thiết lập thông số vận hành'}</p>
          </div>
          <button onClick={onClose}><X className="text-gray-400 hover:text-gray-900 dark:hover:text-white" /></button>
        </div>

        {/* Tabs */}
        {site && (
          <div className="flex px-6 pt-2 border-b border-gray-200 dark:border-white/10 gap-6">
            <button 
              onClick={() => setActiveTab('info')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'info' ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              Cấu hình Chung
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'stats' ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              Thống kê & Chỉ số
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* TAB: INFO */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* General Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase border-b border-gray-200 dark:border-white/10 pb-2">Thông tin cơ bản</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Tên Khu vực" defaultValue={site?.name} />
                  <Input label="Mã Site ID" defaultValue={site?.id} disabled className="opacity-70"/>
                </div>
                <Input label="Địa chỉ vật lý" defaultValue={site?.address} icon={<MapPin size={16}/>} />
                <div className="flex items-center gap-4">
                   <div className="flex-1">
                     <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Trạng thái</label>
                     <select className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary-500">
                        <option>Đang hoạt động (Online)</option>
                        <option>Bảo trì (Maintenance)</option>
                        <option>Ngừng hoạt động (Offline)</option>
                     </select>
                   </div>
                </div>
              </div>

              {/* Capacity Config */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase border-b border-gray-200 dark:border-white/10 pb-2 flex items-center gap-2">
                   <Activity size={16}/> Quản lý Sức chứa
                </h4>
                <div className="grid grid-cols-2 gap-6">
                   <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                         <Car size={18}/> Ô tô (Car)
                      </div>
                      <Input label="Tổng chỗ" type="number" defaultValue={site?.capacityCar.toString()} />
                      <div className="flex items-center justify-between">
                         <span className="text-xs text-gray-500">Ngưỡng cảnh báo đầy</span>
                         <span className="text-xs font-bold text-blue-500">95%</span>
                      </div>
                      <input type="range" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" defaultValue="95"/>
                   </div>
                   <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl space-y-3">
                      <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold">
                         <Car size={18}/> Xe máy (Moto)
                      </div>
                      <Input label="Tổng chỗ" type="number" defaultValue={site?.capacityMoto.toString()} />
                      <div className="flex items-center justify-between">
                         <span className="text-xs text-gray-500">Ngưỡng cảnh báo đầy</span>
                         <span className="text-xs font-bold text-orange-500">90%</span>
                      </div>
                      <input type="range" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" defaultValue="90"/>
                   </div>
                </div>
              </div>

              {/* Operation Hours */}
              <div className="space-y-4">
                 <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase border-b border-gray-200 dark:border-white/10 pb-2 flex items-center gap-2">
                   <Clock size={16}/> Giờ hoạt động
                </h4>
                <div className="flex items-center gap-4">
                   <Checkbox label="Hoạt động 24/7" checked={true} />
                   <Checkbox label="Cho phép gửi qua đêm" checked={true} />
                </div>
              </div>
            </div>
          )}

          {/* TAB: STATS */}
          {activeTab === 'stats' && site && (
             <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Occupancy Pie Chart */}
                  <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                     <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <PieIcon size={16}/> Tỷ lệ Lấp đầy Hiện tại
                     </h4>
                     <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie 
                                data={capacityData} 
                                cx="50%" cy="50%" 
                                innerRadius={60} outerRadius={80} 
                                paddingAngle={5} dataKey="value"
                              >
                                 {capacityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0}/>
                                 ))}
                              </Pie>
                              <Tooltip contentStyle={{ borderRadius: '8px' }} />
                           </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                           <span className="text-2xl font-bold text-gray-900 dark:text-white">
                              {Math.round(((site.occupiedCar + site.occupiedMoto) / (site.capacityCar + site.capacityMoto)) * 100)}%
                           </span>
                           <span className="block text-xs text-gray-500">Full</span>
                        </div>
                     </div>
                     <div className="flex justify-center gap-4 mt-2 text-xs">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#84CC16]"></div> Ô tô</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div> Xe máy</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300"></div> Trống</div>
                     </div>
                  </div>

                  {/* Hourly Traffic Bar Chart */}
                  <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                     <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <BarChart3 size={16}/> Lưu lượng xe theo giờ (Hôm nay)
                     </h4>
                     <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={hourlyData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                              <XAxis dataKey="hour" fontSize={10} axisLine={false} tickLine={false} />
                              <YAxis fontSize={10} axisLine={false} tickLine={false} />
                              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                              <Bar dataKey="in" name="Vào" fill="#84CC16" radius={[4, 4, 0, 0]} barSize={20} />
                              <Bar dataKey="out" name="Ra" fill="#f97316" radius={[4, 4, 0, 0]} barSize={20} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               </div>
               
               {/* Quick Stats Cards */}
               <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
                     <div className="text-xs text-blue-600 dark:text-blue-400 uppercase font-bold">Lượt xe vào</div>
                     <div className="text-xl font-bold text-gray-900 dark:text-white">1,240</div>
                  </div>
                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-center">
                     <div className="text-xs text-orange-600 dark:text-orange-400 uppercase font-bold">Lượt xe ra</div>
                     <div className="text-xl font-bold text-gray-900 dark:text-white">980</div>
                  </div>
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                     <div className="text-xs text-green-600 dark:text-green-400 uppercase font-bold">Doanh thu</div>
                     <div className="text-xl font-bold text-gray-900 dark:text-white">12.5M</div>
                  </div>
               </div>
             </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 bg-gray-50 dark:bg-white/5 rounded-b-2xl">
           <Button variant="secondary" onClick={onClose}>Hủy bỏ</Button>
           <Button><Save size={16}/> Lưu thay đổi</Button>
        </div>
      </div>
    </div>
  );
};


export const Sites: React.FC = () => {
  const [editingSite, setEditingSite] = useState<Site | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (site: Site) => {
    setEditingSite(site);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingSite(undefined);
    setIsModalOpen(true);
  }

  return (
    <div className="space-y-6 animate-fade-in text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Khu vực & Bãi xe</h2>
           <p className="text-gray-500 dark:text-gray-400 text-sm">Hệ thống quản lý tập trung đa điểm (Multi-site Management).</p>
        </div>
        <Button onClick={handleCreate}><Plus size={16}/> Thêm Bãi xe mới</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_SITES.map(site => (
          <GlassCard key={site.id} className="p-0 overflow-hidden flex flex-col group hover:border-primary-500/50 transition-all cursor-pointer" onClick={() => handleEdit(site)}>
            {/* Map/Image Preview */}
            <div className="h-40 bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
               <img src={site.image} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" alt="Site View" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-md border shadow-lg ${
                    site.status === 'Online' 
                    ? 'bg-green-500/80 text-white border-green-500/30' 
                    : 'bg-red-500/80 text-white border-red-500/30'
                  }`}>
                    {site.status === 'Online' ? '● ONLINE' : '● OFFLINE'}
                  </span>
               </div>
               <div className="absolute bottom-3 left-3">
                  <div className="text-white font-bold text-lg leading-none shadow-black drop-shadow-md">{site.name}</div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-200 mt-1">
                      <MapPin size={10}/> {site.address}
                  </div>
               </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              
              {/* Capacity Bars */}
              <div className="grid grid-cols-2 gap-4 my-2">
                 {/* Car Capacity */}
                 <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                       <span className="text-gray-500 flex items-center gap-1"><Car size={12}/> Ô tô</span>
                       <span className="font-bold font-mono text-gray-900 dark:text-white">{site.occupiedCar}/{site.capacityCar}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                       <div className={`h-full rounded-full ${site.occupiedCar/site.capacityCar > 0.9 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${(site.occupiedCar/site.capacityCar)*100}%` }}></div>
                    </div>
                 </div>

                 {/* Moto Capacity */}
                 <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                       <span className="text-gray-500 flex items-center gap-1"><Car size={12}/> Xe máy</span>
                       <span className="font-bold font-mono text-gray-900 dark:text-white">{site.occupiedMoto}/{site.capacityMoto}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                       <div className={`h-full rounded-full ${site.occupiedMoto/site.capacityMoto > 0.9 ? 'bg-red-500' : 'bg-orange-500'}`} style={{ width: `${(site.occupiedMoto/site.capacityMoto)*100}%` }}></div>
                    </div>
                 </div>
              </div>

              {/* Devices Summary */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 grid grid-cols-2 gap-2">
                 <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-white/5 rounded-lg">
                    <div className="p-1.5 bg-blue-500/10 text-blue-600 rounded"><Server size={14}/></div>
                    <div className="flex flex-col">
                       <span className="text-[10px] text-gray-400 uppercase">Camera</span>
                       <span className="text-xs font-bold text-gray-900 dark:text-white">{site.cameras} Active</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-white/5 rounded-lg">
                    <div className="p-1.5 bg-orange-500/10 text-orange-600 rounded"><AlertCircle size={14}/></div>
                    <div className="flex flex-col">
                       <span className="text-[10px] text-gray-400 uppercase">Barriers</span>
                       <span className="text-xs font-bold text-gray-900 dark:text-white">{site.barriers} Active</span>
                    </div>
                 </div>
              </div>

              <div className="mt-4 flex gap-2">
                 <Button variant="secondary" className="flex-1 text-xs h-9" onClick={(e) => { e.stopPropagation(); handleEdit(site); }}>Cấu hình</Button>
                 <Button className="flex-1 text-xs h-9 gap-1" onClick={(e) => e.stopPropagation()}>Truy cập <ExternalLink size={12}/></Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <SiteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} site={editingSite} />
    </div>
  );
};