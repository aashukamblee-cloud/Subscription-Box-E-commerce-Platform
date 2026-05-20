import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Box as BoxIcon } from 'lucide-react';
import api from '../../services/api';

const Scheduler = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  // For a real app we'd use react-big-calendar. For this scaffold, we'll display a list of upcoming scheduled events (e.g., box lock dates, shipment dispatch dates).
  
  useEffect(() => {
    // Mocking the scheduled events since full calendar integration takes more setup
    setTimeout(() => {
      setUpcoming([
        { id: 1, title: 'June Box Lock-in', date: new Date(Date.now() + 86400000 * 5), type: 'lock' },
        { id: 2, title: 'May Shipment Dispatch', date: new Date(Date.now() + 86400000 * 2), type: 'shipment' },
        { id: 3, title: 'Q3 Plan Renewal Reminders', date: new Date(Date.now() + 86400000 * 12), type: 'reminder' }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div>Loading schedule...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Event Scheduler</h2>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 2 }}>
          <div className="card glass-panel" style={{ minHeight: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ textAlign: 'center' }}>
              <CalendarIcon size={64} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
              <p>Calendar View UI (Placeholder for React Big Calendar)</p>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div className="card glass-panel">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="var(--accent-primary)" /> Upcoming Actions
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcoming.map(event => (
                <div key={event.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${event.type === 'shipment' ? 'var(--success)' : 'var(--accent-primary)'}` }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{event.title}</h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {event.date.toLocaleDateString()} at {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', display: 'flex', gap: '0.5rem' }}>
              <BoxIcon size={18} /> Schedule New Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
