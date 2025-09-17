import React from "react";
import "../support/Support.css";

const CustomerCenter = () => {
  return (
    <div className="support-container">
      <h1>고객센터</h1>
      <p>Petmate 고객센터에 오신 것을 환영합니다.</p>

      <div className="customer-info">
        <h3>연락처</h3>
        <p>☎ 전화번호: 1577-1013 (24시간 연중무휴)</p>
        <p>✉ 이메일: support@petmate.com</p>
        <p>🏢 주소: 경기도 광명시 양지로 17</p>
      </div>

      <div className="customer-info">
        <h3>운영 시간</h3>
        <p>평일: 24시간 연중무휴</p>
        <p>주말/공휴일: 온라인 문의만 가능</p>
      </div>

      <div className="customer-info">
        <h3>자주 이용되는 서비스</h3>
        <ul>
          <li>예약 취소/변경 안내</li>
          <li>결제 및 환불 처리</li>
          <li>펫메이트 평가 및 신고</li>
          <li>서비스 개선 제안</li>
        </ul>
      </div>

      <p className="notice">
        ※ 문의량이 많을 경우 답변이 지연될 수 있습니다. 긴급한 사안은 전화로
        문의해주시기 바랍니다.
      </p>
    </div>
  );
};

export default CustomerCenter;
