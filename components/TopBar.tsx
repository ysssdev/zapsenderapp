import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Zap, Wifi, Moon, Sun, Menu, ChevronLeft, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ProfileModal } from './ProfileModal';
import { motion, AnimatePresence } from 'motion/react';

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
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            {user.email?.toLowerCase() === 'rgdias001@gmail.com' && (
              <span id="special-cloud-badge" className="text-xs font-bold text-neon-green ml-1.5 px-2 py-0.5 rounded-full bg-neon-green/10 border border-neon-green/20">
                Cloud (010336)
              </span>
            )}
          </div>
          <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${isLowCredits ? 'bg-red-500' : 'bg-gradient-to-r from-neon-cyan to-neon-green'}`}
              style={{ width: `${creditPercentage}%` }}
            />
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-neon-purple rounded-full shadow-[0_0_8px_#B026FF]" />
        </button>

        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <div 
            id="topbar-user-profile-trigger"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 pl-6 border-l border-white/10 cursor-pointer group select-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white group-hover:text-neon-green transition-colors">{user.name}</p>
              <div className="flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{user.plan}</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 overflow-hidden group-hover:ring-2 group-hover:ring-neon-green/50 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] relative">
              <img 
                src={user.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces"} 
                alt="Avatar" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                id="topbar-profile-dropdown"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-64 bg-[#0d0d0d] border border-white/10 rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 p-2"
              >
                <div className="px-4 py-3 border-b border-white/5 mb-1.5 text-left">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                </div>

                <button
                  id="topbar-edit-profile-action"
                  onClick={() => {
                    setDropdownOpen(false);
                    setModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left"
                >
                  <Settings size={16} className="text-gray-500" />
                  <span>Configurar Perfil</span>
                </button>

                <button
                  id="topbar-logout-action"
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                >
                  <LogOut size={16} />
                  <span>Sair do Sistema</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ProfileModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </header>
  );
};

export default TopBar;