import React from "react";
import iconFail from "../../assets/images/payment/icon_fail.png";

const PaymentSuccess = () => {
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
        <h1 style={styles.title}>결제를 완료했어요</h1>
        <p style={styles.description}>
          실제 결제 연동시 결제 승인 API 요청을 보내주세요. <br />
          (샌드박스 환경에서는 실제 결제가 진행되지않습니다.)
        </p>
        <a href="/" style={styles.link}>
          홈으로 돌아가기
        </a>
      </div>
    </>
  );
};

export default PaymentSuccess;
