import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { getUser, logout } from "../utils/auth.js";

export default function Navbar() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [user, setUser] = useState(getUser());

  const loadCounts = async () => {
    try {
      const [cartRes, wishlistRes] = await Promise.all([
        api.get("/cart"),
        api.get("/wishlist"),
      ]);

      const totalQty = cartRes.data.data.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCount(totalQty);
      setWishlistCount(wishlistRes.data.count);
    } catch (error) {
      setCartCount(0);
      setWishlistCount(0);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = keyword.trim();
    navigate(
      trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : "/products"
    );
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    window.dispatchEvent(
      new CustomEvent("show-toast", {
        detail: { message: "You have been logged out.", type: "success" },
      })
    );
    navigate("/");
  };

  useEffect(() => {
    loadCounts();

    const handleRefresh = () => loadCounts();
    const handleAuth = () => setUser(getUser());

    window.addEventListener("store-updated", handleRefresh);
    window.addEventListener("auth-updated", handleAuth);

    return () => {
      window.removeEventListener("store-updated", handleRefresh);
      window.removeEventListener("auth-updated", handleAuth);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="promo-strip">
        <span>FREE SHIPPING SELECTED ITEMS</span>
        <span>30 DAYS EASY RETURN</span>
        <span>NEW ARRIVALS EVERY WEEK</span>
      </div>

      <nav className="navbar">
        <Link to="/" className="brand-logo">
          SHAN
        </Link>

        <div className="nav-center">
          <div className="nav-menu">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Shop
            </NavLink>
            <NavLink
              to="/wishlist"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Wishlist
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Cart
            </NavLink>
          </div>

          <form className="global-search" onSubmit={handleSearch}>
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search fashion, brand, category..."
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>

        <div className="nav-actions">
          <Link to="/wishlist">♡ {wishlistCount}</Link>
          <Link to="/cart">Bag {cartCount}</Link>
          {user ? (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
