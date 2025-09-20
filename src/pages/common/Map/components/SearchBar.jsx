// src/pages/common/Map/components/SearchBar.jsx
import React from "react";
import "./SearchBar.css";

function SearchBar({
  searchQuery,
  onSearchChange,
  onSearch,
  onKeyPress,
  services,
  selectedService,
  onServiceFilter
}) {
  return (
    <div className="map-top-bar">
      <div className="service-filter-buttons">
        {services.map((s) => (
          <button
            key={s.id === null ? "all" : s.id}
            className={`pill-btn ${selectedService === s.id ? "active" : ""}`}
            onClick={() => onServiceFilter(s.id)}
          >
            {s.icon} <span>{s.name}</span>
          </button>
        ))}
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="지역, 업체명을 검색하세요"
          value={searchQuery}
          onChange={onSearchChange}
          onKeyDown={onKeyPress}
        />
        <button
          className="search-btn"
          onClick={() => onSearch(searchQuery)} 
        >
          검색
        </button>
      </div>
      
    </div>
  );
}

export default SearchBar;
