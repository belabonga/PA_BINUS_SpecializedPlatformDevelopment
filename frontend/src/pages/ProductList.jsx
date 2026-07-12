import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import Loading from '../components/Loading.jsx';
import Pagination from '../components/Pagination.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductFilters from '../components/ProductFilters.jsx';

const defaultFilters = {
  search: '',
  category: 'All',
  brand: 'All',
  gender: 'All',
  size: 'All',
  minPrice: '',
  maxPrice: '',
  sort: 'latest',
  page: 1,
  limit: 10
};

export default function ProductList() {
  const [searchParams] = useSearchParams();

  const getFiltersFromUrl = () => ({
    ...defaultFilters,
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All'
  });

  const [filters, setFilters] = useState(getFiltersFromUrl);
  const [meta, setMeta] = useState({ categories: [], brands: [], genders: [], sizes: [] });
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'All') params.append(key, value);
    });

    return params.toString();
  }, [filters]);

  const fetchMeta = async () => {
    try {
      const response = await api.get('/products/meta');
      setMeta(response.data.data);
    } catch (error) {
      setMessage('Failed to load product filters.');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products?${queryString}`);
      setProducts(response.data.data);
      setPagination({
        total: response.data.total,
        page: response.data.page,
        pages: response.data.pages,
        limit: response.data.limit
      });
      setMessage('');
    } catch (error) {
      setMessage('Failed to fetch products. Please check backend and MongoDB connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || current.category || 'All',
      page: 1
    }));
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [queryString]);

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const changePage = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const changeLimit = (newLimit) => {
    setFilters({ ...filters, limit: newLimit, page: 1 });
  };

  return (
    <section className="shop-page">
      <div className="shop-header">
        <div>
          <p className="eyebrow">Fashion Catalog</p>
          <h1>Shop New Arrivals</h1>
          <p>
            Product data is seeded into MongoDB. This page reads product data from the backend API
            and supports search, category, brand, gender, size, price range, sorting, and pagination.
          </p>
        </div>

        <div className="shop-count">
          <strong>{pagination.total}</strong>
          <span>Products</span>
        </div>
      </div>

      <div className="shop-layout">
        <ProductFilters filters={filters} meta={meta} onChange={setFilters} onReset={resetFilters} />

        <div className="shop-content">
          <div className="sort-bar">
            <span>{products.length} products shown</span>
            <select value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value, page: 1 })}>
              <option value="latest">Sort: Latest</option>
              <option value="popular">Sort: Popular</option>
              <option value="rating">Sort: Highest Rating</option>
              <option value="price-asc">Sort: Price Low to High</option>
              <option value="price-desc">Sort: Price High to Low</option>
            </select>
          </div>

          {message && <div className="alert">{message}</div>}
          {loading && <Loading />}

          {!loading && (
            <>
              <div className="zalora-product-grid">
                {products.map((product) => <ProductCard key={product._id} product={product} />)}
              </div>

              {products.length > 0 && (
                <Pagination
                  page={pagination.page}
                  pages={pagination.pages}
                  limit={pagination.limit}
                  total={pagination.total}
                  onPageChange={changePage}
                  onLimitChange={changeLimit}
                />
              )}
            </>
          )}

          {!loading && products.length === 0 && (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try changing your filter or search keyword.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
