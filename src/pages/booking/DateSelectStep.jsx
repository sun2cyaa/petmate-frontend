import React, { useContext, useEffect, useState } from "react";
import BookingContext from "./BookingContext";
import {
  formatDateForAPI,
  getAvailableTimeSlots,
} from "../../services/booking/timeSlotService";
import { FaDog, FaCat } from "react-icons/fa";   
import "./DateSelectStep.css";

// 달력 컴포넌트
const Calendar = ({ selectedDate, onDateSelect, disabledDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today;
      const isSelected =
        selectedDate && date.toDateString() === selectedDate.toDateString();
      const isDisabled = disabledDates.some(
        (disabledDate) => date.toDateString() === disabledDate.toDateString()
      );

      days.push({
        day,
        date,
        isToday,
        isPast,
        isSelected,
        isDisabled,
        isAvailable: !isPast && !isDisabled,
      });
    }
    return days;
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const monthNames = [
    "1월","2월","3월","4월","5월","6월",
    "7월","8월","9월","10월","11월","12월"
  ];
  const dayNames = ["일","월","화","수","목","금","토"];

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => navigateMonth(-1)}>◀</button>
        <h4>
          {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
        </h4>
        <button onClick={() => navigateMonth(1)}>▶</button>
      </div>

      <div className="calendar-daynames">
        {dayNames.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="calendar-days">
        {getDaysInMonth().map((dayData, index) => (
          <div key={index} className="calendar-day">
            {dayData && (
              <button
                className={`calendar-cell 
                  ${dayData.isSelected ? "selected" : ""} 
                  ${dayData.isPast ? "past" : ""} 
                  ${dayData.isToday ? "today" : ""}`}
                onClick={() => dayData.isAvailable && onDateSelect(dayData.date)}
                disabled={!dayData.isAvailable}
              >
                {dayData.day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// 시간 슬롯
const TimeSlots = ({ timeSlots, selectedTimeSlot, onTimeSlotSelect, loading }) => {
  if (loading) return <div className="loading-text">시간대를 불러오는 중...</div>;
  if (!timeSlots || timeSlots.length === 0)
    return <div className="empty-text">선택한 날짜에 예약 가능한 시간이 없습니다.</div>;

  return (
    <div className="timeslots">
      {timeSlots.map((slot, index) => (
        <button
          key={index}
          className={`timeslot-btn ${
            selectedTimeSlot?.startTime === slot.startTime ? "selected" : ""
          }`}
          onClick={() => slot.available && onTimeSlotSelect(slot)}
          disabled={!slot.available}
        >
          <div className="timeslot-time">
            {slot.startTime} - {slot.endTime}
          </div>
          <div className={`timeslot-status ${slot.available ? "available" : "unavailable"}`}>
            {slot.available ? "예약가능" : "예약불가"}
          </div>
        </button>
      ))}
    </div>
  );
};

// 반려동물 선택
const PetSelection = ({ pets, selectedPets, onPetToggle }) => {
  if (!pets || pets.length === 0)
    return <div className="empty-text">등록된 반려동물이 없습니다.</div>;

  return (
    <div className="pet-list">
      {pets.map((pet) => {
        
        const Icon = pet.breed.includes("냥") || pet.name.includes("냥") ? FaCat : FaDog;
        return (
          <div
            key={pet.id}
            className={`pet-card ${selectedPets.includes(pet.id) ? "selected" : ""}`}
            onClick={() => onPetToggle(pet.id)}
          >
            <div className="pet-avatar">
              <Icon />
            </div>
            <div className="pet-info">
              <h5>{pet.name}</h5>
              <p>{pet.breed} • {pet.age}살</p>
            </div>
            {selectedPets.includes(pet.id) && <div className="pet-check">✓</div>}
          </div>
        );
      })}
    </div>
  );
};

const DateSelectStep = () => {
  const { state, dispatch } = useContext(BookingContext);
  const [pets] = useState([
    { id: 1, name: "멍멍이", breed: "골든리트리버", age: 3 },
    { id: 2, name: "냥냥이", breed: "페르시안", age: 2 },
  ]);

  const loadTimeSlots = async (date) => {
    if (!state.selectedProduct?.id || !date) return;
    try {
      dispatch({ type: "SET_LOADING", field: "timeSlots", value: true });
      const formattedDate = formatDateForAPI(date);
      const timeSlots = await getAvailableTimeSlots(state.selectedProduct.id, formattedDate);
      dispatch({ type: "SET_AVAILABLE_TIME_SLOTS", payload: timeSlots || [] });
    } catch (error) {
      console.error("시간 슬롯 로드 실패:", error);
      dispatch({ type: "SET_AVAILABLE_TIME_SLOTS", payload: [] });
    } finally {
      dispatch({ type: "SET_LOADING", field: "timeSlots", value: false });
    }
  };

  useEffect(() => {
    if (state.selectedDate && state.selectedProduct) {
      loadTimeSlots(state.selectedDate);
    }
  }, [state.selectedDate, state.selectedProduct?.id]);

  const handleDateSelect = (date) => {
    dispatch({ type: "SELECT_DATE", payload: date });
    dispatch({ type: "SELECT_TIME_SLOT", payload: null });
  };

  const handleTimeSlotSelect = (timeSlot) => {
    dispatch({ type: "SELECT_TIME_SLOT", payload: timeSlot });
  };

  const handlePetToggle = (petId) => {
    dispatch({ type: "TOGGLE_PET", payload: petId });
  };

  const handleNext = () => {
    if (state.selectedDate && state.selectedTimeSlot && state.selectedPets.length > 0) {
      dispatch({ type: "SET_STEP", payload: 3 });
    }
  };

  const handlePrev = () => {
    dispatch({ type: "SET_STEP", payload: 1 });
  };

  const isNextEnabled =
    state.selectedDate && state.selectedTimeSlot && state.selectedPets.length > 0;

  return (
    <div className="date-select_wrap">
      {state.selectedProduct && (
        <div className="selected-product">
          <h4>{state.selectedProduct.name}</h4>
          <p>{state.selectedProduct.description}</p>
        </div>
      )}

      <div className="section">
        <h4>날짜 선택</h4>
        <Calendar selectedDate={state.selectedDate} onDateSelect={handleDateSelect} />
      </div>

      {state.selectedDate && (
        <div className="section">
          <h4>시간 선택</h4>
          <TimeSlots
            timeSlots={state.availableTimeSlots}
            selectedTimeSlot={state.selectedTimeSlot}
            onTimeSlotSelect={handleTimeSlotSelect}
            loading={state.loading.timeSlots}
          />
        </div>
      )}

      <div className="section">
        <h4>반려동물 선택</h4>
        <PetSelection pets={pets} selectedPets={state.selectedPets} onPetToggle={handlePetToggle} />
      </div>

      <div className="footer-btns">
        <button className="btn-prev" onClick={handlePrev}>이전</button>
        <button className="btn-next" onClick={handleNext} disabled={!isNextEnabled}>
          다음 단계
        </button>
      </div>
    </div>
  );
};

export default DateSelectStep;
