import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import Loading from "../components/Loading.jsx";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const refreshNavbar = () => {
    window.dispatchEvent(new Event("store-updated"));
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cart");
      setItems(response.data.data);
      setSubtotal(response.data.subtotal);
      setMessage("");
      refreshNavbar();
    } catch (error) {
      setMessage("Failed to fetch cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    try {
      await api.patch(`/cart/${itemId}`, { quantity });
      fetchCart();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update quantity");
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      fetchCart();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove item");
    }
  };

  if (loading) return <Loading />;

  return (
    <section className="cart-page">
      <div className="page-header">
        <p className="eyebrow">Shopping Bag</p>
        <h1>Your Cart</h1>
        <p>
          This page reads cart data from backend API. Quantity update is the
          Update operation.
        </p>
      </div>

      {message && <div className="alert">{message}</div>}

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <p>Start adding products to your shopping bag.</p>
          <Link to="/products" className="btn-primary">
            Shop Products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {items.map((item) => (
              <article className="cart-item" key={item._id}>
                {/* CLICK IMAGE TO DETAIL */}
                <Link
                  to={`/products/${item.product._id}`}
                  className="cart-item-image-link"
                >
                  <img src={item.product.imageUrl} alt={item.product.name} />
                </Link>

                <div className="cart-item-info">
                  <p className="product-brand">{item.product.brand}</p>

                  {/* CLICK PRODUCT NAME TO DETAIL */}
                  <Link
                    to={`/products/${item.product._id}`}
                    className="cart-product-title"
                  >
                    <h3>{item.product.name}</h3>
                  </Link>

                  <p>Size: {item.size}</p>
                  <p>Rp {Number(item.product.price).toLocaleString("id-ID")}</p>

                  <div className="cart-actions-row">
                    <div className="quantity-control">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            Math.max(item.quantity - 1, 1)
                          )
                        }
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="text-button danger"
                      type="button"
                      onClick={() => removeItem(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="summary-card">
            <h3>Order Summary</h3>

            <div>
              <span>Subtotal</span>
              <strong>Rp {Number(subtotal).toLocaleString("id-ID")}</strong>
            </div>

            <div>
              <span>Shipping</span>
              <strong>Calculated later</strong>
            </div>

            <Link to="/payment" className="btn-primary full">
              Continue to Payment
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
