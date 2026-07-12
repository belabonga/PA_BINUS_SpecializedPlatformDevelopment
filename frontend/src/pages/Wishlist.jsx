import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import Loading from "../components/Loading.jsx";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const refreshNavbar = () => {
    window.dispatchEvent(new Event("store-updated"));
  };

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await api.get("/wishlist");
      setItems(response.data.data);
      setMessage("");
      refreshNavbar();
    } catch (error) {
      setMessage("Failed to fetch wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      fetchWishlist();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove wishlist item");
    }
  };

  const addToCart = async (product) => {
    try {
      await api.post("/cart", {
        productId: product._id,
        size: product.sizes?.[0] || "One Size",
        quantity: 1,
      });

      setMessage("Product moved to bag.");
      refreshNavbar();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add product to bag");
    }
  };

  if (loading) return <Loading />;

  return (
    <section className="wishlist-page">
      <div className="page-header">
        <p className="eyebrow">Saved Items</p>
        <h1>Your Wishlist</h1>
        <p>
          This page reads wishlist data from backend API. Removing an item is
          the Delete operation.
        </p>
      </div>

      {message && <div className="success-message">{message}</div>}

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>Your wishlist is empty</h3>
          <p>Save products you like and view them here.</p>
          <Link to="/products" className="btn-primary">
            Shop Products
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {items.map((item) => (
            <article className="wishlist-card" key={item._id}>
              {/* CLICK IMAGE TO DETAIL */}
              <Link
                to={`/products/${item.product._id}`}
                className="wishlist-image-link"
              >
                <img src={item.product.imageUrl} alt={item.product.name} />
              </Link>

              <div>
                <p className="product-brand">{item.product.brand}</p>

                {/* CLICK PRODUCT NAME TO DETAIL */}
                <Link
                  to={`/products/${item.product._id}`}
                  className="wishlist-product-title"
                >
                  <h3>{item.product.name}</h3>
                </Link>

                <p>Rp {Number(item.product.price).toLocaleString("id-ID")}</p>

                <div className="wishlist-actions">
                  <button
                    className="btn-primary"
                    type="button"
                    onClick={() => addToCart(item.product)}
                  >
                    Add to Bag
                  </button>

                  <button
                    className="btn-outline"
                    type="button"
                    onClick={() => removeWishlist(item.product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
