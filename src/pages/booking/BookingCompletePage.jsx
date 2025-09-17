import React from "react";

const BookingCompletePage = () => {
  return (
    <div className="booking-complete-container">
      {/* 성공 아이콘 */}
      <div className="success-icon-wrap">
        <div className="success-icon">✅</div>
        <div className="success-animation"></div>
      </div>

      {/* 완료 메시지 */}
      <div className="complete-message">
        <h1 className="complete-title">예약이 완료되었습니다!</h1>
        <p className="complete-subtitle">
          예약 정보를 확인해 주세요. 궁금한 사항이 있으시면 언제든 문의해 주세요.
        </p>
      </div>

      {/* 예약 정보 카드 */}
      <div className="booking-info-card">
        <div className="booking-info-header">
          <h3 className="booking-info-title">예약 정보</h3>
          <span className="booking-status">예약완료</span>
        </div>

        <div className="booking-details">
          <div className="detail-row">
            <span className="detail-label">예약번호</span>
            <span className="detail-value">#PET240917001</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">업체명</span>
            <span className="detail-value">해피펫 케어센터</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">서비스</span>
            <span className="detail-value">프리미엄 종일 돌봄</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">날짜</span>
            <span className="detail-value">2024년 9월 20일 (금)</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">시간</span>
            <span className="detail-value">오전 9시</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">반려동물</span>
            <span className="detail-value">멍멍이, 야옹이</span>
          </div>
          <div className="detail-row total-row">
            <span className="detail-label">총 결제금액</span>
            <span className="detail-value total-amount">160,000원</span>
          </div>
        </div>
      </div>

      {/* 다음 단계 안내 */}
      <div className="next-steps-card">
        <h3 className="next-steps-title">다음 단계</h3>
        <div className="steps-list">
          <div className="step-item">
            <div className="step-icon">📱</div>
            <div className="step-content">
              <h4 className="step-title">문자 확인</h4>
              <p className="step-desc">예약 확인 문자를 발송해드렸습니다.</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-icon">📞</div>
            <div className="step-content">
              <h4 className="step-title">업체 연락</h4>
              <p className="step-desc">서비스 당일 업체에서 연락드립니다.</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-icon">🎯</div>
            <div className="step-content">
              <h4 className="step-title">서비스 이용</h4>
              <p className="step-desc">예약 시간에 맞춰 서비스를 이용하세요.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="complete-actions">
        <button className="btn-secondary">예약 내역 보기</button>
        <button className="btn-primary">홈으로 가기</button>
      </div>
    </div>
  );
};

export default BookingCompletePage;
