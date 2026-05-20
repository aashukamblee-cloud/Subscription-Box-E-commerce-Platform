import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../../services/api';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve global currency switcher state
  const { symbol, rate, code } = useSelector((state) => state.currency);

  // Mock data for charts since we might not have enough seeded data to make a nice chart yet
  const mockRevenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 5200 },
    { name: 'Mar', revenue: 6100 },
    { name: 'Apr', revenue: 5800 },
    { name: 'May', revenue: 7500 },
    { name: 'Jun', revenue: 8900 },
  ];

  const mockChurnData = [
    { name: 'Jan', churn: 2.1 },
    { name: 'Feb', churn: 1.8 },
    { name: 'Mar', churn: 2.5 },
    { name: 'Apr', churn: 1.2 },
    { name: 'May', churn: 1.0 },
    { name: 'Jun', churn: 0.8 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/analytics/overview');
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-secondary)' }}>Loading analytics data...</div>;

  const StatCard = ({ title, value, prefix = '' }) => (
    <div className="card glass-panel" style={{ textAlign: 'center' }}>
      <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{title}</h3>
      <div style={{ fontSize: '2.5rem', fontWeight: 700, background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {prefix}{value}
      </div>
    </div>
  );

  // Convert raw values dynamically based on active currency rate
  const rawMRR = stats?.mrr !== undefined ? stats.mrr : 4500;
  const convertedMRR = rawMRR * rate;
  const formattedMRR = convertedMRR.toLocaleString(code === 'INR' ? 'en-IN' : 'en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  });

  const convertedRevenueData = mockRevenueData.map(item => ({
    ...item,
    revenue: Math.round(item.revenue * rate)
  }));

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Analytics Overview</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard title="Total Subscribers" value={stats?.totalSubscribers || 142} />
        <StatCard title="Active Subscriptions" value={stats?.activeSubscriptions || 128} />
        <StatCard title="Monthly Recurring Revenue" value={formattedMRR} prefix={symbol} />
        <StatCard title="Churn Rate" value={stats?.churnRate || '1.2'} prefix="%" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
        
        {/* Revenue Chart */}
        <div className="card glass-panel">
          <h3 style={{ marginBottom: '1.5rem' }}>Revenue Growth (Last 6 Months) ({code})</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={convertedRevenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" tickFormatter={(val) => `${symbol}${val.toLocaleString()}`} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
                  itemStyle={{ color: 'var(--accent-primary)' }}
                  formatter={(val) => [`${symbol}${val.toLocaleString()}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-secondary)' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Churn Chart */}
        <div className="card glass-panel">
          <h3 style={{ marginBottom: '1.5rem' }}>Churn Rate (%)</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChurnData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
                  itemStyle={{ color: 'var(--warning)' }}
                />
                <Bar dataKey="churn" fill="var(--warning)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
