const mongoose = require("mongoose");

let cached = global.__mongooseCache;

if (!cached) {
  cached = global.__mongooseCache = {
    conn: null,
    promise: null,
  };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((mongooseInstance) => mongooseInstance.connection);
  }

  cached.conn = await cached.promise;

  console.log(`MongoDB connected: ${cached.conn.host}`);

  return cached.conn;
};

module.exports = connectDB;
