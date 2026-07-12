import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import Loading from '../components/Loading.jsx';
import { getUser } from '../utils/auth.js';

export default function Payment() {
  const user = getUser();

  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('');

  const refreshNavbar = () => window.dispatchEvent(new Event('store-updated'));

  const showToast = (toastMessage, type = 'success') => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: toastMessage, type } }));
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      setItems(response.data.data);
      setSubtotal(response.data.subtotal);
      setMessage('');
    } catch (error) {
      setMessage('Failed to fetch cart.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const shippingFee = subtotal >= 500000 ? 0 : 25000;
  const total = subtotal + shippingFee;

  const handlePayment = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post('/orders', {
        shippingAddress,
        paymentMethod
      });

      setOrder(response.data.data);
      setItems([]);
      setSubtotal(0);
      refreshNavbar();
      showToast('Payment order created successfully.');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to create order.', 'error');
    }
  };

  if (loading) return <Loading />;

  if (order) {
    return (
      <section className="payment-page">
        <div className="payment-success">
          <p className="eyebrow">Payment Created</p>
          <h1>Thank you for your order.</h1>
          <p>Your order has been created and is waiting for payment confirmation.</p>

          <div className="order-box">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> Rp {Number(order.total).toLocaleString('id-ID')}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          </div>

          <Link to="/products" className="btn-primary">Continue Shopping</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="payment-page">
      <div className="page-header">
        <p className="eyebrow">Protected Checkout</p>
        <h1>Payment</h1>
        <p>This page is protected. Users must login or register before accessing payment.</p>
      </div>

      {message && <div className="alert">{message}</div>}

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <p>Add products before continuing payment.</p>
          <Link to="/products" className="btn-primary">Shop Products</Link>
        </div>
      ) : (
        <div className="payment-layout">
          <form className="payment-form" onSubmit={handlePayment}>
            <h2>Shipping & Payment Details</h2>

            <label>Customer Name
              <input type="text" value={user?.fullName || ''} disabled />
            </label>

            <label>Email
              <input type="email" value={user?.email || ''} disabled />
            </label>

            <label>Shipping Address
              <textarea
                rows="4"
                value={shippingAddress}
                onChange={(event) => setShippingAddress(event.target.value)}
                required
              />
            </label>

            <label>Payment Method
              <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                <option>Bank Transfer</option>
                <option>Virtual Account</option>
                <option>Credit Card</option>
                <option>E-Wallet</option>
                <option>Cash on Delivery</option>
              </select>
            </label>

            <button className="btn-primary full" type="submit">Create Payment Order</button>
          </form>

          <aside className="payment-summary">
            <h2>Order Summary</h2>

            <div className="payment-items">
              {items.map((item) => (
                <div className="payment-item" key={item._id}>
                  <img src={item.product.imageUrl} alt={item.product.name} />
                  <div>
                    <strong>{item.product.name}</strong>
                    <span>{item.size} · Qty {item.quantity}</span>
                    <p>Rp {Number(item.product.price * item.quantity).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-card static">
              <div><span>Subtotal</span><strong>Rp {Number(subtotal).toLocaleString('id-ID')}</strong></div>
              <div><span>Shipping</span><strong>{shippingFee === 0 ? 'Free' : `Rp ${Number(shippingFee).toLocaleString('id-ID')}`}</strong></div>
              <div><span>Total</span><strong>Rp {Number(total).toLocaleString('id-ID')}</strong></div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
