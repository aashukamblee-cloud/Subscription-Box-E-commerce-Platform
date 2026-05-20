import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, Star, ShoppingCart, Heart, Smartphone, Monitor, Laptop, Wifi, Gamepad2, Headset, Zap, Gift, Tag } from 'lucide-react';
import api from '../services/api';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { openCart, openDetail } from '../store/slices/uiSlice';

// Amazon-style Live Trending Trail Products (High-Fidelity mock objects matched to standard formats)
const trendingProducts = [
  {
    _id: 'trend-01',
    id: 'trend-01',
    name: 'NVIDIA GeForce RTX 5090 FE',
    price: 1999.00,
    images: ['https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=300'],
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=300',
    badge: 'hot',
    badgeText: 'Live Drop',
    sku: 'PRD-GPU-5090',
    category: 'computers',
    description: 'Next-Gen Blackwell architecture, 32GB GDDR7, ultimate 4K ray-tracing and AI powerhouse.'
  },
  {
    _id: 'trend-02',
    id: 'trend-02',
    name: 'Apple Vision Pro',
    price: 3499.00,
    images: ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=300'],
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=300',
    badge: 'deal',
    badgeText: 'Save $100',
    sku: 'PRD-ACC-AVP',
    category: 'accessories',
    description: 'Immersive spatial computer blending high-fidelity digital graphics with your physical world.'
  },
  {
    _id: 'trend-03',
    id: 'trend-03',
    name: 'MacBook Pro M4 Max',
    price: 2499.00,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=300'],
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=300',
    badge: 'new',
    badgeText: 'New Release',
    sku: 'PRD-LAP-M4M',
    category: 'laptops',
    description: 'Apple M4 Max chip, 16-core CPU, 40-core GPU, ultra-bright Liquid Retina XDR display.'
  },
  {
    _id: 'trend-04',
    id: 'trend-04',
    name: 'Sony PlayStation 6 Pro',
    price: 599.00,
    images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=300'],
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=300',
    badge: 'hot',
    badgeText: 'Top Seller',
    sku: 'PRD-GAM-PS6',
    category: 'pc gaming',
    description: 'Sony next-generation console concept, ray-traced 8K graphics, ultra-fast SSD storage.'
  },
  {
    _id: 'trend-05',
    id: 'trend-05',
    name: 'Samsung Galaxy Ring',
    price: 399.00,
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=300'],
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=300',
    badge: 'new',
    badgeText: 'Innovate',
    sku: 'PRD-ACC-SRG',
    category: 'accessories',
    description: 'Premium lightweight titanium smart ring, advanced sleep metrics, wellness score monitoring.'
  },
  {
    _id: 'trend-06',
    id: 'trend-06',
    name: 'Sony WH-1000XM5 ANC',
    price: 348.00,
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=300'],
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=300',
    badge: 'deal',
    badgeText: '15% Off',
    sku: 'PRD-ACC-XM5',
    category: 'accessories',
    description: 'Industry-leading adaptive active noise-cancelling wireless headphones with spatial audio.'
  }
];

// High-Fidelity Website Promotional Offers matching visual specs
const promotionalOffers = [
  {
    _id: 'promo-01',
    id: 'promo-01',
    isOffer: true,
    name: '30% Off Box Subscriptions',
    badge: 'offer',
    badgeText: 'Special Deal',
    code: 'BOXPOWER30',
    description: 'Save 30% on your first monthly curated tech box. Custom setup.',
    bgGradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' // Pink to Purple
  },
  {
    _id: 'promo-02',
    id: 'promo-02',
    isOffer: true,
    name: 'Free Premium Delivery',
    badge: 'shipping',
    badgeText: 'Free Delivery',
    code: 'FREESHIP50',
    description: 'Enjoy free premium expedited shipping on orders exceeding $50.',
    bgGradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' // Cyan to Blue
  },
  {
    _id: 'promo-03',
    id: 'promo-03',
    isOffer: true,
    name: 'Gear Up Pre-Order Bonus',
    badge: 'bundle',
    badgeText: 'Exclusive Drop',
    code: 'GEARUP2026',
    description: 'Pre-order next accessory pack & score a free mystery high-tech item.',
    bgGradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)' // Orange to Red
  }
];

// Interleave standard products and premium offer banners for the marquee streams
const combinedTrendingItems = [
  trendingProducts[0],
  promotionalOffers[0],
  trendingProducts[1],
  trendingProducts[2],
  promotionalOffers[1],
  trendingProducts[3],
  trendingProducts[4],
  promotionalOffers[2],
  trendingProducts[5]
];

