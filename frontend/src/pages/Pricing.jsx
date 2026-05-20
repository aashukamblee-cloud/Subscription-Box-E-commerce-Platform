import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Check, Package } from 'lucide-react';
import api from '../services/api';

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/plans');
        setPlans(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch plans', error);
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await api.post('/payments/create-checkout', { planId });
      if (response.data?.sessionUrl) {
        window.location.href = response.data.sessionUrl;
      }
    } catch (error) {
      console.error('Failed to start checkout', error);
      alert('Unable to start checkout process at this time.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading plans...</div>;

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Choose Your Box</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
          Curated premium items delivered right to your door every month.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {plans.length > 0 ? plans.map((plan) => (
          <div key={plan._id} className={`card glass-panel ${plan.isPopular ? 'popular' : ''}`} style={{ position: 'relative', border: plan.isPopular ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)' }}>
            {plan.isPopular && (
              <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-primary)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600 }}>
                Most Popular
              </span>
            )}
            
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Package size={40} color={plan.isPopular ? 'var(--accent-primary)' : 'var(--text-secondary)'} style={{ margin: '0 auto 1rem' }} />
              <h2>{plan.name}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>{plan.description}</p>
              <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 700 }}>${plan.price}</span>
                <span style={{ color: 'var(--text-secondary)' }}>/{plan.billingCycle}</span>
              </div>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {plan.features.map((feature, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Check size={20} color="var(--success)" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              className={`btn ${plan.isPopular ? 'btn-primary' : 'btn-outline'}`} 
              style={{ width: '100%', marginTop: 'auto', padding: '1rem' }}
              onClick={() => handleSubscribe(plan._id)}
            >
              Get Started
            </button>
          </div>
        )) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>
            No plans available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;
