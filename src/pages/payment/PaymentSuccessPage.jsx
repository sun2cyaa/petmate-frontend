import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Lottie from "lottie-react";
import successAnim from "../../assets/lottie/success.json";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPaymentResult = async () => {
      try {
        setIsLoading(true);
        const orderId = searchParams.get("orderId");
        const transactionId = searchParams.get("transactionId");
        const amount = searchParams.get("amount");

        if (!orderId) {
          setError("결제 정보를 찾을 수 없습니다.");
          return;
        }

        console.log("결제 성공 정보:", { orderId, transactionId, amount });

        localStorage.setItem(`payment_${orderId}`, "success");

        setPaymentData({
          orderId,
          transactionId,
          amount: parseInt(amount) || 0,
          status: "SUCCESS",
        });
      } catch (err) {
        console.error("결제 결과 처리 실패:", err);
        setError("결제 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    loadPaymentResult();
  }, [searchParams]);

  const handleGoToBookingComplete = () => {
    navigate("/my-bookings");
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="payment-success_wrap">
        <div className="loading-icon">⏳</div>
        <h1 className="title">결제 결과 확인 중...</h1>
        <p className="description">잠시만 기다려주세요.</p>
      </div>
    );
  }

  // 에러
  if (error) {
    return (
      <div className="payment-success_wrap">
        <div className="error-icon">❌</div>
        <h1 className="title">오류 발생</h1>
        <p className="description">{error}</p>
        <button className="btn-main" onClick={() => navigate("/home")}>
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="payment-success_wrap">
      {/* 성공 애니메이션 */}
      <div className="success-icon">
        <Lottie animationData={successAnim} loop={false} />
      </div>

      <h1 className="title">결제가 완료되었습니다!</h1>
      <p className="subtitle">펫케어 서비스 예약이 성공적으로 처리되었어요</p>

      <p className="description">
        {paymentData?.amount && `${paymentData.amount.toLocaleString()}원이 `}
        안전하게 결제되었습니다. <br />
        예약 확인 메시지가 곧 발송될 예정입니다.
      </p>

      {paymentData && (
        <div className="detail-card">
          <div className="detail-title">📋 결제 상세 정보</div>
          <div className="detail-row">
            <span className="label">주문번호</span>
            <span className="value">{paymentData.orderId}</span>
          </div>
          {paymentData.transactionId && (
            <div className="detail-row">
              <span className="label">거래번호</span>
              <span className="value">{paymentData.transactionId}</span>
            </div>
          )}
          <div className="detail-row">
            <span className="label">결제금액</span>
            <span className="value">
              {paymentData.amount.toLocaleString()}원
            </span>
          </div>
          <div className="detail-row">
            <span className="label">결제일시</span>
            <span className="value">
              {new Date().toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      )}

      <div className="button-group">
        <button
          className="btn-main"
          onClick={handleGoToBookingComplete}
        >
          예약 확인하기
        </button>
        <button
          className="btn-outline"
          onClick={() => navigate("/home")}
        >
          홈으로 이동
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
