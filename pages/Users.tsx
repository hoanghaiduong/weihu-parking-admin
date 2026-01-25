import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Input, Checkbox, Badge } from '../components/ui';
import { Users as UsersIcon, Plus, Shield, UserCheck, MoreVertical, Check, ChevronRight, ChevronDown, Save, X, Lock, Minus, Circle } from 'lucide-react';
import { DataStore } from '../utils/dataStore';
import { Role, UserAccount } from '../types';

interface PermissionModule {
  id: string;
  label: string;
  actions: {
    view?: string;
    create?: string;
    edit?: string;
    delete?: string;
    special?: { id: string, label: string }[];
  }
}

// --- Data: RBAC Matrix Configuration ---
const RBAC_GRID: PermissionModule[] = [
  {
    id: 'dashboard',
    label: 'Dashboard & Thống kê',
    actions: { view: 'dashboard.view', special: [{ id: 'dashboard.export', label: 'Xuất Báo cáo' }] }
  },
  {
    id: 'live',
    label: 'Vận hành Làn (Live)',
    actions: { view: 'live.view', special: [{ id: 'live.control', label: 'Điều khiển Barrier' }, { id: 'live.incident', label: 'Xử lý Sự cố' }] }
  },
  {
    id: 'vehicles',
    label: 'Quản lý Xe & Vé',
    actions: { view: 'vehicles.view', create: 'vehicles.create', edit: 'vehicles.edit', delete: 'vehicles.delete' }
  },
  {
    id: 'pricing',
    label: 'Cấu hình Giá vé',
    actions: { view: 'pricing.view', edit: 'pricing.edit' }
  }
];

// --- Components ---

