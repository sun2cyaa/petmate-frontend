import React, { useEffect, useState } from "react";
import iconFail from "../../assets/images/payment/icon_fail.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getBookingById } from "../../services/booking/bookingService";
import { getPaymentStatus } from "../../services/payment/paymentService";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bookingData, setBookingData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPaymentResult = async () => {
      try {
        setIsLoading(true);

        // URL 파라미터에서 결제 결과 정보 가져오기
        const orderId = searchParams.get("orderId");
        const transactionId = searchParams.get("transactionId");
        const amount = searchParams.get("amount");

        if (!orderId) {
          setError("결제 정보를 찾을 수 없습니다.");
          return;
        }

        console.log("결제 성공 정보:", { orderId, transactionId, amount });

        // localStorage에 결제 성공 상태 저장 (BookingConfirmStep에서 확인용)
        if (orderId) {
          localStorage.setItem(`payment_${orderId}`, 'success');
        }

        // 결제 정보 저장
        setPaymentData({
          orderId,
          transactionId,
          amount: parseInt(amount) || 0,
          status: "SUCCESS",
        });

        // orderId를 통해 예약 정보 조회 (orderId에 bookingId가 포함되어 있다고 가정)
        // 실제로는 백엔드에서 orderId로 예약 정보를 찾는 API가 필요할 수 있음

        console.log("결제 완료 처리 성공");
      } catch (error) {
        console.error("결제 결과 처리 실패:", error);
        setError("결제 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPaymentResult();
  }, [searchParams]);

  const handleGoToBookingComplete = () => {
    // 창 닫기 (부모 창으로 돌아가기)
    window.close();
  };

  const styles = {
    successContainer: {
      maxWidth: "450px",
      width: "100%",
      padding: "30px 20px",
      backgroundColor: "white",
      borderRadius: "12px",
      textAlign: "center",
      display: "flex",
      height: "100%",
      flexDirection: "column",
      justifyContent: "center",
      gap: "20px",
      animation: "fadeIn 0.6s ease-out",
    },
    successIcon: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "0 auto 20px",
    },
    checkmark: {
      scale: "1.5",
    },
    title: {
      color: "#333",
      fontSize: "24px",
      marginBottom: "15px",
    },
    description: {
      color: "#666",
      marginBottom: "25px",
      lineHeight: "1.5",
    },
    detailRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "8px",
    },
    detailLabel: {
      color: "#666",
    },
    detailValue: {
      fontWeight: "bold",
      color: "#333",
    },
    link: {
      textDecoration: "underline",
    },
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div style={styles.successContainer}>
        <div style={styles.successIcon}>
          <div>⏳</div>
        </div>
        <h1 style={styles.title}>결제 결과 확인 중...</h1>
        <p style={styles.description}>잠시만 기다려주세요.</p>
      </div>
    );
  }

  // 에러
  if (error) {
    return (
      <div style={styles.successContainer}>
        <div style={styles.successIcon}>
          <div>❌</div>
        </div>
        <h1 style={styles.title}>오류 발생</h1>
        <p style={styles.description}>{error}</p>
        <button onClick={() => navigate("/home")}>홈으로 돌아가기</button>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <div style={styles.successContainer}>
        <div style={styles.successIcon}>
          <div style={{ position: "relative" }}>
            <img src={iconFail} alt="Success" />
            <svg
              width="55"
              height="54"
              viewBox="0 0 55 54"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ position: "absolute", right: "-27px", top: "-17px" }}
            >
              <circle cx="27.5" cy="27" r="27" fill="#0F71FF" />
              <path
                d="M15.5 25.7353L24.6655 35L40.5 20"
                stroke="white"
                strokeWidth="5.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button onClick={handleGoToBookingComplete} style={styles.btn}>
            예약완료 확인하기
          </button>
        </div>
        <h1 style={styles.title}>결제를 완료했어요</h1>
        <p style={styles.description}>
          {paymentData?.amount
            ? `${paymentData.amount.toLocaleString()}원이 `
            : ""}
          결제가 완료되었습니다. <br />
          예약 정보를 확인해주세요.
        </p>

        {paymentData && (
          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>주문번호</span>
              <span style={styles.detailValue}>{paymentData.orderId}</span>
            </div>
            {paymentData.transactionId && (
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>거래번호</span>
                <span style={styles.detailValue}>
                  {paymentData.transactionId}
                </span>
              </div>
            )}
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>결제금액</span>
              <span style={styles.detailValue}>
                {paymentData.amount.toLocaleString()}원
              </span>
            </div>
          </div>
        )}
        <a href="/" style={styles.link}>
          홈으로 돌아가기
        </a>
      </div>
    </>
  );
};

export default PaymentSuccess;
