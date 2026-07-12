import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { saveAuth } from '../utils/auth.js';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/payment';

  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const showToast = (toastMessage, type = 'success') => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: toastMessage, type } }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post('/auth/login', form);
      saveAuth(response.data.token, response.data.data);
      showToast('Login successful.');
      navigate(from);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Welcome Back</p>
        <h1>Login</h1>
        <p>Login is required before continuing to payment.</p>

        {message && <div className="alert">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>

          <label>Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>

          <button className="btn-primary full" type="submit">Login</button>
        </form>

        <p className="auth-switch">Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </section>
  );
}
