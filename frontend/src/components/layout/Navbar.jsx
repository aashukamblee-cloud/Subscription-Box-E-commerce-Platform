import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Package, Search, Heart, ShoppingCart, User, Menu, X, ChevronDown, Zap, Moon, Sun } from 'lucide-react';
import { setCurrency } from '../../store/slices/currencySlice';
import { openCart } from '../../store/slices/uiSlice';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux store integration
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const activeCurrency = useSelector((state) => state.currency);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    setActiveSection(id);
    
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        if (id === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      setSearchOpen(false);
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setTimeout(() => {
        const el = document.getElementById('products');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const toggleWishlistFilter = () => {
    const params = new URLSearchParams(location.search);
    if (params.get('wishlist') === 'true') {
      params.delete('wishlist');
      navigate(`/${params.toString() ? `?${params.toString()}` : ''}`);
    } else {
      params.set('wishlist', 'true');
      navigate(`/?${params.toString()}`);
    }
    setTimeout(() => {
      const el = document.getElementById('products');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'categories', label: 'Categories' },
    { id: 'promo', label: 'Promo' },
    { id: 'products', label: 'Products' }
  ];

  return (
    <>
      <nav className="navbar" style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', padding: '1rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link to="/" onClick={() => scrollToSection('home')} className="logo-container">
          <div className="logo-icon-wrapper">
            <Zap className="logo-icon" fill="currentColor" />
          </div>
          <span className="logo-text">
            Nova<span className="logo-text-highlight">Flow</span>
          </span>
        </Link>
        
        {/* Desktop Links */}
        <div className="ecommerce-nav-links" style={{ display: 'flex', gap: '2rem', fontWeight: 600, fontSize: '0.9rem' }}>
          {navItems.map(item => (
            <button 
              key={item.id}
              className="nav-text-btn" 
              onClick={() => scrollToSection(item.id)}
              style={{
                color: activeSection === item.id ? '#111827' : 'var(--text-secondary)',
                borderBottom: activeSection === item.id ? '2px solid #3b82f6' : '2px solid transparent',
                paddingBottom: '0.2rem',
                borderRadius: 0
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', color: 'var(--text-primary)' }}>
          {/* Theme Toggle */}
          <button className="nav-icon-btn mobile-hide" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* Currency Switcher */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button 
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="nav-icon-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: '4px', background: '#f3f4f6', border: '1px solid #e5e7eb' }}
            >
              <span>{activeCurrency.code === 'INR' ? '🇮🇳 INR (₹)' : '🇺🇸 USD ($)'}</span>
              <ChevronDown size={14} style={{ transform: currencyOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>
            {currencyOpen && (
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  right: 0, 
                  marginTop: '0.5rem', 
                  background: '#ffffff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px', 
                  boxShadow: 'var(--shadow-lg)', 
                  padding: '0.5rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.25rem', 
                  minWidth: '130px', 
                  zIndex: 200 
                }}
              >
                <button 
                  onClick={() => {
                    dispatch(setCurrency('INR'));
                    setCurrencyOpen(false);
                  }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    padding: '0.5rem 0.75rem', 
                    background: activeCurrency.code === 'INR' ? '#eff6ff' : 'transparent', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    textAlign: 'left',
                    color: '#111827',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = activeCurrency.code === 'INR' ? '#eff6ff' : 'transparent'; }}
                >
                  🇮🇳 INR (₹)
                </button>
                <button 
                  onClick={() => {
                    dispatch(setCurrency('USD'));
                    setCurrencyOpen(false);
                  }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    padding: '0.5rem 0.75rem', 
                    background: activeCurrency.code === 'USD' ? '#eff6ff' : 'transparent', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    textAlign: 'left',
                    color: '#111827',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = activeCurrency.code === 'USD' ? '#eff6ff' : 'transparent'; }}
                >
                  🇺🇸 USD ($)
                </button>
              </div>
            )}
          </div>

          <button className="mobile-hide nav-icon-btn" onClick={() => setSearchOpen(true)}><Search size={20} /></button>
          
          <button 
            className="mobile-hide nav-icon-btn" 
            onClick={toggleWishlistFilter}
            style={{ position: 'relative' }}
          >
            <Heart size={20} color={wishlistCount > 0 ? "#ef4444" : "currentColor"} fill={wishlistCount > 0 ? "#ef4444" : "none"} />
            {wishlistCount > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800 }}>
                {wishlistCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => dispatch(openCart())} 
            className="nav-icon-btn" 
            style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#3b82f6', color: 'white', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800 }}>
                {cartCount}
              </span>
            )}
          </button>
          <Link to="/dashboard" className="nav-icon-btn"><User size={20} /></Link>
          
          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="mobile-menu-btn nav-icon-btn"
            style={{ display: 'none' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', padding: '1rem', gap: '1rem', boxShadow: 'var(--shadow-md)' }}>
            <button className="nav-text-btn" style={{ textAlign: 'left', padding: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }} onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            {navItems.map(item => (
              <button 
                key={item.id}
                className="nav-text-btn" 
                style={{ 
                  textAlign: 'left', 
                  padding: '0.5rem',
                  color: activeSection === item.id ? '#3b82f6' : 'var(--text-secondary)'
                }} 
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
            <button 
              className="nav-text-btn" 
              style={{ 
                textAlign: 'left', 
                padding: '0.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: location.search.includes('wishlist=true') ? '#ef4444' : 'var(--text-secondary)'
              }} 
              onClick={() => {
                setMobileMenuOpen(false);
                toggleWishlistFilter();
              }}
            >
              <Heart size={16} fill={wishlistCount > 0 ? "#ef4444" : "none"} color={wishlistCount > 0 ? "#ef4444" : "currentColor"} />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span style={{ background: '#ef4444', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800 }}>
                  {wishlistCount}
                </span>
              )}
            </button>
            <button className="nav-text-btn" style={{ textAlign: 'left', padding: '0.5rem' }} onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }}>Search</button>
          </div>
        )}
      </nav>

      {/* Full Screen Search Overlay */}
      <div className={`search-overlay ${searchOpen ? 'open' : ''}`}>
        <button className="search-overlay-close" onClick={() => setSearchOpen(false)}>
          <X size={32} />
        </button>
        <div style={{ width: '80%', maxWidth: '600px', display: 'flex', borderBottom: '2px solid var(--text-primary)', paddingBottom: '0.5rem' }}>
          <Search size={28} color="var(--text-secondary)" style={{ marginRight: '1rem' }} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            style={{ border: 'none', background: 'transparent', fontSize: '2rem', outline: 'none', width: '100%', color: 'var(--text-primary)' }} 
            autoFocus={searchOpen}
          />
        </div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Press Enter to search</p>
      </div>
    </>
  );
};

export default Navbar;
