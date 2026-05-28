import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProductPage = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!imageFile) {
      setError('Please select an image');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', product.title);
      formData.append('description', product.description);
      formData.append('price', Number(product.price));
      formData.append('category', product.category);
      formData.append('stock', Number(product.stock));
      formData.append('imageFile', imageFile);

      await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create product.');
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: '0 auto' }}>
      <h1>Add Product</h1>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
        <input name="title" value={product.title} onChange={handleChange} placeholder="Title" required style={{ padding: 12, borderRadius: 10, border: '1px solid #ccc' }} />
        <textarea name="description" value={product.description} onChange={handleChange} placeholder="Description" required rows={5} style={{ padding: 12, borderRadius: 10, border: '1px solid #ccc' }} />
        <input name="price" value={product.price} onChange={handleChange} type="number" placeholder="Price" required style={{ padding: 12, borderRadius: 10, border: '1px solid #ccc' }} />
        <input name="category" value={product.category} onChange={handleChange} placeholder="Category" required style={{ padding: 12, borderRadius: 10, border: '1px solid #ccc' }} />
        <input name="stock" value={product.stock} onChange={handleChange} type="number" placeholder="Stock" required style={{ padding: 12, borderRadius: 10, border: '1px solid #ccc' }} />
        
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} required style={{ padding: 12, borderRadius: 10, border: '1px solid #ccc', width: '100%' }} />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" style={{ marginTop: 12, maxWidth: 200, maxHeight: 200, borderRadius: 10 }} />
          )}
        </div>

        <button type="submit" style={{ padding: '14px 18px', borderRadius: 12, border: 'none', backgroundColor: '#1976d2', color: '#fff', cursor: 'pointer' }}>
          Create Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
