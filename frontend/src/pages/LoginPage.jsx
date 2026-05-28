import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const tabs = [
  { label: 'Customer Sign In', key: 'customer-signin', color: 'teal' },
  { label: 'Customer Sign Up', key: 'customer-signup', color: '#00796b' },
  { label: 'Admin Login', key: 'admin-login', color: 'purple' },
];

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('customer-signin');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    resetForm();
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setError('');

    if (!username || !email) {
      setError('Username and email are required for customer sign in.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        email,
        role: 'user',
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed. Please check your credentials.');
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required for customer sign up.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed. Please try again.');
    }
  };

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username and password are required for admin login.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
        role: 'admin',
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed. Please check your credentials.');
    }
  };

  const renderInput = (id, label, type, value, onChange, placeholder, hint) => (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #bbb', backgroundColor: '#fafafa' }}
      />
      {hint && <div style={{ marginTop: 6, fontSize: 12, color: '#666' }}>{hint}</div>}
    </div>
  );

  return (
    <div className="auth-shell">
      <div className="auth-card page-slide-in">
        <h1 style={{ textAlign: 'center', marginBottom: 16 }}>Petal and Pearls</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTabChange(tab.key)}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 10,
              border: activeTab === tab.key ? `2px solid ${tab.color}` : '1px solid #ccc',
              backgroundColor: activeTab === tab.key ? tab.color : '#f7f7f7',
              color: activeTab === tab.key ? '#fff' : '#333',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={activeTab === 'customer-signin' ? handleSignIn : activeTab === 'customer-signup' ? handleSignUp : handleAdminLogin}>
        {renderInput(
          'username',
          'Username',
          'text',
          username,
          (e) => setUsername(e.target.value),
          'Enter your username',
          activeTab === 'customer-signup' ? 'Create a unique username for your account.' : 'Your registered username.'
        )}

        {(activeTab === 'customer-signin' || activeTab === 'customer-signup') && renderInput(
          'email',
          'Email',
          'email',
          email,
          (e) => setEmail(e.target.value),
          'Enter your email',
          activeTab === 'customer-signin' ? 'Use the email you signed up with.' : 'We will send order updates to this email.'
        )}

        {(activeTab === 'customer-signup' || activeTab === 'admin-login') && renderInput(
          'password',
          'Password',
          'password',
          password,
          (e) => setPassword(e.target.value),
          activeTab === 'customer-signup' ? 'Create a strong password' : 'Enter your admin password',
          activeTab === 'customer-signup' ? 'At least 8 characters, with letters and numbers.' : null
        )}

        {activeTab === 'customer-signup' && renderInput(
          'confirmPassword',
          'Confirm Password',
          'password',
          confirmPassword,
          (e) => setConfirmPassword(e.target.value),
          'Repeat your password',
          'Make sure both passwords match.'
        )}

        {error && (
          <div style={{ marginBottom: 16, color: '#d32f2f', fontWeight: 600 }}>{error}</div>
        )}

        <button
          type="submit"
          style={{
            width: '100%',
            padding: 14,
            borderRadius: 12,
            border: 'none',
            backgroundColor: '#ff8ba0',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {activeTab === 'customer-signin' && 'Sign In'}
          {activeTab === 'customer-signup' && 'Sign Up'}
          {activeTab === 'admin-login' && 'Admin Sign In'}
        </button>
      </form>
      </div>
    </div>
  );
};

export default LoginPage;
