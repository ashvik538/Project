import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import './Admin.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', data.user.username);
        navigate('/admin');
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Cannot connect to authentication server. Check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container admin-login-wrapper">
      <div className="admin-glass-card admin-login-box">
        <div className="admin-login-header">
          <div className="admin-login-icon-badge">
            <FaShieldAlt />
          </div>
          <h2 className="admin-login-title">Admin Access</h2>
          <p className="admin-login-subtitle">Sign in to manage messages & system metrics</p>
        </div>

        {error && (
          <div className="admin-alert-banner admin-alert-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">Username</label>
            <div className="admin-input-wrapper">
              <input
                type="text"
                name="username"
                className="admin-input-field"
                placeholder="Enter admin username"
                value={credentials.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Password</label>
            <div className="admin-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="admin-input-field"
                placeholder="Enter password"
                value={credentials.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                className="admin-star-btn"
                style={{ position: 'absolute', right: '12px', color: '#94a3b8' }}
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="admin-primary-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>
      </div>
    </div>
  );
}
