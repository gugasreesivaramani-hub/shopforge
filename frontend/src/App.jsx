import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductListingPage from './pages/shop/ProductListingPage';
import ProductDetailPage from './pages/shop/ProductDetailPage';
import CartPage from './pages/shop/CartPage';
import CheckoutPage from './pages/shop/CheckoutPage';
import OrderHistoryPage from './pages/shop/OrderHistoryPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import AddProductPage from './pages/admin/AddProductPage';
import EditProductPage from './pages/admin/EditProductPage';
import OrdersListPage from './pages/admin/OrdersListPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import CreateAdminPage from './pages/admin/CreateAdminPage';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();
  const hideSidebar = location.pathname === '/' || location.pathname === '/register';

  return (
    <div className={hideSidebar ? 'app-shell app-shell--no-sidebar' : 'app-shell'}>
      {!hideSidebar && (
        <aside className="app-sidebar">
          <div className="sidebar-brand">
            <h2>Petal & Pearls</h2>
          </div>
          <nav className="sidebar-section">
            <h3>General</h3>
            <NavLink to="/" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Home</NavLink>
            <NavLink to="/register" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Register</NavLink>
          </nav>
          <nav className="sidebar-section">
            <h3>User</h3>
            <NavLink to="/shop" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Shop</NavLink>
            <NavLink to="/cart" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Cart</NavLink>
            <NavLink to="/orders" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Orders</NavLink>
          </nav>
          <nav className="sidebar-section">
            <h3>Admin</h3>
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Admin Dashboard</NavLink>
            <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Products</NavLink>
            <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Orders</NavLink>
            <NavLink to="/admin/create-admin" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Create Admin</NavLink>
          </nav>
        </aside>
      )}

      <main className="app-main">
        <div className="page-shell">
          <header className="page-header">
            <div>
              <h1 className="brand-title">Petal and Pearls</h1>
              <p className="brand-subtitle">Unique accessories that tell a story.</p>
            </div>
          </header>

          <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />

            <Route
              path='/shop'
              element={<ProtectedRoute role='user'><ProductListingPage /></ProtectedRoute>}
            />
            <Route
              path='/shop/product/:id'
              element={<ProtectedRoute role='user'><ProductDetailPage /></ProtectedRoute>}
            />
            <Route
              path='/cart'
              element={<ProtectedRoute role='user'><CartPage /></ProtectedRoute>}
            />
            <Route
              path='/checkout'
              element={<ProtectedRoute role='user'><CheckoutPage /></ProtectedRoute>}
            />
            <Route
              path='/orders'
              element={<ProtectedRoute role='user'><OrderHistoryPage /></ProtectedRoute>}
            />

            <Route
              path='/admin'
              element={<ProtectedRoute role='admin'><AdminDashboardPage /></ProtectedRoute>}
            />
            <Route
              path='/admin/products'
              element={<ProtectedRoute role='admin'><ProductManagementPage /></ProtectedRoute>}
            />
            <Route
              path='/admin/products/new'
              element={<ProtectedRoute role='admin'><AddProductPage /></ProtectedRoute>}
            />
            <Route
              path='/admin/products/edit/:id'
              element={<ProtectedRoute role='admin'><EditProductPage /></ProtectedRoute>}
            />
            <Route
              path='/admin/create-admin'
              element={<ProtectedRoute role='admin'><CreateAdminPage /></ProtectedRoute>}
            />
            <Route
              path='/admin/orders'
              element={<ProtectedRoute role='admin'><OrdersListPage /></ProtectedRoute>}
            />
            <Route
              path='/admin/orders/:id'
              element={<ProtectedRoute role='admin'><AdminOrderDetailPage /></ProtectedRoute>}
            />
          </Routes>
        </div>
      </main>
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
