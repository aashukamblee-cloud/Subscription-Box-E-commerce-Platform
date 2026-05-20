import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Search, Filter, ShoppingBag, MapPin, Phone, Mail, FileText, Check, Trash2, Eye, ShieldAlert, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Currency slice integration
  const { symbol, rate, code } = useSelector((state) => state.currency);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setErrorMsg('');
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      // update state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      setErrorMsg('Failed to update order status. Please verify connection and try again.');
    }
  };

  const formatPrice = (priceInUSD) => {
    if (priceInUSD === undefined || priceInUSD === null) return '';
    const converted = priceInUSD * rate;
    return `${symbol}${converted.toLocaleString(code === 'INR' ? 'en-IN' : 'en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const query = search.toLowerCase();
    const customer = order.customerDetails;
    const matchesSearch = 
      order._id.toLowerCase().includes(query) ||
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.includes(query);
      
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate dashboard stats
  const totalRevenueUSD = orders
    .filter(order => order.status !== 'cancelled')
    .reduce((acc, order) => acc + (order.total || 0), 0);

  const pendingCount = orders.filter(order => order.status === 'pending').length;
  const processingCount = orders.filter(order => order.status === 'processing').length;
  const deliveredCount = orders.filter(order => order.status === 'delivered').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', text: '#d97706', label: 'Pending' };
      case 'processing': return { bg: '#dbeafe', text: '#2563eb', label: 'Processing' };
      case 'shipped': return { bg: '#ede9fe', text: '#7c3aed', label: 'Shipped' };
      case 'delivered': return { bg: '#d1fae5', text: '#059669', label: 'Delivered' };
      case 'cancelled': return { bg: '#fee2e2', text: '#dc2626', label: 'Cancelled' };
      default: return { bg: '#f3f4f6', text: '#4b5563', label: 'Unknown' };
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loader" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--accent-primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', marginInline: 'auto', marginBottom: '1rem' }}></div>
          <p>Retrieving customer orders & transaction logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Customer Transactions</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>Review checkout summaries, buyer credentials, and dispatch products</p>
        </div>
        <button onClick={fetchOrders} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Refresh Registry
        </button>
      </div>

      {errorMsg && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
          <span style={{ fontWeight: 600 }}>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} style={{ background: 'none', border: 'none', color: '#dc2626', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}>Dismiss</button>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Total Orders Card */}
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-primary)' }}>
            <ShoppingBag size={28} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Orders</h4>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {orders.length}
            </div>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(5, 150, 105, 0.1)', color: '#059669' }}>
            <DollarSign size={28} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gross Sales</h4>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '0.25rem' }}>
              {formatPrice(totalRevenueUSD)}
            </div>
          </div>
        </div>

        {/* Pending & Processing */}
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(217, 119, 6, 0.1)', color: '#d97706' }}>
            <Clock size={28} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Pipelines</h4>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706', marginTop: '0.25rem' }}>
              {pendingCount + processingCount}
            </div>
          </div>
        </div>

        {/* Delivered Card */}
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
            <CheckCircle size={28} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fulfillments</h4>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563eb', marginTop: '0.25rem' }}>
              {deliveredCount}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '0.5rem 1rem', border: '1px solid var(--border-color)', width: '350px' }}>
          <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
          <input 
            type="text" 
            placeholder="Search by ID, name, email, phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '0.9rem' }}
          />
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                textTransform: 'capitalize',
                cursor: 'pointer',
                background: statusFilter === status ? 'var(--accent-primary)' : 'rgba(255,255,255,0.02)',
                color: statusFilter === status ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredOrders.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <ShieldAlert size={48} style={{ marginInline: 'auto', marginBottom: '1rem', color: 'var(--text-muted)' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>No Orders Found</h3>
            <p style={{ margin: 0 }}>Try clearing your search filters or check again later.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>ORDER ID</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>DATE</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>CUSTOMER</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>ITEMS</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL VALUE</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>STATUS</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => {
                  const statusInfo = getStatusColor(order.status);
                  const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} className="table-row-hover">
                      <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent-secondary)' }}>
                        #{order._id.substring(18)}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
                        {dateStr}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ fontWeight: 600 }}>{order.customerDetails.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.customerDetails.email}</div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatPrice(order.total)}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          style={{
                            background: statusInfo.bg,
                            color: statusInfo.text,
                            border: 'none',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '50px',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            outline: 'none',
                            cursor: 'pointer',
                            textTransform: 'uppercase'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <button 
                          className="icon-btn" 
                          onClick={() => setSelectedOrder(order)} 
                          style={{ color: 'var(--accent-primary)', padding: '0.5rem', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '8px' }}
                          title="View Billing Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== Order Details Modal ===== */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(6px)',
          zIndex: 1060,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }} onClick={() => setSelectedOrder(null)}>
          <div style={{
            width: '100%',
            maxWidth: '750px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            maxHeight: '90vh',
            animation: 'zoomIn 0.2s ease-out',
            color: 'var(--text-primary)'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem 2rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.01)'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>Order Registry Detail</span>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Order ID: #{selectedOrder._id}</h3>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Order Status & Pipeline Control */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>PIPELINE STATUS</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: getStatusColor(selectedOrder.status).text
                    }}></span>
                    <strong style={{ textTransform: 'uppercase', color: getStatusColor(selectedOrder.status).text }}>{selectedOrder.status}</strong>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>CHANGE STATUS</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                    style={{
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontWeight: 600,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Two Column details: Customer Info & Shipping Address */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="modal-grid-2">
                
                {/* Contact Data */}
                <div>
                  <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700, fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={16} color="var(--accent-primary)" /> Customer Information
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Full Name:</span>
                      <div style={{ fontWeight: 600, marginTop: '0.15rem' }}>{selectedOrder.customerDetails.name}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Email:</span>
                      <div style={{ fontWeight: 600, marginTop: '0.15rem', color: 'var(--accent-secondary)' }}>{selectedOrder.customerDetails.email}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Phone:</span>
                      <div style={{ fontWeight: 600, marginTop: '0.15rem' }}>{selectedOrder.customerDetails.phone}</div>
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                <div>
                  <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700, fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} color="var(--accent-primary)" /> Shipping Address
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Street:</span>
                      <div style={{ fontWeight: 600, marginTop: '0.15rem' }}>{selectedOrder.customerDetails.address.street}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-secondary)' }}>City:</span>
                        <div style={{ fontWeight: 600, marginTop: '0.15rem' }}>{selectedOrder.customerDetails.address.city}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-secondary)' }}>State:</span>
                        <div style={{ fontWeight: 600, marginTop: '0.15rem' }}>{selectedOrder.customerDetails.address.state}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-secondary)' }}>Zip Code:</span>
                        <div style={{ fontWeight: 600, marginTop: '0.15rem' }}>{selectedOrder.customerDetails.address.zipCode}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-secondary)' }}>Country:</span>
                        <div style={{ fontWeight: 600, marginTop: '0.15rem' }}>{selectedOrder.customerDetails.address.country}</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Order Items list */}
              <div>
                <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700, fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={16} color="var(--accent-primary)" /> Purchased Items
                </h4>
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>PRODUCT NAME</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', textAlign: 'center' }}>QTY</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', textAlign: 'right' }}>UNIT PRICE</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', textAlign: 'right' }}>TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map(item => (
                        <tr key={item._id || item.productId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{item.name}</td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{item.quantity}</td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>{formatPrice(item.price)}</td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--accent-secondary)' }}>{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Checkout Calculation breakdown */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Subtotal:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{formatPrice(selectedOrder.subtotal)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Shipping:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{selectedOrder.shipping === 0 ? 'Free' : formatPrice(selectedOrder.shipping)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Estimated Tax (8%):</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{formatPrice(selectedOrder.tax)}</strong>
                  </div>
                  <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.25rem 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800 }}>
                    <span>Total Paid:</span>
                    <strong style={{ color: '#059669' }}>{formatPrice(selectedOrder.total)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Payment Method:</span>
                    <span>{selectedOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 2rem',
              borderTop: '1px solid var(--border-color)',
              background: 'rgba(255,255,255,0.01)',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="btn btn-primary"
                style={{ padding: '0.6rem 2rem', borderRadius: '50px' }}
              >
                Close Registry Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default OrderManager;
