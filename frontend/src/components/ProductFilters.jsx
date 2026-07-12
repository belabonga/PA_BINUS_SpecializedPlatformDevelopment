import React from 'react';

export default function ProductFilters({ filters, meta, onChange, onReset }) {
  const update = (name, value) => {
    onChange({ ...filters, [name]: value, page: 1 });
  };

  return (
    <aside className="filter-panel">
      <div className="filter-title-row">
        <h3>Filters</h3>
        <button type="button" onClick={onReset}>Reset</button>
      </div>

      <div className="filter-block">
        <p>Search</p>
        <input
          className="filter-input"
          type="text"
          placeholder="Search product..."
          value={filters.search}
          onChange={(event) => update('search', event.target.value)}
        />
      </div>

      <div className="filter-block">
        <p>Category</p>
        <select value={filters.category} onChange={(event) => update('category', event.target.value)}>
          <option>All</option>
          {meta.categories.map((category) => <option key={category}>{category}</option>)}
        </select>
      </div>

      <div className="filter-block">
        <p>Brand</p>
        <select value={filters.brand} onChange={(event) => update('brand', event.target.value)}>
          <option>All</option>
          {meta.brands.map((brand) => <option key={brand}>{brand}</option>)}
        </select>
      </div>

      <div className="filter-block">
        <p>Gender</p>
        <select value={filters.gender} onChange={(event) => update('gender', event.target.value)}>
          <option>All</option>
          {meta.genders.map((gender) => <option key={gender}>{gender}</option>)}
        </select>
      </div>

      <div className="filter-block">
        <p>Size</p>
        <select value={filters.size} onChange={(event) => update('size', event.target.value)}>
          <option>All</option>
          {meta.sizes.map((size) => <option key={size}>{size}</option>)}
        </select>
      </div>

      <div className="filter-block">
        <p>Price Range</p>
        <input
          className="filter-input"
          type="number"
          placeholder="Min price"
          value={filters.minPrice}
          onChange={(event) => update('minPrice', event.target.value)}
        />
        <input
          className="filter-input"
          type="number"
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={(event) => update('maxPrice', event.target.value)}
        />
      </div>
    </aside>
  );
}
