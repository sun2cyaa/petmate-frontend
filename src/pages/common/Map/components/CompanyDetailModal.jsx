import React, { useState } from "react";
import "./CompanyDetailModal.css";
import reserved_white from "../../../../assets/images/map/reserved_white.png";

function CompanyDetailModal({ selectedCompany, services, onClose }) {
  const [activeTab, setActiveTab] = useState('home');

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
      </div>

      <div className="modal-content">
        <div className="company-image-section">
          <div className="company-image-placeholder">
            📷 업체 사진
          </div>
        </div>

        <div className="reservation-section">
          <a href="#none">
            <img src={reserved_white} alt="예약하기" />
            <span>예약하기</span>
          </a>
        </div>

        {/* 탭 네비게이션 */}
        <div className="tab-navigation">
          <a
            href="#none"
            className={`tab-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}
          >
            홈
          </a>
          <a
            href="#none"
            className={`tab-item ${activeTab === 'reservation' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('reservation'); }}
          >
            예약
          </a>
          <a
            href="#none"
            className={`tab-item ${activeTab === 'review' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('review'); }}
          >
            리뷰
          </a>
          <a
            href="#none"
            className={`tab-item ${activeTab === 'photo' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('photo'); }}
          >
            사진
          </a>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="tab-content">
          {activeTab === 'home' && (
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
            </div>
          )}

          {activeTab === 'reservation' && (
            <div className="reservation-content">
              <div className="info-section">
                <h4>예약 안내</h4>
                <p>전화 또는 온라인으로 예약 가능합니다.</p>
                <div className="reservation-info">
                  <div className="info-item">
                    <span className="icon">📞</span>
                    <div className="info-content">
                      <div className="label">전화 예약</div>
                      <div className="value">{selectedCompany.tel}</div>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="icon">🕰️</span>
                    <div className="info-content">
                      <div className="label">예약 가능 시간</div>
                      <div className="value">월-금 09:00-18:00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="review-content">
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
                <div className="review-item">
                  <div className="review-header">
                    <span className="reviewer">박★★</span>
                    <span className="review-date">2024.01.10</span>
                    <span className="review-rating">❤️❤️❤️❤️</span>
                  </div>
                  <p className="review-text">시설이 깨끗하고 직원분들이 친절해요!</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'photo' && (
            <div className="photo-content">
              <div className="info-section">
                <h4>사진</h4>
                <div className="photo-grid">
                  <div className="photo-item">📷 업체 외관</div>
                  <div className="photo-item">📷 내부 시설</div>
                  <div className="photo-item">📷 서비스 모습</div>
                  <div className="photo-item">📷 추가 사진</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyDetailModal;