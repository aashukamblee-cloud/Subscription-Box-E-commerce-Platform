import { useState, useEffect } from 'react';
import { Truck, MapPin, PackageCheck, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await api.get('/shipments');
        setShipments(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch shipments', error);
        setLoading(false);
      }
    };
    fetchShipments();
  }, []);

  if (loading) return <div>Loading shipments...</div>;

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'var(--success)';
      case 'in_transit': 
      case 'shipped': return 'var(--accent-primary)';
      case 'delayed': return 'var(--error)';
      default: return 'var(--warning)';
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>My Shipments</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {shipments.length === 0 ? (
          <div className="card glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <Truck size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>You don't have any recent shipments.</p>
          </div>
        ) : (
          shipments.map(shipment => (
            <div key={shipment._id} className="card glass-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PackageCheck size={20} /> {shipment.boxId?.name || 'Subscription Box'}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Tracking: {shipment.trackingNumber}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    background: `rgba(255,255,255,0.05)`,
                    color: getStatusColor(shipment.status),
                    textTransform: 'capitalize',
                    fontWeight: 600,
                    border: `1px solid ${getStatusColor(shipment.status)}`
                  }}>
                    {shipment.status.replace('_', ' ')}
                  </span>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Est. Delivery: {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                {/* Vertical timeline line */}
                <div style={{ position: 'absolute', left: '7px', top: '5px', bottom: '5px', width: '2px', background: 'var(--border-color)' }}></div>
                
                {shipment.statusHistory?.map((history, idx) => (
                  <div key={idx} style={{ position: 'relative', marginBottom: idx !== shipment.statusHistory.length - 1 ? '1.5rem' : 0 }}>
                    <div style={{ 
                      position: 'absolute', 
                      left: '-2rem', 
                      top: '2px', 
                      width: '16px', 
                      height: '16px', 
                      borderRadius: '50%', 
                      background: idx === shipment.statusHistory.length - 1 ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                      border: `2px solid ${idx === shipment.statusHistory.length - 1 ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                      zIndex: 1
                    }}></div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ textTransform: 'capitalize', color: idx === shipment.statusHistory.length - 1 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {history.status.replace('_', ' ')}
                      </strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        {new Date(history.date).toLocaleString()}
                      </span>
                    </div>
                    {history.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        <MapPin size={14} /> {history.location}
                      </div>
                    )}
                    {history.notes && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--warning)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        <AlertCircle size={14} /> {history.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Shipments;
