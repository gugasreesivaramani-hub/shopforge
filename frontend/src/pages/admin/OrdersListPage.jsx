import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrdersListPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/orders/admin/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        setError('Unable to load orders.');
      }
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Orders</h1>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Order</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Customer</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Date</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Total</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                onClick={() => navigate(`/admin/orders/${order._id}`)}
                style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{order._id.slice(-6).toUpperCase()}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{order.userId?.username || 'N/A'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>${order.totalAmount.toFixed(2)}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersListPage;
