import React from 'react';
import { Bell, Search, Zap, Wifi, Moon, Sun, Menu, ChevronLeft } from 'lucide-react';
import { User } from '../types';
import { useTheme } from '../context/ThemeContext';

interface TopBarProps {
  user: User;
  onToggleSidebar?: () => void;
  showToggle?: boolean;
  isSidebarCollapsed?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ user, onToggleSidebar, showToggle, isSidebarCollapsed }) => {
  const creditPercentage = (user.credits / 10000) * 100;
  const isLowCredits = user.credits < 1000;
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className={`h-20 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40 w-full transition-all duration-300 ${isSidebarCollapsed ? 'pl-28' : 'pl-72'}`}>
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar campanhas, contatos..." 
            className="w-full bg-[#050505] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 transition-all placeholder-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* System Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/20 neon-border">
          <Wifi size={14} className="text-neon-green" />
          <span className="text-xs font-semibold text-neon-green uppercase tracking-wide">Sistema Online</span>
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse ml-1" />
        </div>

        {/* Credits Display */}
        <div className="hidden md:flex flex-col items-end mr-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Créditos Restantes</span>
            <span className={`font-mono font-bold ${isLowCredits ? 'text-red-500' : 'text-neon-cyan'}`}>
              {user.credits.toLocaleString()}
            </span>
          </div>
          <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${isLowCredits ? 'bg-red-500' : 'bg-gradient-to-r from-neon-cyan to-neon-green'}`}
              style={{ width: `${creditPercentage}%` }}
            />
          </div>
        </div>

        {/* Theme Toggle (Hidden since we are forcing dark mode) */}
        {/* <button 
          onClick={toggleTheme}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button> */}

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-neon-purple rounded-full shadow-[0_0_8px_#B026FF]" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <div className="flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
              <p className="text-xs text-gray-400">{user.plan}</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 overflow-hidden cursor-pointer hover:ring-2 hover:ring-neon-green/50 transition-all">
            <img src="https://picsum.photos/200" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;