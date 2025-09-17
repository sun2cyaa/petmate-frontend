import React from "react";
import "./CompanyDetailModal.css";

function CompanyDetailModal({ selectedCompany, services, onClose }) {
  if (!selectedCompany) return null;

  return (
    <div className={`company-detail-modal ${selectedCompany ? 'show' : ''}`}>
      <div className="modal-header">
        <button
          className="close-btn"
          onClick={onClose}
        >
          ×
        </button>
        <h2>{selectedCompany.name}</h2>
        <div className="company-rating">
          ❤️ 4.5 (리뷰 23개)
        </div>
      </div>

      <div className="modal-content">
        <div className="company-image-section">
          <div className="company-image-placeholder">
            📷 업체 사진
          </div>
        </div>

        <div className="company-info">
          <div className="info-section">
            <h4>기본 정보</h4>

            <div className="info-item">
              <span className="icon">📍</span>
              <div className="info-content">
                <div className="label">주소</div>
                <div className="value">{selectedCompany.roadAddr}</div>
              </div>
            </div>

            <div className="info-item">
              <span className="icon">📞</span>
              <div className="info-content">
                <div className="label">전화번호</div>
                <div className="value">{selectedCompany.tel}</div>
              </div>
            </div>

            <div className="info-item">
              <span className="icon">🐕</span>
              <div className="info-content">
                <div className="label">주요 서비스</div>
                <div className="value">
                  <span className="service-badge">
                    {services.find(s => s.id === selectedCompany.repService)?.name || '기타'}
                  </span>
                </div>
              </div>
            </div>

            <div className="info-item">
              <span className="icon">🕰️</span>
              <div className="info-content">
                <div className="label">영업시간</div>
                <div className="value">월-금 09:00-18:00</div>
              </div>
            </div>
          </div>

          {selectedCompany.description && (
            <div className="info-section">
              <h4>업체 소개</h4>
              <p className="description">{selectedCompany.description}</p>
            </div>
          )}

          <div className="info-section">
            <h4>리뷰</h4>
            <div className="review-item">
              <div className="review-header">
                <span className="reviewer">김★★</span>
                <span className="review-date">2024.01.15</span>
                <span className="review-rating">❤️❤️❤️❤️❤️</span>
              </div>
              <p className="review-text">친절하고 전문적인 서비스였습니다. 다음에도 이용하고 싶어요!</p>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn-call">
            📞 전화걸기
          </button>
          <button className="btn-directions">
            🗺️ 길찾기
          </button>
          <button className="btn-share">
            🔗 공유하기
          </button>
          <button className="btn-favorite">
            ❤️ 찜기
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetailModal;