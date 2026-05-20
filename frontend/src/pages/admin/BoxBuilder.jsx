import { useState, useEffect } from 'react';
import { Plus, Package, Box as BoxIcon } from 'lucide-react';
import api from '../../services/api';

const BoxBuilder = () => {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const response = await api.get('/boxes');
        setBoxes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch boxes', error);
        setLoading(false);
      }
    };
    fetchBoxes();
  }, []);

  if (loading) return <div>Loading box configurations...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Box Builder & Configuration</h2>
        <button className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem' }}>
          <Plus size={18} /> Create New Box
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {boxes.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }} className="card glass-panel">
            <BoxIcon size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No boxes configured yet. Build your first subscription box!</p>
          </div>
        ) : (
          boxes.map(box => (
            <div key={box._id} className="card glass-panel">
              <div className="card-header" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>{box.name}</h3>
                <span style={{ 
                  background: box.status === 'published' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: box.status === 'published' ? 'var(--success)' : 'var(--warning)',
                  padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600
                }}>
                  {box.status}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <div>
                  <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Month/Year</strong>
                  {box.month}/{box.year}
                </div>
                <div>
                  <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Total Value</strong>
                  ${box.totalValue?.toFixed(2) || '0.00'}
                </div>
                <div>
                  <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Items</strong>
                  {box.products?.length || 0} / {box.maxItems}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Included Products:</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {box.products?.length > 0 ? box.products.map((p, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <Package size={14} color="var(--accent-primary)" /> Product ID: {p.productId} (x{p.quantity})
                    </li>
                  )) : (
                    <li style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No products assigned</li>
                  )}
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                <button className="btn btn-primary" style={{ flex: 1 }}>Edit Box</button>
                {box.status === 'draft' && (
                  <button className="btn btn-outline" style={{ flex: 1 }}>Publish</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BoxBuilder;
