import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  return imageUrl.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`;
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProduct(response.data);
      } catch (err) {
        setError('Unable to load product details.');
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart({
        productId: product._id,
        title: product.title,
        price: product.price,
        imageUrl: getFullImageUrl(product.imageUrl),
        quantity,
      });
      navigate('/cart');
    }
  };

  if (!product) {
    return <div style={{ padding: 24 }}>{error || 'Loading product...'}</div>;
  }

  return (
    <div className="product-detail-shell" style={{ maxWidth: 980, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 32, alignItems: 'start' }}>
        <img
          src={getFullImageUrl(product.imageUrl)}
          alt={product.title}
          className="product-detail-image"
        />

        <div>
          <span className="pill-badge">{product.category || 'Featured'}</span>
          <h1 className="section-title" style={{ marginTop: 16 }}>{product.title}</h1>
          <p className="section-subtitle">{product.description}</p>
          <div style={{ margin: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, color: '#7d5c6d' }}>Price</p>
              <p style={{ fontSize: 32, fontWeight: 800, margin: '8px 0 0', color: '#c72e5d' }}>₹{product.price.toFixed(2)}</p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#7d5c6d' }}>Stock</p>
              <p style={{ margin: '8px 0 0', fontWeight: 700 }}>{product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
            <label htmlFor="quantity" style={{ fontWeight: 700, color: '#5b3a48' }}>Quantity</label>
            <input
              id="quantity"
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
              className="input-pill"
              style={{ width: 120 }}
            />
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="primary-btn"
            style={{ width: '100%', opacity: product.stock === 0 ? 0.6 : 1 }}
          >
            Add to Cart
          </button>
          {error && <div style={{ color: '#b00020', marginTop: 18 }}>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
