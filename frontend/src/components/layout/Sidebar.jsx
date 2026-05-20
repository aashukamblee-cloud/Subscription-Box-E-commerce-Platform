import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  PackageSearch, 
  CreditCard, 
  Settings, 
  LogOut,
  Users,
  Zap,
  Truck,
  LineChart,
  Bell,
  CalendarDays,
  X,
  ShoppingBag,
  Box
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const isAdmin = user?.role === 'superadmin' || user?.role === 'operator';

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Subscriptions', path: '/dashboard/subscriptions', icon: <PackageSearch size={20} />, hideAdmin: true },
    { name: 'My Shipments', path: '/dashboard/shipments', icon: <Truck size={20} />, hideAdmin: true },
    { name: 'Billing', path: '/dashboard/billing', icon: <CreditCard size={20} /> },
    { name: 'Notifications', path: '/dashboard/notifications', icon: <Bell size={20} /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={20} /> },
  ];

  const adminItems = [
    { name: 'Analytics', path: '/admin/analytics', icon: <LineChart size={20} /> },
    { name: 'Customer Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Segments', path: '/admin/segments', icon: <Users size={20} /> },
    { name: 'Fulfillment', path: '/admin/shipments', icon: <Truck size={20} /> },
    { name: 'Manage Boxes', path: '/admin/boxes', icon: <Box size={20} /> },
    { name: 'Manage Products', path: '/admin/products', icon: <PackageSearch size={20} /> },
    { name: 'Manage Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Scheduler', path: '/admin/scheduler', icon: <CalendarDays size={20} /> },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`} style={{ width: '250px', height: '100vh', position: 'sticky', top: 0, padding: '2rem 1rem', display: 'flex', flexDirection: 'column', borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none', background: 'var(--bg-secondary)' }}>
      <div style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap className="text-gradient" size={24} />
          <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>NovaFlow</span>
        </div>
        <button className="icon-btn mobile-hidden" onClick={closeSidebar} style={{ display: 'none' /* handled by media query but inline style overrides, so use className */ }}>
          <X size={20} />
        </button>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {menuItems.filter(item => !(isAdmin && item.hideAdmin)).map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', transition: 'background 0.2s', background: location.pathname === item.path ? 'rgba(139, 92, 246, 0.1)' : 'transparent', color: location.pathname === item.path ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
            onClick={closeSidebar}
          >
            {item.icon}
            <span style={{ fontWeight: 500 }}>{item.name}</span>
          </Link>
        ))}

        {isAdmin && (
          <>
            <div style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, paddingLeft: '0.75rem' }}>
              Admin
            </div>
            {adminItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: location.pathname === item.path ? 'var(--accent-primary)' : 'var(--text-secondary)', background: location.pathname === item.path ? 'rgba(139, 92, 246, 0.1)' : 'transparent' }}
                onClick={closeSidebar}
              >
                {item.icon}
                <span style={{ fontWeight: 500 }}>{item.name}</span>
              </Link>
            ))}
          </>
        )}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <button 
          onClick={handleLogout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', borderRadius: 'var(--radius-md)', transition: 'background 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={20} />
          <span style={{ fontWeight: 500, fontSize: '1rem' }}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
