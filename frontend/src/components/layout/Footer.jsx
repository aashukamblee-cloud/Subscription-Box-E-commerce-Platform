import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Send, Twitter, Instagram, Linkedin, Github, Facebook } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate premium newsletter submission success
    setSubscribed(true);
    setEmail('');
    setTimeout(() => {
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="footer-container">
      <div className="footer-grid">
        {/* Brand Curation Column */}
        <div className="footer-brand-column">
          <Link to="/" className="footer-logo-link">
            <div className="footer-logo-wrapper">
              <Zap size={20} fill="#ffffff" style={{ color: '#ffffff' }} />
            </div>
            <span>NovaFlow</span>
          </Link>
          <p className="footer-tagline">
            Experience next-level subscription boxes. Hand-curated premium tech drops, gaming accessories, and spatial computing gadgets delivered straight to your door.
          </p>
        </div>

        {/* Shop Navigation Links */}
        <div>
          <h4 className="footer-title">Shop Flow</h4>
          <ul className="footer-links-list">
            <li><Link to="/plans" className="footer-link">Tech Boxes</Link></li>
            <li><Link to="/plans" className="footer-link">Pricing Plans</Link></li>
            <li><a href="/#products" className="footer-link">Weekly Drops</a></li>
            <li><Link to="/plans" className="footer-link">Gift Cards</Link></li>
          </ul>
        </div>

        {/* Customer Support Links */}
        <div>
          <h4 className="footer-title">Support</h4>
          <ul className="footer-links-list">
            <li><Link to="/dashboard/shipments" className="footer-link">Track Shipment</Link></li>
            <li><Link to="/dashboard" className="footer-link">My Account</Link></li>
            <li><Link to="/dashboard/billing" className="footer-link">Billing Portal</Link></li>
            <li><Link to="/plans" className="footer-link">Returns & Refunds</Link></li>
          </ul>
        </div>

        {/* Glowing Newsletter Sign-Up Column */}
        <div className="footer-newsletter-column">
          <h4 className="footer-title">Join The Flow</h4>
          <p className="footer-newsletter-desc">
            Subscribe to score 10% off your first box and secure priority access to live hardware drops.
          </p>
          
          {subscribed ? (
            <div className="footer-newsletter-success">
              <span>✓</span> Welcome to the flow! Check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="footer-newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="footer-newsletter-input"
                required
              />
              <button type="submit" className="footer-newsletter-btn" aria-label="Subscribe">
                <Send size={15} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom copyright row with organic scaling social circles */}
      <div className="footer-bottom-row">
        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} NovaFlow Technologies Inc. All rights reserved.
        </div>
        
        <div className="footer-social-links">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Twitter">
            <Twitter size={16} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Instagram">
            <Instagram size={16} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="LinkedIn">
            <Linkedin size={16} />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="GitHub">
            <Github size={16} />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Facebook">
            <Facebook size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
