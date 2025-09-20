// src/pages/common/Map/components/Pagination.jsx
import React from "react";
import "./Pagination.css";

function Pagination({
  currentPage,
  totalPages,
  onPageChange
}) {
  const pagesPerGroup = 3; // 한 번에 표시할 페이지 수
  const currentGroup = Math.ceil(currentPage / pagesPerGroup);
  const totalGroups = Math.ceil(totalPages / pagesPerGroup);

  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {currentGroup > 1 && (
          <button
            className="page-btn"
            onClick={() => onPageChange((currentGroup - 2) * pagesPerGroup + 1)}
          >
            &laquo;
          </button>
        )}

        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            className={`page-btn ${
              currentPage === pageNum ? "active" : ""
            }`}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </button>
        ))}

        <button
          className="page-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>

        {currentGroup < totalGroups && (
          <button
            className="page-btn"
            onClick={() => onPageChange(currentGroup * pagesPerGroup + 1)}
          >
            &raquo;
          </button>
        )}
      </div>
    </div>
  );
}

export default Pagination;