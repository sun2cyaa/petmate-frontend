// src/pages/common/Map/components/CompanyCard.jsx
import React from "react";
import "./CompanyCard.css";

function CompanyCard({
  company,
  index,
  isSelected,
  onClick,
  services,
  startIndex
}) {
  const globalIndex = startIndex + index;

  // 백엔드에서 계산된 데이터 직접 사용
  const randomRating = (4.0 + Math.random() * 1.0).toFixed(1);
  const randomReviewCount = Math.floor(Math.random() * 50) + 10;
  const distanceKm = company.distanceKm || 0;
  const distanceText = distanceKm >= 1 ? `${distanceKm.toFixed(1)}km` : `${Math.round(distanceKm * 1000)}m`;

  return (
    <div
      className={`company-card ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <div className="company-info">
        <div className="company-header">
          <div className="name-and-service">
            <h4 className="company-name">
              <span className="company-number">
                {globalIndex + 1}
              </span>
              {company.name}
            </h4>
            <span className="service-badge">
              {services.find((s) => s.id === company.repService)?.icon}
              <span>
                {services.find((s) => s.id === company.repService)?.name || "기타"}
              </span>
            </span>
          </div>
        </div>

        <div className="operating-info">
          <span className="operating-hours">
            {company.currentBusinessMessage || "영업시간 정보 없음"}
          </span>
          <span
            className={`business-status ${company.currentBusinessStatus === "영업중" ? "open" : "closed"}`}
            >
              {company.currentBusinessStatus || "정보없음"}
            </span>
        </div>

        <div className="review-info">
          <div className="rating">
            <span className="rating-stars">
              {"★".repeat(Math.floor(randomRating))}
              {"☆".repeat(5 - Math.floor(randomRating))}
            </span>
            <span className="rating-score">{randomRating}</span>
            <span className="review-count">리뷰 {randomReviewCount}개</span>
          </div>
        </div>

        <div className="address-info">
          <span className="distance">{distanceText}</span>
          <span className="address">{company.roadAddr}</span>
        </div>
      </div>
    </div>
  );
}

export default CompanyCard;