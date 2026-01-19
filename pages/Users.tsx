import React, { useState, useMemo } from 'react';
import { GlassCard, Button, Input, Checkbox, Badge } from '../components/ui';
import { Users as UsersIcon, Plus, Shield, UserCheck, MoreVertical, Check, ChevronRight, ChevronDown, Save, X, Lock, Minus, Circle } from 'lucide-react';

// --- Types ---
interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // List of permission IDs
  userCount: number;
  isSystem?: boolean; // Cannot be deleted
}

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
    actions: {
      view: 'dashboard.view',
      special: [
        { id: 'dashboard.export', label: 'Xuất Báo cáo' }
      ]
    }
  },
  {
    id: 'live',
    label: 'Vận hành Làn (Live)',
    actions: {
      view: 'live.view',
      special: [
        { id: 'live.control', label: 'Điều khiển Barrier' },
        { id: 'live.incident', label: 'Xử lý Sự cố' }
      ]
    }
  },
  {
    id: 'vehicles',
    label: 'Quản lý Xe & Vé',
    actions: {
      view: 'vehicles.view',
      create: 'vehicles.create',
      edit: 'vehicles.edit',
      delete: 'vehicles.delete'
    }
  },
  {
    id: 'users',
    label: 'Người dùng & Vai trò',
    actions: {
      view: 'system.users.view',
      create: 'system.users.create',
      edit: 'system.users.edit',
      delete: 'system.users.delete'
    }
  },
  {
    id: 'pricing',
    label: 'Cấu hình Giá vé',
    actions: {
      view: 'pricing.view',
      edit: 'pricing.edit'
    }
  },
  {
    id: 'system',
    label: 'Cài đặt Hệ thống',
    actions: {
      view: 'system.view',
      edit: 'system.edit',
      special: [
        { id: 'system.hardware', label: 'Cấu hình Thiết bị' }
      ]
    }
  }
];

const MOCK_ROLES: Role[] = [
  { 
    id: 'admin', 
    name: 'Super Admin', 
    description: 'Quyền truy cập toàn bộ hệ thống', 
    permissions: ['ALL'], 
    userCount: 2,
    isSystem: true
  },
  { 
    id: 'operator', 
    name: 'Vận hành viên', 
    description: 'Giám sát làn xe và xử lý sự cố cơ bản', 
    permissions: ['live.view', 'live.control', 'live.incident', 'vehicles.view'],
    userCount: 8
  },
  { 
    id: 'accountant', 
    name: 'Kế toán', 
    description: 'Xem báo cáo và quản lý doanh thu', 
    permissions: ['dashboard.view', 'dashboard.export', 'vehicles.view', 'pricing.view'],
    userCount: 1
  }
];

// --- Components ---

