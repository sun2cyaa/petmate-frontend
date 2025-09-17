import React from "react";
import "./Notice.css";

const Notice = () => {
  return (
    <div className="notice-container">
      <h1 className="notice-title">공지사항</h1>
      <div className="notice-list">
        <div className="notice-item">
          <h3>[공지] PetMate 서비스 오픈 안내</h3>
          <p>2025년 9월 1일부터 PetMate 서비스가 정식으로 오픈되었습니다!</p>
        </div>
        <div className="notice-item">
          <h3>[점검] 9월 서버 점검 안내</h3>
          <p>9월 20일 새벽 2시 ~ 4시까지 서버 점검이 예정되어 있습니다.</p>
        </div>
      </div>
    </div>
  );
};

export default Notice;
