import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} 
        onClick={closeSidebar}
      ></div>

      <main className="dashboard-main-content" style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto', maxWidth: '1400px', width: '100%' }}>
        <div className="mobile-header">
          <span style={{ fontSize: '1.25rem', fontWeight: 700, background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            NovaFlow
          </span>
          <button className="icon-btn" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
        </div>
        
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
