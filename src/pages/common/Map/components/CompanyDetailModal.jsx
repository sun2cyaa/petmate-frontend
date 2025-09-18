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

function CompanyDetailModal({ selectedCompany, services, onClose }) {
  const [activeTab, setActiveTab] = useState('home');
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  if (!selectedCompany) return null;

  // 영업시간 처리
  const getOperatingHours = () => {
    if (!selectedCompany.operatingHours) return null;

    try {
      const hours = typeof selectedCompany.operatingHours === 'string'
        ? JSON.parse(selectedCompany.operatingHours)
        : selectedCompany.operatingHours;

      return hours;
    } catch (e) {
      console.error('영업시간 파싱 오류:', e);
      return null;
    }
  };

  // 현재 영업 상태 확인
  const getCurrentBusinessStatus = () => {
    const hours = getOperatingHours();
    if (!hours) return { status: "정보없음", message: "영업시간 정보 없음" };

    if (hours.allDay) {
      return { status: "영업중", message: "24시간 영업" };
    }

    if (hours.schedule) {
      const now = new Date();
      const today = now.getDay();
      const currentTime = now.getHours() * 100 + now.getMinutes(); // HHMM 형태로 변환

      const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
      const todayName = dayNames[today];
      const todaySchedule = hours.schedule[todayName];

      if (!todaySchedule || todaySchedule.closed) {
        return { status: "휴무", message: "오늘 휴무" };
      }

      // 시간 문자열을 숫자로 변환 (예: "09:00" -> 900)
      const openTime = parseInt(todaySchedule.open.replace(':', ''));
      const closeTime = parseInt(todaySchedule.close.replace(':', ''));

      if (currentTime >= openTime && currentTime < closeTime) {
        return {
          status: "영업중",
          message: `${todaySchedule.close}에 영업 종료`
        };
      } else if (currentTime < openTime) {
        return {
          status: "영업전",
          message: `${todaySchedule.open}에 영업 시작`
        };
      } else {
        return {
          status: "영업종료",
          message: "영업 종료"
        };
      }
    }

    return { status: "정보없음", message: "영업시간 정보 없음" };
  };

  // 오늘의 영업시간 가져오기
  const getTodayHours = () => {
    const hours = getOperatingHours();
    if (!hours) return "영업시간 정보 없음";

    if (hours.allDay) {
      return "24시간 영업";
    }

    if (hours.schedule) {
      const today = new Date().getDay();
      const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
      const todayName = dayNames[today];
      const todaySchedule = hours.schedule[todayName];

      if (todaySchedule) {
        if (todaySchedule.closed) {
          return "오늘 휴무";
        }
        return `${todaySchedule.open || '시간미정'} - ${todaySchedule.close || '시간미정'}`;
      }
    }

    return "영업시간 정보 없음";
  };

  // 전체 요일별 영업시간 가져오기
  const getFullSchedule = () => {
    const hours = getOperatingHours();
    if (!hours || !hours.schedule) return [];

    const dayOrder = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
    const dayShortNames = ['월', '화', '수', '목', '금', '토', '일'];

    return dayOrder.map((fullDayName, index) => {
      const dayInfo = hours.schedule[fullDayName];
      const shortDayName = dayShortNames[index];

      if (!dayInfo) {
        return { day: shortDayName, status: '정보없음' };
      }

      if (dayInfo.closed) {
        return { day: shortDayName, status: '휴무' };
      }

      return {
        day: shortDayName,
        status: `${dayInfo.open || '시간미정'} - ${dayInfo.close || '시간미정'}`
      };
    });
  };

  // 서비스 목록 처리
  const getCompanyServices = () => {
    if (!selectedCompany.services) return [];

    try {
      const companyServices = typeof selectedCompany.services === 'string'
        ? JSON.parse(selectedCompany.services)
        : selectedCompany.services;

      return Object.entries(companyServices)
        .filter(([_, isProvided]) => isProvided)
        .map(([serviceKey, _]) => {
          const serviceMap = {
            '돌봄': '1',
            '산책': '2',
            '미용': '3',
            '병원': '4',
            '기타': '9'
          };
          const serviceId = serviceMap[serviceKey];
          return services.find(s => s.id === serviceId)?.name || serviceKey;
        });
    } catch (e) {
      console.error('서비스 파싱 오류:', e);
      return [];
    }
  };

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
          {/* 홈 내용 */}
          {activeTab === 'home' && (
            <div className="company-info">
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
                    <div className="value business-hours-container">
                      <div className="today-hours">
                        <div className="business-status">
                          <span className="status-message">
                            {getCurrentBusinessStatus().message}
                          </span>
                          <span
                            className={`status-badge ${getCurrentBusinessStatus().status}`}
                          >
                            {getCurrentBusinessStatus().status}
                          </span>
                          
                        </div>
                        {getOperatingHours()?.schedule && (
                          <button
                            className="schedule-toggle-btn"
                            onClick={() => setShowFullSchedule(!showFullSchedule)}
                          >
                            {showFullSchedule ? <img src={map_icon6} alt="열기"/> : <img src={map_icon5} alt="닫기"/>}
                          </button>
                        )}
                      </div>
                      <div className="today-schedule">
                        <span className="schedule-text">{getTodayHours()}</span>
                      </div>
                      {showFullSchedule && getOperatingHours()?.schedule && (
                        <div className="full-schedule">
                          <div className="schedule-header">요일별 영업시간</div>
                          {getFullSchedule().map((dayInfo, index) => (
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
                      {getCompanyServices().length > 0 ? (
                        getCompanyServices().map((serviceName, index) => (
                          <span key={index} className="service-badge" style={{marginRight: '8px', marginBottom: '4px'}}>
                            {serviceName}
                          </span>
                        ))
                      ) : (
                        <span className="service-badge">
                          {services.find(s => s.id === selectedCompany.repService)?.name || '기타'}
                        </span>
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