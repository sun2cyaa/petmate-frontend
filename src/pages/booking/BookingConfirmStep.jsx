import React, { useContext, useState, useEffect } from "react";
import BookingContext from "./BookingContext";
import { createBooking } from "../../services/booking/bookingService";
import { formatDateForAPI, combineDateTime } from "../../services/booking/timeSlotService";
import { loadDanalPaymentsSDK } from "@danalpay/javascript-sdk";

const BookingConfirmStep = () => {
  const { state, dispatch } = useContext(BookingContext);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [agreedTerms, setAgreedTerms] = useState({
    all: false,
    service: false,
    privacy: false,
    payment: false,
  });
  const [danalPayments, setDanalPayments] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  // 다날 SDK 초기화
  useEffect(() => {
    const initializeDanalSDK = async () => {
      try {
        console.log("다날 SDK 초기화 시작...");
        const payments = await loadDanalPaymentsSDK({
          clientKey: "CL_TEST_I4d8FWYSSKl-42F7y3o9g_7iexSCyHbL8qthpZxPnpY=",
        });
        setDanalPayments(payments);
        console.log("다날 SDK 초기화 완료");
      } catch (error) {
        console.error("다날 SDK 초기화 실패:", error);
      }
    };

    const timer = setTimeout(initializeDanalSDK, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTermsChange = (type) => {
    if (type === "all") {
      const newValue = !agreedTerms.all;
      setAgreedTerms({
        all: newValue,
        service: newValue,
        privacy: newValue,
        payment: newValue,
      });
    } else {
      const newTerms = { ...agreedTerms, [type]: !agreedTerms[type] };
      newTerms.all = newTerms.service && newTerms.privacy && newTerms.payment;
      setAgreedTerms(newTerms);
    }
  };

  const calculateTotal = () => {
    const basePrice = state.selectedProduct?.price || 0;
    const petCount = state.selectedPets.length;
    const subtotal = basePrice * petCount;
    const tax = Math.floor(subtotal * 0.1);
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const handlePayment = async () => {
    if (!isPaymentEnabled() || !danalPayments) {
      if (!danalPayments) alert("결제 시스템이 준비되지 않았습니다.");
      return;
    }

    // 필수 데이터 검증
    if (!state.selectedStore || !state.selectedProduct || !state.selectedDate || !state.selectedTimeSlot) {
      alert("예약에 필요한 정보가 부족합니다. 이전 단계를 다시 확인해주세요.");
      return;
    }

    if (!state.selectedPets || state.selectedPets.length === 0) {
      alert("반려동물을 선택해주세요.");
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", field: "booking", value: true });

      // 1. 예약 생성
      const formattedDate = formatDateForAPI(state.selectedDate);
      const startDateTime = combineDateTime(formattedDate, state.selectedTimeSlot?.startTime);
      const endDateTime = combineDateTime(formattedDate, state.selectedTimeSlot?.endTime);

      console.log("날짜/시간 변환:", {
        selectedDate: state.selectedDate,
        formattedDate,
        timeSlot: state.selectedTimeSlot,
        startDateTime,
        endDateTime
      });

      if (!startDateTime || !endDateTime) {
        throw new Error("예약 날짜 또는 시간이 올바르지 않습니다.");
      }

      const bookingData = {
        ownerUserId: 1, // 임시 - 실제로는 로그인된 사용자 ID
        companyId: state.selectedStore.companyId || state.selectedStore.id,
        productId: state.selectedProduct.id,
        startDt: startDateTime,
        endDt: endDateTime,
        petCount: state.selectedPets.length || 1,
        totalPrice: total,
        specialRequests: state.specialRequests || "",
        status: "0", // 예약대기
      };

      console.log("예약 생성 데이터:", bookingData);

      if (!bookingData.companyId || !bookingData.productId) {
        throw new Error("필수 예약 정보가 누락되었습니다.");
      }

      const createdBooking = await createBooking(bookingData);
      console.log("예약 생성 완료:", createdBooking);

      if (!createdBooking || !createdBooking.id) {
        throw new Error("예약 생성에 실패했습니다.");
      }

      setBookingId(createdBooking.id);

      // 2. 다날 결제 진행 (mock 백엔드로 콜백)
      const baseParams = {
        orderName: state.selectedProduct?.name || "펫케어 서비스",
        amount: total,
        merchantId: "9810030930",
        orderId: `booking_${createdBooking.id}_${new Date().getTime()}`,
        userId: "user@naver.com",
        successUrl: `http://localhost:8090/api/payment/danal/success`,
        failUrl: `http://localhost:8090/api/payment/danal/fail`,
        userEmail: "user@naver.com",
      };

      let paymentParams;
      switch (paymentMethod) {
        case "card":
          paymentParams = {
            ...baseParams,
            paymentsMethod: "CARD",
          };
          break;
        case "transfer":
          paymentParams = {
            ...baseParams,
            paymentsMethod: "TRANSFER",
          };
          break;
        case "mobile":
          paymentParams = {
            ...baseParams,
            paymentsMethod: "MOBILE",
            itemCode: "1270000000",
            itemType: "1",
          };
          break;
        default:
          paymentParams = {
            ...baseParams,
            paymentsMethod: "INTEGRATED",
            methods: {
              mobile: { itemCode: "1270000000", itemType: "1" },
              virtualAccount: { notiUrl: "https://notiUrl.com" },
              card: {},
              naverPay: {},
              kakaoPay: {},
              payco: {},
            },
          };
      }

      console.log("다날 결제 요청:", paymentParams);

      // 다날 결제창 호출
      const paymentResult = await danalPayments.requestPayment(paymentParams);
      console.log("결제 완료:", paymentResult);

      // 결제 성공 시 BookingCompleteStep으로 이동
      // 다날은 외부 창에서 결제하므로 성공 시 바로 Step 4로 이동
      dispatch({ type: "SET_STEP", payload: 4 });

    } catch (error) {
      console.error("결제 처리 실패:", error);

      if (error.code === "USER_CANCEL") {
        alert("결제가 취소되었습니다.");
      } else if (error.code === "WINDOW_CLOSED") {
        alert("결제창이 닫혔습니다.");
      } else {
        alert(`결제 처리 중 오류가 발생했습니다: ${error.message || error}`);
      }
    } finally {
      dispatch({ type: "SET_LOADING", field: "booking", value: false });
    }
  };

  const handlePrev = () => {
    dispatch({ type: "SET_STEP", payload: 2 });
  };

  const isPaymentEnabled = () => {
    return (
      agreedTerms.service &&
      agreedTerms.privacy &&
      agreedTerms.payment &&
      paymentMethod
    );
  };

  const { subtotal, tax, total } = calculateTotal();

  const formatDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(date);
  };

  return (
    <div style={{ padding: "16px" }}>
      {/* 예약 정보 요약 */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "16px",
        }}
      >
        <h4
          style={{ margin: "0 0 16px 0", color: "#e05353", fontSize: "18px" }}
        >
          📋 예약 정보
        </h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #f1f3f4",
            }}
          >
            <span style={{ fontSize: "14px", color: "#6b7280" }}>업체명</span>
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              {state.selectedStore?.name}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #f1f3f4",
            }}
          >
            <span style={{ fontSize: "14px", color: "#6b7280" }}>서비스</span>
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              {state.selectedProduct?.name}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #f1f3f4",
            }}
          >
            <span style={{ fontSize: "14px", color: "#6b7280" }}>날짜</span>
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              {formatDate(state.selectedDate)}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #f1f3f4",
            }}
          >
            <span style={{ fontSize: "14px", color: "#6b7280" }}>시간</span>
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              {state.selectedTimeSlot?.startTime} - {state.selectedTimeSlot?.endTime}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
            }}
          >
            <span style={{ fontSize: "14px", color: "#6b7280" }}>반려동물</span>
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              {state.selectedPets.length}마리
            </span>
          </div>
        </div>
      </div>

      {/* 결제 금액 */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "16px",
        }}
      >
        <h4
          style={{ margin: "0 0 16px 0", color: "#e05353", fontSize: "18px" }}
        >
          💰 결제 금액
        </h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            <span>서비스 금액</span>
            <span>{subtotal.toLocaleString()}원</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            <span>부가세</span>
            <span>{tax.toLocaleString()}원</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "16px",
              borderTop: "2px solid #eb9666",
              fontWeight: "600",
            }}
          >
            <span>총 결제 금액</span>
            <span style={{ fontSize: "20px", color: "#e05353" }}>
              {total.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      {/* 결제 수단 */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "16px",
        }}
      >
        <h4
          style={{ margin: "0 0 16px 0", color: "#e05353", fontSize: "18px" }}
        >
          💳 결제 수단
        </h4>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
          {[
            { id: "card", name: "신용/체크카드", icon: "💳" },
            { id: "transfer", name: "계좌이체", icon: "🏦" },
            { id: "mobile", name: "휴대폰 결제", icon: "📱" },
          ].map((method) => (
            <div
              key={method.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                padding: "20px 16px",
                border: `2px solid ${paymentMethod === method.id ? "#eb9666" : "#e5e7eb"}`,
                borderRadius: "12px",
                background: paymentMethod === method.id ? "#fff8f3" : "white",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                position: "relative",
              }}
              onClick={() => setPaymentMethod(method.id)}
            >
              {paymentMethod === method.id && (
                <div style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "#eb9666",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                }}>
                  ✓
                </div>
              )}
              <span style={{ fontSize: "32px" }}>{method.icon}</span>
              <span style={{ fontSize: "14px", fontWeight: "500", lineHeight: "1.2" }}>{method.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 이용약관 */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px",
            background: "#fff8f3",
            border: "2px solid #eb9666",
            borderRadius: "12px",
            cursor: "pointer",
            marginBottom: "12px",
          }}
          onClick={() => handleTermsChange("all")}
        >
          <input
            type="checkbox"
            checked={agreedTerms.all}
            onChange={() => handleTermsChange("all")}
            style={{ accentColor: "#eb9666" }}
          />
          <span style={{ fontWeight: "600", color: "#e05353" }}>
            모든 약관에 동의합니다
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { id: "service", name: "서비스 이용약관 동의 (필수)" },
            { id: "privacy", name: "개인정보 처리방침 동의 (필수)" },
            { id: "payment", name: "결제 서비스 약관 동의 (필수)" },
          ].map((term) => (
            <div
              key={term.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                cursor: "pointer",
                borderRadius: "8px",
              }}
              onClick={() => handleTermsChange(term.id)}
            >
              <input
                type="checkbox"
                checked={agreedTerms[term.id]}
                onChange={() => handleTermsChange(term.id)}
                style={{ accentColor: "#eb9666" }}
              />
              <span style={{ fontSize: "14px" }}>{term.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div
        style={{
          position: "sticky",
          bottom: "0",
          background: "white",
          padding: "16px",
          borderTop: "1px solid #e5e7eb",
          marginLeft: "-16px",
          marginRight: "-16px",
          display: "flex",
          gap: "12px",
        }}
      >
        <button
          style={{
            flex: "1",
            padding: "16px",
            background: "#f3f4f6",
            color: "#374151",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={handlePrev}
        >
          이전
        </button>
        <button
          style={{
            flex: "2",
            padding: "16px",
            background: isPaymentEnabled() && !state.loading.booking && danalPayments
              ? "linear-gradient(135deg, #eb9666, #e05353)"
              : "#e5e7eb",
            color: isPaymentEnabled() && !state.loading.booking && danalPayments ? "white" : "#9ca3af",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: isPaymentEnabled() && !state.loading.booking && danalPayments ? "pointer" : "not-allowed",
          }}
          onClick={handlePayment}
          disabled={!isPaymentEnabled() || state.loading.booking || !danalPayments}
        >
          {state.loading.booking
            ? "예약 생성 중..."
            : `${total.toLocaleString()}원 결제하기`
          }
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmStep;
