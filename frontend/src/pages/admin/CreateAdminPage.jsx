import React, { useState } from 'react';
import { api } from '../../api';
import { useNavigate } from 'react-router-dom';

const CreateAdminPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields to create a new admin account.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await api.post(
        '/api/auth/register-admin',
        { username, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('New admin account created successfully. Redirecting...');
      setTimeout(() => navigate('/admin'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create admin account.');
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 24, backgroundColor: '#fff', borderRadius: 20, boxShadow: '0 14px 30px rgba(0,0,0,0.08)' }}>
      <h1 style={{ marginBottom: 16 }}>Create Admin Account</h1>
      <p style={{ marginBottom: 24, color: '#555' }}>
        Only logged in admins can create another admin. Complete the form below and click Create Admin.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="newAdminUsername" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Username</label>
          <input
            id="newAdminUsername"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter new admin username"
            required
            style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #ccc', backgroundColor: '#fbfbfb' }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="newAdminEmail" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Email</label>
          <input
            id="newAdminEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter new admin email"
            required
            style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #ccc', backgroundColor: '#fbfbfb' }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="newAdminPassword" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Password</label>
          <input
            id="newAdminPassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a secure password"
            required
            style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #ccc', backgroundColor: '#fbfbfb' }}
          />
          <div style={{ marginTop: 6, fontSize: 12, color: '#666' }}>
            Use at least 8 characters with letters and numbers.
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label htmlFor="newAdminConfirmPassword" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Confirm Password</label>
          <input
            id="newAdminConfirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm the password above"
            required
            style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #ccc', backgroundColor: '#fbfbfb' }}
          />
        </div>

        {error && <div style={{ marginBottom: 16, color: '#d32f2f', fontWeight: 600 }}>{error}</div>}
        {success && <div style={{ marginBottom: 16, color: '#2e7d32', fontWeight: 600 }}>{success}</div>}

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button type="submit" style={{ padding: '14px 22px', borderRadius: 12, backgroundColor: '#6a1b9a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
            Create Admin
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            style={{ padding: '14px 22px', borderRadius: 12, backgroundColor: '#ccc', color: '#333', border: 'none', cursor: 'pointer' }}
          >
            Back to Dashboard
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdminPage;
