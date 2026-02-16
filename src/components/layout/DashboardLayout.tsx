import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={sidebarCollapsed} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
