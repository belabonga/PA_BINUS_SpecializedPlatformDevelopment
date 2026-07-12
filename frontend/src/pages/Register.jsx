import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { saveAuth } from '../utils/auth.js';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [message, setMessage] = useState('');

  const showToast = (toastMessage, type = 'success') => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: toastMessage, type } }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post('/auth/register', form);
      saveAuth(response.data.token, response.data.data);
      showToast('Registration successful.');
      navigate('/payment');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Register failed.');
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card wide">
        <p className="eyebrow">Create Account</p>
        <h1>Register</h1>
        <p>Create an account to continue checkout and payment.</p>

        {message && <div className="alert">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form grid-form">
          <label>Full Name
            <input
              type="text"
              value={form.fullName}
              onChange={(event) => setForm({ ...form, fullName: event.target.value })}
              required
            />
          </label>

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
              minLength="6"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>

          <label>Phone
            <input
              type="text"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
            />
          </label>

          <label className="full-field">Address
            <textarea
              rows="3"
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
            />
          </label>

          <button className="btn-primary full full-field" type="submit">Register</button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </section>
  );
}
