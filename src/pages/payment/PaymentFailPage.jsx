import React from "react";
import iconFail from "../../assets/images/payment/icon_fail.png";
import { useNavigate } from "react-router-dom";

const PaymentFailPage = () => {
  const navigate = useNavigate();

  const handleBackToBooking = () => {
    navigate("/booking");
  };

  const styles = {
    failContainer: {
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
    failIcon: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "0 auto 20px",
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
    btn: {
      backgroundColor: "#0081cc",
      color: "white",
      border: "none",
      padding: "12px 24px",
      borderRadius: "6px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s, transform 0.2s",
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
          
          .btn:hover {
            background-color: #0070b3 !important;
          }
          
          .btn:active {
            transform: scale(0.98) !important;
          }
        `}
      </style>
      <div style={styles.failContainer}>
        <div style={styles.failIcon}>
          <div style={{ position: "relative" }}>
            <img src={iconFail} alt="Fail" />
            <svg
              width="80"
              height="80"
              viewBox="0 0 129 128"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                scale: "0.7",
                position: "absolute",
                right: "-40px",
                top: "-30px",
              }}
            >
              <circle cx="64.5" cy="64" r="64" fill="#FF3651" />
              <path
                d="M41.8699 41.2969L87.1247 86.5517"
                stroke="white"
                strokeWidth="13.3333"
              />
              <path
                d="M87.1301 41.2969L41.8753 86.5517"
                stroke="white"
                strokeWidth="13.3333"
              />
            </svg>
          </div>
        </div>
        <h1 style={styles.title}>결제에 실패했습니다</h1>
        <a href="/payment" style={styles.link}>
          결제 다시 시도
        </a>
        <button
          onClick={handleBackToBooking}
          style={{ ...styles.btn, backgroundColor: "#666" }}
          className="btn"
        >
          예약 다시 하기
        </button>
      </div>
    </>
  );
};

export default PaymentFailPage;
