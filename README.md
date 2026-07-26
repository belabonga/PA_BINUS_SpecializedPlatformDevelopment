# SHAN Fashion Store - Specialized Platform Development - Personal Assignment 1

## Shania M - NIM 2802638860 - BINUS ONLINE

## 1. Deskripsi Project

SHAN Fashion Store adalah aplikasi web toko online sederhana yang dibuat untuk memenuhi Personal Assignment 1 mata kuliah Specialized Platform Development.

Aplikasi ini dibuat dari sudut pandang user e-commerce, bukan admin dashboard. Oleh karena itu, produk tidak dibuat dari halaman frontend. Produk dimasukkan terlebih dahulu ke MongoDB melalui proses seeding. User kemudian dapat melihat daftar produk, memfilter produk, melihat detail produk, menambahkan produk ke keranjang, menambahkan produk ke wishlist, mengubah jumlah produk di keranjang, menghapus produk dari keranjang/wishlist, login/register, dan lanjut ke halaman payment.

## 2. Pemaknaan CRUD dalam Project

| CRUD   | Implementasi                                                         |
| ------ | -------------------------------------------------------------------- |
| Create | Menambahkan produk ke Cart atau Wishlist                             |
| Read   | Menampilkan daftar produk, detail produk, isi Cart, dan isi Wishlist |
| Update | Mengubah quantity atau size produk di Cart                           |
| Delete | Menghapus produk dari Cart atau Wishlist                             |

Catatan: Produk tidak dibuat dari frontend karena aplikasi ini adalah website untuk user. Data produk dibuat melalui `npm run seed` dan disimpan di MongoDB.

## 3. Teknologi yang Digunakan

### Frontend

- React
- React Router DOM
- Axios
- Vite 4.5.3
- CSS Grid dan Flexbox

### Backend

- Node.js 16
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

### Database

- MongoDB Atlas atau MongoDB lokal

## 4. Fitur Aplikasi

### User Interface

- Zalora-inspired fashion e-commerce layout
- Simple fashion UI dengan palette:
  - #cda48b
  - #756c67
  - #252628
  - #505152
  - #ebe4df
- Navbar dengan global search bar
- Icon sederhana untuk wishlist, cart, search, dan success notification
- Toast popup saat berhasil add to cart atau wishlist
- Product image menggunakan foto fashion relevan dari Unsplash

### Product

- 96 seeded products
- Banyak brand
- Banyak kategori
- Gender: Women, Men, All
- Size: S, M, L, XL, All Size, dan size sepatu
- Price range variatif
- Product list dengan pagination
- Show 10 / 20 / 50 products
- Filter by search, category, brand, gender, size, min price, max price
- Sort by latest, popular, rating, price low to high, price high to low

### Cart

- Add to cart
- Read cart
- Update quantity
- Update size
- Delete cart item
- Continue to payment

### Wishlist

- Add to wishlist
- Read wishlist
- Remove wishlist item
- Add item from wishlist to cart

### Authentication

- Register
- Login
- JWT authentication
- Payment page protected
- User tidak bisa masuk ke halaman payment jika belum login

### Payment

- Protected payment page
- Shipping address form
- Payment method selection
- Order summary
- Create payment order
- Cart cleared after order created

## 5. Struktur Folder

```txt
personal_assignment_SPD/
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── server.js
│   ├── seed.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── wishlistController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── CartItem.js
│   │   ├── WishlistItem.js
│   │   ├── User.js
│   │   └── Order.js
│   └── routes/
│       ├── authRoutes.js
│       ├── productRoutes.js
│       ├── cartRoutes.js
│       ├── wishlistRoutes.js
│       └── orderRoutes.js
└── frontend/
    ├── package.json
    ├── .env.example
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── styles.css
        ├── api/
        │   └── axios.js
        ├── utils/
        │   └── auth.js
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Toast.jsx
        │   ├── ProductCard.jsx
        │   ├── ProductFilters.jsx
        │   ├── Pagination.jsx
        │   └── Loading.jsx
        └── pages/
            ├── Home.jsx
            ├── ProductList.jsx
            ├── ProductDetail.jsx
            ├── Wishlist.jsx
            ├── Cart.jsx
            ├── Login.jsx
            ├── Register.jsx
            └── Payment.jsx
```

