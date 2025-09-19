import React, { useContext, useEffect, useState } from "react";
import BookingContext from "./BookingContext";
import {
  formatDateForAPI,
  getAvailableTimeSlots,
} from "../../services/booking/timeSlotService";

// 달력 컴포넌트
const Calendar = ({ selectedDate, onDateSelect, disabledDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const days = [];

    // 빈 칸 추가
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // 날짜 추가
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
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div style={{ background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button
          onClick={() => navigateMonth(-1)}
          style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer' }}
        >
          ◀
        </button>
        <h4 style={{ margin: 0, fontSize: '18px' }}>
          {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
        </h4>
        <button
          onClick={() => navigateMonth(1)}
          style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer' }}
        >
          ▶
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
        {dayNames.map(day => (
          <div key={day} style={{ textAlign: 'center', padding: '8px', fontSize: '14px', fontWeight: '600', color: '#666' }}>
            {day}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {getDaysInMonth().map((dayData, index) => (
          <div key={index} style={{ aspectRatio: '1', display: 'flex' }}>
            {dayData && (
              <button
                style={{
                  width: '100%',
                  height: '100%',
                  border: `1px solid ${dayData.isSelected ? '#eb9666' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  background: dayData.isSelected ? '#eb9666' : dayData.isPast ? '#f9fafb' : 'white',
                  color: dayData.isSelected ? 'white' : dayData.isPast ? '#9ca3af' : '#111827',
                  cursor: dayData.isAvailable ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: dayData.isToday ? 'bold' : 'normal',
                }}
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

// 시간 슬롯 컴포넌트
const TimeSlots = ({ timeSlots, selectedTimeSlot, onTimeSlotSelect, loading }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        시간대를 불러오는 중...
      </div>
    );
  }

  if (!timeSlots || timeSlots.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        선택한 날짜에 예약 가능한 시간이 없습니다.
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
      {timeSlots.map((slot, index) => (
        <button
          key={index}
          style={{
            padding: '16px 12px',
            border: `2px solid ${selectedTimeSlot?.startTime === slot.startTime ? '#eb9666' : '#e5e7eb'}`,
            borderRadius: '12px',
            background: selectedTimeSlot?.startTime === slot.startTime ? '#fff8f3' : 'white',
            cursor: slot.available ? 'pointer' : 'not-allowed',
            opacity: slot.available ? 1 : 0.5,
            textAlign: 'center',
          }}
          onClick={() => slot.available && onTimeSlotSelect(slot)}
          disabled={!slot.available}
        >
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
            {slot.startTime} - {slot.endTime}
          </div>
          <div style={{ fontSize: '12px', color: slot.available ? '#666' : '#ef4444' }}>
            {slot.available ? '예약가능' : '예약불가'}
          </div>
        </button>
      ))}
    </div>
  );
};

// 반려동물 선택 컴포넌트
const PetSelection = ({ pets, selectedPets, onPetToggle }) => {
  if (!pets || pets.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        등록된 반려동물이 없습니다.
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
      {pets.map((pet) => (
        <div
          key={pet.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            border: `2px solid ${selectedPets.includes(pet.id) ? '#eb9666' : '#e5e7eb'}`,
            borderRadius: '12px',
            background: selectedPets.includes(pet.id) ? '#fff8f3' : 'white',
            cursor: 'pointer',
          }}
          onClick={() => onPetToggle(pet.id)}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
          }}>
            🐕
          </div>
          <div>
            <h5 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{pet.name}</h5>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{pet.breed} • {pet.age}살</p>
          </div>
          {selectedPets.includes(pet.id) && (
            <div style={{
              marginLeft: 'auto',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#10b981',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
            }}>
              ✓
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const DateSelectStep = () => {
  const { state, dispatch } = useContext(BookingContext);
  const [pets] = useState([
    { id: 1, name: "멍멍이", breed: "골든리트리버", age: 3 },
    { id: 2, name: "냥냥이", breed: "페르시안", age: 2 },
  ]); // 임시 데이터

  const loadTimeSlots = async (date) => {
    if (!state.selectedProduct?.id || !date) return;

    try {
      dispatch({ type: "SET_LOADING", field: "timeSlots", value: true });
      const formattedDate = formatDateForAPI(date);
      const timeSlots = await getAvailableTimeSlots(
        state.selectedProduct.id,
        formattedDate
      );
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

  const isNextEnabled = state.selectedDate && state.selectedTimeSlot && state.selectedPets.length > 0;

  return (
    <div style={{ padding: '16px' }}>
      {/* 선택된 상품 정보 */}
      {state.selectedProduct && (
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>{state.selectedProduct.name}</h4>
          <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>{state.selectedProduct.description}</p>
        </div>
      )}

      {/* 날짜 선택 */}
      <div>
        <h4 style={{ margin: '0 0 16px 0' }}>날짜 선택</h4>
        <Calendar
          selectedDate={state.selectedDate}
          onDateSelect={handleDateSelect}
        />
      </div>

      {/* 시간 선택 */}
      {state.selectedDate && (
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 16px 0' }}>시간 선택</h4>
          <TimeSlots
            timeSlots={state.availableTimeSlots}
            selectedTimeSlot={state.selectedTimeSlot}
            onTimeSlotSelect={handleTimeSlotSelect}
            loading={state.loading.timeSlots}
          />
        </div>
      )}

      {/* 반려동물 선택 */}
      <div style={{ background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '80px' }}>
        <h4 style={{ margin: '0 0 16px 0' }}>반려동물 선택</h4>
        <PetSelection
          pets={pets}
          selectedPets={state.selectedPets}
          onPetToggle={handlePetToggle}
        />
      </div>

      {/* 하단 버튼 */}
      <div style={{
        position: 'sticky',
        bottom: '0',
        background: 'white',
        padding: '16px',
        borderTop: '1px solid #e5e7eb',
        marginLeft: '-16px',
        marginRight: '-16px',
        display: 'flex',
        gap: '12px',
      }}>
        <button
          style={{
            flex: '1',
            padding: '16px',
            background: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
          onClick={handlePrev}
        >
          이전
        </button>
        <button
          style={{
            flex: '2',
            padding: '16px',
            background: isNextEnabled ? 'linear-gradient(135deg, #eb9666, #e05353)' : '#e5e7eb',
            color: isNextEnabled ? 'white' : '#9ca3af',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isNextEnabled ? 'pointer' : 'not-allowed',
          }}
          onClick={handleNext}
          disabled={!isNextEnabled}
        >
          다음 단계
        </button>
      </div>
    </div>
  );
};

export default DateSelectStep;