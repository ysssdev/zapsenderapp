import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Send, 
  Users, 
  Smartphone, 
  CreditCard, 
  Settings, 
  LogOut,
  Zap,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app' },
    { icon: Send, label: 'Campanhas', path: '/app/campaigns' },
    { icon: Users, label: 'Contatos', path: '/app/contacts' },
    { icon: Download, label: 'Extrair Grupos', path: '/app/extractor' },
    { icon: Smartphone, label: 'Instâncias', path: '/app/instances' },
    { icon: CreditCard, label: 'Planos & Créditos', path: '/app/billing' },
  ];

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.email === 'ygorsantos131421@gmail.com';

  if (isAdmin) {
    navItems.push({ icon: Settings, label: 'Administração', path: '/app/admin' });
  }

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen fixed left-0 top-0 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-50 transition-all duration-300`}>
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} relative`}>
        <div className="w-8 h-8 rounded-lg bg-neon-green/20 flex items-center justify-center border border-neon-green/50 neon-glow flex-shrink-0">
          <Zap className="text-neon-green w-5 h-5" fill="currentColor" />
        </div>
        {!isCollapsed && (
          <h1 className="text-xl font-display font-bold tracking-tight text-white whitespace-nowrap">
            Zap<span className="font-light text-neon-green">Sender</span>
          </h1>
        )}
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-7 bg-[#050505] border border-white/10 rounded-full p-1 text-gray-500 hover:text-neon-green hover:border-neon-green/50 transition-colors shadow-sm"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/app'}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? 'bg-neon-green/10 text-neon-green border-l-2 border-neon-green neon-border'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                   <div className="absolute inset-0 bg-neon-green/5 opacity-50 blur-lg" />
                )}
                <item.icon
                  size={20}
                  className={`transition-colors relative z-10 flex-shrink-0 ${
                    isActive ? 'text-neon-green drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]' : 'text-gray-500 group-hover:text-gray-300'
                  }`}
                />
                {!isCollapsed && (
                  <span className="relative z-10 font-medium tracking-wide text-sm whitespace-nowrap">{item.label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          title={isCollapsed ? "Sair do Sistema" : undefined}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors`}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium whitespace-nowrap">Sair do Sistema</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;