## 6. Cara Connect + Setup MongoDB

### Opsi 1: Buat MongoDB Atlas Sendiri

1. Buka MongoDB Atlas.
2. Buat project baru.
3. Buat cluster.
4. Buat database user.
5. Masuk Network Access.
6. Tambahkan IP address atau untuk development gunakan:
   ```txt
   0.0.0.0/0
   ```
7. Copy connection string.

Contoh connection string:

```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/youprojectname?retryWrites=true&w=majority
```

Jika password memiliki karakter khusus seperti `@`, ubah menjadi URL encoded.

Contoh:

```txt
Shan@123 -> Shan%40123
```

### Opsi 2: MongoDB Lokal

Jika menggunakan MongoDB lokal:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/spd_final_user_store
```

## 7. Cara Menjalankan Backend

Masuk folder backend:

```bash
cd backend
npm install
```

Buat file `.env`:

```bash
cp .env.example .env
```

Jika memakai MongoDB Atlas, ganti `MONGODB_URI` dengan connection string Atlas milik anda.

Jalankan seeding produk:

```bash
npm run seed
```

Jalankan backend:

```bash
npm run dev
```

## 8. Cara Menjalankan Frontend

Masuk folder frontend:

```bash
cd frontend
npm install
```

Buat file `.env`:

```bash
cp .env.example .env
```

Jalankan frontend:

```bash
npm run dev
```

Buka:

```txt
http://localhost:5173
```

## 9. API Endpoints

### Auth

| Method | Endpoint             | Fungsi                    |
| ------ | -------------------- | ------------------------- |
| POST   | `/api/auth/register` | Register user             |
| POST   | `/api/auth/login`    | Login user                |
| GET    | `/api/auth/me`       | Mengambil data user login |

### Products

| Method | Endpoint             | Fungsi                                              |
| ------ | -------------------- | --------------------------------------------------- |
| GET    | `/api/products`      | Mengambil daftar produk                             |
| GET    | `/api/products/meta` | Mengambil data filter category, brand, gender, size |
| GET    | `/api/products/:id`  | Mengambil detail produk                             |

Query filter:

```txt
/api/products?search=bag&category=Bags&brand=SHAN&gender=Women&size=All Size&minPrice=100000&maxPrice=500000&sort=price-asc&page=1&limit=10
```

### Cart

| Method | Endpoint        | Fungsi                              |
| ------ | --------------- | ----------------------------------- |
| GET    | `/api/cart`     | Read isi keranjang                  |
| POST   | `/api/cart`     | Create item cart                    |
| PATCH  | `/api/cart/:id` | Update quantity atau size item cart |
| DELETE | `/api/cart/:id` | Delete item cart                    |
| DELETE | `/api/cart`     | Menghapus semua cart                |

### Wishlist

| Method | Endpoint                   | Fungsi               |
| ------ | -------------------------- | -------------------- |
| GET    | `/api/wishlist`            | Read wishlist        |
| POST   | `/api/wishlist`            | Create wishlist item |
| DELETE | `/api/wishlist/:productId` | Delete wishlist item |

### Orders / Payment

| Method | Endpoint                | Fungsi                |
| ------ | ----------------------- | --------------------- |
| POST   | `/api/orders`           | Membuat order payment |
| GET    | `/api/orders/my-orders` | Read order user login |

Endpoint order membutuhkan JWT token.

## 10. Kesimpulan

Project ini telah memenuhi requirement tugas:

- Frontend React memiliki halaman Beranda, Daftar Produk, Detail Produk, Wishlist, Cart, Login, Register, dan Payment.
- Navigasi menggunakan React Router.
- Layout produk menggunakan CSS Grid dan Flexbox.
- Backend menggunakan Node.js dan Express.js.
- RESTful API sudah menerapkan CRUD dalam konteks user e-commerce.
- Data produk disimpan dan diambil dari MongoDB.
- Frontend terintegrasi dengan backend menggunakan Axios.
- Sistem login/register menggunakan JWT.
- Payment page dilindungi sehingga user harus login terlebih dahulu sebelum melakukan pembayaran.
