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

  // 프론트엔드 임시 표시 데이터
  const currentTime = new Date();
  const isBusinessHours = currentTime.getHours() >= 9 && currentTime.getHours() < 18;
  const randomRating = (4.0 + Math.random() * 1.0).toFixed(1);
  const randomReviewCount = Math.floor(Math.random() * 50) + 10;
  const estimatedDistance = Math.floor(Math.random() * 800) + 100;
  const distanceText = estimatedDistance > 1000
    ? `${(estimatedDistance / 1000).toFixed(1)}km`
    : `${estimatedDistance}m`;

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
          <span
            className={`business-status ${isBusinessHours ? "open" : "closed"}`}
          >
            {isBusinessHours ? "영업 중" : "영업 종료"}
          </span>
        </div>

        <div className="operating-info">
          <span className="operating-hours">
            {isBusinessHours ? "18:00에 영업 종료" : "09:00에 영업 시작"}
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