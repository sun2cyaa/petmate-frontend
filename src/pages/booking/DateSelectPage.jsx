import React, { useContext } from "react";
import BookingContext from "./BookingContext";

// Step 2: 예약 정보 입력
const DateSelectPage = () => {
  const { state, dispatch } = useContext(BookingContext);

  const pets = [
    { id: 1, name: "멍멍이", image: "🐕", breed: "골든리트리버", age: "3세" },
    { id: 2, name: "야옹이", image: "🐱", breed: "러시안블루", age: "2세" },
    { id: 3, name: "콩이", image: "🐕", breed: "푸들", age: "1세" },
  ];

  const timeSlots = [
    { time: "09:00", available: true, label: "오전 9시" },
    { time: "10:00", available: true, label: "오전 10시" },
    { time: "11:00", available: false, label: "오전 11시" },
    { time: "14:00", available: true, label: "오후 2시" },
    { time: "15:00", available: true, label: "오후 3시" },
    { time: "16:00", available: true, label: "오후 4시" },
  ];

  const getDaysInMonth = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const days = [];

    // 빈 칸 추가
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const today = new Date();
      const isToday = currentDate.toDateString() === today.toDateString();
      const isAvailable = currentDate >= today;
      const isPast = currentDate < today;

      days.push({
        day,
        date: currentDate,
        isToday,
        isAvailable,
        isPast,
        hasSlots: isAvailable ? Math.random() > 0.3 : false,
      });
    }

    return days;
  };

  const days = getDaysInMonth();
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="booking-container">
      {/* 선택된 메뉴 요약 */}
      <div className="summary-card">
        <div className="summary-header">
          <div>
            <h3 className="summary-title">{state.selectedProduct?.name}</h3>
            <p className="summary-description">
              {state.selectedProduct?.description}
            </p>
          </div>
          <div className="summary-price-box">
            <p className="summary-price">
              {state.selectedProduct?.price.toLocaleString()}원
            </p>
            <p className="summary-duration">
              {state.selectedProduct?.duration}
            </p>
          </div>
        </div>
      </div>

      {/* 반려동물 선택 */}
      <div className="section-card">
        <h3 className="section-title">반려동물 선택</h3>
        <div className="pets-grid">
          {pets.map((pet) => (
            <label
              key={pet.id}
              className={`pet-card ${
                state.selectedPets.includes(pet.id) ? "pet-card--selected" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={state.selectedPets.includes(pet.id)}
                onChange={() =>
                  dispatch({ type: "TOGGLE_PET", payload: pet.id })
                }
                className="pet-checkbox"
              />
              <div className="pet-image">{pet.image}</div>
              <div className="pet-info">
                <h4 className="fopet-name">{pet.name}</h4>
                <p className="pet-desc">
                  {pet.breed} · {pet.age}
                </p>
              </div>
              {state.selectedPets.includes(pet.id) && "check"}
            </label>
          ))}
        </div>
      </div>

      {/* 날짜 선택 */}
      <div className="section-card">
        <h3 className="section-title">날짜 선택</h3>

        <div className="calendar">
          <div className="calendar-header">
            <button className="calendar-nav">123</button>
            <h4 className="calendar-month">2025년 9월</h4>
            <button className="calendar-nav">123</button>
          </div>

          <div className="calendar-weekdays">
            {weekDays.map((day) => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-days">
            {days.map((day, index) => (
              <div key={index} className="calendar-cell">
                {day && (
                  <button
                    disabled={!day.isAvailable || !day.hasSlots}
                    onClick={() =>
                      day.isAvailable &&
                      day.hasSlots &&
                      dispatch({ type: "SELECT_DATE", payload: day.date })
                    }
                    className={`calendar-day
                  ${day.isPast ? "day--past" : ""}
                  ${day.hasSlots ? "day--available" : "day--unavailable"}
                  ${
                    state.selectedDate &&
                    state.selectedDate.getDate() === day.day
                      ? "day--selected"
                      : ""
                  }
                  ${day.isToday ? "day--today" : ""}`}
                  >
                    <span>{day.day}</span>
                    <span className="day-label">
                      {day.isPast ? "" : day.hasSlots ? "예약가능" : "마감"}
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 시간 선택 */}
      {state.selectedDate && (
        <div className="section-card">
          <h3 className="section-title">시간 선택</h3>
          <div className="time-grid">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                disabled={!slot.available}
                onClick={() =>
                  dispatch({ type: "SELECT_TIME_SLOT", payload: slot })
                }
                className={`time-slot
              ${!slot.available ? "time-slot--disabled" : ""}
              ${
                state.selectedTimeSlot?.time === slot.time
                  ? "time-slot--selected"
                  : ""
              }`}
              >
                <div className="time-slot-label">{slot.label}</div>
                <div className="time-slot-status">
                  {!slot.available ? "마감" : "예약가능"}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 요청사항 */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <h3 className="font-bold text-lg mb-4">요청사항</h3>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg resize-none"
          rows={4}
          placeholder="특별한 요청사항이 있으시면 자세히 적어주세요"
          value={state.specialRequests}
          onChange={(e) =>
            dispatch({ type: "SET_SPECIAL_REQUESTS", payload: e.target.value })
          }
        />
      </div>

      {/* 하단 고정 버튼 (모달용) */}
      <div className="bottom-bar">
        <div className="bottom-actions">
          <button
            onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}
            className="btn-prev"
          >
            이전
          </button>
          <button
            onClick={() => {
              if (
                state.selectedPets.length > 0 &&
                state.selectedDate &&
                state.selectedTimeSlot
              ) {
                dispatch({ type: "SET_STEP", payload: 3 });
              }
            }}
            disabled={
              !state.selectedPets.length ||
              !state.selectedDate ||
              !state.selectedTimeSlot
            }
            className="btn-pay"
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateSelectPage;
