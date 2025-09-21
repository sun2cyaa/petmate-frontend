import React, { useEffect } from "react";
import iconFail from "../../assets/images/payment/icon_fail.png";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentFailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // URL 파라미터에서 orderId 가져와서 localStorage에 실패 상태 저장
    const orderId = searchParams.get("orderId");
    const bookingId = searchParams.get("bookingId");

    if (orderId) {
      localStorage.setItem(`payment_${orderId}`, 'fail');
    }

    // 결제 실패 시 예약을 취소 상태로 변경
    const cancelBookingForPaymentFailed = async () => {
      if (bookingId) {
        try {
          const response = await fetch(`${process.env.REACT_APP_SPRING_API_BASE || "http://localhost:8090"}/api/booking/payment-failed/${bookingId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            console.log(`결제 실패로 인한 예약 취소 완료: bookingId=${bookingId}`);
          } else {
            console.error('예약 취소 실패:', response.statusText);
          }
        } catch (error) {
          console.error('예약 취소 요청 중 오류:', error);
        }
      }
    };

    cancelBookingForPaymentFailed();
  }, [searchParams]);

  const handleBackToBooking = () => {
    // 창 닫기 (부모 창으로 돌아가기)
    window.close();
  };

  const styles = {
    failContainer: {
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
    failIcon: {
      width: "120px",
      height: "120px",
      margin: "0 auto 32px",
      background: "linear-gradient(135deg, #ef4444, #dc2626)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 8px 32px rgba(239, 68, 68, 0.3)",
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
      color: "#ef4444",
      fontWeight: "600",
      marginBottom: "24px",
    },
    description: {
      color: "#6b7280",
      fontSize: "16px",
      lineHeight: "1.6",
      marginBottom: "32px",
    },
    infoCard: {
      background: "#fef2f2",
      border: "1px solid #fecaca",
      borderLeft: "4px solid #ef4444",
      borderRadius: "12px",
      padding: "24px",
      marginBottom: "32px",
      textAlign: "left",
    },
    infoTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#dc2626",
      marginBottom: "12px",
    },
    infoText: {
      fontSize: "14px",
      color: "#6b7280",
      lineHeight: "1.5",
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
      color: "#6b7280",
      border: "2px solid #d1d5db",
      padding: "12px 28px",
      borderRadius: "10px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s",
    },
    linkButton: {
      color: "#EB9666",
      textDecoration: "none",
      fontSize: "16px",
      fontWeight: "600",
      transition: "all 0.3s",
    },
  };

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
            background: #f3f4f6 !important;
            border-color: #9ca3af !important;
            color: #374151 !important;
            transform: translateY(-2px);
          }

          .link-button:hover {
            color: #E05353 !important;
            text-decoration: underline !important;
          }
        `}
      </style>
      <div style={styles.failContainer}>
        <div style={styles.failIcon}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 style={styles.title}>결제에 실패했습니다</h1>
        <p style={styles.subtitle}>결제 처리 중 문제가 발생했어요</p>

        <p style={styles.description}>
          결제가 정상적으로 처리되지 않았습니다.<br />
          다시 시도하거나 다른 결제 수단을 선택해주세요.
        </p>

        <div style={styles.infoCard}>
          <div style={styles.infoTitle}>💡 결제 실패 원인</div>
          <div style={styles.infoText}>
            • 카드 한도 초과 또는 잔액 부족<br />
            • 네트워크 연결 문제<br />
            • 카드사 또는 은행 시스템 점검<br />
            • 잘못된 카드 정보 입력
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button
            onClick={() => window.history.back()}
            style={styles.primaryButton}
            className="primary-button"
          >
            결제 다시 시도
          </button>
          <button
            onClick={handleBackToBooking}
            style={styles.secondaryButton}
            className="secondary-button"
          >
            예약 다시 하기
          </button>
        </div>

        <a href="/home" style={styles.linkButton} className="link-button">
          홈으로 돌아가기
        </a>
      </div>
    </>
  );
};

export default PaymentFailPage;
