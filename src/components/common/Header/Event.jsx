import React from "react";
import { Gift, Star, Dog } from "lucide-react"; 
import "./Event.css";

const Event = () => {
  return (
    <div className="event-container">
      <h1 className="event-title">이벤트</h1>

      <div className="event-card">
        <div className="event-icon">
          <Gift size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h3>신규가입 혜택</h3>
          <p>회원가입 시 첫 예약 10% 할인 쿠폰 지급!</p>
        </div>
      </div>
      <br />

      <div className="event-card">
        <div className="event-icon">
          <Star size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h3>리뷰 이벤트</h3>
          <p>리뷰 작성 시 추첨을 통해 사료 증정!</p>
        </div>
      </div>
      <br />

      <div className="event-card">
        <div className="event-icon">
          <Dog size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h3>펫 케어 할인</h3>
          <p>이번 달 예약 고객에게 펫 미용 20% 할인 혜택!</p>
        </div>
      </div>
    </div>
  );
};

export default Event;
