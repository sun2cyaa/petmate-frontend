import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../support/Support.css";

const Inquiry = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "일반 문의",
    subject: "",
    message: "",
    agree: false,
  });

  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "예약 변경/취소는 어떻게 하나요?",
      answer: "마이페이지 > 예약 내역에서 직접 변경 또는 취소할 수 있습니다.",
    },
    {
      question: "결제 환불은 언제 처리되나요?",
      answer: "카드사 기준 영업일 3~5일 이내에 환불됩니다.",
    },
    {
      question: "펫메이트 신고는 어떻게 하나요?",
      answer: "마이페이지 > 이용내역 > 신고하기 버튼을 통해 접수 가능합니다.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.agree) {
      alert("개인정보 수집 및 이용에 동의해야 문의 접수가 가능합니다.");
      return;
    }
    alert("문의가 접수되었습니다. 빠른 시일 내 답변드리겠습니다.");
    setForm({
      name: "",
      email: "",
      category: "일반 문의",
      subject: "",
      message: "",
      agree: false,
    });
  };

  return (
    <div className="support-container">
      <h1>1:1 문의</h1>

      {/* 문의 폼 */}
      <form className="inquiry-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={form.email}
          onChange={handleChange}
          required
        />
        <select name="category" value={form.category} onChange={handleChange}>
          <option>일반 문의</option>
          <option>예약 관련</option>
          <option>결제/환불</option>
          <option>펫메이트 관련</option>
          <option>기타</option>
        </select>
        <input
          type="text"
          name="subject"
          placeholder="제목"
          value={form.subject}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="문의 내용을 입력해주세요"
          rows="8"
          value={form.message}
          onChange={handleChange}
          required
        />
        <label className="agree-box">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
          />
          개인정보 수집 및 이용에 동의합니다.
        </label>
        <button type="submit">문의하기</button>
      </form>

      {/* 자주 하는 문의 유형 (FAQ 아코디언) */}
      <div className="inquiry-faq">
        <h2>자주 하는 문의 유형</h2>
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

export default Inquiry;
