import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useCart } from '../../context/CartContext';

const baseCategoryColors = ['#ffe6ea', '#ffd7dc', '#fff0d9', '#e8f0ff', '#ffe8f2', '#f7e6ff', '#fff0f0'];
const tagOptions = ['new', 'hot', 'sale'];
const categoryEmoji = {
  Clothing: '👗',
  Food: '🧁',
  Tech: '💻',
  Home: '🛋️',
};

const getFullImageUrl = (url) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `http://localhost:5000${url}`;
};

const getProductTag = (product) => {
  if (!product?.title) return 'new';
  return tagOptions[product.title.length % tagOptions.length];
};

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [visibleCategory, setVisibleCategory] = useState('All');
  const [likedMap, setLikedMap] = useState({});
  const [toast, setToast] = useState('');
  const [loaded, setLoaded] = useState(false);
  const { cart, addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data || []);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoaded(true);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(products.map((product) => product.category).filter(Boolean))
    );
    return ['All', ...unique];
  }, [products]);

  const categoryColors = useMemo(() => {
    const colors = { All: '#ffe6ea' };
    categories.slice(1).forEach((category, index) => {
      colors[category] = baseCategoryColors[index % baseCategoryColors.length];
    });
    return colors;
  }, [categories]);

  const filteredProducts = useMemo(
    () => products.filter((product) => {
      if (visibleCategory === 'All') return true;
      return product.category === visibleCategory;
    }),
    [products, visibleCategory]
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLike = (productId) => {
    setLikedMap((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleAddToCart = (product) => {
    addToCart({
      productId: product._id,
      title: product.title,
      price: product.price,
      imageUrl: getFullImageUrl(product.imageUrl) || '',
      quantity: 1,
    });
    setToast('Item added to cart!');
    window.setTimeout(() => setToast(''), 2000);
  };

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: 'linear-gradient(180deg, #fff2f5 0%, #ffe3e9 100%)' }}>
      <style>{`
        .shop-topbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; }
        .shop-title { margin: 0; font-size: clamp(1.8rem, 2.8vw, 2.6rem); letter-spacing: -0.04em; color: #542f39; }
        .cart-badge { display: inline-flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 999px; background: #fff0f4; color: #9f2c57; box-shadow: 0 10px 20px rgba(220, 125, 148, 0.16); font-weight: 700; }
        .category-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
        .category-pill { border: none; border-radius: 999px; padding: 12px 18px; color: #5a2f3f; font-weight: 700; cursor: pointer; transition: transform 0.2s ease, background 0.2s ease; }
        .category-pill:hover { transform: translateY(-1px); }
        .category-pill.active { box-shadow: 0 10px 20px rgba(255, 143, 152, 0.24); }
        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 22px; }
        .product-card { border-radius: 34px; overflow: hidden; box-shadow: 0 24px 64px rgba(51, 20, 31, 0.18); display: flex; flex-direction: column; animation: fadeUp 0.45s ease both; background: #1f1920; border: 1px solid rgba(255, 255, 255, 0.08); }
        .product-card:hover { transform: translateY(-2px); }
        .product-top { min-height: 210px; display: grid; place-items: center; position: relative; }
        .top-image { width: auto; height: 80%; object-fit: contain; }
        .fallback-icon { width: 100%; height: 100%; display: grid; place-items: center; font-size: 3rem; background: radial-gradient(circle at top left, #ffd7dc 0%, #ffedf0 70%); }
        .tag-pill { position: absolute; top: 16px; left: 16px; background: rgba(255, 255, 255, 0.92); color: #9f3151; padding: 6px 12px; border-radius: 999px; font-size: 0.78rem; font-weight: 800; text-transform: lowercase; letter-spacing: 0.08em; box-shadow: 0 8px 18px rgba(212, 146, 171, 0.18); }
        .heart-button { position: absolute; top: 16px; right: 16px; width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.22); background: rgba(255, 255, 255, 0.14); color: #fff; display: grid; place-items: center; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .heart-button:hover { transform: scale(1.05); }
        .heart-button.liked { color: #ffdce6; }
        .product-body { background: #1d1720; padding: 22px; display: flex; flex-direction: column; gap: 14px; min-height: 175px; }
        .product-name { margin: 0; font-size: 1.03rem; font-weight: 800; color: #ffffff; }
        .product-description { margin: 8px 0 0; color: #d3b7d0; font-size: 0.92rem; line-height: 1.5; min-height: 3rem; }
        .product-price { margin: 12px 0 0; color: #f7d9ea; font-size: 1rem; font-weight: 800; }
        .add-button { width: 100%; border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 999px; padding: 14px 0; background: transparent; color: #ffffff; font-weight: 700; cursor: pointer; display: inline-flex; justify-content: center; align-items: center; gap: 10px; transition: transform 0.2s ease, background 0.2s ease; }
        .add-button:hover { transform: translateY(-1px); background: rgba(255, 255, 255, 0.08); }
        .toast { position: fixed; bottom: 28px; right: 28px; padding: 14px 18px; border-radius: 18px; background: rgba(255, 139, 160, 0.96); color: white; box-shadow: 0 18px 38px rgba(186, 109, 127, 0.18); font-weight: 700; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 860px) { .shop-topbar { flex-direction: column; align-items: flex-start; } }
      `}</style>

      <div className="shop-topbar">
        <div>
          <h2 className="shop-title">Petal and Pearls</h2>
          <p style={{ margin: '8px 0 0', color: '#7d5c6d' }}>Unique accessories that tell a story.</p>
        </div>
        <div className="cart-badge">🛒 {cartCount} item{cartCount === 1 ? '' : 's'}</div>
      </div>

      <div className="category-row">
        {categories.map((name) => (
          <button
            key={name}
            type="button"
            className={`category-pill ${visibleCategory === name ? 'active' : ''}`}
            style={{ background: categoryColors[name] || '#fff0f4' }}
            onClick={() => setVisibleCategory(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filteredProducts.map((product, index) => {
          const imageUrl = getFullImageUrl(product.imageUrl);
          const liked = likedMap[product._id];
          const tag = getProductTag(product);
          const animationStyle = { animationDelay: `${index * 80}ms` };
          const emoji = categoryEmoji[product.category] || '🌸';

          return (
            <div className="product-card" key={product._id} style={animationStyle}>
              <div className="product-top" style={{ background: categoryColors[product.category] || '#f8e3e8' }}>
                {imageUrl ? (
                  <img className="top-image" src={imageUrl} alt={product.title} />
                ) : (
                  <div className="fallback-icon">{emoji}</div>
                )}
                <div className="tag-pill">{tag}</div>
                <button
                  type="button"
                  className={`heart-button ${liked ? 'liked' : ''}`}
                  onClick={() => handleLike(product._id)}
                >
                  {liked ? '❤️' : '🤍'}
                </button>
              </div>
              <div className="product-body">
                <div>
                  <p className="product-name">{product.title}</p>
                  <p className="product-description">
                    {product.description
                      ? `${product.description.slice(0, 72)}${product.description.length > 72 ? '…' : ''}`
                      : 'Authentic story-driven style.'}
                  </p>
                  <p className="product-price">₹{product.price.toFixed(2)}</p>
                </div>
                <button
                  type="button"
                  className="add-button"
                  onClick={() => handleAddToCart(product)}
                >
                  + Add to cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

export default ProductListingPage;
