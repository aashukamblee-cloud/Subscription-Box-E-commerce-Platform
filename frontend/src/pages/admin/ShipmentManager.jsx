import { useState, useEffect } from 'react';
import { Truck, MapPin } from 'lucide-react';
import api from '../../services/api';

const ShipmentManager = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await api.get('/shipments/admin/all');
        // Assume response.data.shipments if paginated, else response.data
        setShipments(response.data.shipments || response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch shipments', error);
        setLoading(false);
      }
    };
    fetchShipments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/shipments/${id}/status`, { status, location: 'Processing Center', notes: 'Status updated by admin' });
      // Refresh
      const response = await api.get('/shipments/admin/all');
      setShipments(response.data.shipments || response.data);
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading shipment kanban...</div>;

  const columns = ['pending', 'packed', 'shipped', 'in_transit', 'delivered'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Fulfillment Kanban</h2>
        <button className="btn btn-primary">Bulk Generate Labels</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {columns.map(col => (
          <div key={col} style={{ flex: '0 0 300px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', padding: '1rem', border: '1px solid var(--border-color)' }}>
            <h3 style={{ textTransform: 'capitalize', fontSize: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              {col.replace('_', ' ')}
              <span style={{ background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem' }}>
                {shipments.filter(s => s.status === col).length}
              </span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {shipments.filter(s => s.status === col).map(shipment => (
                <div key={shipment._id} className="card glass-panel" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.875rem' }}>{shipment.trackingNumber}</strong>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    User: {shipment.userId?.email || shipment.userId}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    {col !== 'delivered' && (
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: '100%' }}
                        onClick={() => updateStatus(shipment._id, columns[columns.indexOf(col) + 1])}
                      >
                        Move Next
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShipmentManager;
