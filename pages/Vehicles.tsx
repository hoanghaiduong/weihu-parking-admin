import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Input, Badge } from '../components/ui';
import { Search, Filter, Plus, Car, Calendar, User, MoreVertical, AlertCircle, ShieldBan, FileWarning, Save, X, Trash2 } from 'lucide-react';
import { DataStore } from '../utils/dataStore';
import { Vehicle, BlacklistVehicle } from '../types';

// --- Vehicle Modal ---
const VehicleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  vehicle?: Vehicle;
  onSave: (v: Vehicle) => void;
  onDelete: (id: string) => void;
}> = ({ isOpen, onClose, vehicle, onSave, onDelete }) => {
  const [form, setForm] = useState<Partial<Vehicle>>({});

  useEffect(() => {
    setForm(vehicle || { plate: '', owner: '', phone: '', type: 'Car', plan: 'Monthly', expiryDate: '', status: 'Active' });
  }, [vehicle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!form.plate) return;
    onSave({
      ...form,
      id: form.id || `V-${Date.now()}`,
    } as Vehicle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 p-6 animate-fade-in-up">
        <h3 className="text-xl font-bold mb-4">{vehicle ? 'Cập nhật Xe' : 'Đăng ký Xe mới'}</h3>
        <div className="space-y-4">
          <Input label="Biển số" value={form.plate} onChange={e => setForm({...form, plate: e.target.value})} placeholder="VD: 59T1-12345" />
          <div className="grid grid-cols-2 gap-4">
             <Input label="Chủ xe" value={form.owner} onChange={e => setForm({...form, owner: e.target.value})} />
             <Input label="SĐT" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Loại xe</label>
                <select className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2" value={form.type} onChange={e => setForm({...form, type: e.target.value as any})}>
                   <option value="Car">Ô tô</option>
                   <option value="Motorbike">Xe máy</option>
                   <option value="Truck">Xe tải</option>
                </select>
             </div>
             <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Gói cước</label>
                <select className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2" value={form.plan} onChange={e => setForm({...form, plan: e.target.value as any})}>
                   <option value="Monthly">Vé Tháng</option>
                   <option value="VIP">VIP</option>
                   <option value="Resident">Cư dân</option>
                </select>
             </div>
          </div>
          <Input label="Ngày hết hạn" type="date" value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})} />
        </div>
        <div className="mt-6 flex justify-between gap-3">
           {vehicle && <Button variant="danger" onClick={() => { onDelete(vehicle.id); onClose(); }}><Trash2 size={16}/></Button>}
           <div className="flex gap-2 ml-auto">
             <Button variant="secondary" onClick={onClose}>Hủy</Button>
             <Button onClick={handleSubmit}>Lưu</Button>
           </div>
        </div>
      </div>
    </div>
  );
};

