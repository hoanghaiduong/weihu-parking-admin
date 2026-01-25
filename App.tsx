import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { LiveLane } from './pages/LiveLane';
import { Sessions } from './pages/Sessions';
import { Vehicles } from './pages/Vehicles';
import { Payments } from './pages/Payments';
import { System } from './pages/System';
import { Devices } from './pages/Devices';
import { Pricing } from './pages/Pricing';
import { Users } from './pages/Users';
import { Setup } from './pages/Setup';
import { Sites } from './pages/Sites'; 
import { SiteDetail } from './pages/SiteDetail'; // Import new page
import { Sidebar } from './components/Sidebar';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Bell, Search, Sun, Moon, Monitor, X, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { GlassCard } from './components/ui';

// --- Components for Navbar ---

const SearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-32 px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 animate-fade-in-up">
        <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-white/10">
          <Search className="text-gray-400" size={20} />
          <input 
            autoFocus
            className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-lg text-gray-900 dark:text-white placeholder-gray-400 font-sans"
            placeholder="Tìm kiếm xe, phiên gửi, hoặc cài đặt..."
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Tìm kiếm gần đây</p>
          <div className="space-y-1">
             <div className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
               <div className="p-1.5 bg-gray-200 dark:bg-white/10 rounded-md"><Search size={14}/></div>
               <span>Biển số 59T1-123.45</span>
             </div>
             <div className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
               <div className="p-1.5 bg-gray-200 dark:bg-white/10 rounded-md"><Search size={14}/></div>
               <span>Lịch sử thanh toán 27/10</span>
             </div>
          </div>
        </div>
        <div className="px-4 py-2 bg-gray-50 dark:bg-black/20 border-t border-gray-200 dark:border-white/5 text-xs text-gray-500 flex justify-between">
           <span>Nhấn <strong>ESC</strong> để đóng</span>
           <span>Weihu Intelligent Search</span>
        </div>
      </div>
    </div>
  );
};

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors relative"
      >
        <Bell size={18} />
        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)}></div>
          <GlassCard className="absolute right-0 top-12 w-80 z-40 p-0 overflow-hidden shadow-2xl animate-fade-in-up dark:bg-gray-900 dark:border-gray-700 ring-1 ring-black/5 dark:ring-white/10">
            <div className="p-3 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
              <span className="font-bold text-sm text-gray-900 dark:text-white">Thông báo</span>
              <span className="text-xs text-primary-500 cursor-pointer">Đánh dấu đã đọc</span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <div className="p-3 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                <div className="flex gap-3">
                  <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Sao lưu hệ thống hoàn tất</p>
                    <p className="text-xs text-gray-500 mt-1">Sao lưu database thành công lúc 02:00 sáng.</p>
                  </div>
                </div>
              </div>
              <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                <div className="flex gap-3">
                  <div className="w-2 h-2 mt-1.5 bg-red-500 rounded-full shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Camera Làn 02 Mất kết nối</p>
                    <p className="text-xs text-gray-500 mt-1">Mất tín hiệu 15 phút trước.</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
};

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggle = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <button 
      onClick={toggle}
      className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary-500 hover:border-primary-500 dark:hover:border-primary-500 transition-all"
      title={`Current: ${theme} mode`}
    >
      <Icon size={18} />
    </button>
  );
};

const UserDropdown: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
       <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/10 group"
        >
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-800 dark:text-white group-hover:text-primary-500 transition-colors">Vận hành viên John</p>
            <p className="text-xs text-gray-500">Giám sát viên</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-gray-700 overflow-hidden ring-2 ring-transparent group-hover:ring-primary-500 transition-all">
            <img src="https://picsum.photos/id/64/100/100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <ChevronDown size={14} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
       </button>

       {isOpen && (
         <>
           <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)}></div>
           <GlassCard className="absolute right-0 top-14 w-56 z-40 p-1 animate-fade-in-up dark:bg-gray-900 dark:border-gray-700 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
              <div className="p-3 border-b border-gray-100 dark:border-white/5 mb-1 bg-gray-50 dark:bg-white/5 rounded-t-xl">
                <p className="font-bold text-gray-900 dark:text-white">John Doe</p>
                <p className="text-xs text-gray-500 truncate">john.doe@weihu.com</p>
              </div>
              <div className="p-1">
                <button className="w-full flex items-center gap-2 p-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  <User size={16}/> Hồ sơ
                </button>
                <button className="w-full flex items-center gap-2 p-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  <Settings size={16}/> Cài đặt
                </button>
              </div>
              <div className="h-px bg-gray-100 dark:bg-white/5 my-1"></div>
              <div className="p-1">
                <button onClick={onLogout} className="w-full flex items-center gap-2 p-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <LogOut size={16}/> Đăng xuất
                </button>
              </div>
           </GlassCard>
         </>
       )}
    </div>
  );
}

