import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    return imageUrl.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`;
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (err) {
      setError('Unable to load products.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (err) {
      setError('Unable to delete product.');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Product Management</h1>
        <button
          type="button"
          onClick={() => navigate('/admin/products/new')}
          style={{ padding: '12px 20px', borderRadius: 12, backgroundColor: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Add New Product
        </button>
      </div>

      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}

      <div style={{ overflowX: 'auto', marginTop: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Image</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Title</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Price</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Stock</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Category</th>
              <th style={{ padding: 12, borderBottom: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                  <img src={getFullImageUrl(product.imageUrl)} alt={product.title} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                </td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{product.title}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>${product.price.toFixed(2)}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{product.stock}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{product.category}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee', display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                    style={{ padding: '8px 14px', borderRadius: 10, border: 'none', backgroundColor: '#0288d1', color: '#fff', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product._id)}
                    style={{ padding: '8px 14px', borderRadius: 10, border: 'none', backgroundColor: '#d32f2f', color: '#fff', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagementPage;
