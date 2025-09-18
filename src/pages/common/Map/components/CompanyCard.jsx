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

  // 영업시간 처리
  const getOperatingHours = () => {
    if (!company.operatingHours) return null;

    try {
      const hours = typeof company.operatingHours === 'string'
        ? JSON.parse(company.operatingHours)
        : company.operatingHours;

      return hours;
    } catch (e) {
      console.error('영업시간 파싱 오류:', e);
      return null;
    }
  };

  // 현재 영업 상태 확인
  const getCurrentBusinessStatus = () => {
    const hours = getOperatingHours();
    if (!hours) return { status: "정보없음", message: "영업시간 정보 없음", isOpen: false };

    if (hours.allDay) {
      return { status: "영업중", message: "24시간 영업", isOpen: true };
    }

    if (hours.schedule) {
      const now = new Date();
      const today = now.getDay();
      const currentTime = now.getHours() * 100 + now.getMinutes();

      const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
      const todayName = dayNames[today];
      const todaySchedule = hours.schedule[todayName];

      if (!todaySchedule || todaySchedule.closed) {
        return { status: "휴무", message: "오늘 휴무", isOpen: false };
      }

      const openTime = parseInt(todaySchedule.open.replace(':', ''));
      const closeTime = parseInt(todaySchedule.close.replace(':', ''));

      if (currentTime >= openTime && currentTime < closeTime) {
        return {
          status: "영업중",
          message: `${todaySchedule.close}에 영업 종료`,
          isOpen: true
        };
      } else if (currentTime < openTime) {
        return {
          status: "영업전",
          message: `${todaySchedule.open}에 영업 시작`,
          isOpen: false
        };
      } else {
        return {
          status: "영업종료",
          message: "영업 종료",
          isOpen: false
        };
      }
    }

    return { status: "정보없음", message: "영업시간 정보 없음", isOpen: false };
  };

  // 프론트엔드 임시 표시 데이터
  const businessStatus = getCurrentBusinessStatus();
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
        </div>

        <div className="operating-info">
          <span className="operating-hours">
            {businessStatus.message}
          </span>
          <span
            className={`business-status ${businessStatus.isOpen ? "open" : "closed"}`}
            >
              {businessStatus.status}
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