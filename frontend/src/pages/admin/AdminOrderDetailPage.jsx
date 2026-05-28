import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import { useParams } from 'react-router-dom';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered'];

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/api/orders/admin/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data);
        setStatus(response.data.status || 'pending');
      } catch (err) {
        setError('Unable to load order.');
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await api.put(
        `/api/orders/admin/orders/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder(response.data);
      setMessage('Status updated successfully.');
    } catch (err) {
      setError('Unable to update order status.');
    }
  };

  if (!order) {
    return <div style={{ padding: 24 }}>{error || 'Loading order...'}</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>Order Details</h1>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      {message && <div style={{ color: 'green', marginBottom: 16 }}>{message}</div>}

      <div style={{ marginBottom: 24, padding: 18, borderRadius: 14, border: '1px solid #ddd', backgroundColor: '#fff' }}>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Customer:</strong> {order.userId?.username || 'N/A'} ({order.userId?.email || 'N/A'})</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h2>Items</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Product</th>
                <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Price</th>
                <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Quantity</th>
                <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.productId}>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{item.title}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>${item.price.toFixed(2)}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{item.quantity}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: 24, display: 'grid', gap: 14, padding: 18, border: '1px solid #ddd', borderRadius: 14, backgroundColor: '#fafafa' }}>
        <div>
          <h2 style={{ marginBottom: 12 }}>Shipping Address</h2>
          <p style={{ margin: '4px 0' }}><strong>Name:</strong> {order.shippingAddress.name}</p>
          <p style={{ margin: '4px 0' }}><strong>Street:</strong> {order.shippingAddress.street}</p>
          <p style={{ margin: '4px 0' }}><strong>City:</strong> {order.shippingAddress.city}</p>
          <p style={{ margin: '4px 0' }}><strong>State:</strong> {order.shippingAddress.state}</p>
          <p style={{ margin: '4px 0' }}><strong>Pincode:</strong> {order.shippingAddress.pincode}</p>
          <p style={{ margin: '4px 0' }}><strong>Phone:</strong> {order.shippingAddress.phone}</p>
        </div>
        <div>
          <label htmlFor="status" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Order Status</label>
          <select id="status" value={status} onChange={handleStatusChange} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #ccc' }}>
            {statusOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;
