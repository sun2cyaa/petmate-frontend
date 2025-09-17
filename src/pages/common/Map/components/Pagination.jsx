// src/pages/common/Map/components/Pagination.jsx
import React from "react";
import "./Pagination.css";

function Pagination({
  currentPage,
  totalPages,
  onPageChange
}) {
  return (
    <div className="pagination-container">
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNum) => (
            <button
              key={pageNum}
              className={`page-btn ${
                currentPage === pageNum ? "active" : ""
              }`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          )
        )}

        <button
          className="page-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default Pagination;