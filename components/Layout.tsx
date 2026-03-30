import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { User } from '../types';

interface LayoutProps {
  user: User;
}

const Layout = ({ user }: LayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-neon-green/30 selection:text-neon-green transition-colors">
      <div className={`transition-all duration-300`}>
        <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      </div>
      
      <TopBar 
        user={user} 
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        showToggle={true}
        isSidebarCollapsed={sidebarCollapsed}
      />
      
      <main className={`transition-all duration-300 pt-8 ${sidebarCollapsed ? 'pl-20' : 'pl-64'}`}>
        <div className="max-w-[1600px] mx-auto px-8 pb-12">
          <Outlet />
        </div>
      </main>
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neon-green/5 blur-[120px]" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-neon-purple/5 blur-[120px]" />
      </div>
    </div>
  );
};

export default Layout;