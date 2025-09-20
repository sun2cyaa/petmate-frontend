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
    // 반려인은 예약 내역, 펫메이트는 예약 관리로 이동
    navigate('/my-bookings');
  };

  const styles = {
    successContainer: {
      width: "100%",
      maxWidth: "720px",
      margin: "32px auto",
      background: "linear-gradient(145deg, #fff, #fffaf7)",
      borderRadius: "20px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      padding: "48px 32px",
      textAlign: "center",
      fontFamily: "'Noto Sans KR', sans-serif",
      animation: "fadeIn 0.6s ease-out",
    },
    successIcon: {
      width: "120px",
      height: "120px",
      margin: "0 auto 32px",
      background: "linear-gradient(135deg, #10b981, #059669)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 8px 32px rgba(16, 185, 129, 0.3)",
      animation: "bounceIn 0.8s ease-out 0.2s both",
    },
    title: {
      fontSize: "32px",
      fontWeight: "800",
      background: "linear-gradient(135deg, #EB9666, #E05353)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "16px",
    },
    subtitle: {
      fontSize: "18px",
      color: "#10b981",
      fontWeight: "600",
      marginBottom: "24px",
    },
    description: {
      color: "#6b7280",
      fontSize: "16px",
      lineHeight: "1.6",
      marginBottom: "32px",
    },
    detailCard: {
      background: "#fff8f5",
      border: "1px solid #ffe0d5",
      borderLeft: "4px solid #EB9666",
      borderRadius: "12px",
      padding: "24px",
      marginBottom: "32px",
      textAlign: "left",
    },
    detailTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#E05353",
      marginBottom: "16px",
    },
    detailRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "12px",
      alignItems: "center",
    },
    detailLabel: {
      color: "#6b7280",
      fontSize: "14px",
    },
    detailValue: {
      fontWeight: "700",
      color: "#333",
      fontSize: "14px",
    },
    buttonGroup: {
      display: "flex",
      gap: "16px",
      justifyContent: "center",
      marginBottom: "24px",
    },
    primaryButton: {
      background: "linear-gradient(135deg, #EB9666, #E05353)",
      color: "white",
      border: "none",
      padding: "14px 28px",
      borderRadius: "10px",
      fontSize: "16px",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s",
      boxShadow: "0 4px 12px rgba(235,150,102,0.35)",
    },
    secondaryButton: {
      background: "white",
      color: "#EB9666",
      border: "2px solid #EB9666",
      padding: "12px 28px",
      borderRadius: "10px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s",
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

          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
            70% {
              transform: scale(0.95);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          .primary-button:hover {
            background: linear-gradient(135deg, #E05353, #EB9666) !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(235,150,102,0.4) !important;
          }

          .secondary-button:hover {
            background: #EB9666 !important;
            color: white !important;
            transform: translateY(-2px);
          }
        `}
      </style>
      <div style={styles.successContainer}>
        <div style={styles.successIcon}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 12L11 14L15 10"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 style={styles.title}>결제가 완료되었습니다!</h1>
        <p style={styles.subtitle}>펫케어 서비스 예약이 성공적으로 처리되었어요</p>

        <p style={styles.description}>
          {paymentData?.amount && `${paymentData.amount.toLocaleString()}원이 `}
          안전하게 결제되었습니다.<br />
          예약 확인 메시지가 곧 발송될 예정입니다.
        </p>

        {paymentData && (
          <div style={styles.detailCard}>
            <div style={styles.detailTitle}>📋 결제 상세 정보</div>
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
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>결제일시</span>
              <span style={styles.detailValue}>
                {new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        )}

        <div style={styles.buttonGroup}>
          <button
            onClick={handleGoToBookingComplete}
            style={styles.primaryButton}
            className="primary-button"
          >
            예약 확인하기
          </button>
          <button
            onClick={() => navigate("/home")}
            style={styles.secondaryButton}
            className="secondary-button"
          >
            홈으로 이동
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
