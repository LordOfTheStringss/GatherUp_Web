import React, { useState, useEffect } from 'react';
import MainDashboard from './pages/MainDashboard';
import ModerationDashboard from './pages/ModerationDashboard';
import GovernanceDashboard from './pages/GovernanceDashboard';
import SystemHealthDashboard from './pages/SystemHealthDashboard';
import { 
  ShieldAlert, Menu, X, LogOut, LayoutDashboard, Sun, Moon, 
  ShieldCheck, Activity, Search, UserCircle, CalendarDays
} from 'lucide-react';

type TabType = 'main' | 'moderation' | 'governance' | 'health';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('main');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Default Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if theme was previously saved, otherwise default to true
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return true; // Default Dark Mode
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const tabs = [
    { id: 'main', label: 'Overview', icon: LayoutDashboard },
    { id: 'moderation', label: 'Moderation', icon: ShieldAlert },
    { id: 'governance', label: 'Governance', icon: ShieldCheck },
    { id: 'health', label: 'System Health', icon: Activity },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'main': return <MainDashboard />;
      case 'moderation': return <ModerationDashboard />;
      case 'governance': return <GovernanceDashboard />;
      case 'health': return <SystemHealthDashboard />;
      default: return <MainDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#1A1A24] text-gray-900 dark:text-gray-100 overflow-hidden font-sans transition-colors duration-300">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`flex flex-col fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-[#12121A] border-r border-gray-200 dark:border-gray-800/60 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Top: Logo */}
        <div className="flex items-center h-20 px-6 border-b border-gray-100 dark:border-gray-800/60">
          <CalendarDays className="w-8 h-8 text-purple-600 dark:text-purple-500 mr-3" />
          <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">GatherUp</span>
          <button className="md:hidden ml-auto text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom: Admin User Profile */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800/60">
          <div className="flex items-center justify-between px-2 py-2 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center border border-purple-200 dark:border-purple-600/30">
                <UserCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex flex-col truncate text-left">
                <span className="text-sm font-bold text-gray-900 dark:text-white truncate">Admin User</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide text-purple-600 dark:text-purple-400">Admin Role</span>
              </div>
            </div>
            <button className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 dark:bg-[#1A1A24]">
        
        {/* Global Header */}
        <header className="flex items-center justify-between h-20 px-6 lg:px-10 bg-white/80 dark:bg-[#1A1A24]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800/60 z-10 sticky top-0">
           <div className="flex items-center flex-1 gap-4">
             <button
               className="text-gray-500 hover:text-gray-900 dark:hover:text-white focus:outline-none md:hidden"
               onClick={() => setIsMobileMenuOpen(true)}
             >
               <Menu className="w-6 h-6" />
             </button>
             
             {/* Search Bar - hidden on very small screens */}
             <div className="max-w-md w-full hidden sm:flex items-center relative">
               <Search className="w-5 h-5 text-gray-400 absolute left-3" />
               <input 
                 type="text" 
                 placeholder="Search anything..." 
                 className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800/50 border-transparent text-gray-900 dark:text-white rounded-full text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500 dark:placeholder-gray-500"
               />
             </div>
           </div>
           
           <div className="flex items-center gap-4 ml-4">
             {/* Dark Mode Toggle */}
             <button
               onClick={toggleDarkMode}
               className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
               aria-label="Toggle Dark Mode"
             >
               {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>
           </div>
        </header>

        {/* Dashboard Content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </main>
      </div>

    </div>
  );
}

export default App;
