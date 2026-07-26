const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : []),
];

app.use(
  cors({
    origin: function (origin, callback) {
      const isNetlifyApp =
        origin && /^https:\/\/.+\.netlify\.app$/.test(origin);

      if (!origin || allowedOrigins.includes(origin) || isNetlifyApp) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SHAN Fashion Store API is running",
    endpoints: {
      products: "/api/products",
      auth: "/api/auth",
      cart: "/api/cart",
      wishlist: "/api/wishlist",
      orders: "/api/orders",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API health check OK",
  });
});

function registerRoutes(prefix) {
  app.use(`${prefix}/products`, productRoutes);
  app.use(`${prefix}/cart`, cartRoutes);
  app.use(`${prefix}/wishlist`, wishlistRoutes);
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/orders`, orderRoutes);
}

// Untuk local Express biasa
registerRoutes("/api");

// Untuk Netlify Functions jika path internal masih kebaca sebagai /.netlify/functions/api
registerRoutes("/.netlify/functions/api");

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

module.exports = app;
