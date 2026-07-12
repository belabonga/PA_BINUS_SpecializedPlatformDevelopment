import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import Loading from '../components/Loading.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const refreshNavbar = () => window.dispatchEvent(new Event('store-updated'));

  const showToast = (toastMessage, type = 'success') => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: toastMessage, type } }));
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.data);
        setSelectedSize(response.data.data.sizes?.[0] || 'All Size');
      } catch (error) {
        setMessage('Product not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    try {
      await api.post('/cart', { productId: product._id, size: selectedSize, quantity });
      showToast(`${product.name} added to bag.`);
      refreshNavbar();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to add product to bag.', 'error');
    }
  };

  const addToWishlist = async () => {
    try {
      await api.post('/wishlist', { productId: product._id });
      showToast(`${product.name} added to wishlist.`);
      refreshNavbar();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to add product to wishlist.', 'error');
    }
  };

  if (loading) return <Loading />;

  if (!product) {
    return (
      <section className="page-section">
        <div className="alert">{message}</div>
        <Link to="/products" className="btn-primary">Back to Products</Link>
      </section>
    );
  }

  return (
    <section className="detail-page">
      <div className="detail-grid">
        <div className="detail-gallery">
          <img src={product.imageUrl} alt={product.name} />
        </div>

        <div className="detail-info">
          <p className="product-brand">{product.brand}</p>
          <h1>{product.name}</h1>

          <div className="price-row detail-price-row">
            <span className="detail-price">Rp {Number(product.price).toLocaleString('id-ID')}</span>
            {product.originalPrice > product.price && (
              <span className="original-price">Rp {Number(product.originalPrice).toLocaleString('id-ID')}</span>
            )}
          </div>

          <p className="detail-rating">★ {product.rating} · {product.soldCount} sold · {product.category} · {product.gender}</p>

          <div className="detail-divider" />

          <p className="detail-description">{product.description}</p>
          <p className="detail-material">Material: {product.material}</p>

          <div className="size-picker">
            <div>
              <strong>Select Size</strong>
              <span>{product.sizes?.length || 0} options available</span>
            </div>

            <div className="size-grid">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={selectedSize === size ? 'selected-size' : ''}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="quantity-box">
            <strong>Quantity</strong>
            <div>
              <button type="button" onClick={() => setQuantity(Math.max(quantity - 1, 1))}>-</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <div className="detail-stock">
            <span>Stock</span>
            <strong>{product.stock} items available</strong>
          </div>

          <div className="detail-buttons">
            <button className="btn-primary full" type="button" onClick={addToCart}>Add to Bag</button>
            <button className="btn-outline full" type="button" onClick={addToWishlist}>♡ Add to Wishlist</button>
          </div>

          <div className="service-box">
            <p><strong>Delivery & Return</strong></p>
            <p>Free shipping for selected items. 30 days easy return available for eligible products.</p>
          </div>

          <Link to="/products" className="back-link">← Back to product list</Link>
        </div>
      </div>
    </section>
  );
}
