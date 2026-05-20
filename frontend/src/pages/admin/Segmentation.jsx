import { useState, useEffect } from 'react';
import { Users, UserMinus, UserCheck, Download } from 'lucide-react';
import api from '../../services/api';

const Segmentation = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [segment, setSegment] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      setLoading(true);
      try {
        const endpoint = segment === 'all' 
          ? '/admin/subscribers' 
          : `/admin/subscribers/segments?segment=${segment}`;
        const response = await api.get(endpoint);
        setSubscribers(response.data.subscribers || response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch subscribers', error);
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, [segment]);

  const handleExport = async () => {
    try {
      const response = await api.post('/admin/subscribers/export', { segment });
      
      // Create a blob and trigger download
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response.data));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `subscribers_${segment}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      alert('Failed to export data');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Subscriber Segmentation</h2>
        <button className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem' }} onClick={handleExport}>
          <Download size={18} /> Export JSON
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className={`btn ${segment === 'all' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setSegment('all')}>All</button>
        <button className={`btn ${segment === 'high_value' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setSegment('high_value')}>High Value</button>
        <button className={`btn ${segment === 'at_risk' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setSegment('at_risk')}>At Risk</button>
        <button className={`btn ${segment === 'churned' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setSegment('churned')}>Churned</button>
      </div>

      <div className="card glass-panel">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading segments...</div>
        ) : subscribers.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No subscribers found in this segment.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Customer</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Plan</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Total Spent</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem 0' }}>
                    <strong style={{ display: 'block' }}>{sub.name}</strong>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{sub.email}</span>
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    {sub.subscriptionStatus === 'cancelled' ? (
                      <span style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><UserMinus size={14} /> Churned</span>
                    ) : (
                      <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem', textTransform: 'capitalize' }}><UserCheck size={14} /> {sub.subscriptionStatus || 'Active'}</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem 0' }}>{sub.planName || 'N/A'}</td>
                  <td style={{ padding: '1rem 0' }}>${sub.totalSpent?.toFixed(2) || '0.00'}</td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                    <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>View Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Segmentation;
