import React, { useContext, useState } from "react";
import BookingContext from "./BookingContext";
import { useNavigate } from "react-router-dom";

// Step 3: 결제
const BookingConfirmPage = () => {
  const { state, dispatch } = useContext(BookingContext);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const navigate = useNavigate();

  const handleData = () => {
    // 예약데이터 전달
    const bookingData = {
      selectedStore: state.selectedStore,
      selectedProduct: state.selectedProduct,
      selectedPets: state.selectedPets,
      selectedDate: state.selectedDate,
      selectedTimeSlot: state.selectedTimeSlot,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
    };
    // 데이터 임시저장
    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));

    navigate("/payment");
  };

  const totalAmount = state.selectedProduct
    ? state.selectedProduct.price * state.selectedPets.length
    : 0;
  const selectedPetsNames = state.selectedPets
    .map((id) => (id === 1 ? "멍멍이" : id === 2 ? "야옹이" : "콩이"))
    .join(", ");

  return (
    <div className="booking-container">
      {/* 예약 정보 요약 */}
      <div className="summary-card">
        <h3 className="summary-title">예약 정보</h3>

        <div className="summary-list">
          <div className="summary-item">
            <span className="summary-label">업체</span>
            <span className="summary-value">{state.selectedStore.name}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">서비스</span>
            <span className="summary-value">{state.selectedProduct?.name}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">반려동물</span>
            <span className="summary-value">{selectedPetsNames}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">날짜</span>
            <span className="summary-value">
              {state.selectedDate?.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "short",
              })}
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-label">시간</span>
            <span className="summary-value">
              {state.selectedTimeSlot?.label}
            </span>
          </div>
        </div>
      </div>

      {/* 결제 금액 */}
      <div className="payment-card">
        <h3 className="payment-title">결제 금액</h3>

        <div className="payment-list">
          <div className="payment-item">
            <span>
              {state.selectedProduct?.name} × {state.selectedPets.length}
            </span>
            <span>{totalAmount.toLocaleString() ?? "0"}원</span>
          </div>

          <div className="payment-total">
            <span>총 결제금액</span>
            <span className="total-price">
              {totalAmount.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      {/* 결제 수단 */}
      <div className="method-card">
        <h3 className="method-title">결제 수단</h3>

        <div className="method-list">
          {[
            { id: "card", name: "신용/체크카드", icon: "💳" },
            { id: "transfer", name: "계좌이체", icon: "🏦" },
            { id: "phone", name: "휴대폰 결제", icon: "📱" },
            {
              id: "simple",
              name: "간편결제 (카카오페이, 네이버페이)",
              icon: "📲",
            },
          ].map((method) => (
            <label
              key={method.id}
              className={`method-option ${
                paymentMethod === method.id ? "method-selected" : ""
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="method-input"
              />
              <span className="method-icon">{method.icon}</span>
              <span className="method-name">{method.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 이용약관 */}
      <div className="terms-card">
        <div className="terms-list">
          <label className="terms-all">
            <input type="checkbox" className="terms-checkbox" />
            <span>전체 약관에 동의합니다</span>
          </label>
          <div className="terms-sub">
            <label className="terms-item">
              <input type="checkbox" className="terms-checkbox" />
              <span>예약 서비스 이용약관 동의 (필수)</span>
            </label>
            <label className="terms-item">
              <input type="checkbox" className="terms-checkbox" />
              <span>개인정보 수집 및 이용 동의 (필수)</span>
            </label>
            <label className="terms-item">
              <input type="checkbox" className="terms-checkbox" />
              <span>마케팅 정보 수신 동의 (선택)</span>
            </label>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="footer-actions">
        <div className="button-group">
          <button
            onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}
            className="btn-prev"
          >
            이전
          </button>
          <button onClick={handleData} className="btn-pay">
            {totalAmount.toLocaleString() ?? "0"}원 결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmPage;
