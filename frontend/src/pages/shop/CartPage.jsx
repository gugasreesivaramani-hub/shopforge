import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    return imageUrl.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`;
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart.length ? 49 : 0;
  const total = subtotal + deliveryFee;
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleConfirm = () => {
    navigate('/checkout');
  };

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: 'linear-gradient(180deg, #fff0f4 0%, #f2e6f3 100%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.1rem', color: '#3b2232' }}>Cart Review</h1>
            <p style={{ margin: '10px 0 0', color: '#6d5267' }}>Confirm the product amount, quantity, delivery and payment details before checkout.</p>
          </div>
          <div style={{ background: '#fff', padding: '16px 24px', borderRadius: 24, boxShadow: '0 16px 40px rgba(79, 29, 45, 0.08)', color: '#3b2232', fontWeight: 700 }}>
            {cart.length} item{cart.length === 1 ? '' : 's'} · {totalQuantity} piece{totalQuantity === 1 ? '' : 's'}
          </div>
        </div>

        {cart.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 30, padding: 32, textAlign: 'center', boxShadow: '0 18px 40px rgba(79, 29, 45, 0.08)' }}>
            <h2 style={{ margin: 0, color: '#3b2232' }}>Your cart is empty</h2>
            <p style={{ margin: '12px 0 0', color: '#7b5d70' }}>Add a product to begin your Petal and Pearls checkout experience.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.8fr', gap: 24 }}>
            <div style={{ display: 'grid', gap: 20 }}>
              {cart.map((item) => (
                <div key={item.productId} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 16, padding: 20, borderRadius: 28, background: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 14px 36px rgba(79, 29, 45, 0.08)' }}>
                  <img
                    src={getFullImageUrl(item.imageUrl)}
                    alt={item.title}
                    style={{ width: 110, height: 110, objectFit: 'cover', borderRadius: 22, background: '#fde9f0' }}
                  />
                  <div style={{ display: 'grid', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div>
                        <h2 style={{ margin: 0, fontSize: '1rem', color: '#382333' }}>{item.title}</h2>
                        <p style={{ margin: '8px 0 0', color: '#866a7f', fontSize: '0.95rem' }}>₹{item.price.toFixed(2)} each</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          style={{ padding: '8px 14px', borderRadius: 14, border: 'none', backgroundColor: '#f8d3e0', color: '#6b2f4c', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p style={{ margin: 0, color: '#7a5b73', fontSize: '0.92rem' }}>Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        style={{ width: 34, height: 34, borderRadius: 12, border: '1px solid #d7c0d1', background: '#fff', color: '#53354a', cursor: 'pointer' }}
                      >
                        -
                      </button>
                      <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 700, color: '#3b2232' }}>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        style={{ width: 34, height: 34, borderRadius: 12, border: '1px solid #d7c0d1', background: '#fff', color: '#53354a', cursor: 'pointer' }}
                      >
                        +
                      </button>
                      <span style={{ marginLeft: 'auto', color: '#7a5b73', fontSize: '0.9rem' }}>Qty</span>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ padding: 20, borderRadius: 28, background: '#fff', boxShadow: '0 16px 36px rgba(79, 29, 45, 0.08)' }}>
                  <p style={{ margin: 0, color: '#7a5b73' }}>Delivery</p>
                  <h3 style={{ margin: '8px 0 0', color: '#382333' }}>3-5 business days</h3>
                </div>
                <div style={{ padding: 20, borderRadius: 28, background: '#fff', boxShadow: '0 16px 36px rgba(79, 29, 45, 0.08)' }}>
                  <p style={{ margin: 0, color: '#7a5b73' }}>Confirm</p>
                  <h3 style={{ margin: '8px 0 0', color: '#382333' }}>Ready for payment</h3>
                </div>
              </div>
            </div>

            <aside style={{ background: '#201a20', color: '#fff', borderRadius: 32, padding: 28, display: 'grid', gap: 24, minHeight: 420 }}>
              <div>
                <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#d8b0ce', fontSize: '0.8rem' }}>Payment & delivery</p>
                <h2 style={{ margin: '12px 0 0', fontSize: '1.55rem' }}>Order summary</h2>
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                <label style={{ fontSize: '0.95rem', color: '#e6d7e6' }}>Payment method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: '100%', borderRadius: 18, border: '1px solid rgba(255,255,255,0.12)', padding: '14px 16px', background: 'rgba(255,255,255,0.06)', color: '#fff' }}
                >
                  <option>Cash on Delivery</option>
                  <option>Online Payment</option>
                </select>
              </div>

              <div style={{ padding: 18, borderRadius: 24, background: 'rgba(255,255,255,0.05)', display: 'grid', gap: 10 }}>
                <p style={{ margin: 0, color: '#d8b0ce' }}>Delivery details</p>
                <p style={{ margin: 0, color: '#f2e6f4' }}>Standard shipping to your address. Expect delivery within 3–5 business days.</p>
                <p style={{ margin: 0, color: '#f2e6f4' }}>Delivery fee ₹{deliveryFee.toFixed(2)}</p>
              </div>

              <div style={{ padding: 18, borderRadius: 24, background: 'rgba(255,255,255,0.08)', display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d6bed1' }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d6bed1' }}>
                  <span>Delivery fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                style={{ width: '100%', padding: '16px 0', borderRadius: 20, border: 'none', background: '#ffb1c2', color: '#201a20', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 16px 36px rgba(255, 177, 194, 0.3)' }}
              >
                Confirm and proceed
              </button>

              <p style={{ margin: 0, color: 'rgba(255,255,255,0.67)', fontSize: '0.95rem' }}>
                After confirming, you can complete payment and delivery address on the next screen.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
