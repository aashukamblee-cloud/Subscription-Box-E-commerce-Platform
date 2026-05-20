import { useSelector, useDispatch } from 'react-redux';
import { X, ShoppingCart, Info, Star, Heart } from 'lucide-react';
import { closeDetail, openCart } from '../../store/slices/uiSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';

const ProductDetailModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isDetailOpen);
  const product = useSelector((state) => state.ui.selectedProduct);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // Currency settings
  const { symbol, rate, code } = useSelector((state) => state.currency);
  const formatPrice = (priceInUSD) => {
    if (priceInUSD === undefined || priceInUSD === null) return '';
    const converted = priceInUSD * rate;
    return `${symbol}${converted.toLocaleString(code === 'INR' ? 'en-IN' : 'en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
  };

  if (!isOpen || !product) return null;

  const isLiked = wishlistItems.some(
    (item) => (item._id || item.id || item.name) === (product._id || product.id || product.name)
  );

  const imgUrl = product.images && product.images[0] ? product.images[0] : product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600';
  
  // Specs conversion
  const specs = product.specs ? (product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs) : {};
  const specsList = Object.entries(specs);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    dispatch(closeDetail());
    dispatch(openCart());
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product));
  };

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
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }} onClick={() => dispatch(closeDetail())}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'zoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        color: '#1f2937',
      }} onClick={(e) => e.stopPropagation()}>
        
        <style>{`
          @keyframes zoomIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>

        {/* Modal Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f9fafb',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', fontWeight: 700 }}>
            <Info size={20} />
            <span>Product Details & Specifications</span>
          </div>
          
          <button 
            onClick={() => dispatch(closeDetail())}
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
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
            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
        }} className="modal-body-grid">
          {/* Left Column: Image Container */}
          <div style={{
            background: '#f9fafb',
            borderRadius: '16px',
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '320px',
            border: '1px solid #f3f4f6',
          }}>
            <img 
              src={imgUrl} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600';
              }}
              alt={product.name} 
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
            />
          </div>

          {/* Right Column: Descriptions & Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              {product.category && (
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  background: '#eff6ff',
                  color: '#3b82f6',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '50px',
                  letterSpacing: '0.05em',
                }}>{product.category}</span>
              )}
              
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0.75rem 0 0.5rem 0', lineHeight: 1.25 }}>{product.name}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', color: '#f59e0b' }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>(4.8 rating)</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#3b82f6' }}>{formatPrice(product.price)}</span>
              <span style={{ fontSize: '1rem', color: '#9ca3af', textDecoration: 'line-through' }}>{formatPrice(product.price * 1.3)}</span>
              <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 700 }}>Save 23%</span>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4b5563', margin: '0 0 0.5rem 0' }}>Overview</h4>
              <p style={{ fontSize: '0.9rem', color: '#4b5563', margin: 0, lineHeight: 1.5 }}>{product.description || 'No description available for this item.'}</p>
            </div>
            
            {product.tags && product.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {product.tags.map((t, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', color: '#4b5563', background: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>#{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* Full-width Specifications Table */}
          <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: '0 0 1rem 0', borderBottom: '2px solid #f3f4f6', paddingBottom: '0.5rem' }}>Technical Specifications</h4>
            
            {specsList.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>Standard electronic unit specifications apply.</p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                background: '#f9fafb',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid #f3f4f6',
              }}>
                {specsList.map(([key, val]) => (
                  <div key={key} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0.5rem 0.75rem',
                    borderBottom: '1px solid #f3f4f6',
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>{key}</span>
                    <span style={{ fontSize: '0.9rem', color: '#374151', fontWeight: 700, marginTop: '0.15rem' }}>{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1.5rem 2rem',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '1rem',
          background: '#f9fafb',
        }}>
          {/* Wishlist toggle button */}
          <button 
            onClick={handleToggleWishlist}
            style={{
              padding: '0.75rem',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid #d1d5db',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isLiked ? '#ef4444' : '#6b7280',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
            title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart size={20} fill={isLiked ? "#ef4444" : "none"} color={isLiked ? "#ef4444" : "#6b7280"} />
          </button>

          <button 
            onClick={() => dispatch(closeDetail())}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              border: '1px solid #d1d5db',
              background: '#ffffff',
              color: '#4b5563',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
          >
            Close Details
          </button>
          
          <button 
            onClick={handleAddToCart}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '50px',
              background: '#3b82f6',
              border: 'none',
              color: '#ffffff',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2563eb';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
            }}
          >
            <ShoppingCart size={16} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
