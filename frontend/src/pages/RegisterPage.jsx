import React, { useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/shop');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card page-slide-in" style={{ maxWidth: 420 }}>
        <h1>Petal and Pearls Sign Up</h1>
        <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: 8 }}>Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: 8 }}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 8 }}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: 8 }}>Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>

        {error && (
          <div style={{ marginBottom: 16, color: 'red' }}>{error}</div>
        )}

        <button
          type="submit"
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 14,
            border: 'none',
            backgroundColor: '#ff8ba0',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          Sign Up
        </button>
      </form>
      </div>
    </div>
  );
};

export default RegisterPage;
