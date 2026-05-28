import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../api';

const getFullImageUrl = (imageUrl) => {
  return getImageUrl(imageUrl);
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const imageUrl = getFullImageUrl(product.imageUrl);

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      title: product.title,
      price: product.price,
      imageUrl,
      quantity: 1,
    });
  };

  return (
    <div className="product-card">
      <img src={imageUrl} alt={product.title} />
      <div className="product-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <span className="pill-badge">{product.category || 'New'}</span>
          <span className="stock-pill">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
        </div>
        <Link to={`/shop/product/${product._id}`} style={{ textDecoration: 'none' }}>
          <h3>{product.title}</h3>
        </Link>
        <p>{product.description?.slice(0, 100)}{product.description?.length > 100 ? '…' : ''}</p>
        <div className="product-card-footer">
          <span className="price-tag">₹{product.price.toFixed(2)}</span>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="primary-btn"
            style={{ opacity: product.stock === 0 ? 0.55 : 1 }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
