import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="home-page">
      <section className="fashion-hero">
        <div className="hero-copy">
          <p className="eyebrow">Zalora-inspired User Store</p>
          <h1>Curated everyday style for modern shoppers.</h1>
          <p>
            Browse seeded fashion products, use filters, add items to wishlist,
            manage your shopping bag, and continue to protected payment after login.
          </p>

          <div className="hero-buttons">
            <Link to="/products" className="btn-primary">Shop Now</Link>
            <Link to="/register" className="btn-outline">Create Account</Link>
          </div>
        </div>

        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop"
            alt="Fashion editorial"
          />
          <div className="hero-floating-card">
            <span>CRUD</span>
            <strong>User</strong>
            <span>Cart & Wishlist</span>
          </div>
        </div>
      </section>

      <section className="category-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Shop by Category</p>
            <h2>Discover your favorite pieces</h2>
          </div>
        </div>

        <div className="category-grid">
          <Link to="/products?category=Clothing" className="category-card">
            <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=900&auto=format&fit=crop" alt="Clothing" />
            <div><span>Clothing</span><p>Shirts, dresses, pants</p></div>
          </Link>

          <Link to="/products?category=Shoes" className="category-card">
            <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=900&auto=format&fit=crop" alt="Shoes" />
            <div><span>Shoes</span><p>Sneakers, loafers, heels</p></div>
          </Link>

          <Link to="/products?category=Bags" className="category-card">
            <img src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=900&auto=format&fit=crop" alt="Bags" />
            <div><span>Bags</span><p>Tote, sling, shoulder bag</p></div>
          </Link>
        </div>
      </section>

      <section className="crud-info">
        <p className="eyebrow">Assignment CRUD Concept</p>
        <h2>CRUD is implemented as real user shopping actions.</h2>

        <div className="crud-grid">
          <div><strong>Create</strong><span>Add product to cart or wishlist</span></div>
          <div><strong>Read</strong><span>Read products, product detail, cart, and wishlist</span></div>
          <div><strong>Update</strong><span>Update cart quantity or selected size</span></div>
          <div><strong>Delete</strong><span>Remove item from cart or wishlist</span></div>
        </div>
      </section>
    </section>
  );
}
