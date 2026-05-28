import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/api/orders/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (err) {
        setError('Unable to load admin stats.');
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Dashboard</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 24 }}>
        <div style={{ padding: 20, borderRadius: 16, backgroundColor: '#e3f2fd' }}>
          <p style={{ margin: 0, color: '#1976d2' }}>Total Products</p>
          <h2 style={{ marginTop: 12 }}>{stats.totalProducts}</h2>
        </div>
        <div style={{ padding: 20, borderRadius: 16, backgroundColor: '#fff3e0' }}>
          <p style={{ margin: 0, color: '#ef6c00' }}>Total Orders</p>
          <h2 style={{ marginTop: 12 }}>{stats.totalOrders}</h2>
        </div>
        <div style={{ padding: 20, borderRadius: 16, backgroundColor: '#e8f5e9' }}>
          <p style={{ margin: 0, color: '#2e7d32' }}>Total Revenue</p>
          <h2 style={{ marginTop: 12 }}>${stats.totalRevenue.toFixed(2)}</h2>
        </div>
        <div style={{ padding: 20, borderRadius: 16, backgroundColor: '#fce4ec' }}>
          <p style={{ margin: 0, color: '#c2185b' }}>Pending Orders</p>
          <h2 style={{ marginTop: 12 }}>{stats.pendingOrders}</h2>
        </div>
      </div>

      <div style={{ marginTop: 32, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Link to="/admin/products" style={{ padding: '14px 22px', borderRadius: 12, backgroundColor: '#1976d2', color: '#fff', textDecoration: 'none' }}>
          Product Management
        </Link>
        <Link to="/admin/orders" style={{ padding: '14px 22px', borderRadius: 12, backgroundColor: '#388e3c', color: '#fff', textDecoration: 'none' }}>
          Orders Management
        </Link>
        <Link to="/admin/create-admin" style={{ padding: '14px 22px', borderRadius: 12, backgroundColor: '#6a1b9a', color: '#fff', textDecoration: 'none' }}>
          Create Admin Account
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
