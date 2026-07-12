import React from 'react';

export default function Pagination({ page, pages, limit, total, onPageChange, onLimitChange }) {
  const pageNumbers = [];

  for (let index = 1; index <= pages; index += 1) {
    if (
      index === 1 ||
      index === pages ||
      Math.abs(index - page) <= 1
    ) {
      pageNumbers.push(index);
    }
  }

  const uniquePages = [...new Set(pageNumbers)];

  return (
    <div className="pagination-wrap">
      <div className="show-limit">
        <span>Show</span>
        <select value={limit} onChange={(event) => onLimitChange(Number(event.target.value))}>
          <option value={10}>10 products</option>
          <option value={20}>20 products</option>
          <option value={50}>50 products</option>
        </select>
        <span>from {total} products</span>
      </div>

      <div className="pagination">
        <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Prev
        </button>

        {uniquePages.map((number, index) => (
          <React.Fragment key={number}>
            {index > 0 && number - uniquePages[index - 1] > 1 && <span className="dots">...</span>}
            <button
              type="button"
              className={page === number ? 'active-page' : ''}
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          </React.Fragment>
        ))}

        <button type="button" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
