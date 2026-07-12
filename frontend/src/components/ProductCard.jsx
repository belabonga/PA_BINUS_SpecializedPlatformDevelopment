import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';

export default function ProductCard({ product }) {
  const [isLoading, setIsLoading] = useState(false);
  const firstSize = product.sizes?.[0] || 'All Size';

  const refreshNavbar = () => {
    window.dispatchEvent(new Event('store-updated'));
  };

  const showToast = (message, type = 'success') => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type } }));
  };

  const addToCart = async () => {
    try {
      setIsLoading(true);
      await api.post('/cart', { productId: product._id, size: firstSize, quantity: 1 });
      showToast(`${product.name} added to bag.`);
      refreshNavbar();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to add product to bag.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async () => {
    try {
      setIsLoading(true);
      await api.post('/wishlist', { productId: product._id });
      showToast(`${product.name} added to wishlist.`);
      refreshNavbar();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to add product to wishlist.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} className="product-image-wrap">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
        {product.stock <= 10 && <span className="stock-badge">Low Stock</span>}
      </Link>

      <button className="wishlist-button" type="button" onClick={addToWishlist} aria-label="Add to wishlist">
        ♡
      </button>

      <div className="product-info">
        <p className="product-brand">{product.brand}</p>
        <Link to={`/products/${product._id}`} className="product-name">{product.name}</Link>
        <p className="product-category">{product.category} · {product.gender}</p>

        <div className="price-row">
          <span className="product-price">Rp {Number(product.price).toLocaleString('id-ID')}</span>
          {product.originalPrice > product.price && (
            <span className="original-price">Rp {Number(product.originalPrice).toLocaleString('id-ID')}</span>
          )}
        </div>

        <p className="product-meta">★ {product.rating} · {product.soldCount} sold</p>

        <button className="add-cart-button" type="button" onClick={addToCart} disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add to Bag'}
        </button>
      </div>
    </article>
  );
}