// 2. Role Editor Modal with Grid System
const RoleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  role?: Role; // If editing
}> = ({ isOpen, onClose, role }) => {
  const [permissions, setPermissions] = useState<string[]>(role?.permissions || []);
  const [roleName, setRoleName] = useState(role?.name || '');
  const [roleDesc, setRoleDesc] = useState(role?.description || '');

  if (!isOpen) return null;

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
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="text-primary-500" /> 
              {role ? 'Chỉnh sửa Vai trò' : 'Tạo Vai trò mới'}
            </h3>
            <p className="text-sm text-gray-500">Thiết lập ma trận phân quyền cho nhóm người dùng.</p>
          </div>
          <button onClick={onClose}><X className="text-gray-400 hover:text-gray-900 dark:hover:text-white" /></button>
        </div>

        {/* Body - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Input 
              label="Tên vai trò" 
              placeholder="Ví dụ: Giám sát viên" 
              value={roleName}
              onChange={e => setRoleName(e.target.value)}
            />
            <Input 
              label="Mô tả" 
              placeholder="Mô tả ngắn gọn trách nhiệm..." 
              value={roleDesc}
              onChange={e => setRoleDesc(e.target.value)}
            />
          </div>

          <div>
             <div className="flex justify-between items-end mb-4">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ma trận Phân quyền (Permission Matrix)</label>
                <div className="flex gap-4 text-xs text-gray-500">
                   <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-primary-500 text-white flex items-center justify-center"><Check size={10}/></div> Được phép</div>
                   <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full text-gray-300 flex items-center justify-center border border-gray-300"><X size={10}/></div> Không được phép</div>
                </div>
             </div>

             <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-black/20 shadow-sm">
                {/* Header Row */}
                <div className="grid grid-cols-12 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-xs font-bold text-gray-500 uppercase tracking-wider">
                   <div className="col-span-3 p-4">Phân hệ / Tài nguyên</div>
                   <div className="col-span-9 grid grid-cols-5 text-center">
                      <div className="p-4">Xem (Read)</div>
                      <div className="p-4">Tạo (Create)</div>
                      <div className="p-4">Sửa (Update)</div>
                      <div className="p-4">Xóa (Delete)</div>
                      <div className="p-4">Khác (Special)</div>
                   </div>
                </div>

                {/* Body Rows */}
                <div className="divide-y divide-gray-100 dark:divide-white/5">
                   {RBAC_GRID.map((module) => (
                      <div key={module.id} className="grid grid-cols-12 items-stretch hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                         {/* Module Name */}
                         <div className="col-span-3 p-4 flex items-center font-medium text-gray-900 dark:text-white text-sm">
                            {module.label}
                         </div>

                         {/* Actions Matrix */}
                         <div className="col-span-9 grid grid-cols-5 text-center items-center">
                            <GridCell permId={module.actions.view} />
                            <GridCell permId={module.actions.create} />
                            <GridCell permId={module.actions.edit} />
                            <GridCell permId={module.actions.delete} />
                            
                            {/* Special Actions (Dropdown or Stacked) */}
                            <div className="h-full w-full flex flex-col justify-center items-center gap-1 border-l border-gray-100 dark:border-white/5 p-2">
                               {module.actions.special ? (
                                  module.actions.special.map(spec => {
                                    const isSelected = hasPermission(spec.id);
                                    return (
                                      <div 
                                        key={spec.id}
                                        onClick={() => togglePermission(spec.id)}
                                        className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer border transition-all w-full
                                          ${isSelected 
                                            ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20' 
                                            : 'bg-gray-100 dark:bg-white/5 text-gray-400 border-transparent hover:border-gray-300'
                                          }
                                        `}
                                      >
                                        {spec.label}
                                      </div>
                                    )
                                  })
                               ) : (
                                 <span className="text-gray-300 dark:text-gray-700 text-xs">-</span>
                               )}
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 bg-gray-50 dark:bg-white/5 rounded-b-2xl">
           <Button variant="secondary" onClick={onClose}>Hủy bỏ</Button>
           <Button><Save size={16}/> Lưu cấu hình</Button>
        </div>
      </div>
    </div>
  );
};


// 3. Main Users Page
export const Users: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>(undefined);

  const openCreateRole = () => {
    setEditingRole(undefined);
    setIsRoleModalOpen(true);
  };

  const openEditRole = (role: Role) => {
    setEditingRole(role);
    setIsRoleModalOpen(true);
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

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white dark:bg-gray-800 text-primary-500 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
        >
          Danh sách Người dùng
        </button>
        <button 
          onClick={() => setActiveTab('roles')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'roles' ? 'bg-white dark:bg-gray-800 text-primary-500 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
        >
          Vai trò & Phân quyền
        </button>
      </div>

      {activeTab === 'users' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <GlassCard className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-3">
                   <Shield size={24} />
                </div>
                <h3 className="font-bold text-2xl text-gray-900 dark:text-white">2</h3>
                <p className="text-sm text-gray-500">Quản trị viên (Admin)</p>
             </GlassCard>
             <GlassCard className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-3">
                   <UserCheck size={24} />
                </div>
                <h3 className="font-bold text-2xl text-gray-900 dark:text-white">8</h3>
                <p className="text-sm text-gray-500">Vận hành viên (Operator)</p>
             </GlassCard>
             <GlassCard className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-3">
                   <UsersIcon size={24} />
                </div>
                <h3 className="font-bold text-2xl text-gray-900 dark:text-white">10</h3>
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
                    {/* Mock Data */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-white/5">
                       <td className="p-4 font-bold text-gray-800 dark:text-white">Nguyễn Quản Trị</td>
                       <td className="p-4 text-gray-600 dark:text-gray-400">admin@weihu.com</td>
                       <td className="p-4"><span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold border border-purple-500/20">Super Admin</span></td>
                       <td className="p-4"><span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2"></span>Online</td>
                       <td className="p-4 text-gray-500 font-mono text-xs">Vừa xong</td>
                       <td className="p-4 text-right"><button className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded"><MoreVertical size={16} className="text-gray-500"/></button></td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-white/5">
                       <td className="p-4 font-bold text-gray-800 dark:text-white">Trần Vận Hành</td>
                       <td className="p-4 text-gray-600 dark:text-gray-400">operator1@weihu.com</td>
                       <td className="p-4"><span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-500/20">Operator</span></td>
                       <td className="p-4"><span className="w-2 h-2 rounded-full bg-gray-400 inline-block mr-2"></span>Offline</td>
                       <td className="p-4 text-gray-500 font-mono text-xs">2 giờ trước</td>
                       <td className="p-4 text-right"><button className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded"><MoreVertical size={16} className="text-gray-500"/></button></td>
                    </tr>
                 </tbody>
               </table>
             </div>
          </GlassCard>
        </>
      )}

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {MOCK_ROLES.map(role => (
             <GlassCard key={role.id} className="flex flex-col h-full hover:border-primary-500/50 transition-colors group">
               <div className="p-6 flex-1">
                 <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                      {role.id === 'admin' ? <Lock size={24} /> : <UserCheck size={24} />}
                   </div>
                   {role.isSystem && (
                     <span className="text-[10px] uppercase font-bold bg-gray-200 dark:bg-white/10 text-gray-500 px-2 py-1 rounded">System</span>
                   )}
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{role.name}</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 h-10 line-clamp-2">{role.description}</p>
                 
                 <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-2 rounded-lg w-fit">
                    <UsersIcon size={14} />
                    {role.userCount} tài khoản
                 </div>
               </div>
               
               <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex gap-2">
                 <Button variant="secondary" className="flex-1 text-xs h-9" onClick={() => openEditRole(role)}>Cấu hình quyền</Button>
               </div>
             </GlassCard>
           ))}

           {/* Add New Role Card */}
           <button 
              onClick={openCreateRole}
              className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-400 hover:text-primary-500 hover:border-primary-500 hover:bg-primary-500/5 transition-all min-h-[240px]"
           >
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-3">
                 <Plus size={24} />
              </div>
              <span className="font-bold text-sm">Tạo vai trò mới</span>
           </button>
        </div>
      )}

      {/* RBAC Modal */}
      {isRoleModalOpen && (
        <RoleModal 
          isOpen={isRoleModalOpen} 
          onClose={() => setIsRoleModalOpen(false)} 
          role={editingRole}
        />
      )}
    </div>
  );
};