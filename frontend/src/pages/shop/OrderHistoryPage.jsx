import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statusColor = {
  pending: '#ffb300',
  processing: '#1976d2',
  shipped: '#0288d1',
  delivered: '#2e7d32',
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/orders/my', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError('Unable to fetch orders.');
      }
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>Order History</h1>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div style={{ display: 'grid', gap: 18 }}>
          {orders.map((order) => (
            <div key={order._id} style={{ padding: 18, borderRadius: 14, border: '1px solid #ddd', backgroundColor: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <p style={{ margin: 0, color: '#555' }}>{new Date(order.createdAt).toLocaleString()}</p>
                  <h2 style={{ margin: '8px 0 0' }}>Order #{order._id.slice(-6).toUpperCase()}</h2>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontWeight: 700 }}>₹{order.totalAmount.toFixed(2)}</span>
                  <span
                    style={{
                      padding: '6px 12px',
                      borderRadius: 999,
                      backgroundColor: statusColor[order.status] || '#999',
                      color: '#fff',
                      textTransform: 'capitalize',
                      fontSize: 12,
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
