import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../support/Support.css";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "예약 취소는 어떻게 하나요?",
      answer:
        "마이페이지 > 예약 내역에서 취소 신청을 할 수 있으며, 결제 방식에 따라 환불 절차가 다를 수 있습니다.",
    },
    {
      question: "결제는 어떤 방식이 가능한가요?",
      answer:
        "신용카드, 체크카드, 카카오페이, 네이버페이, 페이코 등의 간편 결제를 지원합니다.",
    },
    {
      question: "펫메이트는 어떤 기준으로 선별되나요?",
      answer:
        "펫메이트는 신원 인증, 경력 확인, 교육 과정을 거쳐 등록되며, 후기와 평점 시스템으로 신뢰도를 관리합니다.",
    },
    {
      question: "반려동물이 안전하게 관리되나요?",
      answer:
        "모든 펫메이트는 안전 수칙을 준수하며, 서비스 제공 전후 체크리스트를 통해 반려동물의 상태를 확인합니다.",
    },
    {
      question: "서비스 이용 가능 지역은 어디인가요?",
      answer: "현재는 수도권을 중심으로 운영 중이며, 점차 전국으로 확대할 예정입니다.",
    },
    {
      question: "쿠폰이나 포인트는 어떻게 사용하나요?",
      answer:
        "결제 단계에서 보유한 쿠폰이나 포인트를 선택하여 사용할 수 있으며, 일부 서비스는 적용이 제한될 수 있습니다.",
    },
    {
      question: "예약 시간을 변경할 수 있나요?",
      answer:
        "예약 확정 전에는 자유롭게 변경 가능하며, 확정 후에는 펫메이트의 동의가 필요합니다.",
    },
    {
      question: "특수한 건강 상태의 반려동물도 맡길 수 있나요?",
      answer:
        "예약 시 건강 상태 및 주의사항을 반드시 입력해야 하며, 펫메이트와 사전 협의를 거쳐야 합니다.",
    },
    {
      question: "회원 탈퇴는 어떻게 하나요?",
      answer:
        "마이페이지 > 회원 정보 관리에서 탈퇴 신청이 가능하며, 탈퇴 즉시 모든 개인정보는 파기됩니다.",
    },
    {
      question: "고객센터 운영 시간은 어떻게 되나요?",
      answer:
        "전화 고객센터는 24시간 운영되며, 온라인 문의는 평일 오전 9시~오후 6시 내 답변됩니다.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="support-container">
      <h1>자주 묻는 질문 (FAQ)</h1>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className="faq-item"
            layout
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <h3>{faq.question}</h3>
              <span>{activeIndex === index ? "▲" : "▼"}</span>
            </div>
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  className="faq-answer"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
