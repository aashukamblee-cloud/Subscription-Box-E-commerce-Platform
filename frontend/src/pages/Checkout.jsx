import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, ArrowLeft, CreditCard, ShoppingCart, CheckCircle, ShieldCheck, Mail, Phone, MapPin, Loader } from 'lucide-react';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import api from '../services/api';

const Checkout = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // Currency integration
  const { symbol, rate, code } = useSelector((state) => state.currency);
  const formatPrice = (priceInUSD) => {
    if (priceInUSD === undefined || priceInUSD === null) return '';
    const converted = priceInUSD * rate;
    return `${symbol}${converted.toLocaleString(code === 'INR' ? 'en-IN' : 'en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Checkout form state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: code === 'INR' ? 'India' : 'United States',
    cardNumber: '4111 2222 3333 4444',
    cardExpiry: '12/28',
    cardCvv: '123'
  });

  const handleQtyChange = (id, newQty) => {
    if (newQty < 1) return;
    dispatch(updateQuantity({ id, quantity: newQty }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenCheckout = () => {
    setErrorMsg('');
    setShowCheckoutModal(true);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.name || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.state || !formData.zipCode || !formData.country) {
      setErrorMsg('Please fill out all address and contact fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customerDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country
          }
        },
        items: cartItems.map(item => ({
          productId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal,
        shipping,
        tax,
        total,
        currency: code,
        paymentMethod: 'Credit Card'
      };

      const response = await api.post('/orders', payload);
      setSuccessOrder(response.data);
      dispatch(clearCart());
    } catch (error) {
      console.error('Error placing order:', error);
      setErrorMsg('Failed to place order. Please verify connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 5%', minHeight: '80vh', background: '#ffffff', color: '#111827' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontWeight: 600 }}>
          <ArrowLeft size={20} /> Back to Shopping
        </Link>
      </div>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Shopping Cart</h1>

      {cartItems.length === 0 && !successOrder ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-xl)' }}>
          <ShoppingCart size={64} color="var(--text-muted)" style={{ marginBottom: '1.5rem', marginInline: 'auto' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Explore our catalog and add items to your cart to checkout.</p>
          <Link to="/" className="btn btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: '50px', textDecoration: 'none', display: 'inline-block', fontWeight: 600 }}>
            Start Shopping
          </Link>
        </div>
      ) : successOrder ? (
        /* Order Success Page */
        <div style={{
          textAlign: 'center',
          maxWidth: '600px',
          margin: '2rem auto',
          padding: '3rem 2rem',
          border: '1px solid #e5e7eb',
          borderRadius: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          background: '#ffffff',
        }}>
          <CheckCircle size={64} color="#10b981" style={{ marginInline: 'auto', marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Order Placed Successfully!</h2>
          <p style={{ color: '#4b5563', fontSize: '0.95rem', marginBottom: '2rem' }}>Thank you for your purchase. An administrator has been notified with your shipping details.</p>
          
          <div style={{
            background: '#f9fafb',
            borderRadius: '16px',
            padding: '1.5rem',
            textAlign: 'left',
            marginBottom: '2rem',
            border: '1px solid #f3f4f6'
          }}>
            <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700, borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Receipt Details</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div><strong>Order ID:</strong> #{successOrder._id}</div>
              <div><strong>Recipient:</strong> {formData.name}</div>
              <div><strong>Email:</strong> {formData.email}</div>
              <div><strong>Ship To:</strong> {formData.street}, {formData.city}, {formData.state} - {formData.zipCode}</div>
              <div style={{ borderTop: '1px dashed #e5e7eb', marginTop: '0.5rem', paddingTop: '0.5rem' }}><strong>Total Paid:</strong> {formatPrice(total)}</div>
            </div>
          </div>

          <Link to="/" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', borderRadius: '50px', textDecoration: 'none', display: 'inline-block', fontWeight: 700 }}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem' }} className="cart-grid">
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cartItems.map(item => {
              const itemId = item._id || item.id || item.name;
              const imgUrl = item.images && item.images[0] ? item.images[0] : item.image || '/hero-product.png';
              
              return (
                <div key={itemId} style={{ display: 'flex', gap: '2rem', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }} className="cart-item-card">
                  <div style={{ width: '120px', height: '120px', background: '#f3f4f6', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img 
                      src={imgUrl} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200';
                      }}
                      alt={item.name} 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{item.name}</h3>
                      <button 
                        onClick={() => handleRemove(itemId)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--border-color)', borderRadius: '50px', padding: '0.2rem 1rem' }}>
                        <button 
                          onClick={() => handleQtyChange(itemId, item.quantity - 1)}
                          style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 600 }}>{item.quantity}</span>
                        <button 
                          onClick={() => handleQtyChange(itemId, item.quantity + 1)}
                          style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
                        >
                          +
                        </button>
                      </div>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3b82f6' }}>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: 'var(--radius-lg)', height: 'fit-content' }} className="cart-summary-card">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Order Summary</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span style={{ color: '#111827', fontWeight: 600 }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span style={{ color: '#111827', fontWeight: 600 }}>
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Tax (8%)</span>
                <span style={{ color: '#111827', fontWeight: 600 }}>{formatPrice(tax)}</span>
              </div>
              <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800 }}>
                <span>Total</span>
                <span style={{ color: '#3b82f6' }}>{formatPrice(total)}</span>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              onClick={handleOpenCheckout}
              style={{ width: '100%', padding: '1rem', borderRadius: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              <CreditCard size={20} /> Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {/* ===== Checkout Form Modal ===== */}
      {showCheckoutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 1050,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }} onClick={() => setShowCheckoutModal(false)}>
          <div style={{
            width: '100%',
            maxWidth: '650px',
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            maxHeight: '90vh',
            animation: 'zoomIn 0.2s ease-out',
            color: '#1f2937'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem 2rem',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f9fafb',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', fontWeight: 800 }}>
                <ShieldCheck size={22} />
                <span>Secure Checkout Form</span>
              </div>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9ca3af' }}
              >
                &times;
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmitOrder} style={{ overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Personal Info */}
              <div>
                <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} color="#3b82f6" /> Contact Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563' }}>FULL NAME</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="e.g. John Doe" style={{ padding: '0.65rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563' }}>EMAIL ADDRESS</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="e.g. john@example.com" style={{ padding: '0.65rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563' }}>PHONE NUMBER</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', paddingInline: '1rem', background: '#ffffff' }}>
                      <Phone size={16} color="#9ca3af" style={{ marginRight: '0.5rem' }} />
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="e.g. +91 98765 43210" style={{ padding: '0.65rem 0', border: 'none', width: '100%', outline: 'none' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} color="#3b82f6" /> Shipping Address
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563' }}>STREET ADDRESS</label>
                    <input type="text" name="street" required value={formData.street} onChange={handleInputChange} placeholder="Flat, House no., Apartment, Street" style={{ padding: '0.65rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563' }}>CITY</label>
                      <input type="text" name="city" required value={formData.city} onChange={handleInputChange} placeholder="City Name" style={{ padding: '0.65rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563' }}>STATE</label>
                      <input type="text" name="state" required value={formData.state} onChange={handleInputChange} placeholder="State Name" style={{ padding: '0.65rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563' }}>POSTAL / ZIP CODE</label>
                      <input type="text" name="zipCode" required value={formData.zipCode} onChange={handleInputChange} placeholder="e.g. 400001" style={{ padding: '0.65rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563' }}>COUNTRY</label>
                      <input type="text" name="country" required value={formData.country} onChange={handleInputChange} placeholder="Country Name" style={{ padding: '0.65rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulated Card Payment details */}
              <div>
                <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={16} color="#3b82f6" /> Payment Details (Simulated)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563' }}>CARD NUMBER</label>
                    <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} style={{ padding: '0.65rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', background: '#f9fafb' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563' }}>EXPIRY DATE</label>
                      <input type="text" name="cardExpiry" value={formData.cardExpiry} onChange={handleInputChange} style={{ padding: '0.65rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', background: '#f9fafb' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563' }}>SECURITY CODE (CVV)</label>
                      <input type="text" name="cardCvv" value={formData.cardCvv} onChange={handleInputChange} style={{ padding: '0.65rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', background: '#f9fafb' }} />
                    </div>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.85rem', fontWeight: 600 }}>
                  {errorMsg}
                </div>
              )}

              {/* Order total info inside checkout */}
              <div style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                padding: '1.25rem',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.5rem',
              }}>
                <span style={{ fontWeight: 700, color: '#1e3a8a' }}>Order Total to Pay</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1d4ed8' }}>{formatPrice(total)}</span>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button 
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.9rem',
                    borderRadius: '50px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '0.9rem',
                    borderRadius: '50px',
                    border: 'none',
                    background: '#3b82f6',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
                  }}
                >
                  {loading ? <Loader size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                  {loading ? 'Processing...' : 'Confirm & Place Order'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
