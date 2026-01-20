import React from 'react';
import { LayoutDashboard, Video, Car, FileText, Settings, LogOut, CreditCard, ChevronLeft, ChevronRight, Server, Users, Ticket, Building2 } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, onLogout, isCollapsed, onToggle }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
    { id: 'live', icon: Video, label: 'Vận hành Làn' },
    { id: 'sessions', icon: FileText, label: 'Lượt xe' },
    { id: 'vehicles', icon: Car, label: 'Quản lý Xe' },
    { id: 'payments', icon: CreditCard, label: 'Doanh thu' },
    { type: 'divider' }, // Visual separator
    { id: 'sites', icon: Building2, label: 'Khu vực & Bãi xe' },
    { id: 'devices', icon: Server, label: 'Camera & IoT' },
    { id: 'pricing', icon: Ticket, label: 'Cấu hình giá' },
    { id: 'users', icon: Users, label: 'Người dùng (IAM)' },
    { type: 'divider' },
    { id: 'settings', icon: Settings, label: 'Hệ thống' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-r border-gray-200 dark:border-white/5 flex flex-col z-50 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-20 lg:w-64'}
      `}
    >
      {/* Toggle Button (Desktop Only) */}
      <button 
        onClick={onToggle}
        className="absolute -right-3 top-9 hidden lg:flex w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full items-center justify-center text-gray-500 hover:text-primary-500 hover:border-primary-500 transition-colors shadow-sm z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Area */}
      <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center' : 'justify-center lg:justify-start lg:px-6'} border-b border-gray-200 dark:border-white/5 transition-all duration-300`}>
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 shrink-0">
          <span className="text-white font-bold text-xl">W</span>
        </div>
        
        <div className={`ml-3 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-0 opacity-0 lg:w-auto lg:opacity-100 lg:block hidden'}`}>
          <h1 className="font-bold text-gray-900 dark:text-white leading-tight whitespace-nowrap">WEIHU</h1>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 tracking-wider whitespace-nowrap">PARKING ADMIN</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {navItems.map((item, index) => {
          if (item.type === 'divider') {
            return <div key={`div-${index}`} className={`h-px bg-gray-200 dark:bg-white/5 my-2 ${isCollapsed ? 'mx-2' : 'mx-4'}`} />;
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id!)}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative
                ${currentPage === item.id 
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                }
                ${isCollapsed ? 'justify-center' : 'justify-center lg:justify-start'}
              `}
            >
              {item.icon && <item.icon size={20} strokeWidth={currentPage === item.id ? 2.5 : 2} className="shrink-0" />}
              
              <span className={`ml-3 font-medium transition-all duration-300 whitespace-nowrap overflow-hidden
                ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-0 opacity-0 hidden lg:w-auto lg:opacity-100 lg:block'}
              `}>
                {item.label}
              </span>

              {currentPage === item.id && !isCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full hidden lg:block animate-pulse" />
              )}
              
              {/* Custom Hover Tooltip for Collapsed Mode - Fixed Position to avoid clip */}
              {isCollapsed && (
                <div className="fixed left-20 ml-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60] hidden lg:block shadow-xl translate-x-1 group-hover:translate-x-0 transform duration-200" style={{ marginTop: '-4px' }}>
                  {item.label}
                  {/* Arrow */}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-white/5">
        <button 
          onClick={onLogout}
          className={`w-full flex items-center p-3 rounded-xl text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-colors group relative
            ${isCollapsed ? 'justify-center' : 'justify-center lg:justify-start'}
          `}
        >
          <LogOut size={20} className="shrink-0" />
          <span className={`ml-3 font-medium transition-all duration-300 whitespace-nowrap overflow-hidden
             ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-0 opacity-0 hidden lg:w-auto lg:opacity-100 lg:block'}
          `}>
            Đăng xuất
          </span>
          
           {/* Hover Tooltip for Collapsed Mode */}
           {isCollapsed && (
              <div className="fixed left-20 bottom-8 ml-2 px-2.5 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60] hidden lg:block shadow-xl translate-x-1 group-hover:translate-x-0 transform duration-200">
                Đăng xuất
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-red-600"></div>
              </div>
            )}
        </button>
      </div>
    </aside>
  );
};