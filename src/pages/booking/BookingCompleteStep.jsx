import React, { useContext, useEffect, useState } from "react";
import BookingContext from "./BookingContext";
import { getBookingById } from "../../services/booking/bookingService";

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
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {/* 성공 아이콘 */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'inline-block',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #eb9666, #e05353)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          marginBottom: '16px',
        }}>
          ✅
        </div>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '800', color: '#e05353' }}>
          예약이 완료되었습니다!
        </h2>
        <p style={{ margin: 0, fontSize: '16px', color: '#6b7280' }}>
          예약 확인 및 관리는 마이페이지에서 가능합니다.
        </p>
      </div>

      {/* 예약 정보 카드 */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        textAlign: 'left',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '2px solid #f1f3f4'
        }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#e05353' }}>
            예약 정보
          </h3>
          <span style={{
            background: 'linear-gradient(135deg, #eb9666, #e05353)',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            예약완료
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>업체명</span>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>
              {actualBookingData?.companyName || displayData.selectedStore?.name}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>서비스</span>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>
              {actualBookingData?.productName || displayData.selectedProduct?.name}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>예약일시</span>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>
              {actualBookingData ?
                `${formatDate(actualBookingData.startDt)} ${actualBookingData.startDt?.split('T')[1]?.substring(0,5)}-${actualBookingData.endDt?.split('T')[1]?.substring(0,5)}` :
                `${formatDate(displayData.selectedDate)} ${displayData.selectedTimeSlot?.startTime}-${displayData.selectedTimeSlot?.endTime}`
              }
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>반려동물</span>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>
              {actualBookingData?.petCount || displayData.selectedPets?.length || 1}마리
            </span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '2px solid #eb9666',
            paddingTop: '16px',
            marginTop: '8px'
          }}>
            <span style={{ fontSize: '16px', fontWeight: '600' }}>총 결제금액</span>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#e05353' }}>
              {calculateTotal().toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      {/* 다음 단계 안내 */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
        textAlign: 'left',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <h4 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700', color: '#e05353', textAlign: 'center' }}>
          다음 단계
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            padding: '16px',
            background: '#fff8f3',
            borderRadius: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>📞</span>
            <div>
              <h5 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>업체 연락</h5>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.4' }}>
                예약 확정을 위해 업체에서 연락드릴 예정입니다.
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            padding: '16px',
            background: '#fff8f3',
            borderRadius: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>💬</span>
            <div>
              <h5 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>서비스 준비</h5>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.4' }}>
                예약일 전날까지 반려동물 준비사항을 확인해주세요.
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            padding: '16px',
            background: '#fff8f3',
            borderRadius: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>⭐</span>
            <div>
              <h5 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>서비스 완료</h5>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.4' }}>
                서비스 이용 후 리뷰를 남겨주시면 더 좋은 서비스 개선에 도움이 됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          style={{
            flex: '1',
            padding: '16px 24px',
            background: 'white',
            color: '#eb9666',
            border: '2px solid #eb9666',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
          onClick={handleViewBookings}
        >
          예약 내역 보기
        </button>
        <button
          style={{
            flex: '1',
            padding: '16px 24px',
            background: 'linear-gradient(135deg, #eb9666, #e05353)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
          onClick={handleClose}
        >
          완료
        </button>
      </div>
    </div>
  );
};

export default BookingCompleteStep;