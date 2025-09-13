import React, { useState, useEffect } from "react";
import { FaGift } from "react-icons/fa";
import "./CouponBanner.css";

const CouponBanner = () => {
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const lastClosed = localStorage.getItem("couponClosedAt");

    if (lastClosed) {
      const lastDate = new Date(lastClosed).toDateString();
      const today = new Date().toDateString();
      if (lastDate === today) {
        setIsClosed(true); // 오늘 이미 닫았으면 안 보이게
      }
    }
  }, []);

  const handleClose = () => {
    setIsClosed(true);
    localStorage.setItem("couponClosedAt", new Date().toISOString());
  };

  if (isClosed) return null;

  return (
    <div className="coupon-banner">
      <div className="coupon-text">
        <FaGift style={{ fontSize: "18px" }} />
        첫 가입 시 <strong>10% 할인쿠폰</strong>
      </div>
      <div className="coupon-actions">
        <button
          className="coupon-btn"
          onClick={() => (window.location.href = "/signup")}
        >
          가입하기
        </button>
        <button className="coupon-close" onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default CouponBanner;
