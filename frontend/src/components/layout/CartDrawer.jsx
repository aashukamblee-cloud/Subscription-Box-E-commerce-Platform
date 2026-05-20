import { useSelector, useDispatch } from 'react-redux';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { closeCart, openCart } from '../../store/slices/uiSlice';
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.ui.isCartOpen);
  const cartItems = useSelector((state) => state.cart.items);
  
  // Currency settings
  const { symbol, rate, code } = useSelector((state) => state.currency);
  const formatPrice = (priceInUSD) => {
    if (priceInUSD === undefined || priceInUSD === null) return '';
    const converted = priceInUSD * rate;
    return `${symbol}${converted.toLocaleString(code === 'INR' ? 'en-IN' : 'en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleQtyChange = (id, newQty) => {
    if (newQty < 1) return;
    dispatch(updateQuantity({ id, quantity: newQty }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckoutClick = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
      transition: 'opacity 0.3s ease-in-out',
    }} onClick={() => dispatch(closeCart())}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        color: '#1f2937',
      }} onClick={(e) => e.stopPropagation()}>
        {/* CSS keyframe injected directly */}
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Drawer Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShoppingBag size={24} color="#3b82f6" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#111827' }}>Your Shopping Cart</h2>
            <span style={{
              background: '#eff6ff',
              color: '#3b82f6',
              padding: '0.2rem 0.6rem',
              borderRadius: '50px',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}>{cartItems.reduce((acc, item) => acc + item.quantity, 0)} items</span>
          </div>
          <button 
            onClick={() => dispatch(closeCart())}
            style={{
              background: '#f3f4f6',
              border: 'none',
              cursor: 'pointer',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4b5563',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body (Items list) */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {cartItems.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80%',
              textAlign: 'center',
              color: '#6b7280',
            }}>
              <ShoppingBag size={64} style={{ opacity: 0.3, marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#374151', margin: '0 0 0.5rem 0' }}>Your cart is empty</h3>
              <p style={{ fontSize: '0.9rem', maxWidth: '280px', margin: 0 }}>Add high-quality tech gear to your cart to see them listed here!</p>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemId = item._id || item.id || item.name;
              const imgUrl = item.images && item.images[0] ? item.images[0] : item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200';
              return (
                <div key={itemId} style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  border: '1px solid #f3f4f6',
                  borderRadius: '12px',
                  background: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                  transition: 'transform 0.2s',
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3 }}>{item.name}</h4>
                      <button 
                        onClick={() => handleRemove(itemId)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '50px',
                        padding: '0.15rem 0.6rem',
                        background: '#f9fafb',
                      }}>
                        <button 
                          onClick={() => handleQtyChange(itemId, item.quantity - 1)}
                          style={{ background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                        <button 
                          onClick={() => handleQtyChange(itemId, item.quantity + 1)}
                          style={{ background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: '#3b82f6' }}>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid #e5e7eb',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#4b5563', fontWeight: 600 }}>Estimated Subtotal</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827' }}>{formatPrice(subtotal)}</span>
            </div>
            
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>Shipping & taxes calculated at checkout.</p>
            
            <button 
              onClick={handleCheckoutClick}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '50px',
                background: '#3b82f6',
                border: 'none',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2563eb';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.25)';
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
