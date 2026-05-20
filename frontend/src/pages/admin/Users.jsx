import { useState, useEffect } from 'react';
import { Users as UsersIcon, Edit, Trash2, Mail, Shield } from 'lucide-react';
import api from '../../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Simulated users data if backend isn't ready
  const mockUsers = [
    { _id: '1', name: 'Sarah Customer', email: 'sarah@test.com', role: 'customer', isActive: true, createdAt: '2024-09-01T10:00:00Z' },
    { _id: '2', name: 'John Admin', email: 'admin@boxflow.com', role: 'superadmin', isActive: true, createdAt: '2024-09-10T12:00:00Z' },
    { _id: '3', name: 'Mike Inactive', email: 'mike@test.com', role: 'customer', isActive: false, createdAt: '2024-09-15T09:00:00Z' }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Replace with actual API call if users endpoint exists:
        // const response = await api.get('/admin/users');
        // setUsers(response.data.users);
        
        // Using mock users for now since admin users endpoint might not be fully built
        setTimeout(() => {
          setUsers(mockUsers);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch users', error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="admin-users">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>User Management</h2>
        <button className="btn btn-primary">Add New User</button>
      </div>

      <div className="card glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>User</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Role</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Joined Date</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{user.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.3rem', 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '50px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    background: user.role === 'superadmin' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.05)',
                    color: user.role === 'superadmin' ? 'var(--accent-primary)' : 'var(--text-secondary)'
                  }}>
                    {user.role === 'superadmin' ? <Shield size={12} /> : <UsersIcon size={12} />}
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ color: user.isActive ? 'var(--success)' : 'var(--error)', fontSize: '0.85rem', fontWeight: 500 }}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button className="icon-btn" title="Email User"><Mail size={18} /></button>
                    <button className="icon-btn" title="Edit Role"><Edit size={18} /></button>
                    <button className="icon-btn" title="Delete User" style={{ color: 'var(--error)' }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
