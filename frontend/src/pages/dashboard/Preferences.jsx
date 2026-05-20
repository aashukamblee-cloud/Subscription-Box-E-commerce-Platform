import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Save } from 'lucide-react';
import api from '../../services/api';
import { fetchCurrentUser } from '../../store/slices/authSlice';

const Preferences = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    categories: [],
    allergies: [],
    interests: []
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && user.preferences) {
      setFormData({
        categories: user.preferences.categories || [],
        allergies: user.preferences.allergies || [],
        interests: user.preferences.interests || []
      });
    }
  }, [user]);

  const handleChange = (e, field) => {
    const value = e.target.value;
    const array = [...formData[field]];
    
    if (e.target.checked) {
      array.push(value);
    } else {
      const index = array.indexOf(value);
      if (index > -1) array.splice(index, 1);
    }
    
    setFormData({ ...formData, [field]: array });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/auth/me', { preferences: formData });
      dispatch(fetchCurrentUser()); // Refresh user state
      alert('Preferences saved successfully!');
    } catch (error) {
      alert('Failed to save preferences');
    }
    setSaving(false);
  };

  const CATEGORY_OPTIONS = ['fitness', 'beauty', 'tech', 'food', 'wellness', 'lifestyle'];
  const ALLERGY_OPTIONS = ['Nuts', 'Dairy', 'Gluten', 'Soy', 'None'];

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Box Customization Preferences</h2>
      
      <div className="card glass-panel" style={{ maxWidth: '800px' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Tell us what you like! We use these preferences to curate the perfect items for your monthly box.
        </p>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Preferred Categories</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {CATEGORY_OPTIONS.map(cat => (
              <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  value={cat} 
                  checked={formData.categories.includes(cat)}
                  onChange={(e) => handleChange(e, 'categories')}
                />
                <span style={{ textTransform: 'capitalize' }}>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Dietary & Allergies</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {ALLERGY_OPTIONS.map(allergy => (
              <label key={allergy} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  value={allergy} 
                  checked={formData.allergies.includes(allergy)}
                  onChange={(e) => handleChange(e, 'allergies')}
                />
                <span>{allergy}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <button className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem' }} onClick={handleSave} disabled={saving}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
