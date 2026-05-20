import { useState, useEffect } from 'react';
import { Pause, Play, XCircle } from 'lucide-react';
import api from '../../services/api';

const SubscriptionManager = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const response = await api.get('/subscriptions');
        setSubscriptions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch subscriptions', error);
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await api.put(`/subscriptions/${id}/${action}`);
      // Refresh
      const response = await api.get('/subscriptions');
      setSubscriptions(response.data);
    } catch (error) {
      alert(`Failed to ${action} subscription`);
    }
  };

  if (loading) return <div>Loading subscriptions...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>My Subscriptions</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {subscriptions.length > 0 ? subscriptions.map((sub) => (
          <div key={sub._id} className="card glass-panel">
            <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div>
                <h3>{sub.planId?.name || 'Unknown Plan'}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Status: <strong style={{ textTransform: 'capitalize', color: sub.status === 'active' ? 'var(--success)' : (sub.status === 'paused' ? 'var(--warning)' : 'var(--error)') }}>{sub.status}</strong></p>
              </div>
              <div>
                <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>${sub.planId?.price || 0}</span>
                <span style={{ color: 'var(--text-secondary)' }}>/{sub.planId?.billingCycle || 'mo'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Next Renewal</span>
                <strong>{new Date(sub.renewalDate).toLocaleDateString()}</strong>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Member Since</span>
                <strong>{new Date(sub.createdAt).toLocaleDateString()}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              {sub.status === 'active' && (
                <button className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem' }} onClick={() => handleAction(sub._id, 'pause')}>
                  <Pause size={18} /> Pause Subscription
                </button>
              )}
              {sub.status === 'paused' && (
                <button className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem' }} onClick={() => handleAction(sub._id, 'resume')}>
                  <Play size={18} /> Resume Subscription
                </button>
              )}
              {(sub.status === 'active' || sub.status === 'paused') && (
                <button className="btn" style={{ display: 'flex', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }} onClick={() => { if(window.confirm('Are you sure you want to cancel?')) handleAction(sub._id, 'cancel'); }}>
                  <XCircle size={18} /> Cancel
                </button>
              )}
            </div>
          </div>
        )) : (
          <div className="card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You don't have any active subscriptions.</p>
            <a href="/plans" className="btn btn-primary">Browse Plans</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionManager;
