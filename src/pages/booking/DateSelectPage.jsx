import React, { useState } from "react";
import { useBooking } from "../booking/BookingContext";
import "../booking/BookingPage.css";

const DateSelectPage = () => {
  const { state, dispatch, nextStep, prevStep } = useBooking();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPets, setSelectedPets] = useState([]);
  const [request, setRequest] = useState("");

  const handleNext = () => {
    if (selectedDate && selectedTime && selectedPets.length > 0) {
      dispatch({ type: "SELECT_DATE", payload: selectedDate });
      dispatch({ type: "SELECT_TIME", payload: selectedTime });
      dispatch({ type: "SELECT_PETS", payload: selectedPets });
      dispatch({ type: "SET_REQUEST", payload: request });
      nextStep();
    } else {
      alert("모든 정보를 입력해주세요.");
    }
  };

  return (
    <div className="reservationPage-wrap">
      {/* 선택된 메뉴 요약 */}
      <div className="reservationSummary-wrap">
        <div className="reservationSummary-content">
          <div className="reservationSummary-info">
            <h3 className="reservationSummary-title">
              {state.selectedProduct?.name}
            </h3>
            <p className="reservationSummary-subtitle">
              {state.selectedProduct?.description}
            </p>
          </div>
          <div className="reservationSummary-price">
            <p className="reservationSummary-amount">
              {state.selectedProduct?.price.toLocaleString()}원
            </p>
          </div>
        </div>
      </div>

      {/* 날짜 선택 */}
      <div className="dateSelect-wrap">
        <h3 className="dateSelect-title">날짜 선택</h3>
        <input
          type="date"
          value={selectedDate || ""}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="dateSelect-input"
        />
      </div>

      {/* 시간 선택 */}
      <div className="timeSelect-wrap">
        <h3 className="timeSelect-title">시간 선택</h3>
        <div className="timeSelect-list">
          {["09:00", "10:00", "11:00", "14:00", "15:00"].map((time) => (
            <button
              key={time}
              className={`timeSelect-btn ${
                selectedTime === time ? "selected" : ""
              }`}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* 요청사항 */}
      <div className="request-wrap">
        <h3 className="request-title">요청사항</h3>
        <textarea
          className="request-textarea"
          placeholder="특별한 요청사항이 있으시면 자세히 적어주세요"
          value={request}
          onChange={(e) => setRequest(e.target.value)}
        />
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixedBottom-wrap">
        <button
          className="fixedBottom-btn fixedBottom-btn--prev"
          onClick={prevStep}
        >
          이전
        </button>
        <button
          className="fixedBottom-btn fixedBottom-btn--pay"
          onClick={handleNext}
        >
          결제하기
        </button>
      </div>
    </div>
  );
};

export default DateSelectPage;