export const Vehicles: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'registered' | 'blacklist'>('registered');
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [blacklist, setBlacklist] = useState<BlacklistVehicle[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>(undefined);

  useEffect(() => {
    setVehicles(DataStore.vehicles.getAll());
    setBlacklist(DataStore.blacklist.getAll());
  }, [isModalOpen]);

  const handleSaveVehicle = (v: Vehicle) => {
    DataStore.vehicles.save(v);
    setVehicles(DataStore.vehicles.getAll());
  };

  const handleDeleteVehicle = (id: string) => {
    DataStore.vehicles.delete(id);
    setVehicles(DataStore.vehicles.getAll());
  };

  const openAddModal = () => {
    setEditingVehicle(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (v: Vehicle) => {
    setEditingVehicle(v);
    setIsModalOpen(true);
  }

  const removeBlacklist = (id: string) => {
    if(confirm('Gỡ bỏ xe khỏi danh sách đen?')) {
      DataStore.blacklist.delete(id);
      setBlacklist(DataStore.blacklist.getAll());
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-[#84CC16]/10 text-[#65A30D] dark:text-[#84CC16] border-[#84CC16]/20';
      case 'Expiring Soon': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      case 'Expired': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Xe & An ninh</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Quản lý vé tháng, danh sách VIP và Danh sách đen.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="danger" className="shadow-none border-red-200 dark:border-red-900"><ShieldBan size={16}/> Báo cáo xe vi phạm</Button>
           <Button className="shadow-[0_0_20px_rgba(132,204,22,0.3)]" onClick={openAddModal}><Plus size={18} /> Đăng ký xe mới</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('registered')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'registered' ? 'bg-white dark:bg-gray-800 text-primary-500 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
        >
          <Car size={16} /> Xe Đăng ký
        </button>
        <button 
          onClick={() => setActiveTab('blacklist')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'blacklist' ? 'bg-white dark:bg-gray-800 text-red-500 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
        >
          <ShieldBan size={16} /> Danh sách đen
        </button>
      </div>

      <GlassCard className="p-4">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
          <div className="flex-1 max-w-md relative">
             <Input 
                icon={<Search size={16} />} 
                placeholder="Tìm biển số, chủ xe hoặc SĐT..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          {activeTab === 'registered' && (
            <div className="flex gap-2">
              <select className="bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-[#84CC16] focus:outline-none">
                <option>Tất cả loại xe</option>
                <option>Ô tô</option>
                <option>Xe máy</option>
              </select>
              <Button variant="secondary"><Filter size={16} /> Lọc</Button>
            </div>
          )}
        </div>

        {/* REGISTERED VEHICLES TABLE */}
        {activeTab === 'registered' && (
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Thông tin xe</th>
                  <th className="p-4 font-semibold">Chủ xe</th>
                  <th className="p-4 font-semibold">Gói đăng ký</th>
                  <th className="p-4 font-semibold">Hết hạn</th>
                  <th className="p-4 font-semibold">Trạng thái</th>
                  <th className="p-4 font-semibold text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {vehicles.map((v) => (
                  <tr key={v.id} className="border-b border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10">
                          <Car size={20} />
                        </div>
                        <div>
                          <p className="font-mono font-bold text-gray-900 dark:text-white">{v.plate}</p>
                          <p className="text-xs text-gray-500">{v.type === 'Car' ? 'Ô tô' : v.type === 'Motorbike' ? 'Xe máy' : 'Xe tải'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                         <User size={14} className="text-gray-500"/>
                         <span className="text-gray-700 dark:text-gray-300">{v.owner}</span>
                      </div>
                      <p className="text-xs text-gray-500 pl-6">{v.phone}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold">
                        {v.plan}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Calendar size={14} />
                        {v.expiryDate}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex w-fit items-center gap-1.5 ${getStatusColor(v.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${v.status === 'Active' ? 'bg-[#84CC16]' : v.status === 'Expired' ? 'bg-red-500' : 'bg-yellow-400'}`}></span>
                        {v.status === 'Active' ? 'Hoạt động' : v.status === 'Expired' ? 'Hết hạn' : 'Sắp hết hạn'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEditModal(v)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* BLACKLIST TABLE */}
        {activeTab === 'blacklist' && (
          <div className="overflow-x-auto min-h-[400px]">
             <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl mb-4 flex gap-3 items-center text-red-600 dark:text-red-400 text-sm">
                <FileWarning size={20} />
                <span>Cảnh báo: Xe trong danh sách đen sẽ bị TỪ CHỐI tự động hoặc kích hoạt báo động cho bảo vệ.</span>
             </div>
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Biển số</th>
                  <th className="p-4 font-semibold">Lý do chặn</th>
                  <th className="p-4 font-semibold">Người thêm</th>
                  <th className="p-4 font-semibold">Ngày thêm</th>
                  <th className="p-4 font-semibold text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {blacklist.map((v) => (
                  <tr key={v.id} className="border-b border-gray-200 dark:border-white/5 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                    <td className="p-4 font-mono font-bold text-red-600 dark:text-red-400 text-lg">{v.plate}</td>
                    <td className="p-4 font-bold text-gray-800 dark:text-gray-200">{v.reason}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{v.addedBy}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{v.date}</td>
                    <td className="p-4 text-right">
                      <Button variant="secondary" className="text-xs h-8" onClick={() => removeBlacklist(v.id)}>Gỡ bỏ</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
             </table>
          </div>
        )}
      </GlassCard>

      <VehicleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicle={editingVehicle}
        onSave={handleSaveVehicle}
        onDelete={handleDeleteVehicle}
      />
    </div>
  );
};