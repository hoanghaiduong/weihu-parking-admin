import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, Button, Input, Checkbox } from '../components/ui';
import { MapPin, Plus, Server, Car, AlertCircle, ExternalLink, X, Save, Clock, Activity, PieChart as PieIcon, BarChart3, Trash2 } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { DataStore } from '../utils/dataStore';
import { Site } from '../types';

const COLORS = ['#84CC16', '#3b82f6', '#f97316', '#e5e7eb'];

// --- Site Configuration Modal ---
const SiteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  site?: Site;
  onSave: (site: Site) => void;
  onDelete: (id: string) => void;
}> = ({ isOpen, onClose, site, onSave, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'stats'>('info');
  const [formData, setFormData] = useState<Partial<Site>>({});

  useEffect(() => {
    if (site) {
      setFormData(site);
    } else {
      setFormData({
        name: '', address: '', capacityCar: 100, capacityMoto: 200, occupiedCar: 0, occupiedMoto: 0, 
        status: 'Online', cameras: 0, barriers: 0, 
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
      });
    }
  }, [site, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const newSite = {
      ...formData,
      id: formData.id || `SITE-${Math.floor(Math.random() * 10000)}`,
    } as Site;
    onSave(newSite);
    onClose();
  };

  const handleDelete = () => {
    if (formData.id && confirm("Bạn có chắc chắn xóa bãi xe này?")) {
      onDelete(formData.id);
      onClose();
    }
  };

  // Stats Logic
  const capacityData = [
    { name: 'Ô tô đã gửi', value: formData.occupiedCar || 0 },
    { name: 'Xe máy đã gửi', value: formData.occupiedMoto || 0 },
    { name: 'Trống', value: ((formData.capacityCar || 0) + (formData.capacityMoto || 0)) - ((formData.occupiedCar || 0) + (formData.occupiedMoto || 0)) }
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
              {site ? 'Cấu hình Bãi xe' : 'Thêm Bãi xe mới'}
            </h3>
            <p className="text-sm text-gray-500">{formData.address || 'Thiết lập thông số vận hành'}</p>
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
          {(activeTab === 'info' || !site) && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase border-b border-gray-200 dark:border-white/10 pb-2">Thông tin cơ bản</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Tên Khu vực" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <Input label="Mã Site ID" value={formData.id} disabled className="opacity-70" placeholder="Auto-generated"/>
                </div>
                <Input label="Địa chỉ vật lý" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} icon={<MapPin size={16}/>} />
                <div className="flex items-center gap-4">
                   <div className="flex-1">
                     <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Trạng thái</label>
                     <select 
                        className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary-500"
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value as any})}
                     >
                        <option value="Online">Đang hoạt động (Online)</option>
                        <option value="Maintenance">Bảo trì (Maintenance)</option>
                        <option value="Offline">Ngừng hoạt động (Offline)</option>
                     </select>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase border-b border-gray-200 dark:border-white/10 pb-2 flex items-center gap-2">
                   <Activity size={16}/> Quản lý Sức chứa
                </h4>
                <div className="grid grid-cols-2 gap-6">
                   <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                         <Car size={18}/> Ô tô (Car)
                      </div>
                      <Input label="Tổng chỗ" type="number" value={formData.capacityCar} onChange={e => setFormData({...formData, capacityCar: Number(e.target.value)})} />
                      <Input label="Đã gửi" type="number" value={formData.occupiedCar} onChange={e => setFormData({...formData, occupiedCar: Number(e.target.value)})} />
                   </div>
                   <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl space-y-3">
                      <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold">
                         <Car size={18}/> Xe máy (Moto)
                      </div>
                      <Input label="Tổng chỗ" type="number" value={formData.capacityMoto} onChange={e => setFormData({...formData, capacityMoto: Number(e.target.value)})} />
                      <Input label="Đã gửi" type="number" value={formData.occupiedMoto} onChange={e => setFormData({...formData, occupiedMoto: Number(e.target.value)})} />
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: STATS */}
          {activeTab === 'stats' && site && (
             <div className="space-y-6">
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
                  </div>
               </div>
             </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-between gap-3 bg-gray-50 dark:bg-white/5 rounded-b-2xl">
           {site ? <Button variant="danger" onClick={handleDelete}><Trash2 size={16}/> Xóa Bãi xe</Button> : <div></div>}
           <div className="flex gap-2">
             <Button variant="secondary" onClick={onClose}>Hủy bỏ</Button>
             <Button onClick={handleSubmit}><Save size={16}/> Lưu thay đổi</Button>
           </div>
        </div>
      </div>
    </div>
  );
};


export const Sites: React.FC = () => {
  const navigate = useNavigate();
  const [sites, setSites] = useState<Site[]>([]);
  const [editingSite, setEditingSite] = useState<Site | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSites(DataStore.sites.getAll());
  }, [isModalOpen]); // Reload on modal close

  const handleEdit = (site: Site) => {
    setEditingSite(site);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingSite(undefined);
    setIsModalOpen(true);
  }

  const handleAccess = (id: string) => {
    navigate(`/sites/${id}`);
  }

  const saveSite = (site: Site) => {
    DataStore.sites.save(site);
    setSites(DataStore.sites.getAll());
  }

  const deleteSite = (id: string) => {
    DataStore.sites.delete(id);
    setSites(DataStore.sites.getAll());
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
        {sites.map(site => (
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
                 <Button className="flex-1 text-xs h-9 gap-1" onClick={(e) => { e.stopPropagation(); handleAccess(site.id); }}>Truy cập <ExternalLink size={12}/></Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <SiteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} site={editingSite} onSave={saveSite} onDelete={deleteSite} />
    </div>
  );
};