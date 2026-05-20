import { useState, useEffect } from 'react';
import { Download, CreditCard, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await api.get('/payments/invoices');
        setInvoices(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch invoices', error);
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  if (loading) return <div>Loading billing history...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Billing & Invoices</h2>

      <div className="card glass-panel" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>Payment Method</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your preferred payment methods</p>
          </div>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <CreditCard size={18} /> Update Card
          </button>
        </div>
      </div>

      <div className="card glass-panel">
        <h3 style={{ marginBottom: '1.5rem' }}>Billing History</h3>
        
        {invoices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <AlertCircle size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No billing history found.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Date</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Amount</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Invoice ID</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)', textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem 0' }}>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 0' }}>${(invoice.amount / 100).toFixed(2)}</td>
                  <td style={{ padding: '1rem 0' }}>
                    <span style={{ 
                      color: invoice.status === 'succeeded' ? 'var(--success)' : 'var(--error)',
                      background: invoice.status === 'succeeded' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.875rem'
                    }}>
                      {invoice.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{invoice.stripeInvoiceId || 'N/A'}</td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                    <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }}>
                      <Download size={16} />
                    </button>
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

export default Billing;
