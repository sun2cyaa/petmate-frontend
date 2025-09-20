import React, { useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { ChevronDown, Calendar, Clock, PawPrint, Package, CreditCard } from 'lucide-react';
import "swiper/css";
import "swiper/css/pagination";

import "./FeedbackFlowSection.css";

/* ---------------- 예약 절차 컴포넌트 ---------------- */
const BookingFlowSteps = () => {
  const steps = [
    { id: 1, title: '메이트 찾기' },
    { id: 2, title: '날짜와 시간 선택' },
    { id: 3, title: '안심 결제 & 확인' },
    { id: 4, title: '예약 완료!' }
  ];

  const renderStepContent = (stepId) => {
    switch (stepId) {
      case 1:
        return (
          <div className="feedback-step-content">
            <div className="feedback-dropdown-box">
              <span>산책</span>
              <ChevronDown size={16} color="#ccc" />
            </div>
            <div className="feedback-btn-row">
              <div className="feedback-next-btn">다음</div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="feedback-step-content">
            <div className="feedback-date-input-box">
              <span>연도-월-일</span>
              <Calendar size={16} color="#ed9666" />
            </div>
            <div className="feedback-time-input-box">
              <span>-- : --</span>
              <Clock size={16} color="#eb9666" />
            </div>
            <div className="feedback-btn-row">
              <div className="feedback-prev-btn">이전</div>
              <div className="feedback-next-btn">다음</div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="feedback-step-content">
            <div className="feedback-info-box">
              <PawPrint size={16} color="#eb9666" />
              <span>반려인 정보</span>
            </div>
            <div className="feedback-info-box">
              <Package size={16} color="#eb9666" />
              <span>서비스 상품 정보</span>
            </div>
            <div className="feedback-info-box">
              <CreditCard size={16} color="#eb9666" />
              <span>결제정보</span>
            </div>
            <div className="feedback-btn-row">
              <div className="feedback-prev-btn">이전</div>
              <div className="feedback-payment-btn">결제하기</div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="feedback-step-content">
            <div className="feedback-complete-msg-box">
              <br /><br />
              예약이 정상적으로<br />완료 되었습니다.
            </div>
            <div className="feedback-btn-row">
              <div className="feedback-prev-btn">이전</div>
              <div className="feedback-next-btn">완료</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="feedback-flow-steps-container">
      <div className="feedback-steps-wrapper">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="feedback-step-card">
              <div className="feedback-step-header">
                <div className="feedback-step-label">
                  Step {step.id}. {step.title}
                </div>
              </div>
              {renderStepContent(step.id)}
            </div>
            {index < steps.length - 1 && <div className="feedback-arrow">→</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/* ---------------- 메인 섹션 ---------------- */
function FeedbackFlowSection() {
  const [activeHearts, setActiveHearts] = useState({});
  const reviews = [
    { id: 1, name: '김민중', 
             pet: '골든 리트리버', 
             text: '초코를 돌봐주셔서 다시 한번 감사합니다. 초코가 정말 즐거운 시간을 보냈어요.', 
             profileImg: "https://picsum.photos/200?random=1" },

    { id: 2, name: '독고건', 
             pet: '말티즈', 
             text: '우리집 강아지가 너무 좋아해서 또 방문할게요!', 
             profileImg: "https://picsum.photos/200?random=2" },

    { id: 3, name: '김형선', 
             pet: '포메 + 치와와', 
             text: '쿠키를 다시 한번 돌봐주셔서 감사합니다.', 
             profileImg: "https://picsum.photos/200?random=3" },

    { id: 4, name: '김광현', 
             pet: '시츄', 
             text: '형욱님 정말 최고였어요! 집과 마당이 정말 아름다웠고, 우리 강아지는 형욱님이랑 함께 시간보내는걸 정말 즐거워 하더라고요.', 
             profileImg: "https://picsum.photos/200?random=4" },

    { id: 5, name: '박선희', 
             pet: '푸들', 
             text: '돌봄 서비스가 너무 체계적이라 안심이 됐습니다. 덕분에 출장도 걱정 없이 다녀왔어요.', 
             profileImg: "https://picsum.photos/200?random=5" },

    { id: 6, name: '김성택', 
             pet: '비숑프리제', 
             text: '처음 맡겼는데 사진도 계속 보내주셔서 마음이 편했어요. 다음에도 이용할게요!', 
             profileImg: "https://picsum.photos/200?random=6" },

    { id: 7, name: '선태영', 
             pet: '시바견', 
             text: '산책도 충분히 해주시고, 강아지가 에너지를 잘 발산하고 와서 너무 만족합니다.', 
             profileImg: "https://picsum.photos/200?random=7" },

    { id: 8, name: '김도훈', 
             pet: '믹스견', 
             text: '사교성이 부족한 아이인데도 잘 케어해주셔서 점점 나아지는 것 같아요. 감사합니다!', 
             profileImg: "https://picsum.photos/200?random=8" },

    { id: 9, name: '김동현', 
             pet: '웰시코기', 
             text: '짧은 기간이었지만 너무 친절하게 돌봐주셔서 고마워요. 강아지도 집에 와서 계속 행복해 보이네요.', 
             profileImg: "https://picsum.photos/200?random=9" },

    { id: 10, name: '홍자영', 
             pet: '스피츠', 
             text: '예약부터 픽업까지 과정이 깔끔했어요. 서비스가 정말 믿음직스럽습니다.', 
             profileImg: "https://picsum.photos/200?random=10" }
  ];

  const toggleHeart = (id) => {
    setActiveHearts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="feedback-flow-container" className="feedback-flow-section">

      <div className="feedback-header">
        <h2 className="feedback-title">Feedback & Flow</h2>
        <p className="feedback-subtitle">이용 후기 및 예약 절차</p>
      </div>

      <div className="feedback-reviews">
        <h3 className="feedback-reviews-highlight">"우리 아이도 여기서 행복했어요"</h3>
        <p className="feedback-reviews-sub">"함께한 보호자들의 진솔한 이야기"</p>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={4}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
          grabCursor
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="feedback-review-card">
                <div
                  className={`feedback-heart-icon ${activeHearts[review.id] ? 'active' : ''}`}
                  onClick={() => toggleHeart(review.id)}
                >
                  {activeHearts[review.id] ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ff4d6d" width="24" height="24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 
                      5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 
                      4.5 2.09C13.09 3.81 14.76 3 16.5 
                      3 19.58 3 22 5.42 22 8.5c0 
                      3.78-3.4 6.86-8.55 
                      11.54L12 21.35z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                      <path d="M20.8 4.6c-1.8-1.8-4.6-1.8-6.4 
                      0l-1.4 1.4-1.4-1.4c-1.8-1.8-4.6-1.8-6.4 
                      0s-1.8 4.6 0 6.4l7.8 7.8 7.8-7.8c1.8-1.8 
                      1.8-4.6 0-6.4z"/>
                    </svg>
                  )}
                </div>
                <div className="feedback-review-header">
                  <div className="feedback-profile-image">
                    {review.profileImg ? (
                      <img src={review.profileImg} alt={review.name} />
                    ) : (
                      review.name.charAt(0)
                    )}
                  </div>
                  <div className="feedback-profile-info">
                    <h3>{review.name}</h3>
                    <p>{review.pet}</p>
                  </div>
                </div>
                <p className="feedback-review-text">{review.text}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="feedback-flow">
        <h3 className="feedback-flow-title">"쉽고 빠른 예약 절차"</h3>
        <BookingFlowSteps />
      </div>
    </section>
  );
}

export default FeedbackFlowSection;