// Layout Wrapper to handle Sidebar logic
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname.replace('/', '') || 'dashboard';
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleNavigate = (page: string) => {
    window.location.hash = `/${page}`;
  };

  const handleLogout = () => {
    window.location.hash = '/login';
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen relative font-sans selection:bg-primary-500 selection:text-white text-gray-900 dark:text-gray-100 transition-colors duration-300">
       {/* Fixed Background Layer */}
       <div className="mesh-bg" />

       <Sidebar 
         currentPage={currentPath} 
         onNavigate={handleNavigate}
         onLogout={handleLogout}
         isCollapsed={isSidebarCollapsed}
         onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
       />
       
       <main 
        className={`flex-1 p-6 lg:p-8 transition-all duration-300 ease-in-out relative z-0
          ${isSidebarCollapsed ? 'ml-20' : 'ml-20 lg:ml-64'}
        `}
       >
         
         {/* Top Header Area */}
         <header className="flex justify-between items-center mb-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md p-3 rounded-2xl border border-gray-200/50 dark:border-white/5 sticky top-4 z-20">
           
           {/* Left: Site Info / Breadcrumbs */}
           <div className="flex flex-col px-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 Main Plaza A
              </span>
           </div>
           
           {/* Right: Actions */}
           <div className="flex items-center gap-3">
             
             {/* Search Trigger */}
             <button 
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-black/30 text-gray-500 dark:text-gray-400 text-sm border border-transparent hover:border-primary-500/50 hover:text-primary-500 transition-all w-48"
             >
                <Search size={16} />
                <span>Tìm kiếm...</span>
                <span className="ml-auto text-[10px] border border-gray-300 dark:border-gray-600 rounded px-1">⌘K</span>
             </button>
             <button onClick={() => setIsSearchOpen(true)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-500"><Search size={18}/></button>

             {/* Theme Toggle */}
             <ThemeToggle />

             {/* Notifications */}
             <NotificationDropdown />
             
             {/* User Profile */}
             <UserDropdown onLogout={handleLogout} />

           </div>
         </header>

         {/* Content */}
         <div className="mt-4">
           {children}
         </div>

         <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
       </main>
    </div>
  );
};

const App: React.FC = () => {
  // Simple auth state mock
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSystemSetup, setIsSystemSetup] = useState(() => {
    return localStorage.getItem('weihu-setup-complete') === 'true';
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSetupComplete = () => {
    localStorage.setItem('weihu-setup-complete', 'true');
    setIsSystemSetup(true);
    window.location.hash = '/login';
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="weihu-theme-v2">
      <HashRouter>
        <Routes>
          {/* Setup Route: Access only if not set up */}
          <Route path="/setup" element={
            !isSystemSetup ? <Setup onComplete={handleSetupComplete} /> : <Navigate to="/login" />
          } />

          {/* Login Route: If not setup, go to setup. If auth, go to dashboard. */}
          <Route path="/login" element={
            !isSystemSetup ? <Navigate to="/setup" /> : 
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
          } />
          
          <Route path="/dashboard" element={
            !isSystemSetup ? <Navigate to="/setup" /> :
            isAuthenticated ? <MainLayout><Dashboard /></MainLayout> : <Navigate to="/login" />
          } />

          <Route path="/live" element={
            !isSystemSetup ? <Navigate to="/setup" /> :
            isAuthenticated ? <MainLayout><LiveLane /></MainLayout> : <Navigate to="/login" />
          } />

          <Route path="/sessions" element={
            !isSystemSetup ? <Navigate to="/setup" /> :
            isAuthenticated ? <MainLayout><Sessions /></MainLayout> : <Navigate to="/login" />
          } />

          <Route path="/vehicles" element={
            !isSystemSetup ? <Navigate to="/setup" /> :
            isAuthenticated ? <MainLayout><Vehicles /></MainLayout> : <Navigate to="/login" />
          } />

          <Route path="/payments" element={
            !isSystemSetup ? <Navigate to="/setup" /> :
            isAuthenticated ? <MainLayout><Payments /></MainLayout> : <Navigate to="/login" />
          } />

          <Route path="/devices" element={
            !isSystemSetup ? <Navigate to="/setup" /> :
            isAuthenticated ? <MainLayout><Devices /></MainLayout> : <Navigate to="/login" />
          } />

          <Route path="/pricing" element={
            !isSystemSetup ? <Navigate to="/setup" /> :
            isAuthenticated ? <MainLayout><Pricing /></MainLayout> : <Navigate to="/login" />
          } />

          <Route path="/users" element={
            !isSystemSetup ? <Navigate to="/setup" /> :
            isAuthenticated ? <MainLayout><Users /></MainLayout> : <Navigate to="/login" />
          } />

          <Route path="/sites" element={
            !isSystemSetup ? <Navigate to="/setup" /> :
            isAuthenticated ? <MainLayout><Sites /></MainLayout> : <Navigate to="/login" />
          } />

          {/* New Route for Site Details */}
          <Route path="/sites/:id" element={
            !isSystemSetup ? <Navigate to="/setup" /> :
            isAuthenticated ? <MainLayout><SiteDetail /></MainLayout> : <Navigate to="/login" />
          } />

          <Route path="/settings" element={
            !isSystemSetup ? <Navigate to="/setup" /> :
            isAuthenticated ? <MainLayout><System /></MainLayout> : <Navigate to="/login" />
          } />

          {/* Fallback routes */}
          <Route path="/" element={<Navigate to={!isSystemSetup ? "/setup" : "/dashboard"} />} />
          <Route path="*" element={<Navigate to={!isSystemSetup ? "/setup" : "/dashboard"} />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;