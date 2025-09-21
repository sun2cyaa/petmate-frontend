import React, { useState } from "react";
import "./CompanyDetailModal.css";
import reserved_white from "../../../../assets/images/map/reserved_white.png";
import mapmodal_home_img1 from "../../../../assets/images/map/mapmodal_home_img1.png";
import mapmodal_home_img2 from "../../../../assets/images/map/mapmodal_home_img2.png";
import mapmodal_home_img3 from "../../../../assets/images/map/mapmodal_home_img3.png";
import map_icon1 from "../../../../assets/images/map/map_icon1.png";
import map_icon2 from "../../../../assets/images/map/map_icon2.png";
import map_icon3 from "../../../../assets/images/map/map_icon3.png";
import map_icon4 from "../../../../assets/images/map/map_icon4.png";
import map_icon5 from "../../../../assets/images/map/map_icon5.png";
import map_icon6 from "../../../../assets/images/map/map_icon6.png";

// 이미지 URL 생성 헬퍼 함수
const getImageUrl = (filePath) => {
  if (!filePath) {
    console.log('❌ filePath가 없습니다:', filePath);
    return null;
  }

  console.log('📸 원본 filePath:', filePath);

  // 이미 완전한 URL인 경우
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    console.log('✅ 이미 완전한 URL:', filePath);
    return filePath;
  }

  // API 베이스 URL 가져오기
  const API_BASE = process.env.REACT_APP_SPRING_API_BASE || "http://localhost:8090";
  console.log('🌐 API_BASE:', API_BASE);

  // /img/ 경로를 /uploads/ 또는 실제 경로로 변경
  let cleanPath = filePath;
  if (cleanPath.startsWith('/img/')) {
    cleanPath = cleanPath.replace('/img/', '/uploads/');
    console.log('🔄 경로 변경: /img/ → /uploads/', cleanPath);
  }

  // 상대 경로인 경우 API 베이스 URL과 결합
  if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`;
  }

  const fullUrl = `${API_BASE}${cleanPath}`;
  console.log('🔗 최종 이미지 URL:', fullUrl);
  return fullUrl;
};

function CompanyDetailModal({ selectedCompany, onClose, onBookingClick }) {
  const [activeTab, setActiveTab] = useState('home');
  const [showFullSchedule, setShowFullSchedule] = useState(false);

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
          {(() => {
            console.log('🏢 selectedCompany.images:', selectedCompany.images);
            const thumbnailImage = selectedCompany.images?.find(img => img.isThumbnail === true);
            const firstImage = selectedCompany.images?.[0];
            const displayImage = thumbnailImage || firstImage;

            if (displayImage) {
              console.log('🖼️ 선택된 displayImage:', displayImage);
            }

            // 메인 이미지 임시 비활성화 - 성능 문제 해결을 위해
            return null;
          })()}
          <div
            className="company-image-placeholder"
            style={{
              display: selectedCompany.images?.length > 0 ? 'none' : 'flex'
            }}
          >
            📷 업체 사진
          </div>
        </div>

        <div className="reservation-section">
          <button onClick={() => onBookingClick && onBookingClick(selectedCompany)}>
            <img src={reserved_white} alt="예약하기" />
            <span>예약하기</span>
          </button>
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
          {/* 홈 내용 */}
          {activeTab === 'home' && (
            <div className="company-info">
              {/* 개인(P)이 아닐 경우에만 쿠폰 섹션 표시 */}
              {selectedCompany.businessType !== 'P' && selectedCompany.type !== 'P' && (
                <div className="company-section-content">
                  <div className="coupon-section">
                      <div className="coupon-container">
                          <div className="coupon-header">
                            <img src={mapmodal_home_img1} alt="회복과 성장의 마중물"/>
                            <img src={mapmodal_home_img2} alt="민생회복 소비쿠폰"/>
                            <span className="sr-only">회복과 성장의 마중물 민생회복 소비쿠폰</span>
                          </div>
                          <div className="coupon-title">
                            신용·체크 카드 사용 가능 매장
                          </div>
                          <div className="coupon-notice">
                            <img src={mapmodal_home_img3} alt="안내" className="modal_home_img3"/>
                            <span className="sr-only">안내</span>
                            소비쿠폰 가맹점 정보는 행안부(참여 신용카드사)와 사업주분들께서 제공한 정보로, 실제 사용 가능 여부는 매장에 확인해 주세요.
                          </div>
                        </div>
                    </div>
                </div>
              )}
              <div className="info-section">
                <div className="info-item">
                  <span className="icon">
                    <img src={map_icon1} alt="주소" />
                  </span>
                  <div className="info-content">
                    <div className="label">주소</div>
                    <div className="value">{selectedCompany.roadAddr}</div>
                  </div>
                </div>
                <div className="info-item">
                  <span className="icon">
                    <img src={map_icon2} alt="영업시간" />
                  </span>
                  <div className="info-content">
                    <div className="label">영업시간</div>
                    <div className="business-hours-container">
                      <div className="today-hours">
                        <div className="business-status">
                          <span className="status-message">
                            {selectedCompany.currentBusinessMessage || "영업시간 정보 없음"}
                          </span>
                          <span
                            className={`status-badge ${selectedCompany.currentBusinessStatus || "정보없음"}`}
                          >
                            {selectedCompany.currentBusinessStatus || "정보없음"}
                          </span>
                          
                        </div>
                        {selectedCompany.weeklySchedule && selectedCompany.weeklySchedule.length > 0 && (
                          <button
                            className="schedule-toggle-btn"
                            onClick={() => setShowFullSchedule(!showFullSchedule)}
                          >
                            {showFullSchedule ? <img src={map_icon6} alt="닫기"/> : <img src={map_icon5} alt="열기"/>}
                          </button>
                        )}
                      </div>
                      {showFullSchedule && selectedCompany.weeklySchedule && selectedCompany.weeklySchedule.length > 0 && (
                        <div className="full-schedule">
                          <div className="schedule-header">요일별 영업시간</div>
                          {selectedCompany.weeklySchedule.map((dayInfo, index) => (
                            <div key={index} className="schedule-item">
                              <span className="day">{dayInfo.day}</span>
                              <span className="hours">{dayInfo.status}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="info-item">
                  <span className="icon">
                    <img src={map_icon3} alt="연락처" />
                  </span>
                  <div className="info-content">
                    <div className="label">연락처</div>
                    <div className="value">{selectedCompany.tel}</div>
                  </div>
                </div>
                <div className="info-item">
                  <span className="icon">
                    <img src={map_icon4} alt="주요서비스"/>
                  </span>
                  <div className="info-content">
                    <div className="label">제공 서비스</div>
                    <div className="value">
                      {selectedCompany.serviceNames && selectedCompany.serviceNames.length > 0 ? (
                        selectedCompany.serviceNames.map((serviceName, index) => (
                          <span key={index} className="service-badge" style={{marginRight: '8px', marginBottom: '4px'}}>
                            {serviceName}
                          </span>
                        ))
                      ) : (
                        <span className="service-badge">기타</span>
                      )}
                    </div>
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
                
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="review-content">
              <div className="info-section">
                <h4>이런 점이 좋았어요</h4>
                <div className="review-item">
                    <span className="review-keyword">반려동물을 잘 다뤄줘요</span>
                    <span className="review-keyword">맞춤케어를 잘 해줘요</span>
                    <span className="review-keyword">친절해요</span>
                </div>
                <div className="review-deatail">
                  <div className="review-section">
                    <h4>리뷰</h4>
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
                <div style={{ padding: '10px', background: '#f0f0f0', marginBottom: '10px', fontSize: '12px' }}>
                  디버깅: images = {JSON.stringify(selectedCompany.images)}<br/>
                  bizRegNo = {selectedCompany.bizRegNo}<br/>
                  type = {selectedCompany.type}<br/>
                  name = {selectedCompany.name}<br/>
                  ssnFirst = {selectedCompany.ssnFirst}
                </div>
                <div className="photo-grid">
                  {/* 임시로 이미지 갤러리 비활성화 */}
                  {false && selectedCompany.images && selectedCompany.images.length > 0 ? (
                    selectedCompany.images
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .slice(0, 6) // 최대 6개만 표시하여 성능 향상
                      .map((image, index) => (
                        <div key={image.id} className="photo-item">
                          <img
                            src={getImageUrl(image.filePath)}
                            alt={image.altText || `${selectedCompany.name} 사진 ${index + 1}`}
                            className="company-photo"
                            loading="lazy"
                            style={{
                              backgroundColor: '#f5f5f5',
                              minHeight: '120px',
                              objectFit: 'cover'
                            }}
                            onLoad={(e) => {
                              console.log('갤러리 이미지 로드 성공:', image.filePath);
                              e.target.style.backgroundColor = 'transparent';
                            }}
                            onError={(e) => {
                              console.log('갤러리 이미지 로드 실패:', image.filePath);
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="photo-placeholder" style={{ display: 'none' }}>
                            📷 {image.description || `사진 ${index + 1}`}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="no-photos">
                      <p>등록된 사진이 없습니다.</p>
                    </div>
                  )}
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