const heroDeals = [
  {
    id: 'hero-deal-1',
    name: 'Roco Wireless',
    nameSpan: 'Headphone',
    subtitle: 'Hot Deal In This Week',
    price: 49.00,
    sku: 'PRD-ACC-01',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'],
    fallbackImage: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800',
    color: '#ef4444'
  },
  {
    id: 'hero-deal-2',
    name: 'Next-Gen VR',
    nameSpan: 'Headset',
    subtitle: 'Exclusive Pre-Order',
    price: 399.00,
    sku: 'PRD-VR-01',
    images: ['https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=800'],
    fallbackImage: 'https://images.unsplash.com/photo-1582053433976-25c00369fc93?auto=format&fit=crop&q=80&w=800',
    color: '#8b5cf6'
  },
  {
    id: 'hero-deal-3',
    name: 'Pro Gaming',
    nameSpan: 'Keyboard',
    subtitle: 'Gamer\'s Choice',
    price: 129.00,
    sku: 'PRD-KB-01',
    images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800'],
    fallbackImage: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa831?auto=format&fit=crop&q=80&w=800',
    color: '#10b981'
  }
];

const LandingPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [rawProducts, setRawProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCoupon, setCopiedCoupon] = useState('');
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const heroSliderRef = useRef(null);

  // Auto-slide hero every 4 seconds
  const goToSlide = useCallback((idx) => {
    if (!heroSliderRef.current) return;
    const slideWidth = heroSliderRef.current.offsetWidth;
    heroSliderRef.current.scrollTo({ left: slideWidth * idx, behavior: 'smooth' });
    setActiveHeroSlide(idx);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroSlide(prev => {
        const next = (prev + 1) % heroDeals.length;
        if (heroSliderRef.current) {
          const slideWidth = heroSliderRef.current.offsetWidth;
          heroSliderRef.current.scrollTo({ left: slideWidth * next, behavior: 'smooth' });
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Currency integration
  const { symbol, rate, code } = useSelector((state) => state.currency);
  const formatPrice = (priceInUSD) => {
    if (priceInUSD === undefined || priceInUSD === null) return '';
    const converted = priceInUSD * rate;
    return `${symbol}${converted.toLocaleString(code === 'INR' ? 'en-IN' : 'en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
  };

  // Redux Wishlist integration
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = (prod) => {
    const id = prod._id || prod.id || prod.name;
    return wishlistItems.some(item => (item._id || item.id || item.name) === id);
  };

  // Polymorphic Card Renderer supporting regular products and glowing offer banners
  const renderTrailCard = (item, idx, isHorizontal = false) => {
    if (item.isOffer) {
      return (
        <div 
          key={`${item.id}-${isHorizontal ? 'horiz' : 'vert'}-${idx}`}
          className={`trail-product-card trail-offer-card ${isHorizontal ? 'trail-product-card-horizontal' : ''}`}
          style={{ background: item.bgGradient }}
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(item.code);
            setCopiedCoupon(item.code);
            setTimeout(() => setCopiedCoupon(''), 2000);
          }}
        >
          <div className="trail-card-img-wrapper" style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.25)' }}>
            <Gift size={24} style={{ color: '#ffffff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }} />
          </div>
          <div className="trail-card-info" style={{ color: '#ffffff' }}>
            <span className="trail-card-badge" style={{ background: 'rgba(255, 255, 255, 0.25)', color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              {item.badgeText}
            </span>
            <h4 className="trail-card-name" style={{ color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>{item.name}</h4>
            <div className="trail-card-price-row">
              <span className="trail-card-coupon-code" style={{ 
                fontSize: '0.7rem', 
                fontWeight: 800, 
                background: 'rgba(255, 255, 255, 0.2)', 
                padding: '0.15rem 0.5rem', 
                borderRadius: '4px', 
                border: '1px dashed rgba(255, 255, 255, 0.4)',
                letterSpacing: '0.05em'
              }}>
                {item.code}
              </span>
              <button 
                className="trail-card-add-btn"
                style={{ background: 'rgba(255, 255, 255, 0.25)', color: '#ffffff', border: 'none', cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(item.code);
                  setCopiedCoupon(item.code);
                  setTimeout(() => setCopiedCoupon(''), 2000);
                }}
              >
                <Tag size={12} style={{ color: '#ffffff' }} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Standard product card
    return (
      <div 
        key={`${item._id || item.id}-${isHorizontal ? 'horiz' : 'vert'}-${idx}`}
        className={`trail-product-card ${isHorizontal ? 'trail-product-card-horizontal' : ''}`}
        onClick={() => dispatch(openDetail(item))}
      >
        <div className="trail-card-img-wrapper">
          <img 
            src={item.images[0]} 
            alt={item.name} 
            className="trail-card-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=150';
            }}
          />
        </div>
        <div className="trail-card-info">
          <span className={`trail-card-badge badge-${item.badge}`}>
            {item.badgeText}
          </span>
          <h4 className="trail-card-name">{item.name}</h4>
          <div className="trail-card-price-row">
            <span className="trail-card-price">{formatPrice(item.price)}</span>
            <button 
              className="trail-card-add-btn"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(addToCart(item));
                dispatch(openCart());
              }}
            >
              <ShoppingCart size={13} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';
  const wishlistQuery = searchParams.get('wishlist') === 'true';

  const categories = [
    { name: 'Phones', slug: 'phones', icon: <Smartphone size={32} /> },
    { name: 'Computers', slug: 'computers', icon: <Monitor size={32} /> },
    { name: 'Accessories', slug: 'accessories', icon: <Headset size={32} /> },
    { name: 'Laptops', slug: 'laptops', icon: <Laptop size={32} /> },
    { name: 'Monitors', slug: 'monitors', icon: <Monitor size={32} /> },
    { name: 'Networking', slug: 'networking', icon: <Wifi size={32} /> },
    { name: 'PC Gaming', slug: 'pc gaming', icon: <Gamepad2 size={32} /> },
  ];

  // Fetch products from backend only when search or category queries change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let endpoint = '/products?limit=100';
        if (searchQuery) {
          endpoint += `&search=${encodeURIComponent(searchQuery)}`;
        }
        if (categoryQuery) {
          endpoint += `&category=${encodeURIComponent(categoryQuery)}`;
        }
        
        const response = await api.get(endpoint);
        setRawProducts(response.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please check if backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, categoryQuery]);

  // Apply wishlist filtering locally so toggling wishlist never causes backend request lags
  useEffect(() => {
    if (wishlistQuery) {
      setProducts(wishlistItems);
    } else {
      setProducts(rawProducts);
    }
  }, [rawProducts, wishlistQuery, wishlistItems]);

  const handleCategoryClick = (slug) => {
    const params = new URLSearchParams(searchParams);
    if (params.get('category') === slug) {
      params.delete('category');
    } else {
      params.set('category', slug);
      params.delete('search');
      params.delete('wishlist');
    }
    setSearchParams(params);
    
    // Scroll to products list section
    setTimeout(() => {
      const el = document.getElementById('products');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="landing-page" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      
      {/* ===== HERO SLIDER SECTION ===== */}
      <section ref={heroSliderRef} className="hero-slider-wrapper" style={{ marginBottom: '1rem', width: '100%', overflowX: 'auto', scrollSnapType: 'x mandatory', display: 'flex', gap: '1rem', paddingBottom: '1rem' }}>
        {heroDeals.map((deal) => (
          <div key={deal.id} className="hero-container" style={{ 
            flex: '0 0 100%',
            scrollSnapAlign: 'start',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '4rem 5%', 
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-xl)',
            flexWrap: 'wrap',
            gap: '2rem',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ flex: '1 1 500px', minWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: deal.color, fontWeight: 600, marginBottom: '1rem' }}>
                <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: deal.color }}></span>
                {deal.subtitle}
              </div>
              <h1 className="hero-title" style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '2rem', color: 'var(--text-primary)' }}>
                {deal.name}<br />{deal.nameSpan}
              </h1>
              <div className="hero-actions" style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => {
                    const product = products.find(p => p.sku === deal.sku) || {
                      name: `${deal.name} ${deal.nameSpan}`,
                      price: deal.price,
                      sku: deal.sku,
                      images: deal.images
                    };
                    dispatch(addToCart(product));
                    dispatch(openCart());
                  }}
                  className="btn btn-primary" 
                  style={{ padding: '1rem 2.5rem', background: '#3b82f6', color: '#ffffff', border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-md)', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
                >
                  <ShoppingCart size={20} /> Shop Now
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', marginLeft: '10px' }}>
                    {[1,2,3].map(i => (
                      <img 
                        key={i} 
                        src={`https://i.pravatar.cc/100?img=${i+10}`} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://images.unsplash.com/photo-${i === 1 ? '1535713875002-d1d0cf377fde' : i === 2 ? '1494790108377-be9c29b29330' : '1599566150163-29194dcaad36'}?auto=format&fit=crop&q=80&w=100`;
                        }}
                        alt="user" 
                        style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--border-color)', marginLeft: '-10px', objectFit: 'cover' }} 
                      />
                    ))}
                  </div>
                  <div>
                    <div style={{ display: 'flex', color: '#f59e0b' }}>
                      {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>100+ Reviews</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ flex: '1 1 400px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px', background: `radial-gradient(circle, ${deal.color}25 0%, transparent 70%)`, borderRadius: '50%', zIndex: 0 }}></div>
              
              <img 
                src={deal.images[0]} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = deal.fallbackImage;
                }}
                alt={deal.name} 
                style={{ width: '100%', maxWidth: '450px', zIndex: 1, borderRadius: '20px', objectFit: 'cover', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }} 
              />
              
              <div style={{ position: 'absolute', top: '10%', right: '10%', background: 'var(--bg-primary)', padding: '1rem', borderRadius: '50%', width: '90px', height: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)', zIndex: 2, border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>From</span>
                <span style={{ fontWeight: 800, color: deal.color, fontSize: '0.95rem' }}>{formatPrice(deal.price)}</span>
              </div>
            </div>
          </div>
        ))}
      </section>
      
      {/* Hero Slider Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '4rem' }}>
        {heroDeals.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            style={{
              width: activeHeroSlide === idx ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: activeHeroSlide === idx ? '#3b82f6' : 'var(--border-highlight)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <div className="storefront-layout">
        <div className="storefront-main">
          
          {/* ===== MOBILE HORIZONTAL AUTO-SLIDING RECOMMENDED PRODUCT TRAIL ===== */}
          <div className="marquee-horizontal-wrapper">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '0 0.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
                <Zap size={15} style={{ color: '#ef4444' }} fill="#ef4444" />
                Live Tech Recommendations
              </h3>
              <span className="live-badge" style={{ fontSize: '0.5rem', padding: '0.1rem 0.35rem' }}>Live Feed</span>
            </div>
            <div className="marquee-horizontal-content">
              {[...combinedTrendingItems, ...combinedTrendingItems].map((prod, idx) => 
                renderTrailCard(prod, idx, true)
              )}
            </div>
          </div>

          {/* ===== BROWSE BY CATEGORY ===== */}
          <section id="categories" style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6', fontWeight: 600, marginBottom: '0.5rem' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: '#8b5cf6' }}></span>
              Categories
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Browse by Category</h2>
            </div>

            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }} className="categories-scroll">
              {categories.map((cat, idx) => {
                const isSelected = categoryQuery === cat.slug;
                return (
                  <div 
                    key={idx} 
                    onClick={() => handleCategoryClick(cat.slug)}
                    style={{ 
                      minWidth: '150px', 
                      background: isSelected ? '#3b82f6' : 'white', 
                      border: isSelected ? '1px solid #3b82f6' : '1px solid var(--border-color)', 
                      borderRadius: 'var(--radius-md)', 
                      padding: '2rem 1rem', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: '1rem', 
                      cursor: 'pointer', 
                      transition: 'all 0.2s', 
                      boxShadow: 'var(--shadow-sm)',
                      color: isSelected ? 'white' : 'inherit'
                    }}
                    onMouseEnter={(e) => { if(!isSelected) e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                    onMouseLeave={(e) => { if(!isSelected) e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                  >
                    <div style={{ color: isSelected ? 'white' : '#3b82f6' }}>{cat.icon}</div>
                    <span style={{ fontWeight: 600, color: isSelected ? 'white' : 'var(--text-secondary)' }}>{cat.name}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ===== ENHANCE EXPERIENCE PROMO ===== */}
          <section id="promo" className="promo-container" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '4rem 5%', 
            background: '#f8fafc',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '5rem',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 600, marginBottom: '1rem' }}>
                <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></span>
                Don't Miss!!
              </div>
              <h2 className="promo-title" style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '2rem', color: '#111827' }}>
                Enhance Your<br />Music Experience
              </h2>
              
              <div className="countdown-container" style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                {[ { v: '16', l: 'Day' }, { v: '10', l: 'Hrs' }, { v: '56', l: 'Min' }, { v: '54', l: 'Sec' } ].map((t, idx) => (
                  <div key={idx} style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{t.v}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{t.l}</span>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => handleCategoryClick('accessories')}
                className="btn btn-primary" 
                style={{ padding: '1rem 2.5rem', borderRadius: '8px', background: '#3b82f6', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 600 }}
              >
                Check it Out!
              </button>
            </div>
            
            <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
              <img 
                src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800';
                }}
                alt="Promo Headphones" 
                style={{ width: '100%', maxWidth: '380px', borderRadius: '20px', objectFit: 'cover', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))' }} 
              />
            </div>
          </section>

          {/* ===== EXPLORE OUR PRODUCTS ===== */}
          <section id="products" style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6', fontWeight: 600, marginBottom: '0.5rem' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: '#8b5cf6' }}></span>
              Our Products
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>
                {wishlistQuery ? 'My Wishlisted Products' : searchQuery ? `Search Results for "${searchQuery}"` : categoryQuery ? `Category: ${categoryQuery.toUpperCase()}` : 'Explore our Products'}
              </h2>
              {(searchQuery || categoryQuery || wishlistQuery) && (
                <button 
                  onClick={clearAllFilters}
                  style={{ background: '#f3f4f6', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Clear Filters
                </button>
              )}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem' }}>
                <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #f3f4f6', borderTop: '4px solid #3b82f6', borderRadius: '50%' }} className="loader"></div>
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading products...</p>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
                <p>{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#f9fafb', borderRadius: 'var(--radius-xl)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Products Found</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>We couldn't find any products matching your query.</p>
                <button onClick={clearAllFilters} className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', borderRadius: '50px', cursor: 'pointer', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 600 }}>
                  Show All Products
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
                {products.map((prod, idx) => {
                  const itemId = prod._id || prod.id || prod.name;
                  const liked = isWishlisted(prod);
                  const imgUrl = prod.images && prod.images[0] ? prod.images[0] : prod.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300&h=300';
                  
                  return (
                    <div key={itemId} style={{ display: 'flex', flexDirection: 'column', position: 'relative' }} className="product-card">
                      <div 
                        className="product-card-img-container" 
                        onClick={() => dispatch(openDetail(prod))}
                        style={{ background: '#f9fafb', borderRadius: 'var(--radius-lg)', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '1.5rem', marginBottom: '1rem', border: '1px solid #f3f4f6', cursor: 'pointer' }}
                      >
                        <img 
                          src={imgUrl} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300&h=300';
                          }}
                          alt={prod.name} 
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'transform 0.3s' }} 
                          className="prod-img" 
                        />
                        
                        {/* Hover Actions */}
                        <div className="hover-actions" onClick={(e) => e.stopPropagation()} style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '0.5rem 1rem', borderRadius: '50px', boxShadow: 'var(--shadow-md)' }}>
                          <button 
                            onClick={() => {
                              dispatch(addToCart(prod));
                              dispatch(openCart());
                            }}
                            className="nav-icon-btn" 
                            style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#3b82f6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', transition: 'all 0.2s' }}
                          >
                            <ShoppingCart size={18} />
                          </button>
                          <button 
                            className="nav-icon-btn" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch(toggleWishlist(prod)); }}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'white', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          >
                            <Heart size={18} color={liked ? "#ef4444" : "#9ca3af"} fill={liked ? "#ef4444" : "none"} />
                          </button>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', color: '#f59e0b' }}>
                          {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({Math.floor(Math.random() * 80) + 10})</span>
                      </div>
                      
                      <h3 
                        onClick={() => dispatch(openDetail(prod))}
                        style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#111827', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#111827'}
                      >{prod.name}</h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: '#111827' }}>{formatPrice(prod.price)}</span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{formatPrice(prod.price * 1.3)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* ===== DESKTOP VERTICAL AUTO-SLIDING RECOMMENDED PRODUCT SIDEBAR ===== */}
        <aside className="trending-sidebar-container">
          <div className="sidebar-title-wrapper">
            <h3 className="sidebar-title">
              <Zap size={16} style={{ color: '#ef4444' }} fill="#ef4444" />
              Nova Tech Trail
            </h3>
            <span className="live-badge">Live</span>
          </div>
          <div className="marquee-vertical-wrapper">
            <div className="marquee-vertical-content">
              {[...combinedTrendingItems, ...combinedTrendingItems].map((prod, idx) => 
                renderTrailCard(prod, idx, false)
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Floating toast alert when copying coupon code */}
      {copiedCoupon && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(8px)',
          color: '#ffffff',
          padding: '0.85rem 1.75rem',
          borderRadius: '50px',
          boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4), 0 0 10px rgba(59, 130, 246, 0.2)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          zIndex: 9999,
          fontSize: '0.9rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both'
        }}>
          <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> 
          Coupon <strong style={{ color: '#60a5fa', textShadow: '0 0 8px rgba(96,165,250,0.4)' }}>{copiedCoupon}</strong> copied to clipboard!
        </div>
      )}

    </div>
  );
};

export default LandingPage;