// 2. Role Editor Modal with Grid System
const RoleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  role?: Role;
  onSave: (role: Role) => void;
}> = ({ isOpen, onClose, role, onSave }) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');

  useEffect(() => {
    if(role) {
      setPermissions(role.permissions);
      setRoleName(role.name);
      setRoleDesc(role.description);
    } else {
      setPermissions([]);
      setRoleName('');
      setRoleDesc('');
    }
  }, [role, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave({
      id: role?.id || roleName.toLowerCase().replace(/\s/g, '_'),
      name: roleName,
      description: roleDesc,
      permissions,
      userCount: role?.userCount || 0,
      isSystem: role?.isSystem
    });
    onClose();
  };

  const togglePermission = (id: string) => {
    setPermissions(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id);
      return [...prev, id];
    });
  };

  const hasPermission = (id: string) => {
    if (permissions.includes('ALL')) return true;
    return permissions.includes(id);
  };

  // Helper to render a Check/X cell
  const GridCell = ({ permId, disabled }: { permId?: string, disabled?: boolean }) => {
    if (!permId) return <div className="h-full w-full flex items-center justify-center bg-gray-50/50 dark:bg-white/5"></div>;
    const isSelected = hasPermission(permId);
    return (
      <div 
        onClick={() => !disabled && togglePermission(permId)}
        className={`h-full w-full flex items-center justify-center cursor-pointer transition-all border-l border-gray-100 dark:border-white/5
          ${isSelected ? 'bg-primary-500/5' : 'hover:bg-gray-50 dark:hover:bg-white/5'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isSelected 
            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20 scale-100' 
            : 'text-gray-300 dark:text-gray-600 scale-90'
        }`}>
          {isSelected ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col max-h-[90vh] animate-fade-in-up">
        
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="text-primary-500" /> 
            {role ? 'Chỉnh sửa Vai trò' : 'Tạo Vai trò mới'}
          </h3>
          <button onClick={onClose}><X className="text-gray-400 hover:text-gray-900 dark:hover:text-white" /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Input label="Tên vai trò" value={roleName} onChange={e => setRoleName(e.target.value)} />
            <Input label="Mô tả" value={roleDesc} onChange={e => setRoleDesc(e.target.value)} />
          </div>

          <div>
             <div className="flex justify-between items-end mb-4">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ma trận Phân quyền</label>
             </div>
             <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-black/20 shadow-sm">
                <div className="grid grid-cols-12 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-xs font-bold text-gray-500 uppercase tracking-wider">
                   <div className="col-span-3 p-4">Phân hệ / Tài nguyên</div>
                   <div className="col-span-9 grid grid-cols-5 text-center">
                      <div className="p-4">Xem</div>
                      <div className="p-4">Tạo</div>
                      <div className="p-4">Sửa</div>
                      <div className="p-4">Xóa</div>
                      <div className="p-4">Khác</div>
                   </div>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-white/5">
                   {RBAC_GRID.map((module) => (
                      <div key={module.id} className="grid grid-cols-12 items-stretch hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                         <div className="col-span-3 p-4 flex items-center font-medium text-gray-900 dark:text-white text-sm">{module.label}</div>
                         <div className="col-span-9 grid grid-cols-5 text-center items-center">
                            <GridCell permId={module.actions.view} />
                            <GridCell permId={module.actions.create} />
                            <GridCell permId={module.actions.edit} />
                            <GridCell permId={module.actions.delete} />
                            <div className="h-full w-full flex flex-col justify-center items-center gap-1 border-l border-gray-100 dark:border-white/5 p-2">
                               {module.actions.special ? module.actions.special.map(spec => {
                                    const isSelected = hasPermission(spec.id);
                                    return (
                                      <div key={spec.id} onClick={() => togglePermission(spec.id)}
                                        className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer border transition-all w-full
                                          ${isSelected ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20' : 'bg-gray-100 dark:bg-white/5 text-gray-400 border-transparent'}
                                        `}>{spec.label}</div>
                                    )
                                  }) : <span className="text-gray-300 dark:text-gray-700 text-xs">-</span>}
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 bg-gray-50 dark:bg-white/5 rounded-b-2xl">
           <Button variant="secondary" onClick={onClose}>Hủy bỏ</Button>
           <Button onClick={handleSubmit}><Save size={16}/> Lưu cấu hình</Button>
        </div>
      </div>
    </div>
  );
};


// 3. Main Users Page
export const Users: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>(undefined);

  useEffect(() => {
    setRoles(DataStore.roles.getAll());
    setUsers(DataStore.users.getAll());
  }, [isRoleModalOpen]);

  const openCreateRole = () => {
    setEditingRole(undefined);
    setIsRoleModalOpen(true);
  };

  const openEditRole = (role: Role) => {
    setEditingRole(role);
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = (role: Role) => {
    DataStore.roles.save(role);
    setRoles(DataStore.roles.getAll());
  };

  return (
    <div className="space-y-6 animate-fade-in text-gray-900 dark:text-gray-100 relative">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Truy cập (IAM)</h2>
           <p className="text-gray-500 dark:text-gray-400 text-sm">Quản lý người dùng, vai trò và phân quyền hệ thống.</p>
        </div>
        <Button onClick={activeTab === 'users' ? () => {} : openCreateRole}>
           <Plus size={16}/> {activeTab === 'users' ? 'Thêm người dùng' : 'Thêm vai trò'}
        </Button>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl w-fit">
        <button onClick={() => setActiveTab('users')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white dark:bg-gray-800 text-primary-500 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Danh sách Người dùng</button>
        <button onClick={() => setActiveTab('roles')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'roles' ? 'bg-white dark:bg-gray-800 text-primary-500 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Vai trò & Phân quyền</button>
      </div>

      {activeTab === 'users' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <GlassCard className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-3"><Shield size={24} /></div>
                <h3 className="font-bold text-2xl text-gray-900 dark:text-white">{users.filter(u => u.role === 'admin').length}</h3>
                <p className="text-sm text-gray-500">Quản trị viên (Admin)</p>
             </GlassCard>
             <GlassCard className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-3"><UserCheck size={24} /></div>
                <h3 className="font-bold text-2xl text-gray-900 dark:text-white">{users.filter(u => u.role === 'operator').length}</h3>
                <p className="text-sm text-gray-500">Vận hành viên</p>
             </GlassCard>
             <GlassCard className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-3"><UsersIcon size={24} /></div>
                <h3 className="font-bold text-2xl text-gray-900 dark:text-white">{users.length}</h3>
                <p className="text-sm text-gray-500">Tổng tài khoản</p>
             </GlassCard>
          </div>

          <GlassCard className="p-0 overflow-hidden">
             <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white">Danh sách tài khoản</div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                 <thead className="text-gray-500 uppercase text-xs bg-gray-100 dark:bg-black/20">
                   <tr>
                     <th className="p-4">Họ tên</th>
                     <th className="p-4">Email / Tên đăng nhập</th>
                     <th className="p-4">Vai trò</th>
                     <th className="p-4">Trạng thái</th>
                     <th className="p-4">Đăng nhập cuối</th>
                     <th className="p-4 text-right"></th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                         <td className="p-4 font-bold text-gray-800 dark:text-white">{u.name}</td>
                         <td className="p-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                         <td className="p-4"><span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-500/20">{u.role}</span></td>
                         <td className="p-4"><span className={`w-2 h-2 rounded-full inline-block mr-2 ${u.status === 'Online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>{u.status}</td>
                         <td className="p-4 text-gray-500 font-mono text-xs">{u.lastLogin}</td>
                         <td className="p-4 text-right"><button className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded"><MoreVertical size={16} className="text-gray-500"/></button></td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
          </GlassCard>
        </>
      )}

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {roles.map(role => (
             <GlassCard key={role.id} className="flex flex-col h-full hover:border-primary-500/50 transition-colors group">
               <div className="p-6 flex-1">
                 <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                      {role.id === 'admin' ? <Lock size={24} /> : <UserCheck size={24} />}
                   </div>
                   {role.isSystem && <span className="text-[10px] uppercase font-bold bg-gray-200 dark:bg-white/10 text-gray-500 px-2 py-1 rounded">System</span>}
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{role.name}</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 h-10 line-clamp-2">{role.description}</p>
               </div>
               
               <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex gap-2">
                 <Button variant="secondary" className="flex-1 text-xs h-9" onClick={() => openEditRole(role)}>Cấu hình quyền</Button>
               </div>
             </GlassCard>
           ))}
           <button onClick={openCreateRole} className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-400 hover:text-primary-500 hover:border-primary-500 hover:bg-primary-500/5 transition-all min-h-[240px]">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-3"><Plus size={24} /></div>
              <span className="font-bold text-sm">Tạo vai trò mới</span>
           </button>
        </div>
      )}

      {isRoleModalOpen && (
        <RoleModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} role={editingRole} onSave={handleSaveRole}/>
      )}
    </div>
  );
};