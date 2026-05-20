import { useState, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import api from '../../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data.notifications || response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark read', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all read', error);
    }
  };

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Notifications</h2>
        <button className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem' }} onClick={handleMarkAllRead}>
          <Check size={16} /> Mark all as read
        </button>
      </div>

      <div className="card glass-panel" style={{ maxWidth: '800px' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <Bell size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>You're all caught up! No new notifications.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {notifications.map((notif, index) => (
              <div 
                key={notif._id} 
                style={{ 
                  padding: '1.5rem', 
                  borderBottom: index !== notifications.length - 1 ? '1px solid var(--border-color)' : 'none',
                  background: notif.isRead ? 'transparent' : 'rgba(139, 92, 246, 0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {!notif.isRead && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>}
                    <strong style={{ color: notif.isRead ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{notif.title}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(notif.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ margin: 0, color: notif.isRead ? 'var(--text-muted)' : 'var(--text-secondary)' }}>{notif.message}</p>
                </div>
                
                {!notif.isRead && (
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleMarkRead(notif._id)}>
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
