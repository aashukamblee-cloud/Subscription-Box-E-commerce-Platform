import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import ProtectedRoute from './components/routing/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import SubscriptionManager from './pages/dashboard/SubscriptionManager';
import Preferences from './pages/dashboard/Preferences';
import Billing from './pages/dashboard/Billing';
import Checkout from './pages/Checkout';
import ProductManager from './pages/admin/ProductManager';
import BoxBuilder from './pages/admin/BoxBuilder';
import Shipments from './pages/dashboard/Shipments';
import ShipmentManager from './pages/admin/ShipmentManager';
import Analytics from './pages/admin/Analytics';
import Segmentation from './pages/admin/Segmentation';
import Scheduler from './pages/admin/Scheduler';
import Notifications from './pages/dashboard/Notifications';
import Users from './pages/admin/Users';
import OrderManager from './pages/admin/OrderManager';
import CartDrawer from './components/layout/CartDrawer';
import ProductDetailModal from './components/layout/ProductDetailModal';
import AIAssistant from './components/layout/AIAssistant';
import Footer from './components/layout/Footer';

function AppContent() {
  const location = useLocation();
  const showFooter = !location.pathname.startsWith('/dashboard') && !location.pathname.startsWith('/admin');

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/plans" element={<Pricing />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Customer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['customer', 'operator', 'superadmin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/subscriptions" element={<SubscriptionManager />} />
              <Route path="/dashboard/billing" element={<Billing />} />
              <Route path="/dashboard/shipments" element={<Shipments />} />
              <Route path="/dashboard/notifications" element={<Notifications />} />
              <Route path="/dashboard/settings" element={<Preferences />} />
              
              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['operator', 'superadmin']} />}>
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/segments" element={<Segmentation />} />
                <Route path="/admin/orders" element={<OrderManager />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/products" element={<ProductManager />} />
                <Route path="/admin/boxes" element={<BoxBuilder />} />
                <Route path="/admin/shipments" element={<ShipmentManager />} />
                <Route path="/admin/scheduler" element={<Scheduler />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </main>
      {showFooter && <Footer />}
      <CartDrawer />
      <ProductDetailModal />
      <AIAssistant />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
