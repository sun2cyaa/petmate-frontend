import React, { useContext, useEffect, useState } from "react";
import BookingContext from "./BookingContext";
import { getBookingById } from "../../services/booking/bookingService";
import "./BookingCompleteStep.css";

const BookingCompleteStep = () => {
  const { state } = useContext(BookingContext);
  const [actualBookingData, setActualBookingData] = useState(null);

  useEffect(() => {
    // 만약 예약 ID가 있다면 실제 예약 데이터를 로드
    const loadActualBookingData = async () => {
      try {
        // URL 파라미터나 state에서 bookingId를 찾아서 실제 데이터 로드
        const urlParams = new URLSearchParams(window.location.search);
        const bookingId = urlParams.get('bookingId');

        if (bookingId) {
          const bookingData = await getBookingById(bookingId);
          setActualBookingData(bookingData);
        }
      } catch (error) {
        console.error("실제 예약 데이터 로드 실패:", error);
      }
    };

    loadActualBookingData();
  }, []);

  // 실제 예약 데이터가 있으면 그것을 사용, 없으면 state 데이터 사용
  const displayData = actualBookingData || state;

  const formatDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }).format(date);
  };

  const calculateTotal = () => {
    if (actualBookingData) {
      return actualBookingData.totalPrice || 0;
    }
    const basePrice = state.selectedProduct?.price || 0;
    const petCount = state.selectedPets.length;
    const subtotal = basePrice * petCount;
    const tax = Math.floor(subtotal * 0.1);
    const total = subtotal + tax;
    return total;
  };

  const handleClose = () => {
    // 모달 닫기 로직은 상위 컴포넌트에서 처리
    window.location.reload(); // 임시
  };

  const handleViewBookings = () => {
    // 예약 내역 페이지로 이동
    window.location.href = '/petmate/booking';
  };

  return (
    <div className="booking-complete-container">
      {/* 성공 아이콘 */}
      <div className="success-icon-wrap">
        <div className="success-icon">✅</div>
        <h2 className="success-title">예약이 완료되었습니다!</h2>
        <p className="success-desc">
          예약 확인 및 관리는 마이페이지에서 가능합니다.
        </p>
      </div>

      {/* 예약 정보 카드 */}
      <div className="card booking-info-card">
        <div className="card-header">
          <h3>예약 정보</h3>
          <span className="status-badge">예약완료</span>
        </div>

        <div className="info-list">
          <div className="info-item">
            <span className="label">업체명</span>
            <span className="value">
              {actualBookingData?.companyName || displayData.selectedStore?.name}
            </span>
          </div>

          <div className="info-item">
            <span className="label">서비스</span>
            <span className="value">
              {actualBookingData?.productName || displayData.selectedProduct?.name}
            </span>
          </div>

          <div className="info-item">
            <span className="label">예약일시</span>
            <span className="value">
              {actualBookingData ?
                `${formatDate(actualBookingData.startDt)} ${actualBookingData.startDt?.split('T')[1]?.substring(0,5)}-${actualBookingData.endDt?.split('T')[1]?.substring(0,5)}` :
                `${formatDate(displayData.selectedDate)} ${displayData.selectedTimeSlot?.startTime}-${displayData.selectedTimeSlot?.endTime}`
              }
            </span>
          </div>

          <div className="info-item">
            <span className="label">반려동물</span>
            <span className="value">
              {actualBookingData?.petCount || displayData.selectedPets?.length || 1}마리
              {displayData.availablePets && displayData.selectedPets && displayData.selectedPets.length > 0 && (
                <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
                  {displayData.availablePets
                    .filter(pet => displayData.selectedPets.includes(pet.id))
                    .map(pet => pet.name)
                    .join(", ")}
                </div>
              )}
            </span>
          </div>

          <div className="info-total">
            <span>총 결제금액</span>
            <span>{calculateTotal().toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* 다음 단계 안내 */}
      <div className="card next-step-card">
        <h4 className="next-step-title">다음 단계</h4>

        <div className="next-step-list">
          <div className="next-step-item">
            <span className="icon">📞</span>
            <div>
              <h5>업체 연락</h5>
              <p>예약 확정을 위해 업체에서 연락드릴 예정입니다.</p>
            </div>
          </div>

          <div className="next-step-item">
            <span className="icon">💬</span>
            <div>
              <h5>서비스 준비</h5>
              <p>예약일 전날까지 반려동물 준비사항을 확인해주세요.</p>
            </div>
          </div>

          <div className="next-step-item">
            <span className="icon">⭐</span>
            <div>
              <h5>서비스 완료</h5>
              <p>서비스 이용 후 리뷰를 남겨주시면 더 좋은 서비스 개선에 도움이 됩니다.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="footer-buttons">
        <button className="btn-outline" onClick={handleViewBookings}>
          예약 내역 보기
        </button>
        <button className="btn-primary" onClick={handleClose}>
          완료
        </button>
      </div>
    </div>
  );
};

export default BookingCompleteStep;
