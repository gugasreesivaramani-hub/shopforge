import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { useCart } from '../../context/CartContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    paymentMethod: 'Cash on Delivery',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await api.post(
        '/api/orders',
        {
          items: cart,
          totalAmount,
          shippingAddress: {
            name: formData.name,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            phone: formData.phone,
          },
          paymentMethod: formData.paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gap: 12 }}>
          <label>Name</label>
          <input name="name" value={formData.name} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #ccc' }} />
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          <label>Street</label>
          <input name="street" value={formData.street} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #ccc' }} />
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          <label>City</label>
          <input name="city" value={formData.city} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #ccc' }} />
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          <label>State</label>
          <input name="state" value={formData.state} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #ccc' }} />
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          <label>Pincode</label>
          <input name="pincode" value={formData.pincode} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #ccc' }} />
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          <label>Phone</label>
          <input name="phone" value={formData.phone} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #ccc' }} />
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <label>Payment Method</label>
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} style={{ padding: 12, borderRadius: 8, border: '1px solid #ccc' }}>
            <option>Cash on Delivery</option>
            <option>Online</option>
          </select>
        </div>

        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 12, backgroundColor: '#f9f9f9' }}>
          <p style={{ margin: 0, color: '#555' }}>Order total:</p>
          <h2 style={{ margin: '8px 0 0' }}>₹{totalAmount.toFixed(2)}</h2>
        </div>

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          style={{ padding: '14px 24px', borderRadius: 10, border: 'none', backgroundColor: '#2e7d32', color: '#fff', cursor: 'pointer' }}
        >
          {submitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
