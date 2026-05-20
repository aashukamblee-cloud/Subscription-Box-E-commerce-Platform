import { Package, Truck, CreditCard, Settings } from 'lucide-react';
import { useSelector } from 'react-redux';
import Analytics from './admin/Analytics';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  
  const isAdmin = user?.role === 'superadmin' || user?.role === 'operator';

  if (isAdmin) {
    return <Analytics />;
  }

  return (
    <div className="dashboard">
      <h2 style={{ marginBottom: '2rem' }}>Welcome back, {user?.name || 'Customer'}!</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: 'var(--radius-md)' }}>
              <Package color="var(--accent-primary)" />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Active Plan</p>
              <h3>Premium Box</h3>
            </div>
          </div>
        </div>

        <div className="card glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: 'var(--radius-md)' }}>
              <Truck color="var(--accent-secondary)" />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Next Shipment</p>
              <h3>Oct 15, 2024</h3>
            </div>
          </div>
        </div>

        <div className="card glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)' }}>
              <CreditCard color="var(--success)" />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Next Billing</p>
              <h3>$49.99</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card glass-panel">
        <div className="card-header" style={{ marginBottom: '1.5rem' }}>
          <h3>Recent Shipments</h3>
          <button className="btn btn-outline">View All</button>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Box</th>
              <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Date</th>
              <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Tracking</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '1rem 0' }}>September Box</td>
              <td style={{ padding: '1rem 0' }}>Sep 15, 2024</td>
              <td style={{ padding: '1rem 0' }}><span style={{ color: 'var(--success)' }}>Delivered</span></td>
              <td style={{ padding: '1rem 0' }}><a href="#">TRK-9X8Y7Z</a></td>
            </tr>
            <tr>
              <td style={{ padding: '1rem 0' }}>August Box</td>
              <td style={{ padding: '1rem 0' }}>Aug 15, 2024</td>
              <td style={{ padding: '1rem 0' }}><span style={{ color: 'var(--success)' }}>Delivered</span></td>
              <td style={{ padding: '1rem 0' }}><a href="#">TRK-4A5B6C</